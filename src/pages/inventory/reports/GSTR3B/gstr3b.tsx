import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import GSTR3BReportFilter, {
  GSTR3BReportFilterInitialState,
} from "./gstr3b-filter";

const GSTR3BReport = () => {
  const [filter, setFilter] = useState<any>(GSTR3BReportFilterInitialState);
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [

      //eligible ITC
         {
        dataField: "details",
        caption: t("details"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
      },
      //inout
      {
        dataField: "types",
        caption: t("types"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
      },
      {
        dataField: "totalTaxableValue",
        caption: t("total_taxable_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
    cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.totalTaxableValue == null
                ? 0
                : getFormattedValue(cellElement.data.totalTaxableValue,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.totalTaxableValue == null
              ? 0
              : getFormattedValue(cellElement.data.totalTaxableValue,false,2);
          }
        },
      },

      {
        dataField: "integratedTax",
        caption: t("integrated_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
     cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.integratedTax == null
                ? 0
                : getFormattedValue(cellElement.data.integratedTax,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.integratedTax == null
              ? 0
              : getFormattedValue(cellElement.data.integratedTax,false,2);
          }
        },
      },
      {
        dataField: "centralTax",
        caption: t("central_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
    cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.centralTax == null
                ? 0
                : getFormattedValue(cellElement.data.centralTax,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.centralTax == null
              ? 0
              : getFormattedValue(cellElement.data.centralTax,false,2);
          }
        },
      },
      {
        dataField: "stateOrUTTax",
        caption: t("state_ut_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 120,
     cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stateOrUTTax == null
                ? 0
                : getFormattedValue(cellElement.data.stateOrUTTax,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stateOrUTTax == null
              ? 0
              : getFormattedValue(cellElement.data.stateOrUTTax,false,2);
          }
        },
      },
      {
        dataField: "cess",
        caption: t("cess"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
   cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cess == null
                ? 0
                : getFormattedValue(cellElement.data.cess,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cess == null
              ? 0
              : getFormattedValue(cellElement.data.cess,false,2);
          }
        },
      },
      //exempt
      {
        dataField: "natureOfSupplies",
        caption: t("nature_of_supplies"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
      },
      {
        dataField: "interStateSupplies",
        caption: t("inter_state_supplies"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
     cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.interStateSupplies == null
                ? 0
                : getFormattedValue(cellElement.data.interStateSupplies,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.interStateSupplies == null
              ? 0
              : getFormattedValue(cellElement.data.interStateSupplies,false,2);
          }
        },
      },
      {
        dataField: "intraStateSupplies",
        caption: t("intra_state_supplies"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
     cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.intraStateSupplies == null
                ? 0
                : getFormattedValue(cellElement.data.intraStateSupplies,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.intraStateSupplies == null
              ? 0
              : getFormattedValue(cellElement.data.intraStateSupplies,false,2);
          }
        },
      },
      //interstate

      {
        dataField: "placeOfSupply",
        caption: t("place_of_supply"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
      },
      {
        dataField: "unregisteredTaxableValue",
        caption: t("unregistered_taxable_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
   cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.unregisteredTaxableValue == null
                ? 0
                : getFormattedValue(cellElement.data.unregisteredTaxableValue,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.unregisteredTaxableValue == null
              ? 0
              : getFormattedValue(cellElement.data.unregisteredTaxableValue,false,2);
          }
        },
      },
      {
        dataField: "unregisteredIntegratedTax",
        caption: t("unregistered_integrated_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
    cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.unregisteredIntegratedTax == null
                ? 0
                : getFormattedValue(cellElement.data.unregisteredIntegratedTax,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.unregisteredIntegratedTax == null
              ? 0
              : getFormattedValue(cellElement.data.unregisteredIntegratedTax,false,2);
          }
        },
      },
      {
        dataField: "taxableTaxableValue",
        caption: t("taxable_taxable_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
      cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.taxableTaxableValue == null
                ? 0
                : getFormattedValue(cellElement.data.taxableTaxableValue,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.taxableTaxableValue == null
              ? 0
              : getFormattedValue(cellElement.data.taxableTaxableValue,false,2);
          }
        },
      },
      {
        dataField: "taxableIntegratedTax",
        caption: t("taxable_integrated_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 180,
     cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.taxableIntegratedTax == null
                ? 0
                : getFormattedValue(cellElement.data.taxableIntegratedTax,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.taxableIntegratedTax == null
              ? 0
              : getFormattedValue(cellElement.data.taxableIntegratedTax,false,2);
          }
        },
      },
      {
        dataField: "uinTaxableValue",
        caption: t("uin_taxable_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
    cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.uinTaxableValue == null
                ? 0
                : getFormattedValue(cellElement.data.uinTaxableValue,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.uinTaxableValue == null
              ? 0
              : getFormattedValue(cellElement.data.uinTaxableValue,false,2);
          }
        },
      },
      {
        dataField: "uinIntegratedTax",
        caption: t("uin_integrated_tax"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
       cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.uinIntegratedTax == null
                ? 0
                : getFormattedValue(cellElement.data.uinIntegratedTax,false,2);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.uinIntegratedTax == null
              ? 0
              : getFormattedValue(cellElement.data.uinIntegratedTax,false,2);
          }
        },
      },
    ];
    console.log(filter.supplyType );
    
    // Filter columns based on the `visible` property
    return baseColumns.filter((column) => {
      if (filter.supplyType == "inAndOutSupplies") {
        if (
          column.dataField == "types" ||
          column.dataField == "totalTaxableValue" ||
          column.dataField == "integratedTax" ||
          column.dataField == "centralTax" ||
          column.dataField == "stateOrUTTax" ||
          column.dataField == "cess"
        ) {
          return true;
        }
      }

      if (filter.supplyType == "eligibleITC") {
        if (
          column.dataField == "details" ||
          column.dataField == "integratedTax" ||
          column.dataField == "centralTax" ||
          column.dataField == "stateOrUTTax" ||
          column.dataField == "cess"
        ) {
          return true;
        }
      }

      if (filter.supplyType == "exemptNilRated") {
        if (
          column.dataField == "natureOfSupplies" ||
          column.dataField == "interStateSupplies" ||
          column.dataField == "intraStateSupplies"
        ) {
          return true;
        }
      }

      if (filter.supplyType == "interStateSupplies") {
        if (
          column.dataField == "placeOfSupply" ||
          column.dataField == "unregisteredTaxableValue" ||
          column.dataField == "unregisteredIntegratedTax" ||
          column.dataField == "taxableTaxableValue" ||
          column.dataField == "taxableIntegratedTax" ||
          column.dataField == "uinTaxableValue" ||
          column.dataField == "uinIntegratedTax"
        ) {
          return true;
        }
      }
      return false;
    });
  }, [t, filter.supplyType]);

  const { getFormattedValue } = useNumberFormat();

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
              key={filter.supplyType}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                gridHeader={t("gstr3b_report")}
                dataUrl={
                  filter.supplyType == "inAndOutSupplies"
                    ? Urls.gstr3b_InoutSupplies
                    : filter.supplyType == "eligibleITC"
                    ? Urls.gstr3b_EligibleITC
                    : filter.supplyType == "exemptNilRated"
                    ? Urls.gstr3b_ExemptNilRated
                    : Urls.gstr3b_InterstateSupplies
                }
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={filter.showFilterInitially}
                method={ActionType.POST}
                filterContent={<GSTR3BReportFilter />}
                filterWidth={790}
                filterHeight={370}
                onFilterChanged={(f: any) => {
                  setFilter({...f, showFilterInitially: false});
                }}
                filterInitialData={GSTR3BReportFilterInitialState}
                filterData={{changed: true, data:filter}}
                reload={true}
                gridId="grd_gstr3b_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GSTR3BReport;
