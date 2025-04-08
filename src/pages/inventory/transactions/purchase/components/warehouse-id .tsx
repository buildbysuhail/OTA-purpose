import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import Urls from "../../../../../redux/urls";

interface WarehouseIDProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const WarehouseID = React.forwardRef<HTMLInputElement, WarehouseIDProps>(
  ({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown }, ref) => {
    return (
      <ERPDataCombobox
        localInputBox={formState?.userConfig?.inputBoxStyle}
        enableClearOption={false}
        id="warehouseID"
        className="min-w-[180px]"
        label={t(formState.formElements.cbWarehouseID.label)}
        data={formState.transaction.master}
        onSelectItem={(e: { label: string; value: string | number }) => {
          dispatch(
            formStateMasterHandleFieldChange({
              fields: {
                fromWarehouseID: e.value,
              },
            })
          );
          handleFieldKeyDown("warehouseID", "Enter");
        }}
        value={formState.transaction.master.fromWarehouseID}
        field={{
          id: "warehouseID",
          valueKey: "id",
          labelKey: "name",
          getListUrl: Urls.data_warehouse,
        }}
        disabled={
          formState.formElements.cbWarehouseID.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
        disableEnterNavigation
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          handleKeyDown?.(e, "warehouse");
        }}
      />
    );
  }
);

export default React.memo(WarehouseID);
