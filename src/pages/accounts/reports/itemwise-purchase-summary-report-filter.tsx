import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import Urls from "../../../redux/urls"
import { useTranslation } from "react-i18next"
import moment from "moment"

const  ItemwisePurchaseSummaryReportFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation("accountsReport")

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="flex items-center gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>

      {/* Product Group Selection */}
      <ERPDataCombobox
        {...getFieldProps("productGroupID")}
        label={t("product_group")}
        field={{
          id: "productGroupID",
          getListUrl: Urls.data_productgroup,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ productGroupID: data.value, ProductGroupName: data.label })}
      />

      {/* Brand Selection */}
      <ERPDataCombobox
        {...getFieldProps("brandID")}
        label={t("brand")}
        field={{
          id: "brandID",
          getListUrl: Urls.data_brands,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ brandID: data.value, BrandName: data.label })}
      />

      {/* Product Selection */}
      <ERPDataCombobox
        {...getFieldProps("productID")}
        label={t("product")}
        field={{
          id: "productID",
          getListUrl: Urls.data_products,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ productID: data.value, ProductName: data.label })}
      />

      {/* Sales Route Selection */}
      <ERPDataCombobox
        {...getFieldProps("salesRouteID")}
        label={t("sales_route")}
        field={{
          id: "salesRouteID",
          getListUrl: Urls.salesRoute,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ salesRouteID: data.value, SalesRouteName: data.label })}
      />

      {/* Salesman Selection */}
      <ERPDataCombobox
        {...getFieldProps("salesmanID")}
        label={t("salesman")}
        field={{
          id: "salesmanID",
          getListUrl: Urls.data_salesmanID,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ salesmanID: data.value, SalesmanName: data.label })}
      />

      {/* Warehouse Selection */}
      <ERPDataCombobox
        {...getFieldProps("warehouseID")}
        label={t("warehouse")}
        field={{
          id: "warehouseID",
          getListUrl: Urls.data_warehouse,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ warehouseID: data.value, WarehouseName: data.label })}
      />

      {/* Party Selection */}
      <ERPDataCombobox
        {...getFieldProps("partyID")}
        label={t("party")}
        field={{
          id: "partyID",
          getListUrl: Urls.data_parties,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ partyID: data.value, PartyName: data.label })}
      />

      {/* Supplier Selection */}
      <ERPDataCombobox
        {...getFieldProps("supplierID")}
        label={t("supplier")}
        field={{
          id: "supplierID",
          getListUrl: Urls.data_CustSupp,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ supplierID: data.value, SupplierName: data.label })}
      />

      {/* Group Category Selection */}
      <ERPDataCombobox
        {...getFieldProps("groupCategoryID")}
        label={t("group_category")}
        field={{
          id: "groupCategoryID",
          getListUrl: Urls.data_groupcategory,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ groupCategoryID: data.value, GroupCategoryName: data.label })}
      />

      {/* Section Selection */}
      <ERPDataCombobox
        {...getFieldProps("sectionID")}
        label={t("section")}
        field={{
          id: "sectionID",
          getListUrl: Urls.data_sections,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ sectionID: data.value, SectionName: data.label })}
      />

      {/* Product Code Selection */}
      <ERPDataCombobox
        {...getFieldProps("productCode")}
        label={t("product_code")}
        field={{
          id: "productCode",
          getListUrl: Urls.data_productCode,
          params: "",
          valueKey: "code",
          labelKey: "code",
          nameKey: "description",
        }}
        onSelectItem={(data) => handleFieldChange({ productCode: data.value })}
      />

      {/* To Branch Selection */}
      <ERPDataCombobox
        {...getFieldProps("toBranchID")}
        label={t("to_branch")}
        field={{
          id: "toBranchID",
          getListUrl: Urls.data_toBranchID,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ toBranchID: data.value, ToBranchName: data.label })}
      />

      {/* To Warehouse Selection */}
      <ERPDataCombobox
        {...getFieldProps("toWarehouseID")}
        label={t("to_warehouse")}
        field={{
          id: "toWarehouseID",
          getListUrl: Urls.data_warehouse,
          params: "",
          valueKey: "id",
          labelKey: "name",
          nameKey: "alias",
        }}
        onSelectItem={(data) => handleFieldChange({ toWarehouseID: data.value, ToWarehouseName: data.label })}
      />

      {/* location Selection */}
      <ERPDataCombobox
        {...getFieldProps("location")}
        label={t("location")}
        field={{
          id: "location",
          getListUrl: Urls.data_location,
          params: "",
          valueKey: "code",
          labelKey: "name",
          nameKey: "description",
        }}
        onSelectItem={(data) => handleFieldChange({ location: data.value, LocationName: data.label })}
      />
    </div>
  )
}

export default  ItemwisePurchaseSummaryReportFilter

// Initial state to match C# property names
export const ItemwisePurchaseSummaryReportFilterInitialState = {
  fromDate: moment().local().subtract(30, "days").toDate(),
  toDate: new Date(),
  productGroupID: 0,
  brandID: 0,
  productID: 0,
  salesRouteID: 0,
  salesmanID: 0,
  warehouseID: 0,
  partyID: 0,
  supplierID: 0,
  groupCategoryID: 0,
  sectionID: 0,
  productCode: "",
  toBranchID: 0,
  toWarehouseID: 0,
  location: ""
}