import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { CostCentreData, initialCostCentre } from "./cost-centre-types";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";

export const CostCentreManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClose,
    isLoading,
    formState
  } = useFormManager<CostCentreData>({
    url: Urls.cost_center,
    onSuccess: useCallback(() => dispatch(toggleCostCentrePopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    onClose: useCallback(() => dispatch(toggleCostCentrePopup({ isOpen: false, key: null, reload: false })), [dispatch]),
    key: rootState.PopupData.costCentre.key,
    keyField: "costCentreID",
    useApiClient: true,
    initialData: initialCostCentre,
  });
  const { t } = useTranslation("masters");
  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("costCentreName")}
          label={t("cost_centre_name")}
          placeholder={t("enter_cost_centre_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("costCentreName", data.costCentreName)}
          readOnly={rootState.PopupData.costCentre.mode == "view"}
          autoFocus={true}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("enter_short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
          readOnly={rootState.PopupData.costCentre.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
          readOnly={rootState.PopupData.costCentre.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
      </div>

      <div className="">
        <ERPFormButtons
          onClear={rootState.PopupData.costCentre.mode == "view"? undefined : formState?.loading !== false ? undefined : handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={handleClose}
          onSubmit={rootState.PopupData.costCentre.mode == "view"? undefined : formState?.loading !== false ? undefined : handleSubmit}
        />
      </div>
    </div>
  );
};
