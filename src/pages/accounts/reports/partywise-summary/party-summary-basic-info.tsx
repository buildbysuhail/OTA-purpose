import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import {
  toggleAccountGroupPopup,
  toggleCostCentrePopup,
} from "../../../../redux/slices/popup-reducer";
import { PartySummaryFilter, PartySummaryRef } from "./party-summary-master";
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";

// Define the ref type for useImperativeHandle

const PartySummaryBasicInfo = forwardRef<PartySummaryRef, PartySummaryFilter>(
  ({ filter }, ref) => {

  const [reload, setReload] = useState<boolean>(true);
  useImperativeHandle(ref, () => ({
    reloadData: () => {
      setReload(prev => !prev); // Toggle reload state
    },
  }));

  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "displayName",
      caption: t("display_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address3",
      caption: t("address3"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address4",
      caption: t("address4"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "officePhone",
      caption: t("office_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "workPhone",
      caption: t("work_phone"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "contactPhone",
      caption: t("contact_phone"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "faxNumber",
      caption: t("fax_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "webURL",
      caption: t("webURL"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "email",
      caption: t("email"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "startDate",
      caption: t("start_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "expiryDate",
      caption: t("expiry_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "cstNumber",
      caption: t("cst_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "partyCategoryName",
      caption: t("party_category_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "partyType",
      caption: t("party_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "creditAmount",
      caption: t("credit_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "creditDays",
      caption: t("credit_days"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "billwiseBillApplicable",
      caption: t("billwise_bill_applicable"),
      dataType: "boolean",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("basic_info")}
                  dataUrl={Urls.acc_reports_party_summary_basic_info}
                  method={ActionType.POST}
                  postData={filter}
                  gridId="grd_party_summary_basic_info"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  changeReload={(reload)=>setReload(reload)}
                  reload={reload}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
});
export default PartySummaryBasicInfo;
