import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";

interface CashPaidSectionProps extends VoucherElementProps {
  focusDiscount: () => void;
  focusAmount: () => void;
}

const CashPaidSection = React.forwardRef<HTMLInputElement, CashPaidSectionProps>(
  ({ formState, dispatch, t, focusDiscount, focusAmount }, ref) => {
    // Debounced input for cashReceived
    const { value, onChange } = useDebouncedInput(
      formState.transaction.master.cashReceived || '',
      (debouncedValue) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { cashReceived: debouncedValue },
          })
        );
      },
      300
    );

    const isDisabled =
      formState.formElements.hasCashPaid?.disabled ||
      formState.formElements.pnlMasters?.disabled;

    const inputDisabled =
      formState.transaction.master.hasCashPaid !== true ||
      formState.formElements.cashPaid?.disabled ||
      formState.formElements.pnlMasters?.disabled;

    return (
      <div className="flex flex-col gap-0">
        <ERPCheckbox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="hasCashPaid"
          className="text-left"
          label={t(formState.formElements.hasCashPaid.label)}
          checked={formState.transaction.master.hasCashPaid}
          onChange={(e) => {
            const isChecked = e.target.checked;
            dispatch(
              formStateMasterHandleFieldChange({
                fields: { hasCashPaid: isChecked, cashReceived: isChecked? formState.transaction.master.grandTotal : "0.0" },
              })
            );
            isChecked ? focusDiscount() : focusAmount();
          }}
          disabled={isDisabled}
        />

        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          fetching={formState.transactionLoading}
          id="cashReceived"
          type="number"
          min={0}
          noLabel
          value={value}
          className="max-w-[110px] min-w-[110px] !m-0"
          onChange={(e) => onChange(e.target.value)}
          disabled={inputDisabled}
          ref={ref}
        />
      </div>
    );
  }
);

export default React.memo(CashPaidSection);