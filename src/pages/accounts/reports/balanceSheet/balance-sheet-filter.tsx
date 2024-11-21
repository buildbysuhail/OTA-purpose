import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";



const BalanceSheetFilter = ({ getFieldProps, handleFieldChange, t }: any) => (

  <div className="grid grid-cols-1 gap-4">
        {/* As On Date */}
        <ERPDateInput
          {...getFieldProps("asOnDate")}
          label={t("As On Date")}
          onChangeData={(data: any) => handleFieldChange("asOnDate", data.asOnDate)}
        />

        {/* Stock Value Dropdown */}
        <ERPDataCombobox
          {...getFieldProps("stockValue")}
          label={t("Stock Value")}
          field={{
            id: "stockValue",
            getListUrl: Urls.data_stock_valuation_methods,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange({stockValue: data.stockValue})}
        />

        {/* Closing Stock Input */}
        <ERPInput
          {...getFieldProps("closingStock")}
          label={t("Closing Stock")}
          type="number"
          value="0.00"
          onChangeData={(data) => handleFieldChange('closingStock', data.closingStock)}
        />

        {/* Show Vertical Checkbox */}
        <ERPCheckbox
          {...getFieldProps("showVertical")}
          label={t("Show Vertical")}
          onChangeData={(data) => handleFieldChange('showVertical', data.showVertical)}
        />
      </div>


);
export default BalanceSheetFilter;
export const BalanceSheetFilterInitialState = {
  asOnDate: new Date(), 
  stockValue:"SPP",
  closingStock: 0,
  showVertical: false, 
};