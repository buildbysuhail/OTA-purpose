import { APIClient } from "../../../../helpers/api-client";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateRowHandleFieldChange } from "../reducer";
import { useRef } from "react";
import React from "react";
import Urls from "../../../../redux/urls";

const api = new APIClient();

interface AccProjectProps extends AccVoucherElementProps { }

const AccProject = React.forwardRef<HTMLInputElement, AccProjectProps>(({
  formState,
  dispatch,
  t,
}, ref) => {
  return (
    <>
      {formState.formElements.projectId.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="project"
          label={t(formState.formElements.projectId.label)}
          options={
            formState.row.ledgerID != undefined && formState.row.ledgerID != 0
              ? undefined
              : []
          }
          field={{
            valueKey: "id",

            labelKey: "name",
            getListUrl: Urls.data_projects_by_ledgerid,
            params: `LedgerID=${formState.row.ledgerID}`,
          }}
          onSelectItem={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: {
                  projectId: e.value,
                  projectName: e.label,
                },
              })
            )
          }
          disabled={
            formState.formElements.projectId?.disabled ||
            formState.formElements.pnlMasters?.disabled
          }
        />
      )}
    </>
  );
}
);

export default React.memo(AccProject);
