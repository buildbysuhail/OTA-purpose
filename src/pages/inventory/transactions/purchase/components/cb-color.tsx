import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../../purchase/reducer";
import Urls from "../../../../../redux/urls";

interface ColorProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const Color = React.forwardRef<HTMLInputElement, ColorProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {
  return (
    <>
      {formState.formElements.colourID.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="colourID"
          className="min-w-[180px]"
          label={t(formState.formElements.colourID.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  // colourID: e.value,
                },
              })
            );
            handleFieldKeyDown("colourID", "Enter");
          }}
          // value={formState.transaction.master.colourID}
          field={{
            id: "colourID",
            valueKey: "id",
            labelKey: "name",
            // getListUrl: Urls.data_colours,
          }}
          disabled={
            formState.formElements.colourID.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e: any) => {
            handleKeyDown && handleKeyDown(e, "color");
          }}
        />
      )}
    </>
  );
});

export default React.memo(Color);
