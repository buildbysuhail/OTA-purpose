import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
interface PartySummaryBasicInfo {

  from: Date
}
const PartySummaryBasicInfo = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<PartySummaryBasicInfo>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "partyCode",
      caption: t('party_code'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "displayName",
      caption:  t("display_name"),
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
      caption: t('work_phone'),
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
                  dataUrl= {Urls.acc_reports_party_summary_basic_info}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
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

export default PartySummaryBasicInfo;