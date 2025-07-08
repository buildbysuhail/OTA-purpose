import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";

interface BillDiscountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  dispatch: any;
  footerLayout?: 'horizontal' | 'vertical';
}

const BillDiscountInput: React.FC<BillDiscountInputProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
  footerLayout,
}) => {
  const { value, onChange } = useDebouncedInput(
    formState.transaction.master.billDiscount || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { billDiscount: debouncedValue },
        })
      );
    },
    300
  );

  return (
    <ERPInput 
      localInputBox={formState?.userConfig?.inputBoxStyle}
      fetching={formState.transactionLoading}
      id="billDiscount"
      type="number"
      labelDirection={footerLayout === 'vertical' ? 'horizontal' : 'vertical'}
      label={t(formState.formElements.billDiscount.label)}
      value={value}
      disableEnterNavigation={true}
      onKeyDown={(e) => {
        handleKeyDown && handleKeyDown(e, "billDiscount");
      }}
      onChange={(e) => onChange(e.target.value)}
      className={`${footerLayout === "vertical" ? 'w-full' : 'max-w-[110px] min-w-[110px] !m-0'}`}
      disabled={
        formState.formElements.billDiscount?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
    />
  );
};

export default React.memo(BillDiscountInput);