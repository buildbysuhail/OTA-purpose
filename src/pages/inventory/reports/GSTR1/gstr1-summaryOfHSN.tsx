import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import GSTR1HSNSummaryFilter, {
  GSTR1HSNSummaryFilterInitialState,
} from "./gstr1-summaryOfHSN-filter";

const GSTR1HSNSummary = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "hsn",
      caption: t("hsn"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
      showInPdf: true,
    },
    {
      dataField: "uqc",
      caption: t("uqc"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "totalQuantity",
      caption: t("total_quantity"),
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
            cellElement.data?.totalQuantity == null
              ? ""
              : getFormattedValue(cellElement.data.totalQuantity, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalQuantity == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.totalQuantity),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "totalValue",
      caption: t("total_value"),
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
            cellElement.data?.totalValue == null
              ? ""
              : getFormattedValue(cellElement.data.totalValue, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalValue == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.totalValue),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "taxableValue",
      caption: t("taxable_value"),
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
            cellElement.data?.taxableValue == null
              ? ""
              : getFormattedValue(cellElement.data.taxableValue, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxableValue == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.taxableValue),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "rateOfTax",
      caption: t("rate_of_tax"),
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
            cellElement.data?.rateOfTax == null
              ? ""
              : getFormattedValue(cellElement.data.rateOfTax, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.rateOfTax == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.rateOfTax),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "integratedTaxAmount",
      caption: t("integrated_tax_amount"),
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
            cellElement.data?.integratedTaxAmount == null
              ? ""
              : getFormattedValue(
                  cellElement.data.integratedTaxAmount,
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
          return cellElement.data?.integratedTaxAmount == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.integratedTaxAmount),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "centralTaxAmount",
      caption: t("central_tax_amount"),
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
            cellElement.data?.centralTaxAmount == null
              ? ""
              : getFormattedValue(cellElement.data.centralTaxAmount, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.centralTaxAmount == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.centralTaxAmount),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "stateOrUTTaxAmount",
      caption: t("state_ut_tax_amount"),
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
            cellElement.data?.stateOrUTTaxAmount == null
              ? ""
              : getFormattedValue(
                  cellElement.data.stateOrUTTaxAmount,
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
          return cellElement.data?.stateOrUTTaxAmount == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.stateOrUTTaxAmount),
                false,
                2
              );
        }
      },
    },
    {
      dataField: "cessAmount",
      caption: t("cess_amount"),
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
            cellElement.data?.cessAmount == null
              ? ""
              : getFormattedValue(cellElement.data.cessAmount, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.cessAmount == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.cessAmount),
                false,
                2
              );
        }
      },
    },
  ];
  const { getFormattedValue } = useNumberFormat();
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption={true}
                gridHeader={t("gstr1_hsn_summary_report")}
                dataUrl={Urls.gstr1hsnSummary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<GSTR1HSNSummaryFilter />}
                filterWidth={328}
                filterHeight={330}
                filterInitialData={GSTR1HSNSummaryFilterInitialState}
                reload={true}
                gridId="grd_gstr1_hsn_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GSTR1HSNSummary;
