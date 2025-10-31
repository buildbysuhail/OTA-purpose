import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { toggleGroupCategory } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { GroupCategoryData, initialGroupCategoryData } from "./group-category-mange-type";

export const GroupCategoryManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    formState,
    isLoading,
    handleClose
  } = useFormManager<GroupCategoryData>({
    url: Urls.group_category,
    onClose: useCallback(() => dispatch(toggleGroupCategory({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleGroupCategory({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.groupCategory.key,
    useApiClient: true,
    initialData: initialGroupCategoryData
  });

  const { t } = useTranslation('inventory');

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("groupCategoryCode")}
          label={t("code")}
          placeholder={t("code")}
          onChangeData={(data: any) => handleFieldChange("groupCategoryCode", data.groupCategoryCode)}
          readOnly={rootState.PopupData.groupCategory.mode == "view"}
          autoFocus={true}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("groupCategoryName")}
          label={t("name")}
          placeholder={t("name")}
          onChangeData={(data: any) => handleFieldChange("groupCategoryName", data.groupCategoryName)}
          readOnly={rootState.PopupData.groupCategory.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
          readOnly={rootState.PopupData.groupCategory.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
          readOnly={rootState.PopupData.groupCategory.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPCheckbox
          {...getFieldProps('isCommon')}
          label={t("is_common")}
          onChangeData={(data: any) => handleFieldChange('isCommon', data.isCommon)}
          disabled={rootState.PopupData.groupCategory.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
      </div>

      <ERPFormButtons
        onClear={rootState.PopupData.groupCategory.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={rootState.PopupData.groupCategory.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleSubmit}
      />
    </div>
  );
});
