import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../../purchase/reducer";
import Urls from "../../../../../redux/urls";

interface WarrantyProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const Warranty = React.forwardRef<HTMLInputElement, WarrantyProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {
  return (
    <>
      {formState.formElements.warrantyID.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="warrantyID"
          className="min-w-[180px]"
          label={t(formState.formElements.warrantyID.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  // warranty: e.value,
                },
              })
            );
            handleFieldKeyDown("warrantyID", "Enter");
          }}
          // value={formState.transaction.master.warrantyID}
          field={{
            id: "warrantyID",
            valueKey: "id",
            labelKey: "name",
            // getListUrl: Urls.data_warranties,
          }}
          disabled={
            formState.formElements.warrantyID.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e: any) => {
            handleKeyDown && handleKeyDown(e, "warranty");
          }}
        />
      )}
    </>
  );
});

export default React.memo(Warranty);
