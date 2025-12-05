import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnTenderProps extends VoucherElementProps {
  tenderBtnClick: () => void;

}

const BtnTender = React.forwardRef<HTMLButtonElement, BtnTenderProps>(({
  formState,
  dispatch,
  t,
  tenderBtnClick

}, ref) => {

  return (
    <>
      {formState.formElements.btnTender.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnTender.label) || t('tender')}
          variant="secondary"
          //   customVariant="bg-[#ff0000] hover:bg-[#dd0000] text-white"
          type="button"
          onClick={() => tenderBtnClick()}
          disableEnterNavigation
        />
      )}
    </>
  );
});

export default React.memo(BtnTender);
