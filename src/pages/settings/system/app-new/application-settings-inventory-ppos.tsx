import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
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

const InventoryPPOSFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("enable_PPOS_integration")], filterText),
      element: (
        <ERPCheckbox
          id="enableVanSale"
          label={t("enable_PPOS_integration")}
          data={settings?.branchSettings}
          className="h-9 translate-y-[20px]"
          checked={settings?.branchSettings?.enableVanSale}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "enableVanSale",
              data.enableVanSale
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("PPOS_branchid")], filterText),
      element: (
        <div className="flex justify-start space-x-3 align-center">
          <ERPInput
            id="clientPPOSBranchID"
            label={t("PPOS_branchid")}
            disabled={settings?.branchSettings?.enableVanSale === false}
            className="w-2/3"
            value={settings?.branchSettings?.clientPPOSBranchID}
            data={settings?.branchSettings}
            onChangeData={(data) =>
              handleFieldChange(
                "branchSettings",
                "clientPPOSBranchID",
                data.clientPPOSBranchID
              )
            }
          />
          <ERPButton
            title={t("verify")}
            disabled={settings?.branchSettings?.enableVanSale === false}
            variant="secondary"
            className="h-8 translate-y-[20px]"
          />
        </div>
      ),
    },
    {
      condition: filterComponent([t("PPOS_productSerial")], filterText),
      element: (
        <ERPInput
          id="vanSaleProductSerial"
          label={t("PPOS_productSerial")}
          disabled={settings?.branchSettings?.enableVanSale === false}
          className="w-full"
          value={settings?.branchSettings?.vanSaleProductSerial}
          data={settings?.branchSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "vanSaleProductSerial",
              data.vanSaleProductSerial
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("PPOS_email")], filterText),
      element: (
        <ERPInput
          id="pPOSEmail"
          label={t("PPOS_email")}
          disabled={settings?.branchSettings?.enableVanSale === false}
          className="w-full"
          value={settings?.branchSettings?.pPOSEmail}
          data={settings?.branchSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "pPOSEmail",
              data.pPOSEmail
            )
          }
        />
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
          <div key={key} ref={(el) => (subItemsRef.current["inventoryPPOS"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] dark:!bg-dark-bg-header dark:!text-dark-text font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventoryPPOS"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("ppos")}
            </h1>
            <div key="inventoryPPOS" className="space-y-4">
              <div className={`border border-solid dark:!bg-dark-bg dark:!border-dark-border border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
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
                      ))}
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
export default InventoryPPOSFilterableComponents;