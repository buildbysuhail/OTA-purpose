import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig, } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { erpParseFloat } from "../../../../../utilities/Utils";
import { Button } from "@mui/material";

const CounterReport = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "invType",
      caption: t("inv_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
    },
    {
      dataField: "counterName",
      caption: t("counter_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 200,
    },
    {
      dataField: "cashSalesAmt",
      caption: t("cash_sales_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashSalesAmt == null
              ? 0
              : getFormattedValue(cellElement.data.cashSalesAmt, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cashSalesAmt == null
            ? 0
            : getFormattedValue(cellElement.data.cashSalesAmt, false, 4);
        }
      },
    },
    {
      dataField: "cardSalesAmt",
      caption: t("card_sales_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cardSalesAmt == null
              ? 0
              : getFormattedValue(cellElement.data.cardSalesAmt, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cardSalesAmt == null
            ? 0
            : getFormattedValue(cellElement.data.cardSalesAmt, false, 4);
        }
      },
    },
    {
      dataField: "saleReturnAmt",
      caption: t("sale_return_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.saleReturnAmt == null
              ? 0
              : getFormattedValue(cellElement.data.saleReturnAmt, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.saleReturnAmt == null
            ? 0
            : getFormattedValue(cellElement.data.saleReturnAmt, false, 4);
        }
      },
    },
    {
      dataField: "netSales",
      caption: t("net_sales"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.netSales == null
              ? 0
              : getFormattedValue(cellElement.data.netSales, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.netSales == null
            ? 0
            : getFormattedValue(cellElement.data.netSales, false, 4);
        }
      },
    },
    {
      dataField: "counterBalance",
      caption: t("counter_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.counterBalance == null
              ? 0
              : getFormattedValue(cellElement.data.counterBalance, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.counterBalance == null
            ? 0
            : getFormattedValue(cellElement.data.counterBalance, false, 4);
        }
      },
    },
    {
      dataField: "counterID",
      caption: t("counter_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: false,
      visible: false,
      width: 30,
    },
    {
      dataField: "creditAmt",
      caption: t("credit_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.creditAmt == null
              ? 0
              : getFormattedValue(cellElement.data.creditAmt, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.creditAmt == null
            ? 0
            : getFormattedValue(cellElement.data.creditAmt, false, 4);
        }
      },
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(value, false, 2) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "counterName",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "cashSalesAmt",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "cardSalesAmt",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "saleReturnAmt",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "netSales",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "counterBalance",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
    {
      column: "creditAmt",
      summaryType: "custom",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value, false, 4));
      },
    },
  ];


  const [asonDate, setAsonDate] = useState(new Date());
  const [filter, setFilter] = useState({ asonDate: new Date() });

const handleChangeDate = (delta: number) => {
    const newDate = new Date(asonDate);
    newDate.setDate(newDate.getDate() + delta);
    setAsonDate(newDate);
    setFilter((prevFilter) => ({
      ...prevFilter,
      asonDate: newDate,
    }));
  };
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key={asonDate.toISOString()}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                filterInitialData={{ asonDate }}
                // onFilterChanged={(newFilter: any) => setFilter(newFilter)}
                // gridHeader={t("counter_report")}
                // filterText="On : {asonDate}"
                gridHeader={`${t("counter_report")} On: ${asonDate.toLocaleDateString()}`}
                // filterText={`On: ${asonDate.toLocaleDateString()}`}
                dataUrl={Urls.counter_report}
                hideGridAddButton={true}
                enablefilter={false}
                method={ActionType.POST}
                reload={true}
                gridId="grd_counter_report"
                showPlusMinusButton={true}
                // postData={{ ...filter, asonDate }}
                customToolbarItems={[
                  { location: 'before', item: (<Button variant="contained" color="inherit" onClick={()=>handleChangeDate(-1)}> {t("-")}  </Button>) },
                  { location: 'before', item: (<Button variant="contained" color="inherit" onClick={()=>handleChangeDate(1)}> {t("+")}  </Button>) },]}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CounterReport;
