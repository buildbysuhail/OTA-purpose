import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { toggleAuthorizationSettingsPopup } from "../../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { ActionType } from "../../../redux/types";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";

interface AuthorizationSettingsData {
  employeeID: number;
  password: string;
  confirmPassword: string;
}

const AuthorizationSettings1: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<AuthorizationSettingsData>({
    url: Urls.authorization_settings,
    onSuccess: useCallback(() => dispatch(toggleAuthorizationSettingsPopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  const onClose = useCallback(() => {
    dispatch(toggleAuthorizationSettingsPopup({ isOpen: false, key: null }));
  }, []);

  const columns: DevGridColumn[] = [
    {
      dataField: "Employee",
      caption: t("employee"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "Password",
      caption: t("password"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "Discount Type",
      caption: t("discount_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "Discount Percentage",
      caption: t("discount_percentage"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
  ];

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
        <ERPDataCombobox
          {...getFieldProps("employeeID")}
          field={{
            id: "employeeID",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("employeeID", data)
          }}
          label={t("employee")}
        />
        <ERPInput
          {...getFieldProps("password")}
          label={t("password")}
          placeholder={t("password")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("password", data)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        <ERPInput
          {...getFieldProps("confirmPassword")}
          label={t("confirm_password")}
          placeholder={t("confirm_password")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("confirmPassword", data)}
        />
        <ERPFormButtons
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-6">
        <div className="box custom-box">
          <div className="box-body">
            <ErpDevGrid
              columns={columns}
              gridHeader={t("employee")}
              dataUrl={Urls.authorization_settings}
              gridId="grd_auth_settings"
              popupAction={toggleAuthorizationSettingsPopup}
              hideGridAddButton={true}
              allowExport={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default AuthorizationSettings1;