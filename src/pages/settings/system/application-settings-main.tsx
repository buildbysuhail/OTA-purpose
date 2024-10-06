import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPSelect from '../../../components/ERPComponents/erp-select';

const ERPSettingsFormMain = () => {
  const [settings, setSettings] = useState<any>({});
  const [changedSettings, setChangedSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    setLoading(false);
  };

  const handleFieldChange = (settingName: string, value: string | number | boolean) => {
    setSettings((prevSettings: any) => ({
      ...prevSettings,
      [settingName]: value
    }));
    setChangedSettings(prevChangedSettings => ({
      ...prevChangedSettings,
      [settingName]: value
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Replace this with your actual API call
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
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <ERPDataCombobox
          id = "currency"
            field={{
              id: "Currency",
              required: true,
              getListUrl: "/api/currencies",
              valueKey: "id",
              labelKey: "name",
            }}
            value={settings?.currency}
            onChangeData={(data) => handleFieldChange("Currency", data.Currency)}
            label="Currency"
          />
          <ERPSelect
            id="UnitPriceDecimalPoints"
            label="Unit Price Decimal Points"
            value={settings.UnitPriceDecimalPoints}
            handleChange={(data: any) => handleFieldChange("UnitPriceDecimalPoints", data?.value)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <ERPSelect
            id="DecimalPoints"
            label="Decimal Points"
            value={settings.DecimalPoints}
            handleChange={(data: any) => handleFieldChange("DecimalPoints", data.value)}
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
            value={settings.CurrencyFormat}
            onChangeData={(data) => handleFieldChange("CurrencyFormat", data.CurrencyFormat)}
            // options={[
            //   { value: 'Millions', label: 'Millions' },
            //   { value: 'Thousands', label: 'Thousands' },
            //   { value: 'Hundreds', label: 'Hundreds' },
            // ]}
          />
          <ERPInput
            id="RoundingMethod"
            label="Rounding Method"
            type="select"
            value={settings.RoundingMethod}
            onChangeData={(data) => handleFieldChange("RoundingMethod", data.RoundingMethod)}
            // options={[
            //   { value: 'Round', label: 'Round' },
            //   { value: 'RoundUp', label: 'Round Up' },
            //   { value: 'RoundDown', label: 'Round Down' },
            // ]}
          />
          <ERPInput
            id="SalesRoundingMethod"
            label="Sales Rounding Method"
            type="select"
            value={settings.SalesRoundingMethod}
            onChangeData={(data) => handleFieldChange("SalesRoundingMethod", data.SalesRoundingMethod)}
            // options={[
            //   { value: 'Round', label: 'Round' },
            //   { value: 'RoundUp', label: 'Round Up' },
            //   { value: 'RoundDown', label: 'Round Down' },
            // ]}
          />
          <ERPInput
            id="TaxDecimalPoints"
            label="Tax Decimal Points"
            type="select"
            value={settings.TaxDecimalPoints}
            onChangeData={(data) => handleFieldChange("TaxDecimalPoints", data.TaxDecimalPoints)}
            // options={[
            //   { value: '0', label: '0' },
            //   { value: '1', label: '1' },
            //   { value: '2', label: '2' },
            //   { value: '3', label: '3' },
            //   { value: '4', label: '4' },
            // ]}
          />
          <ERPInput
            id="RoundingMethodGlobal"
            label="Rounding Method Global"
            type="select"
            value={settings.RoundingMethodGlobal}
            onChangeData={(data) => handleFieldChange("RoundingMethodGlobal", data.RoundingMethodGlobal)}
            // options={[
            //   { value: 'Round', label: 'Round' },
            //   { value: 'RoundUp', label: 'Round Up' },
            //   { value: 'RoundDown', label: 'Round Down' },
            // ]}
          />
        </div>

        <ERPCheckbox
          id="AutoChangeTransactionDate"
          label="Auto Change Transaction Date By 12:00 AM"
          checked={settings.AutoChangeTransactionDate}
          onChangeData={(data) => handleFieldChange("AutoChangeTransactionDate", data.AutoChangeTransactionDate)}
        />

        <div className="flex items-center space-x-4">
          <ERPInput
            id="AutoUpdateReleaseUpTo"
            label="Auto Update Release Up To"
            type="number"
            className="w-24"
            value={settings.AutoUpdateReleaseUpTo}
            onChangeData={(data) => handleFieldChange("AutoUpdateReleaseUpTo", data.AutoUpdateReleaseUpTo)}
          />
          <ERPInput
            id="OTPEmail"
            label="OTP Email"
            className="flex-grow"
            value={settings.OTPEmail}
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
            value={settings.OTPVerification}
            onChangeData={(data) => handleFieldChange("OTPVerification", data.OTPVerification)}
          />
          <ERPButton
            title="Verify"
            variant="primary"
            onClick={() => console.log('Verify OTP clicked')}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <ERPCheckbox
              id="AllowPrivilegeCard"
              label="Allow Privilege Card"
              checked={settings.AllowPrivilegeCard}
              onChangeData={(data) => handleFieldChange("AllowPrivilegeCard", data.AllowPrivilegeCard)}
            />
            <ERPInput
              id="PrivilegeCardPercentage"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings.PrivilegeCardPercentage}
              onChangeData={(data) => handleFieldChange("PrivilegeCardPercentage", data.PrivilegeCardPercentage)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="AllowPostdatedTransaction"
              label="Allow Postdated Transaction"
              checked={settings.AllowPostdatedTransaction}
              onChangeData={(data) => handleFieldChange("AllowPostdatedTransaction", data.AllowPostdatedTransaction)}
            />
            <ERPInput
              id="PostdatedTransactionDays"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings.PostdatedTransactionDays}
              onChangeData={(data) => handleFieldChange("PostdatedTransactionDays", data.PostdatedTransactionDays)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="AllowPredatedTransaction"
              label="Allow Predated Transaction"
              checked={settings.AllowPredatedTransaction}
              onChangeData={(data) => handleFieldChange("AllowPredatedTransaction", data.AllowPredatedTransaction)}
            />
            <ERPInput
              id="PredatedTransactionDays"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings.PredatedTransactionDays}
              onChangeData={(data) => handleFieldChange("PredatedTransactionDays", data.PredatedTransactionDays)}
            />
          </div>
        </div>

        <ERPCheckbox
          id="MaintainSeparatePrefixForCashSales"
          label="Maintain Separate Prefix for Cash Sales"
          checked={settings.MaintainSeparatePrefixForCashSales}
          onChangeData={(data) => handleFieldChange("MaintainSeparatePrefixForCashSales", data.MaintainSeparatePrefixForCashSales)}
        />

        <div className="grid grid-cols-2 gap-6">
          <ERPCheckbox
            id="SaveModifiedTransactionSummary"
            label="Save Modified Transaction Summary"
            checked={settings.SaveModifiedTransactionSummary}
            onChangeData={(data) => handleFieldChange("SaveModifiedTransactionSummary", data.SaveModifiedTransactionSummary)}
          />
          <ERPCheckbox
            id="MaintainProduction"
            label="Maintain Production"
            checked={settings.MaintainProduction}
            onChangeData={(data) => handleFieldChange("MaintainProduction", data.MaintainProduction)}
          />
          <ERPCheckbox
            id="ShowReminders"
            label="Show Reminders"
            checked={settings.ShowReminders}
            onChangeData={(data) => handleFieldChange("ShowReminders", data.ShowReminders)}
          />
          <ERPCheckbox
            id="EnableSecondDisplay"
            label="Enable Second Display"
            checked={settings.EnableSecondDisplay}
            onChangeData={(data) => handleFieldChange("EnableSecondDisplay", data.EnableSecondDisplay)}
          />
          <ERPCheckbox
            id="AllowSalesRouteArea"
            label="Allow Sales Route/Area"
            checked={settings.AllowSalesRouteArea}
            onChangeData={(data) => handleFieldChange("AllowSalesRouteArea", data.AllowSalesRouteArea)}
          />
          <ERPCheckbox
            id="EnableDayEnd"
            label="Enable Day End"
            checked={settings.EnableDayEnd}
            onChangeData={(data) => handleFieldChange("EnableDayEnd", data.EnableDayEnd)}
          />
          <ERPCheckbox
            id="MaintainSalesRouteCreditLimit"
            label="Maintain Sales Route Credit Limit"
            checked={settings.MaintainSalesRouteCreditLimit}
            onChangeData={(data) => handleFieldChange("MaintainSalesRouteCreditLimit", data.MaintainSalesRouteCreditLimit)}
          />
          <ERPCheckbox
            id="MaintainMultilanguage"
            label="Maintain Multilanguage"
            checked={settings.MaintainMultilanguage}
            onChangeData={(data) => handleFieldChange("MaintainMultilanguage", data.MaintainMultilanguage)}
          />
          <ERPCheckbox
            id="ShowUserMessages"
            label="Show User Messages"
            checked={settings.ShowUserMessages}
            onChangeData={(data) => handleFieldChange("ShowUserMessages", data.ShowUserMessages)}
          />
        </div>

        <ERPInput
          id="BusinessType"
          label="Business Type"
          type="select"
          value={settings.BusinessType}
          onChangeData={(data) => handleFieldChange("BusinessType", data.BusinessType)}
          // options={[
          //   { value: 'Retail', label: 'Retail' },
          //   { value: 'Wholesale', label: 'Wholesale' },
          //   { value: 'Manufacturing', label: 'Manufacturing' },
          // ]}
        />

        <div className="flex justify-end">
          <ERPButton
            title="Save Settings"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default ERPSettingsFormMain;