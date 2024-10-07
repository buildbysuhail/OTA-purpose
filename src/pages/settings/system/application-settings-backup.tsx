import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import ERPToast from "../../../components/ERPComponents/erp-toast";

interface FormState {
  backupMethods: string;
  backUpPath: string;
  backupDuration: number;
  compressBackupFile: boolean;
}

const initialState: FormState = {
  backupMethods: "",
  backUpPath: "",
  backupDuration: 0,
  compressBackupFile: false,
};

const BackupSettingsForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new APIClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}backup`);
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
            settingsValue: currentValue,
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: any }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "backup",
        updateList: modifiedSettings,
      })) as any;
      debugger;
      if (response != undefined && response != null && response.IsOk == true) {
        ERPToast.showWith(response?.message, "success");
      } else {
        ERPToast.showWith(response?.message, "warning");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
//   if (loading) {
//     return <div>Loading settings...</div>;
//   }

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
          <ERPDataCombobox
            id="backupMethods"
            value={formState.backupMethods}
            data={formState}
            field={{
              id: "backupMethods",
              valueKey: "value",
              labelKey: "label",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("backupMethods", data.backupMethods)
            }
            label="Backup Methods"
            options={[
              { value: "0", label: "No BackUp" },
              { value: "1", label: "BackUp On Close" },
              { value: "2", label: "Scheduled BackUp" },
            ]}
          />
        </div>
        <div className="form-row grid grid-cols-1 gap-3 my-3">
          <ERPInput
            id="backUpPath"
            value={formState.backUpPath}
            data={formState}
            label="Backup Path"
            placeholder="Enter discount threshold"
            onChangeData={(data: any) =>
              handleFieldChange("backUpPath", parseFloat(data.backUpPath))
            }
          />
        </div>

        <div className="form-row grid grid-cols-2 gap-3 my-3">
          <ERPInput
            id="backupDuration"
            value={formState.backupDuration}
            data={formState}
            label="Duration"
            placeholder="Enter discount threshold"
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange(
                "backupDuration",
                parseFloat(data.backupDuration)
              )
            }
          />
          <ERPCheckbox
            id="compressBackupFile"
            checked={formState.compressBackupFile}
            data={formState}
            label="Compress Backup File"
            onChangeData={(data: any) =>
              handleFieldChange("compressBackupFile", data.compressBackupFile)
            }
          />
        </div>

        <div className="my-4 flex items-center justify-center">
        <ERPButton
            title="Save Settings"
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

export default BackupSettingsForm;
