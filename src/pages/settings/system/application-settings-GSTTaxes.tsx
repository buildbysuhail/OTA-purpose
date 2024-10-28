import React, { useState, useEffect, ReactNode } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import Urls from '../../../redux/urls';
import { APIClient } from '../../../helpers/api-client';
import { t } from 'i18next';
import { handleResponse } from '../../../utilities/HandleResponse';
import EInvoiceTaxPro from './e-invoice-taxpro';
import EWBTaxPro from './ewb-taxpro';

interface TaxSettingsFormState {
  purchaseNormalType: boolean;
  purchaseInterstateType: boolean;
  purchaseForm62: boolean;
  outputFormType: string;
  defaultFormTypeForPOS: string;
  inputCSTAccount: string;
  defaultPrefixForPOS: string;
  outputCSTAccount: string;
  defaultSRFormTypeForPOS: string;
  inputCessAccount: string;
  defaultSRPrefixForPOS: string;
  outputCessAccount: string;
  inputSGSTLedgerID: string;
  inputAddCessAccount: string;
  outputSGSTLedgerID: string;
  outputAddCessAccount: string;
  inputCGSTAccount: string;
  expensesTaxAccount: string;
  outputCGSTAccount: string;
  incomeTaxAccount: string;
  inputIGSTAccount: string;
  enableEWB: boolean;
  outputIGSTAccount: string;
  enableEInvoiceIndia: boolean;
  outputTCSPaidAccount: string;
  einvoiceProvider: string;
  outputTCSPayableAccount: string;
  eInvoiceAuthToken: string;
  inputCalamityCessAccount: string;
  eInvoiceOwnerID: string;
  outputSalesCalamityCessAccount: string;
  considerSalesPriceasCalamityIncluded: boolean;
  enableKarnatakaTaxReportFormat: boolean;
  showPrevForms: boolean;
}
const api = new APIClient();


const initialStateTaxsettings: TaxSettingsFormState = {
  purchaseNormalType: false,
  purchaseInterstateType: false,
  purchaseForm62: false,
  outputFormType: '',
  defaultFormTypeForPOS: '',
  inputCSTAccount: '',
  defaultPrefixForPOS: '',
  outputCSTAccount: '',
  defaultSRFormTypeForPOS: '',
  inputCessAccount: '',
  defaultSRPrefixForPOS: '',
  outputCessAccount: '',
  inputSGSTLedgerID: '',
  inputAddCessAccount: '',
  outputSGSTLedgerID: '',
  outputAddCessAccount: '',
  inputCGSTAccount: '',
  expensesTaxAccount: '',
  outputCGSTAccount: '',
  incomeTaxAccount: '',
  inputIGSTAccount: '',
  enableEWB: false,
  outputIGSTAccount: '',
  enableEInvoiceIndia: false,
  outputTCSPaidAccount: '',
  einvoiceProvider: '',
  outputTCSPayableAccount: '',
  eInvoiceAuthToken: '',
  inputCalamityCessAccount: '',
  eInvoiceOwnerID: '',
  outputSalesCalamityCessAccount: '',
  considerSalesPriceasCalamityIncluded: false,
  enableKarnatakaTaxReportFormat: false,
  showPrevForms: false,
};
// const [changedSettings, setChangedSettings] = useState<Partial<TaxSettingsFormState>>({});
// const [formState, setFormState] = useState<TaxSettingsFormState>(initialState);
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
  const [formState, setFormState] = useState<TaxSettingsFormState>(initialStateTaxsettings);
  const [formStatePrev, setFormStatePrev] = useState<Partial<TaxSettingsFormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showEInvoicePopup, setShowEInvoicePopup] = useState<boolean>(false);
  const [showEWBPopup, setShowEWBPopup] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await api.getAsync(`${Urls.application_settings}GSTTaxes`);
      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    field: keyof typeof initialStateTaxsettings,
    value: any
  ) => {
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
        const currentValue = formState?.[key as keyof TaxSettingsFormState];
        const prevValue = formStatePrev[key as keyof TaxSettingsFormState];

        if (currentValue !== prevValue) {
          
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString()
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: 'GSTTaxes',
        updateList: modifiedSettings
      })) as any
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

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={loadSettings}>{t("retry")}</button>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-dvh flex flex-col  overflow-hidden">

    <form  className="space-y-6  max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">

        <div className='grid xxl:grid-cols-7 lg:grid-cols-4 sm:grid-cols-2'>
          <label>{t("default_purchase")}</label>
          <ERPCheckbox
            id="purchaseNormalType"
            checked={formState?.purchaseNormalType}
            data={formState}
            label={t("normal")}
            onChangeData={(data: any) => handleFieldChange("purchaseNormalType", data.purchaseNormalType)}
          />
          <ERPCheckbox
            id="purchaseInterstateType"
            checked={formState?.purchaseInterstateType}
            data={formState}
            label={t("inter_state")}
            onChangeData={(data: any) => handleFieldChange("purchaseInterstateType", data.purchaseInterstateType)}
          />
          <ERPCheckbox
            id="purchaseForm62"
            checked={formState?.purchaseForm62}
            data={formState}
            label={t("form_6(2)")}
            onChangeData={(data: any) => handleFieldChange("purchaseForm62", data.purchaseForm62)}
          />
        </div>
        <div className='border p-4 rounded-lg grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
          <ERPDataCombobox
            field={{
              id: "outputFormType",
              valueKey: "value",
              labelKey: "label",
            }}
            id="outputFormType"
            value={formState?.outputFormType}
            data={formState}
            label={t("default_sales_form_type")}
            options={[
              { value: 'Form 8B', label: 'Form 8B' },
              { value: 'Form 8', label: 'Form 8' },
              { value: 'purchaseNormalType', label: 'purchaseNormalType' },
              { value: 'VAT', label: 'VAT' },
            ]}
            onChangeData={(data: any) => handleFieldChange("outputFormType", data.outputFormType)}
          />

          <ERPDataCombobox
            id="inputCSTAccount"
            value={formState?.inputCSTAccount}
            data={formState}
            label={t("input_cst_account")}
            field={{
              id: "inputCSTAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("inputCSTAccount", data.inputCSTAccount)}
          />

          <ERPDataCombobox
            id="outputCSTAccount"
            value={formState?.outputCSTAccount}
            data={formState}
            label={t("output_cst_account")}
            field={{
              id: "outputCSTAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputCSTAccount", data.outputCSTAccount)}
          />

          <ERPDataCombobox
            id="inputCessAccount"
            value={formState?.inputCessAccount}
            field={{
              id: "inputCessAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            data={formState}
            label={t("input_cess_account")}
            onChangeData={(data: any) => handleFieldChange("inputCessAccount", data.inputCessAccount)}
          />

          <ERPDataCombobox
            id="outputCessAccount"
            value={formState?.outputCessAccount}
            data={formState}
            label={t("output_cess_account")}
            field={{
              id: "outputCessAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputCessAccount", data.outputCessAccount)}
          />

          <ERPDataCombobox
            id="inputAddCessAccount"
            value={formState?.inputAddCessAccount}
            data={formState}
            label={t("input_add_cess_account")}
            field={{
              id: "inputAddCessAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("inputAddCessAccount", data.inputAddCessAccount)}
          />

          <ERPDataCombobox
            id="outputAddCessAccount"
            value={formState?.outputAddCessAccount}
            data={formState}
            label={t("output_add_cess_account")}
            field={{
              id: "outputAddCessAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputAddCessAccount", data.outputAddCessAccount)}
          />

          <ERPDataCombobox
            id="expensesTaxAccount"
            value={formState?.expensesTaxAccount}
            data={formState}
            label={t("expenses_tax_account")}
            field={{
              id: "expensesTaxAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("expensesTaxAccount", data.expensesTaxAccount)}
          />

          <ERPDataCombobox
            id="incomeTaxAccount"
            value={formState?.incomeTaxAccount}
            data={formState}
            label={t("income_tax_account")}
            field={{
              id: "incomeTaxAccount",
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("incomeTaxAccount", data.incomeTaxAccount)}
          />
        </div>


        <div className='border p-4 rounded-lg grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
          <ERPDataCombobox
            id="defaultFormTypeForPOS"
            field={{
              id: "defaultFormTypeForPOS",
              getListUrl: Urls.data_FormTypeBySI,
              valueKey: "VoucherID",
              labelKey: "FormType",
            }}
            data={formState}
            value={formState?.defaultFormTypeForPOS}
            onChangeData={(data: any) => handleFieldChange("defaultFormTypeForPOS", data.defaultFormTypeForPOS)}
            label={t("default_SI_form_type_for_POS")}
          />

          <ERPDataCombobox
            id="defaultPrefixForPOS"
            field={{
              id: "defaultPrefixForPOS",
              // required: true,
              getListUrl: Urls.data_VPrefixForSI,
              valueKey: "LastVoucherPrefix",
              labelKey: "LastVoucherPrefix",
            }}
            data={formState}
            value={formState?.defaultPrefixForPOS}
            onChangeData={(data: any) => handleFieldChange("defaultPrefixForPOS", data.defaultPrefixForPOS)}
            label={t("default_SI_prefix_for_POS")}
          />

          <ERPDataCombobox
            id="defaultSRFormTypeForPOS"
            value={formState?.defaultSRFormTypeForPOS}
            data={formState}
            label={t("default_SR_form_type_for_POS")}
            field={{
              id: "defaultSRFormTypeForPOS",
              // required: true,
              getListUrl: Urls.data_FormTypeBySR,
              valueKey: "FormType",
              labelKey: "FormType",
            }}
            onChangeData={(data: any) => handleFieldChange("defaultSRFormTypeForPOS", data.defaultSRFormTypeForPOS)}
          />

          <ERPDataCombobox
            id="defaultSRPrefixForPOS"
            value={formState?.defaultSRPrefixForPOS}
            data={formState}
            label={t("default_SR_prefix_for_POS")}
            field={{
              id: "defaultSRPrefixForPOS",
              // required: true,
              getListUrl: Urls.data_VPrefixForSR,
              valueKey: "LastVoucherPrefix",
              labelKey: "LastVoucherPrefix",
            }}
            onChangeData={(data: any) => handleFieldChange("defaultSRPrefixForPOS", data.defaultSRPrefixForPOS)}
          />
        </div>



        <div className='border p-4 rounded-lg grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
          <ERPDataCombobox
            id="inputSGSTLedgerID"
            value={formState?.inputSGSTLedgerID}
            data={formState}
            label={t("input_SGST_account")}
            field={{
              id: "inputSGSTLedgerID",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("inputSGSTLedgerID", data.inputSGSTLedgerID)}
          />

          <ERPDataCombobox
            id="outputSGSTLedgerID"
            value={formState?.outputSGSTLedgerID}
            data={formState}
            label={t("output_SGST_account")}
            field={{
              id: "outputSGSTLedgerID",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputSGSTLedgerID", data.outputSGSTLedgerID)}
          />

          <ERPDataCombobox
            id="inputCGSTAccount"
            value={formState?.inputCGSTAccount}
            data={formState}
            label={t("input_CGST_ccount")}
            field={{
              id: "inputCGSTAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("inputCGSTAccount", data.inputCGSTAccount)}
          />

          <ERPDataCombobox
            id="outputCGSTAccount"
            value={formState?.outputCGSTAccount}
            data={formState}
            label={t("output_CGST_account")}
            field={{
              id: "outputCGSTAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputCGSTAccount", data.outputCGSTAccount)}
          />

          <ERPDataCombobox
            id="inputIGSTAccount"
            value={formState?.inputIGSTAccount}
            data={formState}
            label={t("input_IGST_account")}
            field={{
              id: "inputIGSTAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("inputIGSTAccount", data.inputIGSTAccount)}
          />

          <ERPDataCombobox
            id="outputIGSTAccount"
            value={formState?.outputIGSTAccount}
            data={formState}
            label={t("output_IGST_account")}
            field={{
              id: "outputIGSTAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputIGSTAccount", data.outputIGSTAccount)}
          />

          <ERPDataCombobox
            id="outputTCSPaidAccount"
            value={formState?.outputTCSPaidAccount}
            data={formState}
            label={t("TCS_paid_account")}
            field={{
              id: "outputTCSPaidAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputTCSPaidAccount", data.outputTCSPaidAccount)}
          />

          <ERPDataCombobox
            id="outputTCSPayableAccount"
            value={formState?.outputTCSPayableAccount}
            data={formState}
            label={t("TCS_payable_account")}
            field={{
              id: "outputTCSPayableAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputTCSPayableAccount", data.outputTCSPayableAccount)}
          />

          <ERPDataCombobox
            id="inputCalamityCessAccount"
            value={formState?.inputCalamityCessAccount}
            data={formState}
            disabled={true}
            label={t("input_calamity_cess_account")}
            field={{
              id: "inputCalamityCessAccount",
              // required: true,
              getListUrl: Urls.data_InputCalamity,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("inputCalamityCessAccount", data.inputCalamityCessAccount)}
          />

          <ERPDataCombobox
            id="outputSalesCalamityCessAccount"
            value={formState?.outputSalesCalamityCessAccount}
            data={formState}
            label={t("output_calamity_cess_account")}
            field={{
              id: "outputSalesCalamityCessAccount",
              // required: true,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => handleFieldChange("outputSalesCalamityCessAccount", data.outputSalesCalamityCessAccount)}
          />

          <ERPCheckbox
            id="considerSalesPriceasCalamityIncluded"
            checked={formState?.considerSalesPriceasCalamityIncluded}
            data={formState}
            label={t("consider_sales_price_as_calamity_included")}
            onChangeData={(data: any) => handleFieldChange("considerSalesPriceasCalamityIncluded", data.considerSalesPriceasCalamityIncluded)}
          />

          <ERPCheckbox
            id="enableKarnatakaTaxReportFormat"
            checked={formState?.enableKarnatakaTaxReportFormat}
            data={formState}
            label={t("enable_karnataka_tax_report_format")}
            onChangeData={(data: any) => handleFieldChange("enableKarnatakaTaxReportFormat", data.enableKarnatakaTaxReportFormat)}
          />

          <ERPCheckbox
            id="showPrevForms"
            checked={formState?.showPrevForms}
            data={formState}
            label={t("show_prev._forms")}
            onChangeData={(data: any) => handleFieldChange("showPrevForms", data.showPrevForms)}
          />
        </div>

        <div className='border p-4 rounded-lg'>
          <div className='grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
            <div className='flex justify-between align-center'>
              <ERPCheckbox
                id="enableEWB"
                checked={formState?.enableEWB}
                data={formState}
                label={t("enable_ewb")}
                onChangeData={(data: any) => handleFieldChange("enableEWB", data.enableEWB)}
              />
              <ERPButton
                title={t("ewb_taxPro")}
                onClick={() => handleShowComponent('ewb')}
                disabled={!formState?.enableEWB}
              />
            </div>

            <div className='flex justify-between align-center'>
              <ERPCheckbox
                id="enableEInvoiceIndia"
                checked={formState?.enableEInvoiceIndia}
                data={formState}
                label={t("enable_e-invoice")}
                onChangeData={(data: any) => handleFieldChange("enableEInvoiceIndia", data.enableEInvoiceIndia)}
              />
              <ERPButton
                title={t("EInvoiceTaxPro")}
                onClick={() => handleShowComponent('eInvoice')}
                disabled={!formState?.enableEInvoiceIndia}
              />
            </div>
          </div>

          <PopupComponent isOpen={showEInvoicePopup} onClose={() => setShowEInvoicePopup(false)}>
            <EInvoiceTaxPro />
          </PopupComponent>

          <PopupComponent isOpen={showEWBPopup} onClose={() => setShowEWBPopup(false)}>
            <EWBTaxPro />
          </PopupComponent>

          <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-6 mt-5'>
            <ERPDataCombobox
              field={{
                id: "einvoiceProvider",
                valueKey: "value",
                labelKey: "label",
              }}
              id="einvoiceProvider"
              label={t("e-invoice_provider_type")}
              value={formState?.einvoiceProvider}
              data={formState}
              onChangeData={(data) => {

                handleFieldChange("einvoiceProvider", data.einvoiceProvider)
              }}
              options={[
                { value: "Clear Tax", label: "Clear Tax" },
                { value: "Tax Pro", label: "Tax Pro" },
              ]}
            />

            <ERPInput
              id="eInvoiceAuthToken"
              value={formState?.eInvoiceAuthToken}
              data={formState}
              label={t("clear_tax_token")}
              onChangeData={(data: any) => handleFieldChange("eInvoiceAuthToken", data.eInvoiceAuthToken)}
            />

            <ERPInput
              id="eInvoiceOwnerID"
              value={formState?.eInvoiceOwnerID}
              data={formState}
              label={t("clear_tax_id")}
              onChangeData={(data: any) => handleFieldChange("eInvoiceOwnerID", data.eInvoiceOwnerID)}
            />
          </div>
        </div>
        {/* <div className="flex justify-end">
          <ERPButton
            title={t("save_settings")}
            variant="primary"
            type="submit"
          />
        </div> */}
        </form>
      <div className="flex justify-end p-4">
      <ERPButton
        title={t("save_settings")}
        variant="primary"
        loading={isSaving}
        disabled={isSaving}
        type="button"
        onClick={()=>handleSubmit}
      />
    </div>
    </div>
  );
};

export default ERPSettingsFormGSTTaxes;
