import { APIClient } from "../../../../../helpers/api-client";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import React from "react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";

const api = new APIClient();

interface VoucherNoPrefixProps extends VoucherElementProps {
  loadAndSetTransVoucher: (
    usingManualInvNumber?: boolean,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: string,
    accTransactionMasterID?: number,
    mode?: "increment" | "decrement" | undefined,
    skipPrompt?: boolean | false,
    setVoucherNo?: boolean | false
  ) => Promise<boolean>;
  phone?: boolean;
}

const AccVoucherPrefix = React.forwardRef<
  HTMLInputElement,
  VoucherNoPrefixProps
>(
  (
    { formState, dispatch, handleKeyDown, loadAndSetTransVoucher, t, phone },
    ref
  ) => {
    const { value, onChange } = useDebouncedInput(
      formState.transaction.master.voucherPrefix || '',
      (debouncedValue) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { voucherPrefix: debouncedValue },
          })
        );
      },
      300
    );

    return (
      <>
        {formState.formElements.voucherPrefix.visible && (
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="master_voucherPrefix"
            label={t(formState.formElements.voucherPrefix.label)}
            fetching={formState.transactionLoading}
            // transactionLoading={true}
            value={value}
            className={`max-w-[90px] min-w-[90px] ${phone ? "!w-[90px]" : ""}`}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown && handleKeyDown(e, "voucherPrefix")}
            disabled={
              formState.formElements.voucherPrefix?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
            ref={ref}
          />
        )}
      </>
    );
  }
);

export default React.memo(AccVoucherPrefix);