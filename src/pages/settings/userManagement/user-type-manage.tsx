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
    onSuccess: useCallback(() => dispatch(toggleUserTypePopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    key: rootState.PopupData.userType.key,
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
          label="User Type Name"
          placeholder="User Type Name"
          required={true}
          onChangeData={(data: any) => {handleFieldChange('userTypeName', data.userTypeName)}}
        />
        <ERPInput
          {...getFieldProps('userTypeCode')}
          label="User Type Code"
          placeholder="User Type Code"
          required={true}
          disabled={isEdit}
          onChangeData={(data: any) => handleFieldChange('userTypeCode', data.userTypeCode)}
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label="Remark"
          placeholder="Remark"
          required={true}
          onChangeData={(data: any) => handleFieldChange('remarks', data.remarks)}
        />
        <ERPCheckbox
          {...getFieldProps('isEditable')}
          label="Is Editable"
          onChangeData={(data: any) => handleFieldChange('isEditable', data.isEditable)}
        />
        <ERPCheckbox
          {...getFieldProps('isDeletable')}
          label="Is Deletable"
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

