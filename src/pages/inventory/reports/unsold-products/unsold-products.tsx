import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import GridId from "../../../../redux/gridId";
import moment from "moment";
import UnsoldProductReportFilter, {
  UnsoldProductReportFilterInitialState,
} from "./unsold-products-filter";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

const UnsoldProductReport = () => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("sl_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "supplier",
      caption: t("supplier"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 200,
    },

    {
      dataField: "mannualBarcode",
      caption: t("mannual_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },

    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.quantity == null
              ? 0
              : getFormattedValue(cellElement.data.quantity, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.quantity == null
            ? 0
            : getFormattedValue(cellElement.data.quantity, false, 4);
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
      column: "autoBarcode",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "quantity",
      summaryType: "sum",
      valueFormat: "fixedPoint",
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
                filterText="{branchid > -1 && of Branch : [branch]} {routeID > 1 && ,Route Name : [route]} Puchase From Date : {fromDate} - {toDate} , Sales From Date : {fromDateSales} - {toDateSales}"
                columns={columns}
                gridHeader={t("unsold_product_report")}
                dataUrl={Urls.unsold_products_reports}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<UnsoldProductReportFilter />}
                filterWidth={700}
                filterHeight={400}
                filterInitialData={{
                  ...UnsoldProductReportFilterInitialState,
                  branchid: userSession.currentBranchId,
                  branch: userSession.currentBranchName,
                  fromDate: userSession.finFrom,
                }}
                reload={true}
                gridId={GridId.unsold_products_report}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default UnsoldProductReport;
