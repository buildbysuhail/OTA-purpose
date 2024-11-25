
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";


const BillwiseProfitReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
      <div className="grid grid-cols-2 gap-4">
      {/* Date Range */} 
      <div className="flex gap-4">
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("Date From")}
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("Date To")}
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>

      {/* Product Selection
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("productGroupEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("productGroupId")}
          label={t("Product Group")}
          field={{
            id: "productGroupId",
            getListUrl: Urls.data_productgroup,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('productGroupId', data.productGroupId)}
        />
      {/* </div> */}

      {/* <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("productEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("productId")}
          label={t("Product")}
          field={{
            id: "productId",
            getListUrl: Urls.data_products,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('productId', data.productId)}
        />
      {/* </div> */}

      {/* Customer Selection */}
      {/* <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("customersEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("partyID")}
          label={t("Customers")}
          field={{
            id: "partyID",
            getListUrl: Urls.data_CustSupp,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('partyID', data.partyID)}
        />
      {/* </div> */}

      {/* Sales Related Fields
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("salesManEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("salesmanID")}
          label={t("Sales Man")}
          field={{
            id: "salesmanID",
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('salesmanID', data.salesmanID)}
        />
      {/* </div> */}

      {/* <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("salesRouteEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("salesRouteID")}
          label={t("Sales Route")}
          field={{
            id: "salesRouteID",
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('salesRouteID', data.salesRouteID)}
        />
      {/* </div> */}

      {/* Product Attributes
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("brandEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("brandID")}
          label={t("Brand")}
          field={{
            id: "brandID",
            getListUrl: Urls.data_brands,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('brandID', data.brandID)}
        />
      {/* </div> */}

      {/* <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("colourEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("colour")}
          label={t("Colour")}
          field={{
            id: "colour",
            getListUrl: Urls.data_color,
            valueKey: "name",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('colour', data.colour)}
        />
      {/* </div>

      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("warrantyEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("warranty")}
          label={t("Warranty")}
          field={{
            id: "warranty",
            getListUrl: Urls.data_warranty,
            valueKey: "name",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('warranty', data.warranty)}
        />
      {/* </div>
      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("warehouseEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("warehouse")}
          label={t("Warehouse")}
          field={{
            id: "warehouse",
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('warehouse', data.warehouse)}
        />
      {/* </div>

      <div className="flex items-center gap-2">
        <ERPCheckbox
          {...getFieldProps("groupCategoryEnabled")}
          label=""
        /> */}
        <ERPDataCombobox
          {...getFieldProps("groupCategoryID")}
          label={t("Group Category")}
          field={{
            id: "groupCategoryID",
            getListUrl: Urls.data_groupcategory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('groupCategoryID', data.groupCategoryID)}
        />
      {/* </div>  */}
        <ERPDataCombobox
          {...getFieldProps("sectionID")}
          label={t("Section")}
          field={{
            id: "sectionID",
            getListUrl: Urls.data_sections,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('sectionID', data.sectionID)}
        />

      {/* Additional Options */}
      <div className="space-y-2">
        <ERPCheckbox
          {...getFieldProps("useAvgPrice")}
          label={t("Set Cost as Avg Price")}
          onChangeData={(data) => handleFieldChange('useAvgPrice', data.useAvgPrice)}
        />
        
        <div className="flex gap-4">
          <ERPCheckbox
            {...getFieldProps("showFifoRate")}
            label={t("Set Cost as FIFO Avg Price")}
            onChangeData={(data) => handleFieldChange('showFifoRate', data.showFifoRate)}
          />
          
          <ERPCheckbox
            {...getFieldProps("includeVATinProfit")}
            label={t("Include VAT in Profit")}
            onChangeData={(data) => handleFieldChange('includeVATinProfit', data.includeVATinProfit)}
          />
        </div>
        
        <ERPCheckbox
          {...getFieldProps("showFast")}
          label={t("Show Fast")}
          onChangeData={(data) => handleFieldChange('showFast', data.showFast)}
        />
      </div>
          <ERPCheckbox
            {...getFieldProps("isconsiderSE")}
            label={t("Consider SE")}
            onChangeData={(data) => handleFieldChange('isconsiderSE', data.isconsiderSE)}
          />
    </div>
);
}
export default BillwiseProfitReportFilter;
export const BillwiseProfitReportFilterInitialState = {
  fromDate: new Date(), 
  toDate: new Date(), 
  productGroupId: -1,
  productId: -1, 
  partyID: -1, 
  salesmanID: -1, 
  salesRouteID: -1, 
  brandID: -1,
  colour: "", 
  warranty: "", 
  warehouse: -1, 
  groupCategoryID: -1, 
  sectionID: -1, 
  useAvgPrice: false, 
  showFifoRate: false,
  includeVATinProfit: false, 
  showFast: false, 
  isconsiderSE: false, 
};