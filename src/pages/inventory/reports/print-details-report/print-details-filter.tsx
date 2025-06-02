import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import moment from "moment";

const PrintDetailsFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
  const { t } = useTranslation('accountsReport')
  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden p-2">
        <div className="flex items-center gap-4">
          <ERPRadio
            id="startsWith"
            name="voucherType"
            value="startsWith"
            label={t("start_with")}
            checked={formState.voucherType === "startsWith"}
            onChange={(e) => handleFieldChange("voucherType", e.target.value)}
          />
          <ERPRadio
            id="contains"
            name="voucherType"
            value="contains"
            label={t("contains")}
            checked={formState.voucherType === "contains"}
            onChange={(e) => handleFieldChange("voucherType", e.target.value)}
          />
          <ERPRadio
            id="exactMatch"
            name="voucherType"
            value="exactMatch"
            label={t("exact_match")}
            checked={formState.voucherType === "exactMatch"}
            onChange={(e) => handleFieldChange("voucherType", e.target.value)}
          />
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1">
          <ERPDateInput
            label={t("from")}
            {...getFieldProps("dateFrom")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          />
        </div>
        <div className="col-span-1">
          <ERPDateInput
            label={t("to")}
            {...getFieldProps("dateTo")}
            className="w-full"
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>
      </div>
    </div>
  );
}
export default PrintDetailsFilter;
export const PrintDetailsFilterInitialState = {
  dateFrom: moment().local().toDate(),
  dateTo: moment().local().toDate(),
  voucherType: "startsWith",
};