import { useTranslation } from "react-i18next";
import { Fragment, useMemo } from "react";
import moment from "moment";
import CreditPurchaseSummaryReportFilter, {
  CreditPurchaseSummaryReportFilterInitialState,
} from "./credit-purchase-summary-report-filter ";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import GridId from "../../../../redux/gridId";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils";

const CreditPurchaseSummaryReport = () => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();

  const clientSession = useSelector((state: RootState) => state.ClientSession);

  const columns: DevGridColumn[] = [
     {
      sortIndex:0,
      sortOrder:"asc",
      dataField: "siNo",
      caption: t("SINo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        return cellElement.data.date == null || cellElement.data.date == ""
          ? ""
          : moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY");
      },
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 150,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "gross",
      caption: t("gross"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.gross == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.gross),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.gross == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.gross),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "disc",
      caption: t("discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.disc == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.disc),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.disc == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.disc),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.billDiscount == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.billDiscount),
                  false,
                  2
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.billDiscount == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.billDiscount),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.vat == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.vat),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.vat == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.vat),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.grandTotal),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.grandTotal == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.grandTotal),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "cashDiscount",
      caption: t("cash_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashDiscount == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.cashDiscount),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cashDiscount == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.cashDiscount),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "adjustmentAmount",
      caption: t("adjustment_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      visible: false,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.adjustmentAmount == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.adjustmentAmount),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.adjustmentAmount == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.adjustmentAmount),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashReceived == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.cashReceived),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cashReceived == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.cashReceived),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "exchangeRate",
      caption: t("exchange_rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.exchangeRate == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.exchangeRate),
                  false,
                  6
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.exchangeRate == null
            ? ""
            : getFormattedValue(
                Number.parseFloat(cellElement.data.exchangeRate),
                false,
                6
              );
        }
      },
    },
    {
      dataField: "masterID",
      caption: t("master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "mInvoiceNo",
      caption: t("m_invoice_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
     format:"dd-MMM-yyyy"
    },
  ];
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0"; // Ensure "0" is displayed when value is missing
      }
      return getFormattedValue(value, false, 2) || "0"; // Ensure formatted output or fallback to "0"
    };
  }, []);
  

  const summaryItems: SummaryConfig[] = [
    {
      column: "address2",
      summaryType: "custom",
      valueFormat: "string",
      displayFormat: "TOTAL",
    },
    {
      column: "gross",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo: { value: any })=>{
             return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
           },
         },
    {
      column: "disc",
      summaryType: "sum",
      valueFormat: "currency",
     customizeText: (itemInfo: { value: any })=>{
            return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
          },
        },
    {
      column: "vat",
      summaryType: "sum",
      valueFormat: "currency",
     customizeText: (itemInfo: { value: any })=>{
            return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
          },
        },
    {
      column: "grandTotal",
      summaryType: "sum",
      valueFormat: "currency",
       customizeText: (itemInfo: { value: any })=>{
              return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
            },
          },
    {
      column: "billDiscount",
      summaryType: "sum",
      valueFormat: "currency",
    customizeText: (itemInfo: { value: any })=>{
        return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
      },
    },
    {
      column: "cashDiscount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo: { value: any })=>{
        return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
      },
    },
    {
      column: "cashReceived",
      summaryType: "sum",
      valueFormat: "currency",
    customizeText: (itemInfo: { value: any })=>{
        return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
      },
    },
    {
      column: "adjustmentAmount",
      summaryType: "sum",
      valueFormat: "currency",
    customizeText: (itemInfo: { value: any })=>{
        return getFormattedValue((parseFloat(getFormattedValue((isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value)).replace(/,/g, '') || "0")), false, 2) || "0"; 
      },
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
                  columns={columns}
                  summaryItems={summaryItems}
                  remoteOperations={{
                    filtering: true,
                    paging: true,
                    sorting: true,
                    summary: true,
                  }}
                  //{partyID > 0 && , Party Name : [PartyName]} not seened in 1050  {productID > 0 && , Product Name : [ProductName]} always visible false for combo so removed
                  filterText="from {fromDate} to {toDate}
                   {salesRouteID > 0 && , Route Name : [SalesRouteName]} 
                   {counterID > 0 && , Counter : [CounterName]} 
                   {salemanID > 0 && , Sales Man : [SalemanName]}"
                  gridHeader={t("credit_purchase_summary")}
                  dataUrl={Urls.Credit_purchase_summary}
                  method={ActionType.POST}
                  gridId={GridId.Credit_purchase_summary}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={790}
                  filterHeight={270}
                  filterContent={<CreditPurchaseSummaryReportFilter />}
                  filterInitialData={{
                    ...CreditPurchaseSummaryReportFilterInitialState,
                    fromDate: moment(
                      clientSession.softwareDate,
                      "DD/MM/YYYY"
                    ).local(),
                  }}
                  hideGridAddButton={true}
                  reload={true}
                  childPopupProps={{
                    content: <></>,
                    title: t(""),
                    isForm: false,
                    isTransactionScreen: true,
                    width: 1000,
                    drillDownCells: "",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreditPurchaseSummaryReport;
