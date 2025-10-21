import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import moment from "moment";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";

const SalesAndSalesReturn = () => {
  const { t } = useTranslation("accountsReport");
  const [filterState, setFilterState] = useState({
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
    printLineBetweenRows: false,
  });

  const handleFieldChange = (field: string, value: any) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const [reload, setReload] = useState<boolean>(true);
  const handleShow = () => {
    setReload(true);
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
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      format: "dd-MMM-yyyy",
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.salesAmt == null
              ? ""
              : getFormattedValue(cellElement.data.salesAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.salesAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.salesAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashAmt == null
              ? ""
              : getFormattedValue(cellElement.data.cashAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cashAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cashAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.creditAmt == null
              ? ""
              : getFormattedValue(cellElement.data.creditAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.creditAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.creditAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.bankAmt == null
              ? ""
              : getFormattedValue(cellElement.data.bankAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.bankAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.bankAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.saleReturnAmt == null
              ? ""
              : getFormattedValue(cellElement.data.saleReturnAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.saleReturnAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.saleReturnAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.balance == null
              ? ""
              : getFormattedValue(cellElement.data.balance);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.balance == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.balance));
        }
      },
    },
    {
      dataField: "refund",
      caption: t("refund"),
      dataType: "number",
      allowSearch: true,
      visible: false,
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
            cellElement.data?.refund == null
              ? ""
              : getFormattedValue(cellElement.data.refund);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.refund == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.refund));
        }
      },
    },
    //just column with assign 0 from 1050 in all rows
    // {
    //   dataField: "salesDisc",
    //   caption: t("sales_disc"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   allowSorting: true,
    //   width: 80,
    //   showInPdf: true,
    // },
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
      dataField: "transactionDate",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      format: "dd-MMM-yyyy",
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.salesAmt == null
              ? ""
              : getFormattedValue(cellElement.data.salesAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.salesAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.salesAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.cashAmt == null
              ? ""
              : getFormattedValue(cellElement.data.cashAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cashAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.cashAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.creditAmt == null
              ? ""
              : getFormattedValue(cellElement.data.creditAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.creditAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.creditAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.bankAmt == null
              ? ""
              : getFormattedValue(cellElement.data.bankAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.bankAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.bankAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.saleReturnAmt == null
              ? ""
              : getFormattedValue(cellElement.data.saleReturnAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.saleReturnAmt == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.saleReturnAmt));
        }
      },
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
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.balance == null
              ? ""
              : getFormattedValue(cellElement.data.balance);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.balance == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.balance));
        }
      },
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
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "transactionDate",
      summaryType: "custom",
      customizeText: customizeTotal,
    },
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
            value={filterState.fromDate}
            label={t("date_from")}
            onChange={(e) => handleFieldChange("fromDate", e.target.value)}
            id={""}
          />
          <ERPDateInput
            value={filterState.toDate}
            label={t("date_to")}
            onChange={(e) => handleFieldChange("toDate", e.target.value)}
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
                    filtering: true,
                    paging: true,
                    sorting: true,
                    summary: true,
                  }}
                  columns={summaryColumns}

                  moreOption={false}
                  gridHeader={t("sales_summary_report")}
                  dataUrl={Urls.sales_and_sales_return_master}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={false}
                  method={ActionType.POST}
                  reload={reload}
                  changeReload={(e) => setReload(false)}
                  gridId="grd_sales_summary"
                  postData={filterState}
                  height={700}
                  // hideDefaultExportButton={true}
                  hideDefaultSearchPanel={true}
                  hideGridHeader={true}
                  enableScrollButton={false}
                  // showPrintButton={false}
                  ShowGridPreferenceChooser={true}
                  allowSearching={false}
                  // allowExport={false}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  summaryItems={summaryItems}
                  remoteOperations={{
                    filtering: true,
                    paging: true,
                    sorting: true,
                    summary: true,
                  }}
                  allowColumnChooser={true}
                  columns={detailedColumns}
                  moreOption={false}
                  gridHeader={t("sales_detail_report")}
                  dataUrl={Urls.sales_and_sales_return_details}
                  hideGridAddButton={true}
                  enablefilter={false}
                  postData={filterState}
                  showFilterInitially={false}
                  method={ActionType.POST}
                  reload={reload}
                  gridId="grd_sales_detail"
                  extraParams={filterState}
                  height={700}
                  // hideDefaultExportButton={true}
                  hideDefaultSearchPanel={true}
                  hideGridHeader={true}
                  enableScrollButton={false}
                  // showPrintButton={false}
                  ShowGridPreferenceChooser={true}
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
