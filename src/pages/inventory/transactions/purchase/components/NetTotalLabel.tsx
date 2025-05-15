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
    <span>{t(formState.formElements.netTotal.label)}:{formState.netTotal}</span>
  );
};

export default React.memo(NetTotalLabel);
