import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";

interface RemarksInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
}

const RemarksInput = React.forwardRef<HTMLInputElement, RemarksInputProps>(
  ({ formState, dispatch, t, handleKeyDown }, ref) => {
    // Debounced input for remarks
    const { value, onChange } = useDebouncedInput(
      formState.transaction.master.remarks || '',
      (debouncedValue) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { remarks: debouncedValue },
          })
        );
      },
      300
    );

    return (
      <ERPInput
        localInputBox={formState?.userConfig?.inputBoxStyle}
        fetching={formState.transactionLoading}
        id="remarks"
        className="!m-0"
        required={true}
        label={t(formState.formElements.remarks.label)}
        value={value}
        disableEnterNavigation={true}
        onKeyDown={(e) => {
          handleKeyDown?.(e, "remarks");
        }}
        onChange={(e) => onChange(e.target.value)}
        disabled={
          formState.formElements.remarks?.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
        ref={ref}
      />
    );
  }
);

export default React.memo(RemarksInput);