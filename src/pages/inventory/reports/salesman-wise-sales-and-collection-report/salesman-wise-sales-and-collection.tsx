import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import SalesmanwiseSalesAndCollectionFilter, { SalesmanwiseSalesAndCollectionFilterInitialState } from "./salesman-wise-sales-and-collection-filter";

const SalesmanwiseSalesAndCollection = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "salesManID",
            caption: t("salesman_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: false,
        },
        {
            dataField: "salesMan",
            caption: t("salesman"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "salesRouteID",
            caption: t("sales_route_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: false,
        },
        {
            dataField: "routeName",
            caption: t("route_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            visible: true,
        },
        {
            dataField: "salesTarget",
            caption: t("sales_target"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "incentivePercentage",
            caption: t("incentive_percent"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "totalSales",
            caption: t("total_sales"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "profit",
            caption: t("profit"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "totalCollection",
            caption: t("total_collection"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "collectionPercentage",
            caption: t("collection_percent"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "profitAsPerCollection",
            caption: t("profit_as_per_collection"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "incentiveAsPerProfit",
            caption: t("incentive_as_per_profit"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
        {
            dataField: "incentiveAsPerCollection",
            caption: t("incentive_as_per_collection"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
        },
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
            column: "profit",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "totalCollection",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "incentiveAsPerProfit",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "incentiveAsPerCollection",
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
                                gridHeader={t("salesmanwise_sales_and_collection_report")}
                                dataUrl={Urls.salesmanwise_sales_and_collection}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<SalesmanwiseSalesAndCollectionFilter />}
                                filterWidth={420}
                                filterHeight={170}
                                filterInitialData={SalesmanwiseSalesAndCollectionFilterInitialState}
                                reload={true}
                                gridId="grd_salesmanwise_sales_and_collection"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SalesmanwiseSalesAndCollection;