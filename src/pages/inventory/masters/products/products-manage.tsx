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

export const ProductMaster: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
  const { isEdit, handleSubmit, handleClear, isLoading, handleClose } =
    useFormManager<productDto>({
      url: Urls.products,
      onClose: useCallback(() => dispatch(toggleProducts({ isOpen: false, key: null, reload: false })), [dispatch]),
      onSuccess: useCallback(() => dispatch(toggleProducts({ isOpen: false, key: null, reload: true })), [dispatch]),
      key: rootState.PopupData.products?.key,
      useApiClient: true,
      initialData: initialProductData,
    });

  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const userSession = rootState.UserSession;
  const isIndia = userSession.countryId === Countries.India;
  const isSaudi = userSession.countryId === Countries.Saudi;

  // Define tabs based on country
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
        t("notes")
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
        t("nutrition_facts")
      ];
    }
  };

  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        {isIndia ? (
          <ProductManageIndia />
        ) : (
          <ProductManageGcc />
        )}

        <ERPTab
          tabs={getTabs()}
          activeTab={activeTab}
          onClickTabAt={handleTabChange}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-2">
            {isIndia ? (
              <ProductDetailsIndia />
            ) : (
              <ProductDetailsGcc />
            )}
          </div>

          <div>
            Multi Units
          </div>

          <div>
            Multi Rates
          </div>

          {isSaudi ? (
            // Saudi tab order content
            <>
              <div>
                Search
              </div>

              <div>
                Image
              </div>

              <div>
                Others
              </div>

              <div>
                Sales
              </div>

              <div>
                Purchase
              </div>

              <div>
                Stock
              </div>

              <div>
                Suppliers
              </div>
            </>
          ) : (
            // India tab order content
            <>
              <div>
                Image
              </div>

              <div>
                Others
              </div>

              <div>
                Sales
              </div>

              <div>
                Purchase
              </div>

              <div>
                Stock
              </div>

              <div>
                Suppliers
              </div>

              <div>
                Re-Order
              </div>

              <div>
                Promotion Details
              </div>

              <div>
                Search
              </div>

              <div>
                Nutrition Facts
              </div>
            </>
          )}
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