import React, { useRef } from "react";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface DiscountProps extends AccVoucherElementProps {
  focusDiscount: () => void;
  focusAmount: () => void;
}

const Discount = React.forwardRef<HTMLInputElement, DiscountProps>(({
  formState,
  dispatch,
  t,
  focusDiscount,
  focusAmount
}, ref) => {
  
  const discountRef = useRef<HTMLInputElement>(null);

  return (
    <div className="xl:w-[170px] lg:w-[250px]">
      {formState.formElements.discount.visible && (
        <ERPCheckbox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="hasDiscount"
          className="text-left"
          label={t(formState.formElements.hasDiscount.label)}
          checked={formState.row.hasDiscount}
          onChange={(e) => {
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { hasDiscount: e.target.checked },
              })
            );
            if (e.target.checked) {
              focusDiscount();
            } else {
              focusAmount();
            }
          }}
          disabled={
            formState.formElements.hasDiscount?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}

      {formState.formElements.discount.visible && (
        <ERPInput
          ref={discountRef}
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="discount"
          type="number"
          min={0}
          // className="!m-0"
          noLabel
          value={formState.row.discount}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { discount: e.target?.value },
              })
            )
          }
          disabled={
            formState.row.hasDiscount != true ||
            formState.formElements.discount?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </div>
  );
});

export default React.memo(Discount);
