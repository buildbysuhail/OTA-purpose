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
import {
  getThunkAndSlice,
  getThunkAndSliceWithValidation,
} from "../../redux/slices/dynamicThunkAndSlice";
import {
  ActionType,
  ApiState,
  ApiStateWithValidation,
} from "../../redux/types";
import { useDispatch } from "react-redux";
import emailImage from "../../assets/images/apps/email-us.44dad893243c82213359c6d8c7c8f201.svg";
import phoneImage from "../../assets/images/apps/phone.png";
import {
  ResponseModel,
  ResponseModelWithValidation,
} from "../../base/response-model";
import { useLocation } from "react-router-dom";
import "./profile.css";
import SBModelForm from "../../components/common/polosys/sb-model-form";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";
import ERPModal from "../../components/ERPComponents/erp-modal";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import { getAction, postAction } from "../../redux/app-actions";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import SBDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import SBSelect from "../../components/common/polosys/SBSelect";
import Themeprimarycolor, {
  ColorPicker,
  hexToRgb,
} from "../../components/common/switcher/switcherdata/switcherdata";

import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { useAppState } from "../../utilities/hooks/useAppState";
import { Theme } from "../../redux/slices/app/types";
interface AccountSettingsProps {}
interface UserLanguage {
  language?: string | null;
}

const AccountSettingsPreference: FC<AccountSettingsProps> = (props) => {
  let api = new APIClient();
  const [language, setLanguage] = useState<string>("en");
  const [_language, _setLanguage] = useState<string>("en");
  const [languages, setLanguages] = useState<any[]>([
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ]);
  const [image, setImage] = useState<string>("#");
  const [phone, setPhone] = useState<string>("");
  const [_phone, set_Phone] = useState<string>("");
  const [isOpenEmailChange, setIsOpenEmailChange] = useState<boolean>(false);
  const [isOpenPhoneChange, setIsOpenPhoneChange] = useState<boolean>(false);
  const [postDataEmail, setPostDataEmail] = useState<any>({
    data: { userName: "", password: "", newValue: "" },
    validations: { userName: "", password: "", newValue: "" },
    tokenSend: false,
  });
  const [postDataEmailTokenVerify, setPostDataEmailTokenVerify] = useState<any>(
    { userName: "", newValue: "", otp: "", confirToken: "" }
  );
  
  const { appState, updateAppState } = useAppState();
  const [postDataPhone, setPostDataPhone] = useState<any>();
  const initialBasicInfoWithValidation = {
    data: {
      countryCode: null,
      dob: null,
      fullName: null,
    },
    validations: {
      countryCode: "",
      dob: "",
      fullName: "",
    },
  };
  const dispatch = useDispatch();

  ////////////email change
  const { thunk: postFormEmailThunk } = getThunkAndSliceWithValidation<
    any,
    any
  >(Urls.verifyEmail_profile, ActionType.POST, false, {
    data: { userName: "", password: "", newValue: "" },
    loading: false,
  });
  const updatedFormDataEmail: any = useAppDynamicSelector(
    Urls.verifyEmail_profile,
    ActionType.POST
  );

  const { thunk: getFormEmailThunk } = getThunkAndSliceWithValidation<any, any>(
    Urls.getEmail_profile,
    ActionType.GET,
    false
  );
  const formDataEmail: any = useAppDynamicSelector(
    Urls.getEmail_profile,
    ActionType.GET
  );

  const { thunk: postFormEmailTokenThunk } = getThunkAndSliceWithValidation<
    any,
    any
  >(Urls.changeEmailRequest_profile, ActionType.POST, false, {
    data: { userName: "", password: "", newValue: "" },
    loading: false,
  });
  const updatedFormDataEmailToken: any = useAppDynamicSelector(
    Urls.changeEmailRequest_profile,
    ActionType.POST
  );

  const { thunk: updateUserLanguageThunk } = getThunkAndSlice<UserLanguage>(
    Urls.updateLanguage,
    ActionType.POST,
    false,
    { data: { language: language }, loading: false }
  );
  const updatedUserLanguage: any = useAppDynamicSelector(
    Urls.updateLanguage,
    ActionType.POST
  );
  const updateLanguage = async () => {
    const response: ResponseModel<any> = await dispatch(
      updateUserLanguageThunk({ language: language })
    ).unwrap();

    handleResponse(response, () => {});
  };
  const restLanguage = async () => {
    setLanguage(_language);
  };
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  const userTheme = () => {
    api.get(Urls.getUserThemes).then((theme) => {
      setTheme(theme);
      _setTheme(theme);
    });
  };
  useEffect(() => {
    userTheme();
    api.get(Urls.getPhone_profile).then((phone) => {
      setPhone(phone);
      set_Phone(phone);
    });
    api.get(Urls.getLanguage).then((lang) => {
      setLanguage(lang);
      _setLanguage(lang);
    });
  }, []);

  const [theme, setTheme] = useState<Theme>({
    direction: "ltr",
    mode: "light",
    navLayout: null,
    navigationMenuStyle: null,
    sidemenuLayoutStyles: null,
    pageStyle: null,    
  headerStyle: 'color',
  menuStyle: 'dark',
    menuPosition: null,
    headerPosition: "",
    colorPrimaryRgb: "rgb(25,118,210,1)",
  });
  const [_theme, _setTheme] = useState<Theme>({
    direction: "ltr",
    mode: "light",
    navLayout: null,
    navigationMenuStyle: null,
    sidemenuLayoutStyles: null,
    pageStyle: null, 
    headerStyle: 'color',
    menuStyle: 'dark',
    menuPosition: null,
    headerPosition: "",
    colorPrimaryRgb: "rgb(25,118,210,1)",
  });

  const resetThemeChange = () => {
    // setTheme((prevTheme) => ({
    //   ..._theme
    // }));
  };
  const { thunk: updateUserThemeThunk } = getThunkAndSlice<Theme>(
    Urls.updateUserThemes,
    ActionType.POST,
    false,
    {}
  );
  const updatedUserTheme: any = useAppDynamicSelector(
    Urls.updateUserThemes,
    ActionType.POST
  );
  const saveThemeChange = async () => {
    const res = await dispatch(updateUserThemeThunk(theme) as any).unwrap();
    handleResponse(res, () => {
      userTheme();
    });
  };
  const handleThemeChange = (key: string, mode: string) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      [key]: mode,
    }));
    console.log(theme);
  };

  return (
    <Fragment>
      
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
                    Language & Typing
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      Choose the language you'd like to use with Biz. Your
                      language is currently set to: English.
                    </p>
                  </div>
                </div>
                <div className="box-body">
                  <div className="items-start mb-6">
                    <SBSelect
                      id="language"
                      options={languages}
                      handleChange={(id: any, value: any) => {
                        setLanguage(value.value);
                      }}
                      value={language}
                      defaultValue={language}
                      label="Language"
                    />
                    <div className="w-full p-2 flex justify-end">
                      <ERPButton
                        title="Reset"
                        onClick={restLanguage}
                        type="reset"
                      ></ERPButton>
                      <ERPButton
                        title="Save Changes"
                        onClick={updateLanguage}
                        variant="primary"
                        loading={updatedUserLanguage.loading}
                        disabled={updatedUserLanguage.loading}
                      ></ERPButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 
          <div className="grid grid-cols-12 gap-x-6">
            <div
              id="avatar"
              className={`xxl:col-span-12 xl:col-span-12 ${
                path === "avatar" ? "blink" : ""
              } col-span-12`}
            >
              <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  Colouring
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    Set your Theme here.
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <div className="ti-offcanvas-body" id="switcher-body">
                    <div
                      id="switcher-1"
                      role="tabpanel"
                      aria-labelledby="switcher-item-1"
                      className=""
                    >
                      <div className="">
                        <p className="switcher-style-head">Theme Color Mode:</p>
                        <div className="grid grid-cols-3 switcher-style">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="theme-style"
                              className="ti-form-radio"
                              id="switcher-light-theme"
                              checked={theme.mode === "light"}
                              onChange={(e) => {
                                if (e.target.checked == true) {
                                  switcherdata.Light(updateAppState, appState);
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    mode: "light",
                                  }));
                                }
                              }}
                              // onClick={() =>
                              //   handleThemeChange("mode", "light")
                              // }
                            />
                            <label
                              htmlFor="switcher-light-theme"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              Light
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="theme-style"
                              className="ti-form-radio"
                              id="switcher-dark-theme"
                              defaultChecked={theme.mode === "dark"}
                              onChange={(e) => {
                                if (e.target.checked == true) {
                                  switcherdata.Dark(updateAppState, appState);
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    mode: "dark",
                                  }));
                                }
                                console.log(theme);
                              }}
                              // onClick={() => { handleThemeChange("mode", "dark")}}
                            />
                            <label
                              htmlFor="switcher-dark-theme"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              Dark
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="switcher-style-head">Directions:</p>
                        <div className="grid grid-cols-3  switcher-style">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="direction"
                              className="ti-form-radio"
                              id="switcher-ltr"
                              checked={theme.direction != "rtl"}
                              onChange={(e) => {}}
                              onClick={(e) => {
                                switcherdata.Ltr(updateAppState, appState);
                                setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  direction: "ltr",
                                }));
                              }}
                            />
                            <label
                              htmlFor="switcher-ltr"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              LTR
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="direction"
                              className="ti-form-radio"
                              id="switcher-rtl"
                              checked={theme.direction == "rtl"}
                              onChange={(e) => {}}
                              onClick={(e) => {
                                if (true == true) {
                                  switcherdata.Rtl(updateAppState, appState);
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    direction: "rtl",
                                  }));
                                }
                                console.log(theme);
                              }}
                            />
                            <label
                              htmlFor="switcher-rtl"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              RTL
                            </label>
                          </div>
                        </div>
                      </div>
                 
            <div className=" sidemenu-layout-styles">
              <p className="switcher-style-head">Sidemenu Layout Syles:</p>
              <div className="grid grid-cols-2 gap-2 switcher-style">
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-default-menu" 
                  checked={theme.sidemenuLayoutStyles == "defaultmenu"}
                     onChange={_e => { }}
                    onClick={() => {switcherdata.Defaultmenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    sidemenuLayoutStyles: "defaultmenu",
                                  }));}} />
                  <label htmlFor="switcher-default-menu"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Default
                    Menu</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-closed-menu" checked={theme.sidemenuLayoutStyles == "closedmenu"} onChange={_e => { }}
                    onClick={() => {switcherdata.Closedmenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    sidemenuLayoutStyles: "closedmenu",
                                  }));}} />
                  <label htmlFor="switcher-closed-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                    Closed
                    Menu</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icontext-menu" checked={theme.sidemenuLayoutStyles == "iconTextfn"} onChange={_e => { }}
                    onClick={() => {switcherdata.iconTextfn(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    sidemenuLayoutStyles: "iconTextfn",
                                  }));}} />
                  <label htmlFor="switcher-icontext-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Icon
                    Text</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icon-overlay" checked={theme.sidemenuLayoutStyles == "iconOverayFn"}
                    onClick={() => {switcherdata.iconOverayFn(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    sidemenuLayoutStyles: "iconOverayFn",
                                  }));}} />
                  <label htmlFor="switcher-icon-overlay" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Icon
                    Overlay</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-detached" checked={theme.sidemenuLayoutStyles == "detachedFn"} onChange={_e => { }}
                    onClick={() => {switcherdata.DetachedFn(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    sidemenuLayoutStyles: "detachedFn",
                                  }));}} />
                  <label htmlFor="switcher-detached"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Detached</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-double-menu" checked={theme.sidemenuLayoutStyles == "doubletFn"} onChange={_e => { }}
                    onClick={() => {switcherdata.DoubletFn(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    sidemenuLayoutStyles: "doubletFn",
                                  }));}} />
                  <label htmlFor="switcher-double-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Double
                    Menu</label>
                </div>
              </div>
              <div className="px-4 text-secondary text-xs"><b className="me-2">Note:</b>Navigation menu styles won't work
                here.</div>
            </div>
                      <div>
                        <p className="switcher-style-head">Page Styles:</p>
                        <div className="grid grid-cols-3  switcher-style">
                          <div className="flex">
                            <input
                              type="radio"
                              name="data-page-styles"
                              className="ti-form-radio"
                              id="switcher-regular"
                              checked={
                                theme.pageStyle == "regular"
                              }
                              onChange={(_e) => {}}
                              onClick={(e) => {
                                if (true == true) {
                                  switcherdata.Regular(updateAppState, appState);
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    pageStyle: "regular",
                                  }));
                                }
                                console.log(theme);
                              }}
                            />
                            <label
                              htmlFor="switcher-regular"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              Regular
                            </label>
                          </div>
                          <div className="flex">
                            <input
                              type="radio"
                              name="data-page-styles"
                              className="ti-form-radio"
                              id="switcher-classic"
                              checked={
                                theme.pageStyle == "classic"
                              }
                              onChange={(_e) => {}}
                              onClick={(e) => {
                                if (true == true) {
                                  switcherdata.Classic(updateAppState, appState);
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    pageStyle: "classic",
                                  }));
                                }
                                console.log(theme);
                              }}
                            />
                            <label
                              htmlFor="switcher-classic"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              Classic
                            </label>
                          </div>
                          <div className="flex">
                            <input
                              type="radio"
                              name="data-page-styles"
                              className="ti-form-radio"
                              id="switcher-modern"
                              checked={
                                theme.pageStyle == "modern"
                              }
                              onChange={(_e) => {}}
                              onClick={(e) => {
                                if (true == true) {
                                  switcherdata.Modern(updateAppState, appState);
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    pageStyle: "modern",
                                  }));
                                }
                                console.log(theme);
                              }}
                            />
                            <label
                              htmlFor="switcher-modern"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              Modern
                            </label>
                          </div>
                        </div>
                      </div>
                    
                    </div>
                  </div>
                  <div className="w-full p-2 flex justify-end">
                    <ERPButton
                      title="Reset"
                      onClick={resetThemeChange}
                      type="reset"
                    ></ERPButton>
                    <ERPButton
                      title="Save Changes"
                      onClick={saveThemeChange}
                      variant="primary"
                      loading={updatedUserTheme.loading}
                      disabled={updatedUserTheme.loading}
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
                  Theme
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    Set your Theme here.
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <div className="ti-offcanvas-body" id="switcher-body">
                    <div
                      id="switcher-1"
                      role="tabpanel"
                      aria-labelledby="switcher-item-1"
                      className=""
                    >
                     
                      <div className="theme-colors">
              <p className="switcher-style-head">Menu Colors:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-white" type="radio" name="menu-colors"
                    checked={theme.menuStyle == "light"} onChange={_e => { }}
                    id="switcher-menu-light" onClick={() => {switcherdata.lightMenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    menuStyle: "light",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Light Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="menu-colors"
                    checked={theme.menuStyle == "dark"} onChange={_e => { }}
                    id="switcher-menu-dark" onClick={() => {switcherdata.darkMenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    menuStyle: "dark",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Dark Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="menu-colors"
                    checked={theme.menuStyle == "color"} onChange={_e => { }}
                    id="switcher-menu-primary" onClick={() => {switcherdata.colorMenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    menuStyle: "color",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Color Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="menu-colors"
                    checked={theme.menuStyle == "gradient"} onChange={_e => { }}
                    id="switcher-menu-gradient" onClick={() => {switcherdata.gradientMenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    menuStyle: "gradient",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Gradient Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio" name="menu-colors"
                    checked={theme.menuStyle == "transparent"} onChange={_e => { }}
                    id="switcher-menu-transparent" onClick={() => {switcherdata.transparentMenu(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    menuStyle: "transparent",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Transparent Menu
                  </span>
                </div>
              </div>
              <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]"><b className="me-2">Note:</b>If you want to change color Menu
                dynamically
                change from below Theme Primary color picker.</div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Header Colors:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-white !border" type="radio" name="header-colors"
                    checked={theme.headerStyle == "light"} onChange={_e => { }}
                    id="switcher-header-light" onClick={() => {switcherdata.lightHeader(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    headerStyle: "light",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Light Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="header-colors"
                    checked={theme.headerStyle == "dark"} onChange={_e => { }}
                    id="switcher-header-dark" onClick={() => {switcherdata.darkHeader(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    headerStyle: "dark",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Dark Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="header-colors"
                    checked={theme.headerStyle == "color"} onChange={_e => { }}
                    id="switcher-header-primary" onClick={() => {switcherdata.colorHeader(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    headerStyle: "color",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Color Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="header-colors"
                    checked={theme.headerStyle == "gradient"} onChange={_e => { }}
                    id="switcher-header-gradient" onClick={() => {switcherdata.gradientHeader(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    headerStyle: "gradient",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Gradient Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio"
                    checked={theme.headerStyle == "transparent"} onChange={_e => { }}
                    name="header-colors" id="switcher-header-transparent" onClick={() => {switcherdata.transparentHeader(updateAppState,appState)
                                  setTheme((prevTheme) => ({
                                    ...prevTheme,
                                    headerStyle: "transparent",
                                  }));}} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Transparent Header
                  </span>
                </div>
              </div>
              <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]"><b className="me-2">Note:</b>If you want to change color
                Header dynamically
                change from below Theme Primary color picker.</div>
            </div>
           
                      <div className="theme-colors">
                        <p className="switcher-style-head">Theme Primary:</p>
                        <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-1"
                              type="radio"
                              name="theme-primary"
                              checked={theme.colorPrimaryRgb == "58, 88, 146"}
                              id="switcher-primary"
                              onClick={() => {
                                switcherdata.primaryColor1(
                                  updateAppState,
                                  appState
                                );
                                setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: "58, 88, 146",
                                }));
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-2"
                              type="radio"
                              name="theme-primary"
                              checked={theme.colorPrimaryRgb == "92, 144 ,163"}
                              onChange={(_e) => {}}
                              id="switcher-primary1"
                              onClick={() => {
                                switcherdata.primaryColor2(
                                  updateAppState,
                                  appState
                                );
                                setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: "92, 144 ,163",
                                }));
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-3"
                              type="radio"
                              name="theme-primary"
                              checked={theme.colorPrimaryRgb == "161, 90 ,223"}
                              onChange={(_e) => {}}
                              id="switcher-primary2"
                              onClick={() => {
                                switcherdata.primaryColor3(
                                  updateAppState,
                                  appState
                                );
                                setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: "161, 90 ,223",
                                }));
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-4"
                              type="radio"
                              name="theme-primary"
                              checked={theme.colorPrimaryRgb == "78, 172, 76"}
                              onChange={(_e) => {}}
                              id="switcher-primary3"
                              onClick={() => {
                                switcherdata.primaryColor4(
                                  updateAppState,
                                  appState
                                );
                                setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: "78, 172, 76",
                                }));
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-5"
                              type="radio"
                              name="theme-primary"
                              checked={theme.colorPrimaryRgb == "223, 90, 90"}
                              onChange={(_e) => {}}
                              id="switcher-primary4"
                              onClick={() => {
                                switcherdata.primaryColor5(
                                  updateAppState,
                                  appState
                                );
                                setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: "223, 90, 90",
                                }));
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select ps-0 mt-1 ">
                            <div
                              className="theme-container"
                              style={{
                                backgroundColor: `rgb(${theme.colorPrimaryRgb})`,
                              }}
                            ></div>
                            <div className="pickr-container-primary">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                        const rgb = hexToRgb(e.target.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                          switcherdata.primaryColorCustom(
                                            updateAppState,
                                            appState,
                                            `${r},  ${g},  ${b}`
                                          );
                                          setTheme((prevTheme) => ({
                                            ...prevTheme,
                                            colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                          }));
                                          // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                        }
                                      }}
                                      value={"#FFFFFF"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="ti-form-radio switch-select ps-0 mt-1 color-primary-light"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full p-2 flex justify-end">
                    <ERPButton
                      title="Reset"
                      onClick={resetThemeChange}
                      type="reset"
                    ></ERPButton>
                    <ERPButton
                      title="Save Changes"
                      onClick={saveThemeChange}
                      variant="primary"
                      loading={updatedUserTheme.loading}
                      disabled={updatedUserTheme.loading}
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

export default AccountSettingsPreference;
