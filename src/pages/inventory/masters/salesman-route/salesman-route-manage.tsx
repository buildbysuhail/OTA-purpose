import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { toggleSalesManRoute } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialSalesManRouteData, SalesManRouteData } from "./salesman-route-manage-type";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../../helpers/api-client";
import { handleResponse } from "../../../../utilities/HandleResponse";

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

const dayMappings: Record<Day, number> = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
};

const api = new APIClient();

export const SalesmanRoute: React.FC = React.memo(() => {
  const { t } = useTranslation("inventory");
  const [formState, setFormState] = useState<SalesManRouteData>(initialSalesManRouteData);
  const [prevformState, setPrevFormState] = useState<Partial<SalesManRouteData>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const rootState = useRootState();
  const dispatch = useDispatch();

  // Extract the id from the popup data
  const id = rootState.PopupData.salesManRoute.key;
  const isEdit = id !== null && id !== undefined;

  const onClose = useCallback(() => {
    dispatch(toggleSalesManRoute({ isOpen: false, key: null, reload: false }));
  }, [dispatch]);

  // Build a translated mapping for the day names using useMemo.
  // This assumes you have translation keys like "days.sunday", "days.monday", etc.
  const translatedDays: Record<Day, string> = useMemo(
    () => ({
      Sunday: t("sunday"),
      Monday: t("monday"),
      Tuesday: t("tuesday"),
      Wednesday: t("wednesday"),
      Thursday: t("thursday"),
      Friday: t("friday"),
      Saturday: t("saturday"),
    }),
    [t]
  );

  const handleFieldChange = (settingName: any, value: any) => {
    setFormState((prevSettings: SalesManRouteData) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };

  const onCheckboxChange = (day: Day) => {
    setFormState((prevState) => {
      const currentSalesDay = prevState.salesDayArray || [];
      const dayValue = dayMappings[day];
      if (currentSalesDay.includes(dayValue)) {
        return {
          ...prevState,
          salesDayArray: currentSalesDay.filter((d) => d !== dayValue),
        };
      } else {
        return {
          ...prevState,
          salesDayArray: [...currentSalesDay, dayValue],
        };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const apiMethod = isEdit ? api.put : api.post;
      const response: any = await apiMethod(`${Urls.sales_man_route}`, formState);
      handleResponse(response, () =>
        dispatch(toggleSalesManRoute({ isOpen: false, key: null, reload: true }))
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadById = useCallback(async (loadId: number) => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.sales_man_route}${loadId}`);
      setFormState(response);
      setPrevFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      loadById(id);
    }
  }, [isEdit, id, loadById]);

  const handleClear = useCallback(() => {
    if (isEdit && id && prevformState) {
      setFormState(prevformState as SalesManRouteData);
    } else {
      setFormState(initialSalesManRouteData);
    }
  }, [isEdit, id, prevformState]);

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDataCombobox
          required={true}
          data={formState}
          id="salesManID"
          field={{
            id: "salesManID",
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("salesman")}
          onChangeData={(data: any) => handleFieldChange("salesManID", data.salesManID)}
        />

        <ERPDataCombobox
          required={true}
          data={formState}
          id="salesRouteID"
          field={{
            id: "salesRouteID",
            required: true,
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("sales_route")}
          onChangeData={(data: any) => handleFieldChange("salesRouteID", data.salesRouteID)}
        />

        <ERPInput
          id="remarks"
          value={formState?.remarks}
          data={formState}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="" className="block text-[12px] font-medium text-gray-700 mb-1">
          {t("sales_day")}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 border border-gray-200 rounded">
          {(Object.keys(dayMappings) as Day[]).map((day) => (
            <ERPCheckbox
              id={day}
              key={day}
              label={translatedDays[day]}
              checked={formState.salesDayArray?.includes(dayMappings[day]) || false}
              onChange={() => onCheckboxChange(day)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-end items-center mt-3">
        <ERPButton
          title={t("close")}
          variant="secondary"
          disabled={isSaving}
          type="button"
          onClick={onClose}
        />
        <ERPButton
          title={t("clear")}
          variant="secondary"
          disabled={isSaving}
          type="button"
          onClick={handleClear}
        />
        <ERPButton
          title={isEdit ? t("edit") : t("add")}
          variant="primary"
          loading={isSaving}
          disabled={isSaving}
          type="button"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
});
