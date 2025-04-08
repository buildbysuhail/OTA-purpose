import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange } from "../reducer";

interface AdjustmentAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
}

const AdjustmentAmountInput: React.FC<AdjustmentAmountInputProps> = ({
  formState,
  t,
  handleKeyDown,
}) => {
  const dispatch = useAppDispatch();

  return (
    <ERPInput
      localInputBox={formState?.userConfig?.inputBoxStyle}
      id="adjustmentAmount"
      type="number"
      label={t(formState.formElements.adjustmentAmount.label)}
      value={formState.transaction.master.adjustmentAmount}
      disableEnterNavigation={true}
      onKeyDown={(e) => {
        handleKeyDown && handleKeyDown(e, "adjustmentAmount");
      }}
      onChange={(e) =>
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { adjustmentAmount: e.target?.value },
          })
        )
      }
      disabled={
        formState.formElements.adjustmentAmount?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
    />
  );
};

export default React.memo(AdjustmentAmountInput);
