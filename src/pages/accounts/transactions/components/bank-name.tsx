import React from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import useFormComponent from "../use-form-components";

interface BankNameProps extends AccVoucherElementProps { }

const BankName = React.forwardRef<HTMLInputElement, BankNameProps>(({
  formState,
  dispatch,
  t
}, ref) => {

  const { bankAccountField, handleBankNameChange, handleLedgerChange } = useFormComponent();

  return (
    <>
      {formState.formElements.bankName.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="bankName"
          className="min-w-[180px] max-w-[200px]"
          label={t(formState.formElements.bankName.label)}
          value={formState.row.bankName}
          options={formState.row.ledgerID ? undefined : []}
          field={bankAccountField}
          onChange={handleBankNameChange}
          disabled={
            formState.formElements.bankName?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(BankName);
