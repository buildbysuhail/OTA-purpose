import React, { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
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
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPMultiSelect from "../../../../components/ERPComponents/erp-multi-select";

export interface ProductPriceIndiaData {
  slNo: string;
  productCode: string;
  productName: string;
  priceCategory: string;
  groupName: string;
  unit: string;
  salesDisc: string;
  mrp: string;
  margin: string;
  salesRate: string;
  qty: string;
  cost: string;
  markUpDown: string;
}

const ProductPricesIndia: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<ProductPriceIndiaData[]>([]);

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<ProductPriceIndiaData>({
    url: Urls.CompanyProfiles,
    onSuccess: useCallback(
      () => dispatch(toggleSpecialSchemes({ isOpen: false })),
      [dispatch]
    ),
    method: ActionType.POST,
    useApiClient: true,
  });

  const handleAddToGrid = () => {
    // Add current form data to grid
    const newItem: ProductPriceIndiaData = {
      slNo: String(gridData.length + 1),
      productCode: "",
      productName: "",
      priceCategory: "",
      groupName: "",
      unit: "",
      salesDisc: "",
      mrp: "",
      margin: "",
      salesRate: "",
      qty: "",
      cost: "",
      markUpDown: "",
    };
    setGridData([...gridData, newItem]);
  };

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "slNo",
        caption: t("si_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 60,
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 180,
      },
      {
        dataField: "priceCategory",
        caption: t("price_category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "unit",
        caption: t("unit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 80,
      },
      {
        dataField: "salesDisc",
        caption: t("sales_disc_%"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "margin",
        caption: t("margin"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "salesRate",
        caption: t("sales_rate"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "qty",
        caption: t("qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 80,
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "markUpDown",
        caption: t("mark_(up/down)"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
    ],
    []
  );

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <div className="flex flex-col gap-2 border border-[#ededed] p-4 rounded-md">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 items-end gap-2">
              <ERPDataCombobox
                {...getFieldProps("vType")}
                id="vType"
                field={{
                  id: "vType",
                  getListUrl: Urls.data_vouchertype,
                  valueKey: "id",
                  labelKey: "name",
                }}
                label={t("v_type")}
                onChangeData={(data: any) =>
                  handleFieldChange("vType", data.vType)
                }
              />
              <ERPDataCombobox
                {...getFieldProps("vPrefix")}
                id="vPrefix"
                field={{
                  id: "vPrefix",
                  getListUrl: Urls.data_warehouse,
                  valueKey: "id",
                  labelKey: "name",
                }}
                label={t("v_prefix")}
                onChangeData={(data: any) =>
                  handleFieldChange("vPrefix", data.vPrefix)
                }
              />
              <ERPInput
                {...getFieldProps("vNo")}
                label={t("v_no")}
                onChangeData={(data: any) => handleFieldChange("vNo", data.vNo)}
              />
              <ERPDataCombobox
                {...getFieldProps("formType")}
                id="formType"
                field={{
                  id: "formType",
                  getListUrl: Urls.data_form_type,
                  valueKey: "id",
                  labelKey: "name",
                }}
                label={t("form_type")}
                onChangeData={(data: any) =>
                  handleFieldChange("formType", data.formType)
                }
              />
            </div>
            <ERPDataCombobox
              {...getFieldProps("brandValue")}
              id="brandValue"
              field={{
                id: "brandValue",
                getListUrl: Urls.data_brands,
                valueKey: "id",
                labelKey: "name",
              }}
              label={t("brand")}
              onChangeData={(data: any) =>
                handleFieldChange("brandValue", data.brandValue)
              }
            />
            <ERPDataCombobox
              {...getFieldProps("productCategoryValue")}
              id="productCategoryValue"
              field={{
                id: "productCategoryValue",
                getListUrl: Urls.data_productcategory,
                valueKey: "id",
                labelKey: "name",
              }}
              label={t("product_category")}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "productCategoryValue",
                  data.productCategoryValue
                )
              }
            />
            <ERPDataCombobox
              {...getFieldProps("productNameValue")}
              id="productNameValue"
              field={{
                id: "productNameValue",
                getListUrl: Urls.data_warehouse,
                valueKey: "id",
                labelKey: "name",
              }}
              label={t("product_name")}
              onChangeData={(data: any) =>
                handleFieldChange("productNameValue", data.productNameValue)
              }
            />
            <div className="flex justify-end">
              <ERPButton title={t("add")} />
            </div>
          </div>
          <div>
            <ERPMultiSelect
              label="Countries"
              options={[
                { id: 1, name: "Urgent" },
                { id: 2, name: "Important" },
                { id: 3, name: "Review" },
                { id: 4, name: "Pending" },
                { id: 5, name: "Completed" },
              ]}
              selectedValues={getFieldProps("sdsd").value}
              onChange={(data) => handleFieldChange("sdsd", data)}
              placeholder="Select countries"
              searchPlaceholder="Search countries..."
              outputFormat="array"
            />
          </div>
          <div className="flex flex-col gap-2 border border-[#ededed] p-4 rounded-md">
            <ERPDataCombobox
              {...getFieldProps("branchValue")}
              id="branchValue"
              field={{
                id: "branchValue",
                // getListUrl: Urls.data_branch,
                valueKey: "id",
                labelKey: "name",
              }}
              label={t("branch")}
              onChangeData={(data: any) =>
                handleFieldChange("branchValue", data.branchValue)
              }
            />
            <ERPDataCombobox
              {...getFieldProps("productGroupValue")}
              id="productGroupValue"
              field={{
                id: "productGroupValue",
                getListUrl: Urls.data_productgroup,
                valueKey: "id",
                labelKey: "name",
              }}
              label={t("product_group")}
              onChangeData={(data: any) =>
                handleFieldChange("productGroupValue", data.productGroupValue)
              }
            />
            <div className="flex items-end gap-2">
              <ERPDataCombobox
                {...getFieldProps("priceUpdate")}
                id="priceUpdate"
                field={{
                  id: "priceUpdate",
                  getListUrl: Urls.data_warehouse,
                  valueKey: "id",
                  labelKey: "name",
                }}
                label={t("price_update_(up_down)")}
                onChangeData={(data: any) =>
                  handleFieldChange("priceUpdate", data.priceUpdate)
                }
              />
              <ERPInput noLabel={true} id={""} />
            </div>
            <ERPCheckbox
              {...getFieldProps("updateStdRate")}
              label={t("update_std_rate")}
              onChangeData={(data: any) =>
                handleFieldChange("updateStdRate", data.updateStdRate)
              }
            />
            <div className="flex items-center justify-end gap-2">
              <ERPButton title={t("branch")} />
              <ERPButton title={t("load_items")} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white border rounded-lg shadow-sm p-2">
        <ErpDevGrid
          columns={columns}
          gridId="grd_product_prices_india"
          data={gridData}
          hideDefaultExportButton={false}
          hideGridAddButton={true}
          gridHeader={t("product_prices_india")}
        />
      </div>
    </div>
  );
});

export default ProductPricesIndia;
