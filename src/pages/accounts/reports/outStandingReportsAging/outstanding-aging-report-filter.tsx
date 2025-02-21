import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";

const OutstandingAgingReportFilter = ({
  getFieldProps,
  handleFieldChange,
}: any) => {
  const { t } = useTranslation("accountsReport");
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Route Name Combobox */}
        <ERPDataCombobox
          {...getFieldProps("salesRouteID")}
          label={t("route_name")}
          field={{
            id: "salesRouteID",
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) =>
            handleFieldChange({
              salesRouteID: data.value,
              salesRouteName: data.name,
            })
          }
        />
        {/* Party Category Combobox */}
        <ERPDataCombobox
          {...getFieldProps("partyCategoryID")}
          label={t("party_category")}
          field={{
            id: "partyCategoryID",
            getListUrl: Urls.data_party_categories,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) =>
            handleFieldChange({
              partyCategoryID: data.value,
              partyCategoryName: data.name,
            })
          }
        />
        {/* Cost Centre Combobox */}
        <ERPDataCombobox
          {...getFieldProps("costCentreID")}
          label={t("cost_centre")}
          field={{
            id: "costCentreID",
            getListUrl: Urls.data_costcentres,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) =>
            handleFieldChange({
              costCentreID: data.value,
              costCentreName: data.name,
            })
          }
        />
        {/* As On Date */}
        <ERPDateInput
          {...getFieldProps("asonDate")}
          label={t("as_on_date")}
          onChangeData={(data: any) =>
            handleFieldChange("asonDate", data.asonDate)
          }
        />
        {/* Periods Grid */}
        <ErpInput
          {...getFieldProps("p1")}
          label={t("period_1")}
          type="number"
          onChangeData={({ p1 }: any) =>
            handleFieldChange("p1", parseInt(p1) || 0)
          }
        />
        <ErpInput
          {...getFieldProps("p2")}
          label={t("period_2")}
          type="number"
          onChangeData={({ p2 }: any) =>
            handleFieldChange("p2", parseInt(p2) || 0)
          }
        />
        <ErpInput
          {...getFieldProps("p3")}
          label={t("period_3")}
          type="number"
          onChangeData={({ p3 }: any) =>
            handleFieldChange("p3", parseInt(p3) || 0)
          }
        />
        <ErpInput
          {...getFieldProps("p4")}
          label={t("period_4")}
          type="number"
          onChangeData={({ p4 }: any) =>
            handleFieldChange("p4", parseInt(p4) || 0)
          }
        />
        <ErpInput
          {...getFieldProps("p5")}
          label={t("period_5")}
          type="number"
          onChangeData={({ p5 }: any) =>
            handleFieldChange("p5", parseInt(p5) || 0)
          }
        />
        <ErpInput
          {...getFieldProps("p6")}
          label={t("period_6")}
          type="number"
          onChangeData={({ p6 }: any) =>
            handleFieldChange("p6", parseInt(p6) || 0)
          }
        />
      </div>
      {/* Load Defaults Checkbox */}
      <ERPCheckbox
        {...getFieldProps("loadDefaults")}
        label={t("load_defaults")}
        className="text-left"
        onChangeData={(data: any) =>
          handleFieldChange("loadDefaults", data.loadDefaults)
        }
      />
    </div>
  );
};
export default OutstandingAgingReportFilter;
export const OutstandingAgingReportFilterInitialState = {
  asonDate: new Date(),
  salesRouteID: -1,
  partyCategoryID: -1,
  costCenterID: -1,
  p1: 30,
  p2: 60,
  p3: 90,
  p4: 120,
  p5: 150,
  p6: 180,
  loadDefaults: false,
};
