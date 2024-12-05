import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import BillwiseProfitReportFilter, { BillwiseProfitReportFilterInitialState } from "./billwise-profit-report-filter";

const BillwiseProfitGlobal = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "description",
      caption: t('description'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={'font-bold text-blue'}>
  {cellElement.data.description}
  </span>
      ),
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.productName}
  </span>
      ),
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.salesPrice}
  </span>
      ),
    },
    {
      dataField: "cost",
      caption: t("tot_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.cost}
  </span>
      ),
    },
    {
      dataField: "netAmt",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.netAmt}
  </span>
      ),
    },
  
   
    {
      dataField: "profit",
      caption: t("profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 110,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.profit}
  </span>
      ),
    },
    {
      dataField: "markupPerc",
      caption: t("markup_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.markupPerc}
  </span>
      ),
    },
 {
      dataField: "marginPerc",
      caption: t("margin_perc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.marginPerc}
  </span>
      ),
    },
    {
      dataField: "sgst",
      caption: t("sgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.sgst}
  </span>
      ),
    },
    {
      dataField: "cgst",
      caption: t("cgst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.cgst}
  </span>
      ),
    },
    {
      dataField: "igst",
      caption: t("igst"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.igst}
  </span>
      ),
    },
    {
      dataField: "cess",
      caption: t("cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.cess}
  </span>
      ),
    },
    {
      dataField: "addCess",
      caption: t("add_cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.addCess}
  </span>
      ),
    },
    {
      dataField: "calmityCess",
      caption: t("calamity_cess"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName==="Grand Total"||cellElement.data.productName==="Disc+AddAmt" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.calmityCess}
  </span>
      ),
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
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                   filterWidth="200"
                  showFilterInitially={true}
                  filterContent={<BillwiseProfitReportFilter/>}
                  filterInitialData={BillwiseProfitReportFilterInitialState}
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