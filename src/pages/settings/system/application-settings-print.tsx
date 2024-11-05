import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import { t } from "i18next";
import { RootState } from "../../../redux/store";
import { Countries } from "../../../redux/slices/user-session/reducer";

interface FormState {
  defaultPrinter: string;
  printGatePass: boolean;
  showReprintAuthorization: boolean;
  showReprintAuthorisation: boolean;
}

const initialState: FormState = {
  defaultPrinter: "",
  printGatePass: false,
  showReprintAuthorization: false,
  showReprintAuthorisation: false,
};

const PrintSettingForm: React.FC = () => {
  const userSession = useAppSelector((state: RootState) => state.UserSession);
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

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}printer`);

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

  const handleSubmit = async () => {
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
        type: "printer",
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
    <div className="h-screen max-h-dvh flex flex-col  overflow-hidden">
      <form className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
        <div className="space-y-6 p-6  !mb-[12rem]">
          <div className="border p-4 rounded-lg">
            <div className="form-row grid grid-cols-4 gap-3 my-3">
              {/* <ERPInput
                id="defaultPrinter"
                value={formState.defaultPrinter}
                data={formState}
                label={t("default_printer")}
                placeholder={t("enter_number_of_days")}
                type="text"
                onChangeData={(data: any) =>
                  handleFieldChange("defaultPrinter", data.defaultPrinter)
                }
              /> */}

              <ERPDataCombobox
                id="defaultPrinter"
                value={formState.defaultPrinter}
                data={formState}
                field={{
                  id: "defaultPrinter",
                  valueKey: "value",
                  labelKey: "label",
                }}
                disabled
                onChangeData={(data: any) =>
                  handleFieldChange("defaultPrinter", data.defaultPrinter)
                }
                label={t("default_printer")}
                options={[
                  { value: 0, label: "Canon" },
                  { value: 1, label: "HP (Hewlett-Packard)" },
                  { value: 2, label: "Epson " },
                  { value: 3, label: "Brother  " },
                  { value: 4, label: "Lexmark  " },
                ]}
              />
            </div>

            <div className="form-row grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3 mt-4">

              {userSession.countryId == Countries.India &&
                <ERPCheckbox
                  id="printGatePass"
                  checked={formState.printGatePass}
                  data={formState}
                  label={t("print_gatePass")}
                  onChangeData={(data: any) =>
                    handleFieldChange("printGatePass", data.printGatePass)
                  }
                />
              }
              <ERPCheckbox
                id="showReprintAuthorisation"
                checked={formState.showReprintAuthorisation}
                data={formState}
                label={t("show_reprint_authorisation")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "showReprintAuthorisation",
                    data.showReprintAuthorisation
                  )
                }
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          type="button"
          disabled={isSaving}
          loading={isSaving}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PrintSettingForm;
