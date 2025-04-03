import React, { useRef } from "react";
import { AccVoucherElementProps } from "../../../../accounts/transactions/acc-transaction-types";
import { VoucherElementProps } from "../transaction-types";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { formStateMasterHandleFieldChange } from "../reducer";

interface InvoiceValueProps extends VoucherElementProps { }

const InvoiceValue = React.forwardRef<HTMLInputElement, InvoiceValueProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown
}, ref) => {


  return (
    <>
      {formState.formElements.invoiceValue.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          id="address4"
          boldInput={true}
          label={t(formState.formElements.invoiceValue.label)}
          type="number"
          required={true}
          min={0}
          value={formState.transaction.master.address4}
          
          disableEnterNavigation={true}
          onChange={(e: any) =>
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  address4:
                    e.target?.value !== "" && !e.target?.value.endsWith(".")
                      // ? parseFloat(e.target?.value)
                      ? e.target?.value
                      : e.target?.value,
                },
              })
            )
          }
          disabled={
            formState.formElements.invoiceValue?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(InvoiceValue);
