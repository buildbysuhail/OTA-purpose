import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialMeasureData, MeasureData } from "./unit-of-measure-manage-type";
import { toggleUnitOfMeasure } from "../../../../redux/slices/popup-reducer";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";

export const UnitOfMeasureManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<MeasureData>({
    url: Urls.unitOfMeasure,
    onSuccess: useCallback(
      () => dispatch(toggleUnitOfMeasure({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    key: rootState.PopupData.unitOfMeasure.key,
    useApiClient: true,
    initialData: initialMeasureData
  });

  const onClose = useCallback(() => {
    dispatch(toggleUnitOfMeasure({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("unitCode")}
          label={t("unit_code")}
          placeholder={t("unit_code")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("unitCode", data.unitCode);
          }}
        />
        <ERPInput
          {...getFieldProps("unitName")}
          label={t("unit_name")}
          placeholder={t("unit_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("unitName", data.unitName)}
        />
        <ERPDataCombobox
          {...getFieldProps("unitType")}
          field={{
            id: "unitType",
            valueKey: "value",
            labelKey: "label",
          }}
          onChangeData={(data: any) => handleFieldChange("unitType", data.unitType)}
          label={t('unit_type')}
          options={[
            { value: 'Active', label: t('active') },
            { value: 'Inactive', label: t('inactive') },
          ]}
        />
        <ERPInput
          {...getFieldProps("decimalPoints")}
          label={t("decimal_points")}
          placeholder={t("decimal_points")}
          onChangeData={(data: any) => handleFieldChange("decimalPoints", data.decimalPoints)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
