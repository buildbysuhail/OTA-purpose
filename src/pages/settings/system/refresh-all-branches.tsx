import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import { toggleRefreshAllBranches } from "../../../redux/slices/popup-reducer";

export interface RefreshAllBranches {
  resetDateFrom: string;
  agreementChecked: boolean;
}

export const initialRefreshAllBranches = {
  data: {
    resetDateFrom: "",
    agreementChecked: false,
  },
  validations: {
    resetDateFrom: "",
    agreementChecked: "",
  },
};

export const RefreshAllBranches: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<RefreshAllBranches>({
    url: Urls.refreshAllBranches,
    onSuccess: useCallback(() => dispatch(toggleRefreshAllBranches({ isOpen: false })), [dispatch]),
    initialData: initialRefreshAllBranches,
    useApiClient: true,
  });

  const onClose = useCallback(() => {
    dispatch(toggleRefreshAllBranches({ isOpen: false }));
  }, [dispatch]);

  
  const handleConditionalSubmit = useCallback(async () => {
    if (formState?.data?.agreementChecked) {
      await handleSubmit();
    }
  }, [formState?.data?.agreementChecked, handleSubmit]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-4">
        <p>
          Sync master data from main branch to all branches when adding a new branch to maintain consistent information network-wide.
        </p>
      </div>

      <div className="flex items-center justify-between my-4">
        <ERPCheckbox
          {...getFieldProps("agreementChecked")}
          label={t("recover_until_sync")}
          onChangeData={(checked: boolean) => handleFieldChange("agreementChecked", checked)}
        />
        <div>
          <ERPFormButtons
            isEdit={isEdit}
            isLoading={isLoading}
            onCancel={onClose}
            onSubmit={handleConditionalSubmit}
          />
        </div>
      </div>
    </div>
  );
});

export default RefreshAllBranches;