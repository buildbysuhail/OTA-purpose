import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../../redux/urls";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const GroupwiseSalesSummaryFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
   const clientSession = useSelector((state: RootState) => state.ClientSession);
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <ERPDateInput
            label={t("from_date")}
            {...getFieldProps("fromDate")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("fromDate", data.fromDate)
            }
          />
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

      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4">
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
            handleFieldChange({
              productGroupID: data.value,
              productGroup: data.label,
            })
          }}
        />
        <ERPDataCombobox
          label={t("group_category")}
          {...getFieldProps("groupCategoryID")}
          field={{
            id: "groupCategoryID",
            getListUrl: Urls.data_groupcategory,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              groupCategoryID: data.value,
              groupCategory: data.label,
            })
          }}
        />
        <ERPDataCombobox
          label={t("section")}
          {...getFieldProps("sectionID")}
          field={{
            id: "sectionID",
            getListUrl: Urls.data_sections,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              sectionID: data.value,
              section: data.label,
            })
          }}
        />
           {clientSession.isAppGlobal && (
        <ERPDataCombobox
          label={t("salesman")}
          {...getFieldProps("salesmanID")}
          field={{
            id: "salesmanID",
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              salesmanID: data.value,
              salesman: data.label,
            })
          }}
        />
           )}
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2">
        <ERPCheckbox
          {...getFieldProps("showTransactionTimeProfit")}
          label={t("show_transaction_time_profit")}
          onChangeData={(data) =>
            handleFieldChange(
              "showTransactionTimeProfit",
              data.showTransactionTimeProfit
            )
          }
        />
      </div>
    </div>
  );
};

export default GroupwiseSalesSummaryFilter;
export const GroupwiseSalesSummaryFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  productGroupID: -1,
  groupCategoryID: -1,
  sectionID: -1,
  salesmanID: -1,
  isProductCatWise: false,
  isCategoryWise: false,
  isSectionWise: false,
  isBrandWise: false,
  isSalesmanwise: false,
  showTransactionTimeProfit: true,
};
