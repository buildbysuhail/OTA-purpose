import React, { useRef } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateHandleFieldChange } from "../../purchase/reducer";
import Urls from "../../../../../redux/urls";

interface CostCentreProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
}

const DummyCode = React.forwardRef<HTMLInputElement, CostCentreProps>(({
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
         id="dummyCodeID"
         className="min-w-[180px]"
         label={t(formState.formElements.dummyCodeID.label)}
         data={formState.transaction.master}
         onSelectItem={(e) => {
           dispatch(
            formStateHandleFieldChange({
               fields: {
                dummyCode: e.value,
               },
             })
           );
           handleFieldKeyDown("dummyCodeID", "Enter");
         }}
         value={formState.dummyCode}
         
         disabled={
           formState.formElements.dummyCodeID.disabled ||
           formState.formElements.pnlMasters?.disabled
         }
         disableEnterNavigation
         onKeyDown={(e: any) => {
           handleKeyDown && handleKeyDown(e, "dummycode");
         }}
       />
      )}
    </>
  );
});

export default React.memo(DummyCode);