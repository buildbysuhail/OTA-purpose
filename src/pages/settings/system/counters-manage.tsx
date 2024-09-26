import { useCallback, useState } from "react";
import { ResponseModelWithValidation } from "../../../base/response-model";
import UserManagementApis from "../userManagement/User-Management-api";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { ledgercompo, usertypecompo } from "../../../redux/slices/data/thunk";
import SystemSettingsApi from "./system-apis";


export const CounterManage = ({setIsOpenAddPop}:any) => {
  const initaialCounterData = {
      data:{counterName:'',descriptions:'',cashLedgerID:0,warehouseID:null,maintainShift:false,},
      validations:{counterName:'',descriptions:'',cashLedgerID:'',warehouseID:'',maintainShift:'',}
  }
  const [postCounter,setPostCounter]= useState(initaialCounterData);
  const [postCounterLoading, setPostCounterLoading] = useState<boolean>(false);
;
const addCounter =useCallback(async () => {

setPostCounterLoading(true);

const response: ResponseModelWithValidation<any, any> = await SystemSettingsApi.addCounterInfo(postCounter?.data);

setPostCounterLoading(false);

setPostCounter((prevData: any) => ({
  ...prevData,
  validations: response.validations
}));
// appDispatch(userSession());
handleResponse(response, () => {});
if(response.isOk){
setIsOpenAddPop(false);
}
}, [ postCounter?.data]);

  return (
    <div className="w-full p-10">
     
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ERPInput
            id="counterName"
             label="User type Name"
            placeholder="User Type Name"
            required={true}
            data={postCounter?.data}
            onChangeData={(data: any) => {
            
              setPostCounter((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postCounter?.data?.counterName}
            validation={postCounter?.validations?.counterName}
          />
          <ERPInput
            id="descriptions"
            label="Descriptions"
            placeholder="descriptions"
            required={true}
           
            data={postCounter?.data}
            onChangeData={(data: any) =>
            {
              setPostCounter((prevData: any) => ({
                  ...prevData,
                  data: data,
                }));
             
            }
              
            }
            value={postCounter?.data?.descriptions}
            validation={postCounter?.validations?.descriptions}
          />
                     < ERPDataCombobox
                      id="cashLedgerID"
                      field={{
                        id: "cashLedgerID",
                        required: true,
                        getListUrl: Urls.Ledger,
                        valueKey:"ledgerID",
                        labelKey:"ledgerName",
                      }}
                      thunkAction= {ledgercompo}
                      reducer="Ledgercompo"
                      onChangeData={(data: any) => {
                        // Update only the cashLedgerID field
                        setPostCounter((prevData: any) => ({
                          
                          ...prevData,
                          data: {
                            ...prevData.data,
                            
                            cashLedgerID: data.value,
                          },
                        }));
                      }}
                      // validation={postUser.validations.cashLedgerID}
                      data={postCounter?.data}
                      defaultData={postCounter?.data}
                      value={postCounter?.data?.cashLedgerID || ""} 
                      label="cashLedgerID"
                    />
                    < ERPDataCombobox
                      id="warehouseID"
                      field={{
                        id: "warehouseID",
                        required: true,
                        getListUrl: Urls.getUserTypeCompo,
                        valueKey: "warehouseID",
                        labelKey: "userTypeName",
                      }}
                      thunkAction= {usertypecompo}
                      reducer="Usertypecompo"
                      onChangeData={(data: any) => {
                        // Update only the warehouseID field
                        setPostCounter((prevData: any) => ({
                          
                          ...prevData,
                          data: {
                            ...prevData.data,
                            
                            warehouseID: data.value,
                          },
                        }));
                      }}
                      // validation={postCounter.validations.warehouseID}
                      data={postCounter?.data}
                      defaultData={postCounter?.data}
                      value={postCounter?.data?.warehouseID || ""} 
                      label="warehouseID"
                    />

          <div className="">
         <input
          id="maintainShift"
          type="checkbox"
          className="mr-2"
          checked={postCounter?.data?.maintainShift} 
           onChange={(e) => {
            setPostCounter((prevData: any) => ({
         ...prevData,
           data: {
          ...prevData.data,
          maintainShift: e.target.checked, 
         },
          }));
         }}
           />
          <label htmlFor="agreement" className="text-gray-700">
           Manitain Shift
          </label>
        </div> 
      

        </div>
   
       
      
      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={() => {
          setIsOpenAddPop(false);
          //   setPostDataEmail({initialEmailData});
          }}
          disabled={postCounterLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postCounterLoading}
          variant="primary"
          onClick={addCounter}
          loading={postCounterLoading}
          title={"Submit"}
        ></ERPButton>
      </div>
    </div>
  );
};
