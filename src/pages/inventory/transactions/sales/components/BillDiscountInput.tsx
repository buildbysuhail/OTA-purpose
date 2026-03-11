import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { ChevronUp } from "lucide-react";
import VoucherType from "../../../../../enums/voucher-types";
import { formStateHandleFieldChange, formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface BillDiscountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
  dispatch: any;
  footerLayout?: "horizontal" | "vertical";
  applyDiscountsToItems?: () => void; // Add this line
  applyTaxOnBillDiscount?: (billDiscount: number) => void;
}

const BillDiscountInput: React.FC<BillDiscountInputProps> = ({ formState, dispatch, t, handleKeyDown, footerLayout, applyDiscountsToItems, applyTaxOnBillDiscount}) => {
  
     // Find discount amount from percentage
      const { value, onChange } = useDebouncedInput(
        formState.billDiscountPerc || 0,
        (debouncedValue) => {
          const netAmount = formState.summary.total || 0;
          const discPerc = Number(debouncedValue);
          const billDisc = (netAmount * discPerc) / 100;
          dispatch(
            formStateHandleFieldChange({
              fields: { billDiscountPerc: discPerc },
            })
          );

          dispatch(
            formStateMasterHandleFieldChange({
              fields: { billDiscount: billDisc },
            })
          );
          
          applyTaxOnBillDiscount && applyTaxOnBillDiscount(billDisc);
        },
        100
    );

    // Find percentage from bill dic amount
    const { value: valuePerc, onChange: onChangePerc } = useDebouncedInput(
      formState.transaction.master.billDiscount || 0,
      (debouncedValue) => {
        const netAmount = formState.summary.total || 0;
        const BillDisc = Number(debouncedValue);
        const discPerc = netAmount > 0 ? (BillDisc / netAmount) * 100 : 0;

        dispatch(
          formStateMasterHandleFieldChange({
            fields: { billDiscount: BillDisc },
          })
        );

        dispatch(
          formStateHandleFieldChange({
            fields: { billDiscountPerc: discPerc },
          })
        );
        applyTaxOnBillDiscount && applyTaxOnBillDiscount(BillDisc);
      },
      100
    );

  return (
   <div className="flex flex-col gap-0.5">
      <ERPInput
      localInputBox={formState?.userConfig?.inputBoxStyle}
      fetching={formState.transactionLoading}
      id="billDiscountPerc"
      type="number"
      labelDirection={footerLayout === "vertical" ? "horizontal" : "vertical"}
      label={t(formState.formElements.billDiscount.label)}
      value={formState.transaction.master.billDiscount == 0 ? 0 : value}
      disableEnterNavigation={true}
      onKeyDown={(e) => { handleKeyDown && handleKeyDown(e, "billDiscount"); }}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`${footerLayout === "vertical" ? "w-full" : "max-w-[110px] min-w-[110px] !m-0 "}`}
      disabled={formState.formElements.billDiscount?.disabled || formState.formElements.pnlMasters?.disabled}
      customButton={
        formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
          <button
              type="button"
              style={{
              background: "#8080809c",
              border: "none",
              borderRadius: "6px 6px 6px 6px",
              padding: "0px 0px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              // marginRight: "-7px",
              // marginLeft: "-7px"
            }}
            onClick={() => { if (applyDiscountsToItems) applyDiscountsToItems(); }}>
            <ChevronUp size={20} color="#fff" />
          </button>
        )
      }
    />
      <ERPInput
       localInputBox={formState?.userConfig?.inputBoxStyle}
      fetching={formState.transactionLoading}
      id="billDiscount"
      type="number"
      labelDirection={footerLayout === "vertical" ? "horizontal" : "vertical"}
      label={t(formState.formElements.billDiscount.label)}
      value={valuePerc}
      noLabel
      disableEnterNavigation={true}
      onKeyDown={(e) => { handleKeyDown && handleKeyDown(e, "billDiscount"); }}
      onChange={(e) => onChangePerc(Number(e.target.value))}
      className={`${footerLayout === "vertical" ? "w-full" : "max-w-[11px] min-w-[110px] !m-0"}`}
      disabled={formState.formElements.billDiscount?.disabled || formState.formElements.pnlMasters?.disabled}
    />
   </div>
  );
};

export default React.memo(BillDiscountInput);
