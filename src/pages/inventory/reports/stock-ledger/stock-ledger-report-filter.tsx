import { useTranslation } from "react-i18next";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";

const StockLedgerFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport');
  return (
    <div className="grid grid-cols-1 space-y-4 ps-1">
      <ERPDataCombobox
        {...getFieldProps("product")}
        label={t("product")}
        field={{
          id: "product",
          getListUrl: Urls.data_acc_groups,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data) => handleFieldChange('product', data.product)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ps-1 items-center">
        <div className="flex flex-col items-start gap-2">
          <ERPCheckbox
            className=""
            {...getFieldProps("isWarehouse")}
            label={t("Warehouse")}
            onChangeData={(data) => handleFieldChange('isWarehouse', data.isWarehouse)}
          />

          <ERPDataCombobox
            className="w-full"
            {...getFieldProps("wareHouse")}
            noLabel
            field={{
              id: "wareHouse",
              getListUrl: Urls.data_acc_groups,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data) => handleFieldChange('wareHouse', data.brand)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <ERPCheckbox
            className=""
            {...getFieldProps("isBatchWiseBarcode")}
            label={t("batch_wise_barcode")}
            onChangeData={(data) => handleFieldChange('isBatchWiseBarcode', data.isBatchWiseBarcode)}
          />

          <ErpInput
            className="w-full"
            {...getFieldProps("batchWiseBarcode")}
            noLabel
            onChangeData={(data) => handleFieldChange('batchWiseBarcode', data.batchWiseBarcode)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-4">
        <ERPDateInput
          className="basis-1/2"
          {...getFieldProps("dateFrom")}
          label={t("From")}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
        />

        <ERPDateInput
          className="basis-1/2"
          {...getFieldProps("dateTo")}
          label={t("To")}
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
        />

        <div className="mt-4">
          <ERPButton
            title="Set Date"
            variant="primary"
          />
        </div>

        <ERPCheckbox
          className="text-left"
          {...getFieldProps("showOpeningStock")}
          label={t("showOpeningStock")}
          onChangeData={(data) => handleFieldChange('showOpeningStock', data.showOpeningStock)}
        />
      </div>
    </div>
  );
}
export default StockLedgerFilter;
export const StockLedgerFilterInitialState = {
  isWarehouse: false,
  isBatchWiseBarcode: false,
  showOpeningStock: true,
  wareHouse: "",
  batchWiseBarcode: "",
  product: "",
  dateFrom: new Date(),
  dateTo: new Date(),
};