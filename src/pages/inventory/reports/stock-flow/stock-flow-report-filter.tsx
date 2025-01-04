import { useTranslation } from "react-i18next";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";

const StockFlowFilter = ({ getFieldProps, handleFieldChange }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 space-y-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="flex items-center gap-4">
          <ERPCheckbox
            className=""
            {...getFieldProps("isWarehouse")}
            label={t("warehouse")}
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
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-4">
          <ERPDateInput
            className="basis-1/2"
            {...getFieldProps("dateFrom")}
            label={t("from")}
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          />
          <ERPDateInput
            className="basis-1/2"
            {...getFieldProps("dateTo")}
            label={t("to")}
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>
        <div className="flex items-center justify-center space-x-8 space-4">
          <ERPButton
            title={t("set_date")}
            // onClick={saveThemeChange}
            variant="primary">
          </ERPButton>
          <ERPCheckbox
            className=""
            {...getFieldProps("showOpeningStock")}
            label={t("showOpeningStock")}
            onChangeData={(data) => handleFieldChange('showOpeningStock', data.showOpeningStock)}
          />
        </div>
      </div>
    </div>
  );
}
export default StockFlowFilter;
export const StockFlowFilterInitialState = {
  isWarehouse: false,
  isBatchWiseBarcode: false,
  showOpeningStock: true,
  wareHouse: "",
  batchWiseBarcode: "",
  product: "",
  dateFrom: new Date(),
  dateTo: new Date(),
};