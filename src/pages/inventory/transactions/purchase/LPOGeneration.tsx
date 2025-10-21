import React, { useEffect, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { getApLocalDataByUrl } from "../../../../redux/cached-urls";
import { LedgerType } from "../../../../enums/ledger-types";
import { useDispatch } from "react-redux";
import { formStateHandleFieldChange, formStateTransactionDetailsRowsAdd } from "../reducer";
import { APIClient } from "../../../../helpers/api-client";

interface LPOGenerationProps {
    t: any;
    transactionType: any;
    refactorDetails: any;
    formState: any;
}

interface FormStates {
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

const LPOGeneration: React.FC<LPOGenerationProps> = ({ t, transactionType, refactorDetails, formState }) => {
    const [formStates, setFormStates] = useState<FormStates>({
        method: "all products",
        supplierId: "",
        productCategoryId: "",
        productGroupId: "",
        groupCategoryId: "",
        sectionId: "",
        productId: "",
        fromDate: new Date(2025, 4, 10).toLocaleDateString(),
        toDate: new Date(2025, 9, 10).toLocaleDateString(),
        summaryAsOnDate: new Date(2025, 9, 10).toLocaleDateString(),
        productCode: "",
        skipZeroQty: false,
        showStockDetails: false,
    });
    const api = new APIClient();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = `${Urls.inv_transaction_base}${transactionType}/Data/`;
                const endpoints = [
                    { url: 'AccLedgers/', params: `ledgerType=${LedgerType.Supplier}`, key: 'supplierId' },
                    { url: 'ProductCategory/', key: 'productCategoryId' },
                    { url: 'ProductGroup/', key: 'productGroupId' },
                    { url: 'GroupCategory/', key: 'groupCategoryId' },
                    { url: 'Section/', key: 'sectionId' },
                    { url: 'Product/', key: 'productId' },
                    { url: 'ProductsCode/', key: 'productCode' }
                ];

                const results = await Promise.all(
                    endpoints.map(({ url, params }) =>
                        getApLocalDataByUrl(baseUrl + url, params)
                    )
                );

                const updates: Partial<FormStates> = {};
                results.forEach((data, index) => {
                    const { key } = endpoints[index];
                    if (Array.isArray(data) && data.length > 0) {
                        updates[key as keyof FormStates] = data[0].id || data[0].code || "";
                    }
                });
                setFormStates(prev => ({ ...prev, ...updates }));


                dispatch(formStateHandleFieldChange({ fields: { loading: { isLoading: false, text: 'Please wait while LPO' } } }));

            } catch (error) {
                console.error('Failed to fetch data:', error);
                ERPToast.show("Failed to load initial data", "error");
            }
        };
        fetchData();
    }, [transactionType]);

    const handleFieldChange = (updates: Partial<FormStates>) => {
        setFormStates(prev => ({ ...prev, ...updates }));
    };

    const handleClear = () => {
        setFormStates({
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

    // const onProcessLPO = useCallback(
    //     async (listOfData: string) => {
    //         if (listOfData.length > 0) {
    //             dispatch(formStateHandleFieldChange({ fields: { loading: { isLoading: true, text: '' } } }));

    //         }
    //     },
    //     [],
    // )

    const handleShow = async () => {
        try {
            const params = {
                method: formStates.method,
                supplierId: formStates.supplierId,
                productCategoryId: formStates.productCategoryId,
                productGroupId: formStates.productGroupId,
                groupCategoryId: formStates.groupCategoryId,
                sectionId: formStates.sectionId,
                productId: formStates.productId,
                fromDate: formStates.fromDate,
                toDate: formStates.toDate,
                summaryAsOnDate: formStates.summaryAsOnDate,
                productCode: formStates.productCode,
                skipZeroQty: formStates.skipZeroQty,
                showStockDetails: formStates.showStockDetails,
            };
            const encoded =
                "method=" + encodeURIComponent(String(params.method ?? "all Products")) +
                "&supplierId=" + encodeURIComponent(String(params.supplierId ?? "-1")) +
                "&productCategoryId=" + encodeURIComponent(String(params.productCategoryId ?? "-1")) +
                "&productGroupId=" + encodeURIComponent(String(params.productGroupId ?? "-1")) +
                "&groupCategoryId=" + encodeURIComponent(String(params.groupCategoryId ?? "-1")) +
                "&sectionId=" + encodeURIComponent(String(params.sectionId ?? "-1")) +
                "&productId=" + encodeURIComponent(String(params.productId ?? "-1")) +
                "&fromDate=" + encodeURIComponent(String(params.fromDate ?? "")) +
                "&toDate=" + encodeURIComponent(String(params.toDate ?? "")) +
                "&summaryAsOnDate=" + encodeURIComponent(String(params.summaryAsOnDate ?? "")) +
                "&productCode=" + encodeURIComponent(String(params.productCode ?? "")) +
                "&skipZeroQty=" + encodeURIComponent(String(params.skipZeroQty ?? false)) +
                "&showStockDetails=" + encodeURIComponent(String(params.showStockDetails ?? false));
            const response = await api.getAsync(Urls.localPurchaseOrder, encoded);

            const updatedInventory = response.map((row: any, i: number) => {
                const avgSalesLast30Days = Number(row["salesLast30Days"]) || 0;
                const avgSales = avgSalesLast30Days / 30;
                const item: any = {
                    pCode: row["productCode"] ?? "",
                    product: row["productName"] ?? "",
                    productID: row["productID"] ?? "",
                    barCode: row["autoBarcode"] ?? "",
                    manualBarCode: row["mannualBarcode"] ?? "",
                    productBatchID: row["productBatchID"] ?? "",
                    unit: row["unitName"] ?? "",
                    unitID: row["basicUnitID"] ?? "",
                    unitPrice: Number(row["stdPurchasePrice"] || 0).toFixed(2),
                    salesPrice: Number(row["stdSalesPrice"] || 0).toFixed(2),
                    mrp: Number(row["mRP"] || 0).toFixed(2),
                    vatPerc: Number(row["pVAtPerc"] || 0).toFixed(2),
                    supplierID: row["ledgerID"] ?? "",
                    supplier: row["ledgerName"] ?? "",
                    stock: Number(row["stock"] || 0).toFixed(2),
                    avgSales: avgSales.toFixed(2),
                    salesLast30Days: Number(row["salesLast30Days"] || 0).toFixed(2),
                    salesLast90Days: Number(row["salesLast90Days"] || 0).toFixed(2),
                    salesLast180Days: Number(row["salesLast180Days"] || 0).toFixed(2),
                    arabicName: row["arabicName"] ?? "",
                    supplierRefCode: row["supplierRefCode"] ?? "",
                    lastSoldDate: row["lastSoldDate"] ?? "",
                    minSalePrice: Number(row["minSalePrice"] || 0).toFixed(2),
                    poPendingQty: row["pO_Pending_Qty"] ?? "",
                    pqPendingQty: row["pQ_Pending_Qty"] ?? "",
                    qty: 0.0,
                    headerIndex: i + 1,
                };
                // if (method !== "All Products") {
                //     item.qty = Number(row["Qty"] || 0).toFixed(2);
                //     calculateRowAmount(item);
                // }
                return item;
            });
            debugger;
            dispatch(
                formStateTransactionDetailsRowsAdd(
                    updatedInventory
                )
            )
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
                        value={formStates.method}
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
                        value={formStates.supplierId}
                        className="w-[240px]"
                        field={{
                            id: "id",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/AccLedgers/`,
                            params: `ledgerType=${LedgerType.Supplier}`
                        }}
                        onSelectItem={(data) => handleFieldChange({ supplierId: data.value })}
                    />
                    <ERPDataCombobox
                        id="productCategoryId"
                        label={t('product_category')}
                        value={formStates.productCategoryId}
                        className="w-[240px]"
                        field={{
                            id: "productCategoryId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/ProductCategory/`,
                        }}
                        onSelectItem={(data) => handleFieldChange({ productCategoryId: data.value })}
                    />
                    <ERPDataCombobox
                        id="productGroupId"
                        label={t('product_group')}
                        value={formStates.productGroupId}
                        className="w-[240px]"
                        field={{
                            id: "productGroupId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/ProductGroup/`,
                        }}
                        onSelectItem={(data) => handleFieldChange({ productGroupId: data.value })}
                    />
                    <ERPDataCombobox
                        id="groupCategoryId"
                        label={t('group_category')}
                        value={formStates.groupCategoryId}
                        className="w-[240px]"
                        field={{
                            id: "groupCategoryId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/GroupCategory/`,
                        }}
                        onSelectItem={(data) => handleFieldChange({ groupCategoryId: data.value })}
                    />
                    <ERPDataCombobox
                        id="sectionId"
                        label={t('section')}
                        value={formStates.sectionId}
                        className="w-[240px]"
                        field={{
                            id: "sectionId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/Section/`,
                        }}
                        onSelectItem={(data) => handleFieldChange({ sectionId: data.value })}
                    />
                    <ERPDataCombobox
                        id="productId"
                        label={t('product')}
                        value={formStates.productId}
                        className="w-[240px]"
                        field={{
                            id: "productId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/Product/`,
                        }}
                        onSelectItem={(data) => handleFieldChange({ productId: data.value })}
                    />
                    <ERPDateInput
                        id="fromDate"
                        label={t('from')}
                        value={formStates.fromDate}
                        onChange={(e) => handleFieldChange({ fromDate: e.target.value })}
                    />
                    <ERPDateInput
                        id="toDate"
                        label={t('to')}
                        value={formStates.toDate}
                        onChange={(e) => handleFieldChange({ toDate: e.target.value })}
                    />
                    <ERPDateInput
                        id="summaryAsOnDate"
                        label={t('summary_as_on')}
                        value={formStates.summaryAsOnDate}
                        onChange={(e) => handleFieldChange({ summaryAsOnDate: e.target.value })}
                    />
                    <ERPDataCombobox
                        id="productCode"
                        label={t('product_code')}
                        value={formStates.productCode}
                        className="w-[240px]"
                        field={{
                            id: "productCode",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/ProductsCode/`,
                        }}
                        onSelectItem={(data) => handleFieldChange({ productCode: data.value })}
                    />
                    <ERPCheckbox
                        id="skipZeroQty"
                        label={t("skip_zero_qty_validation")}
                        checked={formStates.skipZeroQty}
                        onChange={(e) => handleFieldChange({ skipZeroQty: e.target.checked })}
                    />
                    <ERPCheckbox
                        id="showStockDetails"
                        label={t("show_stock_details")}
                        checked={formStates.showStockDetails}
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