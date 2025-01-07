import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleBranchLedgerPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { BranchLedgerData, initialBranchLedger } from "./branch-ledger-types";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";

export const BranchLedgerManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    formState,
    isLoading,
    handleClose
  } = useFormManager<BranchLedgerData>({
    url: Urls.branch_ledger,
    onClose: useCallback(() => dispatch(toggleBranchLedgerPopup({ isOpen: false, key: null,reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleBranchLedgerPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.branchLedger.key,
    keyField: "branchLedgerID",
    useApiClient: true,
    initialData: initialBranchLedger
  });
  const { t } = useTranslation("masters");

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("refBranchID")}
          field={{
            id: "refBranchID",
            required: true,
            getListUrl: Urls.data_acc_Branches,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("refBranchID", data?.refBranchID)
          }}
          label={t("reference_branch")}
        />
        <ERPDataCombobox
          {...getFieldProps("purchaseLedgerID")}
          field={{
            id: "purchaseLedgerID",
            required: true,
            freezeDataLoad: formState?.data?.refBranchID == undefined || formState?.data?.refBranchID == null ? true : false,
            getListUrl: formState?.data?.refBranchID || formState?.data?.refBranchID == null || formState?.data?.refBranchID == 0
              ? `${Urls.data_PurchaseAccount}${formState?.data?.refBranchID}`
              : `${Urls.data_PurchaseAccount}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("purchaseLedgerID", data?.purchaseLedgerID)
          }}
          label={t("purchase_ledger")}
        />
        <ERPDataCombobox
          {...getFieldProps("receivableLedgerID")}
          field={{
            id: "receivableLedgerID",
            required: true,
            getListUrl: `${Urls.data_BranchRecPayAccount}${0}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("receivableLedgerID", data?.receivableLedgerID)
          }}
          label={t("receivable_ledger")}
        />
        <ERPDataCombobox
          {...getFieldProps("branchPayableLedgerID")}
          field={{
            id: "branchPayableLedgerID",
            required: true,
            freezeDataLoad: formState?.data?.refBranchID == undefined || formState?.data?.refBranchID == null || formState?.data?.refBranchID == 0 ? true : false,
            getListUrl: formState?.data?.refBranchID || formState?.data?.refBranchID == null || formState?.data?.refBranchID == 0
              ? `${Urls.data_BranchRecPayAccount}${formState?.data?.refBranchID}`
              : `${Urls.data_BranchRecPayAccount}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("branchPayableLedgerID", data?.branchPayableLedgerID)
          }}
          label={t("branch_payable_ledger")}
        />
      </div>

      <div className="w-full p-2 flex justify-center space-x-2 mt-5">
        <ERPFormButtons
          onClear={handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};