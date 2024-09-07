import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import ERPAvatar from "../../components/ERPComponents/erp-avatar";
import {
  useAppDynamicSelector,
} from "../../utilities/hooks/useAppDispatch";
import ERPCropper from "../../components/ERPComponents/erp-cropper";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";

import { countries, currencies, industries } from "../../redux/slices/data/thunk";
import {
  ActionType,
  ApiStateWithValidation,
} from "../../redux/types";
import { useDispatch } from "react-redux";
import {
  ResponseModelWithValidation,
} from "../../base/response-model";
import { useLocation } from "react-router-dom";
import "./profile.css";
import ERPModal from "../../components/ERPComponents/erp-modal";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import { postAction } from "../../redux/app-actions";

import emailImage from "../../assets/images/apps/email-us.44dad893243c82213359c6d8c7c8f201.svg";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import WorkspaceSettingsApis from "./workspace-settings-apis";

interface WorkSpaceSettingsProps {}
interface ProfileBasicInfo {
 

}

const WorkSpaceSettings: FC<WorkSpaceSettingsProps> = (props) => {
  let api = new APIClient();
  const [image, setImage] = useState<string>("#");
  const [phone, setPhone] = useState<string>("");
  const [_phone, set_Phone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [postEmail, setPostEmail] = useState<string>("");
  const [isOpenEmailChange, setIsOpenEmailChange] = useState<boolean>(false);
  const initialBasicInfoWithValidation = {
    data: {
      registeredName: null,
      nameInSecondLanguage: null,
      countryId: null,
      taxNumber: null,
      currencyId: null,
      industry: null,
    },
    validations: {
      registeredName: "",
      nameInSecondLanguage:  "",
      countryId:  "",
      taxNumber:  "",
      currencyId:  "",
      industry:  "",
    },
  };
  const dispatch = useDispatch();

  
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
 
  debugger;
  
  const [basicInfo, setBasicInfo] = useState<any>(initialBasicInfoWithValidation);  
  const [basicInfoLoading, setBasicInfoLoading] = useState<boolean>(false);

 
 
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [phoneLoading, setPhoneChangeLoading] = useState<boolean>(false);
  
  //////////////////////////////////////////////////////////////////////
  
  const getPhone = async () => {
    
    let res = await WorkspaceSettingsApis.getPhone();
    setPhone(res);
    set_Phone(res);
  };
  const changePhone = useCallback(async () => {
    setPhoneChangeLoading(true);
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({apiUrl:Urls.changePhone_workspace, data: {phone: phone}}) as any
    ).unwrap();
    
    setPhoneChangeLoading(false);
    handleResponse(response);
  }, [dispatch, phone]);
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

const getBasicInfo = async() => {
  let res = await WorkspaceSettingsApis.getUserBasicInfo();
    setBasicInfo((prevData: any) => ({
      ...prevData,
      data: res
    }))
}

const resetBasicInfo = useCallback(async () => {
  setBasicInfo(initialBasicInfoWithValidation);
}, [initialBasicInfoWithValidation]);

const updateBasicInfo = useCallback(async () => {
  debugger;
  setBasicInfoLoading(true);
  const response: ResponseModelWithValidation<any, any> = await WorkspaceSettingsApis.updateUserBasicInfo(basicInfo.data);
  debugger;
  setBasicInfoLoading(false);
  
  setBasicInfo((prevData: any) => ({
    ...prevData,
    validations: response.validations
  }));
  handleResponse(response, () => {});
}, [dispatch, basicInfo.data]);

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

  const postFormEmail = async () => {
    setEmailLoading(true);
      
      const response: ResponseModelWithValidation<any, any> =
        await WorkspaceSettingsApis.verifyEmail_profile({newValue: postEmail});
      
        setEmailLoading(false);
      handleResponse(response, () => {
        setIsOpenEmailChange(false);
      });
  };
  
  const getEmail = async () => {
    debugger;
    let res = await WorkspaceSettingsApis.getEmail();
    debugger;
    setEmail(res);
  };

  /////////////////////////////////////////////////////////////////////
  const onImageSuccess = useMemo(() => {
    
    return (url: string) => {
      setImage(url);
    };
  }, []);
  useEffect(() => {
    getBasicInfo();
    getEmail();
    getPhone();
    api.get(Urls.getLogo_workspace).then((url) => {
      setImage(url);
    });
  }, []);

  const PopUpModalEmailChange = () => {
    return (
      <div className="w-full pt-4">
          <div className="grid grid-cols-1 gap-3">
           
            <ERPInput
              id="newValue"
              type="newValue"
              placeholder="New Email"
              required={true}
              data={{newValue:postEmail}}
              onChangeData={(data: any) =>
              {debugger;setPostEmail(data.newValue)}
              }
              value={postEmail}
            />
          </div>
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setIsOpenEmailChange(false);
            }}
            disabled={emailLoading}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={emailLoading}
            variant="primary"
            onClick={postFormEmail}
            loading={emailLoading}
            title={
              "Update"
            }
          ></ERPButton>
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div></div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div
              id="avatar"
              className={`xxl:col-span-12 xl:col-span-12 ${
                path === "avatar" ? "blink" : ""
              } col-span-12`}
            >
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                  Workspace Logo
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    Customize the way your Business logo will look to others. Please note that this logo will appear on documents such as Invoice, Estimates and Receipts
                    </p>
                  </div>
                </div>
                <div className="box-body">
                  <div className="flex items-start justify-between mb-6">
                    <div className="sm:flex items-start items-center">
                      <div>
                        <span className="avatar avatar-xxl avatar-badge">
                          <ERPAvatar
                            variant="square"
                            alt="Remy Sharp"
                            src={image}
                            sx={useMemo(() => {
                              return { width: 75, height: 75 };
                            }, [])}
                          />
                        </span>
                      </div>
                      <div className="flex-grow p-2">
                        <div className="flex items-center !justify-between">
                          <h6 className="font-semibold mb-1  text-[1rem]">
                            Json Taylor
                          </h6>
                        </div>
                        {/* <p className="mb-1 opacity-[0.7]">
                          Chief Executive Officer (C.E.O)
                        </p> */}
                      </div>
                    </div>
                    <div className="sm:flex items-top p-6">
                      <ERPCropper
                        apiUrl="/Subscription/WorkSpace/UploadCompanyLogo"
                        onImageSuccess={onImageSuccess}
                         useCircle={false}
                      ></ERPCropper>
                         {/* Maximum 5MB in size.
JPG, PNG, or GIF formats.
Recommended size: 300 x 300 pixels. */}
                    {/* </div>
                   
                    <div> */}
                  
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="email-address"
              className={`xxl:col-span-12 xl:col-span-12 ${
                path === "email-address" ? "blink" : ""
              } col-span-12`}
            >
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                  Primary Email Address
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    This email address is used for all inquiries and prominently displayed on our invoices, estimates, and purchase orders.
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                  <div className="sm:flex items-start items-center">
                      <span className="avatar avatar-lg avatar-badge border border-blue-500 p-1">
                        <img src={emailImage} />
                      </span>
                      <div className="flex-grow p-2">
                        <div className="flex items-center !justify-between">
                          <h6 className="font-semibold mb-1  text-[.75rem]">
                            {email?email:""}
                          </h6>
                        </div>
                        {/* <p className="mb-1 opacity-[0.7] text-[.65rem]">
                         modified a month ago
                        </p> */}
                      </div>
                    </div>

                    <ERPButton
                      title="Add Primary Email Address"
                      onClick={() => {
                        setIsOpenEmailChange(!isOpenEmailChange);
                      }}
                      variant="primary"
                    ></ERPButton>
                  </div>
                </div>
              </div>
              <ERPModal
                isOpen={isOpenEmailChange}
                title={"Update Email"}
                isForm={true}
                closeModal={() => {
                  setIsOpenEmailChange(false);
                }}
                content={PopUpModalEmailChange()}
              />
            </div>
            <div
              id="phone-number"
              className={`xxl:col-span-12 xl:col-span-12 ${
                path === "phone-number" ? "blink" : ""
              } col-span-12`}
            >
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                  Business Phone Number
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    View and manage the mobile number associated with your account. Please note that we do not currently support the verification of mobile numbers.
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                  <ERPInput
                      id="phone"
                      placeholder="Pleas Enter Phone Number"
                      required={true}
                      value={phone}
                      data={{phone: phone}}
                      onChangeData={(data: any) =>
                      {
                        setPhone(data.phone)
                      }
                      }
                    />
 <div className="w-full p-2 flex justify-end">
                    <ERPButton
                      title={
                        phone != undefined && phone != null && phone != ""
                          ? "Update"
                          : "Add Phone"
                      }
                      disabled={phone == _phone}
                      onClick={changePhone}
                      variant="primary"
                    ></ERPButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">
          <div
            id="basic-information"
            className={`xxl:col-span-12 xl:col-span-12 ${
              path === "basic-information" ? "blink" : ""
            } col-span-12`}
          >
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  Basic Information
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                  Provide as much or as little information about your Business. Biz will never share or sell information or identifiable details.
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ERPInput
                    id="registeredName"
                    label="Business Name"
                    placeholder="Eg: Novalabs"
                    required={true}
                    data={basicInfo.data}
                    onChangeData={(data: any) => {
                      debugger;
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                    validation={basicInfo.validations?.registeredName}
                    value={
                      basicInfo?.data?.registeredName
                        ? basicInfo?.data?.registeredName
                        : ""
                    }
                  />
                   <ERPInput
                    id="nameInSecondLanguage"
                    label="Name in second language"
                    placeholder="Eg: Novalabs"
                    required={true}
                    data={basicInfo.data}
                    onChangeData={(data: any) => {
                      debugger;
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                  
                    validation={basicInfo.validations?.nameInSecondLanguage}
                    value={
                      basicInfo?.data?.nameInSecondLanguage
                        ? basicInfo?.data?.nameInSecondLanguage
                        : ""
                    }
                  />
                  <ERPDataCombobox
                    id="countryId"
                    field={{
                      id: "countryId",
                      required: true,
                      getListUrl: Urls.country,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChangeData={(data: any) => {
                      
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                    validation={basicInfo.validations?.countryId}
                    thunkAction= {countries}
                    reducer="CountriesData"
                    data={basicInfo.data}
                    defaultData={basicInfo.data}
                    value={basicInfo.data.countryId}
                    label="Country"
                  />
                   <ERPDataCombobox
                    id="currencyId"
                    field={{
                      id: "currencyId",
                      required: true,
                      getListUrl: Urls.currency,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    thunkAction= {currencies}
                    reducer="Curencies"
                    onChangeData={(data: any) => {
                      debugger;
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                    validation={basicInfo?.validations?.currencyId}
                    data={basicInfo?.data}
                    defaultData={basicInfo?.data}
                    value={basicInfo?.data?.currencyId}
                    label="Business Currency"
                  />
                   <ERPDataCombobox
                    id="industry"
                    field={{
                      id: "industry",
                      required: true,
                      getListUrl: Urls.industry,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    thunkAction= {industries}
                    reducer="Industries"
                    onChangeData={(data: any) => {
                      
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                    validation={basicInfo.validations?.industry}
                    data={basicInfo.data}
                    defaultData={basicInfo.data}
                    value={basicInfo.data.industry}
                    label="Industry"
                  />
                  {/* <ERPDataCombobox
                    id="countryCode"
                    field={{
                      id: "countryCode",
                      required: true,
                      getListUrl: Urls.country,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChange={(value: any) => {
                      dispatch(
                        basicInfoSlice.actions.updateDataByKey({
                          key: "countryCode",
                          value: value.value,
                        })
                      );
                    }}
                    validation={_basicInfo.validations?.countryCode}
                    data={_basicInfo.data}
                    defaultData={_basicInfo.data}
                    value={_basicInfo.data.countryCode}
                    label="Number of Employees"
                  /> */}
                  {/* <ERPInput
                    id="fullName ⑦"
                    label="Business ID"
                    placeholder="Eg: 58733"
                    required={true}
                    data={_basicInfo.data}
                    onChangeData={(data: any) => {
                      dispatch(basicInfoSlice.actions.updateData(data));
                    }}
                    validation={_basicInfo.validations?.fullName}
                    value={
                      _basicInfo?.data?.fullName
                        ? _basicInfo?.data?.fullName
                        : ""
                    }
                  /> */}
                  <ERPInput
                    id="taxNumber"
                    label="Tax identification Number"
                    placeholder="Eg: 58733"
                    required={true}
                    data={basicInfo.data}
                    onChangeData={(data: any) => {
                      debugger;
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                    validation={basicInfo.validations?.taxNumber}
                    value={
                      basicInfo?.data?.taxNumber
                        ? basicInfo?.data?.taxNumber
                        : ""
                    }
                  />
                  {/* <ERPDateInput
                    id="dob"
                    field={{ type: "date", id: "dob", required: true }}
                    label={"Date of Birth"}
                    data={_basicInfo.data}
                    handleChange={(id: any, value: any) =>
                      dispatch(
                        basicInfoSlice.actions.updateDataByKey({
                          key: id,
                          value: value,
                        })
                      )
                    }
                    validation={_basicInfo.validations?.dob}
                  /> */}
                  <div className="w-full p-2 flex justify-end">
                    <ERPButton
                      title="Cancel"
                      onClick={resetBasicInfo}
                      type="reset"
                    ></ERPButton>
                    <ERPButton
                      title="Save Changes"
                      onClick={updateBasicInfo}
                      variant="primary"
                      loading={basicInfoLoading}
                      disabled={basicInfoLoading}
                    ></ERPButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default WorkSpaceSettings;
