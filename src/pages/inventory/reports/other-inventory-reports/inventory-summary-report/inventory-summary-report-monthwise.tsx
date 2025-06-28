import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  DrillDownCellTemplate,
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import InventorySummaryReportFilter, {
  InventorySummaryReportFilterInitialState,
} from "./inventory-summary-report-filter";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../../utilities/Utils";
import InventorySummaryReportDetailed from "./inventory-summary-detailed";

interface InventorySummaryReportMonthwiseProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?: any;
}
const InventorySummaryReportMonthwise: FC<
  InventorySummaryReportMonthwiseProps
> = ({ postData, contentProps, rowData, origin }) => {
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 250,
      showInPdf: true,
    },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      visible: true,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      visible: true,
       cellRender: (cellElement: any, cellInfo: any) => {
          return (
            <DrillDownCellTemplate
              data={cellElement}
              field="month"
            ></DrillDownCellTemplate>
          );
        },
      },

    {
      dataField: "grandTotal",
      caption: t("total"),
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
            cellElement.data?.grandTotal == null
              ? 0
              : getFormattedValue(cellElement.data.grandTotal, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.grandTotal == null
            ? 0
            : getFormattedValue(cellElement.data.grandTotal, false, 4);
        }
      },
    },
  ];
  const customizeTotal = (itemInfo: any) => `Total`;
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
      column: "month",
      summaryType: "max",
      customizeText: customizeTotal,
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
                }}
                columns={columns}
                filterText='Inventory Report (Month View) of {**** (voucherTypeName)} : Branch : {**** (branchName)} , As On Date : {**** (asonDate)}'
                // gridHeader={t("inventory_summary_report")}
                dataUrl={Urls.inventory_summary_report_monthwise}
                hideGridAddButton={true}
                method={ActionType.POST}
                reload={true}
                gridId="grd_inventory_summary_report"
                postData={mergeObjectsRemovingIdenticalKeys(
                  postData,
                  contentProps
                )}
                 childPopupProps={{
                    content: <InventorySummaryReportDetailed postData={{ ...mergeObjectsRemovingIdenticalKeys(postData, contentProps) }} />,
                    title: t("inventory_summary_report"),
                    isForm: false,
                    width: 1300,
                    drillDownCells: "month",
                    bodyProps: "month",

                  }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default InventorySummaryReportMonthwise;
