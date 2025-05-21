import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import moment from "moment";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

const SalesmanwiseSalesAndCollectionFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  return (
   <div className="grid grid-cols-1 gap-4">
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
  <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2">
    <ERPCheckbox
      {...getFieldProps("isVatIncluded")}
      label={t("vat_included")}
      onChangeData={(data) =>
        handleFieldChange("isVatIncluded", data.isVatIncluded)
      }
    />
    <ERPCheckbox
      {...getFieldProps("routeWise")}
      label={t("route_wise")}
      onChangeData={(data) =>
        handleFieldChange("routeWise", data.routeWise)
      }
    />
  </div>
</div>

  );
};

export default SalesmanwiseSalesAndCollectionFilter;
export const SalesmanwiseSalesAndCollectionFilterInitialState = {
 fromDate: moment().startOf("month").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  isVatIncluded: true,
  routeWise: true,
};
