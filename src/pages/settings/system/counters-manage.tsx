import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleCounterPopup } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { CounterData, initialDataCounter } from "./counters-manage-type";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";

export const CounterManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<CounterData>({
    url: Urls.Counter,
    onClose:useCallback(() => dispatch(toggleCounterPopup({ isOpen: false, key: null,})), [dispatch]),
    onSuccess: useCallback(
      () => dispatch(toggleCounterPopup({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.counter.key,
    useApiClient: true,
    initialData: initialDataCounter
  });

  const onClose = useCallback(() => {
    dispatch(toggleCounterPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("counterName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("counterName", data.counterName);
          }}
        />
        <ERPInput
          {...getFieldProps("descriptions")}
          label={t("descriptions")}
          placeholder={t("descriptions")}
          onChangeData={(data: any) => handleFieldChange("descriptions", data.descriptions)}
        />
        <ERPDataCombobox
          {...getFieldProps("warehouseID")}
          id="warehouseID"
          noXMarkIcon={true}
          field={{
            id: "warehouseID",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("warehouse")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("warehouseID", data.warehouseID)}
        />
        <ERPDataCombobox
          {...getFieldProps("cashLedgerID")}
          id="cashLedgerID"
          noXMarkIcon={true}
          field={{
            id: "cashLedgerID",
            required: true,
            getListUrl: Urls.data_CashLedgers,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("cash_ledger")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("cashLedgerID", data.cashLedgerID)}
        />
        {applicationSettings?.branchSettings?.maintainCounterWisePrefixForTransaction &&
          <ERPInput
            {...getFieldProps("vrPrefix")}
            label={t("vr_prefix")}
            placeholder={t("vr_prefix")}
            onChangeData={(data: any) => {
              handleFieldChange("vrPrefix", data.vrPrefix);
            }}
          />
        } 
        <ERPCheckbox
          {...getFieldProps('maintainShift')}
          label={t("maintain_shift")}
          onChangeData={(data: any) => handleFieldChange('maintainShift', data.maintainShift)}
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
