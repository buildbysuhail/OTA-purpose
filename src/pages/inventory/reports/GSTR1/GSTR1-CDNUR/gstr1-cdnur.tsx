import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import GSTR1CDNURFilter, { GSTR1CDNURFilterInitialState } from "./gstr1-cdnur-filter";

const GSTR1CDNUR = () => {
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
            dataField: "urType",
            caption: t("ur_type"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "noteNumber",
            caption: t("note_number"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "noteDate",
            caption: t("note_date"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "noteType",
            caption: t("note_type"),
            dataType: "string",
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
            dataField: "noteValue",
            caption: t("note_value"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "applicablePercentOfTaxRate",
            caption: t("applicable_percent_of_tax_rate"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
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
            column: "noteValue",
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
                                gridHeader={t("gstr1_cdnur_report")}
                                dataUrl={Urls.gstr1cdnur}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<GSTR1CDNURFilter />}
                                filterWidth={325}
                                filterHeight={250}
                                filterInitialData={GSTR1CDNURFilterInitialState}
                                reload={true}
                                gridId="grd_gstr1_cdnur"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default GSTR1CDNUR;