import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";
import { ApplicationSettingsIds } from "../../pages/settings/system/application-settings-categories";
import { RootState } from "../../redux/store";
import { ApplicationBackupSettings } from "../../pages/settings/system/application-settings-types/application-settings-types-backup";
import Urls from "../../redux/urls";
import { handleResponse } from "../HandleResponse";
import { ApplicationSettingsType } from "../../pages/settings/system/application-settings-types/application-settings-types";
import { APIClient } from "../../helpers/api-client";
import { useTranslation } from "react-i18next";

const api = new APIClient()
export const useApplicationSetting = (): UseApplicationSettingReturnType => {
  const appDispatch = useAppDispatch();

  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const [settings, setSettings] = useState<ApplicationSettingsType>(applicationSettings);
  const [settingsPrev, setSettingsPrev] = useState<ApplicationSettingsType>(applicationSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const handleFieldChange = useCallback(
    <T extends keyof ApplicationSettingsType>(type: T, settingName: keyof ApplicationSettingsType[T], value: any
    ) => {
      setSettings((prevSettings = {} as ApplicationSettingsType) => {
        if (
          settingName === "allowSalesRouteArea" &&
          value === false &&
          type === "mainSettings"
        ) {
          return {
            ...prevSettings,
            [type]: {
              ...prevSettings[type],
              [settingName]: value,
              maintainSalesRouteCreditLimit: false,
            },
          };
        }
        else if (settingName === 'allowSalesCounter' && value == false &&
          type === "mainSettings") {
          return {
            ...prevSettings,
            [type]: {
              ...prevSettings[type],
              [settingName]: value,
              allowUserwiseCounter: false,
              enableAuthorizationforShiftClose: false
            },
          };
        } else {
          return {
            ...prevSettings,
            [type]: {
              ...prevSettings[type],
              [settingName]: value,
            },
          };
        }
      });
    },
    []
  );
  const handleSubmit = async () => {
    setIsSaving(true);
    console.log("Saving settings initiated.");

    try {
      // Compare settings with previous state to find changes (supports nested structures)
      const getDifferences = (
        current: ApplicationSettingsType,
        previous: ApplicationSettingsType
      ): { settingsName: string; settingsValue: string }[] => {
        const differences: { settingsName: string; settingsValue: string; settingsType: string }[] = [];

        const compareObjects = (currentObj: any, previousObj: any, parentKey = "") => {
          for (const key in currentObj) {
            const currentValue = currentObj[key];
            const previousValue = previousObj?.[key];
            const settingsName = key;

            if (typeof currentValue === "object" && currentValue !== null) {
              compareObjects(currentValue, previousValue, settingsName);
            } else if (currentValue !== previousValue && parentKey != "") {
              console.log(`Difference found: ${settingsName} = ${currentValue}`);
              differences.push({
                settingsName,
                settingsType: parentKey,
                settingsValue: currentValue === true
                  ? "true"
                  : currentValue === false
                    ? "false"
                    : currentValue?.toString() ?? "",
              });
            }
          }
        };

        console.log("Comparing current settings with previous settings...");
        compareObjects(current, previous);
        console.log("Differences identified:", differences);
        return differences;
      };

      console.log("Calling getDifferences to find modified settings...");
      const modifiedSettings = getDifferences(settings, settingsPrev);

      if (modifiedSettings.length > 0) {
        console.log("Modified settings found:", modifiedSettings);
        const response = await api.put(Urls.application_settings, {
          type: "all",
          updateList: modifiedSettings,
        });

        console.log("API response received:", response);
        handleResponse(
          response,
          () => {
            console.log("Settings updated successfully.");
            setSettingsPrev(settings);
          },
          () => {
            console.warn("Failed to update settings.");
          },
          false
        );
      } else {
        console.log("No modifications detected. Skipping API call.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
      console.log("Saving process completed.");
    }
  };
  const filterComponent = (translations: string[], filterText: string) => {
    const filter = translations.filter((translationKey) =>
      t(translationKey).toLowerCase().includes(filterText.toLowerCase())
    );
    return filterText == "" || (filter != null && filter.length > 0);
  }

  return {
    settings,
    setSettings,
    isSaving,
    handleSubmit,
    handleFieldChange,
    filterComponent
  };
};
type UseApplicationSettingReturnType = {
  settings: ApplicationSettingsType;
  setSettings: React.Dispatch<React.SetStateAction<ApplicationSettingsType>>;
  isSaving: boolean;
  handleSubmit: () => Promise<void>;
  handleFieldChange: <T extends keyof ApplicationSettingsType>(
    type: T,
    settingName: keyof ApplicationSettingsType[T],
    value: any
  ) => void;
  filterComponent: (translations: string[], filterText: string) => boolean;
};