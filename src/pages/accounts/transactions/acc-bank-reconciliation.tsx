import { useEffect, useMemo, useRef, useState } from "react";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import moment from "moment";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import { LedgerType } from "../../../enums/ledger-types";
import ArrayStore from "devextreme/data/array_store";

interface FormState {
  showReconciled: boolean;
  selectedBankId: number | null;
}
interface LoadingState {
  setAllDate: boolean;
  exportToExcel: boolean;
  show: boolean;
  save: boolean;
  changeToPending: boolean;
}

const api = new APIClient();
const BankReconciliation = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const { getFormattedValue } = useNumberFormat();
  const [data, setData] = useState<any>();
  const [key, setKey] = useState<number>(100000);
  const [prevData, setPrevData] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [formState, setFormState] = useState<FormState>({ showReconciled: false, selectedBankId: -2, });
  const dateChangeStateRef = useRef<"today" | "cheque">("today");
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingState>({
    setAllDate: false,
    exportToExcel: false,
    show: false,
    save: false,
    changeToPending: false,
  });

  const { t } = useTranslation("transaction");
  const dataGridRef = useRef<any>(null);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const goToPreviousPage = () => { window.history.back(); };
  const handleReconciledChange = (checked: boolean) => { setFormState((prev) => ({ ...prev, showReconciled: checked })); };
  const handleBankSelection = (value: number | null) => { setFormState((prev) => ({ ...prev, selectedBankId: value })); };
  const handleBankDateTypeChange = (type: "today" | "cheque") => {
    // Update the ref value without triggering re-render
    dateChangeStateRef.current = type;
    
    // Force just the radio buttons to update without re-rendering the whole component
    // by using a minimal state update
    setReload(prev => !prev); // This is just to update the radio button UI
  };

  useEffect(() => {
    handleShow();
  }, [key]);
 

  const handleSetAllDate = async () => {
    setLoading((prev) => ({ ...prev, setAllDate: true }));

    try {
      const gridInstance = dataGridRef.current?.instance();
      if (!gridInstance) return;
      const dataSourceItems = gridInstance.getDataSource().items();
      // Combine existing selectedKeys with items having selected == true
      const selectedIdsFromData = dataSourceItems
        .filter((item: any) => item.selected === true)
        .map((item: any) => item.id);
      const combinedSelectedKeys = Array.from(
        new Set([...(selectedKeys || []), ...selectedIdsFromData])
      );

      if (combinedSelectedKeys.length === 0) {
        ERPAlert.show({
          icon: "warning",
          text: t("no_rows_selected"),
          title: "",
        });
        return;
      }

      const newDate = dateChangeStateRef.current === "today"
  ? moment().local().format("DD/MM/YYYY")
  : null;

      combinedSelectedKeys.forEach((selectedId: any) => {
        const rowIndex = dataSourceItems.findIndex((item: any) => item.id === selectedId);
        if (rowIndex !== -1) {
          const chequeDate = dataSourceItems[rowIndex].chequeDate;
          gridInstance.cellValue(
            rowIndex,
            "bankDate",
            newDate || chequeDate
          );
        }
      });

      await gridInstance.saveEditData();
      ERPAlert.show({
        icon: "success",
        text: t("dates_updated_successfully"),
        title: t("success"),
      });
    } catch (error) {
      console.error("Error updating dates:", error);
    } finally {
      setLoading((prev) => ({ ...prev, setAllDate: false }));
    }
  };

  const handleShow = async () => {
    setLoading((prev) => ({ ...prev, show: true }));
    try {
      const _data = await api.getAsync(
        Urls.bankReconciliation,
        `LedgerID=${formState.selectedBankId ?? 0}&IsReconciled=${formState.showReconciled
        }`
      );
      const rows = _data.map((row: any, index: number) => ({
        ...row,
        id: index + 1,
        selected: false,
        clicked: false,
        initialStatus: row.checkStatus,
      }));
      console.log("1234");
      setData({
        store: new ArrayStore({
          data: rows,
          key: "id",
        }),
      });
      setPrevData(JSON.parse(JSON.stringify(rows)));
    } finally {
      setLoading((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = async () => {
    setLoading((prev) => ({ ...prev, save: true }));
    try {
      const gridData = dataGridRef.current?.instance().getDataSource().items() || [];
      // Step 1: Items with bankDate changes (for update)
      debugger;
      const forUpdate = gridData
        .filter((item: any) => {
          const prevItem = prevData.find(
            (p: any) => p.accTransactionDetailID === item.accTransactionDetailID
          );
          return prevItem && prevItem.bankDate !== item.bankDate;
        })
        .map((item: any) => ({
          accTransactionDetailID: item.accTransactionDetailID,
          ledgerID: formState.selectedBankId,
          bankDate: item.bankDate
            ? moment(item.bankDate, "YYYY/MM/DD").local().format("YYYY-MM-DD")
            : null,
        }));
      if (forUpdate.length === 0) {
        ERPAlert.show({
          icon: "info",
          text: t("no_changes_detected"),
          title: "",
        });
        return;
      }

      const res = await api.postAsync(`${Urls.bankReconciliation}ForUpdate`, forUpdate);
      handleResponse(res, () => {
        ERPAlert.show({
          icon: "success",
          text: t("changes_saved_successfully"),
          title: t("success"),
        });
        handleShow();
      });
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };
  const handleChangeToPending = async () => {
    setLoading((prev) => ({ ...prev, changeToPending: true }));
    try {
      const dataSource = dataGridRef.current?.instance().getDataSource();
    // Get all data from the store instead of using dataSource.load()
    const store = dataSource.store();
    const gridData = await store.load();
      debugger;
      const changeToPending = gridData
        .filter((item: any) => item.clicked === true)
        .map((item: any) => ({
          accTransactionDetailID: item.accTransactionDetailID,
          chequeDate: item.bankDate
            ? moment(item.bankDate, "YYYY/MM/DD").local().format("YYYY-MM-DD")
            : null,
        }));

      const res = await api.postAsync(`${Urls.bankReconciliation}SetToPending`, changeToPending);
      handleResponse(res, () => {
        ERPAlert.show({
          icon: "success",
          text: t("changes_saved_successfully"),
          title: t("success"),
        });
        handleShow();
      });
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, changeToPending: false }));
    }
  };
 
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "selected",
        caption: "",
        dataType: "boolean",
        allowEditing: true,
        width: 100,
        visible: true,
      },
      // {
      //   dataField: "accTransactionDetailID",
      //   caption: t("acc_transaction_detail_id"),
      //   dataType: "boolean",
      //   allowSorting: true,
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      //   visible: false
      // },
      {
        dataField: "id",
        caption: t("slNo"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowEditing: true,
        allowFiltering: true,
        width: 30,
        visible: true,
        cellRender: (cellInfo: any) => (
          <span>{cellInfo.data.isSummary == true ? "" : cellInfo.data.id}</span>
        ),
      },
      {
        dataField: "transactionDate",
        caption: t("date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd/MMM/yyyy",
      },
      {
        dataField: "voucherNumber",
        caption: t("v_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherType",
        caption: t("v_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "particulars",
        caption: t("particulars"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (cellInfo: any) => (
          <span
            className={`${cellInfo.data.isSummary == true ? "text-red font-bold" : ""
              }`}
          >
            {cellInfo.data.particulars}
          </span>
        ),
      },
      {
        dataField: "bankDate",
        caption: t("bank_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        allowEditing: true,
        format: "dd/MM/yyyy",
      },
      {
        dataField: "debit",
        caption: t("debit"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (cellInfo: any) => (
          <span
            className={`${cellInfo.data.isSummary == true
              ? "text-red font-bold text-right"
              : "text-right"
              }`}
          >
            {cellInfo.data.isSummary == true
              ? getFormattedValue(cellInfo.data.debit)
              : getFormattedValue(cellInfo.data.debit, false, 4)}
          </span>
        ),
      },
      {
        dataField: "credit",
        caption: t("credit"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (cellInfo: any) => (
          <span
            className={`${cellInfo.data.isSummary == true
              ? "text-red font-bold text-right"
              : "text-right"
              }`}
          >
            {cellInfo.data.isSummary == true
              ? getFormattedValue(cellInfo.data.credit)
              : getFormattedValue(cellInfo.data.credit, false, 4)}
          </span>
        ),
      },
      {
        dataField: "narration",
        caption: t("narration"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherPrefix",
        caption: t("v_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "referenceNumber",
        caption: t("ref_num"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "referenceDate",
        caption: t("refer_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd/MMM/yyyy",
      },
      {
        dataField: "chequeNumber",
        caption: t("cheque_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "checkStatus",
        caption: t("status"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "chequeDate",
        caption: t("cheque_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd/MMM/yyyy",
      },
      // {
      //   dataField: "",
      //   caption: t("change_to_pending"),
      //   dataType: "string",
      //   allowSorting: false,
      //   allowSearch: false,
      //   allowFiltering: false,
      //   width: 100,
      //   cellRender: (cellInfo: any) => (
      //     !cellInfo.data.isSummary && cellInfo.data.checkStatus != "p" && cellInfo.data.checkStatus != "P" ?
      //       (
      //         <a onClick={() => handleSetPending(cellInfo, data)} title={t("set_pending")} className="text-blue hover:text-blue font-medium cursor-pointer transition duration-200">
      //           {t("set_pending")}
      //         </a>
      //       ) : null
      //   ),
      // },
      // {
      //   dataField:"accTransactionDetailID" ,
      //   type: "buttons",
      //   caption: t("change_to_pending"),
      //   width: 120,
      //   buttons: [
      //     {
      //       icon: "check",
      //       hint: t("set_pending"),
      //       visible: ({ row }: any) => !row.data.isSummary && !["p", "P"].includes(row.data.checkStatus),
      //       onClick: ({ row, component }: any) => {
      //         component.cellValue(row.rowIndex, "checkStatus", "P");
      //         component.saveEditData();
      //       },
      //     },
      //   ],
      //   allowSorting: false,
      //   allowFiltering: false,
      //   visible:true
      // }
      // {
      //   dataField: "clicked",
      //   caption: "",
      //   dataType: "boolean",
      //   allowEditing: true,
      //   width: 100,
      //   visible: true,
      // },

      {
        dataField: "clicked",
        caption: "",
        dataType: "string",
        allowEditing: false,
        width: 100,
        visible: true,
        cellRender: (cellInfo) => {
          // Only show checkbox if the row is not a summary and checkStatus is not 'p' or 'P'
          if (!cellInfo.data.isSummary && 
              ((cellInfo.data.checkStatus !== 'p' && 
                cellInfo.data.checkStatus !== 'P') || cellInfo.data.clicked == true)) {
                  return (
                    <input 
                      type="checkbox" 
                      checked={cellInfo.data.clicked} 
                      onChange={() => {
                        const gridInstance = dataGridRef.current?.instance();
                        if (gridInstance) {
                          // Use the row's key (id) to find and update the data
                          const dataSource = gridInstance.getDataSource();
                          const store = dataSource.store();
                          let bankDate = cellInfo.data.bankDate;
                          if(!cellInfo.data.clicked && cellInfo.data.bankDate === null)  {
                            bankDate = dateChangeStateRef.current === "today" 
                            ? moment().local().format("DD/MM/YYYY") 
                            : cellInfo.data.chequeDate
                          }
                          // Update the store directly using the row's key
                          store.update(cellInfo.data.id, { clicked: !cellInfo.data.clicked,bankDate:bankDate  })
                            .then(() => {
                              // Refresh the grid to reflect the changes
                              dataSource.reload();
                            });
                        }
                      }}
                    />
                  );
          }
          // Return empty cell for rows that shouldn't have checkboxes
          return null;
        },
      }
    ],
    [t, getFormattedValue]
  );
  const onRowUpdating = async (e: any) => {
    debugger;
    const keys = Object.keys(e.newData);
    const key = keys && keys.length > 0 ? keys[0] : "";
    // if (key === "clicked") {
    //   try {
    //     try {
    //       debugger;
    //       e.newData.checkStatus = "p";
          
    //     } catch (error) {
    //       console.error("Error updating transaction:", error);
    //     }
    //   } catch (error) {
    //     console.error("Error updating transaction:", error);
    //   } finally {
    //   }
    // }
    if (key === "selected") {
      e.newData.bankDate = e.newData.selected === true ?
        dateChangeStateRef.current === "today"
          ? moment().local().format("DD/MM/YYYY")
          : e.oldData.chequeDate : null;
    }
  };
  return (
    <>
      <div className="relative bg-white">
        <div className="fixed w-full left-0 z-10 top-[60px]">
          <div className="flex items-center p-0 border dark:border-dark-border border-gray-300 rounded-b-sm dark:bg-dark-bg bg-[#f4f4f5] me-[1px]">
            <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
              <h6 className="text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis ml-0 transition-all duration-300 [@media(min-Width:1000px)]:ml-[231px]">
                {t("bank_reconciliation")}
              </h6>
              <i className="fas fa-cog ms-1"></i>
            </div>

            <div className="flex items-center justify-end space-x-4 p-1 w-full">
              {/* <div className="group relative inline-flex flex-col items-center" title={t("print")}>
                <button className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors" onClick={handlePrint}>
                  <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              </div> */}

              <div className="group relative inline-flex flex-col items-center" title={t("close")}>
                <button
                  className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={goToPreviousPage}>
                  <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="dark:!bg-dark-bg bg-[#fafafa] p-4">
            <div className="py-3">
              <div className="flex flex-col w-full max-w-[600px]">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6">
                  <ERPRadio
  id="todayDate"
  name="bankDateType"
  checked={dateChangeStateRef.current === "today"}
  onChange={() => handleBankDateTypeChange("today")}
  label={t("today's_date")}
/>

                  </div>
                  <div className="col-span-3">
                  <ERPRadio
  id="chequeDate"
  name="bankDateType"
  checked={dateChangeStateRef.current === "cheque"}
  onChange={() => handleBankDateTypeChange("cheque")}
  label={t("cheque_date")}
/>
                  </div>
                  <div className="col-span-3">
                    <ERPButton
                      title={t("set_all_date")}
                      onClick={handleSetAllDate}
                      type="reset"
                      loading={loading.setAllDate}
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6">
                    <ERPDataCombobox
                      id="selectedBankId"
                      label={t("bank_a/c")}
                      field={{
                        id: "selectedBankId",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        valueKey: "id",
                        params: `ledgerType=${LedgerType.BankAccount}`,
                        labelKey: "name",
                      }}
                      value={formState.selectedBankId}
                      onChange={(e) => handleBankSelection(e?.value ?? null)}
                      className="w-64"
                    />
                  </div>
                  <div className="col-span-3">
                    <ERPCheckbox
                      id="showReconciled"
                      name="showReconciled"
                      checked={formState.showReconciled}
                      onChange={(e) => handleReconciledChange(e.target.checked)}
                      label={t("show_reconciled")}
                    />
                  </div>
                  <div className="col-span-3">
                    <ERPButton
                      title={t("show")}
                      onClick={() => {
                        handleShow();
                        // setKey((prev: number) => {
                        //   return prev + 1;
                        // });
                      }}
                      loading={loading.show}
                      variant="secondary"
                      className="mt-[15px] !mb-0 w-[100px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <ErpDevGrid
              showTotalCount={false}
              onRowUpdating={onRowUpdating}
              ref={dataGridRef}
              gridHeader=" "
              scrollingMode="virtual"
              columns={columns}
              gridId="grid_bank_reconciliation"
              hideGridAddButton={true}
              hideDefaultExportButton={false}
              showPrintButton={true}
              // onSelectionChanged={handleSelectionChange}
              heightToAdjustOnWindows={300}
              data={data}
              keyExpr="id"
              // stateStoring={{enabled: true, type:"localStorage",storageKey:"grd_bank_reconciliation_str"}}
              keyboardNavigation={{
                editOnKeyPress: true, // overrides default
                enterKeyAction: "startEdit", // overrides default
                enterKeyDirection: "column",
              }}
              // selectedRowKeys={selectedKeys}
              allowEditing={{
                allow: true,
                config: {
                  add: false,
                  edit: true,
                  delete: false,
                },
              }}
              remoteOperations={{
                filtering: false,
                paging: false,
                sorting: false,
              }}
              editMode="cell"
              pageSize={40}
              loadPanelEnabled={false}
            // allowSelection={true}
            // selectionMode={"multiple"}
            />

            <div
              className="flex items-center justify-end h-[65px] z-10 fixed bottom-0  left-0 right-0 z-10 px-4 py-2 bg-white dark:bg-dark-bg shadow-lg full-available-width lg:px-8 py-2 md:px-2"
              style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)", }}>
              <div className="flex items-center gap-4">
                <ERPButton
                  ref={btnSaveRef}
                  title={t("close")}
                  onClick={goToPreviousPage}
                />
                <ERPButton
                  title={t("save")}
                  onClick={handleSave}
                  variant="primary"
                />
                <ERPButton
                  title={t("change_to_pending")}
                  onClick={handleChangeToPending}
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankReconciliation;
