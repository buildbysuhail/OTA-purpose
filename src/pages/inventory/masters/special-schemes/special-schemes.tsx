import React, { useCallback, useState, useMemo } from "react";
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
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { useRootState } from "../../../../utilities/hooks/useRootState";

export interface SpecialSchemesData {
  // Your existing interface
}

const SpecialSchemes: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

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

  // Grid columns definition
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "name",
      caption: t("name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "barcode",
      caption: t("barcode"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "productBatchID",
      caption: t("product_batch_ID"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "specialPriceID",
      caption: t("special_price_ID"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "salesPrice",
      caption: t("sales_price"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "schemePrice",
      caption: t("scheme_price"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    },
    {
      dataField: "x",
      caption: t("X"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200
    }
  ], [t, dispatch]);

  return (
    <>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Special Price" value="specialPrice" />
        <Tab label="FOC Scheme" value="FOCScheme" />
      </Tabs>
      <div className="p-4">
        {activeTab === 'specialPrice' &&
          <>
            <div>
              {/* form */}
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-5 gap-6 p-4">
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
                  <ERPDataCombobox
                    {...getFieldProps("groupCombo")}
                    field={{
                      id: "groupCombo",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    onChangeData={(data: any) => handleFieldChange("groupCombo", data.groupCombo)}
                    label={t("group_combo")}
                    options={[
                      { value: '2 Mix Brand', label: t('2_mix_brand') },
                    ]}
                  />
                  <ERPCheckbox
                    {...getFieldProps('group')}
                    label={t("group")}
                    onChangeData={(data: any) => handleFieldChange('group', data.group)}
                  />
                </div>
              </div>
              {/* Integrated Grid */}
              <div className="mt-4">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("special_schemes")}
                  gridId="grd_special_schemes"
                  hideDefaultExportButton={true}
                />
              </div>
            </div>
          </>
        }
        {activeTab === 'FOCScheme' &&
          <>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-5 gap-6 p-4">
                <ERPDataCombobox
                  {...getFieldProps("scheme")}
                  field={{
                    id: "scheme",
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  onChangeData={(data: any) => handleFieldChange("scheme", data.scheme)}
                  label={t("scheme")}
                  options={[
                    { value: '2 Mix Brand', label: t('2_mix_brand') },
                  ]}
                />
                <ERPInput
                  {...getFieldProps("quantity")}
                  label={t("quantity")}
                  placeholder={t("quantity")}
                  onChangeData={(data: any) => handleFieldChange("quantity", data.quantity)}
                />
                <ERPInput
                  {...getFieldProps("freeQuantity")}
                  label={t("free_quantity")}
                  placeholder={t("free_quantity")}
                  onChangeData={(data: any) => handleFieldChange("freeQuantity", data.freeQuantity)}
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
                <ERPInput
                  {...getFieldProps("itemBarcode")}
                  label={t("item_barcode")}
                  placeholder={t("item_barcode")}
                  onChangeData={(data: any) => handleFieldChange("itemBarcode", data.itemBarcode)}
                />
                <ERPInput
                  {...getFieldProps("unit")}
                  label={t("unit")}
                  placeholder={t("unit")}
                  onChangeData={(data: any) => handleFieldChange("unit", data.unit)}
                />
                <ERPInput
                  {...getFieldProps("remarks")}
                  label={t("remarks")}
                  placeholder={t("remarks")}
                  onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
                />
                <ERPInput
                  {...getFieldProps("nameCode")}
                  label={t("name/code")}
                  placeholder={t("name/code")}
                  onChangeData={(data: any) => handleFieldChange("nameCode", data.nameCode)}
                />
                <ERPCheckbox
                  {...getFieldProps('code')}
                  label={t("code")}
                  onChangeData={(data: any) => handleFieldChange('code', data.code)}
                />
              </div>
            </div>
            {/* Integrated Grid */}
            <div className="mt-4">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("special_schemes")}
                gridId="grd_special_schemes"
                hideDefaultExportButton={true}
              />
            </div>
          </>
        }
      </div>
      <div className="flex items-center justify-between">
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