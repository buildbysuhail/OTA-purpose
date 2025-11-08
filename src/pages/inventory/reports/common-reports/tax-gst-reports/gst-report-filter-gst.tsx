import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../../redux/urls";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPMultiSelect from "../../../../../components/ERPComponents/erp-multi-select";

const GstReportFilterGstCat = ({ getFieldProps, handleFieldChange, formState, }: any) => {
  const { t } = useTranslation("accountsReport");

  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
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

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 items-end gap-4">
        <ERPInput
          {...getFieldProps("gSTPerc")}
          label={t("gst_percentage")}
          className="w-32"
          placeholder="0.00"
          type="number"
          onChangeData={(data) => handleFieldChange("gSTPerc", data.gSTPerc)}
        />
        {/* visible false now */}
        {/* {(location.pathname.includes(
          "inventory/sales_gst_daily_summary_report"
        ) ||
          location.pathname.includes("inventory/sales_gst_detailed_report") ||
          location.pathname.includes(
            "inventory/sales_gst_monthly_summary_report"
          ) ||
          location.pathname.includes(
            "inventory/sales_return_gst_daily_summary_report"
          ) ||
          location.pathname.includes(
            "inventory/sales_return_gst_detailed_report"
          ) ||
          location.pathname.includes(
            "inventory/sales_return_gst_monthly_summary_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_gst_daily_summary_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_gst_detailed_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_gst_monthly_summary_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_return_gst_daily_summary_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_return_gst_detailed_report"
          ) ||
          location.pathname.includes(
            "inventory/purchase_return_gst_monthly_summary_report"
          )) && (
          <div className="grid grid-cols-1 gap-4">
            <ERPRadio
              id="rdbCash"
              name="cashBank"
              value="rdbCash"
              label={t("cash")}
              checked={getFieldProps("cashBank").value == "rdbCash"}
              onChange={(e) => handleFieldChange("cashBank", "rdbCash")}
            />
            <ERPRadio
              id="rdbBank"
              name="cashBank"
              value="rdbBank"
              label={t("bank")}
              checked={getFieldProps("cashBank").value == "rdbBank"}
              onChange={(e) => handleFieldChange("cashBank", "rdbBank")}
            />
          </div>
        )} */}
        {/* <ERPDataCombobox
          {...getFieldProps("taxCategoryID")} 
          label="taxCategory"
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
            {...getFieldProps("voucherFormId")}
            label={t("voucher_form")}
            field={{
              id: "voucherFormId",
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
        <ERPMultiSelect
          {...getFieldProps("taxCategory")}
          label={t("gst_category")}
          optionUrl={Urls.data_taxCategory}
          selectedValues={getFieldProps("taxCategory").value}
          onChange={(data) => handleFieldChange("taxCategory", data)}
          placeholder={t("select_gst_category")}
          searchPlaceholder={t("search_gst_category")}
          outputFormat="string"
        //@TaxCategory=N'2, 9, 4'
        />
      </div>
    </div>
  );
};

export default GstReportFilterGstCat;

export const GstReportFilterGstCatInitialState = {
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
};
