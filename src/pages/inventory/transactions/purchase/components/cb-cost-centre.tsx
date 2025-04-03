import React, { useRef } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../../purchase/reducer";
import Urls from "../../../../../redux/urls";

interface CostCentreProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const CostCentre = React.forwardRef<HTMLInputElement, CostCentreProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {

  return (
    <>
      {formState.formElements.costCentreID.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="costCentreID"
          // nameField="costCentreName"
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
            (formState.userConfig?.presetCostenterId ?? 0) > 0 ||
            formState.formElements.costCentreID.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e: any) => {
            handleKeyDown && handleKeyDown(e, "costCentre");
          }}
        />
      )}
    </>
  );
});

export default React.memo(CostCentre);