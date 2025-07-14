import React, { Dispatch } from "react";
import { TransactionFormState } from "../../purchase/transaction-types";
import { AnyAction } from "redux";

export interface GrandTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
}

const GrandTotalLabel: React.FC<GrandTotalProps> = ({ formState, t }) => {
  return (
    // <ERPLabel
    //   id="grandTotal"
    //   label={t(formState.formElements.grandTotal.label)}
    //   localInputBox={formState?.userConfig?.inputBoxStyle}
    //   value={formState.transaction.master.billDiscount}
    //   type="number"
    //   boxed
    //   textAlign="right"
    // />
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600 font-medium">{t(formState.formElements.grandTotal.label)}</span>
      <span className="text-sm font-semibold text-gray-900">: {formState.transaction.master.billDiscount}</span>
    </div>
  );
};

export default React.memo(GrandTotalLabel);
