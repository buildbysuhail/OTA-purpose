import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { AccountLedgerData, initialAccountLedger } from "./account-ledger-types";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { APIClient } from "../../../../helpers/api-client";

const api = new APIClient();
export const AccountLedgerManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    formState: postData,
    handleSubmit,
    handleFieldChange,
    handleClear,
    getFieldProps,
    isLoading
  } = useFormManager<AccountLedgerData>({
    url: Urls.account_ledger,
    onSuccess: useCallback(() => dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.accountLedger.key,
    useApiClient: true,
    initialData: initialAccountLedger
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }));
  }, [dispatch]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.getAsync(Urls.data_getNextLedgerCode);
      if (res) {
        handleFieldChange("ledgerCode", res.toString());
      }
    } catch (error) {
      console.error("Failed to fetch the next ledger code:", error);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps('ledgerCode')}
          type="string"
          label={t("code")}
          placeholder={t("enter_code")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('ledgerCode', data.ledgerCode)}
        />
        <ERPInput
          {...getFieldProps('ledgerName')}
          label={t("name")}
          placeholder={t("enter_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('ledgerName', data.ledgerName)}
        />
        <ERPInput
          {...getFieldProps('aliasName')}
          label={t("alias_name")}
          placeholder={t("enter_alias_name")}
          onChangeData={(data: any) => handleFieldChange('aliasName', data.aliasName)}
        />
        <ERPInput
          {...getFieldProps('arabicName')}
          label={t("name_in_arabic")}
          placeholder={t("enter_name_in_arabic")}
          onChangeData={(data: any) => handleFieldChange('arabicName', data.arabicName)}
        />
        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data.accGroupID);
          }}
          label={t("group_under")}
        />
        <ERPInput
          {...getFieldProps('opBalance')}
          label={t("opening_balance")}
          type="number"
          onChangeData={(data: any) => handleFieldChange('opBalance', data.opBalance)}
        />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="w-full mt-5">
          <ERPDataCombobox
            {...getFieldProps("drCr")}
            field={{
              id: "drCr",
              valueKey: "value",
              labelKey: "label",
            }}
            onChangeData={(data: any) => handleFieldChange("drCr", data.drCr)}
            label=" "
            options={[
              { value: 'Dr', label: t('Dr') },
              { value: 'Cr', label: t('Cr') },
            ]}
          />
        </div>
        <div className="w-full">
          <ERPInput
            {...getFieldProps('remarks')}
            label={t("remarks")}
            placeholder={t("enter_remarks")}
            onChangeData={(data: any) => handleFieldChange('remarks', data.remarks)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <ERPCheckbox
          {...getFieldProps("isBillwiseApplicable")}
          label={t("bill_wise_applicable")}
          onChangeData={(data: any) => handleFieldChange("isBillwiseApplicable", data.isBillwiseApplicable)}
        />
        <ERPCheckbox
          {...getFieldProps("isActive")}
          label={t("active")}
          onChangeData={(data: any) => handleFieldChange("isActive", data.isActive)}
        />
        {/* <ERPCheckbox
          {...getFieldProps("isEditable")}
          label={t("editable")}
          onChangeData={(data: any) => handleFieldChange("isEditable", data.isEditable)}
        />
        <ERPCheckbox
          {...getFieldProps("isDeletable")}
          label={t("deletable")}
          onChangeData={(data: any) => handleFieldChange("isDeletable", data.isDeletable)}
        /> */}
        <ERPCheckbox
          {...getFieldProps("isCostCentreApplicable")}
          label={t("cost_center_applicable")}
          onChangeData={(data: any) => handleFieldChange("isCostCentreApplicable", data.isCostCentreApplicable)}
        />
        <ERPCheckbox
          {...getFieldProps("isCommon")}
          label={t("is_common")}
          onChangeData={(data: any) => handleFieldChange("isCommon", data.isCommon)}
        />
      </div>

      <div className="w-full p-2 flex justify-center space-x-2 mt-5">
        <ERPFormButtons
          onClear={handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
