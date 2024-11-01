import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import {
  toggleProductGroup,
  toggleSalesManRoute,
} from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import {
  initialSalesManRouteData,
  SalesManRouteData,
} from "./salesman-route-manage-type";
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
interface SalesmanRouteProps {
  id?: number | null;
}
const api = new APIClient();
export const SalesmanRoute: React.FC<SalesmanRouteProps> = React.memo(({ id }) => {
    const [formState, setFormState] = useState(initialSalesManRouteData);
    const [formStatePrev, setFormStatePrev] = useState<Partial<SalesManRouteData> >({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const rootState = useRootState();
    const dispatch = useDispatch();

    const isEdit = id !== null && id !== undefined;
    const onClose = useCallback(() => {
      dispatch(toggleSalesManRoute({ isOpen: false, key: null }));
    }, []);

    const { t } = useTranslation();

    const handleFieldChange = (settingName: any, value: any) => {
      setFormState((prevSettings = {} as SalesManRouteData) => ({
        ...prevSettings,
        [settingName]: value ?? "",
      }));
    };

    // const onCheckboxChange = (day: Day) => {
    //   setSalesDay((prevSalesDay) => {
    //     if (prevSalesDay.includes(dayMappings[day])) {
    //       return prevSalesDay.filter((d) => d !== dayMappings[day]);
    //     } else {
    //       return [...prevSalesDay, dayMappings[day]];
    //     }
    //   });
    // };
    const onCheckboxChange = (day: Day) => {
        setFormState((prevState) => {
          const currentSalesDay = prevState.salesDay || [];
          const dayValue = dayMappings[day];
          
          if (currentSalesDay.includes(dayValue)) {
            return {
              ...prevState,
              salesDay: currentSalesDay.filter((d) => d !== dayValue),
            };
          } else {
            return {
              ...prevState,
              salesDay: [...currentSalesDay, dayValue],
            };
          }
        });
      };
 
    const handleSubmit = async () => {
      setIsSaving(true);
      try {
        if (isEdit) {
            const response: any = await api.put(`${Urls.sales_man_route}`,formState);
            handleResponse(response,() => dispatch(toggleSalesManRoute({ isOpen:false, key:null , reload: true })))
        } else {
          const response: any = await api.post(`${Urls.sales_man_route}`,formState);
          handleResponse(response,() => dispatch(toggleSalesManRoute({ isOpen:false, key:null , reload: true })))
        }
        
      } catch (error) {
        console.error("Error saving settings:", error);
      } finally {
        setIsSaving(false);
      }
    };
    // const handleSubmit = async () => {
    //     setIsSaving(true);
    //     try {
    //       const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
    //         const currentValue = formState?.[key as keyof AccountSettingsState];
    //         const prevValue = formStatePrev[key as keyof AccountSettingsState];
    
    //         if (currentValue !== prevValue) {
    //           acc.push({
    //             settingsName: key,
    //             settingsValue: currentValue.toString()
    //           });
    //         }
    //         return acc;
    //       }, [] as { settingsName: string; settingsValue: string }[]);
    //       console.log(modifiedSettings);
    
    //       const response = await api.put(Urls.application_settings, { type: 'accounts', updateList: modifiedSettings }) as any
    //       handleResponse(response);
    //     } catch (error) {
    //       console.error('Error saving settings:', error);
    //     } finally {
    //       setIsSaving(false);
    //     }
    //   };
    useEffect(() => {
        if (isEdit) {
          loadById(id);
        }
      }, [id]);
    
      const loadById = async (id:number) => {
        setLoading(true);
        try {
          const response = await api.getAsync(`${Urls.sales_man_route}${id}`)
          setFormState(response);
        } catch (error) {
          console.error('Error loading settings:', error);
        } finally {
          setLoading(false);
        }
      };
   
    return (
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ERPDataCombobox
            required={true}
            value={formState?.salesManID}
            data={formState}
            id="salesManID"
            field={{
              id: "salesManID",
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
            }}
            label="Sales Man"
            onChangeData={(data: any) =>
              handleFieldChange("salesManID", data.salesManID)
            }
          />

          <ERPDataCombobox
            required={true}
            value={formState?.salesRouteID}
            data={formState}
            id="salesRouteID"
            field={{
              id: "salesRouteID",
              required: true,
              getListUrl: Urls.data_salesRoute,
              valueKey: "id",
              labelKey: "name",
            }}
            label="Sales  Route"
            onChangeData={(data: any) =>
            handleFieldChange("salesRouteID", data.salesRouteID)
            }
          />
          <div>
            <label
              htmlFor=""
              className="block text-[12px] font-medium text-gray-700 mb-1"
            >
              Sales Day *
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 border border-gray-200 rounded">
              {(Object.keys(dayMappings) as Day[]).map((day) => (
                <ERPCheckbox
                  id={day}
                  key={day}
                  label={day}
                  checked={formState.salesDay?.includes(dayMappings[day]) || false}
                  onChange={() => onCheckboxChange(day)}
                />
              ))}

            </div>
          </div>

          <ERPInput
            id="remarks"
            value={formState?.remarks}
            data={formState}
            label={t("remarks")}
            placeholder={t("remarks")}
            onChangeData={(data: any) =>
              handleFieldChange("remarks", data.remarks)
            }
          />
        </div>
        <div className="flex justify-end items-center ">
          <ERPButton
            title={isEdit ? "Edit" : "Add"}
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
