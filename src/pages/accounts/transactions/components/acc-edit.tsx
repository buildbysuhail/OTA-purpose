import { APIClient } from "../../../../helpers/api-client";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import {
  AccVoucherElementProps
} from "../acc-transaction-types";
import { accFormStateTransactionMasterHandleFieldChange } from "../reducer";
import VoucherNumberDetailsSidebar from "../../../transaction-base/Voucher-number-details";
import { forwardRef, useRef } from "react";
import React from "react";

const api = new APIClient();

interface editProps extends AccVoucherElementProps { enableCombo: () => Promise<void>;}

const AccEdit = React.forwardRef<HTMLInputElement, editProps>(
  ({ formState, enableCombo, t }) => {
    const voucherNumberRef = useRef<HTMLInputElement>(null); // Ref for voucherNumber
    return (
      <>
        {formState.formElements.linkEdit.visible == true && (
          <button className="">
            <span
              className="hover:underline text-[#0ea5e9] capitalize ml-1"
              onClick={() => {
                enableCombo();
              }}
            >
              {t("edit")}
            </span>
          </button>
        )}
      </>
    );
  }
);

export default React.memo(AccEdit);
