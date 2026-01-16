import React from "react";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";
import VoucherType from "../../../../../enums/voucher-types";

interface AccReferenceDateProps extends VoucherElementProps {
  handleKeyDown?: (e: any) => void;}

const AccReferenceDate = React.forwardRef<
  HTMLDivElement,AccReferenceDateProps
>(({ formState, dispatch, t, handleKeyDown }, ref) => {
  return (
    <>
      {formState.formElements.referenceDate.visible && (
         <>
                  {[VoucherType.GoodsDeliveryReturn,VoucherType.GoodsReceiptReturn,VoucherType.ServiceInvoice].includes(formState.transaction.master.voucherType as any)?(
                     <ERPDateInput
                    localInputBox={formState.userConfig?.inputBoxStyle}
                    id="orderDate"
                    label={t(formState.formElements.referenceDate.label)}
                    fetching={formState.transactionLoading}
                    className="md:w-[150px]"
                    // required={true}
                    value={ formState.transaction.master.orderDate}
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { orderDate: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.referenceDate?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    
                  />
                  ):( <ERPDateInput
                    localInputBox={formState.userConfig?.inputBoxStyle}
                    id="deliveryDate"
                    label={t(formState.formElements.referenceDate.label)}
                    fetching={formState.transactionLoading}
                    className="md:w-[150px]"
                    // required={true}
                    value={ formState.transaction.master.deliveryDate}
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { deliveryDate: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.referenceDate?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    
                  />)        }
                  </>
        // <ERPDateInput
        //   localInputBox={formState.userConfig?.inputBoxStyle}
        //   id="purchaseInvoiceDate"
        //   fetching={formState.transactionLoading}
        //   label={t(formState.formElements.referenceDate.label)}
        //   className="md:w-[150px]"
        //   value={formState.transaction.master.purchaseInvoiceDate}
        //   disableEnterNavigation
        //   onChange={(e) =>
        //     dispatch(
        //       formStateMasterHandleFieldChange({
        //         fields: { purchaseInvoiceDate: e.target?.value },
        //       })
        //     )
        //   }
        //   onKeyDown={(e) => {
            
        //     handleKeyDown && handleKeyDown(e)
        //   }}
        //   disabled={
        //     formState.formElements.referenceDate?.disabled ||
        //     formState.formElements.pnlMasters?.disabled
        //   }
        // />
      )}
    </>
  );
});

export default React.memo(AccReferenceDate);
