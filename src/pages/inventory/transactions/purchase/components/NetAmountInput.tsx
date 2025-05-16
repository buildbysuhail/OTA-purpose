import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateHandleFieldChange } from "../reducer";

interface NetAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  dispatch: any;
}

const NetAmountInput: React.FC<NetAmountInputProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
}) => {
  return (
    // <ERPInput
    //   localInputBox={formState?.userConfig?.inputBoxStyle}
    //   id="netAmount"
    //   type="number"
    //   label={t(formState.formElements.netAmount.label)}
    //   value={formState.netAmount}
    //   disableEnterNavigation={true}
    //   onKeyDown={(e) => {
    //     handleKeyDown && handleKeyDown(e, "netAmount");
    //   }}
    //   onChange={(e) =>
    //     dispatch(
    //       formStateHandleFieldChange({
    //         fields: { netAmount: e.target?.value },
    //       })
    //     )
    //   }
    //   className="max-w-[110px] min-w-[110px]"
    //   disabled={
    //     formState.formElements.netAmount?.disabled ||
    //     formState.formElements.pnlMasters?.disabled
    //   }
    // />
    <div className="flex items-center justify-between">
      <span>{t(formState.formElements.netAmount.label)}:</span>
      <span>{formState.netAmount}</span>
    </div>
  );
};

export default React.memo(NetAmountInput);
