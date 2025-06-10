import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import PrivilegeCardReportFilter, {
  PrivilegeCardReportFilterInitialState,
} from "./privilege-card-report-filter";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const PrivilegeCardReport = () => {
  const userSession = useSelector((state: RootState) => state.UserSession);
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "billNo",
      caption: t("bill_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "billAmount",
      caption: t("bill_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "cardNumber",
      caption: t("card_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
    },
    {
      dataField: "addAmt",
      caption: t("add_amt"),
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
            cellElement.data?.addAmt == null
              ? ""
              : getFormattedValue(cellElement.data.addAmt);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.addAmt == null
            ? ""
            : getFormattedValue(cellElement.data.addAmt);
        }
      },
    },
    {
      dataField: "redeem",
      caption: t("redeem"),
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
            cellElement.data?.redeem == null
              ? ""
              : getFormattedValue(cellElement.data.redeem);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.redeem == null
            ? ""
            : getFormattedValue(cellElement.data.redeem);
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
            : getFormattedValue(cellElement.data.balance);
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
      return getFormattedValue(value, false, 2) || "0";
    };
  }, [getFormattedValue]);
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "billNo",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "addAmt",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "redeem",
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
                filterText="{cardNo !='' && No: [cardNo]} {cardNo =='' && Report}"
                gridHeader={t("privilege_card")}
                dataUrl={Urls.privilege_card_report}
                hideGridAddButton={true}
                enablefilter={true}
                method={ActionType.POST}
                filterContent={<PrivilegeCardReportFilter />}
                filterWidth={600}
                filterHeight={250}
                filterInitialData={{
                  ...PrivilegeCardReportFilterInitialState,
                  dateFrom: moment(userSession.finFrom).local().startOf("day"),
                }}
                reload={true}
                gridId="grd_privilege_card_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PrivilegeCardReport;
