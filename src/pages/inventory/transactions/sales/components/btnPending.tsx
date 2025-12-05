import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnPendingProps extends VoucherElementProps {
  pendingBtnClick: () => void;

}

const BtnPending = React.forwardRef<HTMLButtonElement, BtnPendingProps>(({
  formState,
  dispatch,
  t,
  pendingBtnClick

}, ref) => {

  return (
    <>
      {formState.formElements.btnPending.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnPending.label) || t('pending')}
          variant="custom"
          customVariant="bg-[#0d7377] hover:bg-[#0a5c5f] text-white"
          type="button"
          onClick={() => pendingBtnClick()}
          disableEnterNavigation
        />
      )}
    </>
  );
});

export default React.memo(BtnPending);
