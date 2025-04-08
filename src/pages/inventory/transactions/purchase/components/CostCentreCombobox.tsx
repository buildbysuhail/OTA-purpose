import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import Urls from "../../../../../redux/urls";

interface CostCentreComboboxProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  handleKeyDown?: (e: React.KeyboardEvent, field: string) => void;
}

const CostCentreCombobox = React.forwardRef<
  HTMLInputElement,
  CostCentreComboboxProps
>(({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown }, ref) => {
  return (
    <ERPDataCombobox
      localInputBox={formState?.userConfig?.inputBoxStyle}
      enableClearOption={false}
      id="costCentreID"
      className="min-w-[180px]"
      label={t(formState.formElements.costCentreID.label)}
      data={formState.transaction.master}
      onSelectItem={(e) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: {
              costCentreID: e.value,
            },
          })
        );
        handleFieldKeyDown("costCentreID", "Enter");
      }}
      value={formState.transaction.master.costCentreID}
      field={{
        id: "costCentreID",
        valueKey: "id",
        labelKey: "name",
        getListUrl: Urls.data_costcentres,
      }}
      disabled={
        formState.formElements.costCentreID.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
      disableEnterNavigation
      onKeyDown={(e: any) => {
        handleKeyDown?.(e, "costCentreID");
      }}
    />
  );
});

export default React.memo(CostCentreCombobox);
