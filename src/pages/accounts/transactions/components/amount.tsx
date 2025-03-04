import React, { useRef } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface AmountProps extends AccVoucherElementProps { }

const Amount = React.forwardRef<HTMLInputElement, AmountProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown
}, ref) => {

  const amountRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {formState.formElements.amount.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={amountRef}
          id="amount"
          boldInput={true}
          label={t(formState.formElements.amount.label)}
          type="number"
          required={true}
          min={0}
          value={formState.row.amount}
          onKeyDown={(e) => {
            handleKeyDown(e, "amount");
          }}
          disableEnterNavigation={true}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: {
                  amount:
                    e.target?.value !== "" && !e.target?.value.endsWith(".")
                      // ? parseFloat(e.target?.value)
                      ? e.target?.value
                      : e.target?.value,
                },
              })
            )
          }
          disabled={
            formState.formElements.amount?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(Amount);
