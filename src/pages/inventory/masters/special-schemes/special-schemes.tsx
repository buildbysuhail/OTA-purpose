import React, { useCallback, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toggleSpecialSchemes } from "../../../../redux/slices/popup-reducer";
import { ActionType } from "../../../../redux/types";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { Button, Tab, Tabs } from "@mui/material";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useRootState } from "../../../../utilities/hooks/useRootState";

export interface SpecialSchemesData {
  nameCode: string;
  groupPrice: string;
  barcode: string;
  price: string;
  unit: string;
  standardSPrice: string;
  standardPPrice: string;
  group: boolean;
  quantity: string
  freeQuantity: string
  itemBarcode: string
  remarks: string
  code: boolean
}

const SpecialSchemes: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

  const [activeTab, setActiveTab] = useState('specialPrice');
  const [gridData, setGridData] = useState<SpecialSchemesData[]>([]);
  const [formData, setFormData] = useState<SpecialSchemesData>({
    nameCode: "",
    groupPrice: "",
    barcode: "",
    price: "",
    unit: "",
    standardSPrice: "",
    standardPPrice: "",
    group: false,
    quantity: "",
    freeQuantity: "",
    itemBarcode: "",
    remarks: "",
    code: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const {
    isEdit,
    handleSubmit,
    handleClear,
    getFieldProps,
    handleFieldChange,
    isLoading,
    handleClose
  } = useFormManager<SpecialSchemesData>({
    url: Urls.CompanyProfiles,
    onClose:useCallback(() => dispatch(toggleSpecialSchemes({ isOpen: false, key: null,reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleSpecialSchemes({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });


  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleAddToGrid = () => {
    setGridData((prevData) => [...prevData, formData]);
    setFormData({
      nameCode: "",
      groupPrice: "",
      barcode: "",
      price: "",
      unit: "",
      standardSPrice: "",
      standardPPrice: "",
      group: false,
      quantity: "",
      freeQuantity: "",
      itemBarcode: "",
      remarks: "",
      code: false,
    });
  };

  // Grid columns definition
  const columns: DevGridColumn[] = useMemo(() => {
    if (activeTab === 'specialPrice') {
      return [
        {
          dataField: "name",
          caption: t("names"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
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
          caption: t("units"),
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
      ];
    } else if (activeTab === 'FOCScheme') {
      return [
        {
          dataField: "name",
          caption: t("names"),
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
          dataField: "salesPrice",
          caption: t("sales_price"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 200
        },
        {
          dataField: "unit",
          caption: t("units"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 200
        },
        {
          dataField: "qty",
          caption: t("qtys"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 200
        },
        {
          dataField: "freeItem",
          caption: t("free_item"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 200
        },
        {
          dataField: "freeQty",
          caption: t("free_qty"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 200
        },
        {
          dataField: "qtyDiscountID",
          caption: t("qty_discount_ID"),
          dataType: "string",
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
      ];
    }
    return [];
  }, [activeTab, t]);

  return (
    <>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
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
                    value={formData.groupPrice}
                    onChange={handleInputChange}
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
                    value={formData.nameCode}
                    onChange={handleInputChange}
                  />
                  <ERPInput
                    {...getFieldProps("barcode")}
                    label={t("barcode")}
                    placeholder={t("barcode")}
                    value={formData.barcode}
                    onChange={handleInputChange}
                  />
                  <ERPInput
                    {...getFieldProps("price")}
                    label={t("price")}
                    placeholder={t("price")}
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                  <ERPInput
                    {...getFieldProps("unit")}
                    label={t("unit")}
                    placeholder={t("unit")}
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                  <ERPInput
                    {...getFieldProps("standardSPrice")}
                    label={t("std.s.price")}
                    placeholder={t("std.s.price")}
                    value={formData.standardSPrice}
                    onChange={handleInputChange} />
                  <ERPInput
                    {...getFieldProps("standardPPrice")}
                    label={t("std.p.price")}
                    placeholder={t("std.p.price")}
                    value={formData.standardPPrice}
                    onChange={handleInputChange} />
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
                    checked={formData.group}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*  */}
              {/* Integrated Grid */}
              <div className="mt-4">
                <ErpDevGrid
                  columns={columns}
                  gridId="grd_special_schemes"
                  data={gridData}
                  hideDefaultExportButton={true}
                  hideGridAddButton={true}
                  customToolbarItems={[{
                    location: 'after', item: (
                      <Button variant="contained" color="primary" onClick={handleAddToGrid}>
                        {t("add")}
                      </Button>
                    )
                  }]}
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
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
                <ERPInput
                  {...getFieldProps("freeQuantity")}
                  label={t("free_quantity")}
                  placeholder={t("free_quantity")}
                  value={formData.freeQuantity}
                  onChange={handleInputChange} />
                <ERPInput
                  {...getFieldProps("standardSPrice")}
                  label={t("std.s.price")}
                  placeholder={t("std.s.price")}
                  value={formData.standardSPrice}
                  onChange={handleInputChange} />
                <ERPInput
                  {...getFieldProps("standardPPrice")}
                  label={t("std.p.price")}
                  placeholder={t("std.p.price")}
                  value={formData.standardPPrice}
                  onChange={handleInputChange} />
                <ERPInput
                  {...getFieldProps("itemBarcode")}
                  label={t("item_barcode")}
                  placeholder={t("item_barcode")}
                  value={formData.itemBarcode}
                  onChange={handleInputChange} />
                <ERPInput
                  {...getFieldProps("unit")}
                  label={t("unit")}
                  placeholder={t("unit")}
                  value={formData.unit}
                  onChange={handleInputChange} />
                <ERPInput
                  {...getFieldProps("remarks")}
                  label={t("remarks")}
                  placeholder={t("remarks")}
                  value={formData.remarks}
                  onChange={handleInputChange} />
                <ERPInput
                  {...getFieldProps("nameCode")}
                  label={t("name/code")}
                  placeholder={t("name/code")}
                  value={formData.nameCode}
                  onChange={handleInputChange} />
                <ERPCheckbox
                  {...getFieldProps('code')}
                  label={t("code")}
                  checked={formData.code}
                  onChange={handleInputChange} />
              </div>
            </div>
            <div className="mt-4">
              <ErpDevGrid
                columns={columns}
                gridId="grd_special_schemes"
                data={gridData}
                hideDefaultExportButton={true}
                hideGridAddButton={true}
                customToolbarItems={[{
                  location: 'after', item: (
                    <Button variant="contained" color="primary" onClick={handleAddToGrid}>
                      {t("add")}
                    </Button>
                  )
                }]}
              />
            </div>
          </>
        }
      </div>
      {/* <div className="flex items-center justify-between">
        <ERPFormButtons
          onClear={handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div> */}
    </>
  );
});

export default SpecialSchemes;