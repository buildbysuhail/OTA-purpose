import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { PartySummaryFilter } from "./party-summary-master";

const PartySummaryCollection: React.FC<PartySummaryFilter> = ({ filter }) => {

  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf: true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf: true,
    },
    {
      dataField: "accountGroup",
      caption: t("account_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf: true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf: true,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
    },
    {
      dataField: "discount",
      caption: t("discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf: true,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "chequeNumber",
      caption: t("cheque_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "chequeDate",
      caption: t("cheque_date"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf: true,
    },
    {
      dataField: "contactPhone",
      caption: t("contact_phone"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "faxNumber",
      caption: t("fax_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  columns={columns}
                  gridHeader={t("party_summary_collection_report")}
                  dataUrl={Urls.acc_reports_party_summary_collections}
                  method={ActionType.POST}
                  postData={filter}
                  gridId="grd_party_summary_basic_collection"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PartySummaryCollection;
