import { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { toggleChartOfAccounts } from "../../../../redux/slices/popup-reducer";
import { ChartOfAccountsData, initialChartOfAccounts } from "./chart-of-accounts-types";

export const ChartOfAccountsManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<ChartOfAccountsData>({
    url: Urls.chart_of_accounts,
    onSuccess: useCallback(() => dispatch(toggleChartOfAccounts({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.chartOfAccounts.key,
    useApiClient: true,
    initialData: initialChartOfAccounts
  });

  const onClose = useCallback(() => {
    dispatch(toggleChartOfAccounts({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("refBranchID")}
          field={{
            id: "refBranchID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("refBranchID", data)
          }}
          label={t("reference_branch")}
        />
        <ERPDataCombobox
          {...getFieldProps("purchaseLedgerID")}
          field={{
            id: "purchaseLedgerID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("purchaseLedgerID", data)
          }}
          label={t("purchase_ledger")}
        />
        <ERPDataCombobox
          {...getFieldProps("receivableLedgerID")}
          field={{
            id: "receivableLedgerID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("receivableLedgerID", data)
          }}
          label={t("receivable_ledger")}
        />
        <ERPDataCombobox
          {...getFieldProps("branchPayableLedgerID")}
          field={{
            id: "branchPayableLedgerID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("branchPayableLedgerID", data)
          }}
          label={t("branch_payable_ledger")}
        />
      </div>

      <div className="w-full p-2 flex justify-center space-x-2 mt-5">
        <ERPFormButtons
          onClear={handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};