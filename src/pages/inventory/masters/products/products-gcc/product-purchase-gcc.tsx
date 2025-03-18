import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";

const PurchaseGcc = () => {
    const { t } = useTranslation('inventory');
    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "voucherNumber",
            caption: t("voucher_number"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 100,
        },
        {
            dataField: "voucherPrefix",
            caption: t("voucher_prefix"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 100,
        },
        {
            dataField: "transactionDate",
            caption: t("transaction_date"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 100,
        },
        {
            dataField: "partyName",
            caption: t("party_name"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "unitPrice",
            caption: t("unit_price"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "netAmount",
            caption: t("net_amount"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "quantity",
            caption: t("quantity"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "unitName",
            caption: t("unit_name"),
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
                gridHeader={t("purchase")}
                dataUrl={Urls.products}
                gridId="grd_purchaseGcc"
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

export default PurchaseGcc;
