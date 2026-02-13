import React from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { VoucherElementProps } from "../../transaction-types";

interface BtnInvoiceProps extends VoucherElementProps {
  invoiceBtnClick: () => void;
}

const BtnToInvoice = React.forwardRef<HTMLButtonElement, BtnInvoiceProps>(
  ({ formState, dispatch, t, invoiceBtnClick }, ref) => {
    if (!formState?.formElements?.btnConvertToInvoice?.visible) return null;

    return (
      <ERPButton
        localInputBox={formState?.userConfig?.inputBoxStyle}
        ref={ref}
        title={t("invoice")}
        variant="secondary"
        type="button"
        onClick={invoiceBtnClick}
        disableEnterNavigation
      />
    );
  }
);

export default React.memo(BtnToInvoice);
