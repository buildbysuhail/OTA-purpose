import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";


interface AccCurrencyRateProps extends AccVoucherElementProps {}

const AccCurrencyRate = React.forwardRef<
  HTMLInputElement,
  AccCurrencyRateProps
>(
  (
    {
      formState,

      dispatch,

      t,
    }, ref) => {
    return (
      <>
        {formState.formElements.foreignCurrency.visible == true &&
          formState.foreignCurrency == true && (
            <>
              {formState.formElements.exchangeRate.visible && (
                <ERPInput
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  id="currencyRate"
                  min={0}
                  label={t(formState.formElements.exchangeRate.label)}
                  type="number"
                  value={formState.transaction.master.currencyRate}
                  onChange={(e) =>
                    dispatch(
                      accFormStateTransactionMasterHandleFieldChange({
                        fields: { currencyRate: e.target?.value },
                      })
                    )
                  }
                  disabled={
                    formState.formElements.exchangeRate?.disabled ||
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

export default React.memo(AccCurrencyRate);
