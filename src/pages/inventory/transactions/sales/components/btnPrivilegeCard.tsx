import React, { useRef } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnPrivilegeCardProps extends VoucherElementProps {
  privilegeCardBtnClick: () => void;

}

const BtnPrivilegeCard = React.forwardRef<HTMLButtonElement, BtnPrivilegeCardProps>(({
  formState,
  dispatch,
  t,
  privilegeCardBtnClick

}, ref) => {

  return (
    <>
      {formState.formElements.btnPrivilegeCard.visible === true && (
        <ERPButton
          localInputBox={formState?.userConfig?.inputBoxStyle}
          ref={ref}
          title={t(formState.formElements.btnPrivilegeCard.label) || t('privilege_card')}
          variant="custom"
          customVariant="bg-[#9b87f5] hover:bg-[#8b75e5] text-white"
          type="button"
          onClick={() => privilegeCardBtnClick()}
          disableEnterNavigation
        />
      )}
    </>
  );
});

export default React.memo(BtnPrivilegeCard);
