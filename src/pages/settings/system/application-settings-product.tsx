import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';
import ERPToast from '../../../components/ERPComponents/erp-toast';
import { APIClient } from '../../../helpers/api-client';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';

interface FormState {
  setDefaultQty1: boolean;
  allowMultiUnits: boolean;
  allowMultirate: boolean;
  batchCriteria: string;
  loadCustomerLastRate: boolean;
  loadDummyProducts: boolean;
  marginRoundTo: number;
  focusToQtyAfterBarcode: boolean;
  stockTransferNegativeStock: string;
  allowManualProductSelectionInSales: boolean;
  useProductImages: boolean;
  productImagePath: string;
  maintainSchemes: boolean;
  weighingScaleBarcodeType: string;
  pPOsPriceCategory: number;
  showRateBeforeTax: boolean;
  stopScanningOnWrongBarcode: boolean;
  allowOnlyScanProductMarkedAsWeighingScaleItems: boolean;
  loadListedProductPrices: boolean;
  advancedProductSearching: boolean;
  blockQtyChangeOptionInPOS: boolean;
  enableGoogleTranslationOfProductName: boolean;
  setQty1ForWeighingScaleItem_ValueMode: boolean;
  allowUpdateSalesPriceFromPurchase: boolean;
  usePopupWindowForItemSearch: boolean;
  enableMultiWarehouseBilling: boolean;
  enableSupplierWiseItemCode: boolean;
  includeSearchItemAlias_ItemName2: boolean;
  lastSystemGeneratedBarcode: number;
  stopScanningOnWrongBarcodeInSales: boolean;
  excludeSchemeProductAmountFromPrivilegeCard: boolean;
  showPurchaseCostChangeWarning: boolean;
  listBarcodeItemsInItemLookup: boolean;
  showHSNCodeWarning: string;
  giftOnBilling: boolean;
  setProductQtyLimitinSales: boolean;
  enableQtySlabOffer: boolean;
  giftOnBillingAs: string;
  enableMultiFOC: boolean;
  lPPriceLessThanSellingPrice: string;
  mRPLessThanSalesPrice: string;
  zeroMultiRateValidate: string;
  allowUpdateMultiRateinPurchase: boolean;
}


const ApplicationSettingsProduct = () => {
const initialState: FormState = {
  setDefaultQty1: true,
  allowMultiUnits: true,
  allowMultirate: false,
  batchCriteria: "NB",
  loadCustomerLastRate: false,
  loadDummyProducts: false,
  marginRoundTo: 0,
  focusToQtyAfterBarcode: true,
  stockTransferNegativeStock: "Warn",
  allowManualProductSelectionInSales: true,
  useProductImages: false,
  productImagePath: " ",
  maintainSchemes: false,
  weighingScaleBarcodeType: "Standard. No Check Digit",
  pPOsPriceCategory: 1,
  showRateBeforeTax: false,
  stopScanningOnWrongBarcode: false,
  allowOnlyScanProductMarkedAsWeighingScaleItems: false,
  loadListedProductPrices: false,
  advancedProductSearching: false,
  blockQtyChangeOptionInPOS: false,
  enableGoogleTranslationOfProductName: true,
  setQty1ForWeighingScaleItem_ValueMode: true,
  allowUpdateSalesPriceFromPurchase: false,
  usePopupWindowForItemSearch: false,
  enableMultiWarehouseBilling: false,
  enableSupplierWiseItemCode: false,
  includeSearchItemAlias_ItemName2: true,
  lastSystemGeneratedBarcode: 1000000000001,
  stopScanningOnWrongBarcodeInSales: false,
  excludeSchemeProductAmountFromPrivilegeCard: false,
  showPurchaseCostChangeWarning: false,
  listBarcodeItemsInItemLookup: false,
  showHSNCodeWarning: "Warn",
  giftOnBilling: false,
  setProductQtyLimitinSales: false,
  enableQtySlabOffer: false,
  giftOnBillingAs: "Products",
  enableMultiFOC: false,
  lPPriceLessThanSellingPrice: "Warn",
  mRPLessThanSalesPrice: "Warn",
  zeroMultiRateValidate: "Warn",
  allowUpdateMultiRateinPurchase: false
};


const [formState, setFormState] = useState<FormState>(initialState);
const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
const [loading, setLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState<string | null>(null);
const api = new APIClient();
const dispatch = useAppDispatch();

useEffect(() => {
  loadSettings();
}, []);

const loadSettings = async () => {
  setLoading(true);
  try {
    const response = await api.getAsync(`${Urls.application_settings}products`);
    debugger;
    console.log(formState);
    setFormStatePrev(response);
    setFormState(response);
  } catch (error) {
    console.error("Error loading settings:", error);
  } finally {
    setLoading(false);
  }
};

const handleFieldChange = (field: keyof typeof initialState, value: any) => {
  setFormState((prevState) => ({
    ...prevState,
    [field]: value,
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  try {
    const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
      const currentValue = formState?.[key as keyof FormState];
      const prevValue = formStatePrev[key as keyof FormState];

      if (currentValue !== prevValue) {
        debugger;
        acc.push({
          settingsName: key,
          settingsValue: currentValue,
        });
      }
      return acc;
    }, [] as { settingsName: string; settingsValue: any }[]);
    console.log(modifiedSettings);

    const response = (await api.put(Urls.application_settings, {
      type: "products",
      updateList: modifiedSettings,
    })) as any;
    debugger;
    if (response != undefined && response != null && response.IsOk == true) {
      ERPToast.showWith(response?.message, "success");
    } else {
      ERPToast.showWith(response?.message, "warning");
    }
  } catch (error) {
    console.error("Error saving settings:", error);
  } finally {
    setIsSaving(false);
  }
};
//   if (loading) {
//     return <div>Loading settings...</div>;
//   }

if (error) {
  return (
    <div className="error-message">
      {error}
      <button onClick={loadSettings}>Retry</button>
    </div>
  );
}
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
        {/* <div className="grid grid-cols-5 gap-6">
          <ERPDataCombobox
          id = "currency"
            field={{
              id: "currency",
              required: true,
              getListUrl:Urls.data_currencies,
              valueKey: "id",
              labelKey: "name",
            }}
            value={settings?.currency}
            onChangeData={(data) => handleFieldChange("Currency", data.Currency)}
            label="Currency"
          />
          <ERPDataCombobox
          field={{
            id: "unitPriceDecimalPoints",
            valueKey: "value",
            labelKey: "label",
          }}
            id="unitPriceDecimalPoints"
            label="Unit Price Decimal Points"
            value={settings?.unitPriceDecimalPoints}
            data={settings}
            onChangeData={(data) =>{
              
              handleFieldChange("unitPriceDecimalPoints", data.unitPriceDecimalPoints)
            }}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <ERPInput
            id="DecimalPoints"
            label="Decimal Points"
            type="select"
            value={settings?.DecimalPoints}
            onChangeData={(data) => handleFieldChange("DecimalPoints", data.DecimalPoints)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <ERPInput
            id="CurrencyFormat"
            label="Currency Format"
            type="select"
            value={settings?.CurrencyFormat}
            onChangeData={(data) => handleFieldChange("CurrencyFormat", data.CurrencyFormat)}
            options={[
              { value: 'Millions', label: 'Millions' },
              { value: 'Thousands', label: 'Thousands' },
              { value: 'Hundreds', label: 'Hundreds' },
            ]}
          />
          <ERPInput
            id="RoundingMethod"
            label="Rounding Method"
            type="select"
            value={settings?.RoundingMethod}
            onChangeData={(data) => handleFieldChange("RoundingMethod", data.RoundingMethod)}
            options={[
              { value: 'Round', label: 'Round' },
              { value: 'RoundUp', label: 'Round Up' },
              { value: 'RoundDown', label: 'Round Down' },
            ]}
          />
          <ERPInput
            id="SalesRoundingMethod"
            label="Sales Rounding Method"
            type="select"
            value={settings?.SalesRoundingMethod}
            onChangeData={(data) => handleFieldChange("SalesRoundingMethod", data.SalesRoundingMethod)}
            options={[
              { value: 'Round', label: 'Round' },
              { value: 'RoundUp', label: 'Round Up' },
              { value: 'RoundDown', label: 'Round Down' },
            ]}
          />
          <ERPInput
            id="TaxDecimalPoints"
            label="Tax Decimal Points"
            type="select"
            value={settings?.TaxDecimalPoints}
            onChangeData={(data) => handleFieldChange("TaxDecimalPoints", data.TaxDecimalPoints)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <ERPInput
            id="RoundingMethodGlobal"
            label="Rounding Method Global"
            type="select"
            value={settings?.RoundingMethodGlobal}
            onChangeData={(data) => handleFieldChange("RoundingMethodGlobal", data.RoundingMethodGlobal)}
            options={[
              { value: 'Round', label: 'Round' },
              { value: 'RoundUp', label: 'Round Up' },
              { value: 'RoundDown', label: 'Round Down' },
            ]}
          />
          <ERPCheckbox
          id="AutoChangeTransactionDate"
          label="Auto Change Transaction Date By 12:00 AM"
          checked={settings?.AutoChangeTransactionDate}
          onChangeData={(data) => handleFieldChange("AutoChangeTransactionDate", data.AutoChangeTransactionDate)}
        />
         <ERPInput
            id="AutoUpdateReleaseUpTo"
            label="Auto Update Release Up To"
            type="number"
            value={settings?.AutoUpdateReleaseUpTo}
            onChangeData={(data) => handleFieldChange("AutoUpdateReleaseUpTo", data.AutoUpdateReleaseUpTo)}
          />
        </div>

        

        <div className="flex items-center space-x-4">
         
          <ERPInput
            id="OTPEmail"
            label="OTP Email"
            className="flex-grow"
            value={settings?.OTPEmail}
            onChangeData={(data) => handleFieldChange("OTPEmail", data.OTPEmail)}
          />
          <ERPButton
            title="Send OTP"
            variant="secondary"
            onClick={() => console.log('Send OTP clicked')}
          />
          <ERPInput
            id="OTPVerification"
            placeholder="Enter OTP"
            className="w-32"
            value={settings?.OTPVerification}
            onChangeData={(data) => handleFieldChange("OTPVerification", data.OTPVerification)}
          />
          <ERPButton
            title="Verify"
            variant="primary"
            onClick={() => console.log('Verify OTP clicked')}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <ERPCheckbox
              id="AllowPrivilegeCard"
              label="Allow Privilege Card"
              checked={settings?.AllowPrivilegeCard}
              onChangeData={(data) => handleFieldChange("AllowPrivilegeCard", data.AllowPrivilegeCard)}
            />
            <ERPInput
              id="PrivilegeCardPercentage"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings?.PrivilegeCardPercentage}
              onChangeData={(data) => handleFieldChange("PrivilegeCardPercentage", data.PrivilegeCardPercentage)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="AllowPostdatedTransaction"
              label="Allow Postdated Transaction"
              checked={settings?.AllowPostdatedTransaction}
              onChangeData={(data) => handleFieldChange("AllowPostdatedTransaction", data.AllowPostdatedTransaction)}
            />
            <ERPInput
              id="PostdatedTransactionDays"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings?.PostdatedTransactionDays}
              onChangeData={(data) => handleFieldChange("PostdatedTransactionDays", data.PostdatedTransactionDays)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="AllowPredatedTransaction"
              label="Allow Predated Transaction"
              checked={settings?.AllowPredatedTransaction}
              onChangeData={(data) => handleFieldChange("AllowPredatedTransaction", data.AllowPredatedTransaction)}
            />
            <ERPInput
              id="PredatedTransactionDays"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings?.PredatedTransactionDays}
              onChangeData={(data) => handleFieldChange("PredatedTransactionDays", data.PredatedTransactionDays)}
            />
          </div>
        </div>

      
        <div className="grid grid-cols-4 gap-6">
        <ERPCheckbox
          id="MaintainSeparatePrefixForCashSales"
          label="Maintain Separate Prefix for Cash Sales"
          checked={settings?.MaintainSeparatePrefixForCashSales}
          onChangeData={(data) => handleFieldChange("MaintainSeparatePrefixForCashSales", data.MaintainSeparatePrefixForCashSales)}
        />

          <ERPCheckbox
            id="SaveModifiedTransactionSummary"
            label="Save Modified Transaction Summary"
            checked={settings?.SaveModifiedTransactionSummary}
            onChangeData={(data) => handleFieldChange("SaveModifiedTransactionSummary", data.SaveModifiedTransactionSummary)}
          />
          <ERPCheckbox
            id="MaintainProduction"
            label="Maintain Production"
            checked={settings?.MaintainProduction}
            onChangeData={(data) => handleFieldChange("MaintainProduction", data.MaintainProduction)}
          />
          <ERPCheckbox
            id="ShowReminders"
            label="Show Reminders"
            checked={settings?.ShowReminders}
            onChangeData={(data) => handleFieldChange("ShowReminders", data.ShowReminders)}
          />
          <ERPCheckbox
            id="EnableSecondDisplay"
            label="Enable Second Display"
            checked={settings?.EnableSecondDisplay}
            onChangeData={(data) => handleFieldChange("EnableSecondDisplay", data.EnableSecondDisplay)}
          />
          <ERPCheckbox
            id="AllowSalesRouteArea"
            label="Allow Sales Route/Area"
            checked={settings?.AllowSalesRouteArea}
            onChangeData={(data) => handleFieldChange("AllowSalesRouteArea", data.AllowSalesRouteArea)}
          />
          <ERPCheckbox
            id="EnableDayEnd"
            label="Enable Day End"
            checked={settings?.EnableDayEnd}
            onChangeData={(data) => handleFieldChange("EnableDayEnd", data.EnableDayEnd)}
          />
          <ERPCheckbox
            id="MaintainSalesRouteCreditLimit"
            label="Maintain Sales Route Credit Limit"
            checked={settings?.MaintainSalesRouteCreditLimit}
            onChangeData={(data) => handleFieldChange("MaintainSalesRouteCreditLimit", data.MaintainSalesRouteCreditLimit)}
          />
          <ERPCheckbox
            id="MaintainMultilanguage"
            label="Maintain Multilanguage"
            checked={settings?.MaintainMultilanguage}
            onChangeData={(data) => handleFieldChange("MaintainMultilanguage", data.MaintainMultilanguage)}
          />
          <ERPCheckbox
            id="ShowUserMessages"
            label="Show User Messages"
            checked={settings?.ShowUserMessages}
            onChangeData={(data) => handleFieldChange("ShowUserMessages", data.ShowUserMessages)}
          />
        </div>

        <ERPInput
          id="BusinessType"
          label="Business Type"
          type="select"
          value={settings?.BusinessType}
          onChangeData={(data) => handleFieldChange("BusinessType", data.BusinessType)}
          options={[
            { value: 'Retail', label: 'Retail' },
            { value: 'Wholesale', label: 'Wholesale' },
            { value: 'Manufacturing', label: 'Manufacturing' },
          ]}
        />

        <div className="flex justify-end">
          <ERPButton
            title="Save Settings"
            variant="primary"
            type="submit"
          />
        </div> */}
      </form>
  );
};

export default ApplicationSettingsProduct;
