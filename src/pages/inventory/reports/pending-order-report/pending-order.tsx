import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import PendingOrderReportFilter, { PendingOrderReportFilterInitialState } from "./pending-order-filter";

const PendingOrderReport = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "si",
            caption: t("sl_no"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 50,
            showInPdf:true,
        },
        {
            dataField: "financialYearID",
            caption: t("financial_year_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible:false
        },
        {
            dataField: "invTransactionMasterID",
            caption: t("transaction_master_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            visible:false
        },
        {
            dataField: "branchID",
            caption: t("branch_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            visible:false
        },
        {
            dataField: "transactionDate",
            caption: t("transaction_date"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "voucherType",
            caption: t("voucher_type"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "voucherNumber",
            caption: t("voucher_number"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "remarks",
            caption: t("remarks"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
            showInPdf:true,
        },
        {
            dataField: "party",
            caption: t("party"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
            showInPdf:true,
        },
        {
            dataField: "productCode",
            caption: t("product_code"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "productName",
            caption: t("product_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
            showInPdf:true,
        },
        {
            dataField: "autoBarcode",
            caption: t("auto_barcode"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "mannualBarcode",
            caption: t("mannual_barcode"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "productNameDuplicate",
            caption: t("product_name_duplicate"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "pendingQty",
            caption: t("pending_qty"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "unitName",
            caption: t("unit_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            showInPdf:true,
        },
        {
            dataField: "quantity",
            caption: t("quantity"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            showInPdf:true,
        },
        {
            dataField: "free",
            caption: t("free"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "unitPrice",
            caption: t("unit_price"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "totalGross",
            caption: t("total_gross"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "totalVatAmount",
            caption: t("total_vat_amount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "netAmount",
            caption: t("net_amount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        },
        {
            dataField: "supplierRefCode",
            caption: t("supplier_ref_code"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "brandName",
            caption: t("brand_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "groupName",
            caption: t("group_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "productCategory",
            caption: t("product_category"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "groupCategory",
            caption: t("group_category"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
        },
        {
            dataField: "section",
            caption: t("section"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            showInPdf:true,
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
            column: "pendingQty",
            summaryType: "sum",
            valueFormat: "fixedPoint",
            customizeText: customizeSummaryRow,
        },
        {
            column: "quantity",
            summaryType: "sum",
            valueFormat: "fixedPoint",
            customizeText: customizeSummaryRow,
        },
        {
            column: "free",
            summaryType: "sum",
            valueFormat: "fixedPoint",
            customizeText: customizeSummaryRow,
        },
        {
            column: "totalGross",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "totalVatAmount",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "netAmount",
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
                                gridHeader={t("pending_order_report")}
                                dataUrl={Urls.pending_order}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<PendingOrderReportFilter />}
                                filterWidth={350}
                                filterHeight={270}
                                filterInitialData={PendingOrderReportFilterInitialState}
                                reload={true}
                                gridId="grd_pending_order_report"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PendingOrderReport;