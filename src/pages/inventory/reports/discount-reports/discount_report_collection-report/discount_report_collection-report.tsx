import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid, { SummaryConfig, } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import GridId from "../../../../../redux/gridId";
import DiscountReportCollectionFilter, { DiscountReportCollectionFilterInitialState, } from "./discount_report_collection-report-filter";
import {  isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";

const DiscountReportCollection = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      format: "dd-MMM-yyyy",
      width: 70,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 200,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 85,
    },
    {
      dataField: "vchPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 60,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 70,
    },
    {
      dataField: "vType",
      caption: t("v_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 70,
    },
    {
      dataField: "discount",
      caption: t("discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.discount == null
              ? 0
              : getFormattedValue(cellElement.data.discount, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.discount == null
            ? 0
            : getFormattedValue(cellElement.data.discount, false, 4);
        }
      },
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 150,
    },
  ];

  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const { getFormattedValue } = useNumberFormat();
  const summaryItems: SummaryConfig[] = [
    {
      column: "address1",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "discount",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: (itemInfo: { value: any }) => {
        return (
          getFormattedValue(
            parseFloat(
              getFormattedValue(
                isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
              ).replace(/,/g, "") || "0"
            ),
            false,
            2
          ) || "0"
        );
      },
      cellSummaryAction: (value: number) => {
        return getFormattedValue(value, false, 4);
      },
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
                filterText="{salesRouteID > 0 && Route Name : [salesRoute]} Between : {fromDate} - {toDate}"
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                gridHeader={t("collection_discount_report")}
                dataUrl={Urls.discount_report_collection}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<DiscountReportCollectionFilter />}
                filterWidth={700}
                filterHeight={100}
                filterInitialData={DiscountReportCollectionFilterInitialState}
                reload={true}
                gridId={GridId.discount_report_collection}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DiscountReportCollection;
