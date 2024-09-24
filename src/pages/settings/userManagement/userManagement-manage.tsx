import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import UserManagementApis from './User-Management-api';
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import { countries, usertypecompo } from "../../../redux/slices/data/thunk";

//add popup for userType grid
export const PopUpModalAddUserTypes = ({setIsOpenAddPop}:any) => {
    const initaialUserTypeData = {
        data:{userTypeName:'',userTypeCode:'',remark:''},
        validations:{userTypeName:'',userTypeCode:'',remark:''}
    }
    const [postUserType,setPostUserType]= useState(initaialUserTypeData);
    const [postUserTypeLoading, setPostUserTypeLoading] = useState<boolean>(false);

    const addUserType =useCallback(async () => {
  
  setPostUserTypeLoading(true);

  const response: ResponseModelWithValidation<any, any> = await UserManagementApis. addUserTypeInfo(postUserType?.data);
  
  setPostUserTypeLoading(false);
  
  setPostUserType((prevData: any) => ({
    ...prevData,
    validations: response.validations
  }));
  // appDispatch(userSession());
  handleResponse(response, () => {});
  if(response.isOk){
  setIsOpenAddPop(false);
  }
}, [ postUserType?.data]);

    return (
      <div className="w-full pt-4">
       
          <div className="grid grid-cols-1 gap-3">
            <ERPInput
              id="userTypeName"
               label="User type Name"
              placeholder="User Type Name"
              required={true}
              data={postUserType?.data}
              onChangeData={(data: any) => {
              
                setPostUserType((prevData: any) => ({
                  ...prevData,
                  data: data,
                }));
              }}
              value={postUserType?.data?.userTypeName}
              validation={postUserType?.validations?.userTypeName}
            />
            <ERPInput
              id="userTypeCode"
              label="user type code"
              placeholder="user type code"
              required={true}
             
              data={postUserType?.data}
              onChangeData={(data: any) =>
              {
                setPostUserType((prevData: any) => ({
                    ...prevData,
                    data: data,
                  }));
               
              }
                
              }
              value={postUserType?.data?.userTypeCode}
              validation={postUserType?.validations?.userTypeCode}
            />
            <ERPInput
              id="remark"
              label="Remark"
              placeholder="remark"
              required={true}
              data={postUserType?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUserType((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUserType?.data?.remark}
              validation={postUserType?.validations?.remark}
            />
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
            // disabled={emailLoading}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={postUserTypeLoading}
            variant="primary"
            onClick={addUserType}
            loading={postUserTypeLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    );
  };

  //add page popup for user grid
  export const PopUpModalAddUser = ({ setIsOpenAddUser}:any) => {
    const initaialUserData = {
        data:{userName:'',counterID:0,Password:'',
          confromPassword:'',userTypeCode:'',
          employeeID:0,maxDecimalPerAllowed:0,email:'',phoneNumber:'',displayName:''},
        validations:{userName:'',counterID:"",Password:'',
          confromPassword:'',userTypeCode:'',
          employeeID:'',maxDecimalPerAllowed:"",email:'',phoneNumber:'',displayName:''}
    }
    const [postUser,setPostUser]= useState(initaialUserData);
    const [postUserLoading, setPostUserLoading] = useState<boolean>(false);

    const addUser =useCallback(async () => {
  
  setPostUserLoading(true);

  const response: ResponseModelWithValidation<any, any> = await UserManagementApis.addUserSessions(postUser?.data);
  
  setPostUserLoading(false);
  
  setPostUser((prevData: any) => ({
    ...prevData,
    validations: response.validations
  }));
  // appDispatch(userSession());
  handleResponse(response, () => {});
  if(response.isOk){
    setIsOpenAddUser(false);
  }
}, [ postUser?.data]);

    return (
      <div className="p-10">
       
          <div className="grid  grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <ERPInput
              id="userName"
               label="User Name"
              placeholder="User Name"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) => {
              
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }));
              }}
              value={postUser?.data?.userName}
              validation={postUser?.validations?.userName}
            />
              < ERPDataCombobox
                      id="counterID"
                      field={{
                        id: "counterID",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostUser((prev: any) => ({
                          ...prev,
                          data: {
                            ...data,
                            counterID: Number(data.counterID),
                           
                          },
                        }))
                      }}
                    //   validation={postsetPostUser.validations.machineBrand}
                      data={postUser?.data}
                      defaultData={postUser?.data}
                      value={postUser != undefined && postUser?.data != undefined && postUser?.data?.counterID != undefined ? postUser?.data?.counterID : 0}
                      label="counterID"
                    />
            <ERPInput
              id="Password"
              label="Password"
              placeholder="Password"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.Password}
              validation={postUser?.validations?.Password}
            />

              <ERPInput
              id="confromPassword"
              label="confromPassword"
              placeholder="confromPassword"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.confromPassword}
              validation={postUser?.validations?.confromPassword}
            />

                      < ERPDataCombobox
                      id="userTypeCode"
                      field={{
                        id: "userTypeCode",
                        required: true,
                        getListUrl: Urls.getUserTypeCompo,
                        valueKey: "userTypeCode",
                        labelKey: "userTypeName",
                      }}
                      thunkAction= {usertypecompo}
                      reducer="Usertypecompo"
                      onChangeData={(data: any) => {
                        
                        setPostUser((prev: any) => ({
                          ...prev,
                          data: data
                        }))
                      }}
                    //   validation={postsetPostUser.validations.machineBrand}
                      data={postUser?.data}
                      defaultData={postUser?.data}
                      value={postUser != undefined && postUser?.data != undefined && postUser?.data?.userTypeCode != undefined ? postUser?.data?.userTypeCode : 0}
                      label="userTypeCode"
                    />


                    
                  < ERPDataCombobox
                      id="employeeID"
                      field={{
                        id: "employeeID",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostUser((prev: any) => ({
                          ...prev,
                          data: {
                            ...data,
                            employeeID: Number(data.employeeID),
                           
                          },
                        }))
                      }}
                    //   validation={postsetPostUser.validations.machineBrand}
                      data={postUser?.data}
                      defaultData={postUser?.data}
                      value={postUser != undefined && postUser?.data != undefined && postUser?.data?.employeeID != undefined ? postUser?.data?.employeeID : 0}
                      label="employeeID"
                    />

              <ERPInput
              id="maxDecimalPerAllowed"
              label="maxDecimalPerAllowed"
              placeholder="maxDecimalPerAllowed"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: {
                    ...data,
                    maxDecimalPerAllowed: Number(data.maxDecimalPerAllowed),
                   
                  },
                }))
               }
              }
              value={postUser?.data?.maxDecimalPerAllowed}
              validation={postUser?.validations?.maxDecimalPerAllowed}
            />

            <ERPInput
              id="email"
              label="email"
              placeholder="email"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.email}
              validation={postUser?.validations?.email}
            />

              <ERPInput
              id="phoneNumber"
              label="phoneNumber"
              placeholder="phoneNumber"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.phoneNumber}
              validation={postUser?.validations?.phoneNumber}
            />

              <ERPInput
              id="displayName"
              label="displayName"
              placeholder="displayName"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.displayName}
              validation={postUser?.validations?.displayName}
            />

          </div>
     
         

        
        <div className=" p-2 flex justify-end">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setIsOpenAddUser(false);
            //   setPostDataEmail({initialEmailData});
            }}
            // disabled={emailLoading}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={postUserLoading}
            variant="primary"
            onClick={addUser}
            loading={postUserLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    );
  };

  //edit page popup for usergrid

  export const PopUpModalEditUser = ({ setIsOpenEditUser}:any) => {
    const initaialUserData = {
        data:{userName:'',counterID:0,Password:'',
          confromPassword:'',userTypeCode:'',
          employeeID:0,maxDecimalPerAllowed:0,email:'',phoneNumber:'',displayName:''},
        validations:{userName:'',counterID:"",Password:'',
          confromPassword:'',userTypeCode:'',
          employeeID:'',maxDecimalPerAllowed:"",email:'',phoneNumber:'',displayName:''}
    }
    const [postUser,setPostUser]= useState(initaialUserData);
    const [postUserLoading, setPostUserLoading] = useState<boolean>(false);

    const addUser =useCallback(async () => {
  
  setPostUserLoading(true);

  const response: ResponseModelWithValidation<any, any> = await UserManagementApis.addUserSessions(postUser?.data);
  
  setPostUserLoading(false);
  
  setPostUser((prevData: any) => ({
    ...prevData,
    validations: response.validations
  }));
  // appDispatch(userSession());
  handleResponse(response, () => {});
  if(response.isOk){
    setIsOpenEditUser(false);
  }
}, [ postUser?.data]);

    return (
      <div className="max-w-[300px] p-5">
       
          <div className="grid  grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <ERPInput
              id="userName"
               label="User Name"
              placeholder="User Name"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) => {
              
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }));
              }}
              value={postUser?.data?.userName}
              validation={postUser?.validations?.userName}
            />
              < ERPDataCombobox
                      id="counterID"
                      field={{
                        id: "counterID",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostUser((prev: any) => ({
                          ...prev,
                          data: {
                            ...data,
                            counterID: Number(data.counterID),
                           
                          },
                        }))
                      }}
                    //   validation={postsetPostUser.validations.machineBrand}
                      data={postUser?.data}
                      defaultData={postUser?.data}
                      value={postUser != undefined && postUser?.data != undefined && postUser?.data?.counterID != undefined ? postUser?.data?.counterID : 0}
                      label="counterID"
                    />
            <ERPInput
              id="Password"
              label="Password"
              placeholder="Password"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.Password}
              validation={postUser?.validations?.Password}
            />

              <ERPInput
              id="confromPassword"
              label="confromPassword"
              placeholder="confromPassword"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.confromPassword}
              validation={postUser?.validations?.confromPassword}
            />

                  < ERPDataCombobox
                      id="userTypeCode"
                      field={{
                        id: "userTypeCode",
                        required: true,
                        getListUrl: Urls.getUserTypeCompo,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {usertypecompo}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostUser((prev: any) => ({
                          ...prev,
                          data: data
                        }))
                      }}
                    //   validation={postsetPostUser.validations.machineBrand}
                      data={postUser?.data}
                      defaultData={postUser?.data}
                      value={postUser != undefined && postUser?.data != undefined && postUser?.data?.userTypeCode != undefined ? postUser?.data?.userTypeCode : 0}
                      label="userTypeCode"
                    />

                    
                  < ERPDataCombobox
                      id="employeeID"
                      field={{
                        id: "employeeID",
                        required: true,
                        getListUrl: Urls.country,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      thunkAction= {countries}
                      reducer="CountriesData"
                      onChangeData={(data: any) => {
                        
                        setPostUser((prev: any) => ({
                          ...prev,
                          data: {
                            ...data,
                            employeeID: Number(data.employeeID),
                           
                          },
                        }))
                      }}
                    //   validation={postsetPostUser.validations.machineBrand}
                      data={postUser?.data}
                      defaultData={postUser?.data}
                      value={postUser != undefined && postUser?.data != undefined && postUser?.data?.employeeID != undefined ? postUser?.data?.employeeID : 0}
                      label="employeeID"
                    />

              <ERPInput
              id="maxDecimalPerAllowed"
              label="maxDecimalPerAllowed"
              placeholder="maxDecimalPerAllowed"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: {
                    ...data,
                    maxDecimalPerAllowed: Number(data.maxDecimalPerAllowed),
                   
                  },
                }))
               }
              }
              value={postUser?.data?.maxDecimalPerAllowed}
              validation={postUser?.validations?.maxDecimalPerAllowed}
            />

            <ERPInput
              id="email"
              label="email"
              placeholder="email"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.email}
              validation={postUser?.validations?.email}
            />

              <ERPInput
              id="phoneNumber"
              label="phoneNumber"
              placeholder="phoneNumber"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.phoneNumber}
              validation={postUser?.validations?.phoneNumber}
            />

              <ERPInput
              id="displayName"
              label="displayName"
              placeholder="displayName"
              required={true}
              data={postUser?.data}
              onChangeData={(data: any) =>
               {
             
                setPostUser((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
               }
              }
              value={postUser?.data?.displayName}
              validation={postUser?.validations?.displayName}
            />

          </div>
     
         

        
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setIsOpenEditUser(false);
            //   setPostDataEmail({initialEmailData});
            }}
            // disabled={emailLoading}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={postUserLoading}
            variant="primary"
            onClick={addUser}
            loading={postUserLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    );
  };