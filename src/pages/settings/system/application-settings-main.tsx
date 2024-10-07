import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPSelect from '../../../components/ERPComponents/erp-select';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { postAction } from '../../../redux/slices/app-thunks';
import { APIClient } from '../../../helpers/api-client';
import ERPToast from '../../../components/ERPComponents/erp-toast';

interface Settings {
  currency: string;
  unitPriceDecimalPoints: string;
  decimalPoints: string;
  currencyFormat: string;
  roundingMethod: string;
  salesRoundingMethod: string;
  taxDecimalPoints: string;
  roundingMethodGlobal: string;
  autoChangeTransactionDate: boolean;
  autoUpdateReleaseUpTo: number;
  oTPEmail: string;
  oTPVerification: string;
  allowPrivilegeCard: boolean;
  privilegeCardPercentage: number;
  allowPostdatedTransaction: boolean;
  postdatedTransactionDays: number;
  allowPredatedTransaction: boolean;
  predatedTransactionDays: number;
  maintainSeparatePrefixForCashSales: boolean;
  saveModifiedTransactionSummary: boolean;
  maintainProduction: boolean;
  showReminders: boolean;
  enableSecondDisplay: boolean;
  allowSalesRouteArea: boolean;
  enableDayEnd: boolean;
  maintainSalesRouteCreditLimit: boolean;
  maintainMultilanguage: boolean;
  showUserMessages: boolean;
  businessType: string;
}
const initialSettings: Settings = {
  currency: "2",
  unitPriceDecimalPoints: "2",
  decimalPoints: "2",
  currencyFormat: "Millions",
  roundingMethod: "Normal",
  salesRoundingMethod: "No Rounding", // Assuming this is what POSRoundingMethod refers to
  taxDecimalPoints: "2",
  roundingMethodGlobal: "Normal",
  autoChangeTransactionDate: false,
  autoUpdateReleaseUpTo: 0,
  oTPEmail: "",
  oTPVerification: "", // Not provided, using empty string as default
  allowPrivilegeCard: false,
  privilegeCardPercentage: 1,
  allowPostdatedTransaction: true,
  postdatedTransactionDays: 0,
  allowPredatedTransaction: true,
  predatedTransactionDays: 110,
  maintainSeparatePrefixForCashSales: false,
  saveModifiedTransactionSummary: false,
  maintainProduction: false,
  showReminders: false,
  enableSecondDisplay: false,
  allowSalesRouteArea: false,
  enableDayEnd: false, // Not provided, using false as default
  maintainSalesRouteCreditLimit: false,
  maintainMultilanguage: false,
  showUserMessages: false,
  businessType: "General"
};
const api=new APIClient();
const ERPSettingsFormMain = () => {
  const dispatch=useAppDispatch()
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

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const response = await api.post(Urls.ValidateToken,{email: settings.oTPEmail,token: settings.oTPVerification});
      if(response!=undefined && response!=null && response.IsOk==true)
        {
          ERPToast.showWith(response?.message, "success");
        }
        else{
          ERPToast.showWith(response?.message,"warning")
        }
      const data: Settings = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };
  const sendOtp = async () => {
    setLoading(true);
    try {

      const response = await api.post(Urls.SendEmailToken,{ email: settings.oTPEmail});// dispatch(postAction({apiUrl:Urls.SendEmailToken,data:{ email: settings.oTPEmail}}) as any).unwrap();
      if(response!=undefined && response!=null && response.IsOk == settings)
      {
        ERPToast.showWith(response?.message, "success");
      }
      else{
        ERPToast.showWith(response?.message,"warning")
      }
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
          <ERPDataCombobox
            id="decimalPoints"
            label="Decimal Points"
            value={settings?.decimalPoints}
            onChangeData={(data) => handleFieldChange("decimalPoints", data.decimalPoints)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <ERPDataCombobox
            id="currencyFormat"
            label="Currency Format"
            value={settings?.currencyFormat}
            onChangeData={(data) => handleFieldChange("currencyFormat", data.currencyFormat)}
            options={[
              { value: 'Millions', label: 'Millions' },
              { value: 'Thousands', label: 'Thousands' },
              { value: 'Hundreds', label: 'Hundreds' },
            ]}
          />
          <ERPDataCombobox
            id="roundingMethod"
            label="Rounding Method"
            value={settings?.roundingMethod}
            onChangeData={(data) => handleFieldChange("roundingMethod", data.roundingMethod)}
            options={[
              { value: 'Round', label: 'Round' },
              { value: 'RoundUp', label: 'Round Up' },
              { value: 'RoundDown', label: 'Round Down' },
            ]}
          />
          <ERPDataCombobox
           field={{
            id: "salesRoundingMethod",
            valueKey: "value",
            labelKey: "label",
          }}
            id="salesRoundingMethod"
            label="Sales Rounding Method"
            value={settings?.salesRoundingMethod}
            data={settings}
            onChangeData={(data) => handleFieldChange("salesRoundingMethod", data.salesRoundingMethod)}
            options={[
              { value: 'Round', label: 'Round' },
              { value: 'RoundUp', label: 'Round Up' },
              { value: 'RoundDown', label: 'Round Down' },
            ]}
          />
          <ERPDataCombobox
            id="caxDecimalPoints"
            label="Tax Decimal Points"
            value={settings?.taxDecimalPoints}
            onChangeData={(data) => handleFieldChange("TaxDecimalPoints", data.taxDecimalPoints)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <ERPDataCombobox
            id="roundingMethodGlobal"
            label="Rounding Method Global"
            value={settings?.roundingMethodGlobal}
            onChangeData={(data) => handleFieldChange("RoundingMethodGlobal", data.roundingMethodGlobal)}
            options={[
              { value: 'Round', label: 'Round' },
              { value: 'RoundUp', label: 'Round Up' },
              { value: 'RoundDown', label: 'Round Down' },
            ]}
          />
          <ERPCheckbox
          id="autoChangeTransactionDate"
          label="Auto Change Transaction Date By 12:00 AM"
          checked={settings?.autoChangeTransactionDate}
          onChangeData={(data) => handleFieldChange("autoChangeTransactionDate", data.autoChangeTransactionDate)}
        />
         <ERPInput
            id="autoUpdateReleaseUpTo"
            label="Auto Update Release Up To"
            type="number"
            value={settings?.autoUpdateReleaseUpTo}
            onChangeData={(data) => handleFieldChange("autoChangeTransactionDate", data.autoUpdateReleaseUpTo)}
          />
        </div>

        

        <div className="flex items-center space-x-4">
         
          <ERPInput
            id="oTPEmail"
            label="OTP Email"
            className="flex-grow"
            value={settings?.oTPEmail}
            data={settings}
            onChangeData={(data) => handleFieldChange("oTPEmail", data.oTPEmail)}
          />
          <ERPButton
            title="Send OTP"
            variant="secondary"
            onClick={() => sendOtp()}
          />
          <ERPInput
            id="oTPVerification"
            placeholder="Enter OTP"
            className="w-32"
            value={settings?.oTPVerification}
            data={settings}
            onChangeData={(data) => handleFieldChange("oTPVerification", data.oTPVerification)}
          />
          <ERPButton
            title="Verify"
            variant="primary"
            onClick={() => verifyOtp()}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <ERPCheckbox
              id="AllowPrivilegeCard"
              label="Allow Privilege Card"
              checked={settings?.allowPrivilegeCard}
              onChangeData={(data) => handleFieldChange("AllowPrivilegeCard", data.AllowPrivilegeCard)}
            />
            <ERPInput
              id="PrivilegeCardPercentage"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings?.privilegeCardPercentage}
              onChangeData={(data) => handleFieldChange("PrivilegeCardPercentage", data.PrivilegeCardPercentage)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="AllowPostdatedTransaction"
              label="Allow Postdated Transaction"
              checked={settings?.allowPostdatedTransaction}
              onChangeData={(data) => handleFieldChange("AllowPostdatedTransaction", data.AllowPostdatedTransaction)}
            />
            <ERPInput
              id="PostdatedTransactionDays"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings?.postdatedTransactionDays}
              onChangeData={(data) => handleFieldChange("PostdatedTransactionDays", data.PostdatedTransactionDays)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="AllowPredatedTransaction"
              label="Allow Predated Transaction"
              checked={settings?.allowPredatedTransaction}
              onChangeData={(data) => handleFieldChange("AllowPredatedTransaction", data.AllowPredatedTransaction)}
            />
            <ERPInput
              id="PredatedTransactionDays"
              type="number"
              className="w-16 ml-6 mt-1"
              value={settings?.predatedTransactionDays}
              onChangeData={(data) => handleFieldChange("PredatedTransactionDays", data.PredatedTransactionDays)}
            />
          </div>
        </div>

      
        <div className="grid grid-cols-4 gap-6">
        <ERPCheckbox
          id="MaintainSeparatePrefixForCashSales"
          label="Maintain Separate Prefix for Cash Sales"
          checked={settings?.maintainSeparatePrefixForCashSales}
          onChangeData={(data) => handleFieldChange("MaintainSeparatePrefixForCashSales", data.MaintainSeparatePrefixForCashSales)}
        />

          <ERPCheckbox
            id="SaveModifiedTransactionSummary"
            label="Save Modified Transaction Summary"
            checked={settings?.saveModifiedTransactionSummary}
            onChangeData={(data) => handleFieldChange("SaveModifiedTransactionSummary", data.SaveModifiedTransactionSummary)}
          />
          <ERPCheckbox
            id="MaintainProduction"
            label="Maintain Production"
            checked={settings?.maintainProduction}
            onChangeData={(data) => handleFieldChange("MaintainProduction", data.MaintainProduction)}
          />
          <ERPCheckbox
            id="ShowReminders"
            label="Show Reminders"
            checked={settings?.showReminders}
            onChangeData={(data) => handleFieldChange("ShowReminders", data.ShowReminders)}
          />
          <ERPCheckbox
            id="EnableSecondDisplay"
            label="Enable Second Display"
            checked={settings?.enableSecondDisplay}
            onChangeData={(data) => handleFieldChange("EnableSecondDisplay", data.EnableSecondDisplay)}
          />
          <ERPCheckbox
            id="AllowSalesRouteArea"
            label="Allow Sales Route/Area"
            checked={settings?.allowSalesRouteArea}
            onChangeData={(data) => handleFieldChange("AllowSalesRouteArea", data.AllowSalesRouteArea)}
          />
          <ERPCheckbox
            id="EnableDayEnd"
            label="Enable Day End"
            checked={settings?.enableDayEnd}
            onChangeData={(data) => handleFieldChange("EnableDayEnd", data.EnableDayEnd)}
          />
          <ERPCheckbox
            id="MaintainSalesRouteCreditLimit"
            label="Maintain Sales Route Credit Limit"
            checked={settings?.maintainSalesRouteCreditLimit}
            onChangeData={(data) => handleFieldChange("MaintainSalesRouteCreditLimit", data.MaintainSalesRouteCreditLimit)}
          />
          <ERPCheckbox
            id="MaintainMultilanguage"
            label="Maintain Multilanguage"
            checked={settings?.maintainMultilanguage}
            onChangeData={(data) => handleFieldChange("MaintainMultilanguage", data.MaintainMultilanguage)}
          />
          <ERPCheckbox
            id="ShowUserMessages"
            label="Show User Messages"
            checked={settings?.showUserMessages}
            onChangeData={(data) => handleFieldChange("ShowUserMessages", data.ShowUserMessages)}
          />
        </div>

        <ERPDataCombobox
         field={{
          id: "BusinessType",
          valueKey: "value",
          labelKey: "label",
        }}
          id="BusinessType"
          label="Business Type"
          value={settings?.businessType}
          data={settings}
          onChangeData={(data) => handleFieldChange("BusinessType", data.BusinessType)}
          options={[
            { value: 'Retail', label: 'General' },
            { value: 'Distribution', label: 'Distribution' },
            { value: 'Manufacturing', label: 'Manufacturing' },
            { value: 'Supermarket', label: 'Supermarket' },
            { value: 'Textiles', label: 'Textiles' },
            { value: 'Restaurant', label: 'Restaurant' },
            { value: 'Opticals', label: 'Opticals' },
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

export default ERPSettingsFormMain;
