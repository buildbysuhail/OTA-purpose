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
}

const AccVoucherNo = React.forwardRef<HTMLInputElement, AccVoucherNoPrefixProps>(({

  formState,
  dispatch,
  handleKeyDown,
  loadAndSetAccTransVoucher,
  t,
}, ref) => {

  return (
    <>

      {formState.formElements.voucherNumber.visible && (
        <>
          <ERPInput
            disableEnterNavigation={true}
            ref={ref}
            id="voucherNumber"
            localInputBox={formState?.userConfig?.inputBoxStyle}
            onKeyUp={(e) => {
              handleKeyDown && handleKeyDown(e, "voucherNumber");
            }}
            min={1}
            label={t(formState.formElements.voucherNumber.label)}
            value={formState.transaction.master.voucherNumber}
            type="number"
            required={true}
            showCustomNumberChanger={
              formState.formElements.voucherNumberUpDownBtns
                .visible == true
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
                  e.mode == "down"
                    ? "decrement"
                    : e.mode == "up"
                      ? "increment"
                      : undefined,
                  false
                );
                // if(ret) {
                //   dispatch(
                //     accFormStateTransactionMasterHandleFieldChange({
                //       fields: { voucherNumber: e.target?.value },
                //     })
                //   );
                // }
              } else {
                dispatch(
                  accFormStateTransactionMasterHandleFieldChange({
                    fields: { voucherNumber: e.target?.value },
                  })
                );
              }
            }}
            disabled={
              formState.formElements.voucherNumber?.disabled
              // ||
              // formState.formElements.pnlMasters?.disabled
            }
            labelInfo={
              // <div>
              <button className="pe-3">
                <VoucherNumberDetailsSidebar displayType="link" />
              </button>
              // </div>
            }
          />
        </>
      )}

    </>
  );
});

export default React.memo(AccVoucherNo);



