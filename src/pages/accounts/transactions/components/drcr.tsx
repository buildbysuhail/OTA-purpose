import React, { useRef } from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";

interface DrCrProps extends AccVoucherElementProps { }

const DrCr = React.forwardRef<HTMLInputElement, DrCrProps>(({
  formState,
  dispatch,
  t,
  handleKeyDown
}, ref) => {

  return (
    <>
      {formState.formElements.drCr.visible && (
        <ERPDataCombobox
          onKeyDown={(e) => {
            handleKeyDown && handleKeyDown(e, "drCr");
          }}
          ref={ref}
          disableEnterNavigation={true}
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="drCr"
          enableClearOption={false}
          className="min-w-[70px] max-w-[150px]"
          label={t(formState.formElements.drCr.label)}
          value={
            formState.row.drCr == undefined ||
              formState.row.drCr == ""
              ? "Dr"
              : formState.row.drCr
          }
          onSelectItem={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { drCr: e.value },
              })
            )
          }
          field={{
            valueKey: "value",
            labelKey: "label",
          }}
          options={[
            { value: "Dr", label: "Debit" },
            { value: "Cr", label: "Credit" },
          ]}
          disabled={
            formState.formElements.drCr?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
});

export default React.memo(DrCr);
