import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../../purchase/reducer";
import Urls from "../../../../../redux/urls";

interface WarehouseProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const Warehouse = React.forwardRef<HTMLInputElement, WarehouseProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {
  return (
    <>
      {formState.formElements.warehouseID.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="warehouseID"
          className="min-w-[180px]"
          label={t(formState.formElements.warehouseID.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
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
            formState.formElements.warehouseID.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e: any) => {
            handleKeyDown && handleKeyDown(e, "warehouse");
          }}
        />
      )}
    </>
  );
});

export default React.memo(Warehouse);
