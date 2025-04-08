import React, { useRef } from "react";
import { VoucherElementProps } from "../transaction-types";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { LedgerType } from "../../../../../enums/ledger-types";
import { formStateHandleFieldChange, formStateMasterHandleFieldChange } from "../reducer";

interface DebitAccountProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}
const DebitAccount = React.forwardRef<HTMLInputElement, DebitAccountProps>(({
  formState,
  dispatch,
  t,
}, ref) => {
  


  return (
    <div className="xl:w-[170px] lg:w-[250px]">
      {formState.formElements.chkDebitAccount.visible && (
        <ERPCheckbox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="enableDebitAccount"
          className="text-left"
          label={t(formState.formElements.chkDebitAccount.label)}
          checked={formState.enableDebitAccount}
          onChange={(e) => {
            dispatch(
              formStateHandleFieldChange({
                fields: { enableDebitAccount: e.target.checked },
              })
            );
            
          }}
          disabled={
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}

      {formState.formElements.cbDebitAccount.visible && (
        <ERPDataCombobox
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  enableClearOption={false}
                  ref={ref}
                  id="inventoryLedgerID"
                  // nameField="costCentreName"
                  noLabel
                  className="min-w-[180px]"
                  label={t(formState.formElements.cbDebitAccount.label)}
                  data={formState.transaction.master}
                  onSelectItem={(e) => {
                    dispatch(
                      formStateMasterHandleFieldChange({
                        fields: {
                          inventoryLedgerID: e.value,
                        },
                      })
                    );
                  }}
                  value={formState.transaction.master.inventoryLedgerID}
                  field={{
                    id: "inventoryLedgerID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_employees,
                    params: `ledgerType=${formState.formElements?.cbDebitAccount?.accLedgerType || LedgerType.All}`,
                  }}
                  disabled={
                    formState.formElements.cbDebitAccount.disabled ||
                    formState.enableDebitAccount == false ||
                    formState.formElements.pnlMasters?.disabled
                  }
                  // disableEnterNavigation
                />
      )}
    </div>
  );
});

export default React.memo(DebitAccount);
