import { APIClient } from "../../../../../helpers/api-client";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange} from "../reducer";
import { useRef } from "react";
import React from "react";
import { Ellipsis } from "lucide-react";

interface ReferenceNumberProps extends VoucherElementProps {handleLoadByRefNo: () => Promise<void>}

const ReferenceNumber = React.forwardRef<
  HTMLInputElement,
  ReferenceNumberProps
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
   return (
      <>
        {formState.formElements.referenceNumber.visible && (
          <>
            <div>
              <ERPInput
                ref={ref}
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="purchaseInvoiceDate"
                label={t(formState.formElements.referenceNumber.label)}
                value={formState.transaction.master.purchaseInvoiceDate}
                className="w-full min-w-[135px]"
                onChange={(e) =>
                  dispatch(
                    formStateMasterHandleFieldChange({
                      fields: { purchaseInvoiceDate: e.target?.value },
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

export default React.memo(ReferenceNumber);
