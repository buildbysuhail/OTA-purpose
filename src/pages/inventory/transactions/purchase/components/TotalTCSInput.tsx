import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateTransactionMaster3HandleFieldChange } from "../reducer";

interface TotalTCSInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
}

const TotalTCSInput: React.FC<TotalTCSInputProps> = ({
  formState,
  t,
  handleKeyDown,
}) => {
  const dispatch = useAppDispatch();

  return (
    <ERPInput
      localInputBox={formState?.userConfig?.inputBoxStyle}
      id="totTCS"
      type="number"
      label={t(formState.formElements.totTCS.label)}
      value={formState.transaction.master.other.totTCS}
      disableEnterNavigation={true}
      onKeyDown={(e) => {
        handleKeyDown && handleKeyDown(e, "totTCS");
      }}
      onChange={(e) =>
        dispatch(
          formStateTransactionMaster3HandleFieldChange({
            fields: { totTCS: e.target?.value },
          })
        )
      }
      disabled={
        formState.formElements.totTCS?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
    />
  );
};

export default React.memo(TotalTCSInput);
