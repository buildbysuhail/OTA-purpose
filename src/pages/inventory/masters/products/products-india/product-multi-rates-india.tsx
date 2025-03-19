import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";

const MultiRatesIndia = () => {
    const { t } = useTranslation('inventory');
    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "siNo",
            caption: t("SiNo"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 40,
        },
        {
            dataField: "priceCategory",
            caption: t("price_category"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 150,
        },
        {
            dataField: "unit",
            caption: t("unit"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80,
        },
        {
            dataField: "salesRate",
            caption: t("sales_rate"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80,
        },
        {
            dataField: "salesDisc%",
            caption: t("sales_disc_%"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80,
        },
        {
            dataField: "purchaseRate",
            caption: t("purchase_rate"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80,
        },
        {
            dataField: "unitID",
            caption: t("unit_id"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "profitAddedToCost",
            caption: t("profit_(added_to_cost)"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "MRP",
            caption: t("mrp"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "X",
            caption: t("x"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
    ], [t]);

    return (
        <div className="grid grid-cols-1 gap-3">
            <ErpDevGrid
                columns={columns}
                gridHeader={t("multi_rates")}
                dataUrl={Urls.products}
                gridId="grd_multiRatesIndia"
                heightToAdjustOnWindows={800}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                hideGridAddButton={true}
                hideGridHeader={true}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
                allowSearching={false}
                allowExport={false}
            />
        </div>
    );
};

export default MultiRatesIndia;
