import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../redux/urls";

const InventoryStatusFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden p-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1">
          <ERPDateInput
            label={t("from")}
            {...getFieldProps("dateFrom")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to")}
            {...getFieldProps("dateTo")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>
      </div>
      <ERPDataCombobox
        label={t("transaction_type")}
        {...getFieldProps("voucherType")}
        options={[
          { value: "SI", label: "Sales Invoice" },
          { value: "SR", label: "Sales Return" },
          { value: "PI", label: "Purchase Invoice" },
          { value: "PR", label: "Purchase Return" },
          { value: "SO", label: "Sales Order" },
          { value: "SQ", label: "Sales Quotation" },
          { value: "GD", label: "Goods Delivery" },
          { value: "DR", label: "Goods Delivery Return" },
          { value: "GRN", label: "Goods Receipt" },
          { value: "GRR", label: "Goods Receipt Return" },
          { value: "PO", label: "Purchase Order" },
          { value: "ILR", label: "Item Load Request" }
        ]}
        className="max-w-[297px]"
        onSelectItem={(data) => {
          handleFieldChange("voucherType", data.voucherType);
        }}
      />
    </div>
  );
}
export default InventoryStatusFilter;
export const InventoryStatusFilterInitialState = {
  dateFrom: moment().local().toDate(),
  dateTo: moment().local().toDate(),
  voucherType: "",
};