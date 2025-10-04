import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface IsLockedCheckboxProps extends VoucherElementProps {}

const IsLockedCheckbox = React.forwardRef<HTMLInputElement, IsLockedCheckboxProps>(
  ({ formState, dispatch, t }, ref) => {
    return (
      <ERPCheckbox
        localInputBox={formState?.userConfig?.inputBoxStyle}
        id="isLocked"
        label={t(formState.formElements.isLocked.label)}
        checked={formState.transaction.master.isLocked}
        onChange={(e) =>
          dispatch(
            formStateMasterHandleFieldChange({
              fields: { isLocked: e.target.checked },
            })
          )
        }
        disabled={
          formState.formElements.isLocked?.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
        className="text-sm xl:text-base"
      />
    );
  }
);

export default React.memo(IsLockedCheckbox);
