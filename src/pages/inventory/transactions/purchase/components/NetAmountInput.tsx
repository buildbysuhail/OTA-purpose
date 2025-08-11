import React from "react";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

interface NetAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
  ) => void;
  dispatch: any;
}

const NetAmountInput: React.FC<NetAmountInputProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
}) => {
  
    const { getFormattedValue } = useNumberFormat();
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
    <div className="flex justify-between items-center">
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium">{t(formState.formElements.netAmount.label)}</span>
      <span className="text-sm font-semibold dark:text-dark-text text-gray-900">{" "}: {getFormattedValue(formState.summary.netValue??0)}</span>
    </div>
  );
};

export default React.memo(NetAmountInput);
