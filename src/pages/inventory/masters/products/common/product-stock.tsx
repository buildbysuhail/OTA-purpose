import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { productDto } from "../products-type";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";
import { FormField } from "../../../../../utilities/form-types";
const StockCommon: React.FC<{
  formState: any;
  handleFieldChange: (
    fields:
      | string
      | {
          [fieldId: string]: any;
        },
    value?: any
  ) => void;
 
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({formState,handleFieldChange,getFieldProps}) => {

    const { t } = useTranslation("inventory");
    const [showGrid, setShowGrid] = useState(false);
    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "siNo",
            caption: t("si_no"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "date",
            caption: t("date"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "particulars",
            caption: t("particulars"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "voucherType",
            caption: t("voucher_type"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "form",
            caption: t("form"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "voucherNo",
            caption: t("voucher_no"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "inwardQty",
            caption: t("inward_qty"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "outwardQty",
            caption: t("outward_qty"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "balance",
            caption: t("balance"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "unit",
            caption: t("unit"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "prefix",
            caption: t("prefix"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
    ], [t]);

    const handleShowClick = () => {
        setShowGrid(true);
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <ERPCheckbox
                        {...getFieldProps("product.warehouse")}
                        label={t("warehouse")}
                        onChange={(data) => handleFieldChange("product.warehouse", data.target.checked)}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("product.warehouse")}
                        id="warehouse"
                        field={{
                            id: "warehouse",
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        onChangeData={(data) => handleFieldChange("product.warehouse", data.warehouse)}
                        noLabel={true}
                        options={[{id:"1",name:"nizam"}]}
                    />
            
                </div>
                <div className="flex items-center gap-4">
                    <ERPButton
                        title={t("show")}
                        variant="secondary"
                        className="mt-5"
                        onClick={handleShowClick}
                    />
                    <ERPButton
                        title={t("wh/w")}
                        variant="primary"
                        className="mt-5"
                    />
                </div>
            </div>

            {showGrid && (
                <div className="grid grid-cols-1 gap-3">
                    <ErpDevGrid
                        columns={columns}
                        gridHeader={t("stock")}
                        dataUrl={Urls.products}
                        gridId="grd_stockGcc"
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
            )}
        </div>
    );
});

export default StockCommon;