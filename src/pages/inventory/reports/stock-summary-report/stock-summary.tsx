import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import StockSummaryFilter, { StockSummaryFilterInitialState } from "./stock-summary-filter";
import Urls from "../../../../redux/urls";

const StockSummary = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "group",
            caption: t("product_group"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "productName",
            caption: t("product_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "stock",
            caption: t("stock"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 75,
        },
        {
            dataField: "unit",
            caption: t("unit"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 50,
        },
        {
            dataField: "stdPPrice",
            caption: t("p_rate"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 75,
        },
        {
            dataField: "stockValue",
            caption: t("stock_value"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 75,
        },
        {
            dataField: "stdSPrice",
            caption: t("s_rate"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 75,
        },
        {
            dataField: "stockDetails",
            caption: t("stock_details"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "code",
            caption: t("p_code"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "autoBarcode",
            caption: t("barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "category",
            caption: t("category"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "brand",
            caption: t("brand_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "msp",
            caption: t("msp"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 100,
        },
        {
            dataField: "mrp",
            caption: t("mrp"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 100,
        },
        {
            dataField: "modelNo",
            caption: t("model_no"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 100,
        },
        {
            dataField: "specification",
            caption: t("specification"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 100,
        },
        {
            dataField: "id",
            caption: t("id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 100,
        },
        {
            dataField: "arabicName",
            caption: t("arabic_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "reOrderQty",
            caption: t("order_qty"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "warranty",
            caption: t("warranty"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 60,
        },
        {
            dataField: "colour",
            caption: t("colour"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 60,
        },
        {
            dataField: "stockNOs",
            caption: t("stock_nos"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 60,
        },
        {
            dataField: "mannualBarcode",
            caption: t("mannual_barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 120,
        },
        {
            dataField: "groupCategoryName",
            caption: t("group_category_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 80,
        },
        {
            dataField: "sectionName",
            caption: t("section_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            visible: false,
            width: 80,
        },
        {
            dataField: "unitQty",
            caption: t("unit_qty"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 60,
        },
        {
            dataField: "batchNo",
            caption: t("batch"),
            dataType: "string",
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
            column: "stock",
            summaryType: "sum",
            valueFormat: "fixedPoint",
            customizeText: customizeSummaryRow,
        },
        {
            column: "stockValue",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "unitQty",
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
                                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                                columns={columns}
                                moreOption={true}
                                gridHeader={t("stock_summary_report")}
                                dataUrl={Urls.stock_summary}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<StockSummaryFilter />}
                                filterWidth={790}
                                filterHeight={630}
                                filterInitialData={StockSummaryFilterInitialState}
                                reload={true}
                                gridId="grd_stock_summary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default StockSummary;