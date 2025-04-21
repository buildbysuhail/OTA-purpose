import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ExpiryReportFilter, { ExpiryReportFilterInitialState } from "./expiry-report-filter";
import Urls from "../../../../redux/urls";

const ExpiryReport = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "id",
            caption: t("id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 50,
        },
        {
            dataField: "code",
            caption: t("code"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "product",
            caption: t("product"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "group",
            caption: t("group"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "category",
            caption: t("category"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "brand",
            caption: t("brand"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "stock",
            caption: t("stock"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "stdSPrice",
            caption: t("std_s_price"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "stdPPrice",
            caption: t("std_p_price"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "stockValue",
            caption: t("stock_value"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "mrp",
            caption: t("mrp"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "batchNo",
            caption: t("batch_no"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "specification",
            caption: t("specification"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "modelNo",
            caption: t("model_no"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "autoBarcode",
            caption: t("auto_barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "mannualBarcode",
            caption: t("mannual_barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 130,
        },
        {
            dataField: "expiryDate",
            caption: t("expiry_date"),
            dataType: "date",
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
                                gridHeader={t("expiry_report")}
                                dataUrl={Urls.expiry_report}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<ExpiryReportFilter />}
                                filterWidth={790}
                                filterHeight={400}
                                filterInitialData={ExpiryReportFilterInitialState}
                                reload={true}
                                gridId="grd_expiry_report"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ExpiryReport;