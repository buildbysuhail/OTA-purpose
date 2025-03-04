import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";

interface AccVoucherNoPrefixProps extends AccVoucherElementProps {}

const AccRemarks = React.forwardRef<
  HTMLInputElement,
  AccVoucherNoPrefixProps
>(
  (
    {
      formState,

      dispatch,

      t,
    }, ref) => {
    return (
      <>
        {formState.formElements.remarks.visible && (
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="remarks"
            label={t(formState.formElements.remarks.label)}
            value={formState.transaction.master.remarks}
            className="max-w-full"
            onChange={(e) =>
              dispatch(
                accFormStateTransactionMasterHandleFieldChange({
                  fields: { remarks: e.target?.value },
                })
              )
            }
            disabled={
              formState.formElements.remarks?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
          />
        )}
      </>
    );
  }
);

export default React.memo(AccRemarks);
