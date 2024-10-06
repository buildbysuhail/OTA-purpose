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

export const BranchGridManage: React.FC = React.memo(() => {
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
    // initialData: initialDataUserType
  });

  const onClose = useCallback(() => {
    dispatch(toggleBranchGridPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-4">
        <ERPInput
          {...getFieldProps("code")}
          label="Code"
          required
          onChangeData={(data) => handleFieldChange("code", data)}
        />
        <ERPInput
          {...getFieldProps("name")}
          label="Name"
          required
          onChangeData={(data) => handleFieldChange("name", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("company")}
          field={{
            id: "company",
            required: true,
            getListUrl: Urls.CompanyProfiles,
            valueKey: "id",
            labelKey: "name",
          }}
          label="Company"
          onChangeData={(data) => handleFieldChange("company", data)}
        />
        <ERPInput
          {...getFieldProps("address1")}
          label="Address 1"
          onChangeData={(data) => handleFieldChange("address1", data)}
        />
        <ERPInput
          {...getFieldProps("address2")}
          label="Address 2"
          onChangeData={(data) => handleFieldChange("address2", data)}
        />
        <ERPInput
          {...getFieldProps("city")}
          label="City"
          onChangeData={(data) => handleFieldChange("city", data)}
        />
        <ERPInput
          {...getFieldProps("district")}
          label="District"
          onChangeData={(data) => handleFieldChange("district", data)}
        />
        <ERPInput
          {...getFieldProps("state")}
          label="State"
          onChangeData={(data) => handleFieldChange("state", data)}
        />
        <ERPInput
          {...getFieldProps("country")}
          label="Country"
          onChangeData={(data) => handleFieldChange("country", data)}
        />
        <ERPInput
          {...getFieldProps("pin")}
          label="Pin"
          onChangeData={(data) => handleFieldChange("pin", data)}
        />
        <ERPInput
          {...getFieldProps("manager")}
          label="Manager"
          onChangeData={(data) => handleFieldChange("manager", data)}
        />
        <ERPInput
          {...getFieldProps("landPhone")}
          label="Land Phone"
          onChangeData={(data) => handleFieldChange("landPhone", data)}
        />
        <ERPInput
          {...getFieldProps("mobilePhone")}
          label="Mobile Phone"
          onChangeData={(data) => handleFieldChange("mobilePhone", data)}
        />
        <ERPInput
          {...getFieldProps("fax")}
          label="FAX"
          onChangeData={(data) => handleFieldChange("fax", data)}
        />
        <ERPInput
          {...getFieldProps("tin")}
          label="TIN"
          required
          onChangeData={(data) => handleFieldChange("tin", data)}
        />
        <ERPInput
          {...getFieldProps("registerNo")}
          label="Register No"
          onChangeData={(data) => handleFieldChange("registerNo", data)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label="Email"
          onChangeData={(data) => handleFieldChange("email", data)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label="Remarks"
          onChangeData={(data) => handleFieldChange("remarks", data)}
        />
        <ERPDateInput
          {...getFieldProps("financialYearFrom")}
          label="Financial Year From"
          required
          onChangeData={(data) =>
            handleFieldChange("financialYearFrom", data)
          }
        />
        <ERPDateInput
          {...getFieldProps("financialYearTo")}
          label="Financial Year To"
          required
          onChangeData={(data) => handleFieldChange("financialYearTo", data)}
        />
        <ERPInput
          {...getFieldProps("username")}
          label="Username"
          onChangeData={(data) => handleFieldChange("username", data)}
        />
        <ERPInput
          {...getFieldProps("password")}
          label="Password"
          type="password"
          required
          onChangeData={(data) => handleFieldChange("password", data)}
        />
        <ERPInput
          {...getFieldProps("confirmPassword")}
          label="Confirm Password"
          type="password"
          required
          onChangeData={(data) => handleFieldChange("confirmPassword", data)}
        />
        <ERPCheckbox
          {...getFieldProps("useMainBranchInventory")}
          label="Use Main Branch Inventory"
          onChangeData={(data) =>
            handleFieldChange("useMainBranchInventory", data)
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