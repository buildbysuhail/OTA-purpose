import { APIClient } from "../../../../helpers/api-client";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import {
  AccVoucherElementProps,
} from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";

interface AccVoucherNoPrefixProps extends AccVoucherElementProps {}

const AccDrCrJv = React.forwardRef<
  HTMLInputElement,
  AccVoucherNoPrefixProps
>(
  (
    {
      formState,

      dispatch,

      t,
    },
    ref
  ) => {
      return (
      <>
        {formState.formElements.masterAccount.visible &&
          formState.formElements?.masterAccount?.accLedgerType != undefined && (
            <>
              {formState.formElements.jvDrCr.visible && (
                <ERPDataCombobox
                ref={ref}
                  localInputBox={formState?.userConfig?.inputBoxStyle}
                  enableClearOption={false}
                  id="drCr"
                  className="min-w-[70px] max-w-[170px] ml-4"
                  label={t(formState.formElements.jvDrCr.label)}
                  value={
                    formState.transaction.master.drCr == undefined ||
                    formState.transaction.master.drCr == ""
                      ? "Dr"
                      : formState.transaction.master.drCr
                  }
                  data={formState.transaction.master}
                  onChange={(e) => {
                    dispatch(
                      accFormStateTransactionMasterHandleFieldChange({
                        fields: { drCr: e.value },
                      })
                    );
                  }}
                  field={{
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  options={[
                    { value: "Dr", label: "Debit" },
                    { value: "Cr", label: "Credit" },
                  ]}
                  disabled={
                    formState.formElements.jvDrCr?.disabled ||
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

export default React.memo(AccDrCrJv);
