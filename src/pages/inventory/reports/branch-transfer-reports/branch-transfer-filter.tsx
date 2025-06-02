import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import Urls from "../../../../redux/urls";

const BranchTransferFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Fields */}
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>
      <ERPDataCombobox
        label={t("to_branch")}
        {...getFieldProps("toBranchID")}
        field={{
          id: "toBranchID",
          getListUrl: Urls.data_acc_Branches,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => {
          handleFieldChange("toBranchID", data.value);
        }}
      />
    </div>
  );
}
export default BranchTransferFilter;
export const BranchTransferFilterInitialState = {
  fromDate:moment().local().toDate(),
  toDate: moment().local().toDate(),
  toBranchID: 0,
};