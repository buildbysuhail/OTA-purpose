import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface WarehouseIDProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const WarehouseID = React.forwardRef<HTMLInputElement, WarehouseIDProps>(
  ({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown }, ref) => {
    const displayType = formState.transaction.master.voucherType === "BTO" ? "StockWareHouse" : "All";
    return (
      <>
      {
        formState.formElements.cbWarehouse.visible == true && 
        (
          <ERPDataCombobox
        localInputBox={formState?.userConfig?.inputBoxStyle}
        fetching={formState.transactionLoading}
        enableClearOption={false}
        id="warehouseID"
        className="min-w-[180px] !m-0"
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
          getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/Warehouses?DisplayType=${displayType}`
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
        )
      }
      </>
    );
  }
);

export default React.memo(WarehouseID);
