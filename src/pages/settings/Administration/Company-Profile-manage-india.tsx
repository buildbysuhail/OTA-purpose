import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { ActionType } from "../../../redux/types";
import { toggleCompanyProfileIndiaPopup } from "../../../redux/slices/popup-reducer";

export interface CompanyProfileData {
  companyID: number,
  companyName: string,
  registrationName: string,
  address1: string,
  address2: string,
  address3: string,
  address4: string,
  city: string,
  district: string,
  country: string,
  pinCode: string,
  mobile: string,
  tax1_Reg_No: string,
  tax2_Reg_No: string,
  tax3_Reg_No: string,
  tax4_Reg_No: string,
  work_Phone: string,
  office_Phone: string,
  contact_Phone: string,
  fax: string,
  remarks: string,
  createdUserID: number,
  createdDate: string,
  modifiedUserID: number,
  modifiedDate: string,
  email: string,
  leagelName: string,
  tradeTradeName: string,
  stateCode: number,
  stateName: string,
  fssai: string,
  accountNo: string,
  bankName: string,
  branchName: string,
  ifsc: string
}

const CompanyProfileManageIndia: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation("administration");
  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<CompanyProfileData>({
    url: Urls.CompanyProfileIndia,
    onClose: useCallback(() => dispatch(toggleCompanyProfileIndiaPopup({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleCompanyProfileIndiaPopup({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps("companyName")}
          label={t("company_name")}
          placeholder={t("company_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("companyName", data.companyName)}
        />

        <ERPInput
          {...getFieldProps("registrationName")}
          label={t("registration_name")}
          placeholder={t("registration_name")}
          onChangeData={(data: any) => handleFieldChange("registrationName", data.registrationName)}
        />

        <ERPInput
          {...getFieldProps("address1")}
          label={t("address1")}
          placeholder={t("address1")}
          onChangeData={(data: any) => handleFieldChange("address1", data.address1)}
        />

        <ERPInput
          {...getFieldProps("address2")}
          label={t("address2")}
          placeholder={t("address2")}
          onChangeData={(data: any) => handleFieldChange("address2", data.address2)}
        />

        <ERPInput
          {...getFieldProps("address3")}
          label={t("address3")}
          placeholder={t("address3")}
          onChangeData={(data: any) => handleFieldChange("address3", data.address3)}
        />

        <ERPInput
          {...getFieldProps("address4")}
          label={t("address4")}
          placeholder={t("address4")}
          onChangeData={(data: any) => handleFieldChange("address4", data.address4)}
        />

        <ERPInput
          {...getFieldProps("city")}
          label={t("city")}
          placeholder={t("city")}
          onChangeData={(data: any) => handleFieldChange("city", data.city)}
        />

        <ERPInput
          {...getFieldProps("district")}
          label={t("district")}
          placeholder={t("district")}
          onChangeData={(data: any) => handleFieldChange("district", data.district)}
        />

        <ERPDataCombobox
          {...getFieldProps("stateName")}
          field={{
            id: "stateName",
            required: true,
            getListUrl: Urls.data_states,
            valueKey: "name",
            labelKey: "name",
          }}
          onChangeData={(data: any) => { handleFieldChange("stateName", data.stateName) }}
          label={t("state_name")}
        />

        <ERPInput
          {...getFieldProps("stateCode")}
          label={t("state_code")}
          placeholder={t("state_code")}
          onChangeData={(data: any) => handleFieldChange("stateCode", data.stateCode)}
        />

        <ERPInput
          {...getFieldProps("country")}
          label={t("country")}
          placeholder={t("country")}
          onChangeData={(data: any) => handleFieldChange("country", data.country)}
        />

        <ERPInput
          {...getFieldProps("pinCode")}
          label={t("pin")}
          placeholder={t("pin")}
          onChangeData={(data: any) => handleFieldChange("pinCode", data.pinCode)}
        />

        <ERPInput
          {...getFieldProps("work_Phone")}
          label={t("work_phone")}
          placeholder={t("work_phone")}
          onChangeData={(data: any) => handleFieldChange("work_Phone", data.work_Phone)}
        />

        <ERPInput
          {...getFieldProps("office_Phone")}
          label={t("office_phone")}
          placeholder={t("office_phone")}
          onChangeData={(data: any) => handleFieldChange("office_Phone", data.office_Phone)}
        />

        <ERPInput
          {...getFieldProps("contact_Phone")}
          label={t("contact_phone")}
          placeholder={t("contact_phone")}
          onChangeData={(data: any) => handleFieldChange("contact_Phone", data.contact_Phone)}
        />

        <ERPInput
          {...getFieldProps("tax1_Reg_No")}
          label={t("gst")}
          placeholder={t("gst")}
          onChangeData={(data: any) => handleFieldChange("tax1_Reg_No", data.tax1_Reg_No)}
        />

        <ERPInput
          {...getFieldProps("tax2_Reg_No")}
          label={t("cin")}
          placeholder={t("cin")}
          onChangeData={(data: any) => handleFieldChange("tax2_Reg_No", data.tax2_Reg_No)}
        />

        <ERPInput
          {...getFieldProps("tax3_Reg_No")}
          label={t("pan")}
          placeholder={t("pan")}
          onChangeData={(data: any) => handleFieldChange("tax3_Reg_No", data.tax3_Reg_No)}
        />

        <ERPInput
          {...getFieldProps("tax4_Reg_No")}
          label={t("tan")}
          placeholder={t("tan")}
          onChangeData={(data: any) => handleFieldChange("tax4_Reg_No", data.tax4_Reg_No)}
        />

        <ERPInput
          {...getFieldProps("fssai")}
          label={t("fssai")}
          placeholder={t("fssai")}
          onChangeData={(data: any) => handleFieldChange("fssai", data.fssai)}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />

        <ERPInput
          {...getFieldProps("leagelName")}
          label={t("leagel_name")}
          placeholder={t("leagel_name")}
          onChangeData={(data: any) => handleFieldChange("leagelName", data.leagelName)}
        />

        <ERPInput
          {...getFieldProps("tradeTradeName")}
          label={t("trade_name")}
          placeholder={t("trade_name")}
          onChangeData={(data: any) => handleFieldChange("tradeTradeName", data.tradeTradeName)}
        />

        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          placeholder={t("email")}
          onChangeData={(data: any) => handleFieldChange("email", data.email)}
        />

        <ERPInput
          {...getFieldProps("fax")}
          label={t("fax")}
          placeholder={t("fax")}
          onChangeData={(data: any) => handleFieldChange("fax", data.fax)}
        />

        <ERPInput
          {...getFieldProps("accountNo")}
          label={t("account_number")}
          placeholder={t("account_number")}
          onChangeData={(data: any) => handleFieldChange("accountNo", data.accountNo)}
        />

        <ERPInput
          {...getFieldProps("bankName")}
          label={t("bank_name")}
          placeholder={t("bank_name")}
          onChangeData={(data: any) => handleFieldChange("bankName", data.bankName)}
        />

        <ERPInput
          {...getFieldProps("branchName")}
          label={t("branch_name")}
          placeholder={t("branch_name")}
          onChangeData={(data: any) => handleFieldChange("branchName", data.branchName)}
        />

        <ERPInput
          {...getFieldProps("ifsc")}
          label={t("ifsc")}
          placeholder={t("ifsc")}
          onChangeData={(data: any) => handleFieldChange("ifsc", data.ifsc)}
        />
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
export default CompanyProfileManageIndia;