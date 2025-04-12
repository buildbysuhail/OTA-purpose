import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PurchaseReturnGstReportFilter, { PurchaseReturnGstReportFilterInitialState } from "./purchase-return-tax-gst-report-filter";


const PurchaseReturnTaxGSTSalesAndReturn = () => {
  const { t } = useTranslation("inventory");
 const [filter, setFilter] = useState<any>(PurchaseReturnGstReportFilterInitialState);
     const columns: DevGridColumn[] = [
       {
         dataField: "hSN",
         caption: t("HSN"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
       },
       {
         dataField: "qty",
         caption: t("Quantity"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 75,
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
         dataField: "cGST",
         caption: t("CGST"),
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
        dataField: "sGST",
        caption: t("SGST"),
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
        dataField: "iGST",
        caption: t("IGST"),
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
       },
       {
        dataField: "financialYearID",
        caption: t("FinancialYearID"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
     ];
 
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
        column:"hSN",
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
        column: "cGST",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sGST",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "iGST",
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
               filterText="of From Date : {fromDate} To Date : {toDate}
               {gstPercValue != '' && , Gst Percentage : [gstPercValue]}
               {taxCategoryID > 0 && , GST Category : [taxCategoryName]} 
               {formType > 0 && , Form Type : [formType]}"
                moreOption
                gridHeader={t("purchase_return_gst_report")}
                dataUrl={Urls.purchase_return_gst_daily_summary}
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
                gridId="grd_purchase_return_gst_sales_and_return_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseReturnTaxGSTSalesAndReturn;
