import React, { useCallback, useState } from "react";
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
  country: string;
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
    useMainBranchInventory: false,
  },
  // validations: {
  //   id: "",
  //   companyID: "",
  //   dateFrom: "",
  //   dateTo: "",
  //   branchCode: "",
  //   branchName: "",
  //   address1: "",
  //   address2: "",
  //   city: "",
  //   district: "",
  //   bState: "",
  //   country: "",
  //   pinCode: "",
  //   phone: "",
  //   mobile: "",
  //   fax: "",
  //   email: "",
  //   tin: "",
  //   registrationNumber: "",
  //   branchManager: "",
  //   remarks: "",
  //   userName: "",
  //   password: "",
  //   useMainBranchInventory: "",
  // },
};

const initconformPassWord = {
  data:{
  confirmPassword:""
  },
  validations:{
     confirmPassword:""
  }
}

export const BranchGridManage: React.FC = React.memo(() => {
  const [confirmPassword, setConfirmPassword] = useState(initconformPassWord);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rootState = useRootState();
  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<BranchData>({
      url: Urls.Branch,
      onSuccess: useCallback(
        () => dispatch(toggleBranchGridPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      key: rootState.PopupData.branchGrid.key,
      useApiClient: true,
      initialData: initialDataBranch,
    });

  const onClose = useCallback(() => {
    dispatch(toggleBranchGridPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ERPInput
          {...getFieldProps("branchCode")}
          label="Branch Code"
          required
          onChangeData={(data) => handleFieldChange("branchCode", data)}
        />

        <ERPInput
          {...getFieldProps("branchName")}
          label=" Name"
          required
          onChangeData={(data) => handleFieldChange("branchName", data)}
        />
        {/* <ERPDataCombobox
          {...getFieldProps("companyID")}
          field={{
            id: "companyID",
            required: true,
            getListUrl: Urls.data_company_id,
            valueKey:"companyID",
            labelKey:"companyID",
          }}
          onChange={(data: any) => handleFieldChange("companyID", data)}
          label="Company Id"
          id="companyID"
        /> */}

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
          {...getFieldProps("bState")}
          label="State"
          onChangeData={(data) => handleFieldChange("bState", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("country")}
          field={{
            id: "country",
            required: true,
            getListUrl: Urls.data_countries,
            valueKey: "name",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("country", data);
          }}
          label={t("country")}
        />
        <ERPInput
          {...getFieldProps("pinCode")}
          label="pinCode"
          onChangeData={(data) => handleFieldChange("pinCode", data)}
        />
        <ERPInput
          {...getFieldProps("branchManager")}
          label="Branch Manager"
          onChangeData={(data) => handleFieldChange("branchManager", data)}
        />
        <ERPInput
          {...getFieldProps("phone")}
          label="Land Phone"
          onChangeData={(data) => handleFieldChange("phone", data)}
        />
        <ERPInput
          {...getFieldProps("mobile")}
          label="Mobile Phone"
          onChangeData={(data) => handleFieldChange("mobile", data)}
        />
        <ERPInput
          {...getFieldProps("fax")}
          label="FAX"
          onChangeData={(data) => handleFieldChange("fax", data)}
        />
        <ERPInput
          {...getFieldProps("tin")}
          label={t("tin")}
          required
          onChangeData={(data) => handleFieldChange("tin", data)}
        />
        <ERPInput
          {...getFieldProps("registrationNumber")}
          label="Register No"
          onChangeData={(data) => handleFieldChange("registrationNumber", data)}
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
        <ERPCheckbox
          {...getFieldProps("useMainBranchInventory")}
          label="Use Main Branch Inventory"
          onChangeData={(data) =>
            handleFieldChange("useMainBranchInventory", data)
          }
        />
      </div>
      <div className="flex flex-col justify-start items-start p-6 border rounded border-gray-400  border-dotted gap-5 my-5">
        <div className="flex gap-5">
          <ERPDateInput
            {...getFieldProps("dateFrom")}
            label="Financial Year From"
            disabled={isEdit}
            required
            onChangeData={(data) => handleFieldChange("dateFrom", data)}
          />

          <ERPDateInput
            {...getFieldProps("dateTo")}
            label="Financial Year To"
            disabled={isEdit}
            required
            onChangeData={(data) => handleFieldChange("dateTo", data)}
          />
        </div>
        <div className="flex  gap-5">
          <ERPInput
            {...getFieldProps("username")}
            label="Username"
            disabled={isEdit}
            onChangeData={(data) => handleFieldChange("username", data)}
          />
          <ERPInput
            {...getFieldProps("password")}
            label="Password"
            type="password"
            disabled={isEdit}
            required
            onChangeData={(data) => handleFieldChange("password", data)}
          />
         
          <ERPInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            required={true}
            data={confirmPassword?.data}
            onChangeData={(data: any) => {
              setConfirmPassword((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={confirmPassword.validations?.confirmPassword}
            value={
              confirmPassword?.data?.confirmPassword ? confirmPassword?.data?.confirmPassword : ""
            }
          />


    {/* Show error message if passwords don't match */}
    {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
           {/* <ERPInput
            {...getFieldProps("confirmPassword")}
            label="Confirm Password"
            disabled={isEdit}
            type="password"
            required
            onChangeData={(data) => handleFieldChange("confirmPassword", data)}
          /> */}
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
