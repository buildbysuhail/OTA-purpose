import React, { useRef } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateHandleFieldChange } from "../reducer";

interface LedgerCodeProps extends VoucherElementProps { }

const LedgerCode = React.forwardRef<HTMLInputElement, LedgerCodeProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown
}, ref) => {

  return (
    <>
      {formState.formElements.partyCode.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="partyId"
          className="!m-0"
          required={true}
          label={t(formState.formElements.partyCode.label)}
          value={formState.partyId}
          ref={ref}
          disableEnterNavigation={true}
          onKeyDown={(e) => {
            handleKeyDown && handleKeyDown(e, "partyId");
          }}
          onChange={(e) =>
            dispatch(
              formStateHandleFieldChange({
                fields: { partyId: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.partyCode?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(LedgerCode);
