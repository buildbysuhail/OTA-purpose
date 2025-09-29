import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import Urls from "../../../../../redux/urls";

interface LedgerCodeProps extends VoucherElementProps {
  transactionType: string;
}

const LedgerCode = React.forwardRef<HTMLInputElement, LedgerCodeProps>(({ formState, dispatch, t, handleKeyDown, transactionType }, ref) => {
  const { value, onChange } = useDebouncedInput(
    formState.ledgerData?.ledgerCode || '',
    (debouncedValue) => {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {},
        })
      );
    }, 300
  );

  return (
    <>
      {formState.formElements.partyCode.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="partyId"
          className="w-[120px] !m-0"
          fetching={formState.transactionLoading}
          label={t(formState.formElements.partyCode.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
            
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: {
                  partyId: e.name,
                  transaction: {
                    master: {
                      ledgerID: e.name
                    }
                  },
                },
              })
            );
          }}
          value={value}
          field={{
            id: "partyId",
            valueKey: "alias",
            labelKey: "alias",
            nameKey: "id",
            getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/AccLedgers/`,
            params: `ledgerType=${formState.formElements?.ledgerID?.accLedgerType}`
          }}
          disabled={
            formState.formElements.partyCode?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation={true}
          onKeyDown={(e) => {
            handleKeyDown && handleKeyDown(e, "partyId");
          }}
        />
      )}
    </>
  );
});

export default React.memo(LedgerCode);