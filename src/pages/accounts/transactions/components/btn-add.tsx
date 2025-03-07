import React, { useRef } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { AccVoucherElementProps } from "../acc-transaction-types";

interface BtnAddProps extends AccVoucherElementProps {
  rowProcessing: boolean;
  addOrEditRow: () => void;
}

const BtnAdd = React.forwardRef<HTMLInputElement, BtnAddProps>(({
  formState,
  dispatch,
  t,
  rowProcessing,
  addOrEditRow
}, ref) => {
  const btnAddRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {formState.formElements.btnAdd.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={btnAddRef}
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
            formState.ledgerBillWiseLoading ||
            formState.ledgerIsBillWiseAdjustExistLoading ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(BtnAdd);
