import React, { useCallback, useEffect, useState } from "react";
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
import ProductMultiUnitsIndia from "./products-india/product-multi-units-india";
import ProductMultiUnitsGCC from "./products-gcc/product-multi-units-gcc";
import MultiRatesIndia from "./products-india/product-multi-rates-india";
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

const api = new APIClient();
export const ProductMaster: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory"); debugger;
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const { isEdit, handleSubmit, handleClear, isLoading, handleClose, formState, handleFieldChange, getFieldProps } =

    useFormManager<productDto>({
      url: Urls.products,
      onClose: useCallback(
        () => dispatch(toggleProducts({ isOpen: false, key: null, reload: false })),
        [dispatch]
      ),
      onSuccess: useCallback(
        () => dispatch(toggleProducts({ isOpen: false, key: null, reload: true })),
        [dispatch]
      ),
      key: rootState.PopupData.products?.key,
      useApiClient: true,
      keyField: 'productID',
      initialData: {
        data: initialProductData,
      },
    });
    const _handleFieldChange: <Path extends ProductFieldPath>(
      fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
      value?: PathValue<productDto, Path>
    ) => void = handleFieldChange
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (index: number) => { setActiveTab(index); };
  const userSession = rootState.UserSession;
  const clientSession = rootState.ClientSession;
  const isIndia = userSession.countryId === Countries.India;
  const isSaudi = userSession.countryId === Countries.Saudi;

  const appSettings = useSelector((state: RootState) => state.ApplicationSettings);
  useEffect(() => {
    async function fetchCode() {
      if (!appSettings.productsSettings.enableSupplierWiseItemCode) {
        const response = await api.getAsync(`${Urls.products}SelectNextProductCode`);
        _handleFieldChange("product.productCode",response); 
      } else {
        const vendorId = getFieldProps("product.defaultVendorID").value; // Function to get vendor ID
        const response = await api.getAsync(`${Urls.products}NextProductCodeByVendor/${vendorId??0}`);
        handleFieldChange("product.productCode",response); 
      }
    }

    fetchCode();
    const softwareDate = moment(clientSession.softwareDate, "DD/MM/YYYY")
    handleFieldChange("batch.expiryDate",softwareDate.add(50,"years").toDate()); 
    _handleFieldChange("batch.mfgDate",softwareDate.toDate()); 
    _handleFieldChange("product.batchCriteria",appSettings.productsSettings.batchCriteria); 
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
      ]
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
      <div key="details">  <ProductDetailsIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} t={t} /></div>,
      
      <div key="multi_units"><ProductMultiUnitsIndia t={t} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="multi_rates"><MultiRatesIndia t={t} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="image"><ImageCommon  t={t} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="others">  <ProductOthersIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="sales"><SalesCommon getFieldProps={getFieldProps} /></div>,
      <div key="purchase"><PurchaseCommon getFieldProps={getFieldProps} /></div>,
      <div key="stock"><StockCommon formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="suppliers"><SuppliersCommon formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      // <div key="re_order">  <ProductReOrderIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="promotion_details"><PromotionCommon getFieldProps={getFieldProps}></PromotionCommon></div>,
      <div key="search"><SearchCommon /></div>,
      <div key="nutrition_facts"><NutritionFactsIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
    ]
    : [
      <div key="details">
        <ProductManageGcc appSettings={appSettings} formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} />
        <ProductDetailsGcc formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} />
      </div>,
      <div key="multi_units"><ProductMultiUnitsGCC t={t} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="multi_rates"><MultiRatesIndia t={t} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="search"><SearchCommon /></div>,
      <div key="image"><ImageCommon t={t} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="others"><ProductOthersGcc /></div>,
      <div key="sales"><SalesCommon getFieldProps={getFieldProps} /></div>,
      <div key="purchase"><PurchaseCommon getFieldProps={getFieldProps} /></div>,
      <div key="stock"><StockCommon formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="suppliers"><SuppliersCommon formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="notes"><ProductNotesGcc /></div>,
    ];
  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        {isIndia ? <ProductManageIndia appSettings={appSettings} formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /> : ""}
        <ERPTab
          tabs={getTabs()?.filter(x => {
            if((x == t("multi_units") && !appSettings.productsSettings.allowMultiUnits) ||
              (x == t("multi_rates") && !appSettings.productsSettings.allowMultirate)||
              (x == t("image") && !appSettings.productsSettings.useProductImages))  {
                return false;
              }
            return true;
          })}
          activeTab={activeTab}
          onClickTabAt={handleTabChange}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabContents.filter(x => {
        if((x == t("multi_units") && !appSettings.productsSettings.allowMultiUnits) ||
        (x == t("multi_rates") && !appSettings.productsSettings.allowMultirate) ||
        (x == t("image") && !appSettings.productsSettings.useProductImages))  {
            return false;
          }
        return true;
      })}
        </ERPTab>
      </div>


      <ERPButton
        disabled={!appSettings.branchSettings.maintainMasterEntry && !canEdit}
        onSubmit={() => setCanEdit(true)}
        title="Edit"
      />
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        submitDisabled={!appSettings.branchSettings.maintainMasterEntry}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default ProductMaster;
