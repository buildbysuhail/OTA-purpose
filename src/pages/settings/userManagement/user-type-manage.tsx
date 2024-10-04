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
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<UserTypeData>({
    url: Urls.UserTypes,
    onSuccess: useCallback(() => dispatch(toggleUserTypePopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.userType.key
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
          onChangeData={(data: any) => {debugger;handleFieldChange('userTypeName', data)}}
        />
        <ERPInput
          {...getFieldProps('userTypeCode')}
          label="User Type Code"
          placeholder="User Type Code"
          required={true}
          onChangeData={(data: any) => handleFieldChange('userTypeCode', data)}
        />
        <ERPInput
          {...getFieldProps('remark')}
          label="Remark"
          placeholder="Remark"
          required={true}
          onChangeData={(data: any) => handleFieldChange('remark', data)}
        />
        <ERPCheckbox
          {...getFieldProps('isEditable')}
          label="Is Editable"
          onChange={(data: any) => handleFieldChange('isEditable', data)}
        />
        <ERPCheckbox
          {...getFieldProps('isDeletable')}
          label="Is Deletable"
          onChange={(data: any) => handleFieldChange('isDeletable', data)}
        />
      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

