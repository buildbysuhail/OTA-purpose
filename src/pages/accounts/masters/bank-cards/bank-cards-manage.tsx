import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleBankCardsPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { BankCardsData, initialBankCards } from "./bank-cards-type";

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
    url: Urls.data_Bank_Cards,
    onSuccess: useCallback(() => dispatch(toggleBankCardsPopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    key: rootState.PopupData.bankCard.key,
    useApiClient: true,
    initialData: initialBankCards,
  });

  const onClose = useCallback(() => {
    dispatch(toggleBankCardsPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("paymentType")}
          field={{
            id: "paymentType",
            required: true,
            getListUrl: Urls.data_Bank_Cards,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("paymentType", data)
          }}
          label={("Debit Cards")}
        />
        <ERPInput
          {...getFieldProps('paymentName')}
          label= "Card Name"
          placeholder= "Card Name"
          required={true}
          onChangeData={(data: any) => {  handleFieldChange('paymentName', data) }}
        />
        <ERPDataCombobox
          {...getFieldProps("ledgerID")}
          field={{
            id: "ledgerID",
            required: true,
            getListUrl: Urls.data_Bank_Cards,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("ledgerID", data)
          }}
          label={("Ledger")}
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label= "Remark"
          placeholder= "Remark"
          required={true}
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
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