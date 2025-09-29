import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange } from "../reducer";

interface GrandTotalFcInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
}

const GrandTotalFcInput: React.FC<GrandTotalFcInputProps> = ({
  formState,
  t,
  handleKeyDown,
}) => {
  const dispatch = useAppDispatch();

  return (
    <ERPInput
      localInputBox={formState?.userConfig?.inputBoxStyle}
      id="grandTotalFc"
      type="number"
      label={t(formState.formElements.grandTotalFc.label)}
      value={formState.transaction.master.grandTotalFc}
      disableEnterNavigation={true}
      onKeyDown={(e) => {
        handleKeyDown && handleKeyDown(e, "grandTotalFc");
      }}
      onChange={(e) =>
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { grandTotalFc: e.target?.value },
          })
        )
      }
      disabled={
        formState.formElements.grandTotalFc?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
    />
  );
};

export default React.memo(GrandTotalFcInput);
