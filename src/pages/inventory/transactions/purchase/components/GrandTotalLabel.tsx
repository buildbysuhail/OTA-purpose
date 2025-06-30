import React, { Dispatch } from "react";
import { TransactionFormState } from "../../purchase/transaction-types";
import { AnyAction } from "redux";

export interface GrandTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
  showFirstFooter: boolean;
}

const GrandTotalLabel: React.FC<GrandTotalProps> = ({ formState, t,showFirstFooter }) => {
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
    <div className={showFirstFooter ? "flex items-center" : "flex justify-between items-center"}>
      <span className={showFirstFooter ? "w-20 text-xs text-gray-600 font-medium" : "text-xs text-gray-600 font-medium"}>{t(formState.formElements.grandTotal.label)}</span>
      <span className="text-sm font-semibold text-gray-900">: {formState.transaction.master.billDiscount}</span>
    </div>
  );
};

export default React.memo(GrandTotalLabel);
