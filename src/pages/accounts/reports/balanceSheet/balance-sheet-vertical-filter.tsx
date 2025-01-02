import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";

// interface BalanceSheetVerticalFilterProps {
//   getFieldProps: (fieldName: string) => any;
//   handleFieldChange: (field: string | object, value?: any) => void;
// }

// interface BalanceSheetVerticalFilterState {
//   asOnDate: Date;
//   valuationUsing: string;
//   closingStock: number;
// }

// const BalanceSheetVerticalFilter: React.FC<BalanceSheetVerticalFilterProps> = ({
//   getFieldProps,
//   handleFieldChange,
// }) => {
  const BalanceSheetVerticalFilter = ({ getFieldProps, handleFieldChange, t }: any) => {
    return (
  // const { t } = useTranslation('accountsReport');

  // return (
    <div className="grid grid-cols-1 gap-4">
      <ERPDateInput
        {...getFieldProps("asOnDate")}
        label={t("as_on_date")}
        onChangeData={(data: { asOnDate: Date }) =>
          handleFieldChange("asOnDate", data.asOnDate)
        }
      />

      <ERPDataCombobox
        {...getFieldProps("valuationUsing")}
        label={t("stock_value")}
        field={{
          id: "valuationUsing",
          getListUrl: Urls.data_stock_valuation_methods,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: { valuationUsing: string }) =>
          handleFieldChange("valuationUsing", data.valuationUsing)
        }
      />

      <ERPInput
        {...getFieldProps("closingStock")}
        label={t("closing_stock")}
        type="number"
        defaultValue="0.00"
        onChangeData={(data: { closingStock: number }) =>
          handleFieldChange("closingStock", data.closingStock)
        }
      />

      {/* Commented out but kept for reference
      <ERPCheckbox
        {...getFieldProps("showVertical")}
        label={t("show_vertical")}
        onChangeData={(data: { showVertical: boolean }) => 
          handleFieldChange("showVertical", data.showVertical)
        }
      /> 
      */}
    </div>
  );
};

export default BalanceSheetVerticalFilter;

export const BalanceSheetVerticalFilterInitialState= {
  asOnDate: new Date(),
  valuationUsing: "SPP",
  closingStock: 0
  // showVertical: true,
};