import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import ERPAvatar from "../../components/ERPComponents/erp-avatar";
import { useAppDispatch, useAppSelector, } from "../../utilities/hooks/useAppDispatch";
import ERPCropper from "../../components/ERPComponents/erp-cropper";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation, } from "../../base/response-model";
import { useLocation } from "react-router-dom";
import "./profile.css";
import ERPModal from "../../components/ERPComponents/erp-modal";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import { postAction } from "../../redux/slices/app-thunks";
import emailImage from "../../assets/images/apps/email-us.44dad893243c82213359c6d8c7c8f201.svg";
import WorkspaceSettingsApis from "./workspace-settings-apis";
import { RootState } from "../../redux/store";
import { userSession } from "../../redux/slices/user-session/thunk";
import { useTranslation } from "react-i18next";

interface WorkSpaceSettingsProps { }

const WorkSpaceSettings: FC<WorkSpaceSettingsProps> = (props) => {
  let _userSession = useAppSelector((state: RootState) => state.UserSession) as any;
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
      nameInSecondLanguage: "",
      countryId: "",
      taxNumber: "",
      currencyId: "",
      industry: "",
    },
  };
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation('main')
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  const [basicInfo, setBasicInfo] = useState<any>(initialBasicInfoWithValidation);
  const [basicInfoLoading, setBasicInfoLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [phoneLoading, setPhoneChangeLoading] = useState<boolean>(false);
  //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (
      _userSession &&
      _userSession?.companies &&
      Array.isArray(_userSession?.companies)
    ) {
      const company = _userSession?.companies.find(
        (x: any) => x?.id === _userSession?.currentClientId
      );
      if (company && company.logo) {
        setImage(company.logo);
      }
    }
  }, [_userSession?.companies]);

  const getPhone = async () => {
    let res = await WorkspaceSettingsApis.getPhone();
    setPhone(res);
    set_Phone(res);
  };

  const changePhone = useCallback(async () => {
    setPhoneChangeLoading(true);
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({ apiUrl: Urls.changePhone_workspace, data: { phone: phone } }) as any
    ).unwrap();
    setPhoneChangeLoading(false);
    handleResponse(response);
  }, [dispatch, phone]);

  const changeEmail = useCallback(async () => {
    setEmailLoading(true);
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({ apiUrl: Urls.updateCompanyEmail_workspace, data: { newValue: postEmail } }) as any
    ).unwrap();
    setEmailLoading(false);
    handleResponse(response, () => {
      setIsOpenEmailChange(false);
      getEmail();
    });
  }, [dispatch, postEmail]);
  ////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////

  const getBasicInfo = async () => {
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
    setBasicInfoLoading(true);
    const response: ResponseModelWithValidation<any, any> = await WorkspaceSettingsApis.updateUserBasicInfo(basicInfo.data);
    setBasicInfoLoading(false);
    setBasicInfo((prevData: any) => ({
      ...prevData,
      validations: response.validations
    }));
    appDispatch(userSession());
    if (response.isOk) {
      // await dispatch(userSession());
    }
    handleResponse(response, () => {

    });
  }, [dispatch, basicInfo.data, userSession]);

  /////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////

  const postFormEmail = async () => {
    setEmailLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await WorkspaceSettingsApis.verifyEmail_profile({ newValue: postEmail });
    setEmailLoading(false);
    handleResponse(response, () => {
      setIsOpenEmailChange(false);
    });
  };

  const getEmail = async () => {
    let res = await WorkspaceSettingsApis.getEmail();
    setEmail(res);
  };

  /////////////////////////////////////////////////////////////////////
  const onImageSuccess = useMemo(() => {
    return (url: string) => {
      appDispatch(userSession());
    };
  }, []);

  useEffect(() => {
    getBasicInfo();
    getEmail();
    getPhone();
  }, []);

  const PopUpModalEmailChange = () => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-3">
          <ERPInput
            id="newValue"
            type="newValue"
            placeholder={t("new_email")}
            required={true}
            data={{ newValue: postEmail }}
            onChangeData={(data: any) => { setPostEmail(data.newValue) }}
            value={postEmail}
          />
        </div>
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title={t("cancel")}
            variant="secondary"
            onClick={() => { setIsOpenEmailChange(false); }}
            disabled={emailLoading}
          />
          <ERPButton
            type="button"
            disabled={emailLoading}
            variant="primary"
            onClick={changeEmail}
            loading={emailLoading}
            title={t("update")}
          />
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div id="avatar" className={`xxl:col-span-12 xl:col-span-12 ${path === "avatar" ? "blink" : ""} col-span-12`}>
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {t("workspace_logo")}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      {t("business_logo_description")}
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
                            src={typeof image === 'string' ? image : ''}
                            sx={{ width: 75, height: 75 }}
                          />
                        </span>
                      </div>
                      <div className="flex-grow p-2">
                        <div className="flex items-center !justify-between">
                          <h6 className="font-semibold mb-1  text-[1rem]">
                            {_userSession?.currentClientName}
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="email-address" className={`xxl:col-span-12 xl:col-span-12 ${path === "email-address" ? "blink" : ""} col-span-12`}>
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {t("primary_email_address")}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      {t("inquiry_email_description")}
                    </p>
                  </div>
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
                            {email ? email : ""}
                          </h6>
                        </div>
                        {/* <p className="mb-1 opacity-[0.7] text-[.65rem]">
                         modified a month ago
                        </p> */}
                      </div>
                    </div>

                    <ERPButton
                      title={t("add_primary_email_address")}
                      onClick={() => { setIsOpenEmailChange(!isOpenEmailChange); }}
                      variant="primary"
                    />
                  </div>
                </div>
              </div>
              <ERPModal
                isOpen={isOpenEmailChange}
                title={t("update_email")}
                isForm={true}
                closeModal={() => { setIsOpenEmailChange(false); }}
                content={PopUpModalEmailChange()}
              />
            </div>

            <div id="phone-number" className={`xxl:col-span-12 xl:col-span-12 ${path === "phone-number" ? "blink" : ""} col-span-12`} >
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {t("business_phone_number")}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      {t("mobile_number_description")}
                    </p>
                  </div>
                </div>

                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                    <ERPInput
                      id="phone"
                      placeholder={t("please_enter_phone_number")}
                      required={true}
                      value={phone}
                      data={{ phone: phone }}
                      onChangeData={(data: any) => { setPhone(data.phone) }}
                    />
                    <div className="w-full p-2 flex justify-end">
                      <ERPButton
                        title={
                          phone != undefined && phone != null && phone != ""
                            ? t("update")
                            : t("add_phone")
                        }
                        disabled={phone == _phone}
                        onClick={changePhone}
                        variant="primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">
          <div id="basic-information" className={`xxl:col-span-12 xl:col-span-12 ${path === "basic-information" ? "blink" : ""} col-span-12`} >
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  {t("basic_information")}
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    {t("business_info_description")}
                  </p>
                </div>
              </div>

              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ERPInput
                    id="registeredName"
                    label={t("business_name")}
                    placeholder={t("eg:novalabs")}
                    required={true}
                    data={basicInfo.data}
                    onChangeData={(data: any) => { setBasicInfo((prev: any) => ({ ...prev, data: data })) }}
                    validation={basicInfo.validations?.registeredName}
                    value={
                      basicInfo?.data?.registeredName
                        ? basicInfo?.data?.registeredName
                        : ""
                    }
                  />
                  <ERPInput
                    id="nameInSecondLanguage"
                    label={t("name_in_second_language")}
                    placeholder={t("eg:novalabs")}
                    data={basicInfo.data}
                    onChangeData={(data: any) => { setBasicInfo((prev: any) => ({ ...prev, data: data })) }}
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
                      getListUrl: Urls.data_countries,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChangeData={(data: any) => { setBasicInfo((prev: any) => ({ ...prev, data: data })) }}
                    validation={basicInfo.validations?.countryId}
                    data={basicInfo.data}
                    defaultData={basicInfo.data}
                    label={t("country")}
                  />
                  <ERPDataCombobox
                    id="currencyId"
                    field={{
                      id: "currencyId",
                      getListUrl: Urls.data_currencies,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChangeData={(data: any) => { setBasicInfo((prev: any) => ({ ...prev, data: data })) }}
                    validation={basicInfo?.validations?.currencyId}
                    data={basicInfo?.data}
                    defaultData={basicInfo?.data}
                    label={t("business_currency")}
                  />
                  <ERPDataCombobox
                    id="industry"
                    field={{
                      id: "industry",
                      required: true,
                      getListUrl: Urls.data_industries,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChangeData={(data: any) => { setBasicInfo((prev: any) => ({ ...prev, data: data })) }}
                    validation={basicInfo.validations?.industry}
                    data={basicInfo.data}
                    defaultData={basicInfo.data}
                    label={t("industry")}
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
                    label={t("tax_identification_number")}
                    placeholder={t("eg:58733")}
                    data={basicInfo.data}
                    onChangeData={(data: any) => { setBasicInfo((prev: any) => ({ ...prev, data: data })) }}
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
                      title={t("cancel")}
                      onClick={resetBasicInfo}
                      type="reset"
                    />
                    <ERPButton
                      title={t("save_changes")}
                      onClick={updateBasicInfo}
                      variant="primary"
                      loading={basicInfoLoading}
                      disabled={basicInfoLoading}
                    />
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
