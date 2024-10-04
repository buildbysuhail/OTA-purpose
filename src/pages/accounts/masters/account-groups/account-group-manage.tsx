import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";

interface AccountGroupData {
  name: string;
  nameInArabic: string;
  shortName: string;
  groupUnder: string;
  remarks: string;
  reasonForEdit: string;
  isEditable: boolean;
  isDeletable: boolean;
}

export const AccountGroupManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const [localFormData, setLocalFormData] = useState<AccountGroupData>({
    userTypeName: '',
    userTypeCode: '',
    remark: ''
  });

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState
  } = useFormManager<AccountGroupData>({
    url: Urls.account_group,
    onSuccess: useCallback(() => dispatch(toggleAccountGroupPopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.accountGroup.key
  });

  useEffect(() => {
    if (formState.data.data) {
      setLocalFormData(formState.data.data);
    }
  }, [formState.data.data]);

  const onClose = useCallback(() => {
    dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps('accGroupName')}
          label="User Type Name"
          placeholder="User Type Name"
          required={true}
          onChangeData={(data: any) => {debugger;handleFieldChange('accGroupName', data)}}
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