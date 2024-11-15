import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import {toggleSalesManRoute,} from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
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
export const SalesmanRoute: React.FC = React.memo(() => {
    const [formState, setFormState] = useState<SalesManRouteData>(initialSalesManRouteData);
    const [prevformState, setPrevFormState] = useState<Partial<SalesManRouteData>>({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const rootState = useRootState();
    const dispatch = useDispatch();

    //checking key == id
    const  id=rootState.PopupData.salesManRoute.key;
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
        const apiMethod = isEdit ? api.put : api.post;
        const response: any = await apiMethod(`${Urls.sales_man_route}`, formState);
        handleResponse(response,() => dispatch(toggleSalesManRoute({ isOpen:false, key:null , reload: true }))) 
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
          setPrevFormState(response)
        } catch (error) {
          console.error('Error loading settings:', error);
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
      <div className="w-full pt-4">
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
            label="Sales Man"
            onChangeData={(data: any) =>
              handleFieldChange("salesManID", data.salesManID)
            }
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
            label="Sales  Route"
            onChangeData={(data: any) =>
            handleFieldChange("salesRouteID", data.salesRouteID)
            }
          />
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

       
        </div>
        <div className="flex justify-end items-center m-3">
         <ERPButton
            title="Close"
            variant="secondary"
            disabled={isSaving}
            type="button"
            onClick={onClose}
          />
         <ERPButton
            title="Clear"
            variant="secondary"
            disabled={isSaving}
            type="button"
            onClick={handleClear}
          />
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
