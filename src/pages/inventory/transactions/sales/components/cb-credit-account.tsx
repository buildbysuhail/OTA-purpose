import React from "react";
import { VoucherElementProps } from "../../transaction-types";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { LedgerType } from "../../../../../enums/ledger-types";
import { formStateHandleFieldChange, formStateMasterHandleFieldChange } from "../../reducer";
import VoucherType from "../../../../../enums/voucher-types";
import { useAppState } from "../../../../../utilities/hooks/useAppState";

interface CreditAccountProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  transactionType: string
}
const CreditAccount = React.forwardRef<HTMLInputElement, CreditAccountProps>(({ formState, dispatch, transactionType, t, }, ref) => {
  const { appState } = useAppState();
  const isRtl = appState.locale.rtl;
  return (
    <div className="xl:w-[170px] lg:w-[250px]">
      {formState.transaction.master.voucherType !== VoucherType.GoodsReceiptNote && (
        <>
          {formState.formElements.chkCreditAccount.visible && (
            <ERPCheckbox
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="enableCreditAccount"
              className={`${isRtl ? "text-right" : "text-left"}`}
              label={t(formState.formElements.chkCreditAccount.label)}
              checked={formState.enableCreditAccount}
              onChange={(e) => {
                dispatch(
                  formStateHandleFieldChange({
                    fields: { enableCreditAccount: e.target.checked },
                  })
                );

              }}
              disabled={
                formState.formElements.pnlMasters?.disabled
              }
            />
          )}
        </>
      )}

      {formState.formElements.cbCreditAccount.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="inventoryLedgerID"
          // nameField="costCentreName"
          noLabel
          // className="min-w-[180px] !m-0"
          fetching={formState.transactionLoading}
          // transactionLoading={true}
          label={t(formState.formElements.cbCreditAccount.label)}
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
            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/AccLedgers/`,
            params: `ledgerType=${formState?.formElements?.cbCreditAccount.accLedgerType ?? LedgerType.SalesAndDirectIncome}`
          }}
          disabled={
            formState.formElements.cbCreditAccount.disabled ||
            formState.enableCreditAccount == false ||
            formState.formElements.pnlMasters?.disabled
          }
        // disableEnterNavigation
        />
      )}
    </div>
  );
});

export default React.memo(CreditAccount);
