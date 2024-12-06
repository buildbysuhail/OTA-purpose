import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
interface ApplicationSettingsProps {
  settings: any; // Replace `any` with the actual type if known
  handleFieldChange: <T extends keyof ApplicationSettingsType>(
    type: T,
    settingName: keyof ApplicationSettingsType[T],
    value: any
  ) => void;
  filterComponent: (keys: string[], fText: string) => boolean;
  filterText: string;
  userSession: any; // Replace `any` with the actual type if known
  isCompactView: boolean;
  gridClass: string;
  sectionsRef: any;
  subItemsRef: MutableRefObject<Record<string, HTMLElement | null>>
  subItemsCatRef: any;
  blinkSection: string | null;
  handleGeneralHeaderClick: any;
  key: string;
}

const InventoryTAXFilterableComponents: React.FC<ApplicationSettingsProps> = ({
  settings,
  handleFieldChange,
  filterComponent,
  filterText,
  userSession,
  isCompactView,
  gridClass,
  sectionsRef,
  subItemsRef,
  subItemsCatRef,
  blinkSection,
  handleGeneralHeaderClick,
  key,
}) => {
  const items = [
    {
      condition: filterComponent([t("backup_methods")], filterText),
      element: (
        <ERPDataCombobox
          id="backupMethods"
          data={settings.backUPSettings}
          field={{
            id: "backupMethods",
            valueKey: "value",
            labelKey: "label",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "backUPSettings",
              "backupMethods",
              data.backupMethods
            )
          }
          label={t("backup_methods")}
          options={[
            { value: "No BackUp", label: "No BackUp" },
            {
              value: "BackUp On Close",
              label: "BackUp On Close",
            },
            {
              value: "Scheduled BackUp",
              label: "Scheduled BackUp",
            },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("backup_path")], filterText),
      element: (
        <ERPInput
          id="backUpPath"
          value={settings.backUPSettings?.backUpPath}
          data={settings.backUPSettings}
          disabled={
            settings.backUPSettings?.backupMethods ==
            "No BackUp" || true
          }
          label={t("backup_path")}
          placeholder={t("backup_path")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "backUPSettings",
              "backUpPath",
              data.backUpPath
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("duration")], filterText),
      element: (
        <ERPInput
          id="backupDuration"
          value={settings.backUPSettings?.backupDuration}
          data={settings.backUPSettings}
          label={t("duration")}
          disabled={
            settings.backUPSettings?.backupMethods ==
            "No BackUp" ||
            settings.backUPSettings?.backupMethods ==
            "BackUp On Close"
          }
          placeholder={t("duration")}
          type="number"
          onChangeData={(data: any) =>
            handleFieldChange(
              "backUPSettings",
              "backupDuration",
              parseFloat(data.backupDuration)
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("compress_backup_file")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="compressBackupFile"
          label={t("compress_backup_file")}
          data={settings?.backUPSettings}
          checked={
            settings?.backUPSettings?.compressBackupFile
          }
          onChangeData={(data) =>
            handleFieldChange(
              "backUPSettings",
              "compressBackupFile",
              data.compressBackupFile
            )
          }
        />
      ),
    }
  ];
  const [hasMatchedItems, setHasMatchedItems] = useState<boolean>(true);
  useEffect(() => {
    const hasMatchingItems = items.some((component) => component.condition);
    setHasMatchedItems(hasMatchingItems);
  }, [filterText])

  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsRef.current["inventoryTaxSettings"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventoryTaxSettings"
                  ? "blink-animation bg-[#f1f1f1]"
                  : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("backup")}
            </h1>
            <div key="inventoryTaxSettings" className="space-y-4">
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                <div
                  className={`grid ${isCompactView
                      ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                      : `${gridClass ||
                      "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                      } gap-4 items-center justify-center`
                    }`}>
                  {items?.map(
                    (component: any, index: number) =>
                      component.condition && (
                        <div key={index}>{component.element}</div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};
export default InventoryTAXFilterableComponents;