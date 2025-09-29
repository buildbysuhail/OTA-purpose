import { VoucherElementProps } from "../transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import React from "react";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";

interface AccReferenceDateProps extends VoucherElementProps {
  handleKeyDown?: (e: any) => void;}

const AccReferenceDate = React.forwardRef<
  HTMLDivElement,AccReferenceDateProps
>(({ formState, dispatch, t, handleKeyDown }, ref) => {
  return (
    <>
      {formState.formElements.referenceDate.visible && (
        <ERPDateInput
          localInputBox={formState.userConfig?.inputBoxStyle}
          id="purchaseInvoiceDate"
          fetching={formState.transactionLoading}
          label={t(formState.formElements.referenceDate.label)}
          className="md:w-[150px]"
          value={formState.transaction.master.purchaseInvoiceDate}
          disableEnterNavigation
          onChange={(e) =>
            dispatch(
              formStateMasterHandleFieldChange({
                fields: { purchaseInvoiceDate: e.target?.value },
              })
            )
          }
          onKeyDown={(e) => {
            
            handleKeyDown && handleKeyDown(e)
          }}
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
