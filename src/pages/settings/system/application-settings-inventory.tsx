import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { LedgerType } from "../../../enums/ledger-types";

interface FormState {
    defaultSalesAccount: number;
    defaultSalesReturnAccount: number;
    defaultPurchaseAccount: number;
    defaultPurchaseReturnAccount: number;
    billDiscountGivenLedger: number;
    billDiscountReceivedLedger: number;
    couponCardAccount: number;
    defaultRoundOffAccount: number;
    defaultAdditionalAmountAccount: number;
    defaultBrand: number;
    negativeStock: string;
    maintainWarehouse: boolean;
    priceCode: string;
    barcodeLabel: string;
    ifLessSalesRate: string;
    setLastSalesRateAsProductSalesRate: boolean;
    setLastPurchaseRateAsProductPurchaseRate: boolean;
    setAvgPurchaseCostWithLastPurchaseRate: boolean;
    updatePurchasePriceOnPurchaseTransfer: boolean;
    showCashSalesSeparateMenu: boolean;
    showNonStockItemsInSales: boolean;
    defaultBtoAccount: number;
    defaultBtiAccount: number;
    serviceWarrantyInvAccounts: number;
    serviceNonWarrantyInvAccounts: number;
    defaultServiceSpareWarehouse: number;
    defaultSalesReturnPayableAccount: number;
    redeemPoints: string;
    keepUserActions: number;
    blockBillDiscount: string;
    discountAuthorizationIfDiscountAbove: number;
    setAuthorizationInSales: boolean;
    enableSalesInvoiceDraftOption: boolean;
    setProductCostAsDeclarationPrice: boolean;
    setProductCostWithTaxAmount: boolean;
    blockNonStockSerialSelling: boolean;
    showProductDuplicationMessage: boolean;
    blockHoldItems: boolean;
    printAfterSave: boolean;
    needPoApprovalForPrintout: boolean;
    enableAddStockAdjustment: boolean;
    carryForwardPurchaseOrderQtyToPurchase: boolean;
    useCostForStockTransferToBranch: boolean;
    showAccountReceivableInPurchase: boolean;
    showPrinterSelection: boolean;
    btoUsingMsp: boolean;
    isReferenceNumberMandatoryInPurchase: boolean;
    showTransitModeStockTransferAlert: boolean;
    showAccountPayableInSales: boolean;
    holdSalesMan: boolean;
    mobileNumberMandatoryInSales: boolean;
}

const initialState: FormState = {
    defaultSalesAccount: 0,
    defaultSalesReturnAccount: 0,
    defaultPurchaseAccount: 0,
    defaultPurchaseReturnAccount: 0,
    billDiscountGivenLedger: 0,
    billDiscountReceivedLedger: 0,
    couponCardAccount: 0,
    defaultRoundOffAccount: 0,
    defaultAdditionalAmountAccount: 0,
    defaultBrand: 0,
    negativeStock: "",
    maintainWarehouse: false,
    priceCode: "",
    barcodeLabel: "",
    ifLessSalesRate: "",
    setLastSalesRateAsProductSalesRate: false,
    setLastPurchaseRateAsProductPurchaseRate: false,
    setAvgPurchaseCostWithLastPurchaseRate: false,
    updatePurchasePriceOnPurchaseTransfer: false,
    showCashSalesSeparateMenu: false,
    showNonStockItemsInSales: false,
    defaultBtoAccount: 0,
    defaultBtiAccount: 0,
    serviceWarrantyInvAccounts: 0,
    serviceNonWarrantyInvAccounts: 0,
    defaultServiceSpareWarehouse: 0,
    defaultSalesReturnPayableAccount: 0,
    redeemPoints: "",
    keepUserActions: 0,
    blockBillDiscount: "",
    discountAuthorizationIfDiscountAbove: 0,
    setAuthorizationInSales: false,
    enableSalesInvoiceDraftOption: false,
    setProductCostAsDeclarationPrice: false,
    setProductCostWithTaxAmount: false,
    blockNonStockSerialSelling: false,
    showProductDuplicationMessage: false,
    blockHoldItems: false,
    printAfterSave: false,
    needPoApprovalForPrintout: false,
    enableAddStockAdjustment: false,
    carryForwardPurchaseOrderQtyToPurchase: false,
    useCostForStockTransferToBranch: false,
    showAccountReceivableInPurchase: false,
    showPrinterSelection: false,
    btoUsingMsp: false,
    isReferenceNumberMandatoryInPurchase: false,
    showTransitModeStockTransferAlert: false,
    showAccountPayableInSales: false,
    holdSalesMan: false,
    mobileNumberMandatoryInSales: false,
};

const InventorySettingsForm: React.FC = () => {
    const [formState, setFormState] = useState(initialState);
    const [formStatePrev, setFormStatePrev] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dispatch(
                getAction({ apiUrl: `${Urls.application_setting}inventory` }) as any
            ).unwrap();

            if (response) {
                setFormStatePrev(response);
                setFormState(response);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            setError("Failed to load settings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field: keyof typeof initialState, value: any) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
            const typedKey = key as keyof typeof initialState;
            const currentValue = formState[typedKey];
            const prevValue = (formStatePrev as any)[key];

            if (currentValue !== prevValue) {
                acc.push({
                    settingsName: key,
                    settingsValue: currentValue,
                });
            }
            return acc;
        }, [] as { settingsName: string; settingsValue: any }[]);

        setIsSaving(true);
        setError(null);
        try {
            const response = await dispatch(
                postAction({
                    apiUrl: Urls.application_setting,
                    data: modifiedSettings,
                }) as any
            ).unwrap();
            handleResponse(response);
        } catch (error) {
            console.error("Error saving settings:", error);
            setError("Failed to save settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div>Loading settings...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
                <button onClick={loadSettings}>Retry</button>
            </div>
        );
    }


    return (
        <div className="erp-settings-form">
            <div className="form-row grid grid-cols-5 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultSalesAccount"
                    value={formState.defaultSalesAccount}
                    data={formState}
                    field={{
                        id: "defaultSalesAccount",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultSalesAccount", data)}
                    label="Default Sales Account"
                />
                <ERPDataCombobox
                    id="defaultBtoAccount"
                    value={formState.defaultBtoAccount}
                    data={formState}
                    field={{
                        id: "defaultBtoAccount",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultBtoAccount", data)}
                    label="Default BTO Account"
                />
            </div>

            <div className="form-row grid grid-cols-5 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultSalesReturnAccount"
                    value={formState.defaultSalesReturnAccount}
                    data={formState}
                    field={{
                        id: "defaultSalesReturnAccount",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultSalesReturnAccount", data)}
                    label="Default Sales Return Account"
                />
                <ERPDataCombobox
                    id="defaultBtiAccount"
                    value={formState.defaultBtiAccount}
                    data={formState}
                    field={{
                        id: "defaultBtiAccount",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultBtiAccount", data)}
                    label="Default BTI Account"
                />
            </div>

            <div className="form-row grid grid-cols-5 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultPurchaseAccount"
                    value={formState.defaultPurchaseAccount}
                    data={formState}
                    field={{
                        id: "defaultPurchaseAccount",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultPurchaseAccount", data)}
                    label="Default Purchase Account"
                />
                <ERPDataCombobox
                    id="serviceWarrantyInvAccounts"
                    value={formState.serviceWarrantyInvAccounts}
                    data={formState}
                    field={{
                        id: "serviceWarrantyInvAccounts",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("serviceWarrantyInvAccounts", data)}
                    label="Service Warranty Inv Accounts"
                />
            </div>

            <div className="form-row grid grid-cols-5 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultPurchaseReturnAccount"
                    value={formState.defaultPurchaseReturnAccount}
                    data={formState}
                    field={{
                        id: "defaultPurchaseReturnAccount",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultPurchaseReturnAccount", data)}
                    label="Default Purchase Return Account"
                />
                <ERPDataCombobox
                    id="serviceNonWarrantyInvAccounts"
                    value={formState.serviceNonWarrantyInvAccounts}
                    data={formState}
                    field={{
                        id: "serviceNonWarrantyInvAccounts",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("serviceNonWarrantyInvAccounts", data)}
                    label="Service Non Warranty Inv Accounts"
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="billDiscountGivenLedger"
                    value={formState.billDiscountGivenLedger}
                    data={formState}
                    field={{
                        id: "billDiscountGivenLedger",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Discount_Given}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("billDiscountGivenLedger", data)}
                    label="Bill Discount Given Ledger"
                />
                <ERPDataCombobox
                    id="defaultServiceSpareWarehouse"
                    value={formState.defaultServiceSpareWarehouse}
                    data={formState}
                    field={{
                        id: "defaultServiceSpareWarehouse",
                        required: false,
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultServiceSpareWarehouse", data)}
                    label="Default Service Spare Warehouse"
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="billDiscountReceivedLedger"
                    value={formState.billDiscountReceivedLedger}
                    data={formState}
                    field={{
                        id: "billDiscountReceivedLedger",
                        required: true,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Discount_Received}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("billDiscountReceivedLedger", data)}
                    label="Bill Discount Received Ledger"
                />
                <ERPDataCombobox
                    id="defaultSalesReturnPayableAccount"
                    value={formState.defaultSalesReturnPayableAccount}
                    data={formState}
                    field={{
                        id: "defaultSalesReturnPayableAccount",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultSalesReturnPayableAccount", data)}
                    label="Default Sales Return Payable Acc:"
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="couponCardAccount"
                    value={formState.couponCardAccount}
                    data={formState}
                    field={{
                        id: "couponCardAccount",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("couponCardAccount", data)}
                    label="Coupon Card Account"
                />
                <ERPInput
                    id="redeemPoints"
                    value={formState.redeemPoints}
                    data={formState}
                    label="Redeem Points (Separated by comma)"
                    placeholder="Enter redeem points"
                    onChangeData={(data: any) => handleFieldChange("redeemPoints", data.redeemPoints)}
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultRoundOffAccount"
                    value={formState.defaultRoundOffAccount}
                    data={formState}
                    field={{
                        id: "defaultRoundOffAccount",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.Indirect_Expenses}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultRoundOffAccount", data)}
                    label="Default Round off Account"
                />
                <ERPInput
                    id="keepUserActions"
                    value={formState.keepUserActions.toString()}
                    data={formState}
                    label="Keep User Actions (in Days)"
                    placeholder="Enter number of days"
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("keepUserActions", parseInt(data.keepUserActions, 10))}
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultAdditionalAmountAccount"
                    value={formState.defaultAdditionalAmountAccount}
                    data={formState}
                    field={{
                        id: "defaultAdditionalAmountAccount",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultAdditionalAmountAccount", data)}
                    label="Default Additional Amount Account"
                />
                <ERPDataCombobox
                    id="blockBillDiscount"
                    value={formState.blockBillDiscount}
                    data={formState}
                    field={{
                        id: "blockBillDiscount",
                        required: false,
                        getListUrl: Urls.data_brands,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("blockBillDiscount", data)}
                    label="Block Bill Discount"
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="defaultBrand"
                    value={formState.defaultBrand}
                    data={formState}
                    field={{
                        id: "defaultBrand",
                        required: false,
                        getListUrl: Urls.data_brands,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultBrand", data)}
                    label="Default Brand"
                />
                <ERPInput
                    id="discountAuthorizationIfDiscountAbove"
                    value={formState.discountAuthorizationIfDiscountAbove.toString()}
                    data={formState}
                    label="Discount Authorization if Discount above"
                    placeholder="Enter discount threshold"
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("discountAuthorizationIfDiscountAbove", parseFloat(data.discountAuthorizationIfDiscountAbove))}
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPDataCombobox
                    id="negativeStock"
                    value={formState.negativeStock}
                    data={formState}
                    field={{
                        id: "negativeStock",
                        required: false,
                        getListUrl: Urls.data_countries,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("negativeStock", data)}
                    label="Negative Stock"
                />
            </div>

            <div className="form-row  grid grid-cols-3 gap-3 my-3">
                <ERPCheckbox
                    id="maintainWarehouse"
                    checked={formState.maintainWarehouse}
                    data={formState}
                    label="Maintain Warehouse"
                    onChangeData={(data: any) => handleFieldChange("maintainWarehouse", data.maintainWarehouse)}
                />
                <ERPCheckbox
                    id="setAuthorizationInSales"
                    checked={formState.setAuthorizationInSales}
                    data={formState}
                    label="Set Authorization in Sales"
                    onChangeData={(data: any) => handleFieldChange("setAuthorizationInSales", data.setAuthorizationInSales)}
                />
                <ERPCheckbox
                    id="carryForwardPurchaseOrderQtyToPurchase"
                    checked={formState.carryForwardPurchaseOrderQtyToPurchase}
                    data={formState}
                    label="Carry Forward Purchase Order Qty To Purchase"
                    onChangeData={(data: any) => handleFieldChange("carryForwardPurchaseOrderQtyToPurchase", data.carryForwardPurchaseOrderQtyToPurchase)}
                />
            </div>

            <div className="form-row  grid grid-cols-3 gap-3 my-3">
                <ERPInput
                    id="priceCode"
                    value={formState.priceCode.toString()}
                    data={formState}
                    label="Price Code"
                    placeholder="Enter the Price Code"
                    type="Password"
                    onChangeData={(data: any) => handleFieldChange("priceCode", parseFloat(data.priceCode))}
                />
                <ERPCheckbox
                    id="enableSalesInvoiceDraftOption"
                    checked={formState.enableSalesInvoiceDraftOption}
                    data={formState}
                    label="Enable Sales Invoice Draft Option"
                    onChangeData={(data: any) => handleFieldChange("enableSalesInvoiceDraftOption", data.enableSalesInvoiceDraftOption)}
                />
                <ERPCheckbox
                    id="useCostForStockTransferToBranch"
                    checked={formState.useCostForStockTransferToBranch}
                    data={formState}
                    label="Use Cost For Stock Transfer To Branch"
                    onChangeData={(data: any) => handleFieldChange("useCostForStockTransferToBranch", data.useCostForStockTransferToBranch)}
                />
            </div>

            <div className="form-row   grid grid-cols-3 gap-3 my-3">
                <ERPDataCombobox
                    id="barcodeLabel"
                    value={formState.barcodeLabel}
                    data={formState}
                    field={{
                        id: "barcodeLabel",
                        required: false,
                        getListUrl: Urls.data_countries,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("barcodeLabel", data)}
                    label="Barcode Label"
                />
                <ERPCheckbox
                    id="setProductCostAsDeclarationPrice"
                    checked={formState.setProductCostAsDeclarationPrice}
                    data={formState}
                    label="Set Product Cost as Declaration Price"
                    onChangeData={(data: any) => handleFieldChange("setProductCostAsDeclarationPrice", data.setProductCostAsDeclarationPrice)}
                />
                <ERPCheckbox
                    id="showAccountReceivableInPurchase"
                    checked={formState.showAccountReceivableInPurchase}
                    data={formState}
                    label="Show Account Receivable In Purchase"
                    onChangeData={(data: any) => handleFieldChange("showAccountReceivableInPurchase", data.showAccountReceivableInPurchase)}
                />
            </div>

            <div className="form-row grid grid-cols-3 gap-3 my-3">
                <ERPDataCombobox
                    id="ifLessSalesRate"
                    value={formState.ifLessSalesRate}
                    data={formState}
                    field={{
                        id: "ifLessSalesRate",
                        required: false,
                        getListUrl: Urls.data_languages,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("ifLessSalesRate", data)}
                    label="If Less Sales Rate"
                />
                <ERPCheckbox
                    id="setProductCostWithTaxAmount"
                    checked={formState.setProductCostWithTaxAmount}
                    data={formState}
                    label="Set Product Cost With TAX Amount"
                    onChangeData={(data: any) => handleFieldChange("setProductCostWithTaxAmount", data.setProductCostWithTaxAmount)}
                />
                <ERPCheckbox
                    id="showPrinterSelection"
                    checked={formState.showPrinterSelection}
                    data={formState}
                    label="Show Printer Selection"
                    onChangeData={(data: any) => handleFieldChange("showPrinterSelection", data.showPrinterSelection)}
                />
            </div>

            <div className="form-row  grid grid-cols-3 gap-3 my-3">

                <ERPCheckbox
                    id="setLastSalesRateAsProductSalesRate"
                    checked={formState.setLastSalesRateAsProductSalesRate}
                    data={formState}
                    label="Set Last Sales Rate As Product Sales Rate"
                    onChangeData={(data: any) => handleFieldChange("setLastSalesRateAsProductSalesRate", data.setLastSalesRateAsProductSalesRate)}
                />
                <ERPCheckbox
                    id="blockNonStockSerialSelling"
                    checked={formState.blockNonStockSerialSelling}
                    data={formState}
                    label="Block Non Stock Serial Selling"
                    onChangeData={(data: any) => handleFieldChange("blockNonStockSerialSelling", data.blockNonStockSerialSelling)}
                />
                <ERPCheckbox
                    id="btoUsingMsp"
                    checked={formState.btoUsingMsp}
                    data={formState}
                    label="BTO Using MSP"
                    onChangeData={(data: any) => handleFieldChange("btoUsingMsp", data.btoUsingMsp)}
                />
            </div>

            <div className="form-row grid grid-cols-3 gap-3 my-3">
                <ERPCheckbox
                    id="setLastPurchaseRateAsProductPurchaseRate"
                    checked={formState.setLastPurchaseRateAsProductPurchaseRate}
                    data={formState}
                    label="Set Last Purchase Rate As Product Purchase Rate"
                    onChangeData={(data: any) => handleFieldChange("setLastPurchaseRateAsProductPurchaseRate", data.setLastPurchaseRateAsProductPurchaseRate)}
                />
                <ERPCheckbox
                    id="showProductDuplicationMessage"
                    checked={formState.showProductDuplicationMessage}
                    data={formState}
                    label="Show Product Duplication Message"
                    onChangeData={(data: any) => handleFieldChange("showProductDuplicationMessage", data.showProductDuplicationMessage)}
                />
                <ERPCheckbox
                    id="isReferenceNumberMandatoryInPurchase"
                    checked={formState.isReferenceNumberMandatoryInPurchase}
                    data={formState}
                    label="Is Reference Number Mandatory In Purchase"
                    onChangeData={(data: any) => handleFieldChange("isReferenceNumberMandatoryInPurchase", data.isReferenceNumberMandatoryInPurchase)}
                />
            </div>

            <div className="form-row  grid grid-cols-3 gap-3 my-3">
                <ERPCheckbox
                    id="setAvgPurchaseCostWithLastPurchaseRate"
                    checked={formState.setAvgPurchaseCostWithLastPurchaseRate}
                    data={formState}
                    label="Set Avg. Purchase Cost with Last Purchase Rate"
                    onChangeData={(data: any) => handleFieldChange("setAvgPurchaseCostWithLastPurchaseRate", data.setAvgPurchaseCostWithLastPurchaseRate)}
                />
                <ERPCheckbox
                    id="blockHoldItems"
                    checked={formState.blockHoldItems}
                    data={formState}
                    label="Block Hold Items"
                    onChangeData={(data: any) => handleFieldChange("blockHoldItems", data.blockHoldItems)}
                />
                <ERPCheckbox
                    id="showTransitModeStockTransferAlert"
                    checked={formState.showTransitModeStockTransferAlert}
                    data={formState}
                    label="Show Transit Mode Stock Transfer Alert"
                    onChangeData={(data: any) => handleFieldChange("showTransitModeStockTransferAlert", data.showTransitModeStockTransferAlert)}
                />
            </div>

            <div className="form-row grid grid-cols-3 gap-3 my-3">
                <ERPCheckbox
                    id="updatePurchasePriceOnPurchaseTransfer"
                    checked={formState.updatePurchasePriceOnPurchaseTransfer}
                    data={formState}
                    label="Update Purchase Price On Purchase Transfer"
                    onChangeData={(data: any) => handleFieldChange("updatePurchasePriceOnPurchaseTransfer", data.updatePurchasePriceOnPurchaseTransfer)}
                />
                <ERPCheckbox
                    id="printAfterSave"
                    checked={formState.printAfterSave}
                    data={formState}
                    label="Print After Save"
                    onChangeData={(data: any) => handleFieldChange("printAfterSave", data.printAfterSave)}
                />
                <ERPCheckbox
                    id="showAccountPayableInSales"
                    checked={formState.showAccountPayableInSales}
                    data={formState}
                    label="Show Account Payable In Sales"
                    onChangeData={(data: any) => handleFieldChange("showAccountPayableInSales", data.showAccountPayableInSales)}
                />
            </div>

            <div className="form-row grid grid-cols-3 gap-3 my-3">
                <ERPCheckbox
                    id="showCashSalesSeparateMenu"
                    checked={formState.showCashSalesSeparateMenu}
                    data={formState}
                    label="Show Cash Sales Separate Menu"
                    onChangeData={(data: any) => handleFieldChange("showCashSalesSeparateMenu", data.showCashSalesSeparateMenu)}
                />
                <ERPCheckbox
                    id="needPoApprovalForPrintout"
                    checked={formState.needPoApprovalForPrintout}
                    data={formState}
                    label="Need PO Approval For Printout"
                    onChangeData={(data: any) => handleFieldChange("needPoApprovalForPrintout", data.needPoApprovalForPrintout)}
                />
                <ERPCheckbox
                    id="holdSalesMan"
                    checked={formState.holdSalesMan}
                    data={formState}
                    label="Hold Sales Man"
                    onChangeData={(data: any) => handleFieldChange("holdSalesMan", data.holdSalesMan)}
                />
            </div>

            <div className="form-row grid grid-cols-3 gap-3 my-3">
                <ERPCheckbox
                    id="showNonStockItemsInSales"
                    checked={formState.showNonStockItemsInSales}
                    data={formState}
                    label="Show Non Stock Items in Sales"
                    onChangeData={(data: any) => handleFieldChange("showNonStockItemsInSales", data.showNonStockItemsInSales)}
                />
                <ERPCheckbox
                    id="enableAddStockAdjustment"
                    checked={formState.enableAddStockAdjustment}
                    data={formState}
                    label="Enable Add Stock Adjustment"
                    onChangeData={(data: any) => handleFieldChange("enableAddStockAdjustment", data.enableAddStockAdjustment)}
                />
                <ERPCheckbox
                    id="mobileNumberMandatoryInSales"
                    checked={formState.mobileNumberMandatoryInSales}
                    data={formState}
                    label="Mobile Number Mandatory in Sales"
                    onChangeData={(data: any) => handleFieldChange("mobileNumberMandatoryInSales", data.mobileNumberMandatoryInSales)}
                />
            </div>
            <div className="my-4 flex items-center justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    type="button"
                    className=""
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default InventorySettingsForm;