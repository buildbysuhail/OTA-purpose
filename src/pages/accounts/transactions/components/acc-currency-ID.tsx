import { APIClient } from "../../../../helpers/api-client";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange, accFormStateTransactionMasterHandleFieldChange, } from "../reducer";
import { useRef } from "react";
import React from "react";
import Urls from "../../../../redux/urls";

const api = new APIClient();

interface AccCurrencyIDProps extends AccVoucherElementProps { }

const AccCurrencyID = React.forwardRef<HTMLInputElement, AccCurrencyIDProps>(({
  formState,
  dispatch,
  t,
}, ref) => {
  const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber
  return (
    <>
      {formState.formElements.foreignCurrency.visible == true &&
        formState.foreignCurrency == true && (
          <>
            {formState.formElements.currencyID.visible && (
              <ERPDataCombobox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="currencyID"
                data={formState.row}
                label={t(formState.formElements.currencyID.label)}
                value={formState.transaction.master.currencyID}
                field={{
                  valueKey: "id",
                  labelKey: "name",
                  nameKey: "rate",
                  getListUrl: Urls.data_currencies,
                }}
                onSelectItem={(e) => {
                  dispatch(
                    accFormStateTransactionMasterHandleFieldChange({
                      fields: {
                        currencyID: e.value,
                        currencyRate: e.rate,
                        currencyName: e.label,
                      },
                    })
                  );
                  dispatch(
                    accFormStateRowHandleFieldChange({
                      fields: {},
                    })
                  );
                }}
                disabled={
                  formState.formElements.currencyID?.disabled ||
                  formState.formElements.pnlMasters?.disabled
                }
              />
            )}
          </>
        )}
    </>
  );
}
);

export default React.memo(AccCurrencyID);
