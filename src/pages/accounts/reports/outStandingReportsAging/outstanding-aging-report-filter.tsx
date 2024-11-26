
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../components/ERPComponents/erp-input";


const OutstandingAgingReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Route Name Combobox */}
        <ERPDataCombobox
          {...getFieldProps("salesRouteID")}
          label={t("route_name")}
          field={{
            id: "salesRouteID",
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('salesRouteID', data.salesRouteID)}
        />
        {/* Party Category Combobox */}
        <ERPDataCombobox
          {...getFieldProps("partyCategoryID")}
          label={t("party_category")}
          field={{
            id: "partyCategoryID",
            getListUrl: Urls.data_party_categories,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('partyCategoryID', data.partyCategoryID)}
        />

        {/* Cost Centre Combobox */}
        <ERPDataCombobox
          {...getFieldProps("costCentreID")}
          label={t("Cost Centre")}
          field={{
            id: "costCentreID",
            getListUrl: Urls.data_costcentres,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('costCentreID', data.costCentreID)}
        />

        {/* As On Date */}
        <ERPDateInput
          {...getFieldProps("asonDate")}
          label={t("As On Date")}
          onChangeData={(data: any) => handleFieldChange("asonDate", data.asonDate)}
        />

        {/* Periods Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ErpInput
            {...getFieldProps("p1")}
            label={t("Period 1")}
            type="number"
            onChangeData={(data: any) => handleFieldChange("p1", data.p1)}
          />
          <ErpInput
            {...getFieldProps("p2")}
            label={t("Period 2")}
            type="number"
            onChangeData={(data: any) => handleFieldChange("p2", data.p2)}
          />
          <ErpInput
            {...getFieldProps("p3")}
            label={t("Period 3")}
            type="number"
            onChangeData={(data: any) => handleFieldChange("p3", data.p3)}
          />
          <ErpInput
            {...getFieldProps("p4")}
            label={t("Period 4")}
            type="number"
            onChangeData={(data: any) => handleFieldChange("p4", data.p4)}
          />
          <ErpInput
            {...getFieldProps("p5")}
            label={t("Period 5")}
            type="number"
            onChangeData={(data: any) => handleFieldChange("p5", data.p5)}
          />
          <ErpInput
            {...getFieldProps("p6")}
            label={t("Period 6")}
            type="number"
            onChangeData={(data: any) => handleFieldChange("p6", data.p6)}
          />
        </div>

        {/* Load Defaults Checkbox */}
        <ERPCheckbox
          {...getFieldProps("loadDefaults")}
          label={t("Load Defaults")}
          onChangeData={(data: any) => handleFieldChange("loadDefaults", data.loadDefaults)}
        />
      </div>
    </div>
  );
}
export default OutstandingAgingReportFilter;
export const OutstandingAgingReportFilterInitialState = {
  asonDate: new Date(),
  salesRouteID: -1,
  partyCategoryID: -1,
  costCenterID: -1,
  p1: 30,
  p2: 60,
  p3: 90,
  p4: 120,
  p5: 150,
  p6: 180,
  loadDefaults:false,
};