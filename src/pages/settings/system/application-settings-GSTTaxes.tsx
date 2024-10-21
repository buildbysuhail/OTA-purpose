import React, { useState, useEffect, ReactNode } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPSelect from '../../../components/ERPComponents/erp-select';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';
import ERPToast from '../../../components/ERPComponents/erp-toast';
import { APIClient } from '../../../helpers/api-client';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { handleResponse } from '../../../utilities/HandleResponse';
import EInvoiceTaxPro from './e-invoice-taxpro';
import EWBTaxPro from './ewb-taxpro';

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

interface PopupComponentProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PopupComponent: React.FC<PopupComponentProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-6xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-start">
          <i
            onClick={onClose}
            className="ri-arrow-left-line mr-2 rtl:mr-0 rtl:ml-2 rtl:ri-arrow-right-line cursor-pointer"
            style={{ fontSize: "23px" }}>
          </i>
        </div>
        {children}
      </div>
    </div>
  );
};

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
  const [showEInvoicePopup, setShowEInvoicePopup] = useState<boolean>(false);
  const [showEWBPopup, setShowEWBPopup] = useState<boolean>(false);

  const handleShowComponent = (component: 'eInvoice' | 'ewb') => {
    if (component === 'eInvoice') {
      setShowEInvoicePopup(true);
    } else if (component === 'ewb') {
      setShowEWBPopup(true);
    }
  };

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
    const { t } = useTranslation();
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

      const response = await api.put(Urls.application_settings, { type: 'accounts', updateList: modifiedSettings }) as any
      handleResponse(response);

    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) {
    return <div>{t("loading_settings...")}</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className='grid grid-cols-7'>
          <label>{t("default_purchase")}</label>
          <ERPCheckbox
            id="normalPurchaseForm"
            checked={formState.defaultPurchaseFormType.normal}
            data={formState}
            label={t("normal")}
            onChangeData={(data: any) => handleFieldChange("defaultPurchaseFormType", { ...formState.defaultPurchaseFormType, normal: data.normalPurchaseForm })}
          />
          <ERPCheckbox
            id="interStatePurchaseForm"
            checked={formState.defaultPurchaseFormType.interState}
            data={formState}
            label={t("inter_state")}
            onChangeData={(data: any) => handleFieldChange("defaultPurchaseFormType", { ...formState.defaultPurchaseFormType, interState: data.interStatePurchaseForm })}
          />
          <ERPCheckbox
            id="form62PurchaseForm"
            checked={formState.defaultPurchaseFormType.form62}
            data={formState}
            label={t("form_6(2)")}
            onChangeData={(data: any) => handleFieldChange("defaultPurchaseFormType", { ...formState.defaultPurchaseFormType, form62: data.form62PurchaseForm })}
          />
        </div>


        <div className='border p-4 rounded-lg grid grid-cols-4 gap-6'>
          <ERPDataCombobox
            id="defaultSalesFormType"
            value={formState.defaultSalesFormType}
            data={formState}
            label={t("default_sales_form_type")}
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
            label={t("input_cst_account")}
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
            label={t("output_cst_account")}
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
            label={t("input_cess_account")}
            onChangeData={(data: any) => handleFieldChange("inputCessAccount", data)}
          />

          <ERPDataCombobox
            id="outputCessAccount"
            value={formState.outputCessAccount}
            data={formState}
            label={t("output_cess_account")}
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
            label={t("input_add_cess_account")}
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
            label={t("output_add_cess_account")}
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
            label={t("expenses_tax_account")}
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
            label={t("income_tax_account")}
            field={{
              id: "incomeTaxAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("incomeTaxAccount", data)}
          />
        </div>


        <div className='border p-4 rounded-lg grid grid-cols-4 gap-6'>
          <ERPDataCombobox
            id="defaultSIFormTypeForPOS"
            value={formState.defaultSIFormTypeForPOS}
            data={formState}
            label={t("default_SI_form_type_for_POS")}
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
            label={t("default_SI_prefix_for_POS")}
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
            label={t("default_SR_form_type_for_POS")}
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
            label={t("default_SR_prefix_for_POS")}
            field={{
              id: "defaultSRPrefixForPOS",
              // required: true,
              getListUrl: Urls.data_VPrefixForSR,
              valueKey: "VoucherID",
              labelKey: "FormType",
            }}
            onChangeData={(data: any) => handleFieldChange("defaultSRPrefixForPOS", data)}
          />
        </div>



        <div className='border p-4 rounded-lg grid grid-cols-4 gap-6'>
          <ERPDataCombobox
            id="inputSGSTAccount"
            value={formState.inputSGSTAccount}
            data={formState}
            label={t("input_SGST_account")}
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
            label={t("output_SGST_account")}
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
            label={t("input_CGST_ccount")}
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
            label={t("output_CGST_account")}
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
            label={t("input_IGST_account")}
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
            label={t("output_IGST_account")}
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
            label={t("TCS_paid_account")}
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
            label={t("TCS_payable_account")}
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
            label={t("input_calamity_cess_account")}
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
            label={t("output_calamity_cess_account")}
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
            label={t("consider_sales_price_as_calamity_included")}
            onChangeData={(data: any) => handleFieldChange("considerSalesPriceAsCalamityIncluded", data.considerSalesPriceAsCalamityIncluded)}
          />

          <ERPCheckbox
            id="enableKarnatakaTaxReportFormat"
            checked={formState.enableKarnatakaTaxReportFormat}
            data={formState}
            label={t("enable_karnataka_tax_report_format")}
            onChangeData={(data: any) => handleFieldChange("enableKarnatakaTaxReportFormat", data.enableKarnatakaTaxReportFormat)}
          />

          <ERPCheckbox
            id="showPrevForms"
            checked={formState.showPrevForms}
            data={formState}
            label={t("show_prev._forms")}
            onChangeData={(data: any) => handleFieldChange("showPrevForms", data.showPrevForms)}
          />
        </div>



        <div className='border p-4 rounded-lg'>
          <div className='grid grid-cols-4 gap-6'>
            <div className='flex justify-between align-center'>
              <ERPCheckbox
                id="enableEWB"
                checked={formState.enableEWB}
                data={formState}
                label={t("enable_ewb")}
                onChangeData={(data: any) => handleFieldChange("enableEWB", data.enableEWB)}
              />
              <ERPButton title={t("ewb_taxPro")} onClick={() => handleShowComponent('ewb')} />
            </div>

            <div className='flex justify-between align-center'>
              <ERPCheckbox
                id="enableEInvoice"
                checked={formState.enableEInvoice}
                data={formState}
                label={t("enable_e-invoice")}
                onChangeData={(data: any) => handleFieldChange("enableEInvoice", data.enableEInvoice)}
              />
              <ERPButton title={t("EInvoiceTaxPro")} onClick={() => handleShowComponent('eInvoice')} />
            </div>
          </div>

          <PopupComponent isOpen={showEInvoicePopup} onClose={() => setShowEInvoicePopup(false)}>
            <EInvoiceTaxPro />
          </PopupComponent>

          <PopupComponent isOpen={showEWBPopup} onClose={() => setShowEWBPopup(false)}>
            <EWBTaxPro />
          </PopupComponent>

          <div className='grid grid-cols-3 gap-6 mt-5'>
            <ERPDataCombobox
              field={{
                id: "eInvoiceProviderType",
                valueKey: "value",
                labelKey: "label",
              }}
              id="eInvoiceProviderType"
              label={t("e-invoice_provider_type")}
              value={formState.eInvoiceProviderType}
              data={formState}
              onChangeData={(data) => {

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
              label={t("clear_tax_token")}
              onChangeData={(data: any) => handleFieldChange("clearTaxEInvoiceAuthToken", data.clearTaxEInvoiceAuthToken)}
            />

            <ERPInput
              id="clearTaxEInvoiceOwnerID"
              value={formState.clearTaxEInvoiceOwnerID}
              data={formState}
              label={t("clear_tax_id")}
              onChangeData={(data: any) => handleFieldChange("clearTaxEInvoiceOwnerID", data.clearTaxEInvoiceOwnerID)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <ERPButton
            title={t("save_settings")}
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </>
  );
};

export default ERPSettingsFormGSTTaxes;
