import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleProductGroup } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { initialProductGroupData, ProductGroupData } from "./products-group-manage-type";

export const ProductGroupManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<ProductGroupData>({
    url: Urls.productGroup,
    onSuccess: useCallback(
      () => dispatch(toggleProductGroup({ isOpen: false, key: null ,reload:true })),
      [dispatch]
    ),
    key: rootState.PopupData.productGroup.key,
    useApiClient: true,
    initialData: initialProductGroupData
  });

  const onClose = useCallback(() => {
    dispatch(toggleProductGroup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("counterName")}
          label={t("counter_name")}
          placeholder={t("counter_name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("counterName", data.counterName);
          }}
        />
        <ERPInput
          {...getFieldProps("descriptions")}
          label={t("descriptions")}
          placeholder={t("descriptions")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("descriptions", data.descriptions)}
        />
        <ERPDataCombobox
          {...getFieldProps("warehouseID")}
          id="warehouseID"
          field={{
            id: "warehouseID",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("warehouse_id")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("warehouseID", data.warehouseID)}
        />
        <ERPDataCombobox
          {...getFieldProps("cashLedgerID")}
          id="cashLedgerID"
          field={{
            id: "cashLedgerID",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("cashLedger_id")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("cashLedgerID", data.cashLedgerID)}
        />
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
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
