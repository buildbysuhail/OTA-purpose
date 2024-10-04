import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { UserData } from "./user-manage-types";
import { toggleAccountGroupPopup, toggleUserPopup } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";

export const UserManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState
  } = useFormManager<UserData>({
    url: Urls.Users,
    onSuccess: useCallback(() => dispatch(toggleUserPopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.user.key
  });

  const onClose = useCallback(() => {
    dispatch(toggleUserPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("counterID")}
          label="Counter ID"
          placeholder="Counter ID"
          required={true}
          onChangeData={(data: any) => {
            debugger;
            handleFieldChange("counterID", data);
          }}
        />
        <ERPInput
          {...getFieldProps("Passwd")}
          label="Password"
          placeholder="Password"
          required={true}
          onChangeData={(data: any) => handleFieldChange("Passwd", data)}
        />
        <ERPInput
          {...getFieldProps("confrimPassword")}
          label="Confirmed  Password"
          placeholder="Confirmed Password"
          required={true}
          onChangeData={(data: any) => handleFieldChange("confrimPassword", data)}
        />
        <ERPInput
          {...getFieldProps("maxDecimalPerAllowed")}
          label="maxDecimalPerAllowed"
          placeholder="maxDecimalPerAllowed"
          required={true}
          onChangeData={(data: any) => handleFieldChange("maxDecimalPerAllowed", data)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label="Email"
          placeholder="email"
          required={true}
          onChangeData={(data: any) => handleFieldChange("email", data)}
        />
        <ERPInput
          {...getFieldProps("phoneNumber")}
          label="Phone Number"
          placeholder="Phone Number"
          required={true}
          onChangeData={(data: any) => handleFieldChange("phoneNumber", data)}
        />
        <ERPInput
          {...getFieldProps("displayName")}
          label="Display Name"
          placeholder="Display Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange("displayName", data)}
        />
        <ERPDataCombobox
          id="employeeID"
          field={{
            id: "employeeID",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange("employeeID", data)}
          label="employeeID"
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