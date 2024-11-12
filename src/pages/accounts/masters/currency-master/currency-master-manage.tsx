import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  toggleCurrencyMasterPopup,
} from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { CurrencyData, initialCurrency } from "./currency-master-manage-type";

export const CurrencyMasterManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading,handleClose } =
    useFormManager<CurrencyData>({
      url: Urls.account_currency_master,
      onClose:useCallback(() => dispatch(toggleCurrencyMasterPopup({ isOpen: false, key: null,})), [dispatch]),
      onSuccess: useCallback(() => dispatch(toggleCurrencyMasterPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
      key: rootState.PopupData.currencyMaster.key,
      keyField:"currencyId",
      useApiClient: true,
      initialData: initialCurrency,
    });


  const { t } = useTranslation();
  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-3 gap-3">
        <ERPDataCombobox
          {...getFieldProps("countryID")}
          field={{
            id: "countryID",
            required: true,
            getListUrl: Urls.data_countries,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("countryID", data.countryID);
          }}
          label={t("country")}
        />
        <ERPInput
          {...getFieldProps("currencyCode")}
          label={t("currency_code")}
          placeholder={t("currency_code")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("currencyCode", data.currencyCode)
          }
        />
        <ERPInput
          {...getFieldProps("currencyName")}
          label={t("currency_name")}
          placeholder={t("currency_name")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("currencyName", data.currencyName)
          }
        />
        <ERPInput
          {...getFieldProps("currencySymbol")}
          label={t("currency_symbol")}
          placeholder={t("currency_symbol")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("currencySymbol", data.currencySymbol)
          }
        />
        <ERPInput
          {...getFieldProps("subUnit")}
          label={t("sub_unit")}
          placeholder={t("sub_unit")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("subUnit", data.subUnit)
          }
        />
        <ERPInput
          {...getFieldProps("subUnitSymbol")}
          label={t("sub_unit_symbol")}
          placeholder={t("sub_unit_symbol")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("subUnitSymbol", data.subUnitSymbol)
          }
        />
        {/* <ERPCheckbox
          {...getFieldProps("isEdit")}
          label="isEdit"
          onChangeData={(data: any) => handleFieldChange("isEdit", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isDelete")}
          label="isDelete"
          onChangeData={(data: any) => handleFieldChange("isDelete", data)}
        /> */}
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
