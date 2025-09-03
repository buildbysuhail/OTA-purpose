import React from "react";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

interface VatAmountLabelProps extends VoucherElementProps {
  taxData: any[];
}

const VatAmountLabel: React.FC<VatAmountLabelProps> = ({ formState, t, taxData, }) => {
  const { getFormattedValue } = useNumberFormat();
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
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium w-20">{t(formState.formElements.totTax.label)}</span>
      <span className="text-xs dark:text-dark-text text-gray-600 mr-2">:</span>
      <span className="text-sm font-semibold dark:text-dark-text text-gray-900 flex-1 text-right">{getFormattedValue(formState.transaction.master.vatAmount ?? 0)}</span>
    </div>
  );
};

export default React.memo(VatAmountLabel);
