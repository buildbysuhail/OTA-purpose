import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleResetBranchDataForSync } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../components/ERPComponents/erp-button";

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
  const { t } = useTranslation();

  const {
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<BranchResetData>({
    url: Urls.branchDataReset,
    onSuccess: useCallback(() => dispatch(toggleResetBranchDataForSync({ isOpen: false })), [dispatch]),
    initialData: initialBranchResetData,
    useApiClient: true,
  });

  const onClose = useCallback(() => {
    dispatch(toggleResetBranchDataForSync({ isOpen: false }));
  }, [dispatch]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-3 gap-4">
        <ERPDateInput
          {...getFieldProps("date")}
          label={t("reset_date_from")}
          required={true}
          onChangeData={(data: string) => handleFieldChange("date", data)}
        />
      </div>

      <div className="flex items-center justify-between my-4">
        <ERPCheckbox
          {...getFieldProps("isAgree")}
          label={t("recover_until_sync")}
          onChangeData={(data: any) => handleFieldChange("isAgree", data)}
        />
        
        
        <div>
          <ERPButton
            title={t("reset")}
            variant="primary"
            className="h-10 w-24"
            loading={isLoading}
            onClick={handleSubmit}
          ></ERPButton>
          
        </div>
      </div>
    </div>
  );
});

export default BranchDataReset;