import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";

const ItemWiseGroupedBrandwiseSalesFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="grid grid-cols-1">
      {/* <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> */}
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
    //   </div>
    // </div>
  );
};

export default ItemWiseGroupedBrandwiseSalesFilter;

export const ItemWiseGroupedBrandwiseSalesFilterInitialState = {
  fromDate: moment().local().toDate(),
  toDate: moment().local().toDate(),
};
