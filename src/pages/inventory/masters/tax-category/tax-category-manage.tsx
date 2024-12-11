import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleTaxCategory } from "../../../../redux/slices/popup-reducer";
import { initialTaxCategoryData, TaxCategoryData } from "./tax-category-type";

export const TaxCategoryManage: React.FC = React.memo(() => {
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
  } = useFormManager<TaxCategoryData>({
    url: Urls.taxCategory,
    onClose:useCallback(() => dispatch(toggleTaxCategory({ isOpen: false, key: null,reload: false })), [dispatch]),
    onSuccess: useCallback(
      () => dispatch(toggleTaxCategory({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.taxCategory.key,
    useApiClient: true,
    initialData: initialTaxCategoryData
  });



  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("taxCategoryName")}
          label={t("tax_category")}
          placeholder={t("tax_category")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("taxCategoryName", data.taxCategoryName);
          }}
        />
        <ERPInput
          {...getFieldProps("sVatPerc")}
          type='number'
          label={t("sales_VAT_%")}
          placeholder={t("sales_VAT_%")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("sVatPerc", data.sVatPerc)}
        />
        <ERPInput
          {...getFieldProps("pVatPerc")}
          type='number'
          label={t("purchase_VAT_%")}
          placeholder={t("purchase_VAT_%")}
          onChangeData={(data: any) => handleFieldChange("pVatPerc", data.pVatPerc)}
        />
        <ERPInput
          {...getFieldProps("pcstPerc")}
          type='number'
          label={t("purchase_excise_tax_%")}
          placeholder={t("purchase_excise_tax_%")}
          onChangeData={(data: any) => handleFieldChange("pcstPerc", data.pcstPerc)}
        />
        <ERPInput
          {...getFieldProps("scstPerc")}
          type='number'
          label={t("sales_excise_tax_%")}
          placeholder={t("sales_excise_tax_%")}
          onChangeData={(data: any) => handleFieldChange("scstPerc", data.scstPerc)}
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
