import { APIClient } from "../../../../helpers/api-client";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import { useRef } from "react";
import React from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const api = new APIClient();

interface AccReferenceDateProps extends AccVoucherElementProps { }

const AccReferenceDate = React.forwardRef<HTMLInputElement, AccReferenceDateProps>(({
  formState,
  dispatch,
  t,
}, ref) => {
  const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber
  return (
    <>
      {formState.formElements.referenceDate.visible && (
        <ERPDateInput
          localInputBox={formState.userConfig?.inputBoxStyle}
          id="referenceDate"
          label={t(formState.formElements.referenceDate.label)}
          className="lg:max-w-[300px]"
          value={new Date(formState.transaction.master.referenceDate)}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: { referenceDate: e.target?.value },
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
}
);

export default React.memo(AccReferenceDate);
