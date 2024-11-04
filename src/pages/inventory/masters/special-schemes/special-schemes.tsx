import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleSpecialSchemes } from "../../../../redux/slices/popup-reducer";
import { ActionType } from "../../../../redux/types";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "@mui/material";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";

export interface SpecialSchemesData {
  // registeredName: string,
  // registeredNameArabic: string,
  // taxRegNo: string,
  // crNumber: string,
  // buildingNo: string,
  // streetName: string,
  // district: string,
  // city: string,
  // country: number,
  // postalCode: string,
  // additionalNo: string,
  // emailAddress: string,
  // telephone: string,
  // mobile: string,
  // countrySubEntity: string
}

const SpecialSchemes: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('specialPrice');

  const {
    isEdit,
    handleSubmit,
    handleClear,
    getFieldProps,
    handleFieldChange,
    isLoading,
  } = useFormManager<SpecialSchemesData>({
    url: Urls.CompanyProfiles,
    onSuccess: useCallback(() => dispatch(toggleSpecialSchemes({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  const onClose = useCallback(() => {
    dispatch(toggleSpecialSchemes({ isOpen: false }));
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  return (
    <>
      <Tabs value={activeTab} onChange={handleTabChange} >
        <Tab label="Special Price" value="specialPrice" />
        <Tab label="FOC Scheme" value="FOCScheme" />
      </Tabs>
      <div>
        {activeTab === 'specialPrice' &&
          <>
            <div>
              <div className="grid grid-cols-4 gap-6 p-4">
                <div className="flex items-center justify-between mt-4">
                  <ERPCheckbox
                    {...getFieldProps('group')}
                    label={t("group")}
                    onChangeData={(data: any) => handleFieldChange('group', data.group)}
                  />
                  <ERPDataCombobox
                    {...getFieldProps("groupCombo")}
                    field={{
                      id: "groupCombo",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    onChangeData={(data: any) => handleFieldChange("groupCombo", data.groupCombo)}
                    label=' '
                    options={[
                      { value: '2 Mix Brand', label: t('2_mix_brand') },
                    ]}
                  />
                </div>
                <ERPInput
                  {...getFieldProps("groupPrice")}
                  label={t("group_price")}
                  placeholder={t("group_price")}
                  onChangeData={(data: any) => handleFieldChange("groupPrice", data.groupPrice)}
                />
                <ERPDataCombobox
                  {...getFieldProps("groupCombo")}
                  field={{
                    id: "groupCombo",
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  onChangeData={(data: any) => handleFieldChange("groupCombo", data.groupCombo)}
                  label={t("scheme")}
                  options={[
                    { value: '2 Mix Brand', label: t('2_mix_brand') },
                  ]}
                />
                <ERPInput
                  {...getFieldProps("nameCode")}
                  label={t("name/code")}
                  placeholder={t("name/code")}
                  onChangeData={(data: any) => handleFieldChange("nameCode", data.nameCode)}
                />
              </div>
              <div className="grid grid-cols-5 gap-6 border p-4 rounded-lg">
                <ERPInput
                  {...getFieldProps("barcode")}
                  label={t("barcode")}
                  placeholder={t("barcode")}
                  onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
                />
                <ERPInput
                  {...getFieldProps("price")}
                  label={t("price")}
                  placeholder={t("price")}
                  onChangeData={(data: any) => handleFieldChange("price", data.price)}
                />
                <ERPInput
                  {...getFieldProps("unit")}
                  label={t("unit")}
                  placeholder={t("unit")}
                  onChangeData={(data: any) => handleFieldChange("unit", data.unit)}
                />
                <ERPInput
                  {...getFieldProps("standardSPrice")}
                  label={t("std.s.price")}
                  placeholder={t("std.s.price")}
                  onChangeData={(data: any) => handleFieldChange("standardSPrice", data.standardSPrice)}
                />
                <ERPInput
                  {...getFieldProps("standardPPrice")}
                  label={t("std.p.price")}
                  placeholder={t("std.p.price")}
                  onChangeData={(data: any) => handleFieldChange("standardPPrice", data.standardPPrice)}
                />
              </div>
              {/* grid */}

            </div>
          </>
        }
      </div>
      <div className="flex items-center justify-between">
        <ERPInput
          {...getFieldProps("search")}
          label=" "
          placeholder={t("search_barcode_to_remove")}
          onChangeData={(data: any) => handleFieldChange("search", data.search)}
        />
        <ERPFormButtons
          onClear={handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
});

export default SpecialSchemes;