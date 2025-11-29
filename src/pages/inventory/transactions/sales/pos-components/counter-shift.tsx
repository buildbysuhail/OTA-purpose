import React from "react";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";

interface CounterShiftProps {
  formState: any;
  dispatch: any;
}

const CounterShift: React.FC<CounterShiftProps> = ({ formState, dispatch }) => {
  const { t } = useTranslation("transaction");

  return (
    <div className="flex flex-col gap-2 justify-center px-4">
      {/* <h1>{t("counter_shift")}</h1> */}
      <ERPDataCombobox
        //   {...getFieldProps("priceCategoryID")}
        id=""
        field={{
          id: "priceCategoryID",
          required: true,
          // getListUrl: Urls.data_pricectegory,
          valueKey: "id",
          labelKey: "name",
        }}
        //   onChangeData={(data: any) => handleFieldChange("priceCategoryID", data.priceCategoryID)}
        label={t("counter")}
      />
      <div className="flex gap-2">
        <ERPInput id="openingCash" label={t("opening_cash")} type="number" value={0.0} />
        <ERPButton title={t("teller")} variant="secondary" />
      </div>
      <div className="flex gap-2">
        <ERPInput id="closingCash" label={t("closing_cash")} type="number" value={0.0} />
        <ERPButton title={t("teller")} variant="secondary" />
      </div>

      <ERPDataCombobox
        //   {...getFieldProps("priceCategoryID")}
        id=""
        field={{
          id: "priceCategoryID",
          required: true,
          // getListUrl: Urls.data_pricectegory,
          valueKey: "id",
          labelKey: "name",
        }}
        //   onChangeData={(data: any) => handleFieldChange("priceCategoryID", data.priceCategoryID)}
        label={t("opened_employee")}
      />
      <ERPInput
        id="remarks"
        type="text"
        // value={0.0}
      />
      <div>{t("last_closed_time")}</div>
      <ERPButton title={t("open_counter")} variant="primary" />
    </div>
  );
};

export default CounterShift;
