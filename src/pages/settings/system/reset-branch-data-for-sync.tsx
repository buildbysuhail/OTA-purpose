import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleResetBranchDataForSync } from "../../../redux/slices/popup-reducer";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";
import ERPFormButtons from "../../../components/ERPComponents/erp-form-buttons";

export interface BranchResetData {
  date: string;
  isAgree: boolean;
}
export const initialBranchResetData = {
  data: {
    date: "",
    isAgree: false,
  },
  validations: {
    date: "",
    isAgree: "",
  },
};
export const BranchDataReset: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation("system");
  const { isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<BranchResetData>({
    url: Urls.branchDataReset,
    onClose: useCallback(() => dispatch(toggleResetBranchDataForSync({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleResetBranchDataForSync({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true,
    loadDataRequired: false
  });
  const onClose = useCallback(() => {  dispatch(toggleResetBranchDataForSync({ isOpen: false }));}, [dispatch]);

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 gap-4">
        <ERPDateInput
          {...getFieldProps("date")}
          label={t("reset_date_from")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("date", data.date)}
        />
        <ERPCheckbox
          {...getFieldProps("isAgree")}
          label={t("recover_until_sync")}
          className="text-left"
          onChangeData={(data: any) => handleFieldChange("isAgree", data.isAgree)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
      {/* <ERPButton
            title={t("reset")}
            variant="primary"
            className="h-10 w-24"
            loading={isLoading}
            onClick={handleSubmit}>
          </ERPButton> */}

    </div>
  );
});
export default BranchDataReset;