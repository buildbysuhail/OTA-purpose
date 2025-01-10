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
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { StateStoring } from "devextreme-react/cjs/data-grid";
import { RootState } from "../../../redux/store";

interface BranchData {
  id: number;
  companyID: number;
  dateFrom: Date;
  dateTo: Date;
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
    dateFrom: null,
    dateTo: null,
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

const initconformPassWord = {
  data: {
    confirmPassword: ""
  },
  validations: {
    confirmPassword: ""
  }
}

export const BranchGridManage: React.FC = React.memo(() => {
  const [confirmPassword, setConfirmPassword] = useState(initconformPassWord);
  const { t } = useTranslation('masters');
  const dispatch = useDispatch();
  const rootState = useRootState();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  
  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading, formState,handleClose } =
    useFormManager<BranchData>({
      url: Urls.Branch,
      onClose:useCallback(() => dispatch(toggleBranchGridPopup({ isOpen: false, key: null,reload: false })), [dispatch]),
      onSuccess: useCallback(
        () => dispatch(toggleBranchGridPopup({ isOpen: false, key: null,reload: false })),
        [dispatch]
      ),
      key: rootState.PopupData.branchGrid.key,
      keyField:"branchID",
      useApiClient: true,
      initialData: {
        ...initialDataBranch,
        data: {
          ...initialDataBranch.data,
          dateFrom: userSession.finFrom ?? initialDataBranch?.data?.dateFrom,
          dateTo: userSession.finTo ?? initialDataBranch?.data?.dateTo
        }
      }
    });




  return (
    <div className="w-full">
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ERPInput
          {...getFieldProps("branchCode")}
          label={t("branch_code")}
          required
          onChangeData={(data) => handleFieldChange("branchCode", data.branchCode)}
        />

        <ERPInput
          {...getFieldProps("branchName")}
          label={t("name")}
          required
          onChangeData={(data) => handleFieldChange("branchName", data.branchName)}
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
          {...getFieldProps("bState")}
          label={t("state")}
          onChangeData={(data) => handleFieldChange("bState", data.bState)}
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
            handleFieldChange("country", data.country);
          }}
          label={t("country")}
        />
        <ERPInput
          {...getFieldProps("pinCode")}
          label={t("pin_code")}
          onChangeData={(data) => handleFieldChange("pinCode", data.pinCode)}
        />
        <ERPInput
          {...getFieldProps("branchManager")}
          label={t("branch_manager")}
          onChangeData={(data) => handleFieldChange("branchManager", data.branchManager)}
        />
        <ERPInput
          {...getFieldProps("phone")}
          label={t("land_phone")}
          onChangeData={(data) => handleFieldChange("phone", data.phone)}
        />
        <ERPInput
          {...getFieldProps("mobile")}
          label={t("mobile_phone")}
          onChangeData={(data) => handleFieldChange("mobile", data.mobile)}
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
          {...getFieldProps("registrationNumber")}
          label={t("register_no")}
          onChangeData={(data) => handleFieldChange("registrationNumber", data.registrationNumber)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          type="email"
          onChangeData={(data) => handleFieldChange("email", data.email)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          onChangeData={(data) => handleFieldChange("remarks", data.remarks)}
        />
        <ERPCheckbox
          {...getFieldProps("useMainBranchInventory")}
          label={t("use_main_branch_inventory")}
          onChangeData={(data) =>
            handleFieldChange("useMainBranchInventory", data.useMainBranchInventory)
          }
        />
      </div>
      <div className="flex flex-col justify-start items-start p-6 border rounded border-gray-400  border-dotted gap-5 my-5">
        <div className="flex gap-5">
          <ERPDateInput
            {...getFieldProps("dateFrom")}
            label={t("financial_year_from")}
            disabled={isEdit}
            required
            onChangeData={(data) => handleFieldChange("dateFrom", data.dateFrom)}
          />

          <ERPDateInput
            {...getFieldProps("dateTo")}
            label={t("financial_year_to")}
            disabled={isEdit}
            required
            onChangeData={(data) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>
        {!formState?.data?.branchID  &&
        <div className="flex  gap-5">
          <ERPInput
            {...getFieldProps("username")}
            label={t("username")}
            disabled={isEdit}
            onChangeData={(data) => handleFieldChange("username", data.username)}
          />
          <ERPInput
            {...getFieldProps("password")}
            label={t("password")}
            type="password"
            disabled={isEdit}
            required
            onChangeData={(data) => handleFieldChange("password", data.password)}
          />

          <ERPInput
            id="confirmPassword"
            label={t("confirm_password")}
            placeholder={t("confirm_password")}
            type="password"
            required={true}
            disabled={isEdit}
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
        </div>
        }
        {formState?.data?.branchID != undefined && formState?.data?.branchID != null && formState?.data?.branchID != 0 &&
          < ERPCheckbox
            {...getFieldProps("isActive")}
            label={t("is_active")}
            checked={formState?.data?.isActive}
            onChangeData={(data) =>
              handleFieldChange("isActive", data.isActive)
            }
          />
        }
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
