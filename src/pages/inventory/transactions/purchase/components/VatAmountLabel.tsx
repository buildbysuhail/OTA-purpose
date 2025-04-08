import React from "react";
import ERPLabel from "../../../../../components/ERPComponents/erp-label";
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
    <ERPLabel
      id="vatAmount"
      label={t(formState.formElements.totTax.label)}
      localInputBox={formState?.userConfig?.inputBoxStyle}
      value={formState.transaction.master.vatAmount}
      boxed={true}
      showDropdown={true}
      dropdownData={taxData}
    />
  );
};

export default React.memo(VatAmountLabel);
