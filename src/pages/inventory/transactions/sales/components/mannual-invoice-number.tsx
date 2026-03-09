import ERPInput from "../../../../../components/ERPComponents/erp-input";
import React, { useCallback, useEffect, useState } from "react";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";
import { Ellipsis } from "lucide-react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce"
import VoucherType, { purchaseVoucherTypes, } from "../../../../../enums/voucher-types";
import { LoadAndSetTransVoucherFn } from "../use-transaction";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface LoadByManualInvNoProps extends VoucherElementProps {
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  type?: string;
  localInputBox?: any
  label?: any
}

const ManualInvNo = React.forwardRef<HTMLInputElement, LoadByManualInvNoProps>(
  (props, ref) => {
    const formState = useSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const [showLoadData, setShowLoadData] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<{
      vPrefixId: any;
      vFormTypeId: any;
      formType: any;
      vPrefix: string;
      vNumber: number | undefined;
      vType: string;
    }>({
      vFormTypeId: -2,
      vPrefixId: -2,
      formType: "",
      vPrefix: "",
      vNumber:parseFloat(formState.transaction.master.mannualInvoiceNumber),
      vType: purchaseVoucherTypes.includes(
        formState.transaction.master.voucherType as VoucherType
      )
        ? "PO"
        : "SO",
    });
    const { value: orderNumberValue, onChange: onOrderNumberChange } =
      useDebouncedInput(
        formState.transaction.master.mannualInvoiceNumber || "",
        (debouncedValue) => {
          props.dispatch(
            formStateMasterHandleFieldChange({
              fields: { mannualInvoiceNumber: debouncedValue },
            })
          );
        },
        300
      );
    const showLoadByRefNo = useCallback(async () => {
      if (!orderNumberValue) return;

        await props.loadAndSetTransVoucher(
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          orderNumberValue.toString(),
          undefined,
          undefined,
          true,
          false,
          "",
          "",
          "",true,false
        );
    }, [formState.transaction.master.mannualInvoiceNumber]);

    return (
      <>
          <div className="flex items-end gap-1">
            <ERPInput
              localInputBox={props.localInputBox}
              id="orderNumber"
              label={props.label}
              noLabel={props.label == undefined}
              value={orderNumberValue}
               className="flex-1 max-w-none sm:max-w-28"
              onChange={(e) => onOrderNumberChange(e.target.value)}
            />
            {(
                <button
                  className="bg-gray-300 p-2 rounded-md hover:shadow-md transition duration-300 flex-shrink-0"
                  onClick={showLoadByRefNo}
                >
                  <Ellipsis className="w-4 h-4" />
                </button>
              )}
          </div>

      </>
    );
  }
);

export default React.memo(ManualInvNo);
