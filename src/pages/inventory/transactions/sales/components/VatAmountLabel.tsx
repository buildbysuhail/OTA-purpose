import React from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { useAppState } from "../../../../../utilities/hooks/useAppState";
import { VoucherElementProps } from "../../transaction-types";

interface VatAmountLabelProps extends VoucherElementProps {
  taxData: any[];
}

const VatAmountLabel: React.FC<VatAmountLabelProps> = ({ formState, t, taxData, }) => {
  const { getFormattedValue } = useNumberFormat();
  const { appState } = useAppState();
    const isRtl = appState.locale.rtl;
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
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium w-24">{t(formState.formElements.totTax.label)}</span>
      <span className="text-xs dark:text-dark-text text-gray-600 mr-2">:</span>
      <span className={`text-sm font-semibold dark:text-dark-text text-gray-900 flex-1 ${isRtl ? "text-left" : "text-right"}`}>{getFormattedValue(formState.transaction.master.vatAmount ?? 0)}</span>
    </div>
  );
};

export default React.memo(VatAmountLabel);
