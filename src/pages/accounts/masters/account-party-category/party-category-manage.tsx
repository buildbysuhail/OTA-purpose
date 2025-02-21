import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { togglePartyCategoryPopup, } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { initialPartyCategory, PartyCategoryData, } from "./party-category-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

export const PartyCategoryManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<PartyCategoryData>({
    url: Urls.account_party_category,
    onSuccess: useCallback(() => dispatch(togglePartyCategoryPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    onClose: useCallback(() => dispatch(togglePartyCategoryPopup({ isOpen: false, key: null, reload: false })), [dispatch]),
    key: rootState.PopupData.partyCategory.key,
    useApiClient: true,
    initialData: initialPartyCategory,
  });
  const { t } = useTranslation("masters");
  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-2 gap-3 ps-1 text-left">
        <ERPInput
          {...getFieldProps("partyCategoryName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => { handleFieldChange("partyCategoryName", data.partyCategoryName); }}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
        {/* <ERPDataCombobox
          {...getFieldProps("partyColor")}
          field={{
            id: "partyColor",
            required: true,
            getListUrl: Urls.data_party_color,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("partyColor", data.partyColor);
          }}
        
          label={t("party_color")}
        /> */}

        <ERPCheckbox
          {...getFieldProps("isEdit")}
          label={t("is_editable")}
          onChangeData={(data: any) => handleFieldChange("isEdit", data.isEdit)}
        />
        <ERPCheckbox
          {...getFieldProps("isDelete")}
          label={t("is_deletable")}
          onChangeData={(data: any) => handleFieldChange("isDelete", data.isDelete)}
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