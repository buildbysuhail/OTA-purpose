import React from "react";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

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
            ref={ref}
            localInputBox={formState.userConfig?.inputBoxStyle}
            id="transactionDate"
            label={t(formState.formElements.transactionDate.label)}
            fetching={formState.transactionLoading}
            className="md:w-[150px]"
            // required={true}
            value={formState.transaction.master.transactionDate}
            onChange={(e) =>
              dispatch(
                formStateMasterHandleFieldChange({
                  fields: { transactionDate: e.target?.value },
                })
              )
            }
            disabled={
               !formState.userConfig?.enableVoucherPrefixAndDate ||
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
