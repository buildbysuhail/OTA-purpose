import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";

interface AccountLedgerData {
  code: string;
  name: string;
  aliasName: string;
  nameInArabic: string;
  groupUnder: number;
  openingBalance: number;
  balanceType: string;
  remarks: string;
  isBillWiseApplicable: boolean;
  isActive: boolean;
  isEditable: boolean;
  isDeletable: boolean;
  isCostCentreApplicable: boolean;
  isCommon: boolean;
}

export const AccountLedgerManage = () => {
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
    onSuccess: () => dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }))
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps('code')}
          label="Code"
          placeholder="Enter code"
          required={true}
          onChangeData={(data: any) => handleFieldChange('code', data)}
        />
        <ERPInput
          {...getFieldProps('name')}
          label="Name"
          placeholder="Enter name"
          required={true}
          onChangeData={(data: any) => handleFieldChange('name', data)}
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
          id="groupUnder"
          field={{
            id: "groupUnder",
            required: true,
            getListUrl: Urls.account_group,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange('groupUnder', data.groupUnder)
          }}
          validation={postData.validations.groupUnder}
          data={postData?.data}
          defaultData={postData?.data}
          value={postData?.data?.groupUnder ?? 0}
          label="Group(Under)"
        />

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

        <ERPInput
          {...getFieldProps('remarks')}
          label="Remarks"
          placeholder="Enter remarks"
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <ERPInput
              {...getFieldProps('isBillWiseApplicable')}
              type="checkbox"
              label="Bill wise Applicable"
              onChangeData={(data: any) => handleFieldChange('isBillWiseApplicable', data)}
            />
            <ERPInput
              {...getFieldProps('isEditable')}
              type="checkbox"
              label="Editable"
              onChangeData={(data: any) => handleFieldChange('isEditable', data)}
            />
          </div>
          <div className="space-y-2">
            <ERPInput
              {...getFieldProps('isActive')}
              type="checkbox"
              label="Active"
              onChangeData={(data: any) => handleFieldChange('isActive', data)}
            />
            <ERPInput
              {...getFieldProps('isDeletable')}
              type="checkbox"
              label="Deletable"
              onChangeData={(data: any) => handleFieldChange('isDeletable', data)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ERPInput
            {...getFieldProps('isCostCentreApplicable')}
            type="checkbox"
            label="Is Cost Centre Applicable"
            onChangeData={(data: any) => handleFieldChange('isCostCentreApplicable', data)}
          />
          <ERPInput
            {...getFieldProps('isCommon')}
            type="checkbox"
            label="Is Common"
            onChangeData={(data: any) => handleFieldChange('isCommon', data)}
          />
        </div>
      </div>

      <div className="w-full p-2 flex justify-end space-x-2">
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