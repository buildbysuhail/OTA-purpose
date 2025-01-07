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
    handleClose
  } = useFormManager<BankCardsData>({
    url: Urls.bankCards,
    onSuccess: useCallback(() => dispatch(toggleBankCardsPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    onClose: useCallback(() => dispatch(toggleBankCardsPopup({ isOpen: false, key: null,reload: false })), [dispatch]),
    key: rootState.PopupData.bankCard.key,
    keyField: "paymentTypeID",
    useApiClient: true,
    loadDataRequired: true,
    initialData: initialBankCards,
  });
  const { t } = useTranslation("masters");

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("paymentType")}
          field={{
            id: "paymentType",

            valueKey: "value",
            labelKey: "label",
          }}
          onChange={(data: any) => {
            
            handleFieldChange({ paymentType: data.value, paymentName: data.label })
          }}
          label={t("bank_cards")}
          options={[
            { value: 'VISA', label: 'VISA' },
            { value: 'MASTER_CARD', label: 'MASTER CARD' },
            { value: 'MAESTRO', label: 'MAESTRO' },
            { value: 'AMERICAN_EXPRESS', label: 'AMERICAN EXPRESS' },
            { value: 'DISCOVER', label: 'DISCOVER' },
            { value: 'HDFC_CARD', label: 'HDFC CARD' },
            { value: 'RUPAY_CARDS', label: 'RUPAY CARDS' },
            { value: 'AXIS_CARD', label: 'AXIS CARD' },
            { value: 'PLATINUM_CARD', label: 'PLATINUM CARD' },
            { value: 'HDFC_BANK_REWARDS_CARD', label: 'HDFC BANK REWARDS CARD' },
            { value: 'TIMES_POINTS_CARD', label: 'TIMES POINTS CARD' },
            { value: 'CLASSIC_ONE_CARD', label: 'CLASSIC ONE CARD' },
            { value: 'EASYSHOP_NRO_CARD', label: 'EASYSHOP NRO CARD' },
            { value: 'HDFC_CARD', label: 'HDFC CARD' },
            { value: 'ICICI_CARD', label: 'ICICI CARD' },
            { value: 'SBI_CARD', label: 'SBI CARD' },
            { value: 'YES_BANK_CARD', label: 'YES BANK CARD' },
            { value: 'PRIORITY_CARD', label: 'PRIORITY CARD' },
            { value: 'HSBC_CARD', label: 'HSBC CARD' },
            { value: 'SBI_CARD', label: 'SBI CARD' },
            { value: 'DELIGHT_CARD', label: 'DELIGHT CARD' },
            { value: 'HPCL_CARD', label: 'HPCL CARD' },
            { value: 'INDUSIND_BANK', label: 'INDUSIND BANK' },
            { value: 'AXIS_BANK_BURGUNDY_CARD', label: 'AXIS BANK BURGUNDY CARD' },
            { value: 'IDBI_MASTERCARD_CLASSIC_CARD', label: 'IDBI MASTERCARD CLASSIC CARD' },
            { value: 'EASYSHOP_CARD', label: 'EASYSHOP CARD' },
            { value: 'PRESTIGE_CARD', label: 'PRESTIGE CARD' }
          ]}

        />
        <ERPInput
          {...getFieldProps('paymentName')}
          label={t("card_name")}
          placeholder={t("card_name")}
          required={true}
          onChangeData={(data: any) => { handleFieldChange('paymentName', data.paymentName) }}
        />
        <ERPDataCombobox
          {...getFieldProps("ledgerID")}
          field={{
            id: "ledgerID",
            required: true,
            getListUrl: Urls.data_BankAccounts,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("ledgerID", data.ledgerID)
          }}
          label={t("ledger")}
        />
        <ERPInput
          {...getFieldProps('remark')}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange('remark', data.remark)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});