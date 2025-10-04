import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import VoucherType from "../../../../../enums/voucher-types";
import { updateFormElement, formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface LedgerProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  transactionType: string;
  setIsPartyDetailsOpen: () => void;
}

const PartyLedger = React.forwardRef<HTMLInputElement, LedgerProps>(
  ({ formState, dispatch, t, handleKeyDown, transactionType, handleFieldKeyDown, setIsPartyDetailsOpen, }, ref) => {
    const { getFormattedValue } = useNumberFormat();
    console.log("mj23");
    console.log({ formState: formState.transactionLoading });
    return (
      <>
        {formState.formElements.ledgerID.visible && (
          <>
            <ERPDataCombobox
              localInputBox={formState?.userConfig?.inputBoxStyle}
              ref={ref}
              id="ledgerID"
              required={true}
              className="w-full min-w-[150px]"
              value={formState.transaction.master.ledgerID}
              label={t(formState.formElements.ledgerID.label)}
              data={formState.transaction.master}
              reload={formState.formElements.ledgerID.reload}
              disableEnterNavigation={true}
              fetching={formState.transactionLoading || formState.formElements?.ledgerID?.accLedgerType == undefined}
              // transactionLoading={true}
              changeReload={() =>
                dispatch(
                  updateFormElement({
                    fields: { ledgerID: { reload: false } },
                  })
                )
              }
              onKeyDown={(e) => {
                handleKeyDown && handleKeyDown(e, "ledgerID");
              }}
              onSelectItem={(e) => {
                dispatch(
                  formStateMasterHandleFieldChange({
                    fields: { ledgerID: e.value, partyName: e.label },
                  })
                );
                handleFieldKeyDown("ledgerID", e.value);
              }}
              field={{
                id: "ledgerID",
                valueKey: "id",
                labelKey: "name",
                getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/AccLedgers/`,
                params: `ledgerType=${formState.formElements?.ledgerID?.accLedgerType}`
              }}
              disabled={
                formState.formElements.ledgerID?.disabled ||
                formState.formElements.pnlMasters?.disabled
              }
              labelInfo={
                formState.transaction.master.voucherType === VoucherType.PurchaseInvoice && (
                  <>
                    {formState.formElements.pnlMasters?.disabled == true ? null : (
                      <div>
                        <span className="text-primary" >
                          <a type="popup" onClick={setIsPartyDetailsOpen} className="hover:underline text-[#0ea5e9] capitalize ml-1 pe-3 cursor-pointer">{t('details')}</a>
                          {t("bal")}:{" "}
                          {`${getFormattedValue(
                            formState.ledgerBalance < 0
                              ? -1 * formState.ledgerBalance
                              : formState.ledgerBalance || 0
                          )} ${(formState.ledgerBalance ?? 0) < 0 ? "Cr" : "Dr"}`}
                        </span>
                      </div>
                    )}
                  </>
                )
              }
            />
          </>
        )}
      </>
    );
  }
);

export default React.memo(PartyLedger);