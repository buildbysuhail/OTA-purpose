import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";
import Urls from "../../../../../redux/urls";
import ErpInput from "../../../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../../../components/ERPComponents/erp-radio";
import { LedgerType } from "../../../../../enums/ledger-types";

const StockSummaryFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-2 md:gap-4">

      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4">
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

        <ERPDataCombobox
          label={t("brand")}
          {...getFieldProps("brandID")}
          field={{
            id: "brandID",
            getListUrl: Urls.data_brands,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              brandID: data.value,
              brand: data.label,
            });
          }}
        />

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

        <ERPDataCombobox
          label={t("product_code")}
          {...getFieldProps("productCode")}
          field={{
            id: "productCode",
            getListUrl: Urls.data_productsCode,
            valueKey: "name",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("productCode", data.value);
          }}
        />

        <ErpInput
          label={t("barcode")}
          {...getFieldProps("barcode")}
          onChange={(e: any) => {
            handleFieldChange("barcode", e.target.value);
          }}
        />

        <ERPDataCombobox
          label={t("warehouse")}
          {...getFieldProps("wareHouseID")}
          field={{
            id: "wareHouseID",
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              wareHouseID: data.value,
              wareHouse: data.label,
            });
          }}
        />

        <ERPDataCombobox
          label={t("supplier")}
          {...getFieldProps("supplierID")}
          field={{
            id: "supplierID",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
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

        <ERPDataCombobox
          label={t("group_category")}
          {...getFieldProps("groupCategoryID")}
          field={{
            id: "groupCategoryID",
            getListUrl: Urls.data_groupcategory,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("groupCategoryID", data.value);
          }}
        />

        <ERPDataCombobox
          label={t("section")}
          {...getFieldProps("sectionID")}
          field={{
            id: "sectionID",
            getListUrl: Urls.data_sections,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("sectionID", data.value);
          }}
        />

        <ERPDataCombobox
          label={t("location")}
          {...getFieldProps("location")}
          field={{
            id: "location",
            getListUrl: Urls.data_locations,
            valueKey: "name",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              location: data.value,
            });
          }}
        />

        <ERPDataCombobox
          label={t("stock_value")}
          {...getFieldProps("valuationUsing")}
          field={{
            id: "valuationUsing",
            getListUrl: Urls.data_stock_valuation_methods,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              valuationUsing: data.value,
              valuationUsingName: data.label,
            });
          }}
        />
        <ERPDateInput
          label={t("as_on_date")}
          {...getFieldProps("asOnDate")}
          className="w-full"
          onChangeData={(data: any) =>
            handleFieldChange("asOnDate", data.asOnDate)
          }
        />
        <ERPCheckbox
          id="showBatchWise"
          {...getFieldProps("showBatchWise")}
          label={t("show_batch_wise")}
          onChangeData={(data) =>
            handleFieldChange("showBatchWise", data.showBatchWise)
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 p-4 rounded-md border border-gray-200">
        <ERPRadio
          id="all"
          name="stockFilter"
          value="all"
          label={t("all_stock")}
          checked={getFieldProps("stockFilter").value == "all"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
        />
        <ERPRadio
          id="zero"
          name="stockFilter"
          value="zero"
          label={t("zero_stock")}
          checked={getFieldProps("stockFilter").value == "zero"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
        />
        <ERPRadio
          id="positive"
          name="stockFilter"
          value="positive"
          label={t("positive_stock")}
          checked={getFieldProps("stockFilter").value == "positive"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
          className="items-center"
        />
        <ERPRadio
          id="negative"
          name="stockFilter"
          value="negative"
          label={t("negative_stock")}
          checked={getFieldProps("stockFilter").value == "negative"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
          className="items-center"
        />
        <ERPRadio
          id="maxStock"
          name="stockFilter"
          value="maxStock"
          label={t("above_max_stock")}
          checked={getFieldProps("stockFilter").value == "maxStock"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
          className="items-center"
        />
        <ERPRadio
          id="minStock"
          name="stockFilter"
          value="minStock"
          label={t("below_min_stock")}
          checked={getFieldProps("stockFilter").value == "minStock"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
          className="items-center"
        />
        <ERPRadio
          id="reorderlevel"
          name="stockFilter"
          value="reorderlevel"
          label={t("below_reorder_level")}
          checked={getFieldProps("stockFilter").value == "reorderlevel"}
          onChange={(e) => handleFieldChange("stockFilter", e.target.value)}
          className="items-center"
        />
      </div>
    </div>
  );
};

export default StockSummaryFilter;
export const StockSummaryFilterInitialState = {
  asOnDate: moment().local().toDate(),
  productGroupID: -1,
  productID: -1,
  brandID: -1,
  productCategoryID: -1,
  wareHouseID: -1,
  supplierID: -1,
  valuationUsing: "SPP",
  showBatchWise: true, //Settings.InventorySettings.BatchCriteria == "NB") chkBatchWise.Checked = true
  barcode: "",
  productCode: "",
  groupCategoryID: -1,
  sectionID: -1,
  location: "",
  stockFilter: "all",
  ismultiSelect: false,
  isProductwithimage: false,
  showServerStock: false, //visible true on maintainsynchronization and issyncserverdb==false
  listedItems: [],
};
