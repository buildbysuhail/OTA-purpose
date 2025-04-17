import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";
import PurchaseGstReportFilter, { PurchaseGstReportFilterInitialState } from "./purchase-tax-gst-report-filter";


const PurchaseTaxGSTTaxwise = () => {
  const { t } = useTranslation("inventory");
 const [filter, setFilter] = useState<any>(PurchaseGstReportFilterInitialState);
     const columns: DevGridColumn[] = [
      {
        dataField: "id",
        caption: t("id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        visible:false,
      },
      {
        dataField: "vchNo",
        caption: t("voucher_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
        showInPdf:true,
      },
       {
         dataField: "date",
         caption: t("date"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
         showInPdf:true,
       },
       {
        dataField: "gstin",
        caption: t("gst_in"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
        showInPdf:true,
      },
       {
         dataField: "party",
         caption: t("party"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         showInPdf:true,
        },
       {
         dataField: "address1",
         caption: t("address1"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
         showInPdf:true,
       },
       {
        dataField: "address2",
        caption: t("address2"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
      },
      {
        dataField: "refNumber",
        caption: t("ref_no"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "form",
        caption: t("form"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
      },
      {
        dataField: "cgstPerc",
        caption: t("cgstperc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "sgstPerc",
        caption: t("sgstperc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "igstPerc",
        caption: t("igstperc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "taxableValue",
        caption: t("taxable_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
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
        }}
      },
      {
        dataField: "cgst",
        caption: t("cgst"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
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
        }}
      },
      {
        dataField: "sgst",
        caption: t("sgst"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
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
        }}
      },
      {
        dataField: "igst",
        caption: t("igst"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
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
        }}
      },
       {
         dataField: "total",
         caption: t("total"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 80,
         showInPdf:true,
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
                 : getFormattedValue(cellElement.data.total);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.total == null
               ? ""
               : getFormattedValue(parseFloat(cellElement.data.total));
           }
         },
       },
       {
        dataField: "refDate",
        caption: t("ref_date"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "financialYearID",
        caption: t("financial_year_id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
        showInPdf:true,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "gstPercentage",
        caption: t("gstpercentage"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
        groupIndex:0
      },
      {
        dataField: "cessPerc",
        caption: t("cessperc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
       {
         dataField: "cessAmt",
         caption: t("cess_amount"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 80,
         showInPdf:true,
         cellRender: (
           cellElement: any,
           cellInfo: any,
           filter: any,
           exportCell: any
         ) => {
           if (exportCell != undefined) {
             const value =
               cellElement.data?.cessAmt == null
                 ? ""
                 : getFormattedValue(cellElement.data.cessAmt);
             return {
               ...exportCell,
               text: value,
               alignment: "right",
               alignmentExcel: { horizontal: "right" },
             };
           } else {
             return cellElement.data?.cessAmt == null
               ? ""
               : getFormattedValue(parseFloat(cellElement.data.cessAmt));
           }
         },
       },
       {
        dataField: "addCessPerc",
        caption: t("addcessperc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
       {
         dataField: "addCess",
         caption: t("addcess_amount"),
         dataType: "number",
         allowSearch: true,
         allowFiltering: true,
         width: 80,
         showInPdf:true,
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
        dataField: "hsnCode",
        caption: t("hsn_code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
      },
      {
        dataField: "qty",
        caption: t("quantity"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false,
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf:true,
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
   const customizeDateGroup = (itemInfo: any) => `Group Total`;
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
      {
        column:"party",
        summaryType:"custom",
        isGroupItem:true,
        showInGroupFooter:true,
        customizeText: customizeDateGroup,
      },
      {
        column: "taxableValue",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cgst",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "sgst",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "igst",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "total",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "cess",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "addCess",
        summaryType: "sum",
        isGroupItem:true,
        showInGroupFooter:true,
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
                gridHeader={t("purchase_gst_report")}
                dataUrl={Urls.purchase_gst_taxwise}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseGstReportFilter />}
                filterHeight={450}
                filterWidth={790}
                filterInitialData={PurchaseGstReportFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_purchase_gst_taxwise_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseTaxGSTTaxwise;
