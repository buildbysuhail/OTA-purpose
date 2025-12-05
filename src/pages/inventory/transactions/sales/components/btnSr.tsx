import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnSrProps extends VoucherElementProps {
  srBtnClick: () => void;

}

const BtnSr = React.forwardRef<HTMLButtonElement, BtnSrProps>(({
  formState,
  dispatch,
  t,
  srBtnClick

}, ref) => {

  return (
    <>
      {formState.formElements.btnSr.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnSr.label) || t('sr')}
          variant="secondary"
          className="!h-[38px] !px-3"
          // variant="custom"
          // customVariant="bg-[#0d7377] hover:bg-[#0a5c5f] text-white"
          type="button"
          onClick={() => srBtnClick()}
          disableEnterNavigation
        />
      )}
    </>
  );
});

export default React.memo(BtnSr);
