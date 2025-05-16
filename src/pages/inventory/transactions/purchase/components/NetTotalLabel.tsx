import React from "react";
import ERPLabel from "../../../../../components/ERPComponents/erp-label";
import { VoucherElementProps } from "../../purchase/transaction-types";

const NetTotalLabel: React.FC<VoucherElementProps> = ({ formState, t }) => {
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
    <div className="flex items-center justify-between">
      <span>{t(formState.formElements.netTotal.label)}:</span>
      <span>{formState.netTotal}</span>
    </div>
  );
};

export default React.memo(NetTotalLabel);
