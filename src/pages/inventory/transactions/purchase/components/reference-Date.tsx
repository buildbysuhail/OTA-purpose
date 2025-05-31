import { VoucherElementProps } from "../transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import React from "react";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";

interface AccReferenceDateProps extends VoucherElementProps {}

const AccReferenceDate = React.forwardRef<
  HTMLInputElement,
  AccReferenceDateProps
>(({ formState, dispatch, t }, ref) => {
  return (
    <>
      {formState.formElements.referenceDate.visible && (
        <ERPDateInput
          localInputBox={formState.userConfig?.inputBoxStyle}
          id="purchaseInvoiceDate"
          label={t(formState.formElements.referenceDate.label)}
          className="md:w-[150px]"
          value={new Date(formState.transaction.master.purchaseInvoiceDate)}
          onChange={(e) =>
            dispatch(
              formStateMasterHandleFieldChange({
                fields: { purchaseInvoiceDate: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.referenceDate?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(AccReferenceDate);
