


import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { toggleProductGroup, toggleSection } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialSectionData, SectionData } from "./section-manage-type";

export const SectionManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<SectionData>({
    url: Urls.section,
    onSuccess: useCallback(
      () => dispatch(toggleSection({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.section.key,
    useApiClient: true,
    initialData: initialSectionData
  });

  const onClose = useCallback(() => {
    dispatch(toggleSection({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("sectionCode")}
          label={t("code")}
          placeholder={t("code")}
          onChangeData={(data: any) => handleFieldChange("sectionCode", data.sectionCode)}
        />
         <ERPInput
          {...getFieldProps("sectionName")}
          label={t("name")}
          placeholder={t("name")}
          onChangeData={(data: any) => handleFieldChange("sectionName", data.sectionName)}
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
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
