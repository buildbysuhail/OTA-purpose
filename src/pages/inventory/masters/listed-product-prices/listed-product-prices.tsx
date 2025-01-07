import React, { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { toggleSpecialSchemes } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

export interface ListedProductData {
  party: string;
  product: string;
  code: string;
  unit: string;
  price: string;
}

const ListedProductPrices: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [gridData, setGridData] = useState<ListedProductData[]>([]);
  const [formData, setFormData] = useState<ListedProductData>({
    party: "",
    product: "",
    code: "",
    unit: "",
    price: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<ListedProductData>({
    url: Urls.CompanyProfiles,
    onSuccess: useCallback(() => dispatch(toggleSpecialSchemes({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  const handleAddToGrid = () => {
    setGridData((prevData) => [...prevData, formData]);
    setFormData({
      party: "",
      product: "",
      code: "",
      unit: "",
      price: "",
    });
  };

  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "code",
      caption: t("code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "price",
      caption: t("price"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "x",
      caption: "X",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    }
  ], [t]);

  return (
    <div className="px-4 pt-4 pb-2 ">
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-3 gap-6 p-4">
          <ERPDataCombobox
            {...getFieldProps("party")}
            id="party"
            field={{
              id: "party",
              required: true,
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("party")}
            required={true}
            onChangeData={(data: any) => handleFieldChange("party", data.party)}
          />
          <ERPDataCombobox
            {...getFieldProps("type")}
            id="type"
            field={{
              id: "type",
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("type")}
            required={true}
            onChangeData={(data: any) => handleFieldChange("type", data.type)}
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="grid grid-cols-3 gap-6">
            <ERPCheckbox
              {...getFieldProps('productCode')}
              label={t("product_code")}
              onChangeData={(data: any) => handleFieldChange('productCode', data.productCode)}
            />
            <ERPInput
              {...getFieldProps("product")}
              label={t("product")}
              value={formData.product}
              onChange={handleInputChange}
            />
            <ERPDataCombobox
              {...getFieldProps("product")}
              id="product"
              field={{
                id: "product",
                getListUrl: Urls.data_warehouse,
                valueKey: "id",
                labelKey: "name",
              }}
              label={t("product")}
              required={true}
              onChangeData={(data: any) => handleFieldChange("product", data.product)}
            />
          </div>
          <ERPDataCombobox
            {...getFieldProps("unit")}
            field={{
              id: "unit",
              valueKey: "value",
              labelKey: "label",
            }}
            onChangeData={(data: any) => handleFieldChange("unit", data.unit)}
            label={t("units")}
            options={[
              { value: 'PCs', label: t('2_mix_brand') },
            ]}
          />
          <ERPInput
            {...getFieldProps("price")}
            label={t("price")}
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-4">
        <ErpDevGrid
          columns={columns}
          gridId="grd_listed_prices"
          data={gridData}
          hideDefaultExportButton={true}
          hideGridAddButton={true}
          gridHeader={t("listed_product_prices")}
          customToolbarItems={[{
            location: 'after',
            item: (
              <Button variant="contained" color="primary" onClick={handleAddToGrid}>
                {t("add")}
              </Button>
            )
          }]}
        />
      </div>
    </div>
  );
});

export default ListedProductPrices;