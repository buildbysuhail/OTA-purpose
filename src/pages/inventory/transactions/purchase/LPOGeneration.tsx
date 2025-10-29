import React, { useEffect, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { LedgerType } from "../../../../enums/ledger-types";
import { useDispatch, useSelector } from "react-redux";
import { formStateHandleFieldChange, formStateTransactionDetailsRowsEmptyAdd } from "../reducer";
import { APIClient } from "../../../../helpers/api-client";
import { generateUniqueKey } from "../../../../utilities/Utils";
import { RootState } from "../../../../redux/store";
import { merge } from 'lodash';

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
        fromDate:new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
        toDate: new Date().toISOString(),
        summaryAsOnDate: new Date().toISOString(),
        //   fromDate:  moment(new Date()).subtract(6, 'months').toDate(),
        // toDate: moment().local().toDate(),
        // summaryAsOnDate: moment().local().toDate(),
        productCode: "",
        showStockDetails: false,
    });
    const api = new APIClient();
    const dispatch = useDispatch();
    const clientSession = useSelector((state: RootState) => state.ClientSession)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = `${Urls.inv_transaction_base}${transactionType}/Data/`;
                const endpoints = [
                    // { url: 'AccLedgers/', params: `ledgerType=${LedgerType.Supplier}`, key: 'supplierId' },
                    // { url: 'ProductCategory/', key: 'productCategoryId' },
                    // { url: 'ProductGroup/', key: 'productGroupId' },
                    // { url: 'GroupCategory/', key: 'groupCategoryId' },
                    // { url: 'Section/', key: 'sectionId' },
                    // { url: 'Product/', key: 'productId' },
                    // { url: 'ProductsCode/', key: 'productCode' }
                ];
                // const results = await Promise.all(
                //     endpoints.map(({ url, params }) =>
                //         getApLocalDataByUrl(baseUrl + url, params)
                //     )
                // );

                // const updates: Partial<FormStates> = {};
                // results.forEach((data, index) => {
                //     const { key } = endpoints[index];
                //     if (Array.isArray(data) && data.length > 0) {
                //         updates[key as keyof FormStates] = data[0].id || data[0].code || "";
                //     }
                // });
                // setFormStates(prev => ({ ...prev, ...updates }));
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
            fromDate:new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
            toDate: new Date().toISOString(),
            summaryAsOnDate: new Date().toISOString(),
            productCode: "",
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

    const calculateRowAmount = (item: any) => {
        try {
            if (!item.product || item.product === "") return;

            const isAppGlobal = clientSession.isAppGlobal; // same as PolosysFrameWork.General.IS_APP_GLOBAL
            const qty = Number(item.qty) || 0;
            const rate = Number(item.unitPrice) || 0;
            const vatPerc = Number(item.vatPerc) || 0;
            const CGSTPerc = Number(item.cgstPerc) || 0;
            const SGSTPerc = Number(item.sgstPerc) || 0;
            const IGSTPerc = Number(item.igstPerc) || 0;
            const CessPerc = Number(item.cessPerc) || 0;
            const AddnlCessPerc = Number(item.addnlCessPerc) || 0;
            const discPerc = Number(item.discPerc) || 0;
            const disc = Number(item.discount) || 0;
            const schmeDiscPerc = Number(item.schemeDiscPerc) || 0;
            const schmeDiscAmt = Number(item.schemeDiscAmt) || 0;
            let gross = qty * rate;
            let netValue = gross - disc;
            let vat = 0;
            let netAmount = 0;
            let cost = 0;

            // --- GST / VAT Calculation ---
            if (isAppGlobal) {
                const cgst = (netValue * CGSTPerc) / 100;
                const sgst = (netValue * SGSTPerc) / 100;
                const igst = (netValue * IGSTPerc) / 100;
                const cess = (netValue * CessPerc) / 100;
                const addnlCess = (netValue * AddnlCessPerc) / 100;
                cost = rate - (rate * discPerc) / 100 + (rate * (CGSTPerc + SGSTPerc + IGSTPerc + CessPerc + AddnlCessPerc)) / 100;
                netAmount = netValue + cgst + sgst + igst + cess + addnlCess - schmeDiscAmt;
                const merged = merge({}, item, {
                    cgst,
                    sgst,
                    igst,
                    cessAmt: cess,
                    addnlCessAmt: addnlCess,
                    cost,
                    netValue,
                    gross,
                    total: netAmount,
                });
                return merged;
            } else {
                vat = (netValue * vatPerc) / 100;
                cost = rate - (rate * discPerc) / 100 + (rate * vatPerc) / 100;
                netAmount = netValue + vat - schmeDiscAmt;
                const merged = merge({}, item, {
                    vatAmount: vat,
                    cost,
                    netValue,
                    gross,
                    total: netAmount,
                })
                return merged;
            }
        } catch (ex) {
            console.error("Error in calculateRowAmount:", ex);
            return item;
        }
    };

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
                skipZeroQty: formState.skipZeroQty,
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
                let item: any = {
                    slNo: generateUniqueKey(),
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
                    mrp: Number(row["mrp"] || 0).toFixed(2),
                    vatPerc: Number(row["pVatPerc"] || 0).toFixed(2),
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
                if (formState.method !== "all products") {
                    item.qty = Number(row["qty"] || 0).toFixed(2);
                    item = calculateRowAmount(item);
                }
                return item;
            });
            debugger;
            dispatch(
                formStateTransactionDetailsRowsEmptyAdd(
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
                        enableClearOption={false}
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
                        onChange={(e) => handleFieldChange({ fromDate: new Date(e.target.value).toISOString() })}
                    />
                    <ERPDateInput
                        id="toDate"
                        label={t('to')}
                        value={formStates.toDate}
                        onChange={(e) => handleFieldChange({ toDate: new Date(e.target.value).toISOString()  })}
                    />
                    <ERPDateInput
                        id="summaryAsOnDate"
                        label={t('summary_as_on')}
                        value={formStates.summaryAsOnDate}
                        onChange={(e) => handleFieldChange({ summaryAsOnDate: new Date(e.target.value).toISOString()  })}
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
                        checked={formState.skipZeroQty}
                        onChange={(e) => dispatch(formStateHandleFieldChange({
                            fields: { skipZeroQty: e.target.checked }
                        }))}
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