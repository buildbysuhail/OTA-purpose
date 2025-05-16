import React from "react";
import ERPLabel from "../../../../../components/ERPComponents/erp-label";
import { VoucherElementProps } from "../../purchase/transaction-types";

const GrandTotalLabel: React.FC<VoucherElementProps> = ({ formState, t, }) => {
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
    <div className="flex items-center justify-between">
      <span>{t(formState.formElements.grandTotal.label)}:</span>
      <span>{formState.transaction.master.billDiscount}</span>
    </div>
  );
};

export default React.memo(GrandTotalLabel);
