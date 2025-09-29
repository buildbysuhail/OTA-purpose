import React, { useRef } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateMasterHandleFieldChange } from "../../purchase/reducer";
import Urls from "../../../../../redux/urls";

interface CostCentreProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const PriceCategory = React.forwardRef<HTMLInputElement, CostCentreProps>(({
  formState,
  dispatch,
  t,
  handleFieldKeyDown,
  handleKeyDown,
}, ref) => {

  return (
    <>
      {formState.formElements.priceCategoryID.visible && (
        <ERPDataCombobox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          enableClearOption={false}
          ref={ref}
          id="priceCategoryID"
          // nameField="costCentreName"
          className="min-w-[180px]"
          label={t(formState.formElements.priceCategoryID.label)}
          data={formState.transaction.master}
          onSelectItem={(e) => {
            dispatch(
              formStateMasterHandleFieldChange({
                fields: {
                  priceCategoryID: e.value,
                },
              })
            );
            handleFieldKeyDown("priceCategoryID", "Enter");
          }}
          value={formState.transaction.master.priceCategoryID}
          field={{
            id: "priceCategoryID",
            valueKey: "id",
            labelKey: "name",
            getListUrl: Urls.data_costcentres,
          }}
          disabled={
            formState.formElements.priceCategoryID.disabled ||
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

export default React.memo(PriceCategory);