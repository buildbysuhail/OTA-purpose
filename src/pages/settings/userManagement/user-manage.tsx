import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialDataUser, UserData } from "./user-manage-types";
import { toggleUserPopup } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";
import ApplicationSettings from "../system/application-settings";
import { RootState } from "../../../redux/store";

export const UserManage: React.FC = React.memo(() => {
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("userManage");
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClear,
    isLoading,
    formState,
    handleClose
  } = useFormManager<UserData>({
    url: Urls.Users,
    onClose: useCallback(() => dispatch(toggleUserPopup({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleUserPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.user.key,
    keyField: 'user',
    useApiClient: true,
    initialData: initialDataUser
  });

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("userName")}
          label={t("username")}
          placeholder={t("username")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("userName", data.userName);
          }}
        />
        <ERPInput
          {...getFieldProps("Passwd")}
          label={t("password")}
          type="password"
          placeholder={t("password")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("Passwd", data.Passwd)}
        />
        <ERPInput
          {...getFieldProps("confrimPassword")}
          label={t("confirm_password")}
          type="password"
          placeholder={t("confirm_password")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("confrimPassword", data.confrimPassword)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          type="email"
          placeholder={t("email")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("email", data.email)}
        />
        <ERPInput
          {...getFieldProps("phoneNumber")}
          label={t("mobile")}
          placeholder={t("mobile")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("phoneNumber", data.phoneNumber)}
        />
        <ERPInput
          {...getFieldProps("displayName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("displayName", data.displayName)}
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
          onChangeData={(data: any) => handleFieldChange("userTypeCode", data.userTypeCode)}
        />
        {applicationSettings.accountsSettings?.allowSalesCounter &&
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
            onChangeData={(data: any) => handleFieldChange("counterID", data.counterID)}
          />}
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
          onChangeData={(data: any) => handleFieldChange("employeeID", data.employeeID)}
        />

        <ERPInput
          {...getFieldProps("maxDiscPercAllowed","decimal")}
          label={t("max_dis%")}
          type="number"
          min={0}
          placeholder={t("max_dis%")}
          required={false}
          onChangeData={(data) => handleFieldChange("maxDiscPercAllowed", parseFloat(data.maxDiscPercAllowed))}
        />

        {applicationSettings.mainSettings?.maintainBusinessType == 'Restaurant' &&
          <ERPInput
            {...getFieldProps("passkey")}
            label={t("passkey")}
            placeholder={t("passkey")}
            required={false}
            onChangeData={(data: any) => handleFieldChange("passkey", data.passkey)}
          />}
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