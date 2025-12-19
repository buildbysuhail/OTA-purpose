import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface CostCentreComboboxProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  handleKeyDown?: (e: React.KeyboardEvent, field: string) => void;
}

const CostCentreCombobox = React.forwardRef<HTMLInputElement, CostCentreComboboxProps>(({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown }, ref) => {
  return (
    <>
      {/* {formState.formElements.cbCostCentre.visible && ( */}
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          fetching={formState.transactionLoading}
          enableClearOption={false}
          id="costCentreID"
          className="min-w-[180px] !m-0"
          // required={formState.transaction.master.voucherType !== "PE"}
          label={t(formState.formElements.cbCostCentre.label)}
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
            formState.formElements.cbCostCentre.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e) => {
            handleKeyDown?.(e, "costCentreID");
          }}
        />
      {/* )} */}
    </>
  );
});

export default React.memo(CostCentreCombobox);
