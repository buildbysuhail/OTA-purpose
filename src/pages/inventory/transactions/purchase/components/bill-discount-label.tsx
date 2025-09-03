import React, { Dispatch } from "react";
import { TransactionFormState } from "../../purchase/transaction-types";
import { AnyAction } from "redux";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

export interface GrandTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
}

const BillDiscountLabel: React.FC<GrandTotalProps> = ({ formState, t }) => {
  const { getFormattedValue } = useNumberFormat();
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
    <div className="flex items-center">
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium w-20">{t(formState.formElements.billDiscount.label)}</span>
      <span className="text-xs dark:text-dark-text text-gray-600 mr-2">:</span>
      <span className="text-sm font-semibold dark:text-dark-text text-gray-900 flex-1 text-right">{getFormattedValue(formState.transaction.master.billDiscount ?? 0)}</span>
    </div>
  );
};

export default React.memo(BillDiscountLabel);
