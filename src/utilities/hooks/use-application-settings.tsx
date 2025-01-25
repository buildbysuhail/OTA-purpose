import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  setApplicationMainSettings,
  setApplicationSettingsWithType,
} from "../../redux/slices/app/application-settings-reducer";
import { ApplicationSettingsInitialState } from "../../redux/slices/app/application-settings-types";
import { modelToBase64 } from "../jsonConverter";

const api = new APIClient();
export const useApplicationSetting = (): UseApplicationSettingReturnType => {
  const appDispatch = useAppDispatch();

  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const [filterText, setFilterSearch] = useState("");
  
  const [settingsPrev, setSettingsPrev] = useState();
  useEffect(() => {
    if (applicationSettings.apiLoaded) {
      setSettingsPrev(JSON.parse(JSON.stringify(applicationSettings)));
    }
  }, [applicationSettings.apiLoaded]);
  
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value ?? "".toLowerCase();
    setFilterSearch(searchTerm);
  };

  const handleFieldChange = useCallback(
    <T extends keyof ApplicationSettingsType>(
      type: T,
      settingName: keyof ApplicationSettingsType[T],
      value: any
    ) => {
      if (
        settingName === "allowSalesRouteArea" &&
        value === false &&
        type === "mainSettings"
      ) {
        dispatch(
          setApplicationSettingsWithType({
            type,
            settingName: settingName as never,
            value,
          })
        );

        // Dispatch the second dependent setting change
        dispatch(
          setApplicationSettingsWithType({
            type,
            settingName: "maintainSalesRouteCreditLimit" as never,
            value: false,
          })
        );
      } else if (
        settingName === "allowSalesCounter" &&
        value == false &&
        type === "mainSettings"
      ) {
        dispatch(
          setApplicationSettingsWithType({
            type,
            settingName: settingName as never,
            value,
          })
        );

        // Dispatch the second dependent setting change
        dispatch(
          setApplicationSettingsWithType({
            type,
            settingName: "allowUserwiseCounter" as never,
            value: false,
          })
        );
        dispatch(
          setApplicationSettingsWithType({
            type,
            settingName: "enableAuthorizationforShiftClose" as never,
            value: false,
          })
        );
      } else {
        dispatch(
          setApplicationSettingsWithType({
            type,
            settingName: settingName as never,
            value,
          })
        );
      }
    },
    [dispatch]
  );
  const handleSubmit = useCallback(async () => {
    
    setIsSaving(true);
    

    try {
      // Compare settings with previous state to find changes (supports nested structures)
      const getDifferences = (
        current: ApplicationSettingsType,
        previous: ApplicationSettingsType
      ): { settingsName: string; settingsValue: string }[] => {
        const differences: {
          settingsName: string;
          settingsValue: string;
          settingsType: string;
        }[] = [];

        const compareObjects = (
          currentObj: any,
          previousObj: any,
          parentKey = ""
        ) => {
          for (const key in currentObj) {
            const currentValue = currentObj[key];
            const previousValue = previousObj?.[key];
            const settingsName = key;

            if (typeof currentValue === "object" && currentValue !== null) {
              compareObjects(currentValue, previousValue, settingsName);
            } else if (currentValue !== previousValue && parentKey != "") {
              
              const _paretnt: keyof ApplicationSettingsType =
                parentKey as keyof ApplicationSettingsType;

              differences.push({
                settingsName,

                settingsType:
                  _paretnt == "mainSettings"
                    ? "Main"
                    : _paretnt == "accountsSettings"
                      ? "Accounts"
                      : _paretnt == "inventorySettings"
                        ? "Inventory"
                        : _paretnt == "branchSettings"
                          ? "Branch"
                          : _paretnt == "backUPSettings"
                            ? "BackUP"
                            : _paretnt == "printerSettings"
                              ? "Printer"
                              : _paretnt == "productsSettings"
                                ? "Products"
                                : _paretnt == "gSTTaxesSettings"
                                  ? "GSTTaxes"
                                  : _paretnt == "taxesSettings"
                                    ? "Taxes"
                                    : _paretnt == "miscellaneousSettings"
                                      ? "Miscellaneous"
                                      : "",

                settingsValue:
                  currentValue === true
                    ? "true"
                    : currentValue === false
                      ? "false"
                      : currentValue?.toString() ?? "",
              });
            }
          }
        };
        compareObjects({ ...current }, { ...previous });
        return differences;
      };

      const modifiedSettings = getDifferences(
        applicationSettings,
        settingsPrev ?? ApplicationSettingsInitialState
      );

      if (modifiedSettings.length > 0) {
        const response = await api.put(Urls.application_settings, {
          type: "all",
          updateList: modifiedSettings,
        });

        
        handleResponse(
          response,
          () => {
            const strSet = JSON.stringify(applicationSettings);
            localStorage.setItem('as', modelToBase64(applicationSettings))
            setSettingsPrev(JSON.parse(strSet));
          },
          () => {
            console.warn("Failed to update settings.");
          },
          true
        );
      } else {
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  }, [applicationSettings, settingsPrev]);
  const filterComponent = useMemo(
    () => (translations: string[], filterText: string) =>
      filterText === undefined || filterText === "" ||
      translations.some((translationKey) =>
        t(translationKey).toLowerCase().includes(filterText.toLowerCase())
      ),
    [t]
  );

  return {
    settings: applicationSettings,
    isSaving,
    handleSubmit,
    handleFieldChange,
    filterComponent,
    filterText,
    setFilterSearch,
    onFilterChange,
  };
};

type UseApplicationSettingReturnType = {
  settings: ApplicationSettingsType
  filterText: string;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  isSaving: boolean;
  handleSubmit: () => Promise<void>;
  handleFieldChange: <T extends keyof ApplicationSettingsType>(
    type: T,
    settingName: keyof ApplicationSettingsType[T],
    value: any,
    min?: number
  ) => void;
  filterComponent: (translations: string[], filterText: string) => boolean;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
