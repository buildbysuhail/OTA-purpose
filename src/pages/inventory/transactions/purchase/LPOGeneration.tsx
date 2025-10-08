import React, { useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import axios from "axios";
import ERPToast from "../../../../components/ERPComponents/erp-toast";

interface LPOGenerationProps {
    t: any;
}

interface FormState {
    method: string;
    supplierId: string;
    productCategoryId: string;
    productGroupId: string;
    groupCategoryId: string;
    sectionId: string;
    productId: string;
    fromDate: string;
    toDate: string;
    summaryAsOnDate: string;
    productCode: string;
    skipZeroQty: boolean;
    showStockDetails: boolean;
}

const LPOGeneration: React.FC<LPOGenerationProps> = ({ t }) => {
    const [formState, setFormState] = useState<FormState>({
        method: "",
        supplierId: "",
        productCategoryId: "",
        productGroupId: "",
        groupCategoryId: "",
        sectionId: "",
        productId: "",
        fromDate: "",
        toDate: "",
        summaryAsOnDate: "",
        productCode: "",
        skipZeroQty: false,
        showStockDetails: false,
    });

    const handleFieldChange = (updates: Partial<FormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const handleClear = () => {
        setFormState({
            method: "",
            supplierId: "",
            productCategoryId: "",
            productGroupId: "",
            groupCategoryId: "",
            sectionId: "",
            productId: "",
            fromDate: "",
            toDate: "",
            summaryAsOnDate: "",
            productCode: "",
            skipZeroQty: false,
            showStockDetails: false,
        });
    };

    const handleShow = async () => {
        try {
            const params = {
                method: formState.method,
                supplierId: formState.supplierId,
                productCategoryId: formState.productCategoryId,
                productGroupId: formState.productGroupId,
                groupCategoryId: formState.groupCategoryId,
                sectionId: formState.sectionId,
                productId: formState.productId,
                fromDate: formState.fromDate,
                toDate: formState.toDate,
                summaryAsOnDate: formState.summaryAsOnDate,
                productCode: formState.productCode,
                skipZeroQty: formState.skipZeroQty,
                showStockDetails: formState.showStockDetails,
            };
            console.log("Request Params:", params);
            const response = await axios.get(Urls.localPurchaseOrder, { params });
            console.log("API Response:", response.data);
            ERPToast.show("LPO Showing Successfully", "success");
        } catch (error) {
            ERPToast.show("Failed to Show", "error");
        }
    };

    return (
        <div className="w-full modal-content">
            <div className="flex flex-col gap-4 p-2">
                <div className="flex flex-wrap items-end gap-2">
                    <ERPDataCombobox
                        id="method"
                        label={t('method')}
                        value={formState.method}
                        className="w-[240px]"
                        options={[
                            { value: "all products", label: "All Products" },
                            { value: "re order level", label: "Re Order Level" },
                            { value: "sales analysis", label: "Sales Analysis" }
                        ]}
                        onSelectItem={(data) => handleFieldChange({ method: data.value })}
                    />
                    <ERPDataCombobox
                        id="supplierId"
                        label={t('supplier')}
                        value={formState.supplierId}
                        className="w-[240px]"
                        field={{
                            id: "id",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_supplier
                        }}
                        onSelectItem={(data) => handleFieldChange({ supplierId: data.value })}
                    />
                    <ERPDataCombobox
                        id="productCategoryId"
                        label={t('product_category')}
                        value={formState.productCategoryId}
                        className="w-[240px]"
                        field={{
                            id: "productCategoryId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_productCategory
                        }}
                        onSelectItem={(data) => handleFieldChange({ productCategoryId: data.value })}
                    />
                    <ERPDataCombobox
                        id="productGroupId"
                        label={t('product_group')}
                        value={formState.productGroupId}
                        className="w-[240px]"
                        field={{
                            id: "productGroupId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_productGroup
                        }}
                        onSelectItem={(data) => handleFieldChange({ productGroupId: data.value })}
                    />
                    <ERPDataCombobox
                        id="groupCategoryId"
                        label={t('group_category')}
                        value={formState.groupCategoryId}
                        className="w-[240px]"
                        field={{
                            id: "groupCategoryId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_GroupCategory
                        }}
                        onSelectItem={(data) => handleFieldChange({ groupCategoryId: data.value })}
                    />
                    <ERPDataCombobox
                        id="sectionId"
                        label={t('sectionId')}
                        value={formState.sectionId}
                        className="w-[240px]"
                        field={{
                            id: "sectionId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_Section
                        }}
                        onSelectItem={(data) => handleFieldChange({ sectionId: data.value })}
                    />
                    <ERPDataCombobox
                        id="productId"
                        label={t('productId')}
                        value={formState.productId}
                        className="w-[240px]"
                        field={{
                            id: "productId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_Product
                        }}
                        onSelectItem={(data) => handleFieldChange({ productId: data.value })}
                    />
                    <ERPDateInput
                        id="fromDate"
                        label={t('from')}
                        value={formState.fromDate}
                        onChange={(e) => handleFieldChange({ fromDate: e.target.value })}
                    />
                    <ERPDateInput
                        id="toDate"
                        label={t('to')}
                        value={formState.toDate}
                        onChange={(e) => handleFieldChange({ toDate: e.target.value })}
                    />
                    <ERPDateInput
                        id="summaryAsOnDate"
                        label={t('summary_as_on')}
                        value={formState.summaryAsOnDate}
                        onChange={(e) => handleFieldChange({ summaryAsOnDate: e.target.value })}
                    />
                    <ERPDataCombobox
                        id="productCode"
                        label={t('product_code')}
                        value={formState.productCode}
                        className="w-[240px]"
                        field={{
                            id: "productCode",
                            valueKey: "code",
                            labelKey: "name",
                            getListUrl: Urls.lpo_data_ProductsCode
                        }}
                        onSelectItem={(data) => handleFieldChange({ productCode: data.value })}
                    />
                    <ERPCheckbox
                        id="skipZeroQty"
                        label={t("skip_zero_qty_validation")}
                        checked={formState.skipZeroQty}
                        onChange={(e) => handleFieldChange({ skipZeroQty: e.target.checked })}
                    />
                    <ERPCheckbox
                        id="showStockDetails"
                        label={t("show_stock_details")}
                        checked={formState.showStockDetails}
                        onChange={(e) => handleFieldChange({ showStockDetails: e.target.checked })}
                    />
                    <div className="flex justify-end gap-2">
                        <ERPButton
                            title={t("show")}
                            variant="primary"
                            onClick={handleShow}
                        />
                        <ERPButton
                            title={t("clear")}
                            variant="custom"
                            customVariant="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleClear}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LPOGeneration;