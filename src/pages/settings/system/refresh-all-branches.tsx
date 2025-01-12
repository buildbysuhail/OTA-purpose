import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import { toggleRefreshAllBranches } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";

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
  const { t } = useTranslation("system");

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState,
    handleClose,
  } = useFormManager<RefreshAllBranches>({
    url: Urls.refreshAllBranches,
    onClose: useCallback(
      () =>
        dispatch(
          toggleRefreshAllBranches({ isOpen: false, key: null, reload: false })
        ),
      [dispatch]
    ),
    onSuccess: useCallback(
      () => dispatch(toggleRefreshAllBranches({ isOpen: false })),
      [dispatch]
    ),
    initialData: initialRefreshAllBranches,
    method: ActionType.POST,
    useApiClient: true,
    loadDataRequired: false,
  });

  const handleConditionalSubmit = useCallback(async () => {
    if (formState?.data?.agreementChecked) {
      await handleSubmit();
    }
  }, [formState?.data?.agreementChecked, handleSubmit]);

  return (
    <div className="w-full modal-content">
      <div className="flex items-center justify-between my-4">
        <ERPCheckbox
          {...getFieldProps("agreementChecked")}
          label={t("i_agreed")}
          onChangeData={(checked: any) =>
            handleFieldChange("agreementChecked", checked.agreementChecked)
          }
        />
        <div>
          <ERPFormButtons
            isEdit={isEdit}
            isLoading={isLoading}
            submitDisabled={!formState?.data?.agreementChecked}
            onCancel={handleClose}
            onSubmit={handleConditionalSubmit}
          />
        </div>
      </div>
    </div>
  );
});

export default RefreshAllBranches;
