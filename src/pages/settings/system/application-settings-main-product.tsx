import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPSelect from '../../../components/ERPComponents/erp-select';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';

interface Settings {
  imageLocation: string,
  weighingScaleBarcodeType: string,
  lastGeneratedBarcode: string,
  pposPriceCategory: string,
  marginRoundTo:number,
  hsnCode: string,
  lpPriceLessThanSelling: boolean,
  mrpLessThanSalesPrice: boolean,
  zeroMultiRateValidate: boolean,
  defaultQty: boolean,
  multiRate: boolean,
  multiUnit: boolean,
  sharedGiftPath: string,
  giftOnBilling: boolean,
  loadCustomerLastSalesRate: boolean,
  focusToQtyAfterBarcode: boolean,
  loadDummyProducts: boolean,
  showRateBeforeTax: boolean,
  maintainSchemes: boolean,
  enableSupplierWiseItemCode: boolean,
  enableMultiWarehouseBilling: boolean,
}
const initialSettings: Settings = {
  imageLocation: "",
  weighingScaleBarcodeType: "",
  lastGeneratedBarcode: "",
  pposPriceCategory: "",
  marginRoundTo: 0,
  hsnCode: "",
  lpPriceLessThanSelling: false,
  mrpLessThanSalesPrice: false,
  zeroMultiRateValidate: false,
  defaultQty: false,
  multiRate: false,
  multiUnit: false,
  sharedGiftPath: "",
  giftOnBilling: false,
  loadCustomerLastSalesRate: false,
  focusToQtyAfterBarcode: false,
  loadDummyProducts: false,
  showRateBeforeTax: false,
  maintainSchemes: false,
  enableSupplierWiseItemCode: false,
  enableMultiWarehouseBilling: false,
};

const ApplicationSettingsProduct = () => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [changedSettings, setChangedSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      const data: Settings = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = ((settingName: any, value: any) => {
    setSettings((prevSettings = {} as Settings) => ({
      ...prevSettings,
      [settingName]: value ?? ''
    }));
    
    setChangedSettings((prevChangedSettings = {} as Settings) => ({
      ...prevChangedSettings,
      [settingName]: value ?? ''
    }));
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedSettings),
      });
      if (response.ok) {
        console.log('Settings saved successfully');
        setChangedSettings({});
      } else {
        console.error('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading settings?...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Pageheader><p>asasa</p></Pageheader>
        <div className="grid grid-cols-5 gap-6">
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
              debugger;
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
        </div>
      </form>
  );
};

export default ApplicationSettingsProduct;
