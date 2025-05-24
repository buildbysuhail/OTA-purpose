import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import DailyBalanceReportFilter, {
  DailyBalanceReportFilterInitialState,
} from "./daily-balance-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const DailyBalanceAmount = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("accountsReport");
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "customer",
      caption: t("customerName"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
      showInPdf: true,
    },
    {
      dataField: "openingBalance",
      caption: t("opening_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.openingBalance == null
              ? ""
              : getFormattedValue(cellElement.data.openingBalance);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.openingBalance == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.openingBalance));
        }
      },
    },
    {
      dataField: "billed",
      caption: t("billAmount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.billed == null
              ? ""
              : getFormattedValue(cellElement.data.billed);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.billed == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.billed));
        }
      },
    },
    {
      dataField: "received",
      caption: t("receivedAmount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.received == null
              ? ""
              : getFormattedValue(cellElement.data.received);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.received == null
            ? ""
            : getFormattedValue(parseFloat(cellElement.data.received));
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
      minWidth: 200,
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
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  filterText=": {fromDate} - {toDate}"
                  columns={columns}
                  gridHeader={t("daily_balance_report")}
                  dataUrl={Urls.inv_reports_daily_balance_report}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<DailyBalanceReportFilter />}
                  filterWidth={335}
                  filterHeight={160}
                  filterInitialData={DailyBalanceReportFilterInitialState}
                  reload={true}
                  gridId="grd_daily_balance"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DailyBalanceAmount;
