import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { BrandsData, initialBrandsData } from "./brands-manage-type";
import { toggleBrands } from "../../../../redux/slices/popup-reducer";

export const BrandsManage: React.FC = React.memo(() => {
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
  } = useFormManager<BrandsData>({
    url: Urls.brands,
    onClose:useCallback(() => dispatch(toggleBrands({ isOpen: false, key: null,})), [dispatch]),
    onSuccess: useCallback(
      () => dispatch(toggleBrands({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.brands.key,
    keyField: 'brandID',
    useApiClient: true,
    initialData: initialBrandsData
  });


  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("brandName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("brandName", data.brandName);
          }}
        />
        <ERPInput
          {...getFieldProps("brandShortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          onChangeData={(data: any) => handleFieldChange("brandShortName", data.brandShortName)}
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
