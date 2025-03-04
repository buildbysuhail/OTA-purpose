import { APIClient } from "../../../../helpers/api-client";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateHandleFieldChange, updateFormElement, } from "../reducer";
import React from "react";
import Urls from "../../../../redux/urls";

interface AccMasterAccountrProps extends AccVoucherElementProps { getFormattedValue: (val: number, ignoreNullOrZero?: boolean, decimalPoint?: number | undefined) => string; }

const AccMasterAccount = React.forwardRef<HTMLInputElement, AccMasterAccountrProps>(({
  formState,
  dispatch,
  getFormattedValue,
  t
}, ref) => {
  return (
    <>
      {formState.formElements.masterAccount.visible &&
        formState.formElements?.masterAccount?.accLedgerType != undefined && (
          
          <ERPDataCombobox
          ref={ref}
            localInputBox={formState?.userConfig?.inputBoxStyle}
            isInModal={false}
            className="w-full"
            id="masterAccount"
            label={t(formState.formElements.masterAccount.label)}
            value={formState.masterAccountID}
            onChange={(e) =>
              dispatch(
                accFormStateHandleFieldChange({
                  fields: { masterAccountID: e.value },
                })
              )
            }
            reload={formState.formElements.masterAccount.reload}
            changeReload={(reload: boolean) =>
              dispatch(
                updateFormElement({
                  fields: { masterAccount: { reload: reload } },
                })
              )
            }
            field={{
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerType=${formState.formElements?.masterAccount?.accLedgerType}`,
            }}
            disabled={
              formState.formElements.masterAccount?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
            labelInfo={
              <div className="">
                <span className="text-xx text-primary">
                  <button className="pe-3">
                    {/* <CustomerDetailsSidebar displayType="link" /> */}
                  </button>
                  {t("bal")}:{" "}
                  {`${getFormattedValue(
                    formState.masterBalance < 0
                      ? -1 * formState.masterBalance
                      : formState.masterBalance || 0
                  )} ${(formState.masterBalance ?? 0) < 0 ? "Cr" : "Dr"}`}
                </span>
              </div>
            }
          />
        )}
    </>
  );
});

export default React.memo(AccMasterAccount);
