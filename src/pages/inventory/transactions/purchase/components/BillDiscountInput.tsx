import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";

interface BillDiscountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  dispatch: any;
}

const BillDiscountInput: React.FC<BillDiscountInputProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
}) => {
  return (
    <ERPInput
      localInputBox={formState?.userConfig?.inputBoxStyle}
      id="billDiscount"
      type="number"
      label={t(formState.formElements.billDiscount.label)}
      value={formState.transaction.master.billDiscount}
      disableEnterNavigation={true}
      onKeyDown={(e) => {
        handleKeyDown && handleKeyDown(e, "billDiscount");
      }}
      onChange={(e) =>
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { billDiscount: e.target?.value },
          })
        )
      }
      disabled={
        formState.formElements.billDiscount?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
    />
  );
};

export default React.memo(BillDiscountInput);
