import ERPInput from "../../../../../components/ERPComponents/erp-input";
import VoucherNumberDetailsSidebar from "../../../../transaction-base/Voucher-number-details";
import React from "react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { LoadAndSetTransVoucherFn } from "../use-transaction";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface AccVoucherNoProps {
  phone?: boolean;
}

interface VoucherNoPrefixProps extends VoucherElementProps, AccVoucherNoProps {
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn
}

const AccVoucherNo = React.forwardRef<HTMLInputElement, VoucherNoPrefixProps>(
  (
    { formState, dispatch, handleKeyDown, loadAndSetTransVoucher, t, phone },
    ref
  ) => {
    const { value, onChange } = useDebouncedInput(
      formState.transaction.master.voucherNumber || '',
      (debouncedValue) => {
        // Only update if the value is numeric or empty
        const strValue = String(debouncedValue);
        if (strValue === '' || /^\d+$/.test(strValue)) {
          dispatch(
            formStateMasterHandleFieldChange({
              fields: { voucherNumber: strValue },
            })
          );
        }
      },
      300
    );

    return (
      <>
        {formState.formElements.voucherNumber.visible && (
          <ERPInput
            disableEnterNavigation={true}
            ref={ref}
            id="voucherNumber"
            localInputBox={formState?.userConfig?.inputBoxStyle}
            onKeyUp={async(e) => {
              if(e.key == "Enter") {
                await loadAndSetTransVoucher(
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
                  false,false,"","",""
                );
              }
              handleKeyDown && handleKeyDown(e, "voucherNumber");
            }}
            min={1}
            label={
              phone
                ? "Voucher No"
                : t(formState.formElements.voucherNumber.label)
            }
            value={value}
            type="number"
            required={true}
            fetching={formState.transactionLoading}
            // transactionLoading={true}
            showCustomNumberChanger={
              formState.formElements.voucherNumberUpDownBtns.visible == true
            }
            numberChangerStyle="horizontal" // or "vertical"
            className="w-full max-w-[150px]"
            onChange={async (e: any) => {
              if (e.isCustomNumberChangerEvent == true) {
                const ret = await loadAndSetTransVoucher(
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
                  false,false,"","",""
                );
              } else {
                // Only update if the value is numeric or empty
                const newValue = e.target.value;
                if (newValue === '' || /^\d+$/.test(newValue)) {
                  onChange(newValue);
                }
              }
            }}
            disabled={formState.formElements.voucherNumber?.disabled}
            labelInfo={
              <button className={`pe-3`}>
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