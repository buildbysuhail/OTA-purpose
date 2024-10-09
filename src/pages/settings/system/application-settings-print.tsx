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
  mobileNumberMandatoryInSales: boolean;
}

const initialState: FormState = {
  defaultPrinter: "",
  printGatePass: false,
  showReprintAuthorization: false,
  mobileNumberMandatoryInSales: false,
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
      const response = await api.getAsync(`${Urls.application_settings}print`);
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
        type: "print",
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
    <div className="erp-settings-form">
      <div className="form-row grid grid-cols-1 gap-3 my-3">
        <ERPInput
          id="defaultPrinter"
          value={formState.defaultPrinter}
          data={formState}
          label="Keep User Actions (in Days)"
          placeholder="Enter number of days"
          type="text"
          onChangeData={(data: any) =>
            handleFieldChange("defaultPrinter", data.defaultPrinter)
          }
        />
      </div>

      <div className="form-row grid grid-cols-2 gap-3 my-3">
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
          id="mobileNumberMandatoryInSales"
          checked={formState.mobileNumberMandatoryInSales}
          data={formState}
          label="Mobile Number Mandatory in Sales"
          onChangeData={(data: any) =>
            handleFieldChange(
              "mobileNumberMandatoryInSales",
              data.mobileNumberMandatoryInSales
            )
          }
        />
      </div>

      <div className="my-4 flex items-center justify-center">
        <ERPButton
          title="Save Changes"
          variant="primary"
          disabled={isSaving}
          loading={isSaving}
          type="submit"
        />
      </div>
    </div>
    </form>
  );
};

export default PrintSettingForm;
