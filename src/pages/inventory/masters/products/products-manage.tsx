import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ERPFormButtons from "../../../../components/ERPComponents/erp-form-buttons";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleProducts } from "../../../../redux/slices/popup-reducer";
import { productDto } from "./products-type";
import initialProductData from "./products-data";
import { Countries } from "../../../../redux/slices/user-session/user-branches-reducer";
import ProductDetailsIndia from "./products-india/product-details-india";
import ProductManageIndia from "./products-india/products-manage-india";
import ProductManageGcc from "./products-gcc/products-manage-gcc";
import ProductDetailsGcc from "./products-gcc/product-details-gcc";
import ProductReOrderIndia from "./products-india/product-re-order-india";
import ProductOthersIndia from "./products-india/product-others-india";
import ProductOthersGcc from "./products-gcc/product-others-gcc";
import ProductNotesGcc from "./products-gcc/product-notes-gcc";
import ProductMultiUnitsIndia from "./products-india/product-multi-units-india";
import ProductMultiUnitsGCC from "./products-gcc/product-multi-units-gcc";
import MultiRatesGcc from "./products-gcc/products-multi-rates-gcc";
import MultiRatesIndia from "./products-india/product-multi-rates-india";
import NutritionFactsIndia from "./products-india/product-nutrition-facts-india";
import SearchCommon from "./common/product-search";
import ImageCommon from "./common/product-image";
import SalesCommon from "./common/product-sales";
import PurchaseCommon from "./common/product-purchase";
import StockCommon from "./common/product-stock";
import SuppliersCommon from "./common/product-suppliers";

export const ProductMaster: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
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

  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (index: number) => { setActiveTab(index); };
  const userSession = rootState.UserSession;
  const isIndia = userSession.countryId === Countries.India;
  const isSaudi = userSession.countryId === Countries.Saudi;

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
        t("re_order"),
        t("promotion_details"),
        t("search"),
        t("nutrition_facts"),
      ];
    }
  };

  // Define tab content in the desired order for each country
  const tabContents = isIndia
    ? [
      <div key="details" className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
          <ProductDetailsIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} t={t} /></div>,
      <div key="multi_units"><ProductMultiUnitsIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/></div>,
      <div key="multi_rates"><MultiRatesIndia/></div>,
      <div key="image"><ImageCommon /></div>,
      <div key="others">  <ProductOthersIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/></div>,
      <div key="sales"><SalesCommon /></div>,
      <div key="purchase"><PurchaseCommon /></div>,
      <div key="stock"><StockCommon formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/></div>,
      <div key="suppliers"><SuppliersCommon /></div>,
      <div key="re_order">  <ProductReOrderIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="promotion_details">Promotion Details</div>,
      <div key="search"><SearchCommon /></div>,
      <div key="nutrition_facts"><NutritionFactsIndia /></div>,
    ]
    : [
      <div key="details" className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
        <ProductManageGcc formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/> 
        <ProductDetailsGcc formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/>
        </div>,
      <div key="multi_units"><ProductMultiUnitsGCC /></div>,
      <div key="multi_rates"><MultiRatesGcc /></div>,
      <div key="search"><SearchCommon /></div>,
      <div key="image"><ImageCommon /></div>,
      <div key="others"><ProductOthersGcc /></div>,
      <div key="sales"><SalesCommon /></div>,
      <div key="purchase"><PurchaseCommon /></div>,
      <div key="stock"><StockCommon formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/></div>,
      <div key="suppliers"><SuppliersCommon /></div>,
      <div key="notes"><ProductNotesGcc /></div>,
    ];

  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        {isIndia ? <ProductManageIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange}/> : ""}
        <ERPTab
          tabs={getTabs()}
          activeTab={activeTab}
          onClickTabAt={handleTabChange}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabContents}
        </ERPTab>
      </div>

      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default ProductMaster;
