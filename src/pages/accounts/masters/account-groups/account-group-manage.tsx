import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountTypePopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";

interface AccountGroupData {
  userTypeName: string;
  userTypeCode: string;
  remark: string;
}

export const AccountGroupManage = () => {
  const dispatch = useDispatch();

  const {
    isEdit,
    formState,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<AccountGroupData>({
    url: Urls.account_group,
    onSuccess: () => dispatch(toggleAccountTypePopup(false))
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountTypePopup(false));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps('accGroupName')}
          label="User Type Name"
          placeholder="User Type Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange('accGroupName', data)}
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

      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
        />
        <ERPButton
          type="button"
          disabled={isLoading}
          variant="primary"
          onClick={handleSubmit}
          loading={isLoading}
          title={isEdit ? 'Update' : 'Submit'}
        />
      </div>
    </div>
  );
};