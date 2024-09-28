import { FC, Fragment, useEffect, useState } from "react";
import {
  useAppDynamicSelector,
} from "../../utilities/hooks/useAppDispatch";
import Urls from "../../redux/urls";
import ERPButton from "../../components/ERPComponents/erp-button";
import {
  getThunkAndSlice,
  getThunkAndSliceWithValidation,
} from "../../redux/slices/dynamicThunkAndSlice";
import {
  ActionType,
} from "../../redux/types";
import { useDispatch } from "react-redux";
import {
  ResponseModel,
} from "../../base/response-model";
import { useLocation } from "react-router-dom";
import "./profile.css";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import { ColorPicker, hexToRgb } from "../../components/common/switcher/switcherdata/switcherdata";

import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPSelect from "../../components/ERPComponents/erp-select";
interface WorkSpaceSettingsProps {}
interface UserLanguage {
  language?: string | null; 
}

const WorkSpaceSettingsPreference: FC<WorkSpaceSettingsProps> = () => {
  let api = new APIClient();  
  const [language, setLanguage] = useState<string>("en");
  const [_language, _setLanguage] = useState<string>("en");
  const [languages, setLanguages] = useState<any[]>([
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ]);
  const [phone, setPhone] = useState<string>("");
  const [_phone, set_Phone] = useState<string>("");
  const dispatch = useDispatch();

  ////////////email change
 
  const { thunk: updateUserLanguageThunk } =
    getThunkAndSlice<UserLanguage>(
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
      updateUserLanguageThunk({language: language})
    ).unwrap();
    
    handleResponse(response, () => {
      
    });
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
}
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

  interface Theme {
    direction: string | null;
    mode: string | null;
    navLayout: string | null;
    navigationMenuStyle: string | null;
    sidemenuLayoutStyles: string | null;
    pageStyle: string | null;
    menuPosition: string | null;
    headerPosition: string | null;
    colorPrimaryRgb: string | null;
  }
  
  const [theme, setTheme] = useState<Theme>({
    direction: 'ltr',
    mode: 'light',
    navLayout: null,
    navigationMenuStyle: null,
    sidemenuLayoutStyles: null,
    pageStyle: null,
    menuPosition: null,
    headerPosition: null,
    colorPrimaryRgb: 'rgb(25,118,210,1)',
  });
  const [_theme, _setTheme] = useState<Theme>({
    direction: 'ltr',
    mode: 'light',
    navLayout: null,
    navigationMenuStyle: null,
    sidemenuLayoutStyles: null,
    pageStyle: null,
    menuPosition: null,
    headerPosition: null,
    colorPrimaryRgb: 'rgb(25,118,210,1)',
  });
  
  const resetThemeChange = () => {
    // setTheme((prevTheme) => ({
    //   ..._theme
    // }));
  };
  const { thunk: updateUserThemeThunk } =
    getThunkAndSlice<Theme>(
      Urls.updateUserThemes,
      ActionType.POST,
      false,
      { }
    );
  const updatedUserTheme: any = useAppDynamicSelector(
    Urls.updateUserThemes,
    ActionType.POST
  );
  const saveThemeChange = async () => {
    
    const res = await dispatch(updateUserThemeThunk(theme) as any).unwrap();
    handleResponse(res, ()=> {
      userTheme();
    });
  };
  
  const { appState, updateAppState } = useAppState();
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
                    <ERPSelect
                      id="language"
                      options={languages}
                      handleChange={(id: any ,value: any) => {
                        
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
                              onChange={(e) => {if(e.target.checked == true) { 
                                switcherdata.Light(updateAppState,appState);
                                setTheme((prevTheme) => ({
                                ...prevTheme,
                                mode: 'light',
                              }));}}}
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
                              
                              onChange={(e) => {if(e.target.checked == true) { 
                                switcherdata.Dark(updateAppState,appState); setTheme((prevTheme) => ({
                                ...prevTheme,
                                mode: 'dark',
                              }));}
                              console.log(theme)
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
                              onChange={() => {}}
                              onClick={() => {
                                switcherdata.Ltr(updateAppState,appState); ; setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  direction: 'ltr',
                                }));}
                              }
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
                              onChange={() => {}}
                              onClick={() => {
                                
                                if(true == true) { 
                                switcherdata.Rtl(updateAppState,appState);; setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  direction: 'rtl',
                                }));}
                                console.log(theme)
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
                              onClick={
                                () => {
                                  switcherdata.primaryColor1(updateAppState,appState);
                                  setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: '58, 88, 146',
                                }));}
                              }
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
                              onClick={
                                () => {
                                  switcherdata.primaryColor2(updateAppState,appState);
                                  setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: '92, 144 ,163',
                                }));}
                              }
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
                              onClick={
                                () => {
                                  switcherdata.primaryColor3(updateAppState,appState);
                                  setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: '161, 90 ,223',
                                }));}
                                
                              }
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
                              onClick={
                                () => {
                                  switcherdata.primaryColor4(updateAppState,appState);
                                  setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: '78, 172, 76',
                                }));}
                              }
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
                              onClick={
                                () => {
                                  switcherdata.primaryColor5(updateAppState,appState);
                                  setTheme((prevTheme) => ({
                                  ...prevTheme,
                                  colorPrimaryRgb: '223, 90, 90',
                                }));}
                              }
                            />
                          </div>
                          <div className="ti-form-radio switch-select ps-0 mt-1 ">
                            <div className="theme-container"  style={{ backgroundColor: `rgb(${theme.colorPrimaryRgb})` }}>
                              
                            </div>
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
                                    <ColorPicker onChange={(e: any) => {
                                const rgb = hexToRgb(e.target.value);

                                if (rgb !== null) {
                                    const { r, g, b } = rgb;
                                    switcherdata.primaryColorCustom(updateAppState,appState,  `${r},  ${g},  ${b}`);
                                    setTheme((prevTheme) => ({
                                      ...prevTheme,
                                      colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                    }))
                                    // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                }
                            }} value={"#FFFFFF"} />
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

export default WorkSpaceSettingsPreference;
