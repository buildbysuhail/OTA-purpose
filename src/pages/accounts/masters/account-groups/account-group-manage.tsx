import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";

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
    onSuccess: () => dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }))
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
  }, []);

  const handleUpdateArabicName = useCallback(() => {
    // Implementation for updating Arabic name
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps('name')}
          label="Name"
          placeholder="Enter name"
          required={true}
          onChangeData={(data: any) => handleFieldChange('name', data)}
        />
        <ERPInput
          {...getFieldProps('nameInArabic')}
          label="Name in Arabic"
          placeholder="Enter name in Arabic"
          required={true}
          onChangeData={(data: any) => handleFieldChange('nameInArabic', data)}
        />
        <ERPInput
          {...getFieldProps('shortName')}
          label="Short Name"
          placeholder="Enter short name"
          onChangeData={(data: any) => handleFieldChange('shortName', data)}
        />
        <ERPInput
          {...getFieldProps('groupUnder')}
          label="Group(Under)"
          placeholder="Select group"
          type="select"
          required={true}
          onChangeData={(data: any) => handleFieldChange('groupUnder', data)}
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label="Remarks"
          placeholder="Enter remarks"
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
        />
        <ERPInput
          {...getFieldProps('reasonForEdit')}
          label="Reason For Edit"
          placeholder="Enter reason for edit"
          onChangeData={(data: any) => handleFieldChange('reasonForEdit', data)}
        />

        <div className="flex space-x-4">
          <ERPInput
            {...getFieldProps('isEditable')}
            type="checkbox"
            label="Editable"
            onChangeData={(data: any) => handleFieldChange('isEditable', data)}
          />
          <ERPInput
            {...getFieldProps('isDeletable')}
            type="checkbox"
            label="Deletable"
            onChangeData={(data: any) => handleFieldChange('isDeletable', data)}
          />
        </div>
      </div>

      <div className="w-full p-2 flex justify-between">
        <ERPButton
          type="button"
          title="Update Arabic Name"
          variant="secondary"
          onClick={handleUpdateArabicName}
        />

        <div className="flex space-x-2">
          <ERPButton
            type="button"
            title="Save"
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          />
          <ERPButton
            type="button"
            title="Clear"
            variant="secondary"
          />
          <ERPButton
            type="reset"
            title="Close"
            variant="secondary"
            onClick={onClose}
          />
        </div>
      </div>

      <div className="text-sm text-blue-600 space-y-1 mt-4">
        <button type="button" className="block hover:underline">
          Update Arabic Name from google translate
        </button>
        <button type="button" className="block hover:underline">
          Group Order (In Trial Balance)
        </button>
      </div>
    </div>
  );
};