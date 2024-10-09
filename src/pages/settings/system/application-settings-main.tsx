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
import { handleResponse } from '../../../utilities/HandleResponse';

interface Settings {
  currency: string;
  unitPriceDecimalPoint: string;
  decimalPoints: string;
  cashSalesVoucherPrefix: string;
  roundingMethod: string;
  posRoundingMethod: string;
  taxDecimalPoint: string;
  roundingMethodGlobal: string;
  autoChangeTransactionDate: boolean;
  autoUpdateReleaseUpTo: number;
  oTPEmail: string;
  oTPVerification: string;
  allowPrivilegeCard: boolean;
  previlegeCardPerc: number;
  allowPostdatedTrans: boolean;
  postDatedTransInNumbers: number;
  autoChangeTransactionDateByMidnight: boolean;
  preDatedTransInNumbers: number;
  maintainSeperatePrefixforCashSales: boolean;
  saveModTransSum: boolean;
  maintainProduction: boolean;
  showReminders: boolean;
  enableSecondDisplay: boolean;
  allowSalesRouteArea: boolean;
  enableDayEnd: boolean;
  maintainSalesRouteCreditLimit: boolean;
  maintainMultilanguage: boolean;
  showUserMessages: boolean;
  maintainBusinessType: string;


}
const initialSettings: Settings = {
  currency: "2",
  unitPriceDecimalPoint: "2",
  decimalPoints: "2",
  cashSalesVoucherPrefix: "Millions",
  roundingMethod: "Normal",
  posRoundingMethod: "No Rounding", 
  taxDecimalPoint: "2",
  roundingMethodGlobal: "Normal",
  autoChangeTransactionDate: false,
  autoUpdateReleaseUpTo: 0,
  oTPEmail: "",
  oTPVerification: "", 
  allowPrivilegeCard: false,
  previlegeCardPerc: 1,
  allowPostdatedTrans: true,
  postDatedTransInNumbers: 0,
  autoChangeTransactionDateByMidnight: true,
  preDatedTransInNumbers: 110,
  maintainSeperatePrefixforCashSales: false,
  saveModTransSum: false,
  maintainProduction: false,
  showReminders: false,
  enableSecondDisplay: false,
  allowSalesRouteArea: false,
  enableDayEnd: false,
  maintainSalesRouteCreditLimit: false,
  maintainMultilanguage: false,
  showUserMessages: false,
  maintainBusinessType: "General"
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
      const response = await api.getAsync(`${Urls.application_settings}main`)
    debugger;
    console.log(settings);
    setChangedSettings(response);
    setSettings(response);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    // setLoading(true);
    try {
      const response = await api.post(Urls.ValidateToken,{email: settings.oTPEmail,token: settings.oTPVerification});
      handleResponse(response);
      const data: Settings = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };
  const sendOtp = async () => {
    // setLoading(true);
    try {

      const response = await api.post(Urls.SendEmailToken,{ email: settings.oTPEmail});
      handleResponse(response);
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
 
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSaving(true);
  //   try {
  //     const modifiedSettings = Object.keys(settings).reduce((acc, key) => {
  //       const currentValue = settings?.[key as keyof Settings];
  //       const prevValue = settings[key as keyof Settings];
       
  //       if (currentValue !== prevValue) {
  //         debugger;
  //         acc.push({
  //           settingsName: key,
  //           settingsValue: currentValue.toString()
  //         });
  //       }
  //       return acc;
  //     }, [] as { settingsName: string; settingsValue: string }[]);
  //     console.log(modifiedSettings);
      
  //     const response = await api.put(Urls.application_settings,{type: 'settings', updateList:  modifiedSettings}) as  any
  //     debugger;
  //     if(response!=undefined && response!=null && response.isOk==true)
  //       {
  //         ERPToast.showWith(response?.message, "success");
  //       }
  //       else{
  //         ERPToast.showWith(response?.message,"warning")
  //       }
  //   } catch (error) {
  //     console.error('Error saving settings:', error);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(settings).reduce((acc, key) => {
        const currentValue = settings?.[key as keyof Settings];
        const prevValue = changedSettings[key as keyof Settings];
       
        if (currentValue !== prevValue) {
          debugger;
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString()
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);
      
      const response = await api.put(Urls.application_settings,{type: 'mai', updateList:  modifiedSettings}) as  any
      handleResponse(response);
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
            data={settings}
            value={settings?.currency}
            onChangeData={(data) => handleFieldChange("Currency", data.Currency)}
            label="Currency"
          />
          <ERPDataCombobox
          field={{
            id: "unitPriceDecimalPoint",
            valueKey: "value",
            labelKey: "label",
          }}
            id="unitPriceDecimalPoint"
            label="Unit Price Decimal Points"
            value={settings?.unitPriceDecimalPoint}
            data={settings}
            onChangeData={(data) =>{
              
              handleFieldChange("unitPriceDecimalPoint", data.unitPriceDecimalPoint)
            }}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
            ]}
          />
          <ERPDataCombobox
            id="decimalPoints"
            label="Decimal Points"
            data={settings}
            value={settings?.decimalPoints}
            onChangeData={(data) => handleFieldChange("decimalPoints", data.decimalPoints)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
            ]}
          />
          <ERPDataCombobox
            id="cashSalesVoucherPrefix"
            label="Currency Format"
            data={settings}
            value={settings?.cashSalesVoucherPrefix}
            onChangeData={(data) => handleFieldChange("cashSalesVoucherPrefix", data.cashSalesVoucherPrefix)}
            options={[
              { value: 'Millions', label: 'Millions' },
              { value: 'Lakhs', label: 'Lakhs' },
            ]}
          />
          <ERPDataCombobox
            id="roundingMethod"
            label="Rounding Method"
            data={settings}
            value={settings?.roundingMethod}
            onChangeData={(data) => handleFieldChange("roundingMethod", data.roundingMethod)}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'No Rounding', label: 'No Rounding' },
              { value: 'Ceiling', label: 'Ceiling' },
              { value: 'Floor', label: 'Floor' },
            ]}
          />
          <ERPDataCombobox
           field={{
            id: "posRoundingMethod",
            valueKey: "value",
            labelKey: "label",
          }}
            id="posRoundingMethod"
            label="Sales Rounding Method"
            value={settings?.posRoundingMethod}
            data={settings}
            onChangeData={(data) => handleFieldChange("posRoundingMethod", data.posRoundingMethod)}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'No Rounding', label: 'No Rounding' },
              { value: 'Ceiling', label: 'Ceiling' },
              { value: 'Floor', label: 'Floor' },
              { value: 'Round to 0.25', label: 'Round to 0.25' },
              { value: 'Round to 0.50', label: 'Round to 0.50' },
              { value: 'Round to 0.10', label: 'Round to 0.10' },
              { value: 'Floor Round to 0.50', label: 'Floor Round to 0.50' },
              { value: 'Floor Round to 0.25', label: 'Floor Round to 0.25' },
              { value: 'Floor Round to 0.10', label: 'Floor Round to 0.10' },
              { value: 'Not Set', label: 'Not Set' },
              { value: 'Round to 0.010', label: 'Round to 0.010' },
            ]}
          />
          <ERPDataCombobox
            id="taxDecimalPoint"
            label="Tax Decimal Points"
            value={settings?.taxDecimalPoint}
            data={settings}
            onChangeData={(data) => handleFieldChange("taxDecimalPoint", data.taxDecimalPoint)}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
            ]}
          />
          <ERPDataCombobox
            id="roundingMethodGlobal"
            label="Rounding Method Global"
            value={settings?.roundingMethodGlobal}
            data={settings}
            onChangeData={(data) => handleFieldChange("roundingMethodGlobal", data.roundingMethodGlobal)}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'No Rounding', label: 'No Rounding' },
              { value: 'Ceiling', label: 'Ceiling' },
              { value: 'Floor', label: 'Floor' },
              { value: 'Round to 0.25', label: 'Round to 0.25' },
              { value: 'Round to 0.50', label: 'Round to 0.50' },
              { value: 'Round to 0.10', label: 'Round to 0.10' },
              { value: 'Floor Round to 0.50', label: 'Floor Round to 0.50' },
              { value: 'Floor Round to 0.25', label: 'Floor Round to 0.25' },
              { value: 'Floor Round to 0.10', label: 'Floor Round to 0.10' },
              { value: 'Not Set', label: 'Not Set' },
              { value: 'Round to 0.010', label: 'Round to 0.010' },
            ]}
          />
          <ERPCheckbox
          id="autoChangeTransactionDate"
          label="Auto Change Transaction Date By 12:00 AM"
          data={settings}
          checked={settings?.autoChangeTransactionDate}
          onChangeData={(data) => handleFieldChange("autoChangeTransactionDate", data.autoChangeTransactionDate)}
        />
         <ERPInput
            id="autoUpdateReleaseUpTo"
            label="Auto Update Release Up To"
            type="number"
            data={settings}
            value={settings?.autoUpdateReleaseUpTo}
            onChangeData={(data) => handleFieldChange("autoUpdateReleaseUpTo", data.autoUpdateReleaseUpTo)}
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
            data={settings}
            className="w-32"
            value={settings?.oTPVerification}
           
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
              id="allowPrivilegeCard"
              label="Allow Privilege Card"
              data={settings}
              checked={settings?.allowPrivilegeCard}
              onChangeData={(data) => handleFieldChange("allowPrivilegeCard", data.allowPrivilegeCard)}
            />
            <ERPInput
              id="previlegeCardPerc"
              type="number"
              data={settings}
              className="w-16 ml-6 mt-1"
              value={settings?.previlegeCardPerc}
              onChangeData={(data) => handleFieldChange("previlegeCardPerc", data.previlegeCardPerc)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="allowPostdatedTrans"
              label="Allow Postdated Transaction"
              data={settings}
              checked={settings?.allowPostdatedTrans}
              onChangeData={(data) => handleFieldChange("allowPostdatedTrans", data.allowPostdatedTrans)}
            />
            <ERPInput
              id="postDatedTransInNumbers"
              type="number"
              data={settings}
              className="w-16 ml-6 mt-1"
              value={settings?.postDatedTransInNumbers}
              onChangeData={(data) => handleFieldChange("postDatedTransInNumbers", data.postDatedTransInNumbers)}
            />
          </div>
          <div>
            <ERPCheckbox
              id="autoChangeTransactionDateByMidnight"
              label="Allow Predated Transaction Date By Midnight"
              data={settings}
              checked={settings?.autoChangeTransactionDateByMidnight}
              onChangeData={(data) => handleFieldChange("autoChangeTransactionDateByMidnight", data.autoChangeTransactionDateByMidnight)}
            />
            <ERPInput
              id="preDatedTransInNumbers"
              type="number"
              data={settings}
              className="w-16 ml-6 mt-1"
              value={settings?.preDatedTransInNumbers}
              onChangeData={(data) => handleFieldChange("preDatedTransInNumbers", data.preDatedTransInNumbers)}
            />
          </div>
        </div>

      
        <div className="grid grid-cols-4 gap-6">
        <ERPCheckbox
          id="maintainSeperatePrefixforCashSales"
          label="Maintain Separate Prefix for Cash Sales"
          data={settings}
          checked={settings?.maintainSeperatePrefixforCashSales}
          onChangeData={(data) => handleFieldChange("maintainSeperatePrefixforCashSales", data.maintainSeperatePrefixforCashSales)}
        />

          <ERPCheckbox
            id="saveModTransSum"
            label="Save Modified Transaction Summary"
            data={settings}
            checked={settings?.saveModTransSum}
            onChangeData={(data) => handleFieldChange("saveModTransSum", data.saveModTransSum)}
          />
          <ERPCheckbox
            id="maintainProduction"
            label="Maintain Production"
            data={settings}
            checked={settings?.maintainProduction}
            onChangeData={(data) => handleFieldChange("maintainProduction", data.maintainProduction)}
          />
          <ERPCheckbox
            id="showReminders"
            label="Show Reminders"
            data={settings}
            checked={settings?.showReminders}
            onChangeData={(data) => handleFieldChange("showReminders", data.showReminders)}
          />
          <ERPCheckbox
            id="enableSecondDisplay"
            label="Enable Second Display"
            data={settings}
            checked={settings?.enableSecondDisplay}
            onChangeData={(data) => handleFieldChange("enableSecondDisplay", data.enableSecondDisplay)}
          />
          <ERPCheckbox
            id="allowSalesRouteArea"
            label="Allow Sales Route/Area"
            data={settings}
            checked={settings?.allowSalesRouteArea}
            onChangeData={(data) => handleFieldChange("allowSalesRouteArea", data.allowSalesRouteArea)}
          />
          <ERPCheckbox
            id="enableDayEnd"
            label="Enable Day End"
            data={settings}
            checked={settings?.enableDayEnd}
            onChangeData={(data) => handleFieldChange("enableDayEnd", data.enableDayEnd)}
          />
          <ERPCheckbox
            id="maintainSalesRouteCreditLimit"
            label="Maintain Sales Route Credit Limit"
            data={settings}
            checked={settings?.maintainSalesRouteCreditLimit}
            onChangeData={(data) => handleFieldChange("maintainSalesRouteCreditLimit", data.maintainSalesRouteCreditLimit)}
          />
          <ERPCheckbox
            id="maintainMultilanguage"
            label="Maintain Multilanguage"
            data={settings}
            checked={settings?.maintainMultilanguage}
            onChangeData={(data) => handleFieldChange("maintainMultilanguage", data.maintainMultilanguage)}
          />
          <ERPCheckbox
            id="showUserMessages"
            label="Show User Messages"
            data={settings}
            checked={settings?.showUserMessages}
            onChangeData={(data) => handleFieldChange("showUserMessages", data.showUserMessages)}
          />
        </div>

        <ERPDataCombobox
         field={{
          id: "maintainBusinessType",
          valueKey: "value",
          labelKey: "label",
        }}
          id="maintainBusinessType"
          label="Business Type"
          value={settings?.maintainBusinessType}
          data={settings}
          onChangeData={(data) => handleFieldChange("maintainBusinessType", data.maintainBusinessType)}
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
