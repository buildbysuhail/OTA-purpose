import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialProductCategoryManageData, ProductCategoryManageData } from "./products-category-manage-type";
import { toggleProductCategory } from "../../../../redux/slices/popup-reducer";

export const ProductCategoryManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<ProductCategoryManageData>({
    url: Urls.productCategory,
    onClose:useCallback(() => dispatch(toggleProductCategory({ isOpen: false, key: null,reload: false })), [dispatch]),
    onSuccess: useCallback(
      () => dispatch(toggleProductCategory({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.productCategory.key,
    useApiClient: true,
    initialData: initialProductCategoryManageData
  });

  const { t } = useTranslation();
  
  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("productCategoryCode")}
          label={t("code")}
          placeholder={t("code")}
          onChangeData={(data: any) => {
            handleFieldChange("productCategoryCode", data.productCategoryCode);
          }}
        />
        <ERPInput
          {...getFieldProps("productCategoryName")}
          label={t("name")}
          placeholder={t("name")}
          onChangeData={(data: any) => handleFieldChange("productCategoryName", data.productCategoryName)}
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
        <ERPCheckbox
          {...getFieldProps('isCommon')}
          label={t("common")}
          onChangeData={(data: any) => handleFieldChange('isCommon', data.isCommon)}
        />
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
