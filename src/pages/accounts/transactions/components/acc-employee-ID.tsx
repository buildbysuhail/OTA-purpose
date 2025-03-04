import { APIClient } from "../../../../helpers/api-client";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";
import Urls from "../../../../redux/urls";

const api = new APIClient();

interface AccEmployeeIDProps extends AccVoucherElementProps {}

const AccEmployeeID = React.forwardRef<HTMLInputElement, AccEmployeeIDProps>(
  (
    {
      formState,

      dispatch,

      handleKeyDown,

      t,
    },
  ) => {
    const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber
    return (
      <>
        {formState.formElements.employee.visible && (
          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="employeeID"
            label={t(formState.formElements.employee.label)}
            value={formState.transaction.master.employeeID}
            className="lg:max-w-[300px]"
            onChange={(e) => {
              dispatch(
                accFormStateTransactionMasterHandleFieldChange({
                  fields: { employeeID: e.value },
                })
              );
            }}
            onSelectItem={(e) => {
              handleKeyDown && handleKeyDown("ledgerCode", e);
            }}
            field={{
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_employees,
            }}
            disabled={
              formState.formElements.employee?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
          />
        )}
      </>
    );
  }
);

export default React.memo(AccEmployeeID);
