import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPMultiSelect from "../../../../components/ERPComponents/erp-multi-select";
import { useEffect, useState } from "react";
import { APIClient } from "../../../../helpers/api-client";

const api = new APIClient();
const PurchaseGstReportFilterGstCat = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("inventory");
  const [branchOptions, setBranchOptions] = useState<[]>([]);
  useEffect(() => {
    const fetchBranchOptions = async () => {
      try {
        const branchData = await api.getAsync(`${Urls.data_taxCategory}`);
        setBranchOptions(branchData);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranchOptions();
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
          <ERPDateInput
            label={t("date_from")}
            {...getFieldProps("fromDate")}
            className="max-w-[150px]"
            datatype="date"
            onChangeData={(data: any) =>
              handleFieldChange("fromDate", data.fromDate)
            }
          />

          <ERPDateInput
            label={t("date_to")}
            {...getFieldProps("toDate")}
            className="max-w-[150px]"
            datatype="date"
            onChangeData={(data: any) =>
              handleFieldChange("toDate", data.toDate)
            }
          />

          <ERPCheckbox
            {...getFieldProps("isTransactionDate")}
            label={t("Transaction Date")}
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
          className="w-32"
          placeholder="0.00"
          datatype="number"
          onChangeData={(data) => handleFieldChange("gSTPerc", data.gSTPerc)}
        />

        <ERPMultiSelect
          {...getFieldProps("taxCategoryID")}
          label={t("branches")}
          options={branchOptions}
          selectedValues={getFieldProps("taxCategoryID").value}
          onChange={(data) => handleFieldChange("taxCategoryID", data)}
          placeholder={t("select_branches")}
          searchPlaceholder={t("search_branches")}
          outputFormat="array"
        />
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
            label="voucherForm"
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
          label={t("Exclude NA")}
          onChangeData={(data) =>
            handleFieldChange("excludeNA", data.excludeNA)
          }
        />
      </div>
    </div>
  );
};

export default PurchaseGstReportFilterGstCat;

export const PurchaseGstReportFilterGstCatInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  gSTPerc: null,
  isVchForm: false,
  voucherForm: "",
  isTransactionDate: false,
  taxCategory: "",
  excludeNA: 0,
  rdbCash: false,
  rdbBank: false,
};
