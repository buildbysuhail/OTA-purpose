import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleFinancialYearPopup,  } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import UserManagementApis from "../userManagement/User-Management-api";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import SystemSettingsApi from "./system-apis";

export const FinancialYearManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleFinancialYearPopup(false));
  }, []);
  const initialFinancialYearData = {
    data: {
      dateFrom: "",
      dateTo: "",
      fStatus: "",
      remarks: "",
      visibleOnStartUp: false,
      openingStockValue: 0,
    },
    validations: {
      dateFrom: "",
      dateTo: "",
    },
  };
  const [postFinancialData, setPostFinancialData] = useState(initialFinancialYearData);
  const [postFinancialDataLoading, setPostFinancialDataLoading] = useState<boolean>(false);

  const addFinancialData = useCallback(async () => {
    setPostFinancialDataLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.addFinancialYearInfo(postFinancialData?.data);
      setPostFinancialDataLoading(false);
    handleResponse(response, 
      () => {dispatch(toggleFinancialYearPopup(false));},
      () => {setPostFinancialData((prevData: any) => ({
                ...prevData,
                validations: response.validations,
              }));
            });
  }, [postFinancialData?.data]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ERPDateInput
          id="dateFrom"
          field={{type: "date", id: "dateFrom", required: true }}
          label={"From"}
          data={postFinancialData?.data}
          handleChange={(id: any, value: any) =>
            {
              
              setPostFinancialData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  [id]: value
                }
              }));
            }
            }
          validation={postFinancialData.validations.dateFrom}
        />
        <ERPDateInput
          id="dateTo"
          field={{type: "date", id: "dateTo", required: true }}
          label={"To"}
          data={postFinancialData?.data}
          handleChange={(id: any, value: any) =>
          {
            
            setPostFinancialData((prev: any) => ({
              ...prev,
              data: {
                ...prev.data,
                [id]: value
              }
            }));
          }
          }
          validation={postFinancialData.validations.dateTo}
        />
      
        
        <ERPInput
          id="remarks"
          label="Remarks"
          placeholder="Enter Remarks"
          required={false}
          data={postFinancialData?.data}
          onChangeData={(data: any) => {
            setPostFinancialData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postFinancialData?.data?.remarks}
        
        />
        <ERPInput
          id="openingStockValue"
          label="Prev Period Stock Value"
          placeholder="0.00"
          type="number"
          required={false}
          data={postFinancialData?.data}
          onChangeData={(data: any) => {
            setPostFinancialData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postFinancialData?.data?.openingStockValue}
        />

          <div className="w-full">
          <label
          htmlFor="fStatus"
          className="block text-xs  text-gray-700"
          >
          Status*
          </label>
          <select
          id="fStatus"
          name="fStatus"
          required
          className="block w-full px-3 py-1 bg-white border border-gray-300  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={postFinancialData?.data?.fStatus || ""}
          onChange={(e) => {
          setPostFinancialData((prev: any) => ({
            ...prev,
            data: {
              ...prev.data,
              fStatus: e.target.value, 
            },
          }));
          }}
          >
          <option value="" disabled>Select Status</option>
          <option value="Active">Active</option> 
          <option value="Inactive">Inactive</option>
          <option value="Progress">Progress</option>
          </select>
          
          </div>


        <div className="flex items-center">
          <input
          type="checkbox" 
          name="visibleOnStartUp"
          className="ti-form-checkbox" 
          id="visibleOnStartUp"
          checked={postFinancialData?.data.visibleOnStartUp} 
          onChange={(e) => {
          setPostFinancialData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            visibleOnStartUp: e.target.checked, 
          },
          }));
          }}
          />
        <label
          htmlFor="switcher-dark-theme"
          className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
        >
         Visible On StartUp
        </label>
      </div>
      </div> 
      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
          // disabled={emailLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postFinancialDataLoading}
          variant="primary"
          onClick={addFinancialData}
          loading={postFinancialDataLoading}
          title={"Submit"}
        ></ERPButton>
      </div>
    </div>
 
  );
};