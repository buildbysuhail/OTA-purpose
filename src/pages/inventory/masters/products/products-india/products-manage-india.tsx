import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { RefreshCcw, Plus } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import { DetailsDto, PathValue, productDto, ProductFieldPath } from "../products-type";
import { calculateMarkup, calculateSalesPrice, isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { BusinessType } from "../../../../../enums/business-types";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();

export const ProductManageIndia: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
  handleDataChange: (value: any) => void;
  handleFieldChange: <Path extends ProductFieldPath>(
      fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
      value?: PathValue<productDto, Path>
    ) => void;

  getFieldProps: (fieldId: string, type?: any) => FormField | any;
}> = React.memo(({ formState, handleFieldChange, getFieldProps, appSettings, handleDataChange }) => {

  const clientSession = useSelector((state: RootState) => state.ClientSession)
        const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation("inventory");
    const productNameRef = useRef<HTMLInputElement>(null);
    const salesPriceRef = useRef<HTMLInputElement>(null);
    function handlePriceValidation() {
      try {
        debugger;
        const obj = getFieldProps("*") as productDto;
        const showWarning = appSettings.inventorySettings.showRateWarning.toUpperCase();
        const setFocus = () => {
          if (salesPriceRef.current) {
            salesPriceRef.current.focus();
          }
        };
        if (showWarning === "WARN") {
          if ((obj.product.stdPurchasePrice??0) > (obj.product.stdSalesPrice??0)) {
            ERPAlert.show(
              {
                text:"Sales Price is less than Purchase Price. Do you want to continue?",
              title:"Warning",
              type:"warn",
              onCancel: setFocus
              }
            )
          }
        } else if (showWarning === "BLOCK" && (obj.product.stdPurchasePrice??0) > (obj.product.stdSalesPrice??0)) {
          setFocus();
        }
    
        if (appSettings.productsSettings.allowMultirate) {
          if (  obj.product.basicUnitID &&
            obj.product.stdSalesPrice !== undefined &&
            obj.product.stdSalesPrice > 0) {
              ERPAlert.show(
                {
                  text:`Multi Rates Exist! Update Multi Rates.", "Multi Rates", "info`,
                title:"Warning",
                type:"warn",
                onCancel: setFocus
                }
              )
              // owMessageBox("Multi Rates Exist! Update Multi Rates.", "Multi Rates", "info");
    
            if (obj.prices.length === 0) {
              try {
                // loadMultiRateToGrid();
              } catch (err: any) {
                console.error(err.message);
              }
            }
    
            // setFocus("mrp");
          }
        }
    
        // mrpSaleRateCompare(mrp, sales, "mrp");
      } catch (err: any) {
        ERPAlert.show(
          {
          text:`${err.message},"Error",`,
          title:"Error",
          icon: 'error',
          type:"error",
          // onCancel() {
          //   setFocus("salesPrice");     
          // },
          }
        )
   
      }
    }

useEffect(() => {
  productNameRef?.current?.focus()
  productNameRef?.current?.select()
},[productNameRef])
  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        <div className="flex justify-end">
          <ERPInput
            {...getFieldProps("barcode")}
            label={t("barcode")}
            placeholder={t("barcode")}
            required={false}
            disableEnterNavigation
            onKeyDown={async (e: any) => {
              const barcode = e.target.value;
            if (e.key === "Enter" && barcode != null && barcode != "") {
              try {
                  const data = await api.getAsync(`${Urls.products}ByBarcode/${barcode}`);
                  
                  handleDataChange(data);
                  
                } catch (error) {
                  console.error("API call failed", error);
                }
              }
            }}
            onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
            className="w-full md:w-1/3"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="flex-1 min-w-[270px] border border-gray-300 rounded-md p-3">
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <ERPInput
                  {...getFieldProps("product.productCode")}
                  label={t("product_code")}
                  placeholder={t("enter_product_code")}
                  required={false}
                  className="w-full"
                  disabled={!getFieldProps("product.manual").value}
                  onChangeData={(data: any) => handleFieldChange("product.productCode", data.product.productCode??"")}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <ERPCheckbox
                  {...getFieldProps("product.manual")}
                  label={t("manual")}
                  onChange={(e) => handleFieldChange('product.manual', e.target.checked)}
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
{/* {getFieldProps("product.productId").value} */}
            <div className="flex items-center gap-1 mb-3">
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
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-1">
                <ERPDataCombobox
                  {...getFieldProps("product.productCategoryID")}
                  field={{
                    id: "productCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_productcategory
                  }}
                  onChangeData={(data: any) => {
                    debugger;
                    handleFieldChange("product.productCategoryID", data.product.productCategoryID)
                  }}
                  label={t("product_category")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.productGroupID")}
                  field={{
                    id: "productGroupID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_productgroup
                  }}
                  onChange={async (data: any) => {
                    debugger;
                    const prev = getFieldProps("*")
                    const sds = await api.getAsync(`${Urls.group_category__}${data.value}`);
                    const  _data = {...prev,
                      product: {...prev.product, 
                        productGroupID: data.value,
                        groupCategoryID: sds?.GroupCategoryID,
                        sectionID: sds?.SectionID,
                        } 

                    };
                    handleDataChange(_data)
                  }
                  }
                  label={t("product_group")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              <ERPDataCombobox
                {...getFieldProps("product.groupCategoryID")}
                disabled
                id="groupCategoryID"
                field={{
                  id: "groupCategoryID",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_groupcategory
                }}
                onChangeData={(data: any) => handleFieldChange("product.groupCategoryID", data.groupCategory)}
                label={t("group_category")}
                className="flex-1 min-w-[240px]"
              />

              <ERPDataCombobox
                {...getFieldProps("product.sectionID")}
                disabled
                field={{
                  id: "section",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_sections
                }}
                onChangeData={(data: any) => handleFieldChange("product.sectionID", data.sectionID)}
                label={t("section")}
                className="flex-1 min-w-[240px]"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.basicUnitID")}
                  field={{
                    id: "basicUnitID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_units,
                  }}
                  onChangeData={(data: any) => {
                    debugger;
                    handleFieldChange("product.basicUnitID", data.basicUnitID)
                  }}
                  label={t("base_unit")}
                  className="w-full"
                  required={true}
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <ERPInput
                {...getFieldProps("product.unitQty")}
                label={t("unit_qty")}
                placeholder=""
                type="number"
                required={false}
                className="flex-1 min-w-[140px]"
                onChangeData={(data: any) => handleFieldChange("product.unitQty", data.product.unitQty)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <ERPCheckbox
                {...getFieldProps("upcBarcode")}
                label={t("upc_barcode")}
                // onChangeData={(data: any) => handleFieldChange("product.upcBarcode", data.product.upcBarcode)}
                onChange={async(e) => {
                  const prev = getFieldProps("*");
                  const _data = {
                    ...prev
                  }
                  _data.upcBarcode = e.target.checked
                  if (e.target.checked == true && isNullOrUndefinedOrEmpty(getFieldProps("product.autoBarcode").value)) {
                    const newBarcode =
                    await api.getAsync(`${Urls.products}SelectNextGeneratedSystemBarcode`) // Replace with actual API call
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
                onChangeData={(data: any) => handleFieldChange("batch.manualBarcode", data.product.unitQty)}
              />
{appSettings.productsSettings.allowMultiUnits &&
              <ERPCheckbox
                {...getFieldProps("mu")}
                label={t("mu")}
                // onChangeData={(data: any) => handleFieldChange("product.mu", data.product.mu)}
                onChange={(e) => handleFieldChange('mu', e.target.checked)}
              />
}
{appSettings.productsSettings.allowMultirate && 
              <ERPCheckbox
                {...getFieldProps("mr")}
                label={t("mr")}
                // onChangeData={(data: any) => handleFieldChange("product.mr", data.product.mr)}
                onChange={(e) => handleFieldChange('mr', e.target.checked)}
              />
}
            </div>

            {/* Tax Category and Weighing Scale */}
            <div className="flex flex-wrap gap-1">
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <ERPDataCombobox
                  {...getFieldProps("product.taxCategoryID")}
                  field={{
                    id: "taxCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_taxCategory,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.taxCategoryID", data.taxCategoryID)}
                  label={t("tax_category")}
                  className="w-full"
                />

                <button className="bg-gray-300 text-black p-2 rounded-full mt-5 hover:shadow-md hover:text-white hover:bg-black hover:font-bold transition duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-1 min-w-[240px] items-center">
                { appSettings.mainSettings?.maintainBusinessType != BusinessType.Opticals &&
                 appSettings.mainSettings?.maintainBusinessType != BusinessType.Distribution && 
                 appSettings.mainSettings?.maintainBusinessType != BusinessType.Textiles && 
                 <ERPCheckbox
                                    {...getFieldProps("product.isWeighingScale")}
                                    label={t("is_weighing_scale_item")}
                                    onChange={(data) => {
               
                                      const prev = getFieldProps("*");
                                      const _data = {
                                        ...prev,
                                        product: {
                                          ...prev.product,
                                          isWeighingScale: data.target.checked,
                                        },
                                      };
                                      if (data.target.checked == true) {
                                        _data.product.batchCriteria = "NB";
                                      }
                                      handleDataChange(_data);
                                    }}
                                  />
}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[270px] border border-gray-300 rounded-md p-4">
            <div className="flex flex-wrap gap-1 mb-3">
              <ERPInput
                {...getFieldProps("product.stdPurchasePrice")}
                label={t("purchase_price")}
                disabled={getFieldProps("product.itemType").value === "Dummy"}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => {
                  handleFieldChange("product.stdPurchasePrice", data.product.stdPurchasePrice)
                }}
              />

              <ERPInput
                                {...getFieldProps("product.stdSalesPrice")}
                                label={t("sales_price")}
                                disabled={getFieldProps("product.itemType").value === "Dummy"}
                                placeholder="0.00"
                                type="number"
                                ref={salesPriceRef }
                                required={false}
                                onChangeData={(data: any) => {
                                  debugger;
                                  const markupPercentage = calculateMarkup(parseFloat((data.product.stdPurchasePrice??0).toString())
                                    , parseFloat((data.product.stdSalesPrice??0).toString()),data.taxCategoryTaxPercentage,appSettings.productsSettings.showRateBeforeTax, getFormattedValue);
                                    const prev = getFieldProps("*")
                                  const  _data = {...prev,
                                    product: {...prev.product, 
                                      stdSalesPrice: data.product.stdSalesPrice,
                                      },
                                      markup: markupPercentage                   
                                  };
                                  
              
                                  handleDataChange(_data)
                                }
                              }
                              onBlur={handlePriceValidation}
                              />

               <ERPInput
                                {...getFieldProps("markup")}
                                label={t("markup") + "%"}
                                placeholder="0.00"
                                type="number"
                                required={false}
                                onChangeData={(data: any) => { 
                                  debugger; 
                                  const stdSalesPrice = calculateSalesPrice(parseFloat((data.product.stdPurchasePrice??0).toString()),
                                  parseFloat((data.markup??0).toString())
                                    , data.taxCategoryTaxPercentage,appSettings.productsSettings.showRateBeforeTax);
                                    const prev = getFieldProps("*")
                                  const  _data = {...prev,
                                    product: {...prev.product, 
                                      stdSalesPrice: stdSalesPrice??0,
                                      }   ,
                                      markup: data.markup??0                   
                                  };
                                  
              
                                  handleDataChange(_data)               
                                  // const stdSalesPrice =calculateSalesPrice(data.product.stdPurchasePrice, data.markup, data.taxCategoryTaxPercentage,appSettings?.productsSettings.showRateBeforeTax)
                                  // handleFieldChange("product.stdSalesPrice", stdSalesPrice)
                                }}
                              />

              <ERPInput
                {...getFieldProps("batch.displayCost")}
                label={t("display_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.displayCost", data.batch.displayCost)}
              />

              <ERPInput
                {...getFieldProps("product.mrp")}
                label={t("mrp")}
                disabled={getFieldProps("product.itemType").value === "Dummy"}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("product.mrp", data.product.mrp)}
              />
{ getFieldProps("config.showOpeningStock").value == true && 
              <ERPInput
                {...getFieldProps("batch.openingStock")}
                disabled={getFieldProps("product.itemType").value === "Dummy"}
                label={t("op_stock")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.openingStock", data.batch.openingStock)}
              />
}
              <ERPInput
                {...getFieldProps("batch.msp")}
                label={t("msp")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.msp", data.batch.msp)}
              />

              <ERPInput
                {...getFieldProps("batch.stock")}
                label={t("stock")}
                placeholder="0.00"
                type="number"
                required={false}
                className="flex-1 min-w-[120px]"
                onChangeData={(data: any) => handleFieldChange("batch.stock", data.batch.stock)}
              />
            </div>
            {appSettings.mainSettings.maintainMultilanguage__ == true &&
            <div className="mb-3">
              <ERPInput
              disabled
                {...getFieldProps("product.secondLanguage")}
                label={t("foreign_language")}
                placeholder=""
                required={false}
                className="w-full"
                onChangeData={(data: any) => handleFieldChange("product.secondLanguage", data.product.secondLanguage)}
              />
            </div>
}
            <div className="flex flex-wrap items-center gap-1 mb-3">
              <div className="flex items-center flex-shrink-0">
                <ERPCheckbox
                  {...getFieldProps("product.batchCriteria")}
                  label={t("batch_criteria")}
                  onChange={(e) => handleFieldChange('batchCriteria', e.target.checked)}
                  className="flex-1 min-w-[120px]"
                // onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.product.batchCriteria)}
                />
              </div>

              <ERPDataCombobox
                {...getFieldProps("product.batchCriteria")}
                field={{
                  id: "batchCriteria",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_batchcriteria,
                }}
                disabled={getFieldProps("batchCriteria").value != true}
                className="flex-1 min-w-[120px]"
                noLabel={true}
                onChangeData={(data: any) => handleFieldChange("product.batchCriteria", data.batchCriteria)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3 items-end">
              <ERPDataCombobox
                {...getFieldProps("product.itemType")}
                id="itemType"
                field={{
                  id: "itemType",
                  required: true,
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
                            _data.product.manual = true;
                          }
                          handleDataChange(_data);
                        }}
                label={t("product_type")}
                className="flex-1 min-w-[240px]"
                options={[
                  { value: "Inventory", label: "Inventory" },
                  { value: "Dummy", label: "Dummy" },
                  { value: "Service", label: "Service" },
                  { value: "Discount", label: "Discount" },
                  { value: "Other", label: "Other" },
                  { value: "Fixed Asset", label: "Fixed Asset" },
                ]}
              />

              <div className="flex flex-wrap items-center gap-2">
              {getFieldProps("product.itemType").value == "KIT" &&
                <ERPButton
                  title={t("kit")}
                  variant="secondary"
                />
              }
                <ERPCheckbox
                  {...getFieldProps("product.details")}
                  label={t("details")}
                  onChange={(e) => handleFieldChange('details', e.target.checked)}
                // onChangeData={(data: any) => handleFieldChange("product.details", data.product.details)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {/* <ERPDataCombobox
                {...getFieldProps("product.defaultVendorID")}
                field={{
                  id: "defaultVendorID",
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_acc_ledgers,
                }}
                className="flex-1 min-w-[240px]"
                onChangeData={(data: any) => handleFieldChange("product.defaultVendorID", data.defaultVendorID)}
                label={t("default_vendor")}
              /> */}

              {/* <ERPInput
                {...getFieldProps("batch.aPC")}
                label={t("avg_cost")}
                placeholder="0.00"
                type="number"
                required={false}
                disabled={true}
                onChangeData={(data: any) => handleFieldChange("batch.aPC", data.batch.aPC)}
                className="flex-1 min-w-[140px]"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductManageIndia;
