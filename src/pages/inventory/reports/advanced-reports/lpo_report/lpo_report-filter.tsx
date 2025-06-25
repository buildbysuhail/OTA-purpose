import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
const LPOReportFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("supplier")}
            {...getFieldProps("supplierID")}
            field={{
              id: "supplierID",
              getListUrl: Urls.data_Suppliers,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange({
                supplierID: data.value,
                supplier: data.label,
              });
            }}
          />
        </div>
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("product_category")}
            {...getFieldProps("productCategoryID")}
            field={{
              id: "productCategoryID",
              getListUrl: Urls.data_productcategory,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange({
                productCategoryID: data.value,
                productCategory: data.label,
              });
            }}
          />
        </div>
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("product")}
            {...getFieldProps("productID")}
            field={{
              id: "productID",
              getListUrl: Urls.data_products,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange({
                productID: data.value,
                product: data.label,
              });
            }}
          />
        </div>
        <div className="col-span-1">
          <ERPDataCombobox
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
          />
        </div>
      </div>
    </div>
  );
};
export default LPOReportFilter;
export const LPOReportFilterInitialState = {
  supplierID: -1,
  productID: -1,
  productGroupID: -1,
  productCategoryID: -1,
};
