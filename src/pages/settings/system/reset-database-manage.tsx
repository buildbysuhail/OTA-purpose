import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleResetDataBasePopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";

export interface CompanyProfileData {
  from: string;
  to: string;
  password: string;
}

export const initialCompanyProfileData = {
  data: {
    from: "",
    to: "",
    password: "",
  },
  validations: {
    from: "",
    to: "",
    password: "",
  },
};

const ResetDbManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<CompanyProfileData>({
    url: Urls.CompanyProfiles,
    onSuccess: useCallback(
      () => dispatch(toggleResetDataBasePopup({ isOpen: false, key: null })),
      [dispatch]
    ),
    method: ActionType.POST,
  });

  const onClose = useCallback(() => {
    dispatch(toggleResetDataBasePopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="grid grid-cols-3 gap-5 ">
          <ERPDateInput
            {...getFieldProps("from")}
            type="date"
            id="from"
            label="from"
            onChangeData={(data: any) => handleFieldChange("from", data)}
          />
          <ERPDateInput
            {...getFieldProps("to")}
            type="date"
            id="to"
            label="to"
            onChangeData={(data: any) => handleFieldChange("to", data)}
          />
          <ERPInput
            {...getFieldProps("password")}
            label="password"
            placeholder="password"
            required={true}
            onChangeData={(data: any) =>
              handleFieldChange("password", data)
            }
          />
        </div>

        {/* <ERPInput
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
        /> */}
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

export default ResetDbManage;
