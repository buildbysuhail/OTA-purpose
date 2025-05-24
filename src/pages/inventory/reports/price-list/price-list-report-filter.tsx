import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";

const PriceListReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ps-1 ">
      <div className="flex flex-col items-start gap-2">
        {/* <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isProductGroup")}
          label={t("product_group")}
          onChangeData={(data: any) => handleFieldChange('isProductGroup', data.isProductGroup)}
        /> */}
          {/* <ERPDataCombobox
                  label={t("product_group")}
                  {...getFieldProps("productGroupID")}
                  field={{
                    id: "productGroupID",
                    getListUrl: Urls.data_productgroup,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onSelectItem={(data) => {
                    handleFieldChange({
                      productGroupID: data.value,
                      productGroup: data.label,
                    });
                  }}
                /> */}
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("productGroupID")}
          noLabel
          field={{
            id: "productGroupID",
            getListUrl: Urls.data_productgroup,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data: any) => handleFieldChange('productGroupID', data.value)}
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        {/* <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isBrand")}
          label={t("brand")}
          onChangeData={(data: any) => handleFieldChange('isBrand', data.isBrand)}
        /> */}
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("brandID")}
          noLabel
          field={{
            id: "brandID",
            getListUrl: Urls.data_brands,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data: any) => handleFieldChange('brandID', data.value)}
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        {/* <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isProduct")}
          label={t("product")}
          onChangeData={(data: any) => handleFieldChange('isProduct', data.isProduct)}
        /> */}
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("itemID")}
          noLabel
          field={{
            id: "itemID",
            getListUrl: Urls.data_products,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data: any) => handleFieldChange('itemID', data.value)}
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        {/* <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isProductCategory")}
          label={t("product_category")}
          onChangeData={(data: any) => handleFieldChange('isProductCategory', data.isProductCategory)}
        /> */}
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("productCategoryID")}
          noLabel
          field={{
            id: "productCategoryID",
            getListUrl: Urls.data_productcategory,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data: any) => handleFieldChange('productCategoryID', data.value)}
        />
        {/* always visible false */}
           {/* <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("taxCategoryID")}
          noLabel
          field={{
            id: "taxCategoryID",
            getListUrl: Urls.data_taxCategory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange('taxCategoryID', data.value)}
        /> */}
      </div>
    </div>
  );
}
export default PriceListReportFilter;
export const PriceListReportFilterInitialState = {
  productCategoryID: -1,
  brandID: -1,
  itemID: -1,
  productGroupID: -1,
  taxCategoryID: -1,
};