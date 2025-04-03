import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../transaction-types";

interface BtnAddProps extends VoucherElementProps {
  rowProcessing: boolean;
  addOrEditRow: () => void;
}

const BtnAdd = React.forwardRef<HTMLButtonElement, BtnAddProps>(({
  formState,
  dispatch,
  t,
  rowProcessing,
  addOrEditRow
}, ref) => {

  return (
    <>
      {formState.formElements.btnAdd.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnAdd.label)}
          variant="primary"
          loading={formState.rowProcessing}
          type="button"
          onClick={() => addOrEditRow()}
          disableEnterNavigation
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addOrEditRow();
            }
          }}
          disabled={
            formState.formElements.btnAdd.disabled === true ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(BtnAdd);
