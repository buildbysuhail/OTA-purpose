import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { AccountLedgerData, initialAccountLedger } from "./account-ledger-types";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { ActionType } from "../../../../redux/types";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";

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
    key: rootState.PopupData.accountLedger.key,
    useApiClient: true,
    initialData: initialAccountLedger
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps('ledgerCode')}
          label={t("code")}
          placeholder={t("enter_code")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('ledgerCode', data)}
        />
        <ERPInput
          {...getFieldProps('ledgerName')}
          label={t("name")}
          placeholder={t("enter_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('ledgerName', data)}
        />
        <ERPInput
          {...getFieldProps('aliasName')}
          label={t("alias_name")}
          placeholder={t("enter_alias_name")}
          onChangeData={(data: any) => handleFieldChange('aliasName', data)}
        />
        <ERPInput
          {...getFieldProps('arabicName')}
          label={t("name_in_arabic")}
          placeholder={t("enter_name_in_arabic")}
          onChangeData={(data: any) => handleFieldChange('arabicName', data)}
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
          label={t("group_under")}
        />

        <div>
          <div className="flex items-center gap-2">
            <ERPInput
              {...getFieldProps('openingBalance')}
              label={t("opening_balance")}
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
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <ERPCheckbox
          {...getFieldProps("isBillwiseApplicable")}
          label={t("bill_wise_applicable")}
          onChangeData={(data: any) => handleFieldChange("isBillwiseApplicable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isActive")}
          label={t("active")}
          onChangeData={(data: any) => handleFieldChange("isActive", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isEditable")}
          label={t("editable")}
          onChangeData={(data: any) => handleFieldChange("isEditable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isDeletable")}
          label={t("deletable")}
          onChangeData={(data: any) => handleFieldChange("isDeletable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isCostCentreApplicable")}
          label={t("cost_center_applicable")}
          onChangeData={(data: any) => handleFieldChange("isCostCentreApplicable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isCommon")}
          label={t("is_common")}
          onChangeData={(data: any) => handleFieldChange("isCommon", data)}
        />
      </div>

      <div className="w-full p-2 flex justify-center space-x-2 mt-5">
        <ERPFormButtons
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};