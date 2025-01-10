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
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
interface BillwiseProfit {
  from: Date
}
const BillwiseProfit = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const [filter, setFilter] = useState<BillwiseProfit>({ from: new Date() });
  const rootState = useRootState();
  const { getFormattedValue } = useNumberFormat()
  const columns: DevGridColumn[] = [
    {
      dataField: "description",
      caption: t('description'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 240,
      showInPdf:true,
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
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {cellElement.data.productName}
        </span>
      ),
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span>
          {`${cellElement.data?.qty == 0 || cellElement.data?.qty == null ? '' :  getFormattedValue(cellElement.data.qty)}`}
        </span>
      ),
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
      showInPdf:true,
    },
    {
      dataField: "grossAmount",
      caption: t("gross_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span>
          {`${cellElement.data?.grossAmount == 0 || cellElement.data?.grossAmount == null ? '' : getFormattedValue(cellElement.data.grossAmount)}`}
        </span>
      ),
    },
    {
      dataField: "discAmt",
      caption: t("disc_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "salesPrice",
      caption: t('sales_price'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        const productName = cellElement.data?.productName;
        const salesPrice = cellElement.data?.salesPrice;
        // Apply special formatting only for "Grand Total" and "Disc+AddAmt"
        if (productName === "Grand Total" || productName === "Disc+AddAmt") {
          const formattedValue =
            salesPrice == null
              ? '0'
              // : salesPrice < 0
              //   ? getFormattedValue(-1 * salesPrice)
                : getFormattedValue(salesPrice);

          return (
            <span className="font-bold text-[#DC143C]">
              {formattedValue}
            </span>
          );
        }

        // For other rows, display the salesPrice as it is (with decimal points from the API)
        // return <span>{salesPrice != null ? salesPrice.toFixed(2) : '0.00'}</span>;
        return <span>{salesPrice || '0'}</span>;
      },
    },
    {
      dataField: "totCost",
      caption: t("tot_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.totCost == 0 || cellElement.data?.totCost == null ? '' :  getFormattedValue(cellElement.data.totCost)}`}
        </span>
      ),
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.netAmount == 0 || cellElement.data?.netAmount == null ? '' :  getFormattedValue(cellElement.data.netAmount)}`}
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
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.profit == 0 || cellElement.data?.profit == null ? '' :  getFormattedValue(cellElement.data.profit)}`}
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
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.markupPerc == 0 || cellElement.data?.markupPerc == null ? '' :  getFormattedValue(cellElement.data.markupPerc)}`}
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
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.productName === "Grand Total" || cellElement.data.productName === "Disc+AddAmt" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.marginPerc == 0 || cellElement.data?.marginPerc == null ? '' : getFormattedValue(cellElement.data.marginPerc)}`}
        </span>
      ),
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        const productName = cellElement.data?.productName;
        const vat = cellElement.data?.vat;

        // Apply special formatting only for "Grand Total" and "Disc+AddAmt"
        if (productName === "Grand Total" || productName === "Disc+AddAmt") {
          const formattedValue =
            vat == null
              ? '0'
              // : vat < 0
              //   ? getFormattedValue(-1 * vat)
                : getFormattedValue(vat);

          return (
            <span className="font-bold text-[#DC143C]">
              {formattedValue}
            </span>
          );
        }

        // For other rows, display the salesPrice as it is (with decimal points from the API)
        // return <span>{vat != null ? vat.toFixed(2) : '0.00'}</span>;
        // Return the default value for other rows
        return <span>{vat || '0'}</span>;
      },
    }
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                showTotalCount={false}
                remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  filterText="from {fromDate} to {toDate} {brandID > 0 && ,Brand : [brandName]} {colour != '' && , Colour : [colour]} {warranty != '' && , Warranty : [warranty]}"
                  gridHeader={t("billwise_profit_report_sales")}
                  dataUrl={Urls.acc_reports_billwise_profit}
                  method={ActionType.POST}
                  gridId="grd_billwise_profit"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="200"
                  filterContent={<BillwiseProfitReportFilter />}
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
export default BillwiseProfit;