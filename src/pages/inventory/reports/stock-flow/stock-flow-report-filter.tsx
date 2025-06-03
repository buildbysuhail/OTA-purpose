import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import moment from "moment";
import Urls from "../../../../redux/urls";

const StockFlowReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')

  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("dateFrom")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          />
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("dateTo")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
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
            handleFieldChange("productID", data.value);
          }}
          showCheckbox={true}
        />

        <ERPInput
          label={t("product_code")}
          {...getFieldProps("productCode")}
          className="w-full"
          onChangeData={(val: string) => handleFieldChange("productCode", val)}
        />

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
            handleFieldChange("productGroupID", data.value);
          }}
          showCheckbox={true}
        />

        <ERPDataCombobox
          label={t("warehouse")}
          {...getFieldProps("warehouseID")}
          field={{
            id: "warehouseID",
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("warehouseID", data.value);
          }}
          showCheckbox={true}
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
            handleFieldChange("brandID", data.value);
          }}
          showCheckbox={true}
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
          showCheckbox={true}
        />
      </div>
    </div>
  );
}

export default StockFlowReportFilter;
export const StockFlowReportFilterInitialState = {
  dateFrom: moment().local().startOf("month").toDate(),
  dateTo: moment().local().toDate(),
  productID: 0,
  productGroupID: 0,
  warehouseID: 0,
  brandID: 0,
  sectionID: 0
};