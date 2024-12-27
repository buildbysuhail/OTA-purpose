import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";

const OpeningStockReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
      <div className="flex items-center gap-4">
        <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isProductGroup")}
          label={t("product_group")}
          onChangeData={(data: any) => handleFieldChange('isProductGroup', data.isProductGroup)}
        />
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("productGroup")}
          noLabel
          field={{
            id: "productGroup",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange('productGroup', data.productGroup)}
        />
      </div>

      <div className="flex items-center gap-4">
        <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isBrand")}
          label={t("brand")}
          onChangeData={(data: any) => handleFieldChange('isBrand', data.isBrand)}
        />
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("brand")}
          noLabel
          field={{
            id: "brand",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange('brand', data.brand)}
        />
      </div>

      <div className="flex items-center gap-4">
        <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isProduct")}
          label={t("product")}
          onChangeData={(data: any) => handleFieldChange('isProduct', data.isProduct)}
        />
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("product")}
          noLabel
          field={{
            id: "product",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange('product', data.product)}
        />
      </div>

      <div className="flex items-center gap-4">
        <ERPCheckbox
          className="basis-1/3"
          {...getFieldProps("isProductCategory")}
          label={t("product_category")}
          onChangeData={(data: any) => handleFieldChange('isProductCategory', data.isProductCategory)}
        />
        <ERPDataCombobox
          className="basis-2/3"
          {...getFieldProps("productCategory")}
          noLabel
          field={{
            id: "productCategory",
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange('productCategory', data.productCategory)}
        />
      </div>

      <ERPDateInput
        {...getFieldProps("fromDate")}
        label={t("from")}
        onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        autoFocus={true}
      />
      <ERPDateInput
        {...getFieldProps("toDate")}
        label={t("to")}
        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
      />
    </div>

  );
}
export default OpeningStockReportFilter;
export const OpeningStockReportFilterInitialState = {
  isProductGroup: false,
  isBrand: false,
  isProduct: false,
  isProductCategory: false,
  productGroup: "",
  brand: "",
  product: "",
  productCategory: "",
  fromDate: new Date(),
  toDate: new Date(),
};