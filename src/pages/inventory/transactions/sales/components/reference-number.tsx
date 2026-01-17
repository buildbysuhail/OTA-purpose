import { APIClient } from "../../../../../helpers/api-client";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import React from "react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";
import VoucherType from "../../../../../enums/voucher-types";

const api = new APIClient();

interface ReferenceNumberProps extends VoucherElementProps {
  handleLoadByRefNo: () => Promise<void>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ReferenceNumber = React.forwardRef<HTMLInputElement, ReferenceNumberProps>(
  ({ formState, dispatch, handleLoadByRefNo, t, onKeyDown }, ref) => {
    const { value, onChange } = useDebouncedInput(formState.transaction.master.voucherType == VoucherType.ServiceInvoice ?
      formState.transaction.master.orderNumber || '' : formState.transaction.master.deliveryNoteNumber || '',
      (debouncedValue) => {
        dispatch(
          formStateMasterHandleFieldChange(

            formState.transaction.master.voucherType == VoucherType.ServiceInvoice ?
              {
                fields: { orderNumber: debouncedValue },
              } : {
                fields: { deliveryNoteNumber: debouncedValue },
              })
        );
      },
      300
    );

    return (
      <>
        {formState.formElements.referenceNumber.visible && ![VoucherType.GoodsDeliveryReturn,VoucherType.GoodsReceiptReturn].includes(formState.transaction.master.voucherType as any) && (
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
              />
            </div>
          </>
        )}
      </>
    );
  }
);

export default React.memo(ReferenceNumber);