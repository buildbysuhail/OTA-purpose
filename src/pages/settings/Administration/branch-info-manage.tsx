import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { toggleBranchPopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";

export interface BranchDataInfo {
  branchID?: number;
  companyID: number;
  branchCode: string;
  branchName: string;
  address1: string;
  address2: string;
  city: string;
  district: string;
  bState: string;
  country: string | number;
  pinCode: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  tin: string;
  registrationNumber: string;
  branchManager: string;
  remarks: string;
  createdUserID?: number;
  createdDate?: string;
  modifiedUserID?: number;
  modifiedDate?: string;
  settingsDone?: boolean;
  useMainBranchInventory: boolean;
}

const initialBranchData = {
  data: {
    branchID: 0,
    companyID: 0,
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
    createdUserID: 0,
    createdDate: "",
    modifiedUserID: 0,
    modifiedDate: "",
    settingsDone: true,
    useMainBranchInventory: false
  },
  validations: {
    branchID: "",
    companyID: "",
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
    createdUserID: "",
    createdDate: "",
    modifiedUserID: "",
    modifiedDate: "",
    settingsDone: "",
    useMainBranchInventory: ""
  }
};

const BranchManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation("administration");
  const onClose = useCallback(() => {
    dispatch(toggleBranchPopup({ isOpen: false }));
  }, [dispatch]);
  const {
    handleFieldChange,
    getFieldProps,
    handleClear,
    formState
  } = useFormManager<BranchDataInfo>({
    url: `${Urls.BranchInfo}`,
    onSuccess: useCallback(() => {
      dispatch(toggleBranchPopup({ isOpen: false }));
    }, [dispatch]),
    method: ActionType.POST,
    useApiClient: true,
    loadDataRequired: true,
    initialData: initialBranchData
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); }} className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps("branchID")}
          label={t("branch_id")}
          placeholder={t("enter_id")}
          disabled={true}
          onChangeData={(value) => handleFieldChange("branchID", value.branchID)}
        />

        <ERPDataCombobox
          {...getFieldProps("companyID")}
          field={{
            id: "companyID",
            required: true,
            getListUrl: Urls.data_company_id,
            valueKey: "companyID",
            labelKey: "companyName",
          }}
          onChange={(data: any) => handleFieldChange("companyID", data.companyID)}
          label={t("company_id")}
        />

        <ERPDateInput
          {...getFieldProps("createdDate")}
          label={t("date_from")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("createdDate", data)}
        />

        <ERPDateInput
          {...getFieldProps("modifiedDate")}
          label={t("date_to")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("modifiedDate", data)}
        />

        <ERPInput
          {...getFieldProps("branchCode")}
          label={t("branch_code")}
          placeholder={t("branch_code")}
          required={true}
          onChangeData={(value) => handleFieldChange("branchCode", value.branchCode)}
        />

        <ERPInput
          {...getFieldProps("branchName")}
          label={t("branch_name")}
          placeholder={t("branch_name")}
          required={true}
          onChangeData={(value) => handleFieldChange("branchName", value.branchName)}
        />

        <ERPInput
          {...getFieldProps("address1")}
          label={t("address_line_1")}
          placeholder={t("address_line_1")}
          onChangeData={(value) => handleFieldChange("address1", value.address1)}
        />

        <ERPInput
          {...getFieldProps("address2")}
          label={t("address_line_2")}
          placeholder={t("address_line_2")}
          onChangeData={(value) => handleFieldChange("address2", value.address2)}
        />

        <ERPInput
          {...getFieldProps("city")}
          label={t("city")}
          placeholder={t("city")}
          required={true}
          onChangeData={(value) => handleFieldChange("city", value.city)}
        />

        <ERPInput
          {...getFieldProps("district")}
          label={t("district")}
          placeholder={t("district")}
          onChangeData={(value) => handleFieldChange("district", value.district)}
        />

        <ERPInput
          {...getFieldProps("bState")}
          label={t("state")}
          placeholder={t("state")}
          onChangeData={(value) => handleFieldChange("bState", value.bState)}
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
          onChange={(data: any) => handleFieldChange("country", data.id.country)}
          label={t("country")}
        />

        <ERPInput
          {...getFieldProps("pinCode")}
          label={t("pin_code")}
          placeholder={t("pin_code")}
          onChangeData={(value) => handleFieldChange("pinCode", value.pinCode)}
        />

        <ERPInput
          {...getFieldProps("phone")}
          label={t("phone")}
          placeholder={t("phone")}
          onChangeData={(value) => handleFieldChange("phone", value.phone)}
        />

        <ERPInput
          {...getFieldProps("mobile")}
          label={t("mobile")}
          placeholder={t("mobile")}
          onChangeData={(value) => handleFieldChange("mobile", value.mobile)}
        />

        <ERPInput
          {...getFieldProps("fax")}
          label={t("fax")}
          placeholder={t("fax")}
          onChangeData={(value) => handleFieldChange("fax", value.fax)}
        />

        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          placeholder={t("email")}
          onChangeData={(value) => handleFieldChange("email", value.email)}
        />

        <ERPInput
          {...getFieldProps("tin")}
          label={t("tin")}
          placeholder={t("tax_identification_number")}
          onChangeData={(value) => handleFieldChange("tin", value.tin)}
        />

        <ERPInput
          {...getFieldProps("registrationNumber")}
          label={t("registration_number")}
          placeholder={t("registration_number")}
          onChangeData={(value) => handleFieldChange("registrationNumber", value.registrationNumber)}
        />

        <ERPInput
          {...getFieldProps("branchManager")}
          label={t("branch_manager")}
          placeholder={t("branch_manager")}
          onChangeData={(value) => handleFieldChange("branchManager", value.branchManager)}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          onChangeData={(value) => handleFieldChange("remarks", value.remarks)}
        />

        <ERPCheckbox
          {...getFieldProps("useMainBranchInventory")}
          label={t("use_main_branch_inventory")}
          className="text-left"
          onChangeData={(value) => handleFieldChange("useMainBranchInventory", value.useMainBranchInventory)}
        />
      </div>

      {/* <ERPFormButtons
          onClear={handleClear}
          isEdit
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
        /> */}
    </form>
  );
});
export default BranchManage;