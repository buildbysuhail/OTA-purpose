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
const PartySummaryPayment  : React.FC<PartySummaryFilter> = ({ filter
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const [filter, setFilter] =useState<PartySummaryPayment>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "vchNo",
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "accountGroup",
      caption: t("account_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "amount",
      caption: t('amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "discount",
      caption: t('discount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
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
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("party_summary_payment_report")}
                  dataUrl= {Urls.acc_reports_party_summary_payment}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  postData={filter}
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

export default PartySummaryPayment;