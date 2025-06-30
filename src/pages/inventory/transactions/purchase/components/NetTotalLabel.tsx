import React, { Dispatch } from "react";
import { TransactionFormState, VoucherElementProps } from "../../purchase/transaction-types";
import { AnyAction } from "redux";

export interface NetTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
  showFirstFooter: boolean;
}

const NetTotalLabel: React.FC<NetTotalProps> = ({ formState, t,showFirstFooter }) => {
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
    <div className={showFirstFooter ? "flex items-center" : "flex justify-between items-center"}>
      <span className={showFirstFooter ? "w-20 text-xs text-gray-600 font-medium" : "text-xs text-gray-600 font-medium"}>{t(formState.formElements.netTotal.label)}</span>
      <span className="text-sm font-semibold text-gray-900">: {formState.netTotal}</span>
    </div>
  );
};

export default React.memo(NetTotalLabel);
