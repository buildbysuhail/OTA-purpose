import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange } from "../reducer";

interface RoundOffInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  focusDiscount: () => void;
  focusAmount: () => void;
}

const RoundOffInput: React.FC<RoundOffInputProps> = ({
  formState,
  t,
  handleKeyDown,
  focusDiscount,
  focusAmount,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-2">
      <ERPCheckbox
        localInputBox={formState?.userConfig?.inputBoxStyle}
        id="hasroundOff"
        className="text-left"
        label={t(formState.formElements.roundOff.label)}
        checked={formState.transaction.master.hasroundOff}
        onChange={(e) => {
          const isChecked = e.target.checked;
          dispatch(
            formStateMasterHandleFieldChange({
              fields: { hasroundOff: isChecked },
            })
          );
          isChecked ? focusDiscount() : focusAmount();
        }}
        disabled={
          formState.formElements.hasroundOff?.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
      />

      <ERPInput
        localInputBox={formState?.userConfig?.inputBoxStyle}
        id="roundAmount"
        className=""
        type="number"
        noLabel
        value={formState.transaction.master.roundAmount}
        disableEnterNavigation={true}
        onKeyDown={(e) => {
          handleKeyDown && handleKeyDown(e, "roundAmount");
        }}
        onChange={(e) =>
          dispatch(
            formStateMasterHandleFieldChange({
              fields: { roundAmount: e.target?.value },
            })
          )
        }
        disabled={
          formState.transaction.master.hasroundOff !== true ||
          formState.formElements.roundAmount?.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
      />
    </div>
  );
};

export default React.memo(RoundOffInput);
