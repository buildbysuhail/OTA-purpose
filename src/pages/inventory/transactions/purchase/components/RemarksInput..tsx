import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";

interface RemarksInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
}

const RemarksInput = React.forwardRef<HTMLInputElement, RemarksInputProps>(
  ({ formState, dispatch, t, handleKeyDown }, ref) => {
    return (
      <ERPInput
        localInputBox={formState?.userConfig?.inputBoxStyle}
        id="remarks"
        className=""
        required={true}
        label={t(formState.formElements.remarks.label)}
        value={formState.transaction.master.remarks}
        disableEnterNavigation={true}
        onKeyDown={(e) => {
          handleKeyDown?.(e, "remarks");
        }}
        onChange={(e) =>
          dispatch(
            formStateMasterHandleFieldChange({
              fields: { remarks: e.target?.value },
            })
          )
        }
        disabled={
          formState.formElements.remarks?.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
      />
    );
  }
);

export default React.memo(RemarksInput);
