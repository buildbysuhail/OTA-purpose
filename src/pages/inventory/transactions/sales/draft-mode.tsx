import React, { Fragment, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";

  interface DraftModeProps {
    closeModal: () => void;
    formState: TransactionFormState;
    t: any;
  }

  const api = new APIClient();
  const VoucherDraftGrid: React.FC<DraftModeProps> = ({ closeModal, t, formState }) => {
  
  const [draftGridData, setDraftGridData] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
    const draftDetails = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/Draft`);
    setDraftGridData(draftDetails)
    };

    loadData();
  }, []);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "transaction",
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
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(VoucherDraftGrid);
