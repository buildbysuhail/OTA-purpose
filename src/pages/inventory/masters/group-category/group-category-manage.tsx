


import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { toggleGroupCategory} from "../../../../redux/slices/popup-reducer";
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
    isLoading,
    handleClose
  } = useFormManager<GroupCategoryData>({
    url: Urls.group_category,
    onClose:useCallback(() => dispatch(toggleGroupCategory({ isOpen: false, key: null,reload: false })), [dispatch]),
    onSuccess: useCallback(
      () => dispatch(toggleGroupCategory({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.groupCategory.key,
    useApiClient: true,
    initialData: initialGroupCategoryData
  });

  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("groupCategoryCode")}
          label={t("code")}
          placeholder={t("code")}
          onChangeData={(data: any) => handleFieldChange("groupCategoryCode", data.groupCategoryCode)}
        />
         <ERPInput
          {...getFieldProps("groupCategoryName")}
          label={t("name")}
          placeholder={t("name")}
          onChangeData={(data: any) => handleFieldChange("groupCategoryName", data.groupCategoryName)}
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
