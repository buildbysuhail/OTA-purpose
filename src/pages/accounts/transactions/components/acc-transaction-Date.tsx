import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

interface TransactionDateProps extends AccVoucherElementProps {}

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
            className="lg:max-w-[300px]"
            required={true}
            value={new Date(formState.transaction.master.transactionDate)}
            onChange={(e) =>
              dispatch(
                accFormStateTransactionMasterHandleFieldChange({
                  fields: { transactionDate: e.target?.value },
                })
              )
            }
            disabled={
              formState.formElements.transactionDate?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
            validation={
              formState.transaction.masterValidations?.transactionDate
            }
          />
        )}
      </>
    );
  }
);

export default React.memo(AccTransactionDate);
