import React from "react";
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
    <div className="flex items-center">
      <span className="w-20">{t(formState.formElements.netTotal.label)}</span>
      <span>:{formState.netTotal}</span>
    </div>
  );
};

export default React.memo(NetTotalLabel);
