import React from "react";
import { VoucherElementProps } from "../../transaction-types";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";

interface InvoiceValueProps extends VoucherElementProps { }

const InvoiceValue = React.forwardRef<HTMLInputElement, InvoiceValueProps>(({ formState, dispatch, t, handleKeyDown }, ref) => {
  const { value, onChange } = useDebouncedInput(
    formState.transaction.master.address4 || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: {
            address4: debouncedValue !== "" && !debouncedValue.endsWith(".") ? debouncedValue : debouncedValue,
          },
        })
      );
    }, 300
  );

  return (
    <>
      {formState.formElements.invoiceValue.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          id="address4"
          boldInput={true}
          label={t(formState.formElements.invoiceValue.label)}
          fetching={formState.transactionLoading}
          // transactionLoading={true}
          type="number"
          required={true}
          min={0}
          value={value}
          className="!m-0 w-[120px]"
          disableEnterNavigation={true}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown && handleKeyDown(e, "address4")}
          disabled={formState.formElements.invoiceValue?.disabled || formState.formElements.pnlMasters?.disabled}
        />
      )}
    </>
  );
});

export default React.memo(InvoiceValue);