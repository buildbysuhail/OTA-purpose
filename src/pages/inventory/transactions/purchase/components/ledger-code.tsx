import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";

interface LedgerCodeProps extends VoucherElementProps { }

const LedgerCode = React.forwardRef<HTMLInputElement, LedgerCodeProps>(({ formState, dispatch, t, handleKeyDown }, ref) => {
  const { value, onChange } = useDebouncedInput(
    formState.ledgerData?.ledgerCode || '',
    (debouncedValue) => {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {},
        })
      );
    }, 300
  );

  return (
    <>
      {formState.formElements.partyCode.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="partyId"
          className="!m-0 w-[120px]"
          required={true}
          fetching={formState.transactionLoading}
          label={t(formState.formElements.partyCode.label)}
          value={value}
          ref={ref}
          disableEnterNavigation={true}
          onKeyDown={(e) => { handleKeyDown && handleKeyDown(e, "partyId"); }}
          onChange={(e) => onChange(e.target.value)}
          disabled={formState.formElements.partyCode?.disabled || formState.formElements.pnlMasters?.disabled}
        />
      )}
    </>
  );
});

export default React.memo(LedgerCode);