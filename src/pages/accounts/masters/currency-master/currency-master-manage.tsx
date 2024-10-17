import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  toggleCurrencyMasterPopup,
  togglePartyCategoryPopup,
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

export const PartyCategoryManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<CurrencyData>({
      url: Urls.account_currency_master,
      // onSuccess: useCallback(
      //   () => dispatch(togglePartyCategoryPopup({ isOpen: false, key: null })),
      //   [dispatch]
      // ),
      onSuccess: useCallback(() => dispatch(toggleCurrencyMasterPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
      key: rootState.PopupData.currencyMaster.key,
      useApiClient: true,
      initialData: initialCurrency,
    });

  const onClose = useCallback(() => {
    dispatch(toggleCurrencyMasterPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();
  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
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
            handleFieldChange("countryID", data);
          }}
          label={t("country")}
        />
        <ERPInput
          {...getFieldProps("currencyCode")}
          label={t("currency_code")}
          placeholder={t("currency_code")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("currencyCode", data)
          }
        />
        <ERPInput
          {...getFieldProps("currencyName")}
          label={t("currency_name")}
          placeholder={t("currency_name")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("currencyName", data)
          }
        />
        <ERPInput
          {...getFieldProps("currencySymbol")}
          label={t("currency_symbol")}
          placeholder={t("currency_symbol")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("currencySymbol", data)
          }
        />
        <ERPInput
          {...getFieldProps("subUnit")}
          label={t("sub_unit")}
          placeholder={t("sub_unit")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("subUnit", data)
          }
        />
        <ERPInput
          {...getFieldProps("subUnitSymbol")}
          label={t("sub_unit_symbol")}
          placeholder={t("sub_unit_symbol")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("subUnitSymbol", data)
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
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
