import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { isNullOrUndefinedOrZero } from "../../../../../utilities/Utils";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface ProjectProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const Project = React.forwardRef<HTMLInputElement, ProjectProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {
  return (
    <>
      {formState.formElements.cbProject.visible && !isNullOrUndefinedOrZero(formState.transaction.master.ledgerID) && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="projectID"
          className="min-w-[180px] !m-0"
          fetching={formState.transactionLoading}
          // transactionLoading={true}
          label={t(formState.formElements.cbProject.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  projectID: e.value,
                },
              })
            );
            handleFieldKeyDown("projectID", "Enter");
          }}
          value={formState.transaction.master.projectID}
          field={{
            id: "projectID",
            valueKey: "id",
            labelKey: "name",
             getListUrl: Urls.data_projects_by_ledgerid,
            params: `LedgerID=${formState.transaction.master.ledgerID}`,
          }}
          disabled={
            formState.formElements.cbProject.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
          disableEnterNavigation
          onKeyDown={(e: any) => {
            handleKeyDown && handleKeyDown(e, "project");
          }}
        />
      )}
    </>
  );
});

export default React.memo(Project);
