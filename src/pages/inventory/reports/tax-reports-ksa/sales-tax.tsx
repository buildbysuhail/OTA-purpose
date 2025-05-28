import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import PurchaseTaxReportFilter, {
  PurchaseTaxReportFilterInitialState,
} from "./Purchase-Tax-report-filter";

const SalesTax = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "customerName",
      caption: t("customer_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "prefix",
      caption: t("prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "invoiceNumber",
      caption: t("invoice_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "taxableAmount",
      caption: t("taxable_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxableAmount == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.taxableAmount)
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return (
            <span>
              {cellElement.data?.taxableAmount == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.taxableAmount)
                  )}
            </span>
          );
        }
      },
    },
    {
      dataField: "vatPercentage",
      caption: t("vat_percentage"),
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
            cellElement.data?.vatPercentage == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.vatPercentage),
                  false,
                  2
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return (
            <span>
              {cellElement.data?.vatPercentage == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.vatPercentage),
                    false,
                    2
                  )}
            </span>
          );
        }
      },
    },
    {
      dataField: "vatAmount",
      caption: t("vat_amount"),
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
            cellElement.data?.vatAmount == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.vatAmount),
                  false,
                  4
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return (
            <span>
              {cellElement.data?.vatAmount == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.vatAmount),
                    false,
                    4
                  )}
            </span>
          );
        }
      },
    },
    {
      dataField: "amount",
      caption: t("amount"),
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
            cellElement.data?.amount == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.amount));
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return (
            <span>
              {cellElement.data?.amount == null
                ? ""
                : getFormattedValue(Number.parseFloat(cellElement.data.amount))}
            </span>
          );
        }
      },
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "crNumber",
      caption: t("cr_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "creditOrCash",
      caption: t("credit_or_cash"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "transactionType",
      caption: t("transaction_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(
                  Number.parseFloat(cellElement.data.grandTotal)
                );
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return (
            <span>
              {cellElement.data?.grandTotal == null
                ? ""
                : getFormattedValue(
                    Number.parseFloat(cellElement.data.grandTotal)
                  )}
            </span>
          );
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
  const customizeSummaryRow4 = useMemo(() => {
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
      return value || "0";
    };
  }, []);

  const summaryItems: SummaryConfig[] = [
    {
      column: "customerName",
      summaryType: "custom",
      valueFormat: "string",
      displayFormat: "TOTAL",
    },
    {
      column: "taxableAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "vatAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow4,
    },
    {
      column: "amount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "grandTotal",
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
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={columns}
                moreOption={true}
                filterText=":{fromDate} - {toDate}"
                gridHeader={t("monthly_vat_sales_statement_report")}
                dataUrl={Urls.sales_tax}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseTaxReportFilter />}
                filterWidth={340}
                filterHeight={170}
                filterInitialData={PurchaseTaxReportFilterInitialState}
                reload={true}
                gridId="grd_sales_tax_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SalesTax;
