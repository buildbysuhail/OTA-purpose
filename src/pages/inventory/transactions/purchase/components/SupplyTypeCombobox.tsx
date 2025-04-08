import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";

interface SupplyTypeComboboxProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  handleFieldKeyDown: (field: string, key: string) => void;
}

const SupplyTypeCombobox: React.FC<SupplyTypeComboboxProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
  handleFieldKeyDown,
}) => {
  return (
    <ERPDataCombobox
      localInputBox={formState?.userConfig?.inputBoxStyle}
      enableClearOption={false}
      id="supplyType"
      className="min-w-[180px]"
      label={t(formState.formElements.supplyType.label)}
      data={formState.transaction.master}
      onSelectItem={(e) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: {
              supplyType: e.value,
            },
          })
        );
        handleFieldKeyDown("supplyType", "Enter");
      }}
      value={formState.transaction.master.supplyType}
      field={{
        id: "supplyType",
        valueKey: "value",
        labelKey: "label",
      }}
      options={[
        { value: 0, label: "Regular" },
        { value: 1, label: "Composite" },
        { value: 2, label: "Unregistered" },
        { value: 3, label: "Unregistered + RCM" },
        { value: 4, label: "Foreign non-Resident Taxpayer" },
        { value: 5, label: "Input Service distributor" },
        { value: 6, label: "Tax Deductor" },
        { value: 7, label: "E-commerce Operator" },
        { value: 8, label: "Government Departments" },
        { value: 9, label: "SEZ supplies with payment" },
        { value: 10, label: "SEZ supplies without payment" },
        { value: 11, label: "Deemed Exp" },
        { value: 12, label: "Intra-State supplies attracting IGST" },
      ]}
      disabled={
        formState.formElements.supplyType.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
      disableEnterNavigation
      onKeyDown={(e: any) => {
        handleKeyDown && handleKeyDown(e, "supplyType");
      }}
    />
  );
};

export default React.memo(SupplyTypeCombobox);
