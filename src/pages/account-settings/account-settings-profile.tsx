import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import ERPAvatar from "../../components/ERPComponents/erp-avatar";
import ERPCropper from "../../components/ERPComponents/erp-cropper";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPDateInput from "../../components/ERPComponents/erp-date-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ActionType, ApiState } from "../../redux/types";
import { useDispatch } from "react-redux";
import emailImage from "../../assets/images/apps/email-us.44dad893243c82213359c6d8c7c8f201.svg";
import { ResponseModelWithValidation } from "../../base/response-model";
import { useLocation } from "react-router-dom";
import "./profile.css";
import ERPModal from "../../components/ERPComponents/erp-modal";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import { postAction } from "../../redux/app-actions";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import AccountSettingsApis from "./account-settings-apis";
import { Validation } from "devextreme-react/cjs/gantt";

interface AccountSettingsProps {}
interface UserProfileBasicInfo {
  displayName?: string | null; // Represents the full name as a string
  dob?: Date | null; // Represents the date of birth as a Date object
  nationality?: string | null; // Represents the country code as a string
}
let api = new APIClient();
const AccountSettingsProfile: FC<AccountSettingsProps> = (props) => {
  const initialBasicInfoWithValidation = {
    data: {
      nationality: null,
      dob: null,
      displayName: null,
    },
    validations: {
      nationality: "",
      dob: "",
      displayName: "",
    },
  };
  const [image, setImage] = useState<string>("#");
  debugger;
  
  const [basicInfo, setBasicInfo] = useState<any>(initialBasicInfoWithValidation);  
  const [basicInfoLoading, setBasicInfoLoading] = useState<boolean>(false);

  const [isOpenEmailChange, setIsOpenEmailChange] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [postDataEmail, setPostDataEmail] = useState<any>({
    data: { userName: "", password: "", newValue: "" },
    validations: { userName: "", password: "", newValue: "" },
    tokenSend: false,
  });
  const [postDataEmailTokenVerify, setPostDataEmailTokenVerify] = useState<any>(
    { userName: "", newValue: "", otp: "", confirToken: "" }
  );

  
  const [phone, setPhone] = useState<string>("");
  const [_phone, set_Phone] = useState<string>("");
  const [phoneLoading, setPhoneChangeLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  
  //////////////////////////////////////////////////////////////////////
  
  const getPhone = async () => {
    
    let res = await AccountSettingsApis.getPhone();
    setPhone(res);
    set_Phone(res);
  };
  const changePhone = useCallback(async () => {
    setPhoneChangeLoading(true);
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({apiUrl:Urls.changePhone, data: {phone: phone}}) as any
    ).unwrap();
    
    setPhoneChangeLoading(false);
    handleAxiosResponse(response);
  }, [dispatch, phone]);
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

const getBasicInfo = async() => {
  let res = await AccountSettingsApis.getUserBasicInfo();
    setBasicInfo((prevData: any) => ({
      ...prevData,
      data: res
    }))
}

const resetBasicInfo = useCallback(async () => {
  // setBasicInfo(initialBasicInfoWithValidation);
}, [initialBasicInfoWithValidation]);

const updateBasicInfo = useCallback(async () => {
  debugger;
  setBasicInfoLoading(true);
  const response: ResponseModelWithValidation<any, any> = await AccountSettingsApis.updateUserBasicInfo(basicInfo?.data);
  debugger;
  setBasicInfoLoading(false);
  
  setBasicInfo((prevData: any) => ({
    ...prevData,
    validations: response.validations
  }));
  handleResponse(response, () => {});
}, [dispatch, basicInfo?.data]);

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

  const postFormEmail = async () => {
    if (postDataEmail.tokenSend) {
      await verifyFormEmail();
    } else {
      setEmailLoading(true);
      
      const response: ResponseModelWithValidation<any, any> =
        await AccountSettingsApis.verifyEmail_profile(postDataEmail?.data);
      
        setEmailLoading(false);
      handleResponse(response, () => {
        setPostDataEmail((prevData: any) => ({ ...prevData, tokenSend: true }));
        setPostDataEmailTokenVerify((prevData: any) => ({
          ...prevData,
          userName: response.item.userName,
          newValue: response.item.newValue,
          confirToken: response.item.token,
        }));
      });
    }
  };
  const verifyFormEmail = async () => {
    
    setEmailLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await AccountSettingsApis.changeEmailRequest_profile(
        postDataEmailTokenVerify
      );
    
    setEmailLoading(false);
    handleResponse(response, () => {
      setIsOpenEmailChange(false);
      setPostDataEmail({});
      getEmail();
    });
  };
  const getEmail = async () => {
    
    let res = await AccountSettingsApis.getEmail();
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
    api.get(Urls.getImage_profile).then((url) => {
      setImage(url);
    });
  }, []);

  const PopUpModalEmailChange = () => {
    return (
      <div className="w-full pt-4">
        {postDataEmail && postDataEmail.tokenSend != true ? (
          <div className="grid grid-cols-1 gap-3">
            <ERPInput
              id="userName"
              type="email"
              placeholder="Current Email"
              required={true}
              data={postDataEmail?.data}
              onChangeData={(data: any) => {
                setPostDataEmail((prevData: any) => ({
                  ...prevData,
                  data: data,
                }));
              }}
              value={postDataEmail?.data?.userName}
            />
            <ERPInput
              id="password"
              placeholder="Password"
              required={true}
              value={postDataEmail?.data?.password}
              data={postDataEmail?.data}
              onChangeData={(data: any) =>
                setPostDataEmail((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
              }
            />
            <ERPInput
              id="newValue"
              type="email"
              placeholder="New Email"
              required={true}
              data={postDataEmail?.data}
              onChangeData={(data: any) =>
                setPostDataEmail((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
              }
              value={postDataEmail?.data?.newValue}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <p>
              Pls Enter the verification code you received to your email{" "}
              {postDataEmail?.data.newValue}
            </p>
            <ERPInput
              id="otp"
              placeholder="Pleas Enter Verification Code"
              required={true}
              value={postDataEmailTokenVerify?.otp}
              data={postDataEmailTokenVerify}
              onChangeData={(data: any) =>
              {
                
                setPostDataEmailTokenVerify(
                  data
                )
              }
              }
            />
          </div>
        )}
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setIsOpenEmailChange(false);
              setPostDataEmail({});
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
              postDataEmail && postDataEmail.tokenSend != true
                ? "Update"
                : "Verify"
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
                    Provide as much or as little information as you’d like. we
                    will never share or sell individual personal information or
                    personally identifiable details.
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ERPInput
                    id="displayName"
                    label="Display Name"
                    placeholder="Display Name"
                    required={true}
                    data={basicInfo?.data}
                    onChangeData={(data: any) => {
                      debugger;
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: data
                      }))
                    }}
                    validation={basicInfo.validations?.displayName}
                    value={
                      basicInfo?.data?.displayName
                        ? basicInfo?.data?.displayName
                        : ""
                    }
                  />
                  <ERPDataCombobox
                    id="nationality"
                    field={{
                      id: "nationality",
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
                    validation={basicInfo.validations.nationality}
                    data={basicInfo?.data}
                    defaultData={basicInfo?.data}
                    value={basicInfo != undefined && basicInfo?.data != undefined && basicInfo?.data?.nationality != undefined ? basicInfo?.data?.nationality : 0}
                    label="Country"
                  />
                  <ERPDateInput
                    id="dob"
                    field={{ type: "date", id: "dob", required: true }}
                    label={"Date of Birth"}
                    data={basicInfo?.data}
                    handleChange={(id: any, value: any) =>
                    {
                      
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [id]: value
                        }
                      }));
                    }
                    }
                    validation={basicInfo.validations.dob}
                  />
                  <div className="w-full p-2 flex justify-end">
                    <ERPButton
                      title="Reset"
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

export default AccountSettingsProfile;
