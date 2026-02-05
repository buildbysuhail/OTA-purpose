import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import { useDispatch } from "react-redux";
import { formStateHandleFieldChangeKeysOnly, formStateMasterHandleFieldChange } from "../reducer";

  interface DraftModeProps {
    closeModal: () => void;
    formState: TransactionFormState;
    t: any;
  }

  const api = new APIClient();
  const VoucherDraftGrid: React.FC<DraftModeProps> = ({ closeModal, t, formState }) => {
  
  const [draftGridData, setDraftGridData] = useState<any[]>([])
  const [draftInitialized, setDraftInitialized] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    const loadData = async () => {
    const draftDetails = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/Draft`);
    setDraftGridData(draftDetails)
    };

    loadData();
  }, []);

  const handleLedgerContentReady = useCallback(
      (e: any) => {
        const gridInstance = e.component;
        const visibleRows = gridInstance.getVisibleRows();
        if (!draftInitialized && visibleRows.length > 0) {
          gridInstance.option("focusedRowIndex", 0);
          gridInstance.selectRows([visibleRows[0].key], false);
          setDraftInitialized(true);
          setTimeout(() => {
            gridInstance.focus();
          }, 0);
        }
      },
      [draftInitialized]
    );
  
    const handleRowClick = useCallback((e: any) => {
      const grid = e.component;
      const key = e.key;
      grid.selectRows([key], false);
      grid.option("focusedRowKey", key);
      grid.focus();
    }, []);

//     {
//   "si": 4,
//   "voucherNumber": "42",
//   "invTransactionMasterID": 600001144831,
//   "partyName": "Cash Account almas - النقدية",
//   "counterName": "AL MAS PLASTIC",
//   "warehouse": "PRIMARY",
//   "employee": "RAZAK CHOLAYIL",
//   "userName": "adminr",
//   "transactionDate": "2026-02-04T00:00:00",
//   "createdDate": "2026-02-05T09:45:59.597",
//   "gross": 306,
//   "vat": 0,
//   "grandTotal": 306,
//   "address1": "",
//   "address2": "",
//   "address4": "12345",
//   "remarks": ""
// }

    const handleKeyDown = useCallback((e: any) => {
      const key = e.event?.key;
      if (key === "Enter") {
        const grid = e.component;
        const focusedRowKey = grid.option("focusedRowKey");
        const rowIndex = grid.getRowIndexByKey(focusedRowKey);
        const rowData = grid.getVisibleRows()[rowIndex]?.data;
        debugger;
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {  
              transaction: {
                master:{
                  voucherNumber: rowData?.voucherNumber,
                  invTransactionMasterID: rowData?.invTransactionMasterID,
                  partyName: rowData?.partyName,
                  counterName: rowData?.counterName,
                  warehouse: rowData?.warehouse,
                  employee: rowData?.employee,
                  transactionDate: rowData?.transactionDate,
                  createdDate: rowData?.createdDate,
                  address1: rowData?.address1,
                  address2: rowData?.address2,
                  address4: rowData?.address4,
                  userName: rowData?.userName,
                  remarks: rowData?.remarks,
                  // gross: rowData?.gross,
                  // vat: rowData?.vat,
                  // grandTotal: rowData?.grandTotal,
              }
            }},
          })
        )
        closeModal();
      }
    }, []);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "si",
        caption: t("sl"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        showInPdf: true,
      },
      {
        dataField: "transactionDate",
        caption: t("transaction_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "partyName",
        caption: t("party_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "address1",
        caption: t("address_1"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "address2",
        caption: t("address_3"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "address4",
        caption: t("address_4"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "voucherNumber",
        caption: t("voucher_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "gross",
        caption: t("gross"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "vat",
        caption: t("vat"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "grandTotal",
        caption: t("grand_total"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
    ], [t]
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                height={450}
                columns={columns}
                keyExpr="si"
                data={draftGridData}
                gridId="grd_voucher_draft"
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={false}
                enablefilter={false}
                hideToolbar={true}
                remoteOperations={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
                focusedRowEnabled={true}
                tabIndex={0}
                onContentReady={handleLedgerContentReady}
                onRowClick={handleRowClick}
                onKeyDown={handleKeyDown}
                selectionMode="single"
                keyboardNavigation={{
                  editOnKeyPress: false,
                  enabled: true,
                  enterKeyDirection: "row",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(VoucherDraftGrid);
