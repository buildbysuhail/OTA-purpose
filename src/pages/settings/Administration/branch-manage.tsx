import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleBranchGridPopup } from "../../../redux/slices/popup-reducer";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";

interface BranchData {
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

export const initialDataBranch = {
  data: {
    id: 0,
    companyID: 0,
    dateFrom: "",
    dateTo: "",
    branchCode: "",
    branchName: "",
    address1: "",
    address2: "",
    city: "",
    district: "",
    bState: "",
    country: 0,
    pinCode: "",
    phone: "",
    mobile: "",
    fax: "",
    email: "",
    tin: "",
    registrationNumber: "",
    branchManager: "",
    remarks: "",
    userName: "",
    password: "",
    useMainBranchInventory: false,
  },
  validations: {
    id: "",
    companyID: "",
    dateFrom: "",
    dateTo: "",
    branchCode: "",
    branchName: "",
    address1: "",
    address2: "",
    city: "",
    district: "",
    bState: "",
    country: "",
    pinCode: "",
    phone: "",
    mobile: "",
    fax: "",
    email: "",
    tin: "",
    registrationNumber: "",
    branchManager: "",
    remarks: "",
    userName: "",
    password: "",
    useMainBranchInventory: "",
  }
};

export const BranchGridManage: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const rootState = useRootState();
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<BranchData>({
    url: Urls.Branch,
    onSuccess: useCallback(() => dispatch(toggleBranchGridPopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.branchGrid.key,
    useApiClient: true,
    initialData: initialDataBranch
  });

  const onClose = useCallback(() => {
    dispatch(toggleBranchGridPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ERPInput
          {...getFieldProps("code")}
          label={t("code")}
          required
          onChangeData={(data) => handleFieldChange("code", data.code)}
        />
        <ERPInput
          {...getFieldProps("name")}
          label={t("name")}
          required
          onChangeData={(data) => handleFieldChange("name", data.name)}
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
        <ERPInput
          {...getFieldProps("address1")}
          label={t("address1")}
          onChangeData={(data) => handleFieldChange("address1", data.address1)}
        />
        <ERPInput
          {...getFieldProps("address2")}
          label={t("address2")}
          onChangeData={(data) => handleFieldChange("address2", data.address2)}
        />
        <ERPInput
          {...getFieldProps("city")}
          label={t("city")}
          onChangeData={(data) => handleFieldChange("city", data.city)}
        />
        <ERPInput
          {...getFieldProps("district")}
          label={t("district")}
          onChangeData={(data) => handleFieldChange("district", data.district)}
        />
        <ERPInput
          {...getFieldProps("state")}
          label={t("state")}
          onChangeData={(data) => handleFieldChange("state", data.state)}
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
            handleFieldChange("country", data.country);
          }}
          label={t("country")}
        />
        <ERPInput
          {...getFieldProps("pin")}
          label={t("pin")}
          onChangeData={(data) => handleFieldChange("pin", data.pin)}
        />
        <ERPInput
          {...getFieldProps("manager")}
          label={("manager")}
          onChangeData={(data) => handleFieldChange("manager", data.manager)}
        />
        <ERPInput
          {...getFieldProps("landPhone")}
          label={t("land_phone")}
          onChangeData={(data) => handleFieldChange("landPhone", data.landPhone)}
        />
        <ERPInput
          {...getFieldProps("mobilePhone")}
          label={t("mobile_phone")}
          onChangeData={(data) => handleFieldChange("mobilePhone", data.mobilePhone)}
        />
        <ERPInput
          {...getFieldProps("fax")}
          label={t("fax")}
          onChangeData={(data) => handleFieldChange("fax", data.fax)}
        />
        <ERPInput
          {...getFieldProps("tin")}
          label={t("tin")}
          required
          onChangeData={(data) => handleFieldChange("tin", data.tin)}
        />
        <ERPInput
          {...getFieldProps("registerNo")}
          label={t("register_no")}
          onChangeData={(data) => handleFieldChange("registerNo", data.registerNo)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          onChangeData={(data) => handleFieldChange("email", data.email)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          onChangeData={(data) => handleFieldChange("remarks", data.remarks)}
        />
        <ERPDateInput
          {...getFieldProps("financialYearFrom")}
          label={t("financial_year_from")}
          required
          onChangeData={(data) =>
            handleFieldChange("financialYearFrom", data.financialYearFrom)
          }
        />
        <ERPDateInput
          {...getFieldProps("financialYearTo")}
          label={t("financial_year_to")}
          required
          onChangeData={(data) => handleFieldChange("financialYearTo", data.financialYearTo)}
        />
        <ERPInput
          {...getFieldProps("username")}
          label={t("username")}
          onChangeData={(data) => handleFieldChange("username", data.username)}
        />
        <ERPInput
          {...getFieldProps("password")}
          label={t("password")}
          type="password"
          required
          onChangeData={(data) => handleFieldChange("password", data.password)}
        />
        <ERPInput
          {...getFieldProps("confirmPassword")}
          label={t("confirm_password")}
          type="password"
          required
          onChangeData={(data) => handleFieldChange("confirmPassword", data.confirmPassword)}
        />
        <ERPCheckbox
          {...getFieldProps("useMainBranchInventory")}
          label={t("use_main_branch_inventory")}
          onChangeData={(data) =>
            handleFieldChange("useMainBranchInventory", data.useMainBranchInventory)
          }
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