import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleBankCardsPopup, toggleUpi } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { initialUpi, UpiData } from "./upi-type";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { Countries } from "../../../../redux/slices/user-session/reducer";

export const UpiManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClear,
    isLoading,
    handleClose,
  } = useFormManager<UpiData>({
    url: Urls.upi,
    onClose: useCallback(() => dispatch(toggleUpi({ isOpen: false, key: null,reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleUpi({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.upi.key,
    keyField: "paymentTypeID",
    useApiClient: true,
    initialData: initialUpi,
    loadDataRequired: true
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
            labelKey: "label"
          }}
          onChange={(data: any) => {  handleFieldChange({ paymentType: data.value, paymentName: data.label })}}
          label={userSession.countryId == Countries.India ? t("upi") : t("qr_pay")}
          options={[
            { value: 'AMAZON_PAY', label: 'AMAZON PAY' },
            { value: 'GOOGLE_PAY', label: 'GOOGLE PAY' },
            { value: 'PHONEPE', label: 'PHONE PAY' },
            { value: 'WHATSAPP', label: 'WHATSAPP' },
            { value: 'BAJAJ_FINSERV', label: 'BAJAJ FINSERV' },
            { value: 'BAJAJ_MARKETS', label: 'BAJAJ MARKETS' },
            { value: 'CRED', label: 'CRED' },
            { value: 'FAVE_PINELABS', label: 'FAVE (PINELABS)' },
            { value: 'GOIBIBO', label: 'GOIBIBO' },
            { value: 'GROWW', label: 'GROWW' },
            { value: 'JUPITER_MONEY', label: 'JUPITER MONEY' },
            { value: 'KIWI', label: 'KIWI' },
            { value: 'MAKE_MY_TRIP', label: 'MAKE MY TRIP' },
            { value: 'MOBIKWIK', label: 'MOBIKWIK' },
            { value: 'NAVI', label: 'NAVI' },
            { value: 'NIYO_GLOBAL', label: 'NIYO GLOBAL' },
            { value: 'SAMSUNG_PAY', label: 'SAMSUNG PAY' },
            { value: 'SHRIRAM_ONE', label: 'SHRIRAM ONE' },
            { value: 'SLICE', label: 'SLICE' },
            { value: 'TATANEU', label: 'TATANEU' },
            { value: 'TIMEPAY', label: 'TIMEPAY' },
            { value: 'TVAM_ATYATI', label: 'TVAM (ATYATI)' },
            { value: 'YUVAPAY', label: 'YUVAPAY' },
            { value: 'ZOMATO', label: 'ZOMATO' }
          ]}
        />

        <ERPInput
          {...getFieldProps('paymentName')}
          label={userSession.countryId == Countries.India ? t("upi_name") : t("qr_pay_name")}
          placeholder={userSession.countryId == Countries.India ? t("upi_name") : t("qr_pay_name")}
          onChangeData={(data: any) => handleFieldChange('paymentName', data.paymentName)}
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
          onChangeData={(data: any) => {  handleFieldChange("ledgerID", data.ledgerID)}}
          label={t("ledger")}
        />
        
        <ERPInput
          {...getFieldProps('remark')}
          label={t("remarks")}
          placeholder={t("remarks")}
          // required={true}
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