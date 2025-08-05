import React, { Dispatch } from "react";
import { TransactionFormState } from "../../purchase/transaction-types";
import { AnyAction } from "redux";

export interface GrandTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
}

const BillDiscountLabel: React.FC<GrandTotalProps> = ({ formState, t }) => {
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
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium">{t(formState.formElements.billDiscount.label)}</span>
      <span className="text-sm font-semibold dark:text-dark-text text-gray-900">: {formState.transaction.master.billDiscount}</span>
    </div>
  );
};

export default React.memo(BillDiscountLabel);
