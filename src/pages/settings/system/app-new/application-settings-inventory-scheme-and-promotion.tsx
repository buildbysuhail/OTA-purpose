import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { Countries } from "../../../../redux/slices/user-session/reducer";
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

const InventorySchemeAndPromotionFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("gift_on_billing")], filterText),
      element: (
          <>
          <ERPCheckbox
            id="giftOnBilling"
            data={settings?.productsSettings}
            label={t("gift_on_billing")}
            checked={settings?.productsSettings?.giftOnBilling}
            onChangeData={(data) =>
              handleFieldChange(
                "productsSettings",
                "giftOnBilling",
                data.giftOnBilling
              )
            }
          />
          <ERPDataCombobox
            field={{
              id: "giftOnBillingAs",
              valueKey: "label",
              labelKey: "label",
            }}
            id="giftOnBillingAs"
            data={settings?.productsSettings}
            onChangeData={(data) =>
              handleFieldChange(
                "productsSettings",
                "giftOnBillingAs",
                data.giftOnBillingAs
              )
            }
            options={[
              { value: 0, label: "CashCoupons" },
              { value: 1, label: "Products" },
              { value: 2, label: "Special Price" },
            ]}
            disabled={!settings?.productsSettings?.giftOnBilling}
            label=" "
          />
          </>
      ),
    },
    {
      condition: filterComponent([t("maintain_schemes")], filterText),
      element: (
        <ERPCheckbox
          id="maintainSchemes"
          label={t("maintain_schemes")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.maintainSchemes}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "maintainSchemes",
              data.maintainSchemes
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("exclude_scheme_product")], filterText),
      element: (
        <ERPCheckbox
          id="excludeSchemeProductAmountFromPrivilegeCard"
          label={t("exclude_scheme_product")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings?.excludeSchemeProductAmountFromPrivilegeCard
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "excludeSchemeProductAmountFromPrivilegeCard",
              data.excludeSchemeProductAmountFromPrivilegeCard
            )
          }
        />
      ),
    },
    {
      condition:
        userSession.countryId === Countries.India &&
        filterComponent([t("enable_qty_slab_offer")], filterText),
      element: (
        <ERPCheckbox
          id="enableQtySlabOffer"
          label={t("enable_qty_slab_offer")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.enableQtySlabOffer}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "enableQtySlabOffer",
              data.enableQtySlabOffer
            )
          }
        />
      ),
    },
    {
      condition:
        userSession.countryId === Countries.India &&
        filterComponent([t("set_product_qty_limit_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="setProductQtyLimitinSales"
          label={t("set_product_qty_limit_in_sales")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.setProductQtyLimitinSales}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "setProductQtyLimitinSales",
              data.setProductQtyLimitinSales
            )
          }
        />
      ),
    },
    {
      condition:
        userSession.countryId === Countries.India &&
        filterComponent([t("enable_multi_FOC")], filterText),
      element: (
        <ERPCheckbox
          id="enableMultiFOC"
          label={t("enable_multi_FOC")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.enableMultiFOC}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "enableMultiFOC",
              data.enableMultiFOC
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

  const appState = useAppSelector(
    (state: RootState) => state.AppState.appState
  );

  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsRef.current["inventorySchemesPromotions"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] ${appState.mode == 'dark' ? "!bg-[#404344bf] " : ``} font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventorySchemesPromotions"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("schemes_&_promotions")}
            </h1>
            <div key="inventorySchemesPromotions" className="space-y-4">
              <div className={`border border-solid ${appState.mode == 'dark' ? " !border-[#f2f4f538] " : ``} border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
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
export default InventorySchemeAndPromotionFilterableComponents;