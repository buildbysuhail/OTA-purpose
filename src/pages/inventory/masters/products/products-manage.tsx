import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ERPFormButtons from "../../../../components/ERPComponents/erp-form-buttons";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleProducts } from "../../../../redux/slices/popup-reducer";
import { PathValue, productDto, ProductFieldPath } from "./products-type";
import initialProductData from "./products-data";
import { Countries } from "../../../../redux/slices/user-session/user-branches-reducer";
import ProductDetailsIndia from "./products-india/product-details-india";
import ProductManageIndia from "./products-india/products-manage-india";
import ProductManageGcc from "./products-gcc/products-manage-gcc";
import ProductDetailsGcc from "./products-gcc/product-details-gcc";
import ProductOthersIndia from "./products-india/product-others-india";
import ProductOthersGcc from "./products-gcc/product-others-gcc";
import ProductNotesGcc from "./products-gcc/product-notes-gcc";
import ProductMultiUnitsGCC, { ProductMultiUnitsGccRef } from "./products-gcc/product-multi-units-gcc";
import NutritionFactsIndia from "./products-india/product-nutrition-facts-india";
import SearchCommon from "./common/product-search";
import ImageCommon from "./common/product-image";
import SalesCommon from "./common/product-sales";
import PurchaseCommon from "./common/product-purchase";
import StockCommon from "./common/product-stock";
import SuppliersCommon from "./common/product-suppliers";
import PromotionCommon from "./common/product-promotion";
import { RootState } from "../../../../redux/store";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import moment from "moment";
import MultiRates from "./products-india/product-multi-rates-india";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import {
  calculateMarkup,
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../utilities/Utils";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { customJsonParse } from "../../../../utilities/jsonConverter";
import ProductMultiUnitsIndia, {
  ProductMultiUnitsIndiaRef,
} from "./products-india/product-multi-units-india";
import { handleResponse } from "../../../../utilities/HandleResponse";

const api = new APIClient();
export const ProductMaster: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const {
    isEdit,
    handleSubmit,
    handleClear,
    isLoading,
    handleClose,
    formState,
    handleFieldChange,
    getFieldProps,
    handleDataChange,
  } = useFormManager<productDto>({
    url: Urls.products,
    onClose: useCallback(
      () =>
        dispatch(toggleProducts({ isOpen: false, key: null, reload: false })),
      [dispatch]
    ),
    onSuccess: useCallback(
      () =>
        dispatch(toggleProducts({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.products?.key,
    useApiClient: true,
    keyField: "productID",
    loadInitialData: false,
    initialData: {
      data: initialProductData,
    },
  });
  const [activeTab, setActiveTab] = React.useState(0);

  const productMultiUnitsIndiaRef = useRef<ProductMultiUnitsIndiaRef>(null);
  const productMultiUnitsGccRef = useRef<ProductMultiUnitsGccRef>(null);
  const handleTabChange = async (index: number) => {
    setActiveTab(index);
    debugger;
      const tabs = getTabs();
      const multiRatesIndex = tabs?.findIndex(
        (tab) => tab === t("multi_rates")
      );
      if (
        multiRatesIndex !== undefined &&
        multiRatesIndex !== -1 &&
        multiRatesIndex == index
      ) {
        const obj = getFieldProps("*") as productDto;
        debugger;
        if (
          appSettings?.productsSettings?.allowMultirate &&
          obj.prices &&
          ((obj.prices.length == 0  && (obj.product.productID??0) > 0) || ((obj.product.productID??0) <= 0))
        ) {
          if(productMultiUnitsIndiaRef.current) {
            const rates =
            await productMultiUnitsIndiaRef.current.loadMultiRateToGrid(
              obj,
              obj.units
            );
          handleDataChange({ ...obj, prices: rates });
          }
          if(productMultiUnitsGccRef.current) {
            
            const rates =
            await productMultiUnitsGccRef.current.loadMultiRateToGrid(
              obj,
              obj.units, 
              (obj.product.productID??0) > 0 ? getFieldProps("prices").value : []
            );
          handleDataChange({ ...obj, prices: rates });
          }
        }
      }
  };

  const updatePrice = async () => {
    const obj = getFieldProps("*") as productDto;
    debugger;
    debugger;
    if (!isNullOrUndefinedOrEmpty(obj.product.autoBarcode)) {
      const payload = {
        units: obj.units,
        prices: obj.prices,
        salesPrice: obj.product?.stdSalesPrice,
        minSalesPrice: obj.batch.msp
      }

      const res = await api.postAsync(`${Urls.products}updateProductPrice`,payload);
      handleResponse(res);
    }
  };
  // Callback to switch to Multi Rates tab
  const switchToMultiRatesTab = useCallback(() => {
    debugger;
    const tabs = getTabs();
    const multiRatesIndex = tabs?.findIndex((tab) => tab === t("multi_rates"));
    if (multiRatesIndex !== undefined && multiRatesIndex !== -1) {
      setActiveTab(multiRatesIndex);
      // handleTabChange(multiRatesIndex)
    }
  }, [t]);

  const userSession = rootState.UserSession;
  const clientSession = rootState.ClientSession;
  const isIndia = userSession.countryId === Countries.India;
  const isSaudi = userSession.countryId === Countries.Saudi;
  const { getFormattedValue } = useNumberFormat();
  const appSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );

  const GetHoldStatusOfSelectedItem = async (
    batchId: any
  ): Promise<boolean> => {
    return await api.getAsync(`${Urls.products}HoldStatus/${batchId}`);
  };
  useEffect(() => {
    async function fetchCode() {
      const isEditMode = !isNullOrUndefinedOrZero(
        rootState.PopupData.products?.key
      );
      let data: productDto;
      let nextProductCode: string;
      debugger;
      const res = await api.getAsync(`${Urls.get_product_config}`);
      debugger;
      const st = atob(res);
      const _st: any = customJsonParse(st);
      if (isEditMode) {
        data = (await api.getAsync(
          `${Urls.products}${rootState.PopupData.products?.key}`
        )) as productDto;
        nextProductCode = data.product.productCode ?? "";
      } else {
        data = initialProductData;
        nextProductCode = await api.getAsync(
          `${Urls.products}SelectNextProductCode`
        );

        // Set defaults for new product
        data.product.productGroupID = -2;
        data.product.defaultVendorID = -2;
        data.product.itemType = "Inventory";
        data.product.taxCategoryID = -2;

        const softwareDate = moment(clientSession.softwareDate, "DD/MM/YYYY");
        data.batch.expiryDate = softwareDate.clone().add(50, "years").toDate();
        data.batch.mfgDate = softwareDate.toDate();
        data.batch.warehouseID =
          appSettings.inventorySettings.defaultServiceSpareWareHouse;
        data.product.batchCriteria = !isNullOrUndefinedOrEmpty(
          appSettings.productsSettings.batchCriteria
        )
          ? appSettings.productsSettings.batchCriteria
          : "NB";
      }

      data.product.productCode = nextProductCode;
      data.config = isNullOrUndefinedOrEmpty(res) ? data.config : _st;

      if (userSession.dbIdValue === "543140180640") {
        const holdStatus = await GetHoldStatusOfSelectedItem(
          data.batch.productBatchID
        );
        data.onHold = holdStatus;
      }

      if (!clientSession.isAppGlobal) {
        const markupPercentage = calculateMarkup(
          data.product.stdPurchasePrice ?? 0,
          data.product.stdSalesPrice ?? 0,
          data.taxCategoryTaxPercentage,
          appSettings.productsSettings.showRateBeforeTax,
          getFormattedValue
        );
        data.markup = markupPercentage;
      }

      handleDataChange({ ...data });
    }

    fetchCode();
  }, []);
  // Define tab labels based on country
  const getTabs = () => {
    if (isSaudi) {
      return [
        t("details"),
        t("multi_units"),
        t("multi_rates"),
        t("search"),
        t("image"),
        t("others"),
        t("sales"),
        t("purchase"),
        t("stock"),
        t("suppliers"),
        t("notes"),
      ];
    } else if (isIndia) {
      return [
        t("details"),
        t("multi_units"),
        t("multi_rates"),
        t("image"),
        t("others"),
        t("sales"),
        t("purchase"),
        t("stock"),
        t("suppliers"),
        // t("re_order"),
        t("promotion_details"),
        t("search"),
        t("nutrition_facts"),
      ];
    }
  };

  // Define tab content in the desired order for each country
  const tabContents = isIndia
    ? [
        <div key="details">
          {" "}
          <ProductDetailsIndia
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
            t={t}
          />
        </div>,

        <div key="multi_units">
          <ProductMultiUnitsIndia
            ref={productMultiUnitsIndiaRef}
            handleDataChange={handleDataChange}
            appSettings={appSettings}
            t={t}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="multi_rates">
          <MultiRates
            isGlobal={true}
            t={t}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="image">
          <ImageCommon
            t={t}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="others">
          {" "}
          <ProductOthersIndia
            handleDataChange={handleDataChange}
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="sales">
          <SalesCommon getFieldProps={getFieldProps} />
        </div>,
        <div key="purchase">
          <PurchaseCommon getFieldProps={getFieldProps} />
        </div>,
        <div key="stock">
          <StockCommon
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="suppliers">
          <SuppliersCommon
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        // <div key="re_order">  <ProductReOrderIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
        <div key="promotion_details">
          <PromotionCommon getFieldProps={getFieldProps}></PromotionCommon>
        </div>,
        <div key="search">
          <SearchCommon />
        </div>,
        <div key="nutrition_facts">
          <NutritionFactsIndia
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
      ]
    : [
        <div key="details">
          <ProductManageGcc
            handleDataChange={handleDataChange}
            appSettings={appSettings}
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
            switchToMultiRatesTab={switchToMultiRatesTab}
          />

          <ProductDetailsGcc
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="multi_units">
          <ProductMultiUnitsGCC
          ref={productMultiUnitsGccRef}
            t={t}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="multi_rates">
          <MultiRates
            isGlobal={false}
            t={t}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="search">
          <SearchCommon />
        </div>,
        <div key="image">
          <ImageCommon
            t={t}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="others">
          <ProductOthersGcc
            handleDataChange={handleDataChange}
            appSettings={appSettings}
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="sales">
          <SalesCommon getFieldProps={getFieldProps} />
        </div>,
        <div key="purchase">
          <PurchaseCommon getFieldProps={getFieldProps} />
        </div>,
        <div key="stock">
          <StockCommon
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="suppliers">
          <SuppliersCommon
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        </div>,
        <div key="notes">
          <ProductNotesGcc />
        </div>,
      ];
  return (
    <div className="w-full modal-content">
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
      <div className="flex flex-col gap-1">
        {isIndia ? (
          <ProductManageIndia
            productMultiUnitsIndiaRef={productMultiUnitsIndiaRef}
            handleDataChange={handleDataChange}
            appSettings={appSettings}
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        ) : (
          ""
        )}
        <ERPTab
          tabs={getTabs()?.filter((x) => {
            if (
              (x == t("multi_units") &&
                !appSettings.productsSettings.allowMultiUnits) ||
              (x == t("multi_rates") &&
                !appSettings.productsSettings.allowMultirate) ||
              (x == t("image") &&
                !appSettings.productsSettings.useProductImages)
            ) {
              return false;
            }
            return true;
          })}
          activeTab={activeTab}
          onClickTabAt={handleTabChange}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          {tabContents.filter((tab) => {
            if (
              (tab.key == "multi_units" &&
                !appSettings.productsSettings.allowMultiUnits) ||
              (tab.key == "multi_rates" &&
                !appSettings.productsSettings.allowMultirate) ||
              (tab.key == "image" &&
                !appSettings.productsSettings.useProductImages)
            ) {
              return false;
            }
            return true;
          })}
        </ERPTab>
      </div>

      {/* <ERPButton
        // disabled={ appSettings.branchSettings.maintainMasterEntry || (formState.data.product.productID??0) <= 0 || !appSettings.branchSettings?.useBranchWiseSalesPrice}
        onClick={() => updatePrice()}
        title="Update Price"
      /> */}
      <ERPFormButtons
      customButtons={[
        {
          title: "Update Price",
          onClick: updatePrice,
          disabled:
            appSettings.branchSettings.maintainMasterEntry ||
            (formState.data.product.productID ?? 0) <= 0 ||
            !appSettings.branchSettings?.useBranchWiseSalesPrice,
          variant: "secondary",
        },
        {
          title: "Flavors",
          onClick: updatePrice,
         
          variant: "secondary",
        },
        {
          title: "Multi Barcode",
          onClick: updatePrice,
         
          variant: "secondary",
        },
      ].filter((x: any) =>{
        return true;
        // const obj = getFieldProps("*") as any as productDto;
        // if(x.titles == "Flavors" && )
      }) as []
    }
   
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        submitDisabled={
          !appSettings.branchSettings.maintainMasterEntry ||
          getFieldProps("hasDisabled").value == true
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default ProductMaster;
