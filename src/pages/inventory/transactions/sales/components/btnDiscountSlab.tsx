import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnDiscountSlabProps extends VoucherElementProps {
  discSlabBtnClick: () => void;

}

const BtnDiscountSlab = React.forwardRef<HTMLButtonElement, BtnDiscountSlabProps>(({
  formState,
  dispatch,
  t,
  discSlabBtnClick

}, ref) => {

  return (
    <>
      {formState.formElements.btnDiscountSlab.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnDiscountSlab.label) || t('disc_slab')}
          variant="custom"
          customVariant="bg-[#ff0000] hover:bg-[#dd0000] text-white"
          type="button"
          onClick={() => discSlabBtnClick()}
          disableEnterNavigation
        />
      )}
    </>
  );
});

export default React.memo(BtnDiscountSlab);
