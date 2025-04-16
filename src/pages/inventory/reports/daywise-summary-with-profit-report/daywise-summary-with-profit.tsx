import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import DaywiseSummaryWithProfitFilter, { DaywiseSummaryWithProfitFilterInitialState } from "./daywise-summary-with-profit-filter";

const DaywiseSummaryWithProfit = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "date",
            caption: t("date"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "totalGross",
            caption: t("totalGross"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "totalVAT",
            caption: t("totalVAT"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "totalDiscount",
            caption: t("totalDiscount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "billDiscount",
            caption: t("billDiscount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "grandTotal",
            caption: t("grandTotal"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "cost",
            caption: t("cost"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "profit",
            caption: t("profit"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "gpPercentage",
            caption: t("gp_%"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "markupPercentage",
            caption: t("markup_%"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
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
            column: "totalGross",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "totalVAT",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "totalDiscount",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "billDiscount",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "grandTotal",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "cost",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "profit",
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
                                gridHeader={t("daywise_summary_with_profit")}
                                dataUrl={Urls.daywise_summary_with_profit}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<DaywiseSummaryWithProfitFilter />}
                                filterWidth={790}
                                filterHeight={270}
                                filterInitialData={DaywiseSummaryWithProfitFilterInitialState}
                                reload={true}
                                gridId="grd_daywise_summary_with_profit"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DaywiseSummaryWithProfit;