import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Ellipsis } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import { APIClient } from "../../../../../helpers/api-client";
import {
  calculateMarkup,
  calculateSalesPrice,
  isNullOrUndefinedOrEmpty,
} from "../../../../../utilities/Utils";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { BusinessType } from "../../../../../enums/business-types";
const api = new APIClient();
export const ProductManageGcc: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
  handleDataChange: (value: any) => void;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;
  getFieldProps: (fieldId: string, type?: string) => FormField | any;
  switchToMultiRatesTab?: () => void; // Add new prop
}> = React.memo(
  ({
    formState,
    handleFieldChange,
    getFieldProps,
    appSettings,
    handleDataChange,
    switchToMultiRatesTab
  }) => {
    const { t } = useTranslation("inventory");
    const productNameRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);
    const { getFormattedValue } = useNumberFormat();
    const userSession = useSelector((state: RootState) => state.UserSession);
    const clientSession = useSelector(
      (state: RootState) => state.ClientSession
    );
    useEffect(() => {
      if (getFieldProps("product.manual").value) {
        productCodeRef?.current?.focus();
        productCodeRef?.current?.select();
      }
    }, [getFieldProps("product.manual").value]);
    // useEffect(() => {
    //   const product = getFieldProps("product").value;
    //   const markupPercentage = calculateMarkup(product.stdPurchasePrice??0, product.stdSalesPrice??0,1,appSettings.productsSettings.showRateBeforeTax, getFormattedValue);
    //   handleFieldChange("markup", markupPercentage)
    // },[getFieldProps("product.stdSalesPrice")])

    return (
      <div className="w-full modal-content">
        <div className="flex flex-col gap-1">
          <div className="flex justify-end">
            <ERPInput
              {...getFieldProps("barcode")}
              label={t("barcode")}
              placeholder={t("barcode")}
              disableEnterNavigation
              onKeyDown={async (e: any) => {
                const barcode = e.target.value;
                if (e.key === "Enter" && barcode != null && barcode != "") {
                  try {
                    const data = await api.getAsync(
                      `${Urls.products}ByBarcode/${barcode}`
                    );

                    handleDataChange(data);
                  } catch (error) {
                    console.error("API call failed", error);
                  }
                }
              }}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("barcode", data.barcode)
              }
            />
          </div>

          <div className="flex flex-wrap gap-1">
            <div className="flex-1 min-w-[300px] border border-[#ccc] rounded-md p-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex flex-1 min-w-[200px] items-center gap-2">
                  <ERPInput
                    ref={productCodeRef}
                    {...getFieldProps("product.productCode")}
                    label={t("product_code")}
                    placeholder={t("enter_product_code")}
                    required={false}
                    className="w-full"
                    disabled={getFieldProps("product.manual").value != true}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.productCode",
                        data.product.productCode??""
                      )
                    }
                  />

                  <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <ERPCheckbox
                    {...getFieldProps("product.manual")}
                    label={t("manual")}
                    onChange={(data) => {
                      debugger;
                      if (data.target.checked == true) {
                        productCodeRef?.current?.focus();
                        productCodeRef?.current?.select();
                      } else {
                        productNameRef?.current?.focus();
                        productNameRef?.current?.select();
                      }
                      handleFieldChange("product.manual", data.target.checked);
                    }}
                    className="flex"
                  />

                  <ERPButton
                    title={t("create_new")}
                    variant="secondary"
                    className="mt-[15px]"
                    onClick={() => {
                      const data = { ...getFieldProps("*") };
                      if (data.product.productID > 0) {
                        data.product.productID = 0;
                        handleDataChange(data);
                      }
                    }}
                    disabled={getFieldProps("product.productID")?.value === 0 || getFieldProps("product.productID") === 0}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex flex-1 min-w-[200px] items-center gap-2">
                {getFieldProps("product.productID")?.value}
                 <ERPDataCombobox
                              ref={productNameRef}
                                {...getFieldProps("product.productID")}
                                id="productName"
                                field={{
                                  id: "productName",
                                  valueKey: "id",
                                  labelKey: "name",
                                  getListUrl: Urls.data_products
                                }}
                                onTextChange={(data: any) => handleFieldChange("product.productName", data)}
                                // onChangeData={(data: any) => handleFieldChange("product.productName", data.productName)}
                                label={t("product_name")}
                                className="w-full"
                                required={true}
                              />

                  <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-1 min-w-[200px] items-center gap-2">
                  <ERPDataCombobox
                    {...getFieldProps("product.productGroupID")}
                    id="productGroupID"
                    field={{
                      id: "productGroupID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_productgroup,
                    }}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.productGroupID",
                        data.productGroupID
                      )
                    }
                    label={t("product_group")}
                    className="w-full"
                    required={true}
                  />

                  <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex flex-1 min-w-[200px] items-center gap-2">
                  <ERPDataCombobox
                    {...getFieldProps("product.basicUnitID")}
                    id="basicUnitID"
                    field={{
                      id: "basicUnitID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_units,
                    }}
                    onChangeData={(data: any) =>
                      handleFieldChange({"batch.basicUnitID": data.value,"product.basicUnitID": data.value, "product.basicUnitName": data.label})
                    }
                    label={t("base_unit")}
                    className="w-full"
                    required={true}
                  />

                  <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-1 min-w-[200px]">
                  <ERPInput
                    {...getFieldProps("product.unitQty")}
                    label={t("unit_qty")}
                    placeholder=""
                    type="number"
                    required={false}
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("product.unitQty", data.product.unitQty)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <ERPCheckbox
                  {...getFieldProps("upcBarcode")}
                  label={t("upc_barcode")}
                  // onChangeData={(data: any) => handleFieldChange("product.upcBarcode", data.product.upcBarcode)}
                  onChange={async (e) => {
                    const prev = getFieldProps("*");
                    const _data = {
                      ...prev,
                    };
                    _data.upcBarcode = e.target.checked;
                    if (
                      e.target.checked == true &&
                      isNullOrUndefinedOrEmpty(
                        getFieldProps("product.autoBarcode").value
                      )
                    ) {
                      const newBarcode = await api.getAsync(
                        `${Urls.products}SelectNextGeneratedSystemBarcode`
                      ); // Replace with actual API call
                      _data.batch.manualBarcode = newBarcode;
                    }
                    handleDataChange(_data);
                  }}
                />
                <ERPInput
                  {...getFieldProps("batch.manualBarcode")}
                  label={t(" ")}
                  placeholder=""
                  type="number"
                  required={false}
                  className="flex-1 min-w-[140px]"
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      "batch.manualBarcode",
                      data.product.unitQty
                    )
                  }
                />

                {appSettings.productsSettings.allowMultiUnits && (
                  <ERPCheckbox
                    {...getFieldProps("mu")}
                    label={t("mu")}
                    // onChangeData={(data: any) => handleFieldChange("product.mu", data.product.mu)}
                    onChange={(e) => handleFieldChange("mu", e.target.checked)}
                  />
                )}
                {appSettings.productsSettings.allowMultirate && (
                  <ERPCheckbox
                    {...getFieldProps("mr")}
                    label={t("mr")}
                    // onChangeData={(data: any) => handleFieldChange("product.mr", data.product.mr)}
                    onChange={(e) => handleFieldChange("mr", e.target.checked)}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {/* <div className="flex flex-1 min-w-[200px]">
                  <ERPDataCombobox
                    {...getFieldProps("product.defaultVendorID")}
                    id="defaultVendorID"
                    field={{
                      id: "defaultVendorID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_acc_ledgers,
                    }}
                    onChangeData={(data: any) => {
                      debugger;
                      handleFieldChange(
                        "product.defaultVendorID",
                        data.defaultVendorID
                      );
                    }}
                    label={t("default_vendor")}
                    className="w-full"
                  />
                </div> */}

                {appSettings.mainSettings?.maintainBusinessType ==
                  BusinessType.Hypermarket ||
                  (appSettings.mainSettings?.maintainBusinessType ==
                    BusinessType.Supermarket && (
                    <div className="flex flex-1 min-w-[200px] items-center">
                      <ERPCheckbox
                        {...getFieldProps("product.isWeighingScale")}
                        label={t("is_weighing_scale_item")}
                        onChange={(data) => {
                          handleFieldChange(
                            "product.isWeighingScale",
                            data.target.checked
                          );
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex-1 min-w-[300px] border border-[#ccc] rounded-md p-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex-1 min-w-[120px]">
                  <ERPInput
                    {...getFieldProps("product.stdPurchasePrice")}
                    disabled={
                      getFieldProps("product.itemType").value === "Dummy"
                    }
                    label={t("purchase_price")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.stdPurchasePrice",
                        data.product.stdPurchasePrice
                      )
                    }
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <ERPInput
                    {...getFieldProps("product.stdSalesPrice")}
                    disabled={
                      getFieldProps("product.itemType").value === "Dummy"
                    }
                    label={t("sales_price")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data: any) => {
                      debugger;
                      const markupPercentage = calculateMarkup(
                        parseFloat(
                          (data.product.stdPurchasePrice ?? 0).toString()
                        ),
                        parseFloat(
                          (data.product.stdSalesPrice ?? 0).toString()
                        ),
                        data.taxCategoryTaxPercentage,
                        appSettings.productsSettings.showRateBeforeTax,
                        getFormattedValue
                      );
                      const prev = getFieldProps("*");
                      const _data = {
                        ...prev,
                        product: {
                          ...prev.product,
                          stdSalesPrice: data.product.stdSalesPrice,
                        },
                        markup: markupPercentage,
                      };

                      handleDataChange(_data);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <ERPInput
                    {...getFieldProps("markup")}
                    label={t("markup") + "%"}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data: any) => {
                      debugger;
                      const stdSalesPrice = calculateSalesPrice(
                        parseFloat(
                          (data.product.stdPurchasePrice ?? 0).toString()
                        ),
                        parseFloat((data.markup ?? 0).toString()),
                        data.taxCategoryTaxPercentage,
                        appSettings.productsSettings.showRateBeforeTax
                      );
                      const prev = getFieldProps("*");
                      const _data = {
                        ...prev,
                        product: {
                          ...prev.product,
                          stdSalesPrice: stdSalesPrice ?? 0,
                        },
                        markup: data.markup ?? 0,
                      };

                      handleDataChange(_data);
                      // const stdSalesPrice =calculateSalesPrice(data.product.stdPurchasePrice, data.markup, data.taxCategoryTaxPercentage,appSettings?.productsSettings.showRateBeforeTax)
                      // handleFieldChange("product.stdSalesPrice", stdSalesPrice)
                    }}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <ERPInput
                    {...getFieldProps("batch.displayCost")}
                    label={t("display_cost")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "batch.displayCost",
                        data.batch.displayCost
                      )
                    }
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <ERPInput
                    {...getFieldProps("batch.msp")}
                    label={t("min_sale_price")}
                    placeholder="0.00"
                    type="number"
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange("batch.msp", data.batch.msp)
                    }
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
            <ERPInput
              {...getFieldProps("batch.openingStock")}
              disabled={getFieldProps("product.itemType").value === "Dummy"}
              label={t("op_stock")}
              placeholder="0.00"
              type="number"
              required={false}

              onChangeData={(data: any) =>
                handleFieldChange("batch.openingStock", data.batch.openingStock)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (
                  e.key === "Enter" &&
                  getFieldProps("mr")?.value === true &&
                  switchToMultiRatesTab
                ) {
                  console.log("Enter pressed, calling switchToMultiRatesTab");
                  e.preventDefault();
                  switchToMultiRatesTab();
                }
              }}
              disableEnterNavigation
            />
          </div>

                {userSession.dbIdValue == "SEMAKA" && (
                  <>
                    <div className="flex-1 min-w-[120px]">
                      <ERPInput
                        {...getFieldProps("batch.aPC")}
                        label={t("avg_cost")}
                        placeholder="0.00"
                        type="number"
                        required={false}
                        onChangeData={(data: any) =>
                          handleFieldChange("batch.aPC", data.batch.aPC)
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <ERPInput
                        {...getFieldProps("batch.stock")}
                        label={t("stock")}
                        placeholder="0.00"
                        type="number"
                        required={false}
                        onChangeData={(data: any) =>
                          handleFieldChange("batch.stock", data.batch.stock)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              {appSettings.mainSettings.maintainMultilanguage__ == true && (
                <div className="mb-3">
                  <ERPInput
                    {...getFieldProps("product.secondLanguage")}
                    label={t("product_(arabic)")}
                    placeholder=""
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.secondLanguage",
                        data.product.secondLanguage
                      )
                    }
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1 mb-3">
                <div className="flex items-center">
                  <ERPCheckbox
                    {...getFieldProps("batchCriteria")}
                    label={t("batch_criteria")}
                    onChange={(data) =>
                      handleFieldChange("batchCriteria", data.target.checked)
                    }
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <ERPDataCombobox
                    {...getFieldProps("product.batchCriteria")}
                    id="batchCriteria"
                    field={{
                      id: "batchCriteria",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_batchcriteria,
                    }}
                    className="w-full"
                    disabled={getFieldProps("batchCriteria").value != true}
                    noLabel={true}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.batchCriteria",
                        data.batchCriteria
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-3">
                <div className="flex-1 min-w-[200px]">
                  <ERPDataCombobox
                    {...getFieldProps("product.itemType")}
                    id="itemType"
                    field={{
                      id: "itemType",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    onChangeData={(data: any) => {
                      const prev = getFieldProps("*");
                      const _data: productDto = {
                        ...prev,
                      };
                      _data.product.itemType = data.itemType;
                      if (data.itemType == "Dummy") {
                        _data.product.stdPurchasePrice = 0;
                        _data.product.stdSalesPrice = 0;
                      }
                      handleDataChange(_data);
                    }}
                    label={t("product_type")}
                    options={[
                      { value: "Inventory", label: "Inventory" },
                      { value: "Dummy", label: "Dummy" },
                      { value: "Service", label: "Service" },
                      { value: "Discount", label: "Discount" },
                      { value: "Other", label: "Other" },
                      { value: "Fixed Asset", label: "Fixed Asset" },
                    ]}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <ERPDataCombobox
                    {...getFieldProps("product.taxCategoryID")}
                    id="taxCategoryID"
                    field={{
                      id: "taxCategoryID",
                      valueKey: "id",
                      labelKey: "name",
                      nameKey: "alias",
                      getListUrl: Urls.data_taxCategory,
                    }}
                    onChange={(data: any) => {
                      const prev = getFieldProps("*");
                      const _data = {
                        ...prev,
                        product: { ...prev.product, taxCategoryID: data.value },
                        taxCategoryTaxPercentage: parseFloat(data.name),
                      };
                      handleDataChange(_data);
                    }}
                    label={t("tax_category")}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {getFieldProps("product.itemType").value == "KIT" && (
                  <ERPButton title={t("kit")} variant="secondary" />
                )}
                <ERPCheckbox
                  {...getFieldProps("details")}
                  label={t("details")}
                  onChange={(data) =>
                    handleFieldChange("details", data.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ProductManageGcc;
