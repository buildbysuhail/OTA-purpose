import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { useApplicationSetting } from "../../../../utilities/hooks/use-application-settings";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import Urls from "../../../../redux/urls";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useRef, useState } from "react";
interface ApplicationMiscellaneousProps {
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

const ApplicationMiscellaneousComponents: React.FC<ApplicationMiscellaneousProps> = ({
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
      condition: filterComponent([t("send_sms")], filterText),
      element: (
        <>
          <ERPCheckbox
            id="sendSMS"
            checked={settings?.miscellaneousSettings?.sendSMS}
            data={settings?.miscellaneousSettings}
            label={t("send_sms_URL")}
            onChangeData={(data) =>
              handleFieldChange(
                "miscellaneousSettings",
                "sendSMS",
                data.sendSMS
              )
            }
          />
          <ERPInput
            id="sMSURL"
            value={settings?.miscellaneousSettings?.sMSURL}
            data={settings?.miscellaneousSettings}
            label=" "
            disabled={!settings?.miscellaneousSettings?.sendSMS}
            onChangeData={(data) =>
              handleFieldChange(
                "miscellaneousSettings",
                "sMSURL",
                data.sMSURL
              )
            }
          />
        </>
      ),
    },
    {
      condition: filterComponent([t("supervisor_password")], filterText),
      element: (
        <ERPInput
          id="supervisorPassword"
          value={settings?.accountsSettings?.supervisorPassword}
          data={settings?.accountsSettings}
          label={t("supervisor_password")}
           type="Password"
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "supervisorPassword",
              data.supervisorPassword
            )
          }
        />
      ),
    },
  ]
  const [hasMatchedItems, setHasMatchedItems] = useState<boolean>(true);
  useEffect(() => {
    const hasMatchingItems = items.some((component) => component.condition);
    setHasMatchedItems(hasMatchingItems);
  }, [filterText])

  return (
    <>
     {items.filter((component) => component.condition == true).length > 0 && (
      <div>
        <div
          key={key}
          ref={(el) => (subItemsRef.current["miscellaneous"] = el)}
        >
          <h1
            className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${
              blinkSection === "miscellaneous"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
            }`}
            onClick={handleGeneralHeaderClick}
          >
            {t("miscellaneous")}
          </h1>
          <div key="miscellaneous" className="space-y-4">
            <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
              <div
                className={`grid ${
                  isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${
                        gridClass ||
                        "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                      } gap-4 items-center justify-center`
                }`}
              >
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
export default ApplicationMiscellaneousComponents;
