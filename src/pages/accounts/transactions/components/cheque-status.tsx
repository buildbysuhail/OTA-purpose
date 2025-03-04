import React, { useRef } from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface ChequeStatusProps extends AccVoucherElementProps { }

const ChequeStatus = React.forwardRef<HTMLInputElement, ChequeStatusProps>(({
  formState,
  dispatch,
  t
}, ref) => {
  const chequeStatusRef = useRef<HTMLInputElement>(null);
  return (
    <>
      {formState.formElements.chequeStatus.visible && (
        <ERPDataCombobox
          ref={chequeStatusRef}
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          id="chequeStatus"
          label={t(formState.formElements.chequeStatus.label)}
          value={formState.row.chequeStatus}
          data={formState.row}
          onChange={(e) => {
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { chequeStatus: e.value },
              })
            )
          }}
          field={{
            valueKey: "value",
            labelKey: "label",
          }}
          options={[
            { value: "pending", label: "Pending" },
            { value: "cleared", label: "Cleared" },
          ]}
          disabled={
            formState.formElements.chequeStatus?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(ChequeStatus);
