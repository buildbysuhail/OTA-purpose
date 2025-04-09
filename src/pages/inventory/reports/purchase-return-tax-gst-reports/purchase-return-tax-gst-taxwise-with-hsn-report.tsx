import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PurchaseSummaryFilter, { PurchaseSummaryFilterInitialState } from "../purchase-summary-report/purchase-summary-report-filter";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import moment from "moment";
import PurchaseReturnGstReportFilter, { PurchaseReturnGstReportFilterInitialState } from "./purchase-return-tax-gst-report-filter";

const PurchaseTaxGSTTaxwiseWithHSN = () => {
  const { t } = useTranslation("accountsReport");
 const [filter, setFilter] = useState<any>(PurchaseSummaryFilterInitialState);
   const userSession = useSelector((state: RootState) => state.UserSession);
   const clientSession = useSelector((state: RootState) => state.ClientSession);
   const applicationSettings = useSelector(
     (state: RootState) => state.ApplicationSettings
   );
   const columns: DevGridColumn[] = useMemo(() => {
     const baseColumns: DevGridColumn[] = [
       {
         dataField: "date",
         caption: t("date"),
         dataType: "date",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
         cellRender: (
           cellElement: any,
           cellInfo: any,
           filter: any,
           exportCell: any
         ) => {
           return cellElement.data.date == null || cellElement.data.date == ""
             ? ""
             : moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY"); // Ensures proper formatting
         },
       },
       {
         dataField: "vchNos",
         caption: t("VoucherNumber"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 75,
       },
       {
         dataField: "form",
         caption: t("Form"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 150,
       },
       {
         dataField: "gstPercentage",
         caption: t("GST%"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
       },
       {
         dataField: "taxableValue",
         caption: t("Taxable Value"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
         cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.taxableValue == null
                ? ""
                : getFormattedValue(cellElement.data.taxableValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.taxableValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.taxableValue));
          }
        },
       },
       {
         dataField: "totalGst",
         caption: t("Total GST"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 80,
         cellRender: (
           cellElement: any,
           cellInfo: any,
           filter: any,
           exportCell: any
         ) => {
           if (exportCell != undefined) {
             const value =
               cellElement.data?.totalGst == null
                 ? ""
                 : getFormattedValue(cellElement.data.totalGst);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.totalGst == null
               ? ""
               : getFormattedValue(parseFloat(cellElement.data.totalGst));
           }
         },
       },
       {
         dataField: "cess",
         caption: t("Cess"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 80,
         cellRender: (
           cellElement: any,
           cellInfo: any,
           filter: any,
           exportCell: any
         ) => {
           if (exportCell != undefined) {
             const value =
               cellElement.data?.cess == null
                 ? ""
                 : getFormattedValue(cellElement.data.cess);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.cess == null
               ? ""
               : getFormattedValue(parseFloat(cellElement.data.cess));
           }
         },
       },
       {
         dataField: "addCess",
         caption: t("Add Cess"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 80,
         cellRender: (
           cellElement: any,
           cellInfo: any,
           filter: any,
           exportCell: any
         ) => {
           if (exportCell != undefined) {
             const value =
               cellElement.data?.addCess == null
                 ? ""
                 : getFormattedValue(cellElement.data.addCess);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.addCess == null
               ? ""
               : getFormattedValue(parseFloat(cellElement.data.addCess));
           }
         },
       },
       {
         dataField: "total",
         caption: t("Total"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
         cellRender: (
           cellElement: any,
           cellInfo: any,
           filter: any,
           exportCell: any
         ) => {
           if (exportCell != undefined) {
             const value =
               cellElement.data?.total == null
                 ? ""
                 : getFormattedValue(cellElement.data.total,false,4);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.total == null
               ? ""
               : getFormattedValue(cellElement.data.total,false,4);
           }
         },
       }
     ];
     // Filter columns based on the `visible` property
     return baseColumns
       .filter((column) => {
         if (column.dataField == "exchangeRate") {
           return filter.voucher_form !== "Import";
         }
         if (column.dataField == "uPI" || column.dataField == "cardAmt") {
           return applicationSettings.accountsSettings.allowMultiPayments;
         }
         if (column.dataField == "printCount") {
           return userSession.dbIdValue == "543140180640";
         }
         return true;
       })
       .map((column) => {
         if (column.dataField == "uPI" && !clientSession.isAppGlobal) {
           return {
             ...column,
             caption: "QRPay",
           };
         }
         return column;
       });
   }, [t, filter, userSession.dbIdValue]);
 
   const { getFormattedValue } = useNumberFormat();
   const customizeSummaryRow = useMemo(() => {
     return (itemInfo: any) => {
       console.log('itemInfo');
       
       console.log(itemInfo);
       
       const value = itemInfo.value;
       if (
         value === null ||
         value === undefined ||
         value === "" ||
         isNaN(value)
       ) {
         return "0";
       }
       return getFormattedValue(value) || "0";
     };
   }, []);
   const customizeDate = (itemInfo: any) => `TOTAL`;
    const _summaryItems: SummaryConfig[] = [
      {
        column:"form",
        summaryType:"custom",  
        customizeText: customizeDate,
      },
      {
        column: "taxableValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "totalGST",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "total",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cess",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "addCess",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
               summaryItems={_summaryItems}
               remoteOperations={{
                 filtering: false,
                 paging: false,
                 sorting: false,
                 summary: false,
               }}
               columns={columns}
               // moreOption
               filterText="of"
                moreOption
                gridHeader={t("purchase_gst_daily_summary_report")}
                dataUrl={Urls.purchase_gst_daily_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseReturnGstReportFilter />}
                filterHeight={450}
                filterWidth={790}
                filterInitialData={PurchaseReturnGstReportFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_gst_daily_summary_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseTaxGSTTaxwiseWithHSN;
