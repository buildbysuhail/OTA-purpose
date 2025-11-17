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
import { calculateMarkup, calculateSalesPrice, isNullOrUndefinedOrEmpty, } from "../../../../../utilities/Utils";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { BusinessType } from "../../../../../enums/business-types";
import ERPProductSearch from "../../../../../components/ERPComponents/erp-searchbox";
import { toggleProductGroup, toggleUnitOfMeasure } from "../../../../../redux/slices/popup-reducer";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { ProductGroupManage } from "../../product-group/product-group-manage";
import { UnitOfMeasureManage } from "../../unit-of-meassure/unit-of-measure-manage";

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
  isView: boolean;
}> = React.memo(
  ({
    formState,
    handleFieldChange,
    getFieldProps,
    appSettings,
    handleDataChange,
    switchToMultiRatesTab,
    isView
  }) => {
    const { t } = useTranslation("inventory");
    const productNameRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);
    const productGroupRef = useRef<HTMLInputElement>(null);
    const gccProductSearchRef = useRef<HTMLInputElement>(null);
    const { getFormattedValue } = useNumberFormat();
    const userSession = useSelector((state: RootState) => state.UserSession);
    const clientSession = useSelector((state: RootState) => state.ClientSession);
    const rootState = useRootState();
    const dispatch = useDispatch();

    useEffect(() => {
      if (getFieldProps("product.manual").value) {
        productCodeRef?.current?.focus();
        productCodeRef?.current?.select();
      }
    }, [getFieldProps("product.manual").value]);

    useEffect(() => {
      const obj = getFieldProps("*") as any as productDto;
      const markupPercentage = calculateMarkup(obj.product.stdPurchasePrice ?? 0, obj.product.stdSalesPrice ?? 0, obj.taxCategoryTaxPercentage, appSettings.productsSettings.showRateBeforeTax, getFormattedValue);
      handleFieldChange("markup", markupPercentage)
    }, [])

    return (
      <div className="w-full modal-content">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col lg:flex-row flex-wrap gap-1">
            {/* <div className="flex justify-end">
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
          </div> */}
            {/* Left Section */}
            <div className="flex-1 min-w-[280px] border border-[#ccc] rounded-md p-2">
              <div className="flex flex-col sm:flex-row flex-wrap items-end gap-2">
                <div className="flex flex-1 min-w-[200px] items-center gap-2">
                  <ERPInput
                    ref={productCodeRef}
                    {...getFieldProps("product.productCode")}
                    label={t("product_code")}
                    placeholder={t("enter_product_code")}
                    required={false}
                    className="w-full"
                    disabled={getFieldProps("product.manual").value != true || isView}
                    fetching={formState?.loading !== false ? true : false}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.productCode",
                        data.product.productCode ?? ""
                      )
                    }
                  />
                  <button
                    disabled={isView}
                    className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300 flex-shrink-0"
                    onClick={async () => {
                      const nextProductCode = await api.getAsync(`${Urls.products}SelectNextProductCode`);
                      handleFieldChange(
                        "product.productCode",
                        nextProductCode
                      )
                    }}>
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full sm:w-auto">
                  <ERPCheckbox
                    disabled={isView}
                    {...getFieldProps("product.manual")}
                    label={t("manual")}
                    onChange={(data) => {
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
                    fetching={formState?.loading !== false ? true : false}
                  />

                  <ERPButton
                    title={t("create_new")}
                    variant="secondary"
                    onClick={async () => {
                      const nextProductCode = await api.getAsync(`${Urls.products}SelectNextProductCode`);
                      const data = { ...getFieldProps("*") };
                      if (data.product.productID > 0) {
                        data.product.productID = 0;
                        data.product.productCode = nextProductCode
                        handleDataChange(data);
                      }
                    }}
                    disabled={getFieldProps("product.productID")?.value === 0 || getFieldProps("product.productID") === 0 || isView}
                  />
                </div>
              </div>

              {/* {getFieldProps("product.productID")?.value} */}
              <ERPProductSearch
                disabled={isView}
                showInputSymbol={false}
                closeIfNodata={true}
                label="Product Name"
                placeholder="Product Name"
                showCheckBox={false}
                value={getFieldProps("product.productName").value}
                onChange={(e) => handleFieldChange({
                  "product.productName": e.target.value
                })}
                productDataUrl={Urls.load_product_details}
                onProductSelected={(data: any) => {
                  handleFieldChange({
                    "product.productName": data.productName
                  });
                  setTimeout(() => {
                    gccProductSearchRef.current?.focus();
                  }, 100);
                }}
                ref={gccProductSearchRef}
                onEnterKeyDown={() => {
                  productGroupRef?.current?.focus()
                }}
              />
              {/* <ERPDataCombobox
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
                // initialInputValue={getFieldProps("product.productName").value}
                // onChValue={}
                onChangeData={(data: any) => {
                  handleFieldChange({
                    "product.tmpProductID": data.value,
                    "product.productName": data.label
                  });
                }}
                // onChangeData={(data: any) => handleFieldChange("product.productName", data.productName)}
                label={t("product_name")}
                className="w-full"
                required={true}
              /> */}

              <div className="flex flex-1 min-w-[200px] items-center gap-2">
                <ERPDataCombobox
                  disabled={isView}
                  {...getFieldProps("product.productGroupID")}
                  ref={productGroupRef}
                  id="productGroupID"
                  field={{
                    id: "productGroupID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_productgroup,
                  }}
                  onChangeData={(data: any) =>
                    handleFieldChange("product.productGroupID", data.productGroupID)
                  }
                  label={t("product_group")}
                  className="w-full"
                  required={true}
                  addNewOption={true}
                  addNewOptionCobonent={{
                    title: t("product_group"),
                    popupAction: toggleProductGroup,
                    isOpen: rootState.PopupData.productGroup.isOpen || false,
                    id: rootState.PopupData.productGroup.id,
                    name: rootState.PopupData.productGroup.name,
                    closeModal: () => dispatch(toggleProductGroup({ isOpen: false })),
                    content: <ProductGroupManage />,
                  }}
                  fetching={formState?.loading !== false ? true : false}
                />

                {/* <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                    <Ellipsis className="w-4 h-4" />
                  </button> */}

              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <div className="flex flex-1 min-w-[150px] items-center gap-2">
                  <ERPDataCombobox
                    disabled={isView}
                    {...getFieldProps("product.basicUnitID")}
                    id="basicUnitID"
                    field={{
                      id: "basicUnitID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_units,
                    }}
                    onSelectItem={(data: any) => {
                      handleFieldChange({ "batch.basicUnitID": data.value, "product.basicUnitID": data.value, "product.basicUnitName": data.label })
                    }}
                    label={t("base_unit")}
                    className="w-full"
                    required={true}
                    addNewOption={true}
                    addNewOptionCobonent={{
                      title: t("base_unit"),
                      popupAction: toggleUnitOfMeasure,
                      isOpen: rootState.PopupData.unitOfMeasure.isOpen || false,
                      id: rootState.PopupData.unitOfMeasure.id,
                      name: rootState.PopupData.unitOfMeasure.name,
                      closeModal: () =>
                        dispatch(toggleUnitOfMeasure({ isOpen: false })),
                      content: <UnitOfMeasureManage />,
                    }}
                    fetching={formState?.loading !== false ? true : false}
                  />

                  {/* <button className="bg-gray-300 p-2 rounded-md mt-5 hover:shadow-md transition duration-300">
                    <Ellipsis className="w-4 h-4" />
                  </button> */}
                </div>

                <div className="flex flex-1 min-w-[150px] max-w-full sm:max-w-[150px]">
                  <ERPInput
                    disabled={isView}
                    {...getFieldProps("product.unitQty")}
                    label={t("unit_qty")}
                    placeholder=""
                    type="number"
                    required={false}
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("product.unitQty", data.product.unitQty)
                    }
                    fetching={formState?.loading !== false ? true : false}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-end gap-2">
                <ERPCheckbox
                  disabled={isView}
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
                        getFieldProps("batch.manualBarcode").value
                      )
                    ) {
                      const newBarcode = await api.getAsync(
                        `${Urls.products}SelectNextGeneratedSystemBarcode`
                      ); // Replace with actual API call
                      _data.batch.manualBarcode = String(newBarcode);
                    }
                    handleDataChange(_data);
                  }}
                  fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                  disabled={isView}
                  {...getFieldProps("batch.manualBarcode")}
                  label={t(" ")}
                  placeholder=""
                  // type="string"
                  required={false}
                  className="flex-1 min-w-[140px] max-w-full sm:max-w-[140px]"
                  onChange={(data: any) =>
                    handleFieldChange(
                      "batch.manualBarcode",
                      String(data.target.value)
                    )
                  }
                  fetching={formState?.loading !== false ? true : false}
                />

                {/* <p>{getFieldProps("product.unitQty")?.value}</p>
                <p>next</p>
                <p>{getFieldProps("batch.manualBarcode")?.value}</p> */}

                {appSettings.productsSettings.allowMultiUnits && (
                  <ERPCheckbox
                    disabled={isView}
                    {...getFieldProps("mu")}
                    label={t("mu")}
                    // onChangeData={(data: any) => handleFieldChange("product.mu", data.product.mu)}
                    onChange={(e) => handleFieldChange("mu", e.target.checked)}
                    fetching={formState?.loading !== false ? true : false}
                  />
                )}
                {appSettings.productsSettings.allowMultirate && (
                  <ERPCheckbox
                    disabled={isView}
                    {...getFieldProps("mr")}
                    label={t("mr")}
                    // onChangeData={(data: any) => handleFieldChange("product.mr", data.product.mr)}
                    onChange={(e) => handleFieldChange("mr", e.target.checked)}
                    fetching={formState?.loading !== false ? true : false}
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
                      
                      handleFieldChange(
                        "product.defaultVendorID",
                        data.defaultVendorID
                      );
                    }}
                    label={t("default_vendor")}
                    className="w-full"
                  />
                </div> */}
                {(appSettings.mainSettings?.maintainBusinessType ==
                  BusinessType.Hypermarket ||
                  appSettings.mainSettings?.maintainBusinessType ==
                  BusinessType.Supermarket) && (
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
                        fetching={formState?.loading !== false ? true : false}
                      />
                    </div>
                  )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 min-w-[280px] border border-[#ccc] rounded-md p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                <ERPInput
                  {...getFieldProps("product.stdPurchasePrice")}
                  disabled={getFieldProps("product.itemType").value === "Dummy" || isView}
                  label={t("purchase_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      { "product.stdPurchasePrice": data.product.stdPurchasePrice, "batch.stdPurchasePrice": data.product.stdPurchasePrice }
                    )
                  }
                  fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                  {...getFieldProps("product.stdSalesPrice")}
                  disabled={getFieldProps("product.itemType").value === "Dummy" || isView}
                  label={t("sales_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => {
                    const markupPercentage = calculateMarkup(
                      parseFloat((data.product.stdPurchasePrice ?? 0).toString()),
                      parseFloat((data.product.stdSalesPrice ?? 0).toString()),
                      data.taxCategoryTaxPercentage,
                      appSettings.productsSettings.showRateBeforeTax,
                      getFormattedValue
                    );
                    const prev = getFieldProps("*");
                    const _data = {
                      ...prev,
                      batch: {
                        ...prev.batch,
                        stdSalesPrice: data.product.stdSalesPrice,
                      },
                      product: {
                        ...prev.product,
                        stdSalesPrice: data.product.stdSalesPrice,
                      },
                      markup: markupPercentage,
                    };
                    handleDataChange(_data);
                  }}
                  fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                  disabled={isView}
                  {...getFieldProps("markup")}
                  label={t("markup") + "%"}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) => {
                    const stdSalesPrice = getFormattedValue(calculateSalesPrice(
                      parseFloat((data.product.stdPurchasePrice ?? 0).toString()),
                      parseFloat((data.markup ?? 0).toString()),
                      data.taxCategoryTaxPercentage,
                      appSettings.productsSettings.showRateBeforeTax
                    ), false, 4);
                    const prev = getFieldProps("*");
                    const _data = {
                      ...prev,
                      product: {
                        ...prev.product,
                        stdSalesPrice: stdSalesPrice ?? 0,
                      },
                      batch: {
                        ...prev.batch,
                        stdSalesPrice: stdSalesPrice ?? 0,
                      },
                      markup: data.markup ?? 0,
                    };
                    handleDataChange(_data);
                    
                    // const stdSalesPrice =calculateSalesPrice(data.product.stdPurchasePrice, data.markup, data.taxCategoryTaxPercentage,appSettings?.productsSettings.showRateBeforeTax)
                    // handleFieldChange("product.stdSalesPrice", stdSalesPrice)
                  }}
                  fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                  disabled={isView}
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
                  fetching={formState?.loading !== false ? true : false}
                />

                <ERPInput
                  disabled={isView}
                  {...getFieldProps("batch.msp")}
                  label={t("min_sale_price")}
                  placeholder="0.00"
                  type="number"
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("batch.msp", data.batch.msp)
                  }
                  fetching={formState?.loading !== false ? true : false}
                />

                <ERPInput
                  {...getFieldProps("batch.openingStock")}
                  disabled={getFieldProps("product.itemType").value === "Dummy" || isView}
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
                  fetching={formState?.loading !== false ? true : false}
                />

                {userSession.dbIdValue == "SEMAKA" && (
                  <>
                    <ERPInput
                      disabled={isView}
                      {...getFieldProps("batch.aPC")}
                      label={t("avg_cost")}
                      placeholder="0.00"
                      type="number"
                      required={false}
                      onChangeData={(data: any) =>
                        handleFieldChange("batch.aPC", data.batch.aPC)
                      }
                      fetching={formState?.loading !== false ? true : false}
                    />
                    <ERPInput
                      disabled={isView}
                      {...getFieldProps("batch.stock")}
                      label={t("stock")}
                      placeholder="0.00"
                      type="number"
                      required={false}
                      onChangeData={(data: any) =>
                        handleFieldChange("batch.stock", data.batch.stock)
                      }
                      fetching={formState?.loading !== false ? true : false}
                    />
                  </>
                )}
              </div>

              {appSettings.mainSettings.maintainMultilanguage__ == true && (
                <div className="mt-2">
                  <ERPInput
                    disabled={isView}
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
                    fetching={formState?.loading !== false ? true : false}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-1 mt-2">
                <div className="flex items-center">
                  <ERPCheckbox
                    disabled={isView}
                    {...getFieldProps("batchCriteria")}
                    label={t("batch_criteria")}
                    onChange={(data) =>
                      handleFieldChange("batchCriteria", data.target.checked)
                    }
                    fetching={formState?.loading !== false ? true : false}
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
                    enableClearOption={false}
                    className="w-full"
                    disabled={getFieldProps("batchCriteria").value != true || isView}
                    noLabel={true}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "product.batchCriteria",
                        data.batchCriteria
                      )
                    }
                    fetching={formState?.loading !== false ? true : false}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-2">
                <div className="flex-1 min-w-[200px]">
                  <ERPDataCombobox
                    disabled={isView}
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
                    fetching={formState?.loading !== false ? true : false}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <ERPDataCombobox
                    disabled={isView}
                    {...getFieldProps("product.taxCategoryID")}
                    id="taxCategoryID"
                    field={{
                      id: "taxCategoryID",
                      valueKey: "id",
                      labelKey: "name",
                      nameKey: "alias",
                      getListUrl: Urls.data_taxCategory,
                    }}
                    onSelectItem={(data: any) => handleFieldChange({ "product.taxCategoryID": data.value, "taxCategoryTaxPercentage": data.name })}
                    label={t("tax_category")}
                    className="w-full"
                    fetching={formState?.loading !== false ? true : false}
                  />
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap items-end gap-4 w-full sm:w-auto">
                  {getFieldProps("product.itemType").value == "KIT" && (
                    <ERPButton
                      title={t("kit")}
                      disabled={isView}
                      variant="secondary"
                      className="w-full sm:w-auto"
                    />
                  )}
                  <ERPCheckbox
                    {...getFieldProps("details")}
                    label={t("details")}
                    disabled={isView}
                    onChange={(data) => handleFieldChange("details", data.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ProductManageGcc;
