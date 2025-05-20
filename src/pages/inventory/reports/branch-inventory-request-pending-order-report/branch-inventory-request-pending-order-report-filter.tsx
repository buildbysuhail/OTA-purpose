import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import moment from "moment";

const BranchInventoryRequestPendingOrderFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDate")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDate")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
        <div className="col-span-1">
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
          />
        </div>

        <div className="col-span-1">
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
          />
        </div>
      </div>

      <div className="col-span-1">
        <ERPCheckbox
          id="showPendingOnly"
          {...getFieldProps("showPendingOnly")}
          label={t("show_pending_only")}
          checked={formState.showPendingOnly}
          onChange={(e) => handleFieldChange("showPendingOnly", e.target.checked)}
        />
      </div>
    </div>
  );
}
export default BranchInventoryRequestPendingOrderFilter;
export const BranchInventoryRequestPendingOrderFilterInitialState = {
  fromDate: moment().subtract(3, 'months').startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  productID: 0,
  productGroupID: 0,
  showPendingOnly: true,
};