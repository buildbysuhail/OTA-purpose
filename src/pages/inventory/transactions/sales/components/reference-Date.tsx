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
         <ERPDateInput
                    localInputBox={formState.userConfig?.inputBoxStyle}
                    id="orderDate"
                    label={t(formState.formElements.referenceDate.label)}
                    fetching={formState.transactionLoading}
                    className="md:w-[150px]"
                    // required={true}
                    value={ formState.transaction.master.refDate}
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { refDate: e.target?.value },
                        })
                      )
                    }
                    disabled={
                      formState.formElements.referenceDate?.disabled ||
                      formState.formElements.pnlMasters?.disabled
                    }
                    
                  />
            )   } 
    </>
  );
});

export default React.memo(AccReferenceDate);
