import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import {  AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";


interface AccNotesProps extends AccVoucherElementProps {}

const AccNotes = React.forwardRef<HTMLInputElement, AccNotesProps>(
  (
    {
      formState,

      dispatch,

      handleKeyDown,

      t,
    },
    ref
  ) => {
    return (
      <>
        {formState.formElements.commonNarration.visible && (
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="notes"
            label={t(formState.formElements.commonNarration.label)}
            className="max-w-full"
            value={formState.transaction.master.commonNarration}
            onChange={(e) =>
              dispatch(
                accFormStateTransactionMasterHandleFieldChange({
                  fields: { commonNarration: e.target?.value },
                })
              )
            }
            disableEnterNavigation={true}
            onKeyDown={(e) => {
              handleKeyDown && handleKeyDown(e, "commonNarration");
            }}
            disabled={
              formState.formElements.commonNarration?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
          />
        )}
      </>
    );
  }
);

export default React.memo(AccNotes);
