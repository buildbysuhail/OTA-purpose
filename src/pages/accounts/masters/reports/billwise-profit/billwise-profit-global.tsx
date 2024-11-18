import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
interface BillwiseProfitGlobal {

  from: Date
}
const BillwiseProfitGlobal = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<BillwiseProfitGlobal>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "description",
      caption: t('description'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "qty",
      caption:  t("qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "free",
      visible: false,
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
      visible: false,
    },
    {
      dataField: "rate",
      caption: t("rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "grossAmount",
      caption: t("gross_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "discAmt",
      caption: t("disc_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "salesPrice",
      caption: t('sales_price'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "totCost",
      caption: t("tot_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
  
   
    {
      dataField: "profit",
      caption: t("profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 110,
    },
    {
      dataField: "markupPerc",
      caption: t("markup_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
 {
      dataField: "marginPerc",
      caption: t("margin_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "sgst",
      caption: t("sgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "cgst",
      caption: t("cgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    }, 
    {
      dataField: "igst",
      caption: t("igst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    }, 
    {
      dataField: "cess",
      caption: t("cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    }, 
    {
      dataField: "addCess",
      caption: t("add_cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    }, 
    {
      dataField: "calmityCess",
      caption: t("calamity_cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
                  gridHeader={t("billwise_profit_report_sales")}
                  dataUrl= {Urls.acc_reports_billwise_profit_global}
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

export default BillwiseProfitGlobal;