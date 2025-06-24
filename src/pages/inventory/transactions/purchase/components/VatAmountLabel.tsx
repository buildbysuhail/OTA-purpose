import React from "react";
import { VoucherElementProps } from "../../purchase/transaction-types";

interface VatAmountLabelProps extends VoucherElementProps {
  taxData: any[];
}

const VatAmountLabel: React.FC<VatAmountLabelProps> = ({
  formState,
  t,
  taxData,
}) => {
  return (
    // <ERPLabel
    //   id="vatAmount"
    //   label={t(formState.formElements.totTax.label)}
    //   localInputBox={formState?.userConfig?.inputBoxStyle}
    //   value={formState.transaction.master.vatAmount}
    //   boxed={true}
    //   showDropdown={true}
    //   dropdownData={taxData}
    // />
    <div className="flex items-center">
      <span className="w-20">{t(formState.formElements.totTax.label)}</span>
      <span>:{formState.transaction.master.vatAmount}</span>
    </div>
  );
};

export default React.memo(VatAmountLabel);
