"use client";
import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

const PartyMonthwisePurchaseSummaryReportFilter = ({
  getFieldProps,
  handleFieldChange,
}: any) => {
  const { t } = useTranslation("accountsReport");

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("date_from")}
          className="w-full"
          onChangeData={(data: any) =>
            handleFieldChange("fromDate", data.fromDate)
          }
          autoFocus={true}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("date_to")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>
    </div>
  );
};

export default PartyMonthwisePurchaseSummaryReportFilter;
export const PartyMonthwisePurchaseSummaryReportFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: new Date(),
};
