import { useTranslation } from "react-i18next";
import moment from "moment";
import { useEffect, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import Urls from "../../../../redux/urls";

const PurchaseOrderTransitReportFilter = ({
  getFieldProps,
  handleFieldChange,
}: any) => {
  const { t } = useTranslation("accountsReport");

  // State for warehouse type radio buttons
  const [warehouseTypeRadio, setWarehouseTypeRadio] = useState({
    physical: true,
    van: false,
  });

  // Update the WarehouseType value when radio selection changes
  useEffect(() => {
    if (warehouseTypeRadio.physical || warehouseTypeRadio.van) {
      const warehouseType = warehouseTypeRadio.physical ? "Physical" : "Van";
      handleFieldChange("WarehouseType", warehouseType);
    }
  }, [warehouseTypeRadio]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Date Range Section */}
      <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <ERPDateInput
            {...getFieldProps("dateFrom")}
            label={t("date_from")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("dateFrom", data.dateFrom)
            }
            autoFocus={true}
          />
          <ERPDateInput
            {...getFieldProps("dateTo")}
            label={t("date_to")}
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("dateTo", data.dateTo)
            }
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
        <ERPDataCombobox
          {...getFieldProps("warehosueID")}
          label={t("warehouse")}
          field={{
            id: "warehouseID",
            getListUrl: Urls.data_warehouse,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) =>
            handleFieldChange({
              warehouseID: data.value,
              WarehouseName: data.label,
            })
          }
        />

        <ERPDataCombobox
          {...getFieldProps("partyID")}
          label={t("party")}
          field={{
            id: "partyID",
            getListUrl: Urls.data_parties,
            params: "",
            valueKey: "id",
            labelKey: "name",
            nameKey: "alias",
          }}
          onSelectItem={(data) =>
            handleFieldChange({ partyID: data.value, PartyName: data.label })
          }
        />
      </div>

      {/* Warehouse Type Radio Buttons */}
      <div className="flex items-end gap-2">
        <label className="text-sm font-medium">
          {t("warehouse_type")}:
        </label>
        <div className="flex space-x-5">
          <ERPRadio
            id="physical"
            name="warehouseType"
            data={warehouseTypeRadio}
            checked={warehouseTypeRadio.physical}
            label={t("physical")}
            onChange={() => {
              setWarehouseTypeRadio({ physical: true, van: false });
            }}
          />
          <ERPRadio
            id="van"
            name="warehouseType"
            data={warehouseTypeRadio}
            checked={warehouseTypeRadio.van}
            label={t("van")}
            onChange={() => {
              setWarehouseTypeRadio({ physical: false, van: true });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderTransitReportFilter;

// Updated initial state to match C# property names
export const PurchaseOrderTransitReportInitialState = {
  dateFrom: moment().local().toDate(),
  dateTo: new Date(),
  WarehouseID: 0,
  PartyID: 0,
  WarehouseType: "", // Default value
};
