import React, { useRef } from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";
import Urls from "../../../../redux/urls";

interface CostCentreProps extends AccVoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const CostCentre = React.forwardRef<HTMLInputElement, CostCentreProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {
  const costCenterRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {formState.formElements.costCentreID.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={costCenterRef}
          id="costCentreID"
          // nameField="costCentreName"
          className="min-w-[180px]"
          label={t(formState.formElements.costCentreID.label)}
          data={formState.row}
          onSelectItem={(e) => {
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: {
                  costCentreID: e.value,
                  costCentreName: e.label,
                },
              })
            );
            handleFieldKeyDown("costCentreID", "Enter");
          }}
          value={formState.row.costCentreID}
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