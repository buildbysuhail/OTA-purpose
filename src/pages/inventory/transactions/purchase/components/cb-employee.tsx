import React, { useRef } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../reducer";
import Urls from "../../../../../redux/urls";

interface CostCentreProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const Employee = React.forwardRef<HTMLInputElement, CostCentreProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {

  return (
    <>
      {formState.formElements.cbEmployee.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="employeeID"
          // nameField="costCentreName"
          className="min-w-[180px] !m-0"
          label={t(formState.formElements.cbEmployee.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  employeeID: e.value,
                },
              })
            );
            handleFieldKeyDown("employeeID", "Enter");
          }}
          value={formState.transaction.master.employeeID}
          field={{
            id: "employeeID",
            valueKey: "id",
            labelKey: "name",
            getListUrl: Urls.data_employees,
          }}
          disabled={
            (formState.userConfig?.presetCostenterId ?? 0) > 0 ||
            formState.formElements.cbEmployee.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e: any) => {
            handleKeyDown && handleKeyDown(e, "employeeID");
          }}
        />
      )}
    </>
  );
});

export default React.memo(Employee);