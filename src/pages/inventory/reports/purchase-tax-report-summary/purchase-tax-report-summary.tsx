import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { APIClient } from "../../../../helpers/api-client";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PurchaseTaxReportDetailedFilter, {
  PurchaseTaxReportDetailedFilterInitialState,
} from "../purchase-tax-report-detailed/purchase-tax-report-detailed-filter";
import moment from "moment";

interface PurchaseTaxReportSummary {
  date?: string;
  taxCategory?: number;
  vatPercentage?: number;
  taxableValue?: number;
  totalVAT?: number;
  total?: number;
}

const api = new APIClient();
const PurchaseTaxReportSummary = () => {
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(
    PurchaseTaxReportDetailedFilterInitialState
  );
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const onApplyFilter = useCallback((_filter: any) => {
    setFilter({ ..._filter });
  }, []);
  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const columns: DevGridColumn[] = [
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
      dataField: "taxCategory",
      caption: t("tax_category"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "vatPercentage",
      caption: t("vat_%"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "taxableValue",
      caption: t("taxable_value"),
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
              : getFormattedValue(cellElement.data.taxableValue, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxableValue == null
            ? ""
            : getFormattedValue(cellElement.data.taxableValue, false, 4);
        }
      },
    },
    {
      dataField: "totalVAT",
      caption: t("total_vat"),
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
            cellElement.data?.totalVAT == null
              ? ""
              : getFormattedValue(cellElement.data.totalVAT, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalVAT == null
            ? ""
            : getFormattedValue(cellElement.data.totalVAT, false, 4);
        }
      },
    },
    {
      dataField: "total",
      caption: t("total"),
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
            cellElement.data?.total == null
              ? ""
              : getFormattedValue(cellElement.data.total, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.total == null
            ? ""
            : getFormattedValue(cellElement.data.total, false, 4);
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
      return getFormattedValue(value, false, 4) || "0";
    };
  }, [getFormattedValue]);
  const customizeSummaryRow2 = useMemo(() => {
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
      column: "taxableValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow2,
    },
    {
      column: "totalVAT",
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
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption
                filterText=" {fromDate} - {toDate} "
                gridHeader={t("purchase_tax_report_summary")}
                dataUrl={Urls.purchase_tax_report_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PurchaseTaxReportDetailedFilter />}
                filterHeight={210}
                filterWidth={330}
                filterInitialData={PurchaseTaxReportDetailedFilterInitialState}
                onFilterChanged={(f: any) => {
                  setFilter(f);
                }}
                reload={true}
                gridId="grd_purchase_tax_report_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default PurchaseTaxReportSummary;
