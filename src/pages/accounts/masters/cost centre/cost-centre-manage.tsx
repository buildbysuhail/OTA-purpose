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
  } = useFormManager<CostCentreData>({
    url: Urls.cost_center,
    onSuccess: useCallback(
      () =>
        dispatch(
          toggleCostCentrePopup({ isOpen: false, key: null, reload: true })
        ),
      [dispatch]
    ),
    onClose: useCallback(() => dispatch(toggleCostCentrePopup({ isOpen: false, key: null,reload: false })), [dispatch]),
    key: rootState.PopupData.costCentre.key,
    keyField: "costCentreID",
    useApiClient: true,
    initialData: initialCostCentre,
  });
  const { t } = useTranslation("masters");
  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("costCentreName")}
          label={t("cost_centre_name")}
          placeholder={t("enter_cost_centre_name")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("costCentreName", data.costCentreName)
          }
        />
        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("enter_short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
      </div>

      <div className="">
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
