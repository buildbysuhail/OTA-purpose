import React, { Dispatch } from "react";
import { AnyAction } from "redux";
import { TransactionFormState } from "../../transaction-types";

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
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium">{t(formState.formElements.netTotal.label)}</span>
      <span className="text-sm font-semibold dark:text-dark-text text-gray-900">: {formState.netTotal}</span>
    </div>
  );
};

export default React.memo(NetTotalLabel);
