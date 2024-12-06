import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { LedgerType } from "../../../../enums/ledger-types";
import { Countries } from "../../../../redux/slices/user-session/reducer";

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

const MainInventoryGeneralFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("coupon_card_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultCouponSalesAccount"
          data={settings?.inventorySettings}
          field={{
            id: "defaultCouponSalesAccount",
            required: false,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultCouponSalesAccount",
              data.defaultCouponSalesAccount
            )
          }
          label={t("coupon_card_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_round_off_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultRoundOffAccount"
          data={settings?.inventorySettings}
          field={{
            id: "defaultRoundOffAccount",
            required: false,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Indirect_Expenses}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultRoundOffAccount",
              data.defaultRoundOffAccount
            )
          }
          label={t("default_round_off_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_additional_amount_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultAdditionalAmountAccount"
          data={settings?.inventorySettings}
          field={{
            id: "defaultAdditionalAmountAccount",
            required: false,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultAdditionalAmountAccount",
              data.defaultAdditionalAmountAccount
            )
          }
          label={t("default_additional_amount_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("price_code")], filterText),
      element: (
        <ERPInput
          id="priceCode"
          value={settings?.inventorySettings.priceCode}
          data={settings?.inventorySettings}
          label={t("price_code")}
          placeholder={t("enter_the_price_code")}
          type="Password"
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "priceCode",
              data.priceCode
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_service_spare_warehouse")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultServiceSpareWareHouse"
          data={settings?.inventorySettings}
          field={{
            id: "defaultServiceSpareWareHouse",
            required: false,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultServiceSpareWareHouse",
              data.defaultServiceSpareWareHouse
            )
          }
          label={t("default_service_spare_warehouse")}
        />
      ),
    },
    {
      condition: filterComponent([t("negative_stock")], filterText),
      element: (
        <ERPDataCombobox
          id="showNegStockWarning"
          field={{
            id: "showNegStockWarning",
            valueKey: "value",
            labelKey: "label",
          }}
          data={settings?.inventorySettings}
          options={[
            { value: "Block", label: "Block" },
            { value: "Warn", label: "Warn" },
            { value: "Ignore", label: "Ignore" },
          ]}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showNegStockWarning",
              data.showNegStockWarning
            )
          }
          label={t("negative_stock")}
        />
      ),
    },
    {
      condition: filterComponent([t("maximum_allowed_line_item_amount")], filterText),
      element: (
        <ERPInput
          id="maximum_Allowed_LineItem_Amount"
          value={settings?.branchSettings?.maximum_Allowed_LineItem_Amount}
          data={settings?.branchSettings}
          type="number"
          label={t("maximum_allowed_line_item_amount")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "maximum_Allowed_LineItem_Amount",
              data.maximum_Allowed_LineItem_Amount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("stock_transfer_negative_stock")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "stockTransferNegativeStock",
            valueKey: "label",
            labelKey: "label",
          }}
          id="stockTransferNegativeStock"
          label={t("stock_transfer_negative_stock")}
          data={settings?.productsSettings}
          onChangeData={(data) => {
            handleFieldChange(
              "productsSettings",
              "stockTransferNegativeStock",
              data.stockTransferNegativeStock
            );
          }}
          options={[
            { value: 0, label: "Block" },
            { value: 1, label: "Warn" },
            { value: 2, label: "Ignore" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_warehouse")], filterText),
      element: (
        <ERPCheckbox
          id="maintainWarehouse"
          checked={settings?.inventorySettings.maintainWarehouse}
          data={settings?.inventorySettings}
          label={t("maintain_warehouse")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "maintainWarehouse",
              data.maintainWarehouse
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("print_after_save")], filterText),
      element: (
        <ERPCheckbox
          id="printInvAfterSave"
          checked={settings?.inventorySettings?.printInvAfterSave}
          data={settings?.inventorySettings}
          label={t("print_after_save")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "printInvAfterSave",
              data.printInvAfterSave
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_product_cost_with_TAX_amount")], filterText),
      element: (
        <ERPCheckbox
          id="setProductCostWithVATAmount"
          checked={settings?.inventorySettings.setProductCostWithVATAmount}
          data={settings?.inventorySettings}
          label={t("set_product_cost_with_TAX_amount")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "setProductCostWithVATAmount",
              data.setProductCostWithVATAmount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_printer_selection")], filterText),
      element: (
        <ERPCheckbox
          id="showPrinterSelection"
          checked={settings?.inventorySettings.showPrinterSelection}
          data={settings?.inventorySettings}
          label={t("show_printer_selection")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showPrinterSelection",
              data.showPrinterSelection
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_product_duplication_message")], filterText),
      element: (
        <ERPCheckbox
          id="showProductDuplicationMessage"
          checked={settings?.inventorySettings.showProductDuplicationMessage}
          data={settings?.inventorySettings}
          label={t("show_product_duplication_message")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showProductDuplicationMessage",
              data.showProductDuplicationMessage
            )
          }
        />
      ),
    },
    {
      condition:
        userSession.countryId == Countries.India &&
        filterComponent([t("enable_add_stock_adjustment")], filterText),
      element: (
        <ERPCheckbox
          id="enableAddStockAdjustment"
          checked={settings?.inventorySettings.enableAddStockAdjustment}
          data={settings?.inventorySettings}
          label={t("enable_add_stock_adjustment")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "enableAddStockAdjustment",
              data.enableAddStockAdjustment
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("focus_to_qty_after_barcode")], filterText),
      element: (
        <ERPCheckbox
          id="focusToQtyAfterBarcode"
          label={t("focus_to_qty_after_barcode")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.focusToQtyAfterBarcode}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "focusToQtyAfterBarcode",
              data.focusToQtyAfterBarcode
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
          <div key={key} ref={(el) => (subItemsCatRef.current["inventoryGeneral"] = el)}>
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventoryGeneral"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}>
              {t("general")}
            </h1>
            <div key="inventoryGeneral" className="space-y-4">
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
      )}
    </>
  );
};
export default MainInventoryGeneralFilterableComponents;