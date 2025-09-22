import { APIClient } from "../../../../../helpers/api-client";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../../transaction-base/Voucher-number-details";
import React from "react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { LoadAndSetTransVoucherFn } from "../use-transaction";

const api = new APIClient();

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
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { voucherNumber: debouncedValue },
          })
        );
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
                debugger;
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
              debugger;
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
                onChange(e.target.value);
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