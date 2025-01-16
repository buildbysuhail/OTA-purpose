import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
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


const InventoryProductsFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
  const [isLastSystemGeneratedBarcode, setIsLastSystemGeneratedBarcode] = useState(false);
  const { t } = useTranslation("applicationSettings")
  const items = [
    {
      condition: filterComponent([t("batch_criteria")], filterText),
      element: (
        <ERPDataCombobox
          id="batchCriteria"
          field={{
            id: "batchCriteria",
            getListUrl: Urls.data_batchcriteria,
            valueKey: "id",
            labelKey: "name",
          }}
          data={settings?.productsSettings}
          onChangeData={(data) =>
            handleFieldChange("productsSettings", "batchCriteria", data.batchCriteria)
          }
          label={t("batch_criteria")}
        />
      ),
    },
    {
      condition: filterComponent([t("margin_round_to")], filterText),
      element: (
        <ERPInput
          id="marginRoundTo"  
          min={0}
          label={t("margin_round_to")}
          type="number"
          data={settings?.productsSettings}
          value={settings?.productsSettings?.marginRoundTo}
          onChangeData={(data) =>
            handleFieldChange("productsSettings", "marginRoundTo", parseInt(data.marginRoundTo))
          }
        />
      ),
    },
    {
      condition: filterComponent([t("HSN_code")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "showHSNCodeWarning",
            valueKey: "label",
            labelKey: "label",
          }}
          id="showHSNCodeWarning"
          label={t("HSN_code")}
          data={settings?.productsSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "showHSNCodeWarning",
              data.showHSNCodeWarning
            )
          }
          options={[
            { value: 0, label: "Block" },
            { value: 1, label: "Warn" },
            { value: 2, label: "Ignore" },
          ]}
        />
      ),
    },
    {
      condition: userSession.countryId === Countries.India && filterComponent([t("LP_priceLess_than_selling_price")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "lPPriceLessThanSellingPrice",
            valueKey: "label",
            labelKey: "label",
          }}
          id="lPPriceLessThanSellingPrice"
          label={t("LP_priceLess_than_selling_price")}
          data={settings?.productsSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "lPPriceLessThanSellingPrice",
              data.lPPriceLessThanSellingPrice
            )
          }
          options={[
            { value: 0, label: "Block" },
            { value: 1, label: "Warn" },
            { value: 2, label: "Ignore" },
          ]}
        />
      ),
    },
    {
      condition: userSession.countryId === Countries.India && filterComponent([t("MRP_less_than_sales_price")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "mRPLessThanSalesPrice",
            valueKey: "label",
            labelKey: "label",
          }}
          id="mRPLessThanSalesPrice"
          label={t("MRP_less_than_sales_price")}
          data={settings?.productsSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "mRPLessThanSalesPrice",
              data.mRPLessThanSalesPrice
            )
          }
          options={[
            { value: 0, label: "Block" },
            { value: 1, label: "Warn" },
            { value: 2, label: "Ignore" },
          ]}
        />
      ),
    },
    {
      condition: userSession.countryId === Countries.India && filterComponent([t("zero_multi_rate_validate")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "zeroMultiRateValidate",
            valueKey: "label",
            labelKey: "label",
          }}
          id="zeroMultiRateValidate"
          label={t("zero_multi_rate_validate")}
          data={settings?.productsSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "zeroMultiRateValidate",
              data.zeroMultiRateValidate
            )
          }
          options={[
            { value: 0, label: "Block" },
            { value: 1, label: "Warn" },
            { value: 2, label: "Ignore" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("weighing_scale_barcode_type")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "weighingScaleBarcodeType",
            valueKey: "label",
            labelKey: "label",
          }}
          id="weighingScaleBarcodeType"
          label={t("weighing_scale_barcode_type")}
          data={settings?.productsSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "weighingScaleBarcodeType",
              data.weighingScaleBarcodeType
            )
          }
          options={[
            { value: 0, label: "Standard. No Check Digit" },
            { value: 1, label: "13 Digit With Check Digit (Qty)" },
            { value: 2, label: "13 Digit With Check Digit (Value)" },
            { value: 3, label: "13 Digit With Check Digit (Qty/Value)" },
            { value: 4, label: "Ignore" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("last_generated_barcode")], filterText),
      element: (
        <>
          <ERPCheckbox
            id="isLastSystemGeneratedBarcode"
            label={t("last_generated_barcode")}
            checked={isLastSystemGeneratedBarcode}
            onChange={(data) => setIsLastSystemGeneratedBarcode(data.target.checked)}
          />
          <ERPInput
            id="lastSystemGeneratedBarcode"
            label=" "
            value={settings?.productsSettings?.lastSystemGeneratedBarcode}
            data={settings?.productsSettings}
            noLabel={true}
            type="text"
            disabled={!isLastSystemGeneratedBarcode}
            onChangeData={(data) =>
              handleFieldChange(
                "productsSettings",
                "lastSystemGeneratedBarcode",
                data.lastSystemGeneratedBarcode
              )
            }
          />
        </>
      ),
    },
    {
      condition: filterComponent(
        [t("weighing_scale_plu_file_path")],
        filterText
      ),
      element: (
        <ERPInput
          id="weighingScalePluFilePath"
          value={
            settings?.miscellaneousSettings?.weighingScalePluFilePath
          }
          data={settings?.miscellaneousSettings}
          className="flex-grow"
          label={t("plu_path")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "weighingScalePluFilePath",
              data.weighingScalePluFilePath
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("use_product_images")], filterText),
      element: (
        <>
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
      
        <ERPInput
          id="productImagePath"
          value={settings?.productsSettings?.productImagePath}
          data={settings?.productsSettings}
          label=" "
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
        </>
      ),
    },
    {
      condition: filterComponent([t("allow_only_scan_product")], filterText),
      element: (
        <ERPCheckbox
          data={settings?.productsSettings}
          id="allowOnlyScanProductMarkedAsWeighingScaleItems"
          label={t("allow_only_scan_product")}
          checked={
            settings?.productsSettings
              ?.allowOnlyScanProductMarkedAsWeighingScaleItems
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "allowOnlyScanProductMarkedAsWeighingScaleItems",
              data.allowOnlyScanProductMarkedAsWeighingScaleItems
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_multi_rate")], filterText),
      element: (
        <ERPCheckbox
          id="allowMultirate"
          data={settings?.productsSettings}
          label={t("allow_multi_rate")}
          checked={settings?.productsSettings?.allowMultirate}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "allowMultirate",
              data.allowMultirate
            )
          }
        />
      ),
    },
    {
      condition:
        userSession.countryId === Countries.India &&
        filterComponent([t("allow_update_multiRate")], filterText),
      element: (
        <ERPCheckbox
          id="allowUpdateMultiRateinPurchase"
          label={t("allow_update_multiRate")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings?.allowUpdateMultiRateinPurchase
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "allowUpdateMultiRateinPurchase",
              data.allowUpdateMultiRateinPurchase
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_multi_unit")], filterText),
      element: (
        <ERPCheckbox
          id="allowMultiUnits"
          label={t("allow_multi_unit")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.allowMultiUnits}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "allowMultiUnits",
              data.allowMultiUnits
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_update_sales")], filterText),
      element: (
        <ERPCheckbox
          id="allowUpdateSalesPriceFromPurchase"
          label={t("allow_update_sales")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings?.allowUpdateSalesPriceFromPurchase
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "allowUpdateSalesPriceFromPurchase",
              data.allowUpdateSalesPriceFromPurchase
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_default_qty_1")], filterText),
      element: (
        <ERPCheckbox
          id="setDefaultQty1"
          data={settings?.productsSettings}
          label={t("set_default_qty_1")}
          checked={settings?.productsSettings?.setDefaultQty1}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "setDefaultQty1",
              data.setDefaultQty1
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("set_qty1_for_weighing_scale_item_value_mode")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="setQty1ForWeighingScaleItem_ValueMode"
          data={settings?.productsSettings}
          label={t(
            "set_qty1_for_weighing_scale_item_value_mode"
          )}
          checked={
            settings?.productsSettings?.setQty1ForWeighingScaleItem_ValueMode
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "setQty1ForWeighingScaleItem_ValueMode",
              data.setQty1ForWeighingScaleItem_ValueMode
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("enable_google_translation")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="enableGoogleTranslationOfProductName"
          label={t("enable_google_translation")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings
              ?.enableGoogleTranslationOfProductName
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "enableGoogleTranslationOfProductName",
              data.enableGoogleTranslationOfProductName
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("include_search_item")], filterText),
      element: (
        <ERPCheckbox
          id="includeSearchItemAlias_ItemName2"
          label={t("include_search_item")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings?.includeSearchItemAlias_ItemName2
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "includeSearchItemAlias_ItemName2",
              data.includeSearchItemAlias_ItemName2
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("advanced_product_searching")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="advancedProductSearching"
          label={t("advanced_product_searching")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings?.advancedProductSearching
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "advancedProductSearching",
              data.advancedProductSearching
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("load_dummy_products")], filterText),
      element: (
        <ERPCheckbox
          id="loadDummyProducts"
          label={t("load_dummy_products")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings?.loadDummyProducts
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "loadDummyProducts",
              data.loadDummyProducts
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("use_popup_window_for_item_search")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="usePopupWindowForItemSearch"
          label={t("use_popup_window_for_item_search")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings
              ?.usePopupWindowForItemSearch
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "usePopupWindowForItemSearch",
              data.usePopupWindowForItemSearch
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("enable_supplier_wise_item_code")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="enableSupplierWiseItemCode"
          label={t("enable_supplier_wise_item_code")}
          data={settings?.productsSettings}
          checked={
            settings?.productsSettings
              ?.enableSupplierWiseItemCode
          }
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "enableSupplierWiseItemCode",
              data.enableSupplierWiseItemCode
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

  if (!hasMatchedItems) {
    return null;
  }



  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsRef.current["inventoryProducts"] = el)}>
            <h1
              className={`h-[50px] text-[20px] dark:!bg-dark-bg-header dark:!text-dark-text font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventoryProducts"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}>
              {t("products")}
            </h1>
            <div key="inventoryProducts" className="space-y-4">
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
export default InventoryProductsFilterableComponents;