import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

interface FormState {
  expensesTaxAccount: string;
  incomeTaxAccount: string;
  purchaseCSTAccount: string;
  purchaseFormType: string;
  purchaseTaxAccount: string;
  salesCSTAccount: string;
  salesFormType: string;
  salesTaxAccount: string;
}

const initialState: FormState = {
  expensesTaxAccount: "",
  incomeTaxAccount: "",
  purchaseCSTAccount: "",
  purchaseFormType: "",
  purchaseTaxAccount: "",
  salesCSTAccount: "",
  salesFormType: "",
  salesTaxAccount: "",
};

const TaxSettingsForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const api = new APIClient();
  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const formContainer = document.querySelector('.settings-form-container') as HTMLElement;
    if (formContainer) {
      formContainer.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}taxes`);

      console.log(formState);
      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
    const { t } = useTranslation();
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

          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "taxes",
        updateList: modifiedSettings,
      })) as any;
      handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
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
    <div className="h-dvh max-h-dvh flex flex-col  overflow-hidden">
      <form className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
        <div className="space-y-6  p-6">
          <div className="border rounded-lg p-4">
            <div className="grid xxl:grid-cols-4 lg:grid-cols-2  sm:grid-cols-2 gap-3 my-3">
              <ERPDataCombobox
                id="purchaseFormType"
                value={formState?.purchaseFormType}
                data={formState}
                field={{
                  id: "purchaseFormType",

                  getListUrl: Urls.data_FormTypeByPI,
                  valueKey: "VoucherID",
                  labelKey: "FormType",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("purchaseFormType", data.purchaseFormType)
                }
                label={t("default_purchase")}
              />

              <ERPDataCombobox
                id="salesFormType"
                value={formState.salesFormType}
                data={formState}
                field={{
                  id: "salesFormType",

                  getListUrl: Urls.data_FormTypeBySI,
                  valueKey: "VoucherID",
                  labelKey: "FormType",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("salesFormType", data.salesFormType)
                }
                label={t("sales_form_type")}
              />
              <ERPDataCombobox
                id="purchaseTaxAccount"
                value={formState.purchaseTaxAccount}
                data={formState}
                field={{
                  id: "purchaseTaxAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("purchaseTaxAccount", data.purchaseTaxAccount)
                }
                label={t("purchase_tax_ledger")}
              />
              <ERPDataCombobox
                id="salesTaxAccount"
                value={formState.salesTaxAccount}
                data={formState}
                field={{
                  id: "salesTaxAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("salesTaxAccount", data.salesTaxAccount)
                }
                label={t("sales_tax_ledger")}
              />
              <ERPDataCombobox
                id="purchaseCSTAccount"
                value={formState.purchaseCSTAccount}
                data={formState}
                field={{
                  id: "purchaseCSTAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("purchaseCSTAccount", data.purchaseCSTAccount)
                }
                label={t("purchase_cst_account")}
              />
              <ERPDataCombobox
                id="salesCSTAccount"
                value={formState.salesCSTAccount}
                data={formState}
                field={{
                  id: "salesCSTAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("salesCSTAccount", data.salesCSTAccount)
                }
                label={t("sales_cst_account")}
              />
              <ERPDataCombobox
                id="expensesTaxAccount"
                value={formState.expensesTaxAccount}
                data={formState}
                field={{
                  id: "expensesTaxAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("expensesTaxAccount", data.expensesTaxAccount)
                }
                label={t("expenses_tax_account")}
              />
              <ERPDataCombobox
                id="incomeTaxAccount"
                value={formState.incomeTaxAccount}
                data={formState}
                field={{
                  id: "incomeTaxAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("incomeTaxAccount", data.incomeTaxAccount)
                }
                label={t("income_tax_account")}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          disabled={isSaving}
          loading={isSaving}
          type="button"
          onClick={() => handleSubmit}
        />
      </div>
    </div>
  );
};

export default TaxSettingsForm;
