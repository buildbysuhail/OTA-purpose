import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialWarehouseData, WarehouseData } from "./warehouse-manage-type";
import { toggleWarehouse } from "../../../../redux/slices/popup-reducer";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";

export const WarehouseManage: React.FC = React.memo(() => {
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
  } = useFormManager<WarehouseData>({
    url: Urls.Warehouse,
    onClose: useCallback(() => dispatch(toggleWarehouse({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback((res:WarehouseData) => dispatch(toggleWarehouse({ isOpen: false, key: null, reload: true ,id:res.warehouseID,name:res.warehouseName})), [dispatch]),
    key: rootState.PopupData.warehouse.key,
    useApiClient: true,
    initialData: initialWarehouseData
  });
  const { t } = useTranslation('inventory');

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("warehouseName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("warehouseName", data.warehouseName);
          }}
          readOnly={rootState.PopupData.warehouse.mode == "view"}
          autoFocus={true}
        />

        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
          readOnly={rootState.PopupData.warehouse.mode == "view"}
        />

        <ERPCheckbox
          {...getFieldProps('isStockWarehouse')}
          label={t("is_stock_warehouse")}
          onChangeData={(data: any) => handleFieldChange('isStockWarehouse', data.isStockWarehouse)}
          disabled={rootState.PopupData.warehouse.mode == "view"}
        />

        <ERPDataCombobox
          {...getFieldProps("warehouseType")}
          field={{
            id: "warehouseType",
            valueKey: "value",
            labelKey: "label",
          }}
          onChangeData={(data: any) => handleFieldChange("warehouseType", data.warehouseType)}
          label={t('warehouse_type')}
          options={[
            { value: 'Physical', label: t('physical') },
            { value: 'Van', label: t('van') },
          ]}
          disabled={rootState.PopupData.warehouse.mode == "view"}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
          readOnly={rootState.PopupData.warehouse.mode == "view"}
        />

        <ERPDataCombobox
          {...getFieldProps("cashLedgerID")}
          id="cashLedgerID"
          field={{
            id: "cashLedgerID",
            required: true,
            getListUrl: Urls.data_cashLedger,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("cash_ledger")}
          onChangeData={(data: any) => handleFieldChange("cashLedgerID", data.cashLedgerID)}
          disabled={rootState.PopupData.warehouse.mode == "view"}
        />
      </div>
      <ERPFormButtons
        onClear={rootState.PopupData.warehouse.mode == "view" ? undefined : handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={rootState.PopupData.warehouse.mode == "view" ? undefined : handleSubmit}
      />
    </div>
  );
});
