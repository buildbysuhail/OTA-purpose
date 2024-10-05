import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { toggleBranchPopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";

export interface BranchData {
  id: number;
  companyID: number;
  dateFrom: string;
  dateTo: string;
  branchCode: string;
  branchName: string;
  address1: string;
  address2: string;
  city: string;
  district: string;
  bState: string;
  country: number;
  pinCode: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  tin: string;
  registrationNumber: string;
  branchManager: string;
  remarks: string;
  userName: string;
  password: string;
  useMainBranchInventory: boolean;
}

const BranchManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<BranchData>({
      url: Urls.Branch,
      onSuccess: useCallback(
        () => dispatch(toggleBranchPopup({ isOpen: false })),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true,
    });

  const onClose = useCallback(() => {
    dispatch(toggleBranchPopup({ isOpen: false }));
  }, [dispatch]);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps("id")}
          label={t("id")}
          placeholder={t("enter_id")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("id", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("companyID")}
          field={{
            id: "companyID",
            required: true,
            getListUrl: Urls.data_company_id,
            valueKey: "companyID",
            labelKey: "companyID",
          }}
          onChange={(data: any) =>
            handleFieldChange("companyID", data.companyID)
          }
          label={t("company_id")}
        />
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("date_form")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("date_to")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateTo", data)}
        />
        <ERPInput
          {...getFieldProps("branchCode")}
          label={t("branch_code")}
          placeholder={t("branch_code")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("branchCode", data)}
        />
        <ERPInput
          {...getFieldProps("branchName")}
          label={t("branch_name")}
          placeholder={t("branch_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("branchName", data)}
        />
        <ERPInput
          {...getFieldProps("address1")}
          label={t("address_line_1")}
          placeholder={t("address_line_1")}
          onChangeData={(data: any) => handleFieldChange("address1", data)}
        />
        <ERPInput
          {...getFieldProps("address2")}
          label={t("address_line_2")}
          placeholder={t("address_line_2")}
          onChangeData={(data: any) => handleFieldChange("address2", data)}
        />
        <ERPInput
          {...getFieldProps("city")}
          label={t("city")}
          placeholder={t("city")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("city", data)}
        />
        <ERPInput
          {...getFieldProps("district")}
          label={t("district")}
          placeholder={t("district")}
          onChangeData={(data: any) => handleFieldChange("district", data)}
        />
        <ERPInput
          {...getFieldProps("bState")}
          label={t("state")}
          placeholder={t("state")}
          onChangeData={(data: any) => handleFieldChange("bState", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("country")}
          field={{
            id: "country",
            required: true,
            getListUrl: Urls.data_countries,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("country", data);
          }}
          label={t("country")}
        />
        <ERPInput
          {...getFieldProps("pinCode")}
          label={t("pin_code")}
          placeholder={t("pin_code")}
          onChangeData={(data: any) => handleFieldChange("pinCode", data)}
        />
        <ERPInput
          {...getFieldProps("phone")}
          label={t("phone")}
          placeholder={t("phone")}
          onChangeData={(data: any) => handleFieldChange("phone", data)}
        />
        <ERPInput
          {...getFieldProps("mobile")}
          label={t("mobile")}
          placeholder={t("mobile")}
          onChangeData={(data: any) => handleFieldChange("mobile", data)}
        />
        <ERPInput
          {...getFieldProps("fax")}
          label={t("fax")}
          placeholder={t("fax")}
          onChangeData={(data: any) => handleFieldChange("fax", data)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          placeholder={t("email")}
          onChangeData={(data: any) => handleFieldChange("email", data)}
        />
        <ERPInput
          {...getFieldProps("tin")}
          label={t("tin")}
          placeholder={t("tax_identification_number")}
          onChangeData={(data: any) => handleFieldChange("tin", data)}
        />
        <ERPInput
          {...getFieldProps("registrationNumber")}
          label={t("registration_number")}
          placeholder={t("registration_number")}
          onChangeData={(data: any) =>
            handleFieldChange("registrationNumber", data)
          }
        />
        <ERPInput
          {...getFieldProps("branchManager")}
          label={t("branch_manager")}
          placeholder={t("branch_manager")}
          onChangeData={(data: any) => handleFieldChange("branchManager", data)}
        />
        <ERPInput
          {...getFieldProps("userName")}
          label={t("username")}
          placeholder={t("username")}
          onChangeData={(data: any) => handleFieldChange("userName", data)}
        />
        <ERPInput
          {...getFieldProps("password")}
          label={t("password")}
          placeholder={t("password")}
          type="password"
          onChangeData={(data: any) => handleFieldChange("password", data)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
      
        <ERPCheckbox
          {...getFieldProps("useMainBranchInventory")}
          label="Use Main Branch Inventory"
          onChangeData={(data: any) => handleFieldChange("useMainBranchInventory", data)}
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

export default BranchManage;
