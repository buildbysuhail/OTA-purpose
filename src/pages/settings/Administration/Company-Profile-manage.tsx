import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleCompanyProfilePopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";

export interface CompanyProfileData {
  registeredName: string,
  registeredNameArabic: string,
  taxRegNo: string,
  crNumber: string,
  buildingNo: string,
  streetName: string,
  district: string,
  city: string,
  country: string,
  postalCode: string,
  additionalNo: string,
  emailAddress: string,
  telephone: string,
  mobile: string,
  countrySubEntity: string
}

export const initialCompanyProfileData = {
  data: {
    registeredName: "",
    registeredNameArabic: "",
    taxRegNo: "",
    crNumber: "",
    buildingNo: "",
    streetName: "",
    district: "",
    city: "",
    country: "",
    postalCode: "",
    additionalNo: "",
    emailAddress: "",
    telephone: "",
    mobile: "",
    countrySubEntity: ""
  },
  validations: {
    registeredName: "",
    registeredNameArabic: "",
    taxRegNo: "",
    crNumber: "",
    buildingNo: "",
    streetName: "",
    district: "",
    city: "",
    country: "",
    postalCode: "",
    additionalNo: "",
    emailAddress: "",
    telephone: "",
    mobile: "",
    countrySubEntity: ""
  },
};



const CompanyProfileManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState
  } = useFormManager<CompanyProfileData>({
    url: Urls.CompanyProfiles,
    onSuccess: useCallback(() => dispatch(toggleCompanyProfilePopup({ isOpen: false, key: null })), [dispatch]),
    method: ActionType.POST
  });

  const onClose = useCallback(() => {
    dispatch(toggleCompanyProfilePopup({ isOpen: false, key: null }));
  }, []);


  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("registeredName")}
          label="Registered Name"
          placeholder="Registered Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange("registeredName", data)}
        />

        <ERPInput
          {...getFieldProps("registeredNameArabic")}
          label={t("registered_name")}
          placeholder={t("registered_name")}
          onChangeData={(data: any) => handleFieldChange("registeredNameArabic", data)}
        />

        <ERPInput
          {...getFieldProps("taxRegNo")}
          label={t("tax_registration_number")}
          placeholder={t("tax_registration_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("taxRegNo", data)}
        />

        <ERPInput
          {...getFieldProps("crNumber")}
          label={t("cr_number")}
          placeholder={t("cr_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("crNumber", data)}
        />

        <ERPInput
          {...getFieldProps("buildingNo")}
          label={t("building_number")}
          placeholder={t("building_number")}
          onChangeData={(data: any) => handleFieldChange("buildingNo", data)}
        />

        <ERPInput
          {...getFieldProps("streetName")}
          label={t("street")}
          placeholder={t("street")}
          onChangeData={(data: any) => handleFieldChange("streetName", data)}
        />

        <ERPInput
          {...getFieldProps("district")}
          label={t("district")}
          placeholder={t("district")}
          onChangeData={(data: any) => handleFieldChange("district", data)}
        />

        <ERPInput
          {...getFieldProps("city")}
          label={t("city")}
          placeholder={t("city")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("city", data)}
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
          onChange={(data: any) => handleFieldChange("cId", data)}
          label={t("country")}
        />

        <ERPInput
          {...getFieldProps("postalCode")}
          label={t("postal_code")}
          placeholder={t("postal_code")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("postalCode", data)}
        />

        <ERPInput
          {...getFieldProps("additionalNo")}
          label={t("additional_number")}
          placeholder={t("additional_number")}
          onChangeData={(data: any) => handleFieldChange("additionalNo", data)}
        />

        <ERPInput
          {...getFieldProps("countrySubEntity")}
          label={t("region_country_sub_entity")}
          placeholder={t("region")}
          onChangeData={(data: any) => handleFieldChange("countrySubEntity", data)}
        />

        <ERPInput
          {...getFieldProps("emailAddress")}
          label={t("email")}
          placeholder={t("email")}
          onChangeData={(data: any) => handleFieldChange("emailAddress", data)}
        />

        <ERPInput
          {...getFieldProps("telephone")}
          label={t("telephone")}
          placeholder={t("telephone")}
          onChangeData={(data: any) => handleFieldChange("telephone", data)}
        />

        <ERPInput
          {...getFieldProps("mobile")}
          label={t("mobile")}
          placeholder={t("mobile")}
          onChangeData={(data: any) => handleFieldChange("mobile", data)}
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

export default CompanyProfileManage;