import Urls from "../../redux/urls";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ActionType } from "../../redux/types";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import "./profile.css";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import {
  ColorPicker,
  hexToRgb,
} from "../../components/common/switcher/switcherdata/switcherdata";

import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { useAppState } from "../../utilities/hooks/useAppState";
import {
  AppState,
  initialThemeData,
  inputBox,
  Theme,
} from "../../redux/slices/app/types";
import Cookies from "js-cookie";
import { customJsonParse, modelToBase64 } from "../../utilities/jsonConverter";
import ERPSelect from "../../components/ERPComponents/erp-select";
import {
  useAppDynamicSelector,
  useAppSelector,
} from "../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import { reduxManager } from "../../redux/dynamic-store-manager-pro";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import { RootState } from "../../redux/store";
import { setAppState, setInputBox, setScrollbarColor, setScrollbarWidth } from "../../redux/slices/app/reducer";
import ERPRadio from "../../components/ERPComponents/erp-radio";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import MUIERPDataCombobox from "../../components/ERPComponents/erp-data-combobox-mui";
import { ERPScrollArea} from "../../components/ERPComponents/erp-scrollbar";
interface AccountSettingsProps {}
interface UserLanguage {
  language?: string | null;
}

const api = new APIClient();
const AccountSettingsPreference: FC<AccountSettingsProps> = (props: any) => {
  let api = new APIClient();
  const [demo, setDemo] = useState({
    inputBox: "",
    dateBox: "",
    selectBox: "",
    radioButton: false,
    checkBox: false,
  });
  const [language, setLanguage] = useState<string>("en");
  const [_language, _setLanguage] = useState<string>("en");
  const [languages, setLanguages] = useState<any[]>([
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ]);
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

  const userLanguageRName = reducerNameFromUrl(
    Urls.updateLanguage,
    ActionType.POST
  );
  let userLanguage = useAppSelector((state: any) => state?.[userLanguageRName]);
  let userLanguageAction = reduxManager.getTypedThunk(userLanguageRName);
  const updateLanguage = async () => {
    try {
      const response = await dispatch(
        userLanguageAction({ data: { language }, params: "userId=123" }) as any
      ).unwrap();
      handleResponse(response, () => {});
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };
  const restLanguage = async () => {
    setLanguage(_language);
  };
  // const [theme, setTheme] = useState<Theme>(initialThemeData);
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  // const userTheme = () => {
  //   api.get(Urls.getUserThemes).then((theme) => {
  //     localStorage.setItem("ut", modelToBase64(theme), { expires: 30 });
  //     setTheme(theme);
  //     _setTheme(theme);
  //   });
  // };
  useEffect(() => {
    // userTheme();
    api.get(Urls.getPhone_profile).then((phone) => {
      setPhone(phone);
      set_Phone(phone);
    });
    api.get(Urls.getLanguage).then((lang) => {
      setLanguage(lang);
      _setLanguage(lang);
    });
  }, []);

  const [_theme, _setTheme] = useState<Theme>({
    direction: "ltr",
    mode: "light",
    navLayout: null,
    navigationMenuStyle: null,
    sidemenuLayoutStyles: null,
    pageStyle: null,
    headerStyle: "color",
    menuStyle: "dark",
    menuPosition: null,
    headerPosition: "",
    colorPrimaryRgb: "rgb(25,118,210,1)",
    scrollbarWidth: "sm",
    scrollbarColor: "219,223,225",
    inputBox: {
      inputStyle: "normal",
      inputSize: "sm",
      checkButtonInputSize: "sm",
      inputHeight: 0,
      fontSize: 0,
      fontWeight: 400,
      labelFontSize: 0,
      otherLabelFontSize: 0,
      borderColor: "128, 128, 128",
      selectColor:'128, 128, 128', 
      fontColor: "128, 128, 128",
      borderFocus: "128, 128, 128",
      labelColor: "128, 128, 128",
      borderRadius: 0,
      adjustA: 0,
      adjustB: 0,
      adjustC: 0,
      adjustD: 0,
      marginTop: 0,
      marginBottom: 0,
    },
  });

  const resetThemeChange = () => {
    // setTheme((prevTheme) => ({
    //   ..._theme
    // }));
  };
  const updatedUserThemeRName = reducerNameFromUrl(
    Urls.updateUserThemes,
    ActionType.POST
  );
  let updatedUserTheme = useAppSelector(
    (state: any) => state?.[updatedUserThemeRName]
  );
  let updatedUserThemeAction = reduxManager.getTypedThunk(
    updatedUserThemeRName
  );
 
  const handleInputBoxStyleChange = (field: keyof inputBox, value: any) => {
    if (appState.inputBox[field] !== value) {
      const _appState = {
        ...appState,
        inputBox: {
          ...appState.inputBox,
          [field]: value,
        },
      };
      updateAppState(_appState);
    }
  };

  const handleScrollbarChange = (field: keyof AppState, value: any) => {
    const _appState = {
      ...appState,
      [field]: value,
    };
    updateAppState(_appState);
  };

  
  // const handleScrollbarChange = (key: string, value: any) => {
  //   if (key === 'scrollbarWidth') {
  //     dispatch(setScrollbarWidth(value));
  //   } else if (key === 'scrollbarColor') {
  //     dispatch(setScrollbarColor(value));
  //   }
  // };

  const saveThemeChange = async () => {
    
    const res = await api.postAsync(Urls.updateUserThemes, {
      userThemes: btoa(JSON.stringify(appState)),
    });
    localStorage.setItem("ut", btoa(JSON.stringify(appState)));
    handleResponse(res, () => {
      console.log(' localStorage.setItem("ut", btoa(JSON.stringify(appState)), { expires: 30 });');
      
      localStorage.setItem("ut", btoa(JSON.stringify(appState)));
    });
  };
  
const resetInputBox = async ()=>{
  
  try{
    const res = await api.getAsync(Urls.getInputBox)
    const _inputBox = atob(res);
    // dispatch(setInputBox(res.inputBox));
    const inputBox:AppState  = customJsonParse(_inputBox);
    console.log("inputget",inputBox);
    dispatch(setInputBox(inputBox?.inputBox));
  }catch (error) {
    console.error("Error getInputBox data:", error);
  }
}


  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12 ">
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
                      handleChange={(id: any, value: any) => {
                        setLanguage(value.value);
                      }}
                      value={language}
                      defaultValue={language}
                      label="Language"
                    />
                    <div className="w-full p-2 flex justify-end space-x-2">
                      <ERPButton
                        title="Reset"
                        onClick={restLanguage}
                        type="reset"
                      ></ERPButton>
                      <ERPButton
                        title="Save Changes"
                        onClick={updateLanguage}
                        variant="primary"
                        loading={userLanguage.loading}
                        disabled={userLanguage.loading}
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
                          <p className="switcher-style-head">
                            Theme Color Mode:
                          </p>
                          <div className="grid grid-cols-3 switcher-style">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="theme-style"
                                className="ti-form-radio"
                                id="switcher-light-theme"
                                checked={appState.mode === "light"}
                                onChange={() => {
                                  switcherdata.Light(updateAppState,appState);
                                }}
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
                                checked={appState.mode === "dark"}
                                onChange={() => {
                                    switcherdata.Dark(updateAppState, appState);
                                  
                                }}
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
                                checked={appState.dir != "rtl"}
                                onChange={(e) => {}}
                                onClick={(e) => {
                                  switcherdata.Ltr(updateAppState, appState);
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
                                checked={appState.dir == "rtl"}
                                onChange={(e) => {}}
                                onClick={(e) => {
                                  switcherdata.Rtl(updateAppState, appState);
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
                          <p className="switcher-style-head">
                            Sidemenu Layout Syles:
                          </p>
                          <div className="grid grid-cols-2 gap-2 switcher-style">
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-default-menu"
                                checked={
                                  appState.dataMenuStyles == "defaultmenu"
                                }
                                onChange={(_e) => {}}
                                onClick={() => {
                                  switcherdata.Defaultmenu(
                                    updateAppState,
                                    appState
                                  );
                                }}
                              />
                              <label
                                htmlFor="switcher-default-menu"
                                className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold "
                              >
                                Default Menu
                              </label>
                            </div>
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-closed-menu"
                                checked={
                                  appState.dataMenuStyles == "closedmenu"
                                }
                                onChange={(_e) => {}}
                                onClick={() => {
                                  switcherdata.Closedmenu(
                                    updateAppState,
                                    appState
                                  );
                                }}
                              />
                              <label
                                htmlFor="switcher-closed-menu"
                                className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold "
                              >
                                Closed Menu
                              </label>
                            </div>
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-icontext-menu"
                                checked={
                                  appState.dataMenuStyles == "iconTextfn"
                                }
                                onChange={(_e) => {}}
                                onClick={() => {
                                  switcherdata.iconTextfn(
                                    updateAppState,
                                    appState
                                  );
                                }}
                              />
                              <label
                                htmlFor="switcher-icontext-menu"
                                className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold "
                              >
                                Icon Text
                              </label>
                            </div>
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-icon-overlay"
                                checked={
                                  appState.dataMenuStyles == "iconOverayFn"
                                }
                                onClick={() => {
                                  switcherdata.iconOverayFn(
                                    updateAppState,
                                    appState
                                  );
                                }}
                              />
                              <label
                                htmlFor="switcher-icon-overlay"
                                className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold "
                              >
                                Icon Overlay
                              </label>
                            </div>
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-detached"
                                checked={
                                  appState.dataMenuStyles == "detachedFn"
                                }
                                onChange={(_e) => {}}
                                onClick={() => {
                                  switcherdata.DetachedFn(
                                    updateAppState,
                                    appState
                                  );
                                }}
                              />
                              <label
                                htmlFor="switcher-detached"
                                className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold "
                              >
                                Detached
                              </label>
                            </div>
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-double-menu"
                                checked={appState.dataMenuStyles == "doubletFn"}
                                onChange={(_e) => {}}
                                onClick={() => {
                                  switcherdata.DoubletFn(
                                    updateAppState,
                                    appState
                                  );
                                }}
                              />
                              <label
                                htmlFor="switcher-double-menu"
                                className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                              >
                                Double Menu
                              </label>
                            </div>
                          </div>
                          <div className="px-4 text-secondary text-xs">
                            <b className="me-2">Note:</b>Navigation menu styles
                            won't work here.
                          </div>
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
                                checked={appState.dataPageStyle == "regular"}
                                onChange={(_e) => {}}
                                onClick={(e) => {
                                  if (true == true) {
                                    switcherdata.Regular(
                                      updateAppState,
                                      appState
                                    );
                                  }
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
                                checked={appState.dataPageStyle == "classic"}
                                onChange={(_e) => {}}
                                onClick={(e) => {
                                  switcherdata.Classic(
                                    updateAppState,
                                    appState
                                  );
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
                                checked={appState.dataPageStyle == "modern"}
                                onChange={(_e) => {}}
                                onClick={(e) => {
                                  switcherdata.Modern(updateAppState, appState);
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
                    <div className="w-full p-2 flex justify-end space-x-2">
                      <ERPButton
                        title="Reset"
                        onClick={resetThemeChange}
                        type="reset"
                      ></ERPButton>
                      <ERPButton
                        title="Save Changes"
                        onClick={saveThemeChange}
                        variant="primary"
                      ></ERPButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12 ">
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
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-white"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "light"}
                              onChange={(_e) => {}}
                              id="switcher-menu-light"
                              onClick={() => {
                                switcherdata.lightMenu(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Light Menu
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-dark"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "dark"}
                              onChange={(_e) => {}}
                              id="switcher-menu-dark"
                              onClick={() => {
                                switcherdata.darkMenu(updateAppState, appState);
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Dark Menu
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-primary"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "color"}
                              onChange={(_e) => {}}
                              id="switcher-menu-primary"
                              onClick={() => {
                                switcherdata.colorMenu(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Color Menu
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-gradient"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "gradient"}
                              onChange={(_e) => {}}
                              id="switcher-menu-gradient"
                              onClick={() => {
                                switcherdata.gradientMenu(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Gradient Menu
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-transparent"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "transparent"}
                              onChange={(_e) => {}}
                              id="switcher-menu-transparent"
                              onClick={() => {
                                switcherdata.transparentMenu(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Transparent Menu
                            </span>
                          </div>
                        </div>
                        <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]">
                          <b className="me-2">Note:</b>If you want to change
                          color Menu dynamically change from below Theme Primary
                          color picker.
                        </div>
                      </div>
                      <div className="theme-colors">
                        <p className="switcher-style-head">Header Colors:</p>
                        <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-white !border"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "light"}
                              onChange={(_e) => {}}
                              id="switcher-header-light"
                              onClick={() => {
                                switcherdata.lightHeader(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Light Header
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-dark"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "dark"}
                              onChange={(_e) => {}}
                              id="switcher-header-dark"
                              onClick={() => {
                                switcherdata.darkHeader(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Dark Header
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-primary"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "color"}
                              onChange={(_e) => {}}
                              id="switcher-header-primary"
                              onClick={() => {
                                switcherdata.colorHeader(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Color Header
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-gradient"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "gradient"}
                              onChange={(_e) => {}}
                              id="switcher-header-gradient"
                              onClick={() => {
                                switcherdata.gradientHeader(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Gradient Header
                            </span>
                          </div>
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-transparent"
                              type="radio"
                              checked={
                                appState.dataHeaderStyles == "transparent"
                              }
                              onChange={(_e) => {}}
                              name="header-colors"
                              id="switcher-header-transparent"
                              onClick={() => {
                                switcherdata.transparentHeader(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                            <span
                              className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                              role="tooltip"
                            >
                              Transparent Header
                            </span>
                          </div>
                        </div>
                        <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]">
                          <b className="me-2">Note:</b>If you want to change
                          color Header dynamically change from below Theme
                          Primary color picker.
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
                              checked={
                                appState.colorPrimaryRgb == "58, 88, 146"
                              }
                              id="switcher-primary"
                              onClick={() => {
                                switcherdata.primaryColor1(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-2"
                              type="radio"
                              name="theme-primary"
                              checked={
                                appState.colorPrimaryRgb == "92, 144 ,163"
                              }
                              onChange={(_e) => {}}
                              id="switcher-primary1"
                              onClick={() => {
                                switcherdata.primaryColor2(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-3"
                              type="radio"
                              name="theme-primary"
                              checked={
                                appState.colorPrimaryRgb == "161, 90 ,223"
                              }
                              onChange={(_e) => {}}
                              id="switcher-primary2"
                              onClick={() => {
                                switcherdata.primaryColor3(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-4"
                              type="radio"
                              name="theme-primary"
                              checked={
                                appState.colorPrimaryRgb == "78, 172, 76"
                              }
                              onChange={(_e) => {}}
                              id="switcher-primary3"
                              onClick={() => {
                                switcherdata.primaryColor4(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-5"
                              type="radio"
                              name="theme-primary"
                              checked={
                                appState.colorPrimaryRgb == "223, 90, 90"
                              }
                              onChange={(_e) => {}}
                              id="switcher-primary4"
                              onClick={() => {
                                switcherdata.primaryColor5(
                                  updateAppState,
                                  appState
                                );
                              }}
                            />
                          </div>
                          <div className="ti-form-radio switch-select ps-0 mt-1 ">
                            <div
                              className="theme-container"
                              style={{
                                backgroundColor: `rgb(${appState.colorPrimaryRgb})`,
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
                                        const rgb = hexToRgb(e.target?.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                          switcherdata.primaryColorCustom(
                                            updateAppState,
                                            appState,
                                            `${r},  ${g},  ${b}`
                                          );
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

                      <div className="sidemenu-layout-styles">
                        <p className="switcher-style-head">Scrollbar:</p>
                        <div className="grid grid-cols-2 gap-2 switcher-style">
                          <div className="flex flex-col gap-3">
                            <h6 className="switcher-style-head ">
                              Scrollbar Width:
                            </h6>
                            <div className="flex flex-col gap-2">
                              {["md", "sm"].map((width) => (
                                <div key={width} className="flex items-center">
                                  <input
                                    type="radio"
                                    name="data-page-scrollbar"
                                    className="ti-form-radio"
                                    id={`scrollbar-${width}`}
                                    checked={appState.scrollbarWidth === width}
                                    onChange={() => {
                                      handleScrollbarChange(
                                        "scrollbarWidth",
                                        width
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={`scrollbar-${width}`}
                                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
                                  >
                                    {/* {width === "lg"
                                      ? "Thick"
                                      : width === "md"
                                      ? "Medium"
                                      : "Thin"} */}
                                      {width === "md"? "Normal" : "Thin"}
                                  </label>
                                </div>
                              ))}
                            </div>
                       

                            <div className="flex  ">
                           
                            <div className="ti-form-radio -translate-x-1">
                              <div
                                className="  relative theme-container h-6 w-6 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                  appState.scrollbarColor ?? "128, 128, 128"
                                    
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-sm absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.scrollbarColor}
                                  onChange={(e) => {
                                    const rgb = hexToRgb(e.target?.value);
                                    if (rgb) {
                                      handleScrollbarChange(
                                        "scrollbarColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                            <label
                              htmlFor="selectColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70  font-semibold  self-center"
                            >
                              {" "}
                              Scrollbar Color
                          </label>
                          </div>
                          </div>
                          {/* Preview Section */}
                          <ERPScrollArea className="w-full h-64 border border-gray-300 overflow-y-auto rounded-md">
                            <div className="h-96 p-2">
                              <p>This is a preview of the scrollbar style selected by the user.</p>
                              <p>Scroll down to see the effect.</p>
                              <p>Normal and thin options are available.</p>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                              <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                            </div>
                          </ERPScrollArea>
                          {/* <div
                            className={`
                          w-full h-64 border border-gray-300 rounded-md overflow-y-auto
                         scrollbar
                          ${
                           appState.scrollbarWidth === "md"
                              ? "scrollbar"
                              : "scrollbar-thin"
                          }
                        `}
                            style={
                              {
                                "--scrollbar-thumb": `rgb(${
                                  appState.scrollbarColor ?? "219,223,225"
                                })`,
                                "--scrollbar-track": "rgb(241,245,249)",
                                "--tw-scrollbar-thumb": `rgb(${
                                  appState.scrollbarColor ?? "219,223,225"
                                })`,
                                "--tw-scrollbar-track": "rgb(241,245,249)",
                              } as React.CSSProperties
                            }
                           
                          >
                       
                            <div className="h-96 p-2">
                              <p>
                                This is a preview of the scrollbar style
                                selected by the user.
                              </p>
                              <p>Scroll down to see the effect.</p>
                              <p>
                                Thick, medium, and thin options are available.
                              </p>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </p>
                              <p>
                                Sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua.
                              </p>
                              <p>
                                Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco.
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="">
                     
                      <p className="switcher-style-head ">Input Box Style:</p>
                      
                      <div className="flex justify-end items-center mt-3">
                    <ERPButton 
                     variant="secondary"
                     title="Reset"
                     onClick={resetInputBox}
                     startIcon={ 'ri-refresh-line' }
                    //  disabled={(loadingLogout.loading && loadingLogout.deviceId === data.deviceId) || data.isActive === false}
                    //  loading={loadingLogout.loading && loadingLogout.deviceId == data.deviceId}
                     >
                     </ERPButton>
                      </div>
                    
                     
                        
                        <div className="grid  grid-cols-1 md:grid-cols-3 gap-3 items-start  mt-5 switcher-style">
                             <ERPInput
                              id="inputBox"
                              label="Demo Input"
                              onChange={(e) => {
                                setDemo((prevTheme) => ({
                                  ...prevTheme,             
                                  inputBox: e.target?.value  
                                }));
                              }}
                              value={demo.inputBox}
                            />
                        
                            <ERPDateInput
                              id="dateBox"                          
                              label="Date Input"
                              onChange={(e) => {
                                setDemo((prevTheme) => ({
                                  ...prevTheme,             
                                  dateBox: e.target?.value  
                                }));
                              }}
                              value={demo.dateBox}
                            />
                    
                         <ERPDataCombobox
                            id="selectBox"
                            data={demo}
                            label="Demo Select Box"
                            field={{
                              id: "selectBox",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            
                            // customSize='sm'
                            onChange={(e) => {
                              setDemo((prevTheme) => ({
                                ...prevTheme,             
                                selectBox: e?.value ?? null,
                              }));
                            }}
                            options={[
                              { value: 0, label: "0" },
                              { value: 1, label: "1" },
                              { value: 2, label: "2" },
                              { value: 3, label: "3" },
                              { value: 4, label: "4" },
                              { value: 5, label: "5" },
                            ]}
                        />
                     
                            
                           
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4  switcher-style">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="inputBox"
                              className="ti-form-radio"
                              id="input-normal"
                              checked={
                                appState.inputBox?.inputStyle === "normal"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "inputStyle",
                                    "normal"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-normal"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              Normal
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputBox"
                              className="ti-form-radio"
                              id="input-standard"
                              checked={
                                appState.inputBox?.inputStyle === "standard"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "inputStyle",
                                    "standard"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-standard"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              Standard
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputBox"
                              className="ti-form-radio"
                              id="input-outline"
                              checked={
                                appState.inputBox?.inputStyle === "outlined"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "inputStyle",
                                    "outlined"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-outline"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              Outline
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputBox"
                              className="ti-form-radio"
                              id="input-fill"
                              checked={
                                appState.inputBox?.inputStyle === "filled"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "inputStyle",
                                    "filled"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-fill"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              Fill
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4  switcher-style">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="inputBoxSize"
                              className="ti-form-radio"
                              id="input-sm"
                              checked={appState.inputBox?.inputSize === "sm"}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange("inputSize", "sm");
                                }
                              }}
                            />
                            <label
                              htmlFor="input-sm"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              sm
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputBoxSize"
                              className="ti-form-radio"
                              id="input-md"
                              checked={appState.inputBox?.inputSize === "md"}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange("inputSize", "md");
                                }
                              }}
                            />
                            <label
                              htmlFor="input-md"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              md
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputBoxSize"
                              className="ti-form-radio"
                              id="input-lg"
                              checked={appState.inputBox?.inputSize === "lg"}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange("inputSize", "lg");
                                }
                              }}
                            />
                            <label
                              htmlFor="input-lg"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              lg
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="inputBoxSize"
                              className="ti-form-radio"
                              id="input-customize"
                              checked={
                                appState.inputBox?.inputSize === "customize"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "inputSize",
                                    "customize"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-customize"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              customize
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 switcher-style">
                          <div className="flex items-center space-x-3">
                            <div className="basis-2/3 ">
                              <ERPSlider
                                id="borderRadius"
                                label="Border Radius"
                                className="bg-slate-300"
                                value={appState.inputBox?.borderRadius}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target?.value, 10);
                                  handleInputBoxStyleChange(
                                    "borderRadius",
                                    newValue
                                  );
                                }}
                                min={0}
                                max={20}
                              />
                            </div>

                            <div className="basis-1/3">
                              <ERPInput
                                id="borderRadius"
                                noLabel={true}
                                type="number"
                                value={appState.inputBox?.borderRadius}
                                data={appState.inputBox}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target?.value, 10);
                                  handleInputBoxStyleChange(
                                    "borderRadius",
                                    newValue
                                  );
                                }}
                                min={0}
                                max={20}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1 translate-y-4">
                            <div className="flex items-center space-x-3">
                              <div className="basis-1/2 ">
                                <ERPSlider
                                  id="marginBottom"
                                  label={`Margin Bottom (${
                                    appState.inputBox?.marginBottom ?? 0
                                  })`}
                                  className="bg-slate-300"
                                  value={appState.inputBox?.marginBottom}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target?.value);

                                    handleInputBoxStyleChange(
                                      "marginBottom",
                                      newValue
                                    );
                                  }}
                                  min={0}
                                  max={30}
                                />
                              </div>
                              <div className="basis-1/2 ">
                                <ERPSlider
                                  id="marginTop"
                                  label={`Margin Top (${
                                    appState.inputBox?.marginTop ?? 0
                                  })`}
                                  className="bg-slate-300"
                                  value={appState.inputBox?.marginTop}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target?.value);

                                    handleInputBoxStyleChange(
                                      "marginTop",
                                      newValue
                                    );
                                  }}
                                  min={0}
                                  max={30}
                                />
                              </div>
                            </div>
                            <div className="px-4 text-secondary text-xs">
                              <b className="me-2">Note:</b>if you face any
                              aligment issue adjust margin top & bottom of input
                              box
                            </div>
                          </div>
                        
                        </div>
                      </div>

                      <div className="py-3">
                        {appState.inputBox?.inputSize === "customize" && (
                          <div className="grid  grid-cols-1 md:grid-cols-2 gap-4  switcher-style ">
                            <div className="flex items-center space-x-3">
                              <div className="basis-2/3 ">
                                <ERPSlider
                                  id="fontSize"
                                  label="Font Size"
                                  className="bg-slate-300"
                                  value={appState.inputBox?.fontSize}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "fontSize",
                                      newValue
                                    );
                                  }}
                                  min={5}
                                  max={25}
                                />
                              </div>
                              <div className="basis-1/3 translate-y-3">
                                <ERPInput
                                  id="fontSize"
                                  type="number"
                                  noLabel={true}
                                  value={appState.inputBox?.fontSize}
                                  data={appState.inputBox}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "fontSize",
                                      newValue
                                    );
                                  }}
                                  min={5}
                                  max={25}
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="basis-2/3 ">
                                <ERPSlider
                                  id="labelFontSize"
                                  label="Label Font Size"
                                  className="bg-slate-300"
                                  value={appState.inputBox?.labelFontSize}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "labelFontSize",
                                      newValue
                                    );
                                  }}
                                  min={5}
                                  max={25}
                                />
                              </div>
                              <div className="basis-1/3 translate-y-3">
                                <ERPInput
                                  id="labelFontSize"
                                  type="number"
                                  noLabel={true}
                                  value={appState.inputBox?.labelFontSize}
                                  data={appState.inputBox}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "labelFontSize",
                                      newValue
                                    );
                                  }}
                                  min={5}
                                  max={25}
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="basis-2/3 ">
                                <ERPSlider
                                  id="fontWeight"
                                  label="Font Weight"
                                  className="bg-slate-300"
                                  value={appState.inputBox?.fontWeight}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "fontWeight",
                                      newValue
                                    );
                                  }}
                                  min={300}
                                  max={700}
                                  step={100}
                                />
                              </div>
                              <div className="basis-1/3 translate-y-3">
                                <ERPInput
                                  id="fontWeight"
                                  type="number"
                                  noLabel={true}
                                  value={appState.inputBox?.fontWeight}
                                  data={appState.inputBox}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "fontWeight",
                                      newValue
                                    );
                                  }}
                                  min={300}
                                  max={700}
                                  step={100}
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="basis-2/3 ">
                                <ERPSlider
                                  id="inputHeight"
                                  label="Height"
                                  className="bg-slate-300"
                                  value={appState.inputBox?.inputHeight}
                                  onChange={(e) => {
                                    const newValue = parseFloat(e.target?.value);

                                    handleInputBoxStyleChange(
                                      "inputHeight",
                                      newValue
                                    );
                                  }}
                                  min={0}
                                  max={5}
                                  step={0.1}
                                />
                              </div>
                              <div className="basis-1/3 translate-y-3">
                                <ERPInput
                                  id="inputHeight"
                                  type="number"
                                  noLabel={true}
                                  value={appState.inputBox?.inputHeight}
                                  data={appState.inputBox}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target?.value,
                                      10
                                    );

                                    handleInputBoxStyleChange(
                                      "inputHeight",
                                      newValue
                                    );
                                  }}
                                  min={0}
                                  max={5}
                                  step={0.1}
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="basis-1/2 ">
                                <ERPSlider
                                  id="adjustA"
                                  label={`AdjustA (${
                                    appState.inputBox?.adjustA ?? 0
                                  })`}
                                  className="bg-slate-300"
                                  value={appState.inputBox?.adjustA}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target?.value);

                                    handleInputBoxStyleChange(
                                      "adjustA",
                                      newValue
                                    );
                                  }}
                                  min={-30}
                                  max={30}
                                />
                              </div>
                              <div className="basis-1/2 ">
                                <ERPSlider
                                  id="adjustB"
                                  label={`AdjustB (${
                                    appState.inputBox?.adjustB ?? 0
                                  })`}
                                  className="bg-slate-300"
                                  value={appState.inputBox?.adjustB}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target?.value);

                                    handleInputBoxStyleChange(
                                      "adjustB",
                                      newValue
                                    );
                                  }}
                                  min={-30}
                                  max={30}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1 translate-y-[10px]">
                              <div className="flex items-center space-x-3">
                                <div className="basis-1/2 ">
                                  <ERPSlider
                                    id="adjustC"
                                    label={`AdjustC (${
                                      appState.inputBox?.adjustC ?? 0
                                    })`}
                                    className="bg-slate-300"
                                    value={appState.inputBox?.adjustC}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target?.value);

                                      handleInputBoxStyleChange(
                                        "adjustC",
                                        newValue
                                      );
                                    }}
                                    min={-30}
                                    max={30}
                                  />
                                </div>
                                <div className="basis-1/2 ">
                                  <ERPSlider
                                    id="adjustD"
                                    label={`AdjustD (${
                                      appState.inputBox?.adjustD ?? 0
                                    })`}
                                    className="bg-slate-300"
                                    value={appState.inputBox?.adjustD}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target?.value);

                                      handleInputBoxStyleChange(
                                        "adjustD",
                                        newValue
                                      );
                                    }}
                                    min={-30}
                                    max={30}
                                  />
                                </div>
                              </div>
                              <div className="px-4 text-secondary text-xs">
                                <b className="me-2">Note:</b>This usstyle won't
                                work in normal inputbox.
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="flex items-center ">
                            <label
                              htmlFor="borderColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                              Border Color
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.borderColor ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.borderColor}
                                  onChange={(e) => {
                                    
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "borderColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ">
                            <label
                              htmlFor="fontColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                              Font Color
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.fontColor ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.fontColor}
                                  onChange={(e) => {
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "fontColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ">
                            <label
                              htmlFor="labelColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                              Label Color
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.labelColor ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.labelColor}
                                  onChange={(e) => {
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "labelColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ">
                            <label
                              htmlFor="borderFocus"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                              Border Focus
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.borderFocus ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.borderFocus}
                                  onChange={(e) => {
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "borderFocus",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ">
                            <label
                              htmlFor="selectColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                             Active Select Box
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.selectColor ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.selectColor}
                                  onChange={(e) => {
                                    
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "selectColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ">
                            <label
                              htmlFor="selectColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                             Foucs Baground
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.selectColor ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.selectColor}
                                  onChange={(e) => {
                                    
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "selectColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ">
                            <label
                              htmlFor="selectColor"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold -translate-y-2"
                            >
                              {" "}
                             Active Select Box
                            </label>
                            <div className="ti-form-radio">
                              <div
                                className="  relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: `rgb(${
                                    appState.inputBox?.selectColor ??
                                    "128, 128, 128"
                                  })`,
                                }}
                              >
                                <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                                <input
                                  type="color"
                                  value={appState.inputBox?.selectColor}
                                  onChange={(e) => {
                                    
                                    const rgb = hexToRgb(e.target?.value); // Use e instead of event
                                    if (rgb) {
                                      handleInputBoxStyleChange(
                                        "selectColor",
                                        `${rgb?.r},${rgb?.g},${rgb?.b}`
                                      );
                                    }
                                  }}
                                  className="opacity-0 w-full h-full cursor-pointer "
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                   
                      
                      </div>

                      <div className="">
                        <p className="switcher-style-head">
                          Radio & Check Box:
                        </p>
                        <div className="grid  grid-cols-2 gap-3 items-center  switcher-style">
                          <ERPRadio
                            id="radioButton"
                            name="radioButton"
                            data={demo}
                            checked={demo.radioButton}
                            onChange={(e) => {
                              setDemo((prevTheme) => ({
                                ...prevTheme,
                                radioButton: !demo.radioButton,
                              }));
                            }}
                            label="Demo Radio Button"
                          />
                          <ERPCheckbox
                            id="radioButton"
                            name="radioButton"
                            data={demo}
                            checked={demo.checkBox}
                            onChange={(e) => {
                              setDemo((prevTheme) => ({
                                ...prevTheme,
                                checkBox: !demo.checkBox,
                              }));
                            }}
                            label="Demo checkBox"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4  switcher-style">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="inputCheckBoxSize"
                              className="ti-form-radio"
                              id="inputCheck-sm"
                              checked={
                                appState.inputBox?.checkButtonInputSize === "sm"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "checkButtonInputSize",
                                    "sm"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-sm"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              sm
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputCheckBoxSize"
                              className="ti-form-radio"
                              id="inputCheck-md"
                              checked={
                                appState.inputBox?.checkButtonInputSize === "md"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "checkButtonInputSize",
                                    "md"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-md"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              md
                            </label>
                          </div>
                          <div className="flex item-center">
                            <input
                              type="radio"
                              name="inputCheckBoxSize"
                              className="ti-form-radio"
                              id="inputCheck-lg"
                              checked={
                                appState.inputBox?.checkButtonInputSize === "lg"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputBoxStyleChange(
                                    "checkButtonInputSize",
                                    "lg"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="input-lg"
                              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                            >
                              {" "}
                              lg
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full p-2 flex justify-end space-x-2">
                    <ERPButton
                      title="Reset"
                      onClick={resetThemeChange}
                      type="reset"
                    ></ERPButton>
                    <ERPButton
                      title="Save Changes"
                      onClick={saveThemeChange}
                      variant="primary"
                    ></ERPButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountSettingsPreference;
