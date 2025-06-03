import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import moment from "moment";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";

const SalesAndSalesReturn = () => {
  const { t } = useTranslation("accountsReport");
  const [filterState, setFilterState] = useState({
    dateFrom: moment().local().toDate(),
    dateTo: moment().local().toDate(),
    printLineBetweenRows: false,
  });

  const handleFieldChange = (field: string, value: boolean) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleShow = () => {
    // Add refresh logic here
  };

  const summaryColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("sl_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 55,
      showInPdf: true,
    },
    {
      dataField: "transactionDate",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
    },
    {
      dataField: "salesAmt",
      caption: t("sales_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "cashAmt",
      caption: t("cash_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "creditAmt",
      caption: t("credit_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "bankAmt",
      caption: t("bank_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "saleReturnAmt",
      caption: t("return_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "salesDisc",
      caption: t("sales_disc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
  ];

  const detailedColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("sl_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 55,
      showInPdf: true,
    },
    {
      dataField: "vNo",
      caption: t("v_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "transDate",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "vType",
      caption: t("v_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "salesAmt",
      caption: t("sales_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "cashAmt",
      caption: t("cash_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "creditAmt",
      caption: t("credit_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "bankAmt",
      caption: t("bank_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "saleReturnAmt",
      caption: t("return_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
  ];

  const { getFormattedValue } = useNumberFormat();
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
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "salesAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "cashAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "creditAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "bankAmt",
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
      column: "balance",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "salesDisc",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];

  return (
    <Fragment>
      <div className="p-4">
        <div className="flex items-end gap-4">
          <ERPCheckbox
            checked={filterState.printLineBetweenRows}
            onChange={(e) =>
              handleFieldChange("printLineBetweenRows", e.target.checked)
            }
            label={t("print_line_between_rows")}
            id={""}
          />
          <ERPDateInput
            value={filterState.dateFrom}
            label={t("date_from")}
            onChangeData={(data) =>
              handleFieldChange("dateFrom", data.dateFrom)
            }
            id={""}
          />
          <ERPDateInput
            value={filterState.dateTo}
            label={t("date_to")}
            onChangeData={(data) => handleFieldChange("dateTo", data.dateTo)}
            id={""}
          />
          <ERPButton
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-1"
            title={t("show")}
            onClick={handleShow}
          />
        </div>

        <div className="grid grid-cols-12 gap-x-6 mt-4">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="grid grid-cols-2 gap-4 px-4 pt-4 pb-2">
              <div className="grid grid-cols-1 gap-3 mb-3">
                <ErpDevGrid
                  summaryItems={summaryItems}
                  remoteOperations={{
                    filtering: false,
                    paging: false,
                    sorting: false,
                  }}
                  columns={summaryColumns}
                  moreOption={false}
                  gridHeader={t("sales_summary_report")}
                  dataUrl={Urls.sales_and_sales_return}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={false}
                  method={ActionType.POST}
                  reload={true}
                  gridId="grd_sales_summary"
                  extraParams={filterState}
                  height={700}
                  // hideDefaultExportButton={true}
                  hideDefaultSearchPanel={true}
                  hideGridHeader={true}
                  enableScrollButton={false}
                  // showPrintButton={false}
                  ShowGridPreferenceChooser={false}
                  allowSearching={false}
                  // allowExport={false}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  summaryItems={summaryItems}
                  remoteOperations={{
                    filtering: false,
                    paging: false,
                    sorting: false,
                  }}
                  columns={detailedColumns}
                  moreOption={false}
                  gridHeader={t("sales_detail_report")}
                  dataUrl={Urls.sales_and_sales_return}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={false}
                  method={ActionType.POST}
                  reload={true}
                  gridId="grd_sales_detail"
                  extraParams={filterState}
                  height={700}
                  // hideDefaultExportButton={true}
                  hideDefaultSearchPanel={true}
                  hideGridHeader={true}
                  enableScrollButton={false}
                  // showPrintButton={false}
                  ShowGridPreferenceChooser={false}
                  allowSearching={false}
                  // allowExport={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SalesAndSalesReturn;
