import React from "react";
import ERPLabel from "../../../../../components/ERPComponents/erp-label";
import { VoucherElementProps } from "../../purchase/transaction-types";

const GrandTotalLabel: React.FC<VoucherElementProps> = ({ formState, t, }) => {
  return (
    <ERPLabel
      id="grandTotal"
      label={t(formState.formElements.grandTotal.label)}
      localInputBox={formState?.userConfig?.inputBoxStyle}
      value={formState.transaction.master.billDiscount}
      type="number"
      boxed
      textAlign="right"
    />
  );
};

export default React.memo(GrandTotalLabel);
