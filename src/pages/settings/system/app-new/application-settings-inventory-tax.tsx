import { t } from "i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import Urls from "../../../../redux/urls";
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
      condition: filterComponent([t("default_purchase")], filterText),
      element: (
        <>
          <ERPDataCombobox
            id="purchaseFormType"
            data={settings?.taxSettings}
            field={{
              id: "purchaseFormType",
              getListUrl: Urls.data_FormTypeByPI,
              valueKey: "FormType",
              labelKey: "FormType",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("taxSettings", "purchaseFormType", data.purchaseFormType)
            }
            label={t("default_purchase")}
          />

          <ERPDataCombobox
            id="salesFormType"
            data={settings?.taxSettings}
            field={{
              id: "salesFormType",
              getListUrl: Urls.data_FormTypeBySI,
              valueKey: "FormType",
              labelKey: "FormType",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("taxSettings", "salesFormType", data.salesFormType)
            }
            label={t("sales_form_type")}
          />

          <ERPDataCombobox
            id="purchaseTaxAccount"
            data={settings?.taxSettings}
            field={{
              id: "purchaseTaxAccount",
              required: false,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("taxSettings", "purchaseTaxAccount", data.purchaseTaxAccount)
            }
            label={t("purchase_tax_ledger")}
          />

          <ERPDataCombobox
            id="salesTaxAccount"
            data={settings?.taxSettings}
            field={{
              id: "salesTaxAccount",
              required: false,
              getListUrl: Urls.data_duties_taxes,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("taxSettings", "salesTaxAccount", data.salesTaxAccount)
            }
            label={t("sales_tax_ledger")}
          />

          {1 !== 1 && (
            <>
              <ERPDataCombobox
                id="purchaseCSTAccount"
                data={settings?.taxSettings}
                disabled
                field={{
                  id: "purchaseCSTAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("taxSettings", "purchaseCSTAccount", data.purchaseCSTAccount)
                }
                label={t("purchase_cst_account")}
              />

              <ERPDataCombobox
                id="salesCSTAccount"
                data={settings?.taxSettings}
                disabled
                field={{
                  id: "salesCSTAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("taxSettings", "salesCSTAccount", data.salesCSTAccount)
                }
                label={t("sales_cst_account")}
              />

              <ERPDataCombobox
                id="expensesTaxAccount"
                data={settings?.taxSettings}
                disabled
                field={{
                  id: "expensesTaxAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("taxSettings", "expensesTaxAccount", data.expensesTaxAccount)
                }
                label={t("expenses_tax_account")}
              />

              <ERPDataCombobox
                id="incomeTaxAccount"
                data={settings?.taxSettings}
                disabled
                field={{
                  id: "incomeTaxAccount",
                  required: false,
                  getListUrl: Urls.data_duties_taxes,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(data: any) =>
                  handleFieldChange("taxSettings", "incomeTaxAccount", data.incomeTaxAccount)
                }
                label={t("income_tax_account")}
              />
            </>
          )}
        </>
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
              {t("tax_settings")}
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