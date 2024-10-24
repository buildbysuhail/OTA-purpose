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


export const UpiManage: React.FC = React.memo(() => {
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
  } = useFormManager<UpiData>({
    url: Urls.data_Bank_Cards,
    onSuccess: useCallback(() => dispatch(toggleUpi({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.upi.key,
    useApiClient: true,
    initialData: initialUpi,
  });

  const onClose = useCallback(() => {
    dispatch(toggleUpi({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
    
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
            handleFieldChange("ledgerID", data.ledgerID)
          }}
          label={t("upi")}
        />
         <ERPInput
          {...getFieldProps('remarks')}
          label={t("upi_name")}
          placeholder={t("upi_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('remarks', data.remarks)}
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
            handleFieldChange("ledgerID", data.ledgerID)
          }}
          label={t("ledger")}
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label={t("remarks")}
          placeholder={t("remarks")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('remarks', data.remarks)}
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