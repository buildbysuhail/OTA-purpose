import React from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { useAppState } from "../../../../../utilities/hooks/useAppState";
import { formStateHandleFieldChange, formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface VatTokenInputProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const VatTokenInput = React.forwardRef<HTMLInputElement, VatTokenInputProps>(({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown }, ref) => {
  const { appState } = useAppState();
  const isRtl = appState.locale.rtl;
  return (
    <div ref={ref}>
      {formState.formElements.chkVat?.visible && (
        <ERPCheckbox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="enableTaxNumber"
          className={`${isRtl ? "text-right" : "text-left"} dark:text-dark-text`}
          label={t(formState.formElements.chkVat.label)}
          checked={formState.enableTaxNumber}
          onChange={(e) => {
            dispatch(
              formStateHandleFieldChange({
                fields: { enableTaxNumber: e.target.checked },
              })
            );
          }}
          disabled={formState.formElements.pnlMasters?.disabled}
        />
      )}
      {formState.formElements.cbVatAccount?.visible && (
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="tokenNumber"
          label={t(formState.formElements.chkVat.label)}
          className="w-[120px] !m-0 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text"
          noLabel={true}
          fetching={formState.transactionLoading}
          data={formState.transaction.master}
          onChange={(e) => {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  tokenNumber: e.target.value,
                },
              })
            );
            handleFieldKeyDown && handleFieldKeyDown("tokenNumber", "Enter");
          }}
          value={formState.transaction.master.tokenNumber}
          disabled={formState.formElements.cbVatAccount.disabled || formState.enableTaxNumber === false || formState.formElements.pnlMasters?.disabled}
          disableEnterNavigation
          onKeyDown={(e: any) => { handleKeyDown && handleKeyDown(e, "tokenNumber"); }}
        />
      )}
    </div>
  );
}
);

export default React.memo(VatTokenInput);
