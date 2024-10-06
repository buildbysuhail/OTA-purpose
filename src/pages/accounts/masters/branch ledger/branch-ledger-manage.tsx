import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleBranchLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { BranchLedgerData, initialBranchLedger } from "./branch-ledger-types";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";

export const BranchLedgerManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    formState: postData,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<BranchLedgerData>({
    url: Urls.branch_ledger,
    onSuccess: useCallback(() => dispatch(toggleBranchLedgerPopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.branchLedger.key,
    useApiClient: true,
    initialData: initialBranchLedger
  });

  const onClose = useCallback(() => {
    dispatch(toggleBranchLedgerPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data)
          }}
          label={t("reference_branch")}
        />
        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data)
          }}
          label={t("purchase_ledger")}
        />
        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data)
          }}
          label={t("receivable_ledger")}
        />
        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data)
          }}
          label={t("branch_payable_ledger")}
        />
      </div>

      <div className="w-full p-2 flex justify-center space-x-2 mt-5">
        <ERPButton
          type="button"
          title={t("save")}
          variant="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        />
        <ERPButton
          type="button"
          title={t("clear")}
          variant="secondary"
        />
        <ERPButton
          type="button"
          title={t("close")}
          variant="secondary"
          onClick={onClose}
        />
      </div>
    </div>
  );
};