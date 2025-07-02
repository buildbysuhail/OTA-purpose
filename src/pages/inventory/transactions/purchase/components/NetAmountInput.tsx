import React from "react";
import { VoucherElementProps } from "../../purchase/transaction-types";

interface NetAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  dispatch: any;
  showFirstFooter: boolean;
}

const NetAmountInput: React.FC<NetAmountInputProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
  showFirstFooter
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
    <div className={showFirstFooter ? "flex items-center" : "flex justify-between items-center"}>
      <span className={showFirstFooter ? "w-20 text-xs text-gray-600 font-medium" : "text-xs text-gray-600 font-medium"}>{t(formState.formElements.netAmount.label)}</span>
      <span className="text-sm font-semibold text-gray-900">: {formState.netAmount}</span>
    </div>
  );
};

export default React.memo(NetAmountInput);
