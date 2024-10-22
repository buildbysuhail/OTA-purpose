import React, { useState, useEffect } from "react";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { APIClient } from "../../../helpers/api-client";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { handleResponse } from "../../../utilities/HandleResponse";

interface FormState {
  setDefaultQty1: boolean;
  allowMultiUnits: boolean;
  allowMultirate: boolean;
  batchCriteria: string;
  loadCustomerLastRate: boolean;
  loadDummyProducts: boolean;
  marginRoundTo: number;
  focusToQtyAfterBarcode: boolean;
  stockTransferNegativeStock: string;
  allowMannualProductSelectionInSales: boolean;
  useProductImages: boolean;
  productImagePath: string;
  maintainSchemes: boolean;
  weighingScaleBarcodeType: string;
  pPOsPriceCategory: number;
  showRateBeforeTax: boolean;
  stopScanningOnWrongBarcode: boolean;
  allowOnlyScanProductMarkedAsWeighingScaleItems: boolean;
  loadListedProductPrices: boolean;
  advancedProductSearching: boolean;
  blockQtyChangeOptionInPOS: boolean;
  enableGoogleTranslationOfProductName: boolean;
  setQty1ForWeighingScaleItem_ValueMode: boolean;
  allowUpdateSalesPriceFromPurchase: boolean;
  usePopupWindowForItemSearch: boolean;
  enableMultiWarehouseBilling: boolean;
  enableSupplierWiseItemCode: boolean;
  includeSearchItemAlias_ItemName2: boolean;
  lastSystemGeneratedBarcode: number;
  lastSystemGeneratedBarcodetrue: boolean;
  stopScanningOnWrongBarcodeInSales: boolean;
  excludeSchemeProductAmountFromPrivilegeCard: boolean;
  showPurchaseCostChangeWarning: boolean;
  listBarcodeItemsInItemLookup: boolean;
  showHSNCodeWarning: string;
  giftOnBilling: boolean;
  setProductQtyLimitinSales: boolean;
  enableQtySlabOffer: boolean;
  giftOnBillingAs: string;
  enableMultiFOC: boolean;
  lPPriceLessThanSellingPrice: string;
  mRPLessThanSalesPrice: string;
  zeroMultiRateValidate: string;
  allowUpdateMultiRateinPurchase: boolean;
}

const ApplicationSettingsProduct = () => {
  const initialState: FormState = {
    setDefaultQty1: true,
    lastSystemGeneratedBarcodetrue: false,
    allowMultiUnits: true,
    allowMultirate: false,
    batchCriteria: "NB",
    loadCustomerLastRate: false,
    loadDummyProducts: false,
    marginRoundTo: 0,
    focusToQtyAfterBarcode: true,
    stockTransferNegativeStock: "Warn",
    allowMannualProductSelectionInSales: true,
    useProductImages: false,
    productImagePath: " ",
    maintainSchemes: false,
    weighingScaleBarcodeType: "Standard. No Check Digit",
    pPOsPriceCategory: 1,
    showRateBeforeTax: false,
    stopScanningOnWrongBarcode: false,
    allowOnlyScanProductMarkedAsWeighingScaleItems: false,
    loadListedProductPrices: false,
    advancedProductSearching: false,
    blockQtyChangeOptionInPOS: false,
    enableGoogleTranslationOfProductName: true,
    setQty1ForWeighingScaleItem_ValueMode: true,
    allowUpdateSalesPriceFromPurchase: false,
    usePopupWindowForItemSearch: false,
    enableMultiWarehouseBilling: false,
    enableSupplierWiseItemCode: false,
    includeSearchItemAlias_ItemName2: true,
    lastSystemGeneratedBarcode: 1000000000001,
    stopScanningOnWrongBarcodeInSales: false,
    excludeSchemeProductAmountFromPrivilegeCard: false,
    showPurchaseCostChangeWarning: false,
    listBarcodeItemsInItemLookup: false,
    showHSNCodeWarning: "Warn",
    giftOnBilling: false,
    setProductQtyLimitinSales: false,
    enableQtySlabOffer: false,
    giftOnBillingAs: "Products",
    enableMultiFOC: false,
    lPPriceLessThanSellingPrice: "Warn",
    mRPLessThanSalesPrice: "Warn",
    zeroMultiRateValidate: "Warn",
    allowUpdateMultiRateinPurchase: false,
  };

  const [formState, setFormState] = useState<FormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new APIClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(
        `${Urls.application_settings}products`
      );
      debugger;
      console.log(formState);
      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof typeof initialState, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState?.[key as keyof FormState];
        const prevValue = formStatePrev[key as keyof FormState];

        if (currentValue !== prevValue) {
          debugger;
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "products",
        updateList: modifiedSettings,
      })) as any;
      handleResponse(response);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-6">
          <ERPDataCombobox
            id="batchCriteria"
            field={{
              id: "batchCriteria",

              getListUrl: Urls.data_batchcriteria,
              valueKey: "name",
              labelKey: "name",
            }}
            data={formState}
            value={formState?.batchCriteria}
            onChangeData={(data) =>
              handleFieldChange("batchCriteria", data.batchCriteria)
            }
            label="Batch Criteria"
          />

          <ERPInput
            id="marginRoundTo"
            label="Margin Round To"
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
            label="Stock Transfer Negative Stock"
            value={formState?.stockTransferNegativeStock}
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
            label="HSN Code"
            value={formState?.showHSNCodeWarning}
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
          <ERPDataCombobox
            field={{
              id: "lPPriceLessThanSellingPrice",
              valueKey: "label",
              labelKey: "label",
            }}
            id="lPPriceLessThanSellingPrice"
            label="LP PriceLess Than Selling Price"
            value={formState?.lPPriceLessThanSellingPrice}
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
            label="MRP Less Than Sales Price"
            value={formState?.mRPLessThanSalesPrice}
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
            label="Zero Multi Rate Validate"
            value={formState?.zeroMultiRateValidate}
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
          <ERPInput
            id="productImagePath"
            label="Set gift shared Path"
            data={formState}
            type="text"
            value={formState?.productImagePath}
            onChangeData={(data) =>
              handleFieldChange("productImagePath", data.productImagePath)
            }
          />
          <ERPDataCombobox
            field={{
              id: "weighingScaleBarcodeType",
              valueKey: "label",
              labelKey: "label",
            }}
            id="weighingScaleBarcodeType"
            label="Weighing Scale Barcode Type"
            value={formState?.weighingScaleBarcodeType}
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
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="flex items-center justify-between">
            <ERPCheckbox
              id="useProductImages"
              label="Use Product Images"
              data={formState}
              checked={formState?.useProductImages}
              onChangeData={(data) =>
                handleFieldChange("useProductImages", data.useProductImages)
              }
            />
            <ERPInput
              id="productImagePath"
              value={formState.productImagePath}
              data={formState}
              label=" "
              placeholder="Product Image Path"
              type="text"
              disabled={!formState?.useProductImages}
              onChangeData={(data: any) =>
                handleFieldChange("productImagePath", data.productImagePath)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <ERPCheckbox
              id="giftOnBilling"
              data={formState}
              label="Gift On Billing"
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
              value={formState?.giftOnBillingAs}
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
          <div className="flex items-center justify-between">
            <ERPCheckbox
              id="lastSystemGeneratedBarcodetrue"
              data={formState}
              label="Last System Generated Barcode"
              checked={formState?.lastSystemGeneratedBarcodetrue}
              onChangeData={(data) =>
                handleFieldChange(
                  "lastSystemGeneratedBarcodetrue",
                  data.lastSystemGeneratedBarcodetrue
                )
              }
            />
            <ERPInput
              id="lastSystemGeneratedBarcode"
              label=" "
              value={formState.lastSystemGeneratedBarcode}
              data={formState}
              noLabel={true}
              type="text"
              disabled={!formState?.lastSystemGeneratedBarcodetrue}
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
        <div className="grid grid-cols-3 gap-6">
          <ERPCheckbox
            data={formState}
            id="allowOnlyScanProductMarkedAsWeighingScaleItems"
            label="allow Only Scan Product Marked As Weighing Scale Items"
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
            label="Allow Multi rate"
            checked={formState?.allowMultirate}
            onChangeData={(data) =>
              handleFieldChange("allowMultirate", data.allowMultirate)
            }
          />
          <ERPCheckbox
            id="setQty1ForWeighingScaleItem_ValueMode"
            data={formState}
            label="Set Qty1 For Weighing ScaleItem ValueMode"
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
            label="Allow Multi Units"
            data={formState}
            checked={formState?.allowMultiUnits}
            onChangeData={(data) =>
              handleFieldChange("allowMultiUnits", data.allowMultiUnits)
            }
          />
          <ERPCheckbox
            id="stopScanningOnWrongBarcode"
            label="Stop Scanning On Wrong Barcode(POS)"
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
            label="Stop Scanning On Wrong Barcode In Sales"
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
            label="Block Qty Change Option(POS)"
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
            label="Enable Google Translation Of Product Name"
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
            label="Load Listed Product Prices"
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
            label="maintain Schemes"
            data={formState}
            checked={formState?.maintainSchemes}
            onChangeData={(data) =>
              handleFieldChange("maintainSchemes", data.maintainSchemes)
            }
          />
          <ERPCheckbox
            id="excludeSchemeProductAmountFromPrivilegeCard"
            label="Exclude Scheme Product Amount From Privilege Card"
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
            label="Include Search ItemAlias ItemName2"
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
            label="Advanced Product Searching "
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
            label="Allow Update Sales Price  From Purchase"
            data={formState}
            checked={formState?.allowUpdateSalesPriceFromPurchase}
            onChangeData={(data) =>
              handleFieldChange(
                "allowUpdateSalesPriceFromPurchase",
                data.allowUpdateSalesPriceFromPurchase
              )
            }
          />
          <ERPCheckbox
            id="allowUpdateMultiRateinPurchase"
            label="allow Update Multi Ratein Purchase"
            data={formState}
            checked={formState?.allowUpdateMultiRateinPurchase}
            onChangeData={(data) =>
              handleFieldChange(
                "allowUpdateMultiRateinPurchase",
                data.allowUpdateMultiRateinPurchase
              )
            }
          />
          <ERPCheckbox
            id="enableQtySlabOffer"
            label="Enable Qty Slab Offer"
            data={formState}
            checked={formState?.enableQtySlabOffer}
            onChangeData={(data) =>
              handleFieldChange("enableQtySlabOffer", data.enableQtySlabOffer)
            }
          />
          <ERPCheckbox
            id="setProductQtyLimitinSales"
            label="Set Product Qty Limitin Sales"
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
            label="Enable Multi FOC"
            data={formState}
            checked={formState?.enableMultiFOC}
            onChangeData={(data) =>
              handleFieldChange("enableMultiFOC", data.enableMultiFOC)
            }
          />
          <ERPCheckbox
            id="loadCustomerLastRate"
            label="Load Customer Last Sales Rate"
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
            label="Focus To Qty After Barcode"
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
            label="Allow Manual Product Selection In Sales"
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
            label="Show Rate Before Tax on Sales"
            data={formState}
            checked={formState?.showRateBeforeTax}
            onChangeData={(data) =>
              handleFieldChange("showRateBeforeTax", data.showRateBeforeTax)
            }
          />
          <ERPCheckbox
            id="loadDummyProducts"
            label="Load Dummy Products"
            data={formState}
            checked={formState?.loadDummyProducts}
            onChangeData={(data) =>
              handleFieldChange("loadDummyProducts", data.loadDummyProducts)
            }
          />
          <ERPCheckbox
            id="showPurchaseCostChangeWarning"
            label="Show Purchase Cost Change Warning"
            data={formState}
            checked={formState?.showPurchaseCostChangeWarning}
            onChangeData={(data) =>
              handleFieldChange(
                "showPurchaseCostChangeWarning",
                data.showPurchaseCostChangeWarning
              )
            }
          />
          <ERPCheckbox
            id="enableSupplierWiseItemCode"
            label="Enable Supplier Wise Item Code"
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
            label="Enable Multi Warehouse Billing"
            data={formState}
            checked={formState?.enableMultiWarehouseBilling}
            onChangeData={(data) =>
              handleFieldChange(
                "enableMultiWarehouseBilling",
                data.enableMultiWarehouseBilling
              )
            }
          />
          <ERPCheckbox
            id="usePopupWindowForItemSearch"
            label="Use Popup Window For Item Search"
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
            label="List Barcode Items In Item Lookup"
            data={formState}
            checked={formState?.listBarcodeItemsInItemLookup}
            onChangeData={(data) =>
              handleFieldChange(
                "listBarcodeItemsInItemLookup",
                data.listBarcodeItemsInItemLookup
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1  sm;grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex justify-end">
          <ERPButton
            title="Save Changes"
            variant="primary"
            disabled={isSaving}
            loading={isSaving}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

export default ApplicationSettingsProduct;
