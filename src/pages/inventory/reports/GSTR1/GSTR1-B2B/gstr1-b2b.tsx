import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import GSTR1B2BFilter, { GSTR1B2BFilterInitialState } from "./gstr1-b2b-filter";

const GSTR1B2B = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "slNo",
            caption: t("sl_no"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 50,
        },
        {
            dataField: "gstinUinOfRecipient",
            caption: t("gstin_uin_of_recipient"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "receiverName",
            caption: t("receiver_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
        },
        {
            dataField: "invoiceNumber",
            caption: t("invoice_number"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "invoiceDate",
            caption: t("invoice_date"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "invoiceValue",
            caption: t("invoice_value"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "placeOfSupply",
            caption: t("place_of_supply"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "reverseCharge",
            caption: t("reverse_charge"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "applicableTaxRatePercentage",
            caption: t("applicable_tax_rate_percentage"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
        },
        {
            dataField: "invoiceType",
            caption: t("invoice_type"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "eCommerceGSTIN",
            caption: t("e_commerce_gstin"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "rate",
            caption: t("rate"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "taxableValue",
            caption: t("taxable_value"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "cessAmount",
            caption: t("cess_amount"),
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
            column: "invoiceValue",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "taxableValue",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        },
        {
            column: "cessAmount",
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
                                gridHeader={t("gstr1b2b_report")}
                                dataUrl={Urls.gstr1b2b}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<GSTR1B2BFilter />}
                                filterWidth={325}
                                filterHeight={250}
                                filterInitialData={GSTR1B2BFilterInitialState}
                                reload={true}
                                gridId="grd_gstr1b2b"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default GSTR1B2B;