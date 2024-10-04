import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { BankPoseData } from "./administration-types";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleBankPosPopup } from "../../../redux/slices/popup-reducer";

export const BankPosSettingsManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<BankPoseData>({
      url: Urls.Remainder,
      onSuccess: useCallback(
        () => dispatch(toggleBankPosPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      key: rootState.PopupData.reminder.key,
    });

  const onClose = useCallback(() => {
    dispatch(toggleBankPosPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("machineBrand")}
          label="Machine Brand"
          onChangeData={(data: any) => handleFieldChange("machineBrand", data)}
        />

        <ERPDataCombobox
          {...getFieldProps("model")}
          label="Model"
          onChangeData={(data: any) => handleFieldChange("model", data)}
        />

        <ERPDataCombobox
          {...getFieldProps("comPort")}
          label="Com Port"
          onChangeData={(data: any) => handleFieldChange("comPort", data)}
        />

        <ERPInput
          {...getFieldProps("geldeaWsPort")}
          label="Geldea Ws Port"
          placeholder="Geldea Ws Port"
          required={true}
          onChangeData={(data: any) => handleFieldChange("geldeaWsPort", data)}
        />

        <ERPInput
          {...getFieldProps("gediaService")}
          label="Gedia Service"
          placeholder="Gedia Service"
          required={true}
          onChangeData={(data: any) => handleFieldChange("gediaService", data)}
        />
      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
