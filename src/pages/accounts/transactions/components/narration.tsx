import React, { useRef } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface NarrationProps extends AccVoucherElementProps { }

const Narration = React.forwardRef<HTMLInputElement, NarrationProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown
}, ref) => {

  return (
    <>
      {formState.formElements.narration.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          id="narration"
          className="w-full"
          disableEnterNavigation
          onKeyDown={(e) => {
            handleKeyDown && handleKeyDown(e, "narration");
          }}
          label={t(formState.formElements.narration.label)}
          value={formState.row.narration}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { narration: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.narration?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(Narration);
