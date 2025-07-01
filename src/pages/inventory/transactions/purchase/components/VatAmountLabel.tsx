import React from "react";
import { VoucherElementProps } from "../../purchase/transaction-types";

interface VatAmountLabelProps extends VoucherElementProps {
  taxData: any[];
  showFirstFooter: boolean;
}

const VatAmountLabel: React.FC<VatAmountLabelProps> = ({
  formState,
  t,
  taxData,
  showFirstFooter
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
     <div className={showFirstFooter ? "flex items-center" : "flex justify-between items-center"}>
      <span className={showFirstFooter ? "w-20 text-xs text-gray-600 font-medium" : "text-xs text-gray-600 font-medium"}>{t(formState.formElements.totTax.label)}</span>
      <span className="text-sm font-semibold text-gray-900">: {formState.transaction.master.vatAmount}</span>
    </div>
  );
};

export default React.memo(VatAmountLabel);
