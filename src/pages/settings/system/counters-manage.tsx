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
import { CounterData } from "./counters-manage-type";

export const CounterManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<CounterData>({
    url: Urls.Counter,
    onSuccess: useCallback(
      () => dispatch(toggleCounterPopup({ isOpen: false, key: null })),
      [dispatch]
    ),
    key: rootState.PopupData.counter.key,
  });

  const onClose = useCallback(() => {
    dispatch(toggleCounterPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("counterName")}
          label=" Counter Name"
          placeholder=" Counter Name"
          required={true}
          onChangeData={(data: any) => {
            debugger;
            handleFieldChange("counterName", data);
          }}
        />
        <ERPInput
          {...getFieldProps("descriptions")}
          label="Descriptions"
          placeholder="Descriptions"
          required={true}
          onChangeData={(data: any) => handleFieldChange("descriptions", data)}
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
          label="Warehouse ID"
          required={true}
          onChangeData={(data: any) => handleFieldChange("warehouseID", data)}
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
          label="cashLedgerID"
          required={true}
          onChangeData={(data: any) => handleFieldChange("cashLedgerID", data)}
        />
         <ERPCheckbox
           id="maintainShift"
           label="Maintain Shift"
         
         /> 

      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
