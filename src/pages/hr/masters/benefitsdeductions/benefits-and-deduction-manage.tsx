import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { toggleBenefitDeduction } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import {
  BenefitsAndDeductions,
  initialBenefitsAndDeductions,
} from "./benefits-and-deduction-types";

export const BenefitAndDeductionManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("hr");

  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    formState,
    isLoading,
    handleClose,
  } = useFormManager<BenefitsAndDeductions>({
    url: Urls.benefits_and_deductions, // ✅ correct endpoint
    onSuccess: useCallback(
      () =>
        dispatch(
          toggleBenefitDeduction({ isOpen: false, key: null, reload: true })
        ),
      [dispatch]
    ),
    onClose: useCallback(
      () =>
        dispatch(
          toggleBenefitDeduction({ isOpen: false, key: null, reload: false })
        ),
      [dispatch]
    ),
    key: rootState.PopupData.BenefitDiduction.key,
    useApiClient: true,
    initialData: initialBenefitsAndDeductions,
  });

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-3 gap-3">
        {/* Benefit / Deduction Name */}
        <ERPInput
          {...getFieldProps("benefitDeductionName")}
          label={t("benefit_Deduction_Name")}
          placeholder={t("benefit_Deduction_Name")}
          required
          onChangeData={(data: any) =>
            handleFieldChange(
              "benefitDeductionName",
              data.benefitDeductionName
            )
          }
          readOnly={rootState.PopupData.BenefitDiduction.mode === "view"}
          fetching={formState?.loading !== false}
        />


        <ERPDataCombobox
          {...getFieldProps("benefitDeductType")}
          id="benefitDeductType"
          field={{
            id: "benefitDeductType",
            valueKey: "id",
            labelKey: "name",
          }}
          options={[
            { id: "Benefit", name: "Benefits" },
            { id: "Deduction", name: "Deduction" },
          ]}
          label={t("benefit_Deduct_Type")}
          onChangeData={(data: any) =>
            handleFieldChange("benefitDeductType", data.benefitDeductType)
          }
          disabled={
            (rootState.PopupData.BenefitDiduction.data != undefined &&
            rootState.PopupData.BenefitDiduction.data != null &&
            rootState.PopupData.BenefitDiduction.data?.benefitDeductionID != undefined &&
            rootState.PopupData.BenefitDiduction.data?.benefitDeductionID != null) ||
            rootState.PopupData.BenefitDiduction.mode == "view"
          }
          fetching={formState?.loading !== false}
        />

        {/* Is Basic */}
        <ERPCheckbox
          {...getFieldProps("isBasic")}
          label={t("is_basic")}
          onChangeData={(data: any) =>
            handleFieldChange("isBasic", data.isBasic)
          }
          disabled={rootState.PopupData.BenefitDiduction.mode === "view"}
          fetching={formState?.loading !== false}
        />
      </div>

      {/* Form Buttons */}
      <ERPFormButtons
        onClear={
          rootState.PopupData.BenefitDiduction.mode === "view"
            ? undefined
            : handleClear
        }
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={
          rootState.PopupData.BenefitDiduction.mode === "view"
            ? undefined
            : handleSubmit
        }
      />
    </div>
  );
});
