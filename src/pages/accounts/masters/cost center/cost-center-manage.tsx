import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleCostCenterPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { ActionType } from "../../../../redux/types";
import { useTranslation } from "react-i18next";
import { CostCenterData } from "./cost-center-types";

export const CostCenterManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    formState: postData,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<CostCenterData>({
    url: Urls.cost_center,
    onSuccess: useCallback(() => dispatch(toggleCostCenterPopup({ isOpen: false, key: null })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  const onClose = useCallback(() => {
    dispatch(toggleCostCenterPopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps('costCenterName')}
          label={t("cost_center_name")}
          placeholder={t("enter_cost_center_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('costCenterName', data)}
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