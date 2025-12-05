import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnBtnOfferAchievedProps extends VoucherElementProps {
  offerAchievedBtnClick: () => void;

}

const BtnOfferAchieved = React.forwardRef<HTMLButtonElement, BtnBtnOfferAchievedProps>(({
  formState,
  dispatch,
  t,
  offerAchievedBtnClick

}, ref) => {

  return (
    <>
      {formState.formElements.btnGiftOnBilling.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnGiftOnBilling.label)}
          variant="custom"
          customVariant="bg-[#00ff00] hover:bg-[#00dd00] text-black"
          type="button"
          onClick={() => offerAchievedBtnClick()}
          disableEnterNavigation
        />
      )}
    </>
  );
});

export default React.memo(BtnOfferAchieved);
