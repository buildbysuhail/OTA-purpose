import React, { useRef } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface ChequeNumberProps extends AccVoucherElementProps { }

const ChequeNumber = React.forwardRef<HTMLInputElement, ChequeNumberProps>(({
  formState,
  dispatch,
  t
}, ref) => {
  const chequeNumberRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {formState.formElements.chequeNumber.visible && (
        <ERPInput
          ref={chequeNumberRef}
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="chequeNumber"
          label={t(formState.formElements.chequeNumber.label)}
          value={formState.row.chequeNumber}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { chequeNumber: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.chequeNumber?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(ChequeNumber);
