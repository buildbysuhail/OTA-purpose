import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { UserData } from "./user-manage-types";
import { toggleUserPopup } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";

export const UserManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const {t} = useTranslation();
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
    key: rootState.PopupData.user.key,
    useApiClient:true
  });

  const onClose = useCallback(() => {
    dispatch(toggleUserPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("userName")}
          label={t("username")}
          placeholder={t("username")}
          required={true}
          onChangeData={(data: any) => {
            debugger;
            handleFieldChange("userName", data);
          }}
        />
        <ERPInput
          {...getFieldProps("Passwd")}
          label={t("password")}
          placeholder={t("password")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("Passwd", data)}
        />
        <ERPInput
          {...getFieldProps("confrimPassword")}
          label={t("confirm_password")}
          placeholder={t("confirm_password")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("confrimPassword", data)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          placeholder={t("email")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("email", data)}
        />
        <ERPInput
          {...getFieldProps("phoneNumber")}
          label={t("mobile")}
          placeholder={t("mobile")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("phoneNumber", data)}
        />
        <ERPInput
          {...getFieldProps("displayName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("displayName", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("userTypeCode")}
          id="userTypeCode"
          field={{
            id: "userTypeCode",
            required: true,
            getListUrl: Urls.data_user_types,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("usertype")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("userTypeCode", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("counterID")}
          id="counterID"
          field={{
            id: "counterID",
            required: true,
            getListUrl: Urls.data_counters,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("counter")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("counterID", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("employeeID")}
          id="employeeID"
          field={{
            id: "employeeID",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("employee")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("employeeID", data)}
        />
        <ERPInput
          {...getFieldProps("maxDecimalPerAllowed")}
          label={t("max_dis%")}
          placeholder={t("max_dis%")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("maxDecimalPerAllowed", data)}
        />
        <ERPInput
          {...getFieldProps("passkey")}
          label={t("passkey")}
          placeholder={t("passkey")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("passkey", data)}
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