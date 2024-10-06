import React, { useState } from 'react';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import Urls from '../../../redux/urls';

interface FormState {
    defaultSalesAccount: string;
    defaultSalesReturnAccount: string;
    defaultPurchaseAccount: string;
    defaultPurchaseReturnAccount: string;
    billDiscountGivenLedger: string;
    billDiscountReceivedLedger: string;
    couponCardAccount: string;
    defaultRoundOffAccount: string;
    defaultAdditionalAmountAccount: string;
    defaultBrand: string;
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
    defaultBtoAccount: string;
    defaultBtiAccount: string;
    serviceWarrantyInvAccounts: string;
    serviceNonWarrantyInvAccounts: string;
    defaultServiceSpareWarehouse: string;
    defaultSalesReturnPayableAccount: string;
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
    defaultSalesAccount: '',
    defaultSalesReturnAccount: '',
    defaultPurchaseAccount: '',
    defaultPurchaseReturnAccount: '',
    billDiscountGivenLedger: '',
    billDiscountReceivedLedger: '',
    couponCardAccount: '',
    defaultRoundOffAccount: '',
    defaultAdditionalAmountAccount: '',
    defaultBrand: '',
    negativeStock: '',
    maintainWarehouse: false,
    priceCode: '',
    barcodeLabel: '',
    ifLessSalesRate: '',
    setLastSalesRateAsProductSalesRate: false,
    setLastPurchaseRateAsProductPurchaseRate: false,
    setAvgPurchaseCostWithLastPurchaseRate: false,
    updatePurchasePriceOnPurchaseTransfer: false,
    showCashSalesSeparateMenu: false,
    showNonStockItemsInSales: false,
    defaultBtoAccount: '',
    defaultBtiAccount: '',
    serviceWarrantyInvAccounts: '',
    serviceNonWarrantyInvAccounts: '',
    defaultServiceSpareWarehouse: '',
    defaultSalesReturnPayableAccount: '',
    redeemPoints: '',
    keepUserActions: 0,
    blockBillDiscount: '',
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

const ERPSettingsForm: React.FC = () => {
    const [formState, setFormState] = useState<FormState>(initialState);

    const handleFieldChange = (field: keyof FormState, value: any) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return (
        <div className="erp-settings-form">
            <div className="form-row">
                <ERPDataCombobox
                    id="defaultSalesAccount"
                    value={formState.defaultSalesAccount}
                    data={formState}
                    field={{
                        id: "defaultSalesAccount",
                        required: true,
                        getListUrl: Urls.data_counters,
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
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultBtoAccount", data)}
                    label="Default BTO Account"
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="defaultSalesReturnAccount"
                    value={formState.defaultSalesReturnAccount}
                    data={formState}
                    field={{
                        id: "defaultSalesReturnAccount",
                        required: true,
                        getListUrl: Urls.data_counters,
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
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultBtiAccount", data)}
                    label="Default BTI Account"
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="defaultPurchaseAccount"
                    value={formState.defaultPurchaseAccount}
                    data={formState}
                    field={{
                        id: "defaultPurchaseAccount",
                        required: true,
                        getListUrl: Urls.data_counters,
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
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("serviceWarrantyInvAccounts", data)}
                    label="Service Warranty Inv Accounts"
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="defaultPurchaseReturnAccount"
                    value={formState.defaultPurchaseReturnAccount}
                    data={formState}
                    field={{
                        id: "defaultPurchaseReturnAccount",
                        required: true,
                        getListUrl: Urls.data_counters,
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
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("serviceNonWarrantyInvAccounts", data)}
                    label="Service Non Warranty Inv Accounts"
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="billDiscountGivenLedger"
                    value={formState.billDiscountGivenLedger}
                    data={formState}
                    field={{
                        id: "billDiscountGivenLedger",
                        required: true,
                        getListUrl: Urls.data_counters,
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

            <div className="form-row">
                <ERPDataCombobox
                    id="billDiscountReceivedLedger"
                    value={formState.billDiscountReceivedLedger}
                    data={formState}
                    field={{
                        id: "billDiscountReceivedLedger",
                        required: true,
                        getListUrl: Urls.data_counters,
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
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultSalesReturnPayableAccount", data)}
                    label="Default Sales Return Payable Acc:"
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="couponCardAccount"
                    value={formState.couponCardAccount}
                    data={formState}
                    field={{
                        id: "couponCardAccount",
                        required: false,
                        getListUrl: Urls.data_counters,
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
                    onChangeData={(data: any) => handleFieldChange("redeemPoints", data)}
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="defaultRoundOffAccount"
                    value={formState.defaultRoundOffAccount}
                    data={formState}
                    field={{
                        id: "defaultRoundOffAccount",
                        required: false,
                        getListUrl: Urls.data_counters,
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
                    onChangeData={(data: any) => handleFieldChange("keepUserActions", parseInt(data, 10))}
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="defaultAdditionalAmountAccount"
                    value={formState.defaultAdditionalAmountAccount}
                    data={formState}
                    field={{
                        id: "defaultAdditionalAmountAccount",
                        required: false,
                        getListUrl: Urls.data_counters,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("defaultAdditionalAmountAccount", data)}
                    label="Default Additional Amount Account"
                />
                <ERPDataCombobox
                    field={{
                        id: "blockBillDiscount",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    id="blockBillDiscount"
                    label="Block Bill Discount"
                    value={formState.blockBillDiscount}
                    onChangeData={(data) => {
                        handleFieldChange("blockBillDiscount", data.blockBillDiscount)
                    }}
                    options={[
                        { value: '0', label: 'No' },
                        { value: '1', label: 'On Pos' },
                        { value: '2', label: 'On Standard Sales' },
                        { value: '3', label: 'On Both' },
                        { value: '4', label: 'If Authentication Fails' },
                    ]}
                />
            </div>

            <div className="form-row">
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
                    onChangeData={(data: any) => handleFieldChange("discountAuthorizationIfDiscountAbove", parseFloat(data))}
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    field={{
                        id: "negativeStock",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    id="negativeStock"
                    label="Negative Stock"
                    value={formState.negativeStock}
                    onChangeData={(data) => {
                        handleFieldChange("negativeStock", data.negativeStock)
                    }}
                    options={[
                        { value: '0', label: 'Block' },
                        { value: '1', label: 'Warm' },
                        { value: '2', label: 'Ignore' },
                    ]}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="maintainWarehouse"
                    checked={formState.maintainWarehouse}
                    data={formState}
                    label="Maintain Warehouse"
                    onChangeData={(data: any) => handleFieldChange("maintainWarehouse", data)}
                />
            </div>

            <div className="form-row">
                <ERPInput
                    id="priceCode"
                    value={formState.priceCode.toString()}
                    data={formState}
                    label="Price Code"
                    placeholder="Enter the Price Code"
                    type="Password"
                    onChangeData={(data: any) => handleFieldChange("priceCode", parseFloat(data))}
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    id="barcodeLabel"
                    value={formState.barcodeLabel}
                    data={formState}
                    field={{
                        id: "barcodeLabel",
                        required: false,
                        getListUrl: Urls.data_brands,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("barcodeLabel", data)}
                    label="Barcode Label"
                />
            </div>

            <div className="form-row">
                <ERPDataCombobox
                    field={{
                        id: "ifLessSalesRate",
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    id="ifLessSalesRate"
                    label="If Less Sales Rate"
                    value={formState.ifLessSalesRate}
                    onChangeData={(data) => {
                        handleFieldChange("ifLessSalesRate", data.ifLessSalesRate)
                    }}
                    options={[
                        { value: '0', label: 'No' },
                        { value: '1', label: 'On Pos' },
                        { value: '2', label: 'On Standard Sales' },
                        { value: '3', label: 'On Both' },
                        { value: '4', label: 'If Authentication Fails' },
                    ]}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="setLastSalesRateAsProductSalesRate"
                    checked={formState.setLastSalesRateAsProductSalesRate}
                    data={formState}
                    label="Set Last Sales Rate As Product Sales Rate"
                    onChangeData={(data: any) => handleFieldChange("setLastSalesRateAsProductSalesRate", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="setLastPurchaseRateAsProductPurchaseRate"
                    checked={formState.setLastPurchaseRateAsProductPurchaseRate}
                    data={formState}
                    label="Set Last Purchase Rate As Product Purchase Rate"
                    onChangeData={(data: any) => handleFieldChange("setLastPurchaseRateAsProductPurchaseRate", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="setAvgPurchaseCostWithLastPurchaseRate"
                    checked={formState.setAvgPurchaseCostWithLastPurchaseRate}
                    data={formState}
                    label="Set Avg. Purchase Cost with Last Purchase Rate"
                    onChangeData={(data: any) => handleFieldChange("setAvgPurchaseCostWithLastPurchaseRate", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="updatePurchasePriceOnPurchaseTransfer"
                    checked={formState.updatePurchasePriceOnPurchaseTransfer}
                    data={formState}
                    label="Update Purchase Price On Purchase Transfer"
                    onChangeData={(data: any) => handleFieldChange("updatePurchasePriceOnPurchaseTransfer", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showCashSalesSeparateMenu"
                    checked={formState.showCashSalesSeparateMenu}
                    data={formState}
                    label="Show Cash Sales Separate Menu"
                    onChangeData={(data: any) => handleFieldChange("showCashSalesSeparateMenu", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showNonStockItemsInSales"
                    checked={formState.showNonStockItemsInSales}
                    data={formState}
                    label="Show Non Stock Items in Sales"
                    onChangeData={(data: any) => handleFieldChange("showNonStockItemsInSales", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="setAuthorizationInSales"
                    checked={formState.setAuthorizationInSales}
                    data={formState}
                    label="Set Authorization in Sales"
                    onChangeData={(data: any) => handleFieldChange("setAuthorizationInSales", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="enableSalesInvoiceDraftOption"
                    checked={formState.enableSalesInvoiceDraftOption}
                    data={formState}
                    label="Enable Sales Invoice Draft Option"
                    onChangeData={(data: any) => handleFieldChange("enableSalesInvoiceDraftOption", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="setProductCostAsDeclarationPrice"
                    checked={formState.setProductCostAsDeclarationPrice}
                    data={formState}
                    label="Set Product Cost as Declaration Price"
                    onChangeData={(data: any) => handleFieldChange("setProductCostAsDeclarationPrice", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="setProductCostWithTaxAmount"
                    checked={formState.setProductCostWithTaxAmount}
                    data={formState}
                    label="Set Product Cost With TAX Amount"
                    onChangeData={(data: any) => handleFieldChange("setProductCostWithTaxAmount", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="blockNonStockSerialSelling"
                    checked={formState.blockNonStockSerialSelling}
                    data={formState}
                    label="Block Non Stock Serial Selling"
                    onChangeData={(data: any) => handleFieldChange("blockNonStockSerialSelling", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showProductDuplicationMessage"
                    checked={formState.showProductDuplicationMessage}
                    data={formState}
                    label="Show Product Duplication Message"
                    onChangeData={(data: any) => handleFieldChange("showProductDuplicationMessage", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="blockHoldItems"
                    checked={formState.blockHoldItems}
                    data={formState}
                    label="Block Hold Items"
                    onChangeData={(data: any) => handleFieldChange("blockHoldItems", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="printAfterSave"
                    checked={formState.printAfterSave}
                    data={formState}
                    label="Print After Save"
                    onChangeData={(data: any) => handleFieldChange("printAfterSave", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="needPoApprovalForPrintout"
                    checked={formState.needPoApprovalForPrintout}
                    data={formState}
                    label="Need PO Approval For Printout"
                    onChangeData={(data: any) => handleFieldChange("needPoApprovalForPrintout", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="enableAddStockAdjustment"
                    checked={formState.enableAddStockAdjustment}
                    data={formState}
                    label="Enable Add Stock Adjustment"
                    onChangeData={(data: any) => handleFieldChange("enableAddStockAdjustment", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="carryForwardPurchaseOrderQtyToPurchase"
                    checked={formState.carryForwardPurchaseOrderQtyToPurchase}
                    data={formState}
                    label="Carry Forward Purchase Order Qty To Purchase"
                    onChangeData={(data: any) => handleFieldChange("carryForwardPurchaseOrderQtyToPurchase", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="useCostForStockTransferToBranch"
                    checked={formState.useCostForStockTransferToBranch}
                    data={formState}
                    label="Use Cost For Stock Transfer To Branch"
                    onChangeData={(data: any) => handleFieldChange("useCostForStockTransferToBranch", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showAccountReceivableInPurchase"
                    checked={formState.showAccountReceivableInPurchase}
                    data={formState}
                    label="Show Account Receivable In Purchase"
                    onChangeData={(data: any) => handleFieldChange("showAccountReceivableInPurchase", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showPrinterSelection"
                    checked={formState.showPrinterSelection}
                    data={formState}
                    label="Show Printer Selection"
                    onChangeData={(data: any) => handleFieldChange("showPrinterSelection", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="btoUsingMsp"
                    checked={formState.btoUsingMsp}
                    data={formState}
                    label="BTO Using MSP"
                    onChangeData={(data: any) => handleFieldChange("btoUsingMsp", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="isReferenceNumberMandatoryInPurchase"
                    checked={formState.isReferenceNumberMandatoryInPurchase}
                    data={formState}
                    label="Is Reference Number Mandatory In Purchase"
                    onChangeData={(data: any) => handleFieldChange("isReferenceNumberMandatoryInPurchase", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showTransitModeStockTransferAlert"
                    checked={formState.showTransitModeStockTransferAlert}
                    data={formState}
                    label="Show Transit Mode Stock Transfer Alert"
                    onChangeData={(data: any) => handleFieldChange("showTransitModeStockTransferAlert", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="showAccountPayableInSales"
                    checked={formState.showAccountPayableInSales}
                    data={formState}
                    label="Show Account Payable In Sales"
                    onChangeData={(data: any) => handleFieldChange("showAccountPayableInSales", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="holdSalesMan"
                    checked={formState.holdSalesMan}
                    data={formState}
                    label="Hold Sales Man"
                    onChangeData={(data: any) => handleFieldChange("holdSalesMan", data)}
                />
            </div>

            <div className="form-row">
                <ERPCheckbox
                    id="mobileNumberMandatoryInSales"
                    checked={formState.mobileNumberMandatoryInSales}
                    data={formState}
                    label="Mobile Number Mandatory in Sales"
                    onChangeData={(data: any) => handleFieldChange("mobileNumberMandatoryInSales", data)}
                />
            </div>
        </div>
    );
};

export default ERPSettingsForm;