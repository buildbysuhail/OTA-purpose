import React from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface BankDateProps extends AccVoucherElementProps { }

const BankDate = React.forwardRef<HTMLInputElement, BankDateProps>(({
  formState,
  dispatch,
  handleKeyDown,
  t
}, ref) => {
  return (
    <>
      {formState.formElements.bankDate.visible && (
        <ERPDateInput
          localInputBox={formState.userConfig?.inputBoxStyle}
          id="bankDate"

          label={t(formState.formElements.bankDate.label)}
          value={new Date(formState.row.bankDate)}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { bankDate: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.bankDate?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e) => {
            handleKeyDown && handleKeyDown(e, "bankDate");
          }}
        />
      )}
    </>
  );
});

export default React.memo(BankDate);
