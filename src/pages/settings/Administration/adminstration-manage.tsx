import { useCallback, useState } from 'react';
import { ResponseModelWithValidation } from '../../../base/response-model';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleResponse } from '../../../utilities/HandleResponse';
import UserManagementApis from '../userManagement/User-Management-api';
import Urls from '../../../redux/urls';
import { countries } from '../../../redux/slices/data/thunk';
import AdministrationSettingsApis from './administration-settings-apis';
export const PopUpModalBankPos = ({setIsOpenBankPos}:any) => {
    const initaialBankPosData = {
        data:{machineBrand:'',model:'',comPort:'',geldeaWsPort:'',gediaService:''},
        validations:{machineBrand:'',model:'',comPort:'',geldeaWsPort:'',gediaService:''}
    }
    const [postBankPos,setPostBankPos]= useState(initaialBankPosData);
    const [postBankPosLoading, setPostBankPosLoading] = useState<boolean>(false);

    const addBankPos =useCallback(async () => {
  
  setPostBankPosLoading(true);

  const response: ResponseModelWithValidation<any, any> = await AdministrationSettingsApis.addBankPosInfo(postBankPos?.data);
  
  setPostBankPosLoading(false);
  
//   setPostBankPos((prevData: any) => ({
//     ...prevData,
//     validations: response.validations
//   }));
  // appDispatch(userSession());
  handleResponse(response, () => {});
  if(response.isOk){
  setIsOpenBankPos(false);
  }
}, [ postBankPos?.data]);

    return (
      <div className="w-full pt-4">
       
          <div className="grid grid-cols-1 gap-3">
                    < ERPDataCombobox
                      id="machineBrand"
                      field={{
                        id: "machineBrand",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostBankPos((prev: any) => ({
                          ...prev,
                          data: data
                        }))
                      }}
                    //   validation={postBankPos.validations.machineBrand}
                      data={postBankPos?.data}
                      defaultData={postBankPos?.data}
                      value={postBankPos != undefined && postBankPos?.data != undefined && postBankPos?.data?.machineBrand != undefined ? postBankPos?.data?.machineBrand : 0}
                      label="Machine Brand"
                    />

                    < ERPDataCombobox
                      id="model"
                      field={{
                        id: "model",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostBankPos((prev: any) => ({
                          ...prev,
                          data: data
                        }))
                      }}
                    //   validation={postBankPos.validations.model}
                      data={postBankPos?.data}
                      defaultData={postBankPos?.data}
                      value={postBankPos != undefined && postBankPos?.data != undefined && postBankPos?.data?.model != undefined ? postBankPos?.data?.model : 0}
                      label="Model"
                    />

                    < ERPDataCombobox
                      id="comPort"
                      field={{
                        id: "comPort",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostBankPos((prev: any) => ({
                          ...prev,
                          data: data
                        }))
                      }}
                    //   validation={postBankPos.validations.comPort}
                      data={postBankPos?.data}
                      defaultData={postBankPos?.data}
                      value={postBankPos != undefined && postBankPos?.data != undefined && postBankPos?.data?.comPort != undefined ? postBankPos?.data?.comPort : 0}
                      label="Com Port"
                    />
            <ERPInput
              id="geldeaWsPort"
              label="Geldea Ws Port"
              placeholder="Geldea Ws Port"
              required={true}
             
              data={postBankPos?.data}
              onChangeData={(data: any) =>
              {
                setPostBankPos((prevData: any) => ({
                    ...prevData,
                    data: data,
                  }));
               
              }
                
              }
              value={postBankPos?.data?.geldeaWsPort}
            //   validation={postBankPos?.validations?.geldeaWsPort}
            />
            <ERPInput
              id="gediaService"
              label="Gedia Service"
              placeholder="gediaService"
              required={true}
              data={postBankPos?.data}
              onChangeData={(data: any) =>
               {
             
                setPostBankPos((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postBankPos?.data?.gediaService}
            //   validation={postBankPos?.validations?.gediaService}
            />
          </div>
     
        <div className="w-full p-2 flex justify-center">
        <ERPButton
              type="reset"
              title="Cancel"
              variant="secondary"
              onClick={() => {
                
                setIsOpenBankPos(false);
                // setPostDataEmail({initialEmailData});
              }}
              disabled={postBankPosLoading}
        ></ERPButton>
         
          <ERPButton
            type="button"
            disabled={postBankPosLoading}
            variant="primary"
            onClick={addBankPos}
            loading={postBankPosLoading}
            title="Submit"
          ></ERPButton>
        </div>
      </div>
 
    );
  };
