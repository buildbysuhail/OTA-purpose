import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import React from "react";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { initialDataUserType } from "./user-manage-types";
import { t } from "i18next";

interface UserTypeData {
  userTypeName: string;
  userTypeCode: string;
  remarks: string;
}

export const UserTypeManage : React.FC = React.memo(() =>  {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<UserTypeData>({
    url: Urls.UserTypes,
    onSuccess: useCallback(() => dispatch(toggleUserTypePopup({ isOpen: false, key: null, reload:true  })), [dispatch]),
    key: rootState.PopupData.userType.key,
    keyField:"userTypeCode",
    useApiClient: true,
    initialData: initialDataUserType
  });

  const onClose = useCallback(() => {
    dispatch(toggleUserTypePopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps('userTypeName')}
          label={t("user_type_name")}
          placeholder={t("user_type_name")}
          required={true}
          onChangeData={(data: any) => {handleFieldChange('userTypeName', data.userTypeName)}}
        />
        <ERPInput
          {...getFieldProps('userTypeCode')}
          label={t("user_type_code")}
          placeholder={t("user_type_code")}
          required={true}
          disabled={isEdit}
          onChangeData={(data: any) => handleFieldChange('userTypeCode', data.userTypeCode)}
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label={t("remarks")}
          placeholder={t("remarks")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('remarks', data.remarks)}
        />
        <ERPCheckbox
          {...getFieldProps('isEditable')}
          label={t("is_editable")}
          onChangeData={(data: any) => handleFieldChange('isEditable', data.isEditable)}
        />
        <ERPCheckbox
          {...getFieldProps('isDeletable')}
          label={t("is_deletable")}
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

