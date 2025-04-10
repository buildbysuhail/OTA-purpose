import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import moment from "moment";
import PurchaseGstReportFilter, { PurchaseGstReportFilterInitialState } from "./purchase-tax-gst-report-filter";


const PurchaseTaxGSTDetailed = () => {
  const { t } = useTranslation("inventory");
 const [filter, setFilter] = useState<any>(PurchaseGstReportFilterInitialState);
     const columns: DevGridColumn[] = [
      {
        dataField: "iD",
        caption: t("Form"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 50,
      },
      {
        dataField: "vchNo",
        caption: t("VoucherNumber"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
      },
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
        dataField: "gSTIN",
        caption: t("GSTIN"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 75,
      },
       {
         dataField: "party",
         caption: t("Party"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
        },
       {
         dataField: "address1",
         caption: t("Address1"),
         dataType: "string",
         allowSearch: true,
         allowFiltering: true,
         width: 100,
       },
       {
        dataField: "address2",
        caption: t("Address2"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "refNumber",
        caption: t("RefNumber"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "form",
        caption: t("From"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cGSTPerc",
        caption: t("CGSTPerc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "sGSTPerc",
        caption: t("SGSTPerc"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "iGSTPerc",
        caption: t("IGSTPerc"),
        dataType: "number",
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
        }}
      },
      {
        dataField: "cGST",
        caption: t("CGST"),
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
            cellElement.data?.cGST == null
              ? ""
              : getFormattedValue(cellElement.data.cGST);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cGST == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cGST));
        }}
      },
      {
        dataField: "sGST",
        caption: t("SGST"),
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
            cellElement.data?.sGST == null
              ? ""
              : getFormattedValue(cellElement.data.sGST);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.sGST == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.sGST));
        }}
      },
      {
        dataField: "iGST",
        caption: t("IGST"),
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
            cellElement.data?.iGST == null
              ? ""
              : getFormattedValue(cellElement.data.iGST);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.iGST == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.iGST));
        }}
      },
       {
         dataField: "total",
         caption: t("Total"),
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
        caption: t("Ref.Date"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "remarks",
        caption: t("Remarks"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "financialYearID",
        caption: t("FinancialYearID"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "productName",
        caption: t("Product Name"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "gstPercentage",
        caption: t("Gst Percentage"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "cessPerc",
        caption: t("Cess Percentage"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
       {
         dataField: "cessAmt",
         caption: t("Cess Amount"),
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
        caption: t("Add.Cess Percentage"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
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
        dataField: "hSNCode",
        caption: t("HSN Code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "qty",
        caption: t("Quantity"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unit",
        caption: t("Unit"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "groupName",
        caption: t("Group Name"),
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
                gridHeader={t("purchase_gst_report")}
                dataUrl={Urls.purchase_gst_detailed}
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
                gridId="grd_purchase_gst_detailed_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseTaxGSTDetailed;
