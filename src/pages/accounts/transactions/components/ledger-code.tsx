import React, { useRef } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface LedgerCodeProps extends AccVoucherElementProps { }

const LedgerCode = React.forwardRef<HTMLInputElement, LedgerCodeProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown
}, ref) => {
  const ledgerCodeRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {formState.formElements.ledgerCode.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="ledgerCode"
          className=""
          required={true}
          label={t(formState.formElements.ledgerCode.label)}
          value={formState.row.ledgerCode}
          ref={ledgerCodeRef}
          disableEnterNavigation={true}
          onKeyDown={(e) => {
            handleKeyDown && handleKeyDown(e, "ledgerCode");
          }}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { ledgerCode: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.ledgerCode?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(LedgerCode);
