import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import RouteWiseSalesAndCollectionFilter, { RouteWiseSalesAndCollectionFilterInitialState } from "./routewise-sales-and-collection-filter";

interface RouteWiseSalesAndCollection {
  transactionDate: string;
  salesRouteID: number;
  routeName: string;
  salesTarget: number;
  totalSales: number;
  partyName: string;
  totalCollection: number;
  month: string;
  year: number;
}

const RouteWiseSalesAndCollection = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "salesTarget",
      caption: t("sales_target"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "totalSales",
      caption: t("total_sales"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 140,
      showInPdf: true,
    },
    {
      dataField: "totalCollection",
      caption: t("total_collection"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    }
  ];
  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "salesTarget",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totalSales",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totalCollection",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption={true}
                gridHeader={t("routewise_sales_collection_report")}
                dataUrl={Urls.routewise_sales_collection}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<RouteWiseSalesAndCollectionFilter />}
                filterWidth={600}
                filterHeight={150}
                filterInitialData={RouteWiseSalesAndCollectionFilterInitialState}
                reload={true}
                gridId="grd_routewise_sales_collection"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default RouteWiseSalesAndCollection;