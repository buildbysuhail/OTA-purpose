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
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { BankCardsData } from "./bank-cards-type";
import { initialAccountGroup } from "../account-groups/account-group-types";

export const BankCardsManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClear,
    isLoading,
    formState
  } = useFormManager<BankCardsData>({
    url: Urls.account_group,
    onSuccess: useCallback(() => dispatch(toggleAccountGroupPopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    key: rootState.PopupData.accountGroup.key,
    useApiClient: true,
    initialData: initialAccountGroup,
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
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
            handleFieldChange("accGroupID", data)
          }}
          // label={t("group_under")}
          label={("Debit Cards")}
        />
        <ERPInput
          {...getFieldProps('accGroupName')}
          label= "Card Name"
          placeholder= "Card Name"
          required={true}
          onChangeData={(data: any) => {  handleFieldChange('accGroupName', data) }}
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
            handleFieldChange("accGroupID", data)
          }}
          // label={t("group_under")}
          label={("Ledger")}
        />
        <ERPInput
          {...getFieldProps('arabicName')}
          label= "Remark"
          placeholder= "Remark"
          required={true}
          onChangeData={(data: any) => handleFieldChange('arabicName', data)}
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