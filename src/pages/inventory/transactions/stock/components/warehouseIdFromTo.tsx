import React, { useEffect, useRef } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";
import VoucherType from "../../../../../enums/voucher-types";
import { APIClient } from "../../../../../helpers/api-client";

const api = new APIClient();

interface WarehouseIDProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  warehouseType?: "from" | "to";
  label?: string;
}

export enum StockType {
  All = "All",
  NonStockWareHouse = "NonStockWareHouse",
  StockWareHouse = "StockWareHouse"
}

const WarehouseIDFromTo = React.forwardRef<HTMLInputElement, WarehouseIDProps>(
  ({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown, warehouseType = "from", label }, ref) => {
    const isFromWarehouse = warehouseType === "from";
    const fieldKey = isFromWarehouse ? "fromWarehouseID" : "toWarehouseID";
    const fieldId = isFromWarehouse ? "fromWarehouseID" : "toWarehouseID";
    const rawValue = isFromWarehouse
      ? formState.transaction.master.fromWarehouseID
      : formState.transaction.master.toWarehouseID;

    const voucherType = formState.transaction.master.voucherType;
    const isDamageEntryToWarehouse =
      voucherType === VoucherType.DamageEntry && warehouseType === "to";
    const isExcessStockFromWarehouse =
      voucherType === VoucherType.ExcessStock && warehouseType === "from";
    const isShortageStockToWarehouse =
      voucherType === VoucherType.ShortageStock && warehouseType === "to";

    // Determine if this field needs a special warehouse
    const needsSpecialWarehouse =
      isDamageEntryToWarehouse || isExcessStockFromWarehouse || isShortageStockToWarehouse;

    // Get the warehouse name to search for based on voucher type
    const getSpecialWarehouseName = (): string | null => {
      if (isDamageEntryToWarehouse) return "damage stock";
      if (isExcessStockFromWarehouse) return "excess stock";
      if (isShortageStockToWarehouse) return "shortage stock";
      return null;
    };

    // Store the special warehouse ID
    const specialWarehouseId = useRef<number | null>(null);

    // Fetch and set special warehouse based on voucher type
    useEffect(() => {
      const fetchSpecialWarehouse = async () => {
        const warehouseName = getSpecialWarehouseName();
        if (needsSpecialWarehouse && warehouseName && specialWarehouseId.current === null) {
          try {
            const response = await api.get(Urls.data_warehouse);
            const warehouses = response as { id: number; name: string }[];
            const specialWarehouse = warehouses?.find(
              (w) => w.name?.toLowerCase() === warehouseName
            );
            if (specialWarehouse) {
              specialWarehouseId.current = specialWarehouse.id;
              dispatch(
                formStateMasterHandleFieldChange({
                  fields: {
                    [fieldKey]: specialWarehouse.id,
                  },
                })
              );
            }
          } catch (error) {
            console.error(`Failed to fetch ${warehouseName} warehouse:`, error);
          }
        } else if (needsSpecialWarehouse && specialWarehouseId.current !== null) {
          // If we already have the ID and the current value is different, reset it
          if (rawValue !== specialWarehouseId.current) {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  [fieldKey]: specialWarehouseId.current,
                },
              })
            );
          }
        }
      };

      fetchSpecialWarehouse();
    }, [needsSpecialWarehouse, dispatch, rawValue, fieldKey]);

    // Reset the ref when voucher type changes
    useEffect(() => {
      if (!needsSpecialWarehouse) {
        specialWarehouseId.current = null;
      }
    }, [needsSpecialWarehouse]);

    // Use -2 to auto-select first item when value is null/undefined/0, but not for special warehouses
    const currentValue =
      needsSpecialWarehouse && specialWarehouseId.current !== null
        ? specialWarehouseId.current
        : (rawValue === null || rawValue === undefined || rawValue === 0 ? -2 : rawValue);
    const baseLabel = label ?? t(formState.formElements.cbWarehouseID.label);
    const displayLabel = formState.transaction.master.voucherType === "ILR" ? `${baseLabel}/${t("van")}`: baseLabel;

    let comboType = ""
    if(formState.transaction.master.voucherType === "ST" && warehouseType === "from"){
      comboType = StockType.All
    }else if(formState.transaction.master.voucherType === "ST" && warehouseType === "to"){
      comboType = StockType.StockWareHouse
    }

    return (
      <>
      {
        formState.formElements.cbWarehouse.visible == true &&
        (
          <ERPDataCombobox
            ref={ref}
            localInputBox={formState?.userConfig?.inputBoxStyle}
            fetching={formState.transactionLoading}
            enableClearOption={false}
            id={fieldId}
            className="min-w-[180px]"
            label={displayLabel}
            data={formState.transaction.master}
            onSelectItem={(e: { label: string; value: string | number }) => {
              dispatch(
                formStateMasterHandleFieldChange({
                  fields: {
                    [fieldKey]: e.value,
                  },
                })
              );
              handleFieldKeyDown(fieldId, "Enter");
            }}
            value={currentValue}
            field={{
              id: fieldId,
              valueKey: "id",
              labelKey: "name",
              getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/Warehouses?DisplayType=${comboType}`,
            }}
            disabled={
              formState.formElements.cbWarehouseID.disabled ||
              formState.formElements.pnlMasters?.disabled ||
              needsSpecialWarehouse
            }
            disableEnterNavigation
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              handleKeyDown?.(e, fieldId);
            }}
          />
        )
      }
      </>
    );
  }
);

export default React.memo(WarehouseIDFromTo);
