import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import {
  AccVoucherElementProps
} from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";
import { Ellipsis } from "lucide-react";

const api = new APIClient();

interface AccReferenceNumberProps extends AccVoucherElementProps {handleLoadByRefNo: () => Promise<void>}

const AccReferenceNumber = React.forwardRef<
  HTMLInputElement,
  AccReferenceNumberProps
>(
  (
    {
      formState,
      dispatch,
      handleLoadByRefNo,
      t,
    },
    ref
  ) => {
    const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber
    return (
      <>
        {formState.formElements.referenceNumber.visible && (
          <>
            <div>
              <ERPInput
                ref={ref}
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="referenceNumber"
                label={t(formState.formElements.referenceNumber.label)}
                value={formState.transaction.master.referenceNumber}
                className="lg:max-w-[300px]"
                onChange={(e) =>
                  dispatch(
                    accFormStateTransactionMasterHandleFieldChange({
                      fields: { referenceNumber: e.target?.value },
                    })
                  )
                }
                disabled={
                  formState.formElements.referenceNumber?.disabled ||
                  formState.formElements.pnlMasters?.disabled
                }
                labelInfo={
                  // <ERPButton
                  //   id="btnLoadByRef"
                  //   title=":"
                  //   className="!p-0 !m-0 !bg-none"
                  //   onClick={handleLoadByRefNo}
                  // ></ERPButton>
                  <div className="relative">
                    {/* <button onClick={handleLoadByRefNo} className="m-[-1px_0_-13px_0] p-[0px_0_7px_0] text-[#0ea5e9]"> */}
                    <button
                      onClick={handleLoadByRefNo}
                      className="absolute right-0 top-[-5px] text-[#0ea5e9]"
                    >
                      <Ellipsis />
                    </button>
                  </div>
                }
              />
            </div>
          </>
        )}
      </>
    );
  }
);

export default React.memo(AccReferenceNumber);
