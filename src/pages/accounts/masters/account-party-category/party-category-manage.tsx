import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  togglePartyCategoryPopup,
} from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import {
  initialPartyCategory,
  PartyCategoryData,
} from "./party-category-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

export const PartyCategoryManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<PartyCategoryData>({
      url: Urls.account_party_category,
      onSuccess: useCallback(
        () => dispatch(togglePartyCategoryPopup({ isOpen: false, key: null, reload: true })),
        [dispatch]
      ),
      key: rootState.PopupData.partyCategory.key,
      useApiClient: true,
      initialData: initialPartyCategory,
    });

  const onClose = useCallback(() => {
    dispatch(togglePartyCategoryPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("partyCategoryName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => {

            handleFieldChange("partyCategoryName", data);
          }}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("remarks", data)
          }
        />
        <ERPCheckbox
          {...getFieldProps("isEdit")}
          label={t("is_editable")}
          onChangeData={(data: any) => handleFieldChange("isEdit", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isDelete")}
          label={t("is_deletable")}
          onChangeData={(data: any) => handleFieldChange("isDelete", data)}
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
