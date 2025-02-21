import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
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
  country: number,
  postalCode: string,
  additionalNo: string,
  emailAddress: string,
  telephone: string,
  mobile: string,
  countrySubEntity: string
}

const CompanyProfileManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<CompanyProfileData>({
    url: Urls.CompanyProfiles,
    onClose: useCallback(() => dispatch(toggleCompanyProfilePopup({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleCompanyProfilePopup({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });
  const { t } = useTranslation("administration");

  return (
    <div className=" w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2">
        <ERPInput
          {...getFieldProps("registeredName")}
          label={t("registered_name")}
          placeholder={t("registered_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("registeredName", data.registeredName)}
        />

        <ERPInput
          {...getFieldProps("registeredNameArabic")}
          label={t("registered_name")}
          placeholder={t("registered_name")}
          onChangeData={(data: any) => handleFieldChange("registeredNameArabic", data.registeredNameArabic)}
        />

        <ERPInput
          {...getFieldProps("taxRegNo")}
          label={t("tax_registration_number")}
          placeholder={t("tax_registration_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("taxRegNo", data.taxRegNo)}
        />

        <ERPInput
          {...getFieldProps("crNumber")}
          label={t("cr_number")}
          placeholder={t("cr_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("crNumber", data.crNumber)}
        />

        <ERPInput
          {...getFieldProps("buildingNo")}
          label={t("building_number")}
          placeholder={t("building_number")}
          onChangeData={(data: any) => handleFieldChange("buildingNo", data.buildingNo)}
        />

        <ERPInput
          {...getFieldProps("streetName")}
          label={t("street")}
          placeholder={t("street")}
          onChangeData={(data: any) => handleFieldChange("streetName", data.streetName)}
        />

        <ERPInput
          {...getFieldProps("district")}
          label={t("district")}
          placeholder={t("district")}
          onChangeData={(data: any) => handleFieldChange("district", data.district)}
        />

        <ERPInput
          {...getFieldProps("city")}
          label={t("city")}
          placeholder={t("city")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("city", data.city)}
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
          onChangeData={(data: any) => {  handleFieldChange("country", data.country)}}
          label={t("country")}
        />

        <ERPInput
          {...getFieldProps("postalCode")}
          label={t("postal_code")}
          placeholder={t("postal_code")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("postalCode", data.postalCode)}
        />

        <ERPInput
          {...getFieldProps("additionalNo")}
          label={t("additional_number")}
          placeholder={t("additional_number")}
          onChangeData={(data: any) => handleFieldChange("additionalNo", data.additionalNo)}
        />

        <ERPInput
          {...getFieldProps("countrySubEntity")}
          label={t("region_country_sub_entity")}
          placeholder={t("region")}
          onChangeData={(data: any) => handleFieldChange("countrySubEntity", data.countrySubEntity)}
        />

        <ERPInput
          {...getFieldProps("emailAddress")}
          label={t("email")}
          placeholder={t("email")}
          onChangeData={(data: any) => handleFieldChange("emailAddress", data.emailAddress)}
        />

        <ERPInput
          {...getFieldProps("telephone")}
          label={t("telephone")}
          placeholder={t("telephone")}
          onChangeData={(data: any) => handleFieldChange("telephone", data.telephone)}
        />
        
        <ERPInput
          {...getFieldProps("mobile")}
          label={t("mobile")}
          placeholder={t("mobile")}
          onChangeData={(data: any) => handleFieldChange("mobile", data.mobile)}
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
export default CompanyProfileManage;