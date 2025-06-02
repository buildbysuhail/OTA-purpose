import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import moment from "moment";

const GSTR3BReportFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
      <div className="grid grid-cols-1 gap-4">
        <ERPRadio
          id="inAndOutSupplies"
          name="supplyType"
          value="inAndOutSupplies"
          label={t("in_and_out_supplies_liable_to_reverse_charge")}
          checked={getFieldProps("supplyType").value == "inAndOutSupplies"}
          onChange={(e) => handleFieldChange("supplyType", e.target.value)}
        />
        <ERPRadio
          id="eligibleITC"
          name="supplyType"
          value="eligibleITC"
          label={t("eligible_itc")}
          checked={getFieldProps("supplyType").value == "eligibleITC"}
          onChange={(e) => handleFieldChange("supplyType", e.target.value)}
        />
        <ERPRadio
          id="exemptNilRated"
          name="supplyType"
          value="exemptNilRated"
          label={t("exempt_nil_rated_non_gst_inward_supplies")}
          checked={getFieldProps("supplyType").value == "exemptNilRated"}
          onChange={(e) => handleFieldChange("supplyType", e.target.value)}
        />
        <ERPRadio
          id="interStateSupplies"
          name="supplyType"
          value="interStateSupplies"
          label={t("details_of_inter_state_supplies")}
          checked={getFieldProps("supplyType").value == "interStateSupplies"}
          onChange={(e) => handleFieldChange("supplyType", e.target.value)}
        />
      </div>

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
    </div>
  );
};

export default GSTR3BReportFilter;
export const GSTR3BReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
  supplyType: "inAndOutSupplies",
  showFilterInitially: true,
};
