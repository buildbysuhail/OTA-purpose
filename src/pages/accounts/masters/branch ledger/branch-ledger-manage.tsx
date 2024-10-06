import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleBranchLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { ActionType } from "../../../../redux/types";
import { useTranslation } from "react-i18next";
import { BranchLedgerData, initialBranchLedger } from "./branch-ledger-types";

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
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps('costCentreName')}
          label={t("cost_centre_name")}
          placeholder={t("enter_cost_centre_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('costCentreName', data)}
        />
        <ERPInput
          {...getFieldProps('shortName')}
          label={t("short_name")}
          placeholder={t("enter_short_name")}
          onChangeData={(data: any) => handleFieldChange('shortName', data)}
        />
        <ERPInput
          {...getFieldProps('remarks')}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          onChangeData={(data: any) => handleFieldChange('remarks', data)}
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