import React, { useRef } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import Urls from "../../../../../redux/urls";
import CustomerDetailsSidebar from "../../../../transaction-base/customer-details";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { updateFormElement, formStateMasterHandleFieldChange, formStateHandleFieldChange } from "../reducer";

interface LedgerProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  triggerEffect: boolean;
  setIsPartyDetailsOpen: () => void;
}

const PartyLedger = React.forwardRef<HTMLInputElement, LedgerProps>(
  (
    {
      formState,
      dispatch,
      t,
      handleKeyDown,
      triggerEffect,
      handleFieldKeyDown,
      setIsPartyDetailsOpen,
    },
    ref
  ) => {
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
              className="w-full min-w-[150px]"
              value={formState.transaction.master.ledgerID}
              label={t(formState.formElements.ledgerID.label)}
              data={formState.transaction.master}
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
                getListUrl: Urls.data_parties,
              }}
              disabled={
                formState.formElements.ledgerID?.disabled ||
                formState.formElements.pnlMasters?.disabled
              }
              labelInfo={
                formState.formElements.pnlMasters?.disabled == true ? null : (
                  <div>
                    <span className="text-primary">
                      <a
                        onClick={setIsPartyDetailsOpen}
                        className="hover:underline text-[#0ea5e9] capitalize ml-1 pe-3 cursor-pointer"
                      >
                        details
                      </a>
                      {t("bal")}:{" "}
                      {`${getFormattedValue(
                        formState.ledgerBalance < 0
                          ? -1 * formState.ledgerBalance
                          : formState.ledgerBalance || 0
                      )} ${(formState.ledgerBalance ?? 0) < 0 ? "Cr" : "Dr"}`}
                    </span>
                  </div>
                )
              }
            />
            {/* <ERPInput
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="partyName"
              label={t("name")}
              value={formState.transaction.master.partyName}
              className="max-w-full"
              onChange={(e) =>
                dispatch(
                  formStateMasterHandleFieldChange({
                    fields: { partyName: e.target?.value },
                  })
                )
              }
              disabled={
                formState.formElements.pnlMasters?.disabled
              }
            />

            <ERPInput
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="address1"
              label={t("address")}
              value={formState.transaction.master.address1}
              className="max-w-full"
              onChange={(e) =>
                dispatch(
                  formStateMasterHandleFieldChange({
                    fields: { address1: e.target?.value },
                  })
                )
              }
              disabled={
                formState.formElements.pnlMasters?.disabled
              }
            />
            <ERPInput
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="address2"
              noLabel
              value={formState.transaction.master.address2}
              className="max-w-full"
              onChange={(e) =>
                dispatch(
                  formStateMasterHandleFieldChange({
                    fields: { address2: e.target?.value },
                  })
                )
              }
              disabled={
                formState.formElements.pnlMasters?.disabled
              }
            />
            <ERPCheckbox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="enableTaxNumber"
          className="text-left"
          label={t(formState.formElements.chkTaxNumber.label)}
          checked={formState.enableTaxNumber}
          onChange={(e) => {
            dispatch(
              formStateHandleFieldChange({
                fields: { enableTaxNumber: e.target.checked },
              })
            );
            
          }}
          disabled={
            formState.formElements.pnlMasters?.disabled
          }
        />
            <ERPInput
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="tokenNumber"
              noLabel
              value={formState.transaction.master.tokenNumber}
              className="max-w-full"
              onChange={(e: any) =>
                dispatch(
                  formStateMasterHandleFieldChange({
                    fields: { tokenNumber: e.target?.value },
                  })
                )
              }
              disabled={
                formState.formElements.pnlMasters?.disabled
              }
            /> */}
          </>
        )}
      </>
    );
  }
);

export default React.memo(PartyLedger);