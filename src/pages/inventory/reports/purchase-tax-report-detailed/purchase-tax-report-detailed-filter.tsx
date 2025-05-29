import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

const PurchaseTaxReportDetailedFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        <ERPDateInput
          label={t("from")}
          {...getFieldProps("fromDate")}
          className="w-full"
          onChangeData={(data: any) =>
            handleFieldChange("fromDate", data.fromDate)
          }
        />
        <ERPDateInput
          label={t("to")}
          {...getFieldProps("toDate")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>

      <div className="grid items-center grid-cols-2 gap-4">
        <ERPCheckbox
          {...getFieldProps("vatPercentageEnabled")}
          label={t("vat_percentage")}
          onChangeData={(data) =>
            handleFieldChange("vatPercentageEnabled", data.vatPercentageEnabled)
          }
        />
        <ERPInput
          noLabel={true}
          {...getFieldProps("vatPercentage")}
          className="w-full"
          type="number"
          step="0.01"
          min="0"
          disabled={!getFieldProps("vatPercentageEnabled").value}
          onChangeData={(data: any) =>
            handleFieldChange("vatPercentage", parseFloat(data.vatPercentage))
          }
        />
      </div>
    </div>
  );
};

export default PurchaseTaxReportDetailedFilter;

export const PurchaseTaxReportDetailedFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  vatPercentageEnabled: false,
  vatPercentage: 0.0,
};
