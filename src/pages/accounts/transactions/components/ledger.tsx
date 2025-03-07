import React, { useRef } from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange, updateFormElement } from "../reducer";
import Urls from "../../../../redux/urls";
import CustomerDetailsSidebar from "../../../transaction-base/customer-details";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface LedgerProps extends AccVoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  triggerEffect: boolean;
}

const Ledger = React.forwardRef<HTMLInputElement, LedgerProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown,
  triggerEffect,
  handleFieldKeyDown
}, ref) => {
  const { getFormattedValue } = useNumberFormat();
  return (
    <>
      {formState.formElements.ledgerID.visible && (
        <>
          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            ref={ref}
            triggerEffect={triggerEffect}
            id="ledgerID"
            required={true}
            className={formState.userConfig?.isExpanded ? "w-[350px]" : "w-full"}
            value={formState.row.ledgerID}
            label={t(formState.formElements.ledgerID.label)}
            data={formState.row}
            reload={formState.formElements.ledgerID.reload}
            disableEnterNavigation={true}
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
                accFormStateRowHandleFieldChange({
                  fields: { ledgerID: e.value, ledgerName: e.label },
                })
              );
              handleFieldKeyDown("ledgerID", e.value);
            }}
            field={{
              id: "ledgerID",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_acc_ledgers,
            }}
            disabled={
              formState.formElements.ledgerID?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
            labelInfo={
              formState.formElements.pnlMasters?.disabled ==
                true ? null : (
                <div>
                  <span className="text-primary">
                    <button className="pe-3">
                      <CustomerDetailsSidebar displayType="link" />
                    </button>
                    {t("bal")}:{" "}
                    {`${getFormattedValue(
                      formState.ledgerBalance < 0
                        ? -1 * formState.ledgerBalance
                        : formState.ledgerBalance || 0
                    )} ${(formState.ledgerBalance ?? 0) < 0 ? "Cr" : "Dr"
                      }`}
                  </span>
                </div>
              )
            }
          />
        </>
      )}
    </>
  );
});

export default React.memo(Ledger);
