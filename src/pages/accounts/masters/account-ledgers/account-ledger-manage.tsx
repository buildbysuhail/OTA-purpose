import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { AccountLedgerData } from "./account-ledger-types";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { ActionType } from "../../../../redux/types";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

export const AccountLedgerManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    formState: postData,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<AccountLedgerData>({
    url: Urls.account_ledger,
    onSuccess: useCallback(() => dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps('ledgerCode')}
          label="Code"
          placeholder="Enter Code"
          required={true}
          onChangeData={(data: any) => handleFieldChange('ledgerCode', data)}
        />
        <ERPInput
          {...getFieldProps('ledgerName')}
          label="Name"
          placeholder="Enter Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange('ledgerName', data)}
        />
        <ERPInput
          {...getFieldProps('aliasName')}
          label="Alias Name"
          placeholder="Enter alias name"
          onChangeData={(data: any) => handleFieldChange('aliasName', data)}
        />
        <ERPInput
          {...getFieldProps('nameInArabic')}
          label="Name in Arabic"
          placeholder="Enter name in Arabic"
          onChangeData={(data: any) => handleFieldChange('nameInArabic', data)}
        />

        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data)
          }}
          label="Group Under"
        />

        <div>
          <div className="flex items-center gap-2">
            <ERPInput
              {...getFieldProps('openingBalance')}
              label="Opening Balance"
              type="number"
              className="w-32"
              onChangeData={(data: any) => handleFieldChange('openingBalance', data)}
            />
            <ERPInput
              {...getFieldProps('balanceType')}
              type="select"
              className="w-32"
              data={{
                balanceType: postData?.data?.balanceType || '',
                selectOptions: [
                  { value: 'debit', label: 'Dr' },
                  { value: 'credit', label: 'Cr' }
                ]
              }}
              onChangeData={(data: any) => handleFieldChange('balanceType', data)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ERPInput
          {...getFieldProps('remarks')}
          label="Remarks"
          placeholder="Enter remarks"
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <ERPCheckbox
          {...getFieldProps("isBillwiseApplicable")}
          label="Bill Wise Applicable"
          onChangeData={(data: any) => handleFieldChange("isBillwiseApplicable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isActive")}
          label="Active"
          onChangeData={(data: any) => handleFieldChange("isActive", data)}
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
        <ERPCheckbox
          {...getFieldProps("isCostCentreApplicable")}
          label="Is Cost Center Applicable"
          onChangeData={(data: any) => handleFieldChange("isCostCentreApplicable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isCommon")}
          label="Is Common"
          onChangeData={(data: any) => handleFieldChange("isCommon", data)}
        />
      </div>

      <div className="w-full p-2 flex justify-center space-x-2 mt-5">
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
          type="button"
          title="Close"
          variant="secondary"
          onClick={onClose}
        />
      </div>
    </div>
  );
};