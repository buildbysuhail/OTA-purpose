import { APIClient } from "../../../../../helpers/api-client";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../../transaction-base/Voucher-number-details";
import { useRef } from "react";
import React from "react";

const api = new APIClient();

interface VoucherNoPrefixProps extends VoucherElementProps {
  loadAndSetTransVoucher: (usingManualInvNumber?: boolean, voucherNumber?: number, voucherPrefix?: string, voucherType?: string, formType?: string, manualInvoiceNumber?: string, accTransactionMasterID?: number, mode?: "increment" | "decrement" | undefined, skipPrompt?: boolean | false, setVoucherNo?: boolean | false) => Promise<boolean>;
  phone?: boolean;
}

const AccVoucherPrefix = React.forwardRef<HTMLInputElement, VoucherNoPrefixProps>(({ 
  formState,
  dispatch,
  handleKeyDown,
  loadAndSetTransVoucher,
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
              formStateMasterHandleFieldChange({
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
