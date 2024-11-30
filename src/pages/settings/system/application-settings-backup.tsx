import React, { useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import { t } from "i18next";
import {
  ApplicationBackupSettings,
  ApplicationBackupSettingsInitialState,
} from "./application-settings-types/application-settings-types-backup";
import { useTranslation } from "react-i18next";

const BackupSettingsForm: React.FC = () => {
  const [formState, setFormState] = useState<ApplicationBackupSettings>(
    ApplicationBackupSettingsInitialState
  );
  const [formStatePrev, setFormStatePrev] = useState<
    Partial<ApplicationBackupSettings>
  >({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new APIClient();
  const { t } = useTranslation("applicationSettings");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}backup`);

      console.log(formState);
      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    field: keyof typeof ApplicationBackupSettingsInitialState,
    value: any
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue =
          formState?.[key as keyof ApplicationBackupSettings];
        const prevValue = formStatePrev[key as keyof ApplicationBackupSettings];

        if (
          currentValue !== prevValue ||
          (currentValue === false && prevValue === true) ||
          (currentValue === true && prevValue === false)
        ) {
          acc.push({
            settingsName: key,
            settingsValue:
              currentValue === false
                ? "false"
                : currentValue === true
                ? "true"
                : (currentValue ?? "").toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);

      const response =
        modifiedSettings && modifiedSettings.length > 0
          ? ((await api.put(Urls.application_settings, {
              type: "backup",
              updateList: modifiedSettings,
            })) as any)
          : null;
      handleResponse(
        response,
        () => {
          setFormStatePrev(formState);
        },
        () => {},
        false
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={loadSettings}>{t("retry")}</button>
      </div>
    );
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  return (
    <div className=" h-screen max-h-dvh flex flex-col  overflow-hidden">
      <form className="overflow-y-auto scrollbar scrollbar-thick scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto h-full">
        <div className="space-y-6 p-6">
          <div className="border p-4 rounded-lg">
            <div className="form-row grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 my-3">
              <ERPDataCombobox
                id="backupMethods"
                data={formState}
                field={{
                  id: "backupMethods",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("backupMethods", data.backupMethods)
                }
                label={t("backup_methods")}
                options={[
                  { value: "No BackUp", label: "No BackUp" },
                  { value: "BackUp On Close", label: "BackUp On Close" },
                  { value: "Scheduled BackUp", label: "Scheduled BackUp" },
                ]}
              />
              {/* disabled always
              disabled={formState.backupMethods == "No BackUp" || true} */}
              <ERPInput
                id="backUpPath"
                value={formState.backUpPath}
                data={formState}
                disabled={formState.backupMethods == "No BackUp" || true}
                label={t("backup_path")}
                placeholder={t("enter_discount_threshold")}
                onChangeData={(data: any) =>
                  handleFieldChange("backUpPath", parseFloat(data.backUpPath))
                }
              />
              <ERPInput
                id="backupDuration"
                value={formState.backupDuration}
                data={formState}
                label={t("duration")}
                disabled={
                  formState.backupMethods == "No BackUp" ||
                  formState.backupMethods == "BackUp On Close"
                }
                placeholder={t("duration")}
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
                label={t("compress_backup_file")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "compressBackupFile",
                    data.compressBackupFile
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
          loading={isSaving}
          disabled={isSaving}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BackupSettingsForm;
