import { APIClient } from "../../../../../helpers/api-client";
import { VoucherElementProps } from "../transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import { useRef } from "react";
import React from "react";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";

interface AccReferenceDateProps extends VoucherElementProps {}

const AccReferenceDate = React.forwardRef<
  HTMLInputElement,
  AccReferenceDateProps
>(
  ({
    formState,

    dispatch,

    t,
  }, ref) => {
     return (
      <>
        {formState.formElements.referenceDate.visible && (
          <ERPDateInput
            localInputBox={formState.userConfig?.inputBoxStyle}
            id="referenceDate"
            label={t(formState.formElements.referenceDate.label)}
            className="lg:max-w-[300px]"
            value={new Date(formState.transaction.master.referenceDate)}
            onChange={(e) =>
              dispatch(
                formStateMasterHandleFieldChange({
                  fields: { referenceDate: e.target?.value },
                })
              )
            }
            disabled={
              formState.formElements.referenceDate?.disabled ||
              formState.formElements.pnlMasters?.disabled
            }
          />
        )}
      </>
    );
  }
);

export default React.memo(AccReferenceDate);
