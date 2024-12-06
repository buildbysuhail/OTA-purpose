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

const MainCRMFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("allow_privilege_card")], filterText),
      element: (
        <div className="flex items-center">
          <ERPCheckbox
            id="allowPrivilegeCard"
            label={t("allow_privilege_card")}
            data={settings?.mainSettings}
            checked={settings?.mainSettings?.allowPrivilegeCard}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "allowPrivilegeCard",
                data.allowPrivilegeCard
              )
            }
          />
          <ERPInput
            id="previlegeCardPerc"
            label=" "
            type="number"
            data={settings?.mainSettings}
            className="w-20 ml-6 mt-1"
            value={settings?.mainSettings?.previlegeCardPerc}
            disabled={!settings?.mainSettings?.allowPrivilegeCard}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "previlegeCardPerc",
                data.previlegeCardPerc
              )
            }
          />
          <label className="ml-2 mr-2 block form-check-label text-gray-700">
            %
          </label>
        </div>
      ),
    },
    {
      condition: filterComponent([t("redeem_points_(separated_by_comma)")], filterText),
      element: (
        <ERPInput
          id="redeeemValuesSeperatedByComma"
          value={settings?.inventorySettings?.redeeemValuesSeperatedByComma}
          data={settings?.inventorySettings}
          label={t("redeem_points_(separated_by_comma)")}
          placeholder={t("enter_redeem_points")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "redeeemValuesSeperatedByComma",
              data.redeeemValuesSeperatedByComma
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("use_product_images")], filterText),
      element: (
        <ERPCheckbox
          id="useProductImages"
          label={t("use_product_images")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.useProductImages}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "useProductImages",
              data.useProductImages
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("product_image_path")], filterText),
      element: (
        <ERPInput
          id="productImagePath"
          value={settings?.productsSettings?.productImagePath}
          data={settings?.productsSettings}
          label={t("product_image_path")}
          type="text"
          placeholder={t("product_image_path")}
          disabled={!settings?.productsSettings?.useProductImages}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "productImagePath",
              data.productImagePath
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_gift_shared_path")], filterText),
      element: (
        <ERPInput
          id="sharedGiftPath"
          value={settings?.productsSettings?.sharedGiftPath}
          data={settings?.productsSettings}
          disabled={true}
          label={t("set_gift_shared_path")}
          type="text"
          placeholder={t("set_gift_shared_path")}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "sharedGiftPath",
              data.sharedGiftPath
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
        <div
          key={key}
          ref={(el) => (subItemsRef.current["mainCRM"] = el)}
        >
          <h1
            className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${
              blinkSection === "mainCRM"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
            }`}
            onClick={handleGeneralHeaderClick}
          >
            {t("general")}
          </h1>
          <div key="mainCRM" className="space-y-4">
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
export default MainCRMFilterableComponents;
