import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { ActionType } from "../../../../redux/types";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccountGroupData } from "./account-group-types";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

export const AccountGroupManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

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
    method: ActionType.POST,
    useApiClient: true
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps('accGroupName')}
          label="Name"
          placeholder="Name"
          required={true}
          onChangeData={(data: any) => { debugger; handleFieldChange('accGroupName', data) }}
        />
        <ERPInput
          {...getFieldProps('accGroupNameArabic')}
          label="Name in Arabic"
          placeholder="Name in Arabic"
          required={true}
          onChangeData={(data: any) => handleFieldChange('accGroupNameArabic', data)}
        />
        <ERPInput
          {...getFieldProps('shortName')}
          label="Short Name"
          placeholder="Short Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange('shortName', data)}
        />
        <ERPDataCombobox
          {...getFieldProps("parentGroupID")}
          field={{
            id: "parentGroupID",
            required: true,
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("parentGroupID", data)
          }}
          label="Group Under"
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label="Remarks"
          placeholder="Remarks"
          required={true}
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
        />
        <ERPInput
          {...getFieldProps('reasonForEdit')}
          label="Reason For Edit"
          placeholder="Reason For Edit"
          required={true}
          onChangeData={(data: any) => handleFieldChange('reasonForEdit', data)}
        />
        <ERPCheckbox
          {...getFieldProps("isEditable")}
          label="Editable"
          onChangeData={(data: any) => handleFieldChange("isEditable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isDeletable")}
          label="Deletable"
          onChangeData={(data: any) => handleFieldChange("isDeletable", data)}
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