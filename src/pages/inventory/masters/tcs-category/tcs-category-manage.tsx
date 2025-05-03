import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleTcsCategory } from "../../../../redux/slices/popup-reducer";
import { initialTcsCategoryData, TcsCategoryData } from "./tcs-category-type";

export const TcsCategoryManage: React.FC = React.memo(() => {
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
  } = useFormManager<TcsCategoryData>({
    url: Urls.tcsCategory,
    onClose: useCallback(() => dispatch(toggleTcsCategory({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleTcsCategory({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.tcsCategory.key,
    useApiClient: true,
    initialData: initialTcsCategoryData
  });

  const { t } = useTranslation('inventory');

  return (
    <div className="w-full modal-content">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("categoryName")}
          label={t("category_name")}
          placeholder={t("category_name")}
          onChangeData={(data: any) => {
            handleFieldChange("categoryName", data.categoryName);
          }}
        />
        <ERPInput
          {...getFieldProps("tcsPerc")}
          label={t("tcs_perc")}
          placeholder={t("tcs_percentage")}
          onChangeData={(data: any) => {
            handleFieldChange("tcsPerc", data.tcsPerc);
          }}
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