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
  country: string;
  cId: number;
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

export const initialBranchData = {
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
    country: "",
    cId: 0,
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
  },
};

const BranchManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<BranchData>({
    url: Urls.Branch,
    onSuccess: useCallback(() => dispatch(toggleBranchPopup({ isOpen: false })), [dispatch]),
    method: ActionType.POST
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
          placeholder="Enter Id"
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
          onChange={(data: any) => handleFieldChange("companyID", data.companyID)}
          label="Company ID"
        />

        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label="Date From"
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />

        <ERPDateInput
          {...getFieldProps("dateTo")}
          label="Date To"
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateTo", data)}
        />


        <ERPInput
          {...getFieldProps("branchCode")}
          label="Branch Code"
          placeholder="Branch Code"
          required={true}
          onChangeData={(data: any) => handleFieldChange("branchCode", data)}
        />

        <ERPInput
          {...getFieldProps("branchName")}
          label="Branch Name"
          placeholder="Branch Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange("branchName", data)}
        />

        <ERPInput
          {...getFieldProps("address1")}
          label="Address Line 1"
          placeholder="Address Line 1"
          onChangeData={(data: any) => handleFieldChange("address1", data)}
        />

        <ERPInput
          {...getFieldProps("address2")}
          label="Address Line 2"
          placeholder="Address Line 2"
          onChangeData={(data: any) => handleFieldChange("address2", data)}
        />

        <ERPInput
          {...getFieldProps("city")}
          label="City"
          placeholder="City"
          required={true}
          onChangeData={(data: any) => handleFieldChange("city", data)}
        />

        <ERPInput
          {...getFieldProps("district")}
          label="District"
          placeholder="District"
          onChangeData={(data: any) => handleFieldChange("district", data)}
        />

        <ERPInput
          {...getFieldProps("bState")}
          label="State"
          placeholder="State"
          onChangeData={(data: any) => handleFieldChange("bState", data)}
        />

        <ERPDataCombobox
          {...getFieldProps("cId")}
          field={{
            id: "cId",
            required: true,
            getListUrl: Urls.data_countries,
            valueKey: "id",
            labelKey: "name",
          }}
          onChange={(data: any) => {
            handleFieldChange("country", data.label);
            handleFieldChange("cId", data.value);
          }}
          label="Country"
        />

        <ERPInput
          {...getFieldProps("pinCode")}
          label="Pin Code"
          placeholder="Pin Code"
          onChangeData={(data: any) => handleFieldChange("pinCode", data)}
        />

        <ERPInput
          {...getFieldProps("phone")}
          label="Phone"
          placeholder="Phone"
          onChangeData={(data: any) => handleFieldChange("phone", data)}
        />

        <ERPInput
          {...getFieldProps("mobile")}
          label="Mobile"
          placeholder="Mobile"
          onChangeData={(data: any) => handleFieldChange("mobile", data)}
        />

        <ERPInput
          {...getFieldProps("fax")}
          label="Fax"
          placeholder="Fax"
          onChangeData={(data: any) => handleFieldChange("fax", data)}
        />

        <ERPInput
          {...getFieldProps("email")}
          label="Email"
          placeholder="Email"
          onChangeData={(data: any) => handleFieldChange("email", data)}
        />

        <ERPInput
          {...getFieldProps("tin")}
          label="TIN"
          placeholder="Tax Identification Number"
          onChangeData={(data: any) => handleFieldChange("tin", data)}
        />

        <ERPInput
          {...getFieldProps("registrationNumber")}
          label="Registration Number"
          placeholder="Registration Number"
          onChangeData={(data: any) => handleFieldChange("registrationNumber", data)}
        />

        <ERPInput
          {...getFieldProps("branchManager")}
          label="Branch Manager"
          placeholder="Branch Manager"
          onChangeData={(data: any) => handleFieldChange("branchManager", data)}
        />

        <ERPInput
          {...getFieldProps("userName")}
          label="Username"
          placeholder="Username"
          onChangeData={(data: any) => handleFieldChange("userName", data)}
        />

        <ERPInput
          {...getFieldProps("password")}
          label="Password"
          placeholder="Password"
          type="password"
          onChangeData={(data: any) => handleFieldChange("password", data)}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label="Remarks"
          placeholder="Remarks"
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            name="useMainBranchInventory"
            className="ti-form-checkbox"
            id="useMainBranchInventory"
            checked={getFieldProps("useMainBranchInventory").value}
            onChange={(e) => handleFieldChange("useMainBranchInventory", e.target.checked)}
          />
          <label
            htmlFor="useMainBranchInventory"
            className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
          >
            Use Main Branch Inventory
          </label>
        </div>
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