import { APIClient } from "../../../../../helpers/api-client";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import React from "react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

const api = new APIClient();

interface ReferenceNumberProps extends VoucherElementProps {
  handleLoadByRefNo: () => Promise<void>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ReferenceNumber = React.forwardRef<HTMLInputElement, ReferenceNumberProps>(
  ({ formState, dispatch, handleLoadByRefNo, t, onKeyDown }, ref) => {
    const { value, onChange } = useDebouncedInput(
      formState.transaction.master.purchaseInvoiceNumber || '',
      (debouncedValue) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { purchaseInvoiceNumber: debouncedValue },
          })
        );
      },
      300
    );

    return (
      <>
        {formState.formElements.referenceNumber.visible && (
          <>
            <div>
              <ERPInput
                ref={ref}
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="purchaseInvoiceDate"
                // required={formState.transaction.master.voucherType !== "PE"}
                label={t(formState.formElements.referenceNumber.label)}
                value={value}
                className="w-full min-w-[135px]"
                fetching={formState.transactionLoading}
                // transactionLoading={true}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={
                  formState.formElements.referenceNumber?.disabled ||
                  formState.formElements.pnlMasters?.disabled
                }
                // labelInfo={
            //   // <ERPButton
            //   //   id="btnLoadByRef"
            //   //   title=":"
            //   //   className="!p-0 !m-0 !bg-none"
            //   //   onClick={handleLoadByRefNo}
            //   // ></ERPButton>
            //   <div className="relative">
            //     {/* <button onClick={handleLoadByRefNo} className="m-[-1px_0_-13px_0] p-[0px_0_7px_0] text-[#0ea5e9]"> */}
            //     <button
            //       onClick={handleLoadByRefNo}
            //       className="absolute right-0 top-[-5px] text-[#0ea5e9]"
            //     >
            //       <Ellipsis />
            //     </button>
            //   </div>
            // }
              />
            </div>
          </>
        )}
      </>
    );
  }
);

export default React.memo(ReferenceNumber);