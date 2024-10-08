import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPSelect from '../../../components/ERPComponents/erp-select';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';
import ERPToast from '../../../components/ERPComponents/erp-toast';
import { APIClient } from '../../../helpers/api-client';

interface TaxSettingsFormState {
  defaultPurchaseFormType: {
    normal: boolean;
    interState: boolean;
    form62: boolean;
  };
  defaultSalesFormType: string;
  defaultSIFormTypeForPOS: string;
  inputCSTAccount: string;
  defaultSIPrefixForPOS: string;
  outputCSTAccount: string;
  defaultSRFormTypeForPOS: string;
  inputCessAccount: string;
  defaultSRPrefixForPOS: string;
  outputCessAccount: string;
  inputSGSTAccount: string;
  inputAddCessAccount: string;
  outputSGSTAccount: string;
  outputAddCessAccount: string;
  inputCGSTAccount: string;
  expensesTaxAccount: string;
  outputCGSTAccount: string;
  incomeTaxAccount: string;
  inputIGSTAccount: string;
  enableEWB: boolean;
  outputIGSTAccount: string;
  enableEInvoice: boolean;
  TCSPaidAccount: string;
  eInvoiceProviderType: string;
  TCSPayableAccount: string;
  clearTaxEInvoiceAuthToken: string;
  inputCalamityCessAccount: string;
  clearTaxEInvoiceOwnerID: string;
  outputCalamityCessAccount: string;
  considerSalesPriceAsCalamityIncluded: boolean;
  enableKarnatakaTaxReportFormat: boolean;
  showPrevForms: boolean;
}
const api = new APIClient();
const ERPSettingsFormGSTTaxes = () => {
  const initialState: TaxSettingsFormState = {
// const ERPSettingsFormGSTTaxes = () => {
//   const [formState, setFormState] = useState<TaxSettingsFormState>({
    defaultPurchaseFormType: {
      normal: false,
      interState: false,
      form62: false,
    },
    defaultSalesFormType: '',
    defaultSIFormTypeForPOS: '',
    inputCSTAccount: '',
    defaultSIPrefixForPOS: '',
    outputCSTAccount: '',
    defaultSRFormTypeForPOS: '',
    inputCessAccount: '',
    defaultSRPrefixForPOS: '',
    outputCessAccount: '',
    inputSGSTAccount: '',
    inputAddCessAccount: '',
    outputSGSTAccount: '',
    outputAddCessAccount: '',
    inputCGSTAccount: '',
    expensesTaxAccount: '',
    outputCGSTAccount: '',
    incomeTaxAccount: '',
    inputIGSTAccount: '',
    enableEWB: false,
    outputIGSTAccount: '',
    enableEInvoice: false,
    TCSPaidAccount: '',
    eInvoiceProviderType: '',
    TCSPayableAccount: '',
    clearTaxEInvoiceAuthToken: '',
    inputCalamityCessAccount: '',
    clearTaxEInvoiceOwnerID: '',
    outputCalamityCessAccount: '',
    considerSalesPriceAsCalamityIncluded: false,
    enableKarnatakaTaxReportFormat: false,
    showPrevForms: false,
  };
  // const [changedSettings, setChangedSettings] = useState<Partial<TaxSettingsFormState>>({});
  // const [formState, setFormState] = useState<TaxSettingsFormState>(initialState);
  const [formState, setFormState] = useState<TaxSettingsFormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<TaxSettingsFormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      const data: TaxSettingsFormState = await response.json();
      setFormState(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = ((settingName: any, value: any) => {
    setFormState((prevSettings = {} as TaxSettingsFormState) => ({
      ...prevSettings,
      [settingName]: value ?? ''
    }));
    
    setFormStatePrev((prevChangedSettings = {} as TaxSettingsFormState) => ({
      ...prevChangedSettings,
      [settingName]: value ?? ''
    }));
  });
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSaving(true);
  //   try {
  //     const response = await fetch('/api/settings', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(changedSettings),
  //     });
  //     if (response.ok) {
  //       console.log('Settings saved successfully');
  //       setChangedSettings({});
  //     } else {
  //       console.error('Error saving settings');
  //     }
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
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState?.[key as keyof TaxSettingsFormState];
        const prevValue = formStatePrev[key as keyof TaxSettingsFormState];
       
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
      
      const response = await api.put(Urls.application_settings,{type: 'accounts', updateList:  modifiedSettings}) as  any
      debugger;
      if(response!=undefined && response!=null && response.isOk==true)
        {
          ERPToast.showWith(response?.message, "success");
        }
        else{
          ERPToast.showWith(response?.message,"warning")
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
      <div className='grid grid-cols-4 gap-6'>
        <label>Default Purchase Form Type</label>
        <ERPCheckbox
          id="normalPurchaseForm"
          checked={formState.defaultPurchaseFormType.normal}
          data={formState}
          label="Normal"
          onChangeData={() => handleFieldChange('normal', formState)}
        />
        <ERPCheckbox
          id="interStatePurchaseForm"
          checked={formState.defaultPurchaseFormType.interState}
          data={formState}
          label="Inter State"
          onChangeData={() => handleFieldChange('interState',formState)}
        />
        <ERPCheckbox
          id="form62PurchaseForm"
          checked={formState.defaultPurchaseFormType.form62}
          data={formState}
          label="Form 6(2)"
          onChangeData={() => handleFieldChange('form62',formState)}
        />
      </div>
      <div className='grid grid-cols-5 gap-6'>
      <ERPDataCombobox
        id="defaultSalesFormType"
        value={formState.defaultSalesFormType}
        data={formState}
        label="Default Sales Form Type"
        options={[
          { value: 'Form 8B', label: 'Form 8B' },
          { value: 'Form 8', label: 'Form 8' },
          { value: 'Normal', label: 'Normal' },
          { value: 'VAT', label: 'VAT' },
        ]}
        onChangeData={(data: any) => handleFieldChange("defaultSalesFormType", data)}
      />

      <ERPDataCombobox
        id="inputCSTAccount"
        value={formState.inputCSTAccount}
        data={formState}
        label="Input CST Account"
        field={{
          id: "inputCSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("inputCSTAccount", data)}
      />

      <ERPDataCombobox
        id="outputCSTAccount"
        value={formState.outputCSTAccount}
        data={formState}
        label="Output CST Account"
        field={{
          id: "outputCSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputCSTAccount", data)}
      />

      <ERPDataCombobox
        id="inputCessAccount"
        value={formState.inputCessAccount}
        field={{
          id: "inputCessAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        data={formState}
        label="Input Cess Account"
        onChangeData={(data: any) => handleFieldChange("inputCessAccount", data)}
      />

      <ERPDataCombobox
        id="outputCessAccount"
        value={formState.outputCessAccount}
        data={formState}
        label="Output Cess Account"
        field={{
          id: "outputCessAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputCessAccount", data)}
      />

      <ERPDataCombobox
        id="inputAddCessAccount"
        value={formState.inputAddCessAccount}
        data={formState}
        label="Input Add Cess Account"
        field={{
          id: "inputAddCessAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("inputAddCessAccount", data)}
      />

      <ERPDataCombobox
        id="outputAddCessAccount"
        value={formState.outputAddCessAccount}
        data={formState}
        label="Output Add Cess Account"
        field={{
          id: "outputAddCessAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputAddCessAccount", data)}
      />

      <ERPDataCombobox
        id="expensesTaxAccount"
        value={formState.expensesTaxAccount}
        data={formState}
        label="Expenses Tax Account"
        field={{
          id: "expensesTaxAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("expensesTaxAccount", data)}
      />

      <ERPDataCombobox
        id="incomeTaxAccount"
        value={formState.incomeTaxAccount}
        data={formState}
        label="Income Tax Account"
        field={{
          id: "incomeTaxAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("incomeTaxAccount", data)}
      />

      <ERPCheckbox
        id="enableEWB"
        checked={formState.enableEWB}
        data={formState}
        label="Enable EWB"
        onChangeData={(data: any) => handleFieldChange("enableEWB", data)}
      />
      <ERPButton title="EWB TaxPro" onClick={() => {/* Handle EWB TaxPro click */}} />

      <ERPCheckbox
        id="enableEInvoice"
        checked={formState.enableEInvoice}
        data={formState}
        label="Enable E-Invoice"
        onChangeData={(data: any) => handleFieldChange("enableEInvoice", data)}
      />
      <ERPButton title="EInvoiceTaxPro" onClick={() => {/* Handle EInvoiceTaxPro click */}} />

      <ERPDataCombobox
 field={{
  id: "eInvoiceProviderType",
  valueKey: "value",
  labelKey: "label",
}}
  id="eInvoiceProviderType"
  label="E-Invoice Provider Type"
  value={formState.eInvoiceProviderType}
  data={formState}
  onChangeData={(data) =>{
    
    handleFieldChange("eInvoiceProviderType", data.eInvoiceProviderType)
  }}
  options={[
    { value: 'Clear Tax', label: 'Clear Tax' },
    { value: '1Tax Pro', label: 'Tax Pro' },
  ]}
      />

      <ERPInput
        id="clearTaxEInvoiceAuthToken"
        value={formState.clearTaxEInvoiceAuthToken}
        data={formState}
        label="Clear Tax E-Invoice Auth Token"
        onChangeData={(data: any) => handleFieldChange("clearTaxEInvoiceAuthToken", data)}
      />

      <ERPInput
        id="clearTaxEInvoiceOwnerID"
        value={formState.clearTaxEInvoiceOwnerID}
        data={formState}
        label="Clear Tax E-Invoice Owner ID"
        onChangeData={(data: any) => handleFieldChange("clearTaxEInvoiceOwnerID", data)}
      />

      <ERPDataCombobox
        id="defaultSIFormTypeForPOS"
        value={formState.defaultSIFormTypeForPOS}
        data={formState}
        label="Default SI Form Type For POS"
        field={{
          id: "defaultSIFormTypeForPOS",
         // required: true,
          getListUrl: Urls.data_FormTypeBySI,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("defaultSIFormTypeForPOS", data)}
      />

      <ERPDataCombobox
        id="defaultSIPrefixForPOS"
        value={formState.defaultSIPrefixForPOS}
        data={formState}
        label="Default SI Prefix For POS"
        field={{
          id: "defaultSIPrefixForPOS",
         // required: true,
          getListUrl: Urls.data_VPrefixForSI,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("defaultSIPrefixForPOS", data)}
      />

      <ERPDataCombobox
        id="defaultSRFormTypeForPOS"
        value={formState.defaultSRFormTypeForPOS}
        data={formState}
        label="Default SR Form Type For POS"
        field={{
          id: "defaultSRFormTypeForPOS",
         // required: true,
          getListUrl: Urls.data_FormTypeBySR,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("defaultSRFormTypeForPOS", data)}
      />

      <ERPDataCombobox
        id="defaultSRPrefixForPOS"
        value={formState.defaultSRPrefixForPOS}
        data={formState}
        label="Default SR Prefix For POS"
        field={{
          id: "defaultSRPrefixForPOS",
         // required: true,
          getListUrl: Urls.data_VPrefixForSR,
          valueKey: "VoucherID",
          labelKey: "FormType",
        }}
        onChangeData={(data: any) => handleFieldChange("defaultSRPrefixForPOS", data)}
      />

      <ERPDataCombobox
        id="inputSGSTAccount"
        value={formState.inputSGSTAccount}
        data={formState}
        label="Input SGST Account"
        field={{
          id: "inputSGSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("inputSGSTAccount", data)}
      />

      <ERPDataCombobox
        id="outputSGSTAccount"
        value={formState.outputSGSTAccount}
        data={formState}
        label="Output SGST Account"
        field={{
          id: "outputSGSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputSGSTAccount", data)}
      />

      <ERPDataCombobox
        id="inputCGSTAccount"
        value={formState.inputCGSTAccount}
        data={formState}
        label="Input CGST Account"
        field={{
          id: "inputCGSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("inputCGSTAccount", data)}
      />

      <ERPDataCombobox
        id="outputCGSTAccount"
        value={formState.outputCGSTAccount}
        data={formState}
        label="Output CGST Account"
        field={{
          id: "outputCGSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputCGSTAccount", data)}
      />

      <ERPDataCombobox
        id="inputIGSTAccount"
        value={formState.inputIGSTAccount}
        data={formState}
        label="Input IGST Account"
        field={{
          id: "inputIGSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("inputIGSTAccount", data)}
      />

      <ERPDataCombobox
        id="outputIGSTAccount"
        value={formState.outputIGSTAccount}
        data={formState}
        label="Output IGST Account"
        field={{
          id: "outputIGSTAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputIGSTAccount", data)}
      />

      <ERPDataCombobox
        id="TCSPaidAccount"
        value={formState.TCSPaidAccount}
        data={formState}
        label="TCS Paid Account"
        field={{
          id: "TCSPaidAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("TCSPaidAccount", data)}
      />

      <ERPDataCombobox
        id="TCSPayableAccount"
        value={formState.TCSPayableAccount}
        data={formState}
        label="TCS Payable Account"
        field={{
          id: "TCSPayableAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("TCSPayableAccount", data)}
      />

      <ERPDataCombobox
        id="inputCalamityCessAccount"
        value={formState.inputCalamityCessAccount}
        data={formState}
        label="Input Calamity Cess Account"
        field={{
          id: "inputCSTAccount",
         // required: true,
          getListUrl: Urls.data_InputCalamity,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("inputCalamityCessAccount", data)}
      />

      <ERPDataCombobox
        id="outputCalamityCessAccount"
        value={formState.outputCalamityCessAccount}
        data={formState}
        label="Output Calamity Cess Account"
        field={{
          id: "outputCalamityCessAccount",
         // required: true,
          getListUrl: Urls.data_duties_taxes,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => handleFieldChange("outputCalamityCessAccount", data)}
      />

      <ERPCheckbox
        id="considerSalesPriceAsCalamityIncluded"
        checked={formState.considerSalesPriceAsCalamityIncluded}
        data={formState}
        label="Consider Sales Price as Calamity Included"
        onChangeData={(data: any) => handleFieldChange("considerSalesPriceAsCalamityIncluded", data)}
      />

      <ERPCheckbox
        id="enableKarnatakaTaxReportFormat"
        checked={formState.enableKarnatakaTaxReportFormat}
        data={formState}
        label="Enable Karnataka Tax Report Format"
        onChangeData={(data: any) => handleFieldChange("enableKarnatakaTaxReportFormat", data)}
      />

      <ERPCheckbox
        id="showPrevForms"
        checked={formState.showPrevForms}
        data={formState}
        label="Show Prev. Forms"
        onChangeData={(data: any) => handleFieldChange("showPrevForms", data)}
      />
       <div className="flex justify-end">
          <ERPButton
            title="Save Settings"
            variant="primary"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

export default ERPSettingsFormGSTTaxes;
