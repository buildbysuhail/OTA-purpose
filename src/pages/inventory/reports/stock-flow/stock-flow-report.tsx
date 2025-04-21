import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import StockFlowReportFilter, { StockFlowReportFilterInitialState } from "./stock-flow-report-filter";
import Urls from "../../../../redux/urls";

const StockFlowReport = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 130,
    },
    {
      dataField: "productCode",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 75,
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 130,
    },
    {
      dataField: "opStk",
      caption: t("op_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
    },
    {
      dataField: "opVal",
      caption: t("op_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "piStk",
      caption: t("pi_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
    },
    {
      dataField: "piVal",
      caption: t("pi_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "srStk",
      caption: t("sr_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
    },
    {
      dataField: "srVal",
      caption: t("sr_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "siStk",
      caption: t("si_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
    },
    {
      dataField: "siVal",
      caption: t("si_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "prStk",
      caption: t("pr_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
    },
    {
      dataField: "prVal",
      caption: t("pr_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "clStk",
      caption: t("cl_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
    },
    {
      dataField: "clVal",
      caption: t("cl_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "productID",
      caption: t("product_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "warehouse",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "stInStk",
      caption: t("st_in_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "stInVal",
      caption: t("st_in_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "stOutStk",
      caption: t("st_out_stk"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "stOutVal",
      caption: t("st_out_val"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "sectionName",
      caption: t("section"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "opStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "opVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "piStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "piVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "srStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "srVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "siStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "siVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "prStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "prVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "clStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "clVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stInStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stInVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stOutStk",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: customizeSummaryRow,
    },
    {
      column: "stOutVal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption={true}
                gridHeader={t("stock_flow_report")}
                dataUrl={Urls.stock_flow_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<StockFlowReportFilter />}
                filterWidth={790}
                filterHeight={340}
                filterInitialData={StockFlowReportFilterInitialState}
                reload={true}
                gridId="grd_stock_flow_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StockFlowReport;