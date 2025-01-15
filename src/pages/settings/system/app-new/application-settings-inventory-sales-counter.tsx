import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";

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

const InventorySalesCounterFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
  const { t } = useTranslation("applicationSettings")
  const items = [
    {
      condition: filterComponent([t("allow_sales_counter")], filterText),
      element: (
        <ERPCheckbox
          id="allowSalesCounter"
          checked={settings?.accountsSettings?.allowSalesCounter}
          data={settings?.accountsSettings}
          label={t("allow_sales_counter")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "allowSalesCounter",
              data.allowSalesCounter
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("enable_authorization_for_shift_close")], filterText),
      element: (
        <ERPCheckbox
          id="enableAuthorizationforShiftClose"
          disabled={!settings?.accountsSettings?.allowSalesCounter}
          checked={settings?.accountsSettings?.enableAuthorizationforShiftClose}
          data={settings?.accountsSettings}
          label={t("enable_authorization_for_shift_close")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "enableAuthorizationforShiftClose",
              data.enableAuthorizationforShiftClose
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_user_wise_counter")], filterText),
      element: (
        <ERPCheckbox
          id="allowUserwiseCounter"
          disabled={!settings?.accountsSettings?.allowSalesCounter}
          checked={settings?.accountsSettings?.allowUserwiseCounter}
          data={settings?.accountsSettings}
          label={t("allow_user_wise_counter")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "allowUserwiseCounter",
              data.allowUserwiseCounter
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("maintain_counter_wise_prefix_for_transaction")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="maintainCounterWisePrefixForTransaction"
          label={t("maintain_counter_wise_prefix_for_transaction")}
          data={settings?.branchSettings}
          checked={
            settings?.branchSettings?.maintainCounterWisePrefixForTransaction
          }
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "maintainCounterWisePrefixForTransaction",
              data.maintainCounterWisePrefixForTransaction
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("minimum_shift_duration")], filterText),
      element: (
        <div className="flex items-center gap-1">
          <ERPCheckbox
            id="allowMinimumShiftDuration"
            checked={settings?.accountsSettings?.allowMinimumShiftDuration}
            data={settings?.accountsSettings}
            label={t("minimum_shift_duration")}
            onChangeData={(data) =>
              handleFieldChange(
                "accountsSettings",
                "allowMinimumShiftDuration",
                data.allowMinimumShiftDuration
              )
            }
          />
          <ERPInput
            id="minimumShiftDuration"
            value={settings?.accountsSettings?.minimumShiftDuration}
            label=" "
            data={settings?.accountsSettings}
            type="number"
            disabled={
              !settings?.accountsSettings?.allowMinimumShiftDuration
            }
            onChangeData={(data) =>
              handleFieldChange(
                "accountsSettings",
                "minimumShiftDuration",
                parseFloat(data.minimumShiftDuration)
              )
            }
          />
          &nbsp;Hours
        </div>
      ),
    },
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
          <div key={key} ref={(el) => (subItemsCatRef.current["inventorySalesCounter"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] dark:!bg-dark-bg-header font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventorySalesCounter"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("counter")}
            </h1>
            <div key="inventorySalesCounter" className="space-y-4">
              <div className={`border border-solid dark:!bg-dark-bg dark:!border-dark-border border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
                <div
                  className={`grid ${isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${gridClass ||
                    "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                    } gap-4 items-center justify-center`
                    }`}  >
                  {items?.map(
                    (component: any, index: number) =>
                      component.condition && (
                        <div key={index}>{component.element}</div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default InventorySalesCounterFilterableComponents;