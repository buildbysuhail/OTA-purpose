import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateHandleFieldChange } from "../reducer";

interface AutoCalculationCheckboxProps extends VoucherElementProps {}

const AutoCalculationCheckbox = React.forwardRef<
  HTMLInputElement,
  AutoCalculationCheckboxProps
>(({ formState, dispatch, t }, ref) => {
  return (
    <ERPCheckbox
      localInputBox={formState?.userConfig?.inputBoxStyle}
      id="autoCalculation"
      label={t(formState.formElements.autoCalculation.label)}
      checked={formState.autoCalculation}
      onChange={(e) =>
        dispatch(
          formStateHandleFieldChange({
            fields: { autoCalculation: e.target.checked },
          })
        )
      }
      disabled={
        formState.formElements.autoCalculation?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
      className="text-sm xl:text-base"
    />
  );
});

export default React.memo(AutoCalculationCheckbox);
