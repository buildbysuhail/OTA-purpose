import React, { Dispatch } from "react";
import { TransactionFormState, VoucherElementProps } from "../../purchase/transaction-types";
import { AnyAction } from "redux";

export interface NetTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
}

const NetTotalLabel: React.FC<NetTotalProps> = ({ formState, t }) => {
  return (
    // <ERPLabel
    //   id="netTotal"
    //   label={t(formState.formElements.netTotal.label)}
    //   localInputBox={formState?.userConfig?.inputBoxStyle}
    //   value={formState.netTotal}
    //   type="number"
    //   boxed
    //   textAlign="right"
    // />
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600 font-medium">{t(formState.formElements.netTotal.label)}</span>
      <span className="text-sm font-semibold text-gray-900">: {formState.netTotal}</span>
    </div>
  );
};

export default React.memo(NetTotalLabel);
