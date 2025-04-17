import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import NonInvoicedGoodsDeliveryFilter, { NonInvoicedGoodsDeliveryFilterInitialState } from "./non-invloced-goods-deliveryfilter";

const NonInvoicedGoodsDelivery = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "transactionDate",
            caption: t("transaction_date"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "invTransactionMasterID",
            caption: t("inv_transaction_master_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: false,
        },
        {
            dataField: "voucherPrefix",
            caption: t("voucher_prefix"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "voucherForm",
            caption: t("voucher_form"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "financialYearID",
            caption: t("financial_year_id"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: false,
        },
        {
            dataField: "voucherType",
            caption: t("voucher_type"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "voucherNumber",
            caption: t("voucher_number"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "partyName",
            caption: t("party_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "address1",
            caption: t("address1"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
        },
        {
            dataField: "grandTotal",
            caption: t("grand_total"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            alignment: "right",
            visible: true,
        },
        {
            dataField: "remarks",
            caption: t("remarks"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            visible: true,
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
            column: "grandTotal",
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
                                gridHeader={t("non_invoiced_goods_delivery_report")}
                                dataUrl={Urls.non_invoiced_goods_delivery}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<NonInvoicedGoodsDeliveryFilter />}
                                filterWidth={400}
                                filterHeight={230}
                                filterInitialData={NonInvoicedGoodsDeliveryFilterInitialState}
                                reload={true}
                                gridId="grd_non_invoiced_goods_delivery"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NonInvoicedGoodsDelivery;