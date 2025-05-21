import { VoucherElementProps } from "../../purchase/transaction-types";
import React from "react";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import { formStateMasterHandleFieldChange} from "../reducer";

interface TransactionDateProps extends VoucherElementProps {}

const AccTransactionDate = React.forwardRef<
  HTMLInputElement,
  TransactionDateProps
>(
  (
    {
      formState,

      dispatch,

      t,
    },
    ref
  ) => {
    return (
      <>
        {formState.formElements.transactionDate.visible && (
          <ERPDateInput
            localInputBox={formState.userConfig?.inputBoxStyle}
            id="transactionDate"
            label={t(formState.formElements.transactionDate.label)}
            className="max-w-[150px]"
            required={true}
            value={new Date(formState.transaction.master.transactionDate)}
            onChange={(e) =>
              dispatch(
                formStateMasterHandleFieldChange({
                  fields: { transactionDate: e.target?.value },
                })
              )
            }
            disabled={
              formState.formElements.transactionDate?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
            
          />
        )}
      </>
    );
  }
);

export default React.memo(AccTransactionDate);
