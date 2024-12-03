import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../../redux/urls";
import productCategory from "../../../../inventory/masters/product-category/product-category";



const PriceListReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
        <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-4">
        <ERPCheckbox
          {...getFieldProps("isProductGroup")}
          label={t("product_group")}
          onChangeData={(data) => handleFieldChange('isProductGroup', data.isProductGroup)}
        />
          <ERPDataCombobox
          {...getFieldProps("productGroup")}
          noLabel
          field={{
            id: "productGroup",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('productGroup', data.productGroup)}
        />
        </div>
    
        <div className="flex items-center gap-4">
        <ERPCheckbox
          {...getFieldProps("isBrand")}
          label={t("brand")}
          onChangeData={(data) => handleFieldChange('isBrand', data.isBrand)}
        />
          <ERPDataCombobox
          {...getFieldProps("brand")}
          noLabel
          field={{
            id: "brand",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('brand', data.brand)}
        />
        </div>

        
        <div className="flex items-center gap-4">
        <ERPCheckbox
          {...getFieldProps("isProduct")}
          label={t("product")}
          onChangeData={(data) => handleFieldChange('isProduct', data.isProduct)}
        />
          <ERPDataCombobox
          {...getFieldProps("product")}
          noLabel
          field={{
            id: "product",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('product', data.product)}
        />
        </div>

        
        <div className="flex items-center gap-4">
        <ERPCheckbox
          {...getFieldProps("isProductCategory")}
          label={t("product_category")}
          onChangeData={(data) => handleFieldChange('isProductCategory', data.isProductCategory)}
        />
          <ERPDataCombobox
          {...getFieldProps("productCategory")}
          noLabel
          field={{
            id: "productCategory",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('productCategory', data.productCategory)}
        />
        </div>
      </div>

);
}
export default PriceListReportFilter;
export const PriceListReportFilterInitialState = {
isProductGroup:false,
isBrand:false,
isProduct:false,
isProductCategory:false,
 productGroup:"",
 brand:"",
 product:"",
 productCategory:""
};