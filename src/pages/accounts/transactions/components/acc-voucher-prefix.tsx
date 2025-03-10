import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { useRef } from "react";
import React from "react";

const api = new APIClient();

interface AccVoucherNoPrefixProps extends AccVoucherElementProps {
  loadAndSetAccTransVoucher: (usingManualInvNumber?: boolean, voucherNumber?: number, voucherPrefix?: string, voucherType?: string, formType?: string, manualInvoiceNumber?: string, accTransactionMasterID?: number, mode?: "increment" | "decrement" | undefined, skipPrompt?: boolean | false, setVoucherNo?: boolean | false) => Promise<boolean>;
  phone?: boolean;
}

const AccVoucherPrefix = React.forwardRef<HTMLInputElement, AccVoucherNoPrefixProps>(({ 
  formState,
  dispatch,
  handleKeyDown,
  loadAndSetAccTransVoucher,
  t,
  phone,
}, ref) => {

  return (
    <>
      {formState.formElements.voucherPrefix.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="master_voucherPrefix"
          label={t(formState.formElements.voucherPrefix.label)}
          value={formState.transaction.master.voucherPrefix}
          className={`max-w-[100px] ${phone? "!w-[90px]" : ""}`}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: { voucherPrefix: e.target?.value },
              })
            )
          }
          disabled={
            formState.formElements.voucherPrefix?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(AccVoucherPrefix);
