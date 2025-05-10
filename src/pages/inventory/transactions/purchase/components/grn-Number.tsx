import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import {
  formStateHandleFieldChange,
  formStateLoadDataUpdate,
  formStateMasterHandleFieldChange,
} from "../reducer";
import React from "react";
import Urls from "../../../../../redux/urls";
import { LedgerType } from "../../../../../enums/ledger-types";
import ERPButton from "../../../../../components/ERPComponents/erp-button";

interface GrnNumberProps extends VoucherElementProps {
  handleLoadByRefNo: () => Promise<void>;
}

const GrnNumber = React.forwardRef<HTMLInputElement, GrnNumberProps>(
  ({ formState, dispatch, t }) => {
    function loadAndSetTransVoucher(
      arg0: boolean,
      arg1: number,
      undefined: undefined,
      undefined1: undefined,
      undefined2: undefined,
      undefined3: undefined,
      undefined4: undefined,
      arg7: string | undefined,
      arg8: boolean
    ) {
      throw new Error("Function not implemented.");
    }

    const goToPreviousPage = () => {
      window.history.back();
    };

    return (
      <div className="">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium min-w-[60px]">
            {t("GRN No")}:
          </label>

          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            enableClearOption={false}
            id="FormType"
            className="min-w-[160px]"
            label={t("Form_Type")}
            data={formState?.loadData}
            onSelectItem={(e) => {
              dispatch(
                formStateLoadDataUpdate({key:"formType", value:e.value})
              );
            }}
            value={formState?.loadData?.formType}
            field={{
              id: "FormType",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_employees,
            }}
          />

          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            enableClearOption={false}
            id="Vprefix"
            className="min-w-[120px]"
            label={t("Vprefix")}
            data={formState.transaction.master}
            onSelectItem={(e) => {
              // dispatch(
              //   formStateHandleFieldChange({
              //     fields: { vprefix: e.value },
              //   })
              // );
            }}
            // value={formState.Vprefix}
            field={{
              id: "Vprefix",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_employees,
            }}
          />

          <ERPInput
            disableEnterNavigation={true}
            id="VNumber"
            localInputBox={formState?.userConfig?.inputBoxStyle}
            min={1}
            label={t("V Number")}
            // value={formState.VNumber}
            type="number"
            className="w-[80px]"
          />

          <ERPButton
            title={t("Load")}
            localInputBox={formState?.userConfig?.inputBoxStyle}
          />
        </div>

        <div className="flex justify-end gap-2">
          <ERPButton
            title={t("Clear")}
            // icon="ban" // optional: icon support if ERPButton allows it
            localInputBox={formState?.userConfig?.inputBoxStyle}
          />
          <ERPButton
            title={t("Close")}
            // icon="power" // optional: icon support if ERPButton allows it
            localInputBox={formState?.userConfig?.inputBoxStyle}
          />
        </div>
      </div>
    );
  }
);

export default React.memo(GrnNumber);
