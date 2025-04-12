import { useState, useEffect } from "react";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { APIClient } from "../../../helpers/api-client";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { handleResponse } from "../../../utilities/HandleResponse";
import { t } from "i18next";
import { Countries } from "../../../redux/slices/user-session/reducer";
import { RootState } from "../../../redux/store";
import { ApplicationProductsSettings, ApplicationProductsSettingsInitialState } from "./application-settings-types/application-settings-types-products";
import { useTranslation } from "react-i18next";

const ApplicationSettingsProduct = () => {
  const [formState, setFormState] = useState<ApplicationProductsSettings>(ApplicationProductsSettingsInitialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<ApplicationProductsSettings>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new APIClient();
  const dispatch = useAppDispatch();
  const [isLastSystemGeneratedBarcode, setIsLastSystemGeneratedBarcode] = useState(false);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const { t } = useTranslation("applicationSettings");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const formContainer = document.querySelector('.settings-form-container') as HTMLElement;
    if (formContainer) {
      formContainer.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(
        `${Urls.application_settings}products`
      );

      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof typeof ApplicationProductsSettingsInitialState, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState?.[key as keyof ApplicationProductsSettings];
        const prevValue = formStatePrev[key as keyof ApplicationProductsSettings];

        if (currentValue !== prevValue || (currentValue === false && prevValue === true) ||
        (currentValue === true && prevValue === false)) {

          acc.push({
            settingsName: key,
            settingsValue: currentValue === false ? "false" :
            currentValue === true ? "true" :
            (currentValue ?? "").toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);

      const response = modifiedSettings && modifiedSettings.length > 0 ? (await api.put(Urls.application_settings, {
        type: "products",
        updateList: modifiedSettings,
      })) as any: null;
      handleResponse(response,() => {setFormStatePrev(formState)}, () => {},false);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  //   if (loading) {
  //     return <div>Loading settings...</div>;
  //   }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={loadSettings}>Retry</button>
      </div>
    );
  }
  return (
    <div className="h-screen max-h-dvh flex flex-col  overflow-hidden">
      <form className="overflow-y-auto scrollbar scrollbar-thick scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto mb-[8rem]">
        <div className="space-y-6 p-6">
          <div className="border p-4 rounded-lg">
            <div className="grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6">
              <ERPDataCombobox
                id="batchCriteria"
                field={{
                  id: "batchCriteria",

                  getListUrl: Urls.data_batchcriteria,
                  valueKey: "id",
                  labelKey: "name",
                }}
                data={formState}
                onChangeData={(data) =>
                  handleFieldChange("batchCriteria", data.batchCriteria)
                }
                label={t("batch_criteria")}
              />

              <ERPInput
                id="marginRoundTo"
                label={t("margin_round_to")}
                type="number"
                data={formState}
                value={formState?.marginRoundTo}
                onChangeData={(data) =>
                  handleFieldChange("marginRoundTo", data.marginRoundTo)
                }
              />
              <ERPDataCombobox
                field={{
                  id: "stockTransferNegativeStock",
                  valueKey: "label",
                  labelKey: "label",
                }}
                id="stockTransferNegativeStock"
                label={t("stock_transfer_negative_stock")}
                data={formState}
                onChangeData={(data) => {
                  handleFieldChange(
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

              <ERPDataCombobox
                field={{
                  id: "showHSNCodeWarning",
                  valueKey: "label",
                  labelKey: "label",
                }}
                id="showHSNCodeWarning"
                label={t("HSN_code")}
                data={formState}
                onChangeData={(data) => {
                  handleFieldChange("showHSNCodeWarning", data.showHSNCodeWarning);
                }}
                options={[
                  { value: 0, label: "Block" },
                  { value: 1, label: "Warn" },
                  { value: 2, label: "Ignore" },
                ]}
              />
              {userSession.countryId == Countries.India &&
                <>
                  <ERPDataCombobox
                    field={{
                      id: "lPPriceLessThanSellingPrice",
                      valueKey: "label",
                      labelKey: "label",
                    }}
                    id="lPPriceLessThanSellingPrice"
                    label={t("LP_priceLess_than_selling_price")}
                    data={formState}
                    onChangeData={(data) => {
                      handleFieldChange(
                        "lPPriceLessThanSellingPrice",
                        data.lPPriceLessThanSellingPrice
                      );
                    }}
                    options={[
                      { value: 0, label: "Block" },
                      { value: 1, label: "Warn" },
                      { value: 2, label: "Ignore" },
                    ]}
                  />

                  <ERPDataCombobox
                    field={{
                      id: "mRPLessThanSalesPrice",
                      valueKey: "label",
                      labelKey: "label",
                    }}
                    id="mRPLessThanSalesPrice"
                    label={t("MRP_less_than_sales_price")}
                    data={formState}
                    onChangeData={(data) => {
                      handleFieldChange(
                        "mRPLessThanSalesPrice",
                        data.mRPLessThanSalesPrice
                      );
                    }}
                    options={[
                      { value: 0, label: "Block" },
                      { value: 1, label: "Warn" },
                      { value: 2, label: "Ignore" },
                    ]}
                  />
                  <ERPDataCombobox
                    field={{
                      id: "zeroMultiRateValidate",
                      valueKey: "label",
                      labelKey: "label",
                    }}
                    id="zeroMultiRateValidate"
                    label={t("zero_multi_rate_validate")}
                    data={formState}
                    onChangeData={(data) => {
                      handleFieldChange(
                        "zeroMultiRateValidate",
                        data.zeroMultiRateValidate
                      );
                    }}
                    options={[
                      { value: 0, label: "Block" },
                      { value: 1, label: "Warn" },
                      { value: 2, label: "Ignore" },
                    ]}
                  />
                </>
              }
              <ERPDataCombobox
                field={{
                  id: "weighingScaleBarcodeType",
                  valueKey: "label",
                  labelKey: "label",
                }}
                id="weighingScaleBarcodeType"
                label={t("weighing_scale_barcode_type")}
                data={formState}
                onChangeData={(data) => {
                  handleFieldChange(
                    "weighingScaleBarcodeType",
                    data.weighingScaleBarcodeType
                  );
                }}
                options={[
                  { value: 0, label: "Standard. No Check Digit" },
                  { value: 1, label: "13 Digit With Check Digit (Qty)" },
                  { value: 2, label: "13 Digit With Check Digit (Value)" },
                  { value: 3, label: "13 Digit With Check Digit (Qty/Value)" },
                  { value: 4, label: "Ignore" },
                ]}
              />
              <ERPInput
                id="productImagePath"
                value={formState.productImagePath}
                data={formState}
                label={t("set_gift_shared_path")}
                type="text"
                placeholder={t("set_gift_shared_path")}
                onChangeData={(data) =>
                  handleFieldChange("productImagePath", data.productImagePath)
                }
              />
            </div>
            <div className="grid xxl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-4">
              <div className="flex items-center justify-between sm:justify-start  ">
                <ERPCheckbox
                  id="useProductImages"
                  label={t("use_product_images")}
                  data={formState}
                  checked={formState?.useProductImages}
                  onChangeData={(data) =>
                    handleFieldChange("useProductImages", data.useProductImages)
                  }
                />
                {/* <div className="w-2/4">
                  <label
                    htmlFor="productImagePath"
                    className="block text-sm font-medium text-gray-700">
                  </label>
                  <input
                    type="file"
                    id="productImagePath"
                    className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                    onChange={(data: any) =>
                      handleFieldChange("productImagePath", data.productImagePath)
                    }
                  />
                </div> */}
              </div>
              <div className="flex items-center justify-between sm:justify-start">
                <ERPCheckbox
                  id="giftOnBilling"
                  data={formState}
                  label={t("gift_on_billing")}
                  checked={formState?.giftOnBilling}
                  onChangeData={(data) =>
                    handleFieldChange("giftOnBilling", data.giftOnBilling)
                  }
                />
                <ERPDataCombobox
                  field={{
                    id: "giftOnBillingAs",
                    valueKey: "label",
                    labelKey: "label",
                  }}
                  id="giftOnBillingAs"
                  data={formState}
                  onChangeData={(data) => {
                    handleFieldChange("giftOnBillingAs", data.giftOnBillingAs);
                  }}
                  options={[
                    { value: 0, label: "CashCoupons" },
                    { value: 1, label: "Products" },
                    { value: 2, label: "Special Price" },
                  ]}
                  disabled={!formState?.giftOnBilling}
                  label=" "
                />
              </div>
              <div className="flex items-center justify-between sm:justify-start">
                <ERPCheckbox
                  id="isLastSystemGeneratedBarcode"
                  data={formState}
                  label={t("last_generated_barcode")}
                  checked={isLastSystemGeneratedBarcode}
                  onChange={(data) =>
                    setIsLastSystemGeneratedBarcode(data.target?.checked)
                  }
                />
                <ERPInput
                  id="lastSystemGeneratedBarcode"
                  label=" "
                  value={formState.lastSystemGeneratedBarcode}
                  data={formState}
                  noLabel={true}
                  type="text"
                  disabled={!isLastSystemGeneratedBarcode}
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      "lastSystemGeneratedBarcode",
                      data.lastSystemGeneratedBarcode
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-lg">
            <div className="grid xxl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6">
              <ERPCheckbox
                data={formState}
                id="allowOnlyScanProductMarkedAsWeighingScaleItems"
                label={t("allow_only_scan_product")}
                checked={formState?.allowOnlyScanProductMarkedAsWeighingScaleItems}
                onChangeData={(data) =>
                  handleFieldChange(
                    "allowOnlyScanProductMarkedAsWeighingScaleItems",
                    data.allowOnlyScanProductMarkedAsWeighingScaleItems
                  )
                }
              />
              <ERPCheckbox
                id="allowMultirate"
                data={formState}
                label={t("allow_multi_rate")}
                checked={formState?.allowMultirate}
                onChangeData={(data) =>
                  handleFieldChange("allowMultirate", data.allowMultirate)
                }
              />
              <ERPCheckbox
                id="setDefaultQty1"
                data={formState}
                label={t("set_default_qty_1")}
                checked={formState?.setDefaultQty1}
                onChangeData={(data) =>
                  handleFieldChange(
                    "setDefaultQty1",
                    data.setDefaultQty1
                  )
                }
              />
              <ERPCheckbox
                id="setQty1ForWeighingScaleItem_ValueMode"
                data={formState}
                label={t("set_qty1_for_weighing_scale_item_value_mode")}
                checked={formState?.setQty1ForWeighingScaleItem_ValueMode}
                onChangeData={(data) =>
                  handleFieldChange(
                    "setQty1ForWeighingScaleItem_ValueMode",
                    data.setQty1ForWeighingScaleItem_ValueMode
                  )
                }
              />
              <ERPCheckbox
                id="allowMultiUnits"
                label={t("allow_multi_unit")}
                data={formState}
                checked={formState?.allowMultiUnits}
                onChangeData={(data) =>
                  handleFieldChange("allowMultiUnits", data.allowMultiUnits)
                }
              />
              <ERPCheckbox
                id="stopScanningOnWrongBarcode"
                label={t("stop_scanning_(POS)")}
                data={formState}
                checked={formState?.stopScanningOnWrongBarcode}
                onChangeData={(data) =>
                  handleFieldChange(
                    "stopScanningOnWrongBarcode",
                    data.stopScanningOnWrongBarcode
                  )
                }
              />
              <ERPCheckbox
                id="stopScanningOnWrongBarcodeInSales"
                label={t("stop_scanning_(Sales)")}
                data={formState}
                checked={formState?.stopScanningOnWrongBarcodeInSales}
                onChangeData={(data) =>
                  handleFieldChange(
                    "stopScanningOnWrongBarcodeInSales",
                    data.stopScanningOnWrongBarcodeInSales
                  )
                }
              />
              <ERPCheckbox
                id="blockQtyChangeOptionInPOS"
                label={t("block_qty_POS")}
                data={formState}
                checked={formState?.blockQtyChangeOptionInPOS}
                onChangeData={(data) =>
                  handleFieldChange(
                    "blockQtyChangeOptionInPOS",
                    data.blockQtyChangeOptionInPOS
                  )
                }
              />
              <ERPCheckbox
                id="enableGoogleTranslationOfProductName"
                label={t("enable_google_translation")}
                data={formState}
                checked={formState?.enableGoogleTranslationOfProductName}
                onChangeData={(data) =>
                  handleFieldChange(
                    "enableGoogleTranslationOfProductName",
                    data.enableGoogleTranslationOfProductName
                  )
                }
              />
              <ERPCheckbox
                id="loadListedProductPrices"
                label={t("check_listed_product")}
                data={formState}
                checked={formState?.loadListedProductPrices}
                onChangeData={(data) =>
                  handleFieldChange(
                    "loadListedProductPrices",
                    data.loadListedProductPrices
                  )
                }
              />
              <ERPCheckbox
                id="maintainSchemes"
                label={t("maintain_schemes")}
                data={formState}
                checked={formState?.maintainSchemes}
                onChangeData={(data) =>
                  handleFieldChange("maintainSchemes", data.maintainSchemes)
                }
              />
              <ERPCheckbox
                id="excludeSchemeProductAmountFromPrivilegeCard"
                label={t("exclude_scheme_product")}
                data={formState}
                checked={formState?.excludeSchemeProductAmountFromPrivilegeCard}
                onChangeData={(data) =>
                  handleFieldChange(
                    "excludeSchemeProductAmountFromPrivilegeCard",
                    data.excludeSchemeProductAmountFromPrivilegeCard
                  )
                }
              />
              <ERPCheckbox
                id="includeSearchItemAlias_ItemName2"
                label={t("include_search_item")}
                data={formState}
                checked={formState?.includeSearchItemAlias_ItemName2}
                onChangeData={(data) =>
                  handleFieldChange(
                    "includeSearchItemAlias_ItemName2",
                    data.includeSearchItemAlias_ItemName2
                  )
                }
              />
              <ERPCheckbox
                id="advancedProductSearching"
                label={t("advanced_product_searching")}
                data={formState}
                checked={formState?.advancedProductSearching}
                onChangeData={(data) =>
                  handleFieldChange(
                    "advancedProductSearching",
                    data.advancedProductSearching
                  )
                }
              />
              <ERPCheckbox
                id="allowUpdateSalesPriceFromPurchase"
                label={t("allow_update_sales")}
                data={formState}
                checked={formState?.allowUpdateSalesPriceFromPurchase}
                onChangeData={(data) =>
                  handleFieldChange(
                    "allowUpdateSalesPriceFromPurchase",
                    data.allowUpdateSalesPriceFromPurchase
                  )
                }
              />
              {userSession.countryId == Countries.India &&
                <ERPCheckbox
                  id="allowUpdateMultiRateinPurchase"
                  label={t("allow_update_multiRate")}
                  data={formState}
                  checked={formState?.allowUpdateMultiRateinPurchase}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "allowUpdateMultiRateinPurchase",
                      data.allowUpdateMultiRateinPurchase
                    )
                  }
                />
              }
              {userSession.countryId == Countries.India &&
                <>
                  <ERPCheckbox
                    id="enableQtySlabOffer"
                    label={t("enable_qty_slab_offer")}
                    data={formState}
                    checked={formState?.enableQtySlabOffer}
                    onChangeData={(data) =>
                      handleFieldChange("enableQtySlabOffer", data.enableQtySlabOffer)
                    }
                  />
                  <ERPCheckbox
                    id="setProductQtyLimitinSales"
                    label={t("set_product_qty_limit_in_sales")}
                    data={formState}
                    checked={formState?.setProductQtyLimitinSales}
                    onChangeData={(data) =>
                      handleFieldChange(
                        "setProductQtyLimitinSales",
                        data.setProductQtyLimitinSales
                      )
                    }
                  />
                  <ERPCheckbox
                    id="enableMultiFOC"
                    label={t("enable_multi_FOC")}
                    data={formState}
                    checked={formState?.enableMultiFOC}
                    onChangeData={(data) =>
                      handleFieldChange("enableMultiFOC", data.enableMultiFOC)
                    }
                  />
                </>
              }
              <ERPCheckbox
                id="loadCustomerLastRate"
                label={t("load_customer_last_sales_rate")}
                data={formState}
                checked={formState?.loadCustomerLastRate}
                onChangeData={(data) =>
                  handleFieldChange(
                    "loadCustomerLastRate",
                    data.loadCustomerLastRate
                  )
                }
              />

              <ERPCheckbox
                id="focusToQtyAfterBarcode"
                label={t("focus_to_qty_after_barcode")}
                data={formState}
                checked={formState?.focusToQtyAfterBarcode}
                onChangeData={(data) =>
                  handleFieldChange(
                    "focusToQtyAfterBarcode",
                    data.focusToQtyAfterBarcode
                  )
                }
              />


              <ERPCheckbox
                id="allowMannualProductSelectionInSales"
                label={t("allow_manual_product")}
                data={formState}
                checked={formState?.allowMannualProductSelectionInSales}
                onChangeData={(data) =>
                  handleFieldChange(
                    "allowMannualProductSelectionInSales",
                    data.allowMannualProductSelectionInSales
                  )
                }
              />
              <ERPCheckbox
                id="showRateBeforeTax"
                label={t("show_rate_(tax_inclusive)")}
                data={formState}
                checked={formState?.showRateBeforeTax}
                onChangeData={(data) =>
                  handleFieldChange("showRateBeforeTax", data.showRateBeforeTax)
                }
              />
              <ERPCheckbox
                id="loadDummyProducts"
                label={t("load_dummy_products")}
                data={formState}
                checked={formState?.loadDummyProducts}
                onChangeData={(data) =>
                  handleFieldChange("loadDummyProducts", data.loadDummyProducts)
                }
              />
              <ERPCheckbox
                id="showPurchaseCostChangeWarning"
                label={t("show_purchase_cost_change_warning")}
                data={formState}
                checked={formState?.showPurchaseCostChangeWarning}
                onChangeData={(data) =>
                  handleFieldChange(
                    "showPurchaseCostChangeWarning",
                    data.showPurchaseCostChangeWarning
                  )
                }
              />
             {/* {1 != 1 &&  (
             <>
              <ERPCheckbox
                id="enableSupplierWiseItemCode"
                label={t("enable_supplier_wise_item_code")}
                data={formState}
                checked={formState?.enableSupplierWiseItemCode}
                onChangeData={(data) =>
                  handleFieldChange(
                    "enableSupplierWiseItemCode",
                    data.enableSupplierWiseItemCode
                  )
                }
              />
              <ERPCheckbox
                id="enableMultiWarehouseBilling"
                label={t("enable_multi_warehouse_billing")}
                data={formState}
                checked={formState?.enableMultiWarehouseBilling}
                onChangeData={(data) =>
                  handleFieldChange(
                    "enableMultiWarehouseBilling",
                    data.enableMultiWarehouseBilling
                  )
                }
              />
             </>)} */}
              <ERPCheckbox
                id="usePopupWindowForItemSearch"
                label={t("use_popup_window_for_item_search")}
                data={formState}
                checked={formState?.usePopupWindowForItemSearch}
                onChangeData={(data) =>
                  handleFieldChange(
                    "usePopupWindowForItemSearch",
                    data.usePopupWindowForItemSearch
                  )
                }
              />
              <ERPCheckbox
                id="listBarcodeItemsInItemLookup"
                label={t("list_barcode_items_in_item_lookup")}
                data={formState}
                checked={formState?.listBarcodeItemsInItemLookup}
                onChangeData={(data) =>
                  handleFieldChange(
                    "listBarcodeItemsInItemLookup",
                    data.listBarcodeItemsInItemLookup
                  )
                }
              />
              {userSession.countryId == Countries.India &&
                <ERPCheckbox
                  id="enableOrderMangment"
                  disabled
                  label={t("enable_order_management")}
                  data={formState}
                  checked={formState?.enableOrderMangment}
                  onChangeData={(data) =>
                    handleFieldChange("enableOrderMangment", data.enableOrderMangment)
                  }
                />
              }
              <ERPCheckbox
                id="enableImportPurchase"
                disabled
                label={t("enable_import_purchase")}
                data={formState}
                checked={formState?.enableImportPurchase}
                onChangeData={(data) =>
                  handleFieldChange("enableImportPurchase", data.enableImportPurchase)
                }
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 dark:!bg-dark-bg bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          disabled={isSaving}
          loading={isSaving}
          type="button"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ApplicationSettingsProduct;
