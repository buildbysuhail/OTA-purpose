import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import moment from "moment";
import Urls from "../../../../../redux/urls";

const ItemUsedForServiceFilter = ({ getFieldProps, handleFieldChange, formState, }: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDate")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("fromDate", data.fromDate)
            }
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to_date")}
            {...getFieldProps("toDate")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("toDate", data.toDate)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
        <div className="col-span-1">
          <ERPDataCombobox
            label={t("products")}
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

        <div className="col-span-1">
          <ERPDataCombobox
            label={t("service")}
            {...getFieldProps("serviceID")}
            field={{
              id: "serviceID",
              getListUrl: Urls.data_services,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("serviceID", data.value);
            }}
          />
        </div>
      </div>

      <div className="col-span-1">
        <label>{t("warranty_service")}</label>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="isWarrantyService"
              value="Y"
              checked={getFieldProps("isWarrantyService").value == "Y"}
              onChange={(e) =>
                handleFieldChange("isWarrantyService", e.target.value)
              }
              className="form-radio"
            />
            <span className="ml-2">{t("yes")}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="isWarrantyService"
              value="N"
              checked={getFieldProps("isWarrantyService").value == "N"}
              onChange={(e) =>
                handleFieldChange("isWarrantyService", e.target.value)
              }
              className="form-radio"
            />
            <span className="ml-2">{t("no")}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="isWarrantyService"
              value="B"
              checked={getFieldProps("isWarrantyService").value == "B"}
              onChange={(e) =>
                handleFieldChange("isWarrantyService", e.target.value)
              }
              className="form-radio"
            />
            <span className="ml-2">{t("both")}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ItemUsedForServiceFilter;

export const ItemUsedForServiceFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  productID: -1,
  productGroupID: -1,
  serviceID: -1,
  isWarrantyService: "B",
};
