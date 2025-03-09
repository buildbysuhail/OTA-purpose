import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import React from "react";

interface AccVoucherNoProps {
  phone?: boolean;
}

const api = new APIClient();

interface AccVoucherNoPrefixProps extends AccVoucherElementProps, AccVoucherNoProps {
  loadAndSetAccTransVoucher: (
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
}

const AccVoucherNo = React.forwardRef<HTMLInputElement, AccVoucherNoPrefixProps>(
  ({ formState, dispatch, handleKeyDown, loadAndSetAccTransVoucher, t, phone }, ref) => {
    return (
      <>
        {formState.formElements.voucherNumber.visible && (
          <ERPInput
            disableEnterNavigation={true}
            ref={ref}
            id="voucherNumber"
            localInputBox={formState?.userConfig?.inputBoxStyle}
            onKeyUp={(e) => {
              handleKeyDown && handleKeyDown(e, "voucherNumber");
            }}
            min={1}
            label={phone ? "Voucher No" : t(formState.formElements.voucherNumber.label)}
            value={formState.transaction.master.voucherNumber}
            type="number"
            required={true}
            showCustomNumberChanger={
              formState.formElements.voucherNumberUpDownBtns.visible == true
            }
            className="max-w-[150px]"
            onChange={async (e: any) => {
              if (e.isCustomNumberChangerEvent == true) {
                const ret = await loadAndSetAccTransVoucher(
                  false,
                  parseFloat(e.target?.value),
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  e.mode == "down" ? "decrement" : e.mode == "up" ? "increment" : undefined,
                  false
                );
              } else {
                dispatch(
                  accFormStateTransactionMasterHandleFieldChange({
                    fields: { voucherNumber: e.target?.value },
                  })
                );
              }
            }}
            disabled={formState.formElements.voucherNumber?.disabled}
            labelInfo={
              <button
                className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? 'p-1.5' : 'p-3'} rounded-md hover:bg-gray-200 transition-colors`}
              >
                <VoucherNumberDetailsSidebar displayType="link" />
              </button>
            }
          />
        )}
      </>
    );
  }
);

export default React.memo(AccVoucherNo);
