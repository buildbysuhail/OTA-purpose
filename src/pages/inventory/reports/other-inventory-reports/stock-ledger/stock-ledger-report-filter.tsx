import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import moment from "moment";
import Urls from "../../../../../redux/urls";
import ErpInput from "../../../../../components/ERPComponents/erp-input";

const StockLedgerFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");

  const handleSetDate = () => {
    const today = moment().local();
    handleFieldChange("fromDate", today.clone().startOf("month").toDate());
    handleFieldChange("toDate", today.clone().endOf("day").toDate());
  };

  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      <div className="flex flex-col lg:flex-row md:flex-row items-end gap-4">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="max-w-[150px]"
          onChangeData={(data: any) =>
            handleFieldChange("fromDate", data.fromDate)
          }
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="max-w-[150px]"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
        <div>
          <ERPButton
            title={t("set_date")}
            onClick={handleSetDate}
            variant="primary"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <ERPDataCombobox
          label={t("product")}
          {...getFieldProps("id")}
          field={{
            id: "id",
            getListUrl: Urls.data_products,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              id: data.value,
              product: data.label,
            });
          }}
          className="w-full"
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
            handleFieldChange({
              wareHouseID: data.value,
              wareHouse: data.label,
            });
          }}
          className="w-full"
        />
         <div>
        <ERPCheckbox
          id="showBatchWise"
          {...getFieldProps("showBatchWise")}
          label={t("batchwise")}
          onChangeData={(data) =>
            handleFieldChange("showBatchWise", data.showBatchWise)
          }
        />
        <ErpInput
         noLabel={true}
          type="number"
          placeholder={t("auto_barcode")}
          disabled={getFieldProps("showBatchWise").value != true}
          {...getFieldProps("autobarcode")}
          onChange={(e: any) => {
            handleFieldChange("autobarcode", e.target.value);
          }}
        />
      </div>
      </div>
     
      <div className="grid grid-cols-1 gap-2">
        <ERPCheckbox
          id="showOpeningStock"
          {...getFieldProps("showOpeningStock")}
          label={t("show_opening_stock")}
          onChangeData={(data) =>
            handleFieldChange("showOpeningStock", data.showOpeningStock)
          }
        />
      </div>
    </div>
  );
};

export default StockLedgerFilter;
export const StockLedgerFilterInitialState = {
  fromDate: new Date(),
  toDate: new Date(),
  id: 0,
  warehouseID: -1,
  showBatchWise: false,
  autobarcode: "",
  showOpeningStock: true,
};
