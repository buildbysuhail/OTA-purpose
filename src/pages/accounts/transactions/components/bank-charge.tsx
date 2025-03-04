import React from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";


interface BankChargeProps extends AccVoucherElementProps { }

const BankCharge = React.forwardRef<HTMLInputElement, BankChargeProps>(({
  formState,
  dispatch,
  t,
}, ref) => {
  return (
    <>
      {formState.formElements.bankCharge.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="bankCharge"
          label={t(formState.formElements.bankCharge.label)}
          value={formState.row.bankCharge}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { bankCharge: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.bankCharge?.disabled ||
            formState.formElements.bankCharge?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(BankCharge);