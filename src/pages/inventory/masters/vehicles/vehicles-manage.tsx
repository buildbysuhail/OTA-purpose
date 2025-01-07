import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialvehiclesData, VehiclesData } from "./vehicles-manage-type";
import { toggleVehicles } from "../../../../redux/slices/popup-reducer";

export const VehiclesManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<VehiclesData>({
    url: Urls.vehicles,
    onSuccess: useCallback(
      () => dispatch(toggleVehicles({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    onClose:useCallback(() => dispatch(toggleVehicles({ isOpen: false, key: null,reload: false })), [dispatch]),
    key: rootState.PopupData.vehicles.key,
    useApiClient: true,
    initialData: initialvehiclesData
  });


  const { t } = useTranslation();

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("vehicleName")}
          label={t("vehicle_name")}
          placeholder={t("vehicle_name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("vehicleName", data.vehicleName);
          }}
        />
        <ERPInput
          {...getFieldProps("vehicleNumber")}
          label={t("vehicle_number")}
          placeholder={t("vehicle_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("vehicleNumber", data.vehicleNumber)}
        />
        <ERPInput
          {...getFieldProps("noOfWheels")}
          label={t("no_of_wheels")}
          type="number"
          placeholder={t("no_of_wheels")}
          onChangeData={(data: any) => handleFieldChange("noOfWheels", data.noOfWheels)}
        />
        <ERPInput
          {...getFieldProps("model")}
          label={t("model")}
          placeholder={t("model")}
          onChangeData={(data: any) => handleFieldChange("model", data.model)}
        />
        <ERPInput
          {...getFieldProps("manufacture")}
          label={t("manufacture")}
          placeholder={t("manufacture")}
          onChangeData={(data: any) => handleFieldChange("manufacture", data.manufacture)}
        />
        <ERPInput
          {...getFieldProps("ownerName")}
          label={t("owner")}
          placeholder={t("owner_name")}
          onChangeData={(data: any) => handleFieldChange("ownerName", data.ownerName)}
        />
        <ERPInput
          {...getFieldProps("color")}
          label={t("color")}
          placeholder={t("color")}
          onChangeData={(data: any) => handleFieldChange("color", data.color)}
        />
        <ERPInput
          {...getFieldProps("odometer")}
          label={t("odo_meter")}
          placeholder={t("odo_meter")}
          onChangeData={(data: any) => handleFieldChange("odometer", data.odometer)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
        <ERPCheckbox
          {...getFieldProps('isRental')}
          label={t("rental")}
          onChangeData={(data: any) => handleFieldChange('isRental', data.isRental)}
        />
        <ERPCheckbox
          {...getFieldProps('isCommon')}
          label={t("common")}
          onChangeData={(data: any) => handleFieldChange('isCommon', data.isCommon)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
