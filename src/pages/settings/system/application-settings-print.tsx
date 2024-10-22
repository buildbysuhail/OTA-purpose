import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { APIClient } from "../../../helpers/api-client";

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
    return <div>Loading settings...</div>;
  }

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
      <div className="border p-4 rounded-lg">
        <div className="form-row grid grid-cols-1 gap-3 my-3">
          <ERPInput
            id="defaultPrinter"
            value={formState.defaultPrinter}
            data={formState}
            label="Default Printer"
            placeholder="Enter number of days"
            type="text"
            onChangeData={(data: any) =>
              handleFieldChange("defaultPrinter", data.defaultPrinter)
            }
          />
        </div>

        <div className="form-row grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 my-3">
          <ERPCheckbox
            id="printGatePass"
            checked={formState.printGatePass}
            data={formState}
            label="Print GatePass"
            onChangeData={(data: any) =>
              handleFieldChange("printGatePass", data.printGatePass)
            }
          />
          <ERPCheckbox
            id="showReprintAuthorisation"
            checked={formState.showReprintAuthorisation}
            data={formState}
            label="Show Reprint Authorisation"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showReprintAuthorisation",
                data.showReprintAuthorisation
              )
            }
          />
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <ERPButton
          title="Save Settings"
          variant="primary"
          disabled={isSaving}
          loading={isSaving}
          type="submit"
        />
      </div>
    </form>
  );
};

export default PrintSettingForm;
