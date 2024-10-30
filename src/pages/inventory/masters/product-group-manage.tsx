import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleProductGroup } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { initialProductGroupData, ProductGroupData } from "./products-group-manage-type";

export const ProductGroupManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<ProductGroupData>({
    url: Urls.productGroup,
    onSuccess: useCallback(
      () => dispatch(toggleProductGroup({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.productGroup.key,
    useApiClient: true,
    initialData: initialProductGroupData
  });

  const onClose = useCallback(() => {
    dispatch(toggleProductGroup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps("groupName")}
          label={t("group_name")}
          placeholder={t("group_name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("groupName", data.groupName);
          }}
        />
        <ERPInput
          {...getFieldProps("arabicName")}
          label={t("regional_language")}
          placeholder={t("regional_language")}
          onChangeData={(data: any) => handleFieldChange("arabicName", data.arabicName)}
        />
        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
        />
        <ERPDataCombobox
          {...getFieldProps("parentGroupID")}
          id="parentGroupID"
          field={{
            id: "parentGroupID",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("parent_group")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("parentGroupID", data.parentGroupID)}
        />
        <ERPDataCombobox
          {...getFieldProps("groupCategoryID")}
          id="groupCategoryID"
          field={{
            id: "groupCategoryID",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("group_category")}
          onChangeData={(data: any) => handleFieldChange("groupCategoryID", data.groupCategoryID)}
        />
        <ERPDataCombobox
          {...getFieldProps("sectionID")}
          id="sectionID"
          field={{
            id: "sectionID",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("section")}
          onChangeData={(data: any) => handleFieldChange("sectionID", data.sectionID)}
        />
        <ERPDataCombobox
          {...getFieldProps("gStatus")}
          id="gStatus"
          field={{
            id: "gStatus",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("GStatus")}
          onChangeData={(data: any) => handleFieldChange("gStatus", data.gStatus)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
        <ERPInput
          {...getFieldProps("marginPerc")}
          label={t("margin_percentage")}
          placeholder={t("margin_percentage")}
          onChangeData={(data: any) => handleFieldChange("marginPerc", data.marginPerc)}
        />
        <ERPCheckbox
          {...getFieldProps('isEditable')}
          label={t("editable")}
          onChangeData={(data: any) => handleFieldChange('isEditable', data.isEditable)}
        />
        <ERPCheckbox
          {...getFieldProps('isDeletable')}
          label={t("deletable")}
          onChangeData={(data: any) => handleFieldChange('isDeletable', data.isDeletable)}
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
