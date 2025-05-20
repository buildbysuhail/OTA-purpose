import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface CounterReport {
  invType: string;
  counterName: string;
  cashSalesAmt: number;
  cardSalesAmt: number;
  saleReturnAmt: number;
  netSales: number;
  counterBalance: number;
  counterID: number;
  creditAmt: number;
}

const CounterReport = () => {
  const { t } = useTranslation('accountsReport');
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
    }
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
      column: "cashSalesAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cardSalesAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "saleReturnAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netSales",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "counterBalance",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "creditAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
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
                gridHeader={t("counter_report")}
                dataUrl={Urls.counter_report}
                hideGridAddButton={true}
                enablefilter={false}
                method={ActionType.GET}
                reload={true}
                gridId="grd_counter_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CounterReport;