import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import ERPAvatar from "../../components/ERPComponents/erp-avatar";
import {
  useAppDispatch,
  useAppDynamicSelector,
} from "../../utilities/hooks/useAppDispatch";
import ERPCropper from "../../components/ERPComponents/erp-cropper";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPDatePicker from "../../components/ERPComponents/erp-date-picker";
import ERPDateInput from "../../components/ERPComponents/erp-date-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { getThunkAndSlice, getThunkAndSliceWithValidation } from "../../redux/slices/dynamicThunkAndSlice";
import { ActionType, ApiState, ApiStateWithValidation } from "../../redux/types";
import { useDispatch } from "react-redux";
import emailImage from "../../assets/images/apps/email-us.44dad893243c82213359c6d8c7c8f201.svg";
import { ResponseModel, ResponseModelWithValidation } from "../../base/response-model";
import { useLocation } from "react-router-dom";
import './profile.css'; 
import SBModelForm from "../../components/common/polosys/sb-model-form";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";
import ERPModal from "../../components/ERPComponents/erp-modal";

interface AccountSettingsProps {}
interface UserProfileBasicInfo {
  fullName?: string | null; // Represents the full name as a string
  dob?: Date | null; // Represents the date of birth as a Date object
  countryCode?: string | null; // Represents the country code as a string
}

const AccountSettings: FC<AccountSettingsProps> = (props) => {
  const [image, setImage] = useState<string>("#");
  const [isOpenEmailChange, setIsOpenEmailChange] = useState<boolean>(false);
  const [isOpenPhoneChange, setIsOpenPhoneChange] = useState<boolean>(false);
  const [postDataEmail, setPostDataEmail] = useState<any>();
  const [postDataPhone, setPostDataPhone] = useState<any>();
  const initialBasicInfoWithValidation = {
    data: {
      countryCode: null,
      dob: null,
      fullName: null,
    },
    validations: {
      countryCode: '',
      dob: '',
      fullName: "",
    },
  };
  const dispatch = useDispatch();
  debugger;
  ////////////email change
  const { thunk: postFormEmailThunk } =
  getThunkAndSlice<any>(
    Urls.updateUserBasicInfo,
    ActionType.POST,
    false,
    {data:{userName:'',password:'',newValue:''}, loading: false}
  );
const updatedFormDataEmail: any = useAppDynamicSelector(
  Urls.updateUserBasicInfo,
  ActionType.POST
);
////Basic InfoUpdate
  const { thunk: getUserBasicInfoThunk, slice: basicInfoSlice } =
    getThunkAndSliceWithValidation<UserProfileBasicInfo, any>(
      Urls.getUserBasicInfo,
      ActionType.GET,
      false,
      initialBasicInfoWithValidation,
      true
    );
  const _basicInfo: ApiStateWithValidation<any, any> = useAppDynamicSelector(
    Urls.getUserBasicInfo,
    ActionType.GET,
    false
  );
  debugger;
  const { thunk: updateUserBasicInfoThunk } =
    getThunkAndSlice<UserProfileBasicInfo>(
      Urls.updateUserBasicInfo,
      ActionType.POST,
      false,
      { data: { countryCode: "", dob: null, fullName: "" }, loading: false }
    );
  const updatedUserBasicInfo: any = useAppDynamicSelector(
    Urls.updateUserBasicInfo,
    ActionType.POST
  );
  const location = useLocation();
  const path = location.pathname.split('/').pop(); // Extract the last part of the route

  useEffect(() => {
    dispatch(getUserBasicInfoThunk());
  }, []);
  const onImageSuccess = useMemo(() => {
    return (url: string) => {
      debugger;
      setImage(url);
    };
  }, []);
  const resetBasicInfo = useCallback(async () => {
    await dispatch(basicInfoSlice.actions.updateData(initialBasicInfoWithValidation));
  }, [dispatch, _basicInfo]);
  const updateBasicInfo = useCallback(async () => {
    debugger;
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      updateUserBasicInfoThunk(_basicInfo.data)
    ).unwrap();
    debugger;
    if (response.isOk !== true) {
      await dispatch(basicInfoSlice.actions.updateValidation(response.validations));
    }
    else{
      
      await dispatch(basicInfoSlice.actions.updateData(initialBasicInfoWithValidation));
    }
  }, [dispatch, _basicInfo]);
  const onSubmitEmail = useCallback(async () => {
    await dispatch(basicInfoSlice.actions.updateData(initialBasicInfoWithValidation));
  }, [dispatch, _basicInfo]);
  const PopUpModalEmailChange = () => {
    return (
      <div className="w-full pt-4">
        <form
          onSubmit={(e) => {
            e?.preventDefault();
            onSubmitEmail();
          }}
        >
          <div className="grid grid-cols-1 gap-3">
            <ERPInput
              id="email"
              type="email"
              placeholder="Current Email"
              required={true}
              data={postDataEmail}
              onChangeData={(data: any) => setPostDataEmail((prevData: any) => ({ ...prevData, ...data }))}
              value={postDataEmail?.userName }
            />
            <ERPInput
              id="password"
              placeholder="Currency Name"
              required={true}
              value={postDataEmail?.password}
              data={postDataEmail}
              onChangeData={(data: any) => setPostDataEmail((prevData: any) => ({ ...prevData, ...data }))}
            />
             <ERPInput
              id="newemail"
              type="email"
              placeholder="New Email"
              required={true}
              data={postDataEmail}
              onChangeData={(data: any) => setPostDataEmail((prevData: any) => ({ ...prevData, ...data }))}
              value={postDataEmail?.newValue }
            />
          </div>
          <div className="flex gap-3 mt-5">
            <ERPSubmitButton type="submit" loading={updatedFormDataEmail?.loading}>
              Save
            </ERPSubmitButton>
            <ERPSubmitButton
              type="reset"
              varient="secondary"
              onClick={() => {
                setIsOpenEmailChange(false);
                setPostDataEmail({});
              }}
              disabled={updatedFormDataEmail?.loading}
            >
              Cancel
            </ERPSubmitButton>
          </div>
        </form>
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
            <div id="avatar" className={`xxl:col-span-12 xl:col-span-12 ${path === 'avatar' ? 'blink' : ''} col-span-12`}>
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Avatar
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      Customize the way you will look to other users when they
                      see you in we. You can use your own photos or some custom
                      made avatars from us.
                    </p>
                  </div>
                </div>
                <div className="box-body">
                  <div className="flex items-start justify-between mb-6">
                    <div className="sm:flex items-start items-center">
                      <div>
                        <span className="avatar avatar-xxl avatar-rounded ">
                          <ERPAvatar
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
                        <p className="mb-1 opacity-[0.7]">
                          Chief Executive Officer (C.E.O)
                        </p>
                      </div>
                    </div>
                    <div className="sm:flex items-center p-6">
                      <ERPCropper
                        apiUrl="/Subscription/Profile/UploadUserImage"
                        onImageSuccess={onImageSuccess}
                        useCircle
                      ></ERPCropper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="email-address" className={`xxl:col-span-12 xl:col-span-12 ${path === 'email-address' ? 'blink' : ''} col-span-12`}>
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    My Email Address
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      You can use the following email addresses to sign in to
                      your account and also to reset your password if you ever
                      forget it.
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
                            Json Taylor
                          </h6>
                        </div>
                        <p className="mb-1 opacity-[0.7] text-[.65rem]">
                          Chief Executive Officer (C.E.O)
                        </p>
                      </div>
                    </div>

                    <ERPButton
                      title="Change Primary Email Address"
                      onClick={() =>{
                        setIsOpenEmailChange(!isOpenEmailChange)
                      }
                    }
                      loading={updatedUserBasicInfo.loading}
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
                  setPostDataEmail({});
                }}
                content={PopUpModalEmailChange()}
              />
            </div>
            <div id="phone-number" className={`xxl:col-span-12 xl:col-span-12 ${path === 'phone-number' ? 'blink' : ''} col-span-12`}>
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Mobile Number
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      View and manage the mobile number associated with your
                      account. Please note that we need to verify your mobile
                      number for updating.
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
                            Json Taylor
                          </h6>
                        </div>
                        <p className="mb-1 opacity-[0.7] text-[.65rem]">
                          Chief Executive Officer (C.E.O)
                        </p>
                      </div>
                    </div>

                    <ERPButton
                      title="Change Primary Email Address"
                      onClick={updateBasicInfo}
                      loading={updatedUserBasicInfo.loading}
                    ></ERPButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">
        <div id="basic-information" className={`xxl:col-span-12 xl:col-span-12 ${path === 'basic-information' ? 'blink' : ''} col-span-12`}>
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
                    id="fullName"
                    label="Display Name"
                    placeholder="Display Name"
                    required={true}
                    data={_basicInfo.data}
                    onChangeData={(data: any) =>
                     {
                      debugger;
                      dispatch(basicInfoSlice.actions.updateData(data))
                     }
                    }
                    validation={_basicInfo.validations.fullName}
                    value={_basicInfo?.data?.fullName ? _basicInfo?.data?.fullName : ""}
                  />
                  <ERPDataCombobox
                    id="countryCode"
                    field={{
                      id: "countryCode",
                      required: true,
                      getListUrl: Urls.country,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChange={(value: any) => {
                      dispatch(basicInfoSlice.actions.updateDataByKey({key:'countryCode', value: value.value}))
                    }}
                    validation={_basicInfo.validations.countryCode}
                    data={_basicInfo.data}
                    defaultData={_basicInfo.data}
                    value={_basicInfo.data.countryCode}
                    label="Country"
                  />
                  <ERPDateInput
                  id='dob'
                    field={{ type: "date", id: "dob", required: true }}
                    label={"Date of Birth"}
                    data={_basicInfo.data}
                    handleChange={(id: any, value: any) =>
                      dispatch(basicInfoSlice.actions.updateDataByKey({key:id, value: value}))
                    }
                    validation={_basicInfo.validations.dob}
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
                      loading={updatedUserBasicInfo.loading}
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

export default AccountSettings;
