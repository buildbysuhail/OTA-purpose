import { useRef, useState } from "react";
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

interface FormState {
  showReconciled: boolean;
  selectedBankId: number | null;
}
interface LoadingState {
  setAllDate: boolean;
  exportToExcel: boolean;
  show: boolean;
  save: boolean;
  print: boolean;
}
const api = new APIClient();
const BankReconciliation = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const { getFormattedValue } = useNumberFormat()

  const [data, setData] = useState<any>();
  const [key, setKey] = useState<number>(100000);
  const [prevData, setPrevData] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [formState, setFormState] = useState<FormState>({ showReconciled: false, selectedBankId: -2 });
  const [dateChangeState, setDateChangeState] = useState<"today" | "cheque">("today");
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingState>({
    setAllDate: false,
    exportToExcel: false,
    show: false,
    save: false,
    print: false,
  });

  const { t } = useTranslation("transaction");
  const dataGridRef = useRef<any>(null);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const goToPreviousPage = () => {
    window.history.back();
  };

  const handleReconciledChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, showReconciled: checked }));
  };

  const handleBankSelection = (value: number | null) => {
    setFormState((prev) => ({ ...prev, selectedBankId: value }));
  };

  const handleBankDateTypeChange = (type: "today" | "cheque") => {
    setDateChangeState(type);
  };

  const handleSelectionChange = (e: any) => {
    if (Array.isArray(e.selectedRowKeys)) {
      const selectedKeys = e.selectedRowKeys.map((row: any) =>
        typeof row === "object" ? row.id : row
      );

      const updatedTransactions = data.map((transaction: any) => {
        if (selectedKeys.includes(transaction.id)) {
          return {
            ...transaction,
            bankDate: transaction.bankDate == null ?
              dateChangeState === "today"
                ? moment().format("DD/MM/YYYY")
                : transaction.chequeDate : transaction.bankDate,
          };
        }
        return transaction;
      });
      console.log("123");
      setData(updatedTransactions);
      setSelectedKeys(selectedKeys);
    } else {
      setSelectedKeys([]);
    }
  };

  const handleSetAllDate = async () => {
    setLoading((prev) => ({ ...prev, setAllDate: true }));
    try {
      if (!selectedKeys || selectedKeys.length === 0) {
        ERPAlert.show({
          icon: "warning",
          text: t("no_rows_selected"),
          title: "",
        });
        return;
      }
      // Update the data
      const updatedTransactions = data.map((transaction: any) => {
        if (selectedKeys.includes(transaction.id)) {
          return {
            ...transaction,
            bankDate:
              dateChangeState === "today"
                ? moment().format("DD/MM/YYYY")
                : transaction.chequeDate,
          };
        }
        return transaction;
      });
      console.log("123");
      setData(updatedTransactions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, setAllDate: false }));
    }
  };

  const handleShow = async () => {
    setLoading((prev) => ({ ...prev, show: true }));
    try {
      const _data = await api.getAsync(
        Urls.bankReconciliation,
        `LedgerID=${formState.selectedBankId??0}&IsReconciled=${formState.showReconciled}`
      );
      const rows = _data.map((row: any, index: number) => ({
        ...row,
        id: index + 1,
      }));
      console.log("1234");
      setData(rows);
      setPrevData(rows);
      setKey((prev: number) => {
        return prev + 1;
      });
    } finally {
      setLoading((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = async () => {
    setLoading((prev) => ({ ...prev, save: true }));

    try {
      // Step 1: Find modified rows (where bankDate has changed)
      const modifiedItems = data.filter((item: any) => {
        const prevItem = prevData.find(
          (p: any) => p.accTransactionDetailID === item.accTransactionDetailID
        );
        return prevItem && prevItem.bankDate !== item.bankDate; // ✅ Only return changed items
      });

      // Step 2: Filter modified items that are also in selectedRows
      const filteredItems = modifiedItems
        .filter((item: any) =>
          selectedKeys.includes(item.id)
        ) // ✅ Fixed ID casing
        .map((it: any) => ({
          ...it,
          ledgerID: formState.selectedBankId,
          bankDate: it.bankDate
            ? moment(it.bankDate, "YYYY/MM/DD").format("YYYY-MM-DD")
            : null, // ✅ Corrected format
        }));

      if (filteredItems.length === 0) {
        ERPAlert.show({
          icon: "info",
          text: t("no_changes_detected"),
          title: "",
        });
        return;
      }

      // Step 3: Call API with only filtered modified items 

      const res = await api.postAsync(Urls.bankReconciliation, filteredItems);
      handleResponse(res, () => {
        ERPAlert.show({
          icon: "success",
          text: t("changes_saved_successfully"),
          title: t("success"),
        });
      });
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handlePrint = async () => {
    setLoading((prev) => ({ ...prev, print: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setLoading((prev) => ({ ...prev, print: false }));
    }
  };

  const handleSetPending = async (cellInfo: any, __data: any) => {
    setLoading((prev) => ({ ...prev, print: true }));
    const _data = cellInfo.data;
    try {
      if (_data.status === "B") {
        ERPAlert.show({
          icon: "info",
          text: t("bounced_cheque_cannot_be_changed"),
          title: "",
        });
        return;
      }

      if (!_data.bankDate) {
        ERPAlert.show({
          icon: "info",
          text: t("bank_date_is_required"),
          title: "",
        });
        return;
      }

      ERPAlert.show({
        icon: "question",
        text: t("change_the_transaction_to_pending"),
        title: t("changing_to_pending"),
        onConfirm: () => {
          setLoading((prev) => ({ ...prev, print: true })); // Set loading inside onConfirm
          try {
            const res = api
              .putAsync(Urls.bankReconciliation, {
                chequeDate: _data.bankDate,
                accTransactionDetailID: _data.accTransactionDetailID,
              })
              .then((res: any) => {
                setData((prev: any) => {
                  const updatedData = prev?.map((item: any) => {
                    if (
                      item.accTransactionDetailID === _data.accTransactionDetailID
                    ) {
                      return {
                        ...item,
                        checkStatus: "p", // Update the status to pending
                      };
                    }
                    return item;
                  });
                  return updatedData;
                })
                // dataGridRef.current?.instance().repaint()
              });
            
          } catch (error) {
            console.error("Error updating transaction:", error);
          } finally {
            setLoading((prev) => ({ ...prev, print: false })); // Reset loading after API call
          }
        },
      });
    } catch (error) {
      console.error("Error in handleSetPending:", error);
    }
  };

  const columns: DevGridColumn[] = [
    {
      dataField: "accTransactionDetailID",
      caption: t("acc_transaction_detail_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false
    },
    {
      dataField: "id",
      caption: t("slNo"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 30,
      visible: true,
      cellRender: (cellInfo: any) => (
        <span>{cellInfo.data.isSummary == true ? '' : cellInfo.data.id}</span>
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
        <span className={`${cellInfo.data.isSummary == true ? "text-red font-bold" : ""}`}>
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
        <span className={`${cellInfo.data.isSummary == true ? "text-red font-bold text-right" : "text-right"}`}>
          {cellInfo.data.isSummary == true ? getFormattedValue(cellInfo.data.debit) : getFormattedValue(cellInfo.data.debit, false, 4)}
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
        <span className={`${cellInfo.data.isSummary == true ? "text-red font-bold text-right" : "text-right"}`}>
          {cellInfo.data.isSummary == true ? getFormattedValue(cellInfo.data.credit) : getFormattedValue(cellInfo.data.credit, false, 4)}
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
    {
      dataField: "",
      caption: t("change_to_pending"),
      dataType: "string",
      allowSorting: false,
      allowSearch: false,
      allowFiltering: false,
      width: 100,
      cellRender: (cellInfo: any) => (
        !cellInfo.data.isSummary ?
          (
            <a onClick={() => handleSetPending(cellInfo, data)} title={t("set_pending")} className="text-blue hover:text-blue font-medium cursor-pointer transition duration-200">
              {t("set_pending")}
            </a>
          ) : null
      ),
    },
  ];
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
                <button className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors" onClick={goToPreviousPage}>
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
                      checked={dateChangeState === "today"}
                      onChange={() => handleBankDateTypeChange("today")}
                      label={t("today's_date")}
                    />
                  </div>
                  <div className="col-span-3">
                    <ERPRadio
                      id="chequeDate"
                      name="bankDateType"
                      checked={dateChangeState === "cheque"}
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
                      onClick={handleShow}
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
              key={key}
              ref={dataGridRef}
              gridHeader=" "
              columns={columns}
              gridId="grid_bank_reconciliation"
              hideGridAddButton={true}
              hideDefaultExportButton={false}
              showPrintButton={true}
              onSelectionChanged={handleSelectionChange}
              heightToAdjustOnWindows={300}
              data={data}
              keyExpr="id"
              selectedRowKeys={selectedKeys}
              allowEditing={{ allow: true, config: { edit: true } }}
              remoteOperations={{
                filtering: false,
                paging: false,
                sorting: false,
              }}
              editMode="cell"
              pageSize={40}
              allowSelection={true}
              selectionMode={"multiple"}
            />

            <div className="fixed bottom-0 left-0 right-0 z-10 px-4 py-2 bg-white dark:bg-dark-bg border-t dark:border-dark-border shadow-lg"
              style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
              <div className="w-full mx-auto flex items-center gap-4 justify-end">
                <ERPButton
                  ref={btnSaveRef}
                  title={t("close")}
                  onClick={goToPreviousPage}
                  className="w-24"
                />
                <ERPButton
                  title={t("save")}
                  onClick={handleSave}
                  variant="primary"
                  className="w-24"
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
