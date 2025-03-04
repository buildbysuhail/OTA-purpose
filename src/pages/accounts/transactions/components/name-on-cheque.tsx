import React from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface NameOnChequeProps extends AccVoucherElementProps { }

const NameOnCheque = React.forwardRef<HTMLInputElement, NameOnChequeProps>(({
  formState,
  dispatch,
  t
}, ref) => {
  return (
    <>
      {formState.formElements.nameOnCheque.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="nameOnCheque"
          className="min-w-[140px] max-w-[200px]"
          label={t(formState.formElements.nameOnCheque.label)}
          value={formState.row.nameOnCheque}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { nameOnCheque: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.nameOnCheque?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(NameOnCheque);
