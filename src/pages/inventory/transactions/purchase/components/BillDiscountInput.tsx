import React from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { ChevronUp } from "lucide-react";

interface BillDiscountInputProps extends VoucherElementProps {
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
  ) => void;
  dispatch: any;
  footerLayout?: "horizontal" | "vertical";
  applyDiscountsToItems?: () => void; // Add this line
}

const BillDiscountInput: React.FC<BillDiscountInputProps> = ({
  formState,
  dispatch,
  t,
  handleKeyDown,
  footerLayout,
  applyDiscountsToItems, // Add this line
}) => {
  const { value, onChange } = useDebouncedInput(
    formState.transaction.master.billDiscount || "",
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { billDiscount: debouncedValue },
        })
      );
    },
    300
  );

  return (
    <ERPInput
      localInputBox={formState?.userConfig?.inputBoxStyle}
      fetching={formState.transactionLoading}
      id="billDiscount"
      type="number"
      labelDirection={footerLayout === "vertical" ? "horizontal" : "vertical"}
      label={t(formState.formElements.billDiscount.label)}
      value={value}
      disableEnterNavigation={true}
      onKeyDown={(e) => {
        handleKeyDown && handleKeyDown(e, "billDiscount");
      }}
      onChange={(e) => onChange(e.target.value)}
      className={`${
        footerLayout === "vertical"
          ? "w-full"
          : "max-w-[110px] min-w-[110px] !m-0"
      }`}
      disabled={
        formState.formElements.billDiscount?.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
      customButton={
        <button
          type="button"
          style={{
            background: "#d32828",
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
          onClick={() => {
            if (applyDiscountsToItems) applyDiscountsToItems();
          }}
        >
          <ChevronUp size={20} color="#fff" />
        </button>
      }
    />
  );
};

export default React.memo(BillDiscountInput);
