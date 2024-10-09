import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleResetBranchDataForSync } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import { Button } from "devextreme-react";

export interface BranchResetData {
  resetDateFrom: string;
  agreementChecked: boolean;
}

export const initialBranchResetData = {
  data: {
    resetDateFrom: "",
    agreementChecked: false,
  },
  validations: {
    resetDateFrom: "",
    agreementChecked: "",
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
          {...getFieldProps("resetDateFrom")}
          label={t("reset_date_from")}
          required={true}
          onChangeData={(data: string) => handleFieldChange("resetDateFrom", data)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        <ERPCheckbox
          {...getFieldProps("agreementChecked")}
          label={t("recover_until_sync")}
          onChangeData={(checked: boolean) => handleFieldChange("agreementChecked", checked)}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-10 w-24 ml-auto"
        >
          {t("reset")}
        </Button>
      </div>

      {/* <div className="mt-4">
        <ERPFormButtons
          isEdit={false}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div> */}
    </div>
  );
});

export default BranchDataReset;