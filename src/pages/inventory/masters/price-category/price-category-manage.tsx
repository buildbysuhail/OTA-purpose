import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialPriceCategoryData, PriceCategoryData } from "./price-category-manage-type";
import { togglePriceCategory } from "../../../../redux/slices/popup-reducer";

export const PriceCategoryManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<PriceCategoryData>({
    url: Urls.priceCategory,
    onSuccess: useCallback(
      () => dispatch(togglePriceCategory({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.priceCategory.key,
    useApiClient: true,
    initialData: initialPriceCategoryData
  });

  const onClose = useCallback(() => {
    dispatch(togglePriceCategory({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("priceCategoryName")}
          label={t("name")}
          placeholder={t("name")}
          onChangeData={(data: any) => {
            handleFieldChange("priceCategoryName", data.priceCategoryName);
          }}
        />
        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
        <ERPInput
          {...getFieldProps("discountPerc")}
          label={t("discount_%")}
          placeholder={t("discount_%")}
          onChangeData={(data: any) => handleFieldChange("discountPerc", data.discountPerc)}
        />
        <ERPInput
          {...getFieldProps("marginPerc")}
          label={t("margin_%")}
          placeholder={t("margin_%")}
          onChangeData={(data: any) => handleFieldChange("marginPerc", data.marginPerc)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
