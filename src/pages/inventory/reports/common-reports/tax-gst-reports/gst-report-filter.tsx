import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../../redux/urls";
import ERPInput from "../../../../../components/ERPComponents/erp-input";

const GstReportFilter = ({ getFieldProps, handleFieldChange, formState, }: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1 gap-2 md:gap-4 overflow-y-auto overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
          <ERPDateInput
            label={t("date_from")}
            {...getFieldProps("fromDate")}
            className="w-full"
            datatype="date"
            onChangeData={(data: any) =>
              handleFieldChange("fromDate", data.fromDate)
            }
          />
          <ERPDateInput
            label={t("date_to")}
            {...getFieldProps("toDate")}
            className="w-full"
            datatype="date"
            onChangeData={(data: any) =>
              handleFieldChange("toDate", data.toDate)
            }
          />
          <ERPCheckbox
            {...getFieldProps("isTransactionDate")}
            label={t("trans_date")}
            datatype="number"
            className="min-w-[150px]"
            onChangeData={(data) =>
              handleFieldChange("isTransactionDate", data.isTransactionDate)
            }
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-end gap-4">
        <ERPInput
          {...getFieldProps("gSTPerc")}
          label={t("gst_percentage")}
          className="w-32"
          placeholder="0.00"
          type="number"
          onChangeData={(data) => handleFieldChange("gSTPerc", data.gSTPerc)}
        />
        {/* always visible false now */}
        {/* {(location.pathname.includes("inventory/sales_gst_sales_and_return") ||
          location.pathname.includes(
            "inventory/sales_gst_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/sales_gst_adv_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/sales_return_gst_sales_and_return"
          ) ||
          location.pathname.includes(
            "inventory/sales_return_gst_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/sales_return_gst_adv_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_gst_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_gst_adv_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_return_gst_sales_and_return_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_return_gst_register_format_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_return_gst_adv_register_format_report"
          )) && (
          <div className="grid grid-cols-1 gap-4">
            <ERPRadio
              id="rdbCash"
              name="cashBank"
              value="rdbCash"
              label={t("cash")}
              checked={getFieldProps("cashBank").value == true}
              onChange={(e) => handleFieldChange("cashBank", e.target.value)}
            />
            <ERPRadio
              id="rdbBank"
              name="cashBank"
              value="rdbBank"
              label={t("bank")}
              checked={getFieldProps("cashBank").value == true}
              onChange={(e) => handleFieldChange("cashBank", e.target.value)}
            />
          </div>
        )} */}
        {/* <ERPDataCombobox
          {...getFieldProps("taxCategoryID")}
          field={{
            id: "taxCategoryID",
            getListUrl: Urls.data_taxCategory,
            valueKey: "id",
            labelKey: "name",
          }}
          className="w-full"
          onSelectItem={(data) => {
            handleFieldChange({
              taxCategoryID: data.value,
              taxCategory: (data.value)?.toString(),
            });
          }}
        /> */}
        <div className="flex items-end gap-2">
          <ERPCheckbox
            {...getFieldProps("isVchForm")}
            label={t("")}
            noLabel
            onChangeData={(data) =>
              handleFieldChange("isVchForm", data.isVchForm)
            }
          />
          <ERPDataCombobox
            {...getFieldProps("isVchForm")}
            label={t("voucher_form")}
            field={{
              id: "isVchForm",
              getListUrl: Urls.data_form_type,
              valueKey: "id",
              labelKey: "name",
            }}
            disabled={getFieldProps("isVchForm").value != true}
            className="w-full"
            onSelectItem={(data) => {
              handleFieldChange({
                voucherFormId: data.value,
                voucherForm: data.label,
              });
            }}
          />
        </div>

        <ERPCheckbox
          {...getFieldProps("excludeNA")}
          label={t("exclude_na")}
          onChangeData={(data) =>
            handleFieldChange("excludeNA", data.excludeNA)
          }
        />
      </div>
    </div>
  );
};

export default GstReportFilter;
export const GstReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  gSTPerc: null,
  isVchForm: false,
  voucherForm: "",
  isTransactionDate: false,
  taxCategory: "",
  excludeNA: false,
  // rdbCash: false,
  // rdbBank: false,
  //ref date not passing only showing in purchase so hided
};
