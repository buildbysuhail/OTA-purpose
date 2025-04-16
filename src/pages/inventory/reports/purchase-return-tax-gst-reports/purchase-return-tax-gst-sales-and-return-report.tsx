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
         dataField: "hsn",
         caption: t("hsn_code"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
       },
       {
         dataField: "qty",
         caption: t("quantity"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 75,
       },
       {
         dataField: "taxableValue",
         caption: t("taxable_value"),
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
         dataField: "cgst",
         caption: t("cgst"),
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
               cellElement.data?.cgst == null
                 ? ""
                 : getFormattedValue(cellElement.data.cgst);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.cgst == null
               ? ""
               : getFormattedValue(parseFloat(cellElement.data.cgst));
           }
         },
       },
       {
        dataField: "sgst",
        caption: t("sgst"),
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
              cellElement.data?.sgst == null
                ? ""
                : getFormattedValue(cellElement.data.sgst);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sgst == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sgst));
          }
        },
      },
      {
        dataField: "igst",
        caption: t("igst"),
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
              cellElement.data?.igst == null
                ? ""
                : getFormattedValue(cellElement.data.igst);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.igst == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.igst));
          }
        },
      },
       {
         dataField: "cess",
         caption: t("cess_amount"),
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
         caption: t("addcess_amount"),
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
         caption: t("total"),
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
        caption: t("financial_year_id"),
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
        column:"hsn",
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
        column: "cgst",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sgst",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "igst",
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
                dataUrl={Urls.purchase_return_gst_sales_and_return}
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
