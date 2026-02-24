import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface PriceCategoryComboboxProps extends VoucherElementProps {
  handleFieldKeyDown: (field: string, key: string) => void;
  handleKeyDown?: (e: React.KeyboardEvent, field: string) => void;
}

const PriceCategoryCombobox = React.forwardRef<
  HTMLInputElement,
  PriceCategoryComboboxProps
>(({ formState, dispatch, t, handleFieldKeyDown, handleKeyDown }, ref) => {
  return (
    <ERPDataCombobox
      localInputBox={formState?.userConfig?.inputBoxStyle}
      fetching={formState.transactionLoading}
      enableClearOption={false}
      id="priceCategoryID"
      className="min-w-[180px] !m-0"
      label={t(formState.formElements.priceCategory.label)}
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
      value={formState.transaction.master.priceCategoryID || -2 }
      field={{
        id: "priceCategoryID",
        valueKey: "id",
        labelKey: "name",
        getListUrl: Urls.data_pricectegory,
      }}
      disabled={
        formState.formElements.priceCategory.disabled ||
        formState.formElements.pnlMasters?.disabled
      }
      disableEnterNavigation
      onKeyDown={(e: React.KeyboardEvent) => {
        handleKeyDown?.(e, "priceCategoryID");
      }}
    />
  );
});

export default React.memo(PriceCategoryCombobox);
