import Urls from "../../redux/urls";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ActionType } from "../../redux/types";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import "./profile.css";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import Themeprimarycolor, { ColorPicker, hexToRgb, } from "../../components/common/switcher/switcherdata/switcherdata";
import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { useAppState } from "../../utilities/hooks/useAppState";
import { AppState, inputBox, Theme, } from "../../redux/slices/app/types";
import { customJsonParse } from "../../utilities/jsonConverter";
import { useAppSelector, } from "../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import { reduxManager } from "../../redux/dynamic-store-manager-pro";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import { ERPScrollArea } from "../../components/ERPComponents/erp-scrollbar";
import InputBoxStyling, { ColorPickerInput } from "../../components/ERPComponents/erp-inputboxStyle-preference";
import ERPAlert from "../../components/ERPComponents/erp-sweet-alert";
import { changeLanguage } from "../../utilities/languageUtils";
import { useTranslation } from "react-i18next";
import { setStorageString } from "../../utilities/storage-utils";
import useDebounce from "../inventory/transactions/purchase/use-debounce";
import ERPRadio from "../../components/ERPComponents/erp-radio";

interface AccountSettingsProps { }
interface UserLanguage {
  language?: string | null;
}

const api = new APIClient();
const AccountSettingsPreference: FC<AccountSettingsProps> = (props: any) => {
  const [language, setLanguage] = useState<string>("en");
  const [_language, _setLanguage] = useState<string>("en");
  const [phone, setPhone] = useState<string>("");
  const [_phone, set_Phone] = useState<string>("");
  const [isOpenEmailChange, setIsOpenEmailChange] = useState<boolean>(false);
  const [isOpenPhoneChange, setIsOpenPhoneChange] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [postDataEmail, setPostDataEmail] = useState<any>({
    data: { userName: "", password: "", newValue: "" },
    validations: { userName: "", password: "", newValue: "" },
    tokenSend: false,
  });
  const [postDataEmailTokenVerify, setPostDataEmailTokenVerify] = useState<any>({ userName: "", newValue: "", otp: "", confirToken: "" });
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
  const { t, i18n } = useTranslation('main');
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
      handleResponse(response, async() => {await changeLanguage(response.item, dispatch, i18n) });
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
      selectColor: "128, 128, 128",
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
      focusForeColor: "black",
      focusBgColor: "255, 204, 88",
      bold: false
    },
  });

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

  const handleChange = (field: keyof AppState, value: any) => {
    const _appState = {
      ...appState,
      [field]: value,
    };
    updateAppState(_appState);
  };

  const saveThemeChange = async () => {
    debugger;
    try{
    setIsSaving(true);
    const res = await api.postAsync(Urls.updateUserThemes, {
      userThemes: btoa(JSON.stringify(appState)),
    });
    await setStorageString("ut", btoa(JSON.stringify(appState)));
    handleResponse(res, async() => {
      await setStorageString("ut", btoa(JSON.stringify(appState)));
    });}
    finally{
      setIsSaving(false);
    }
  };

  const resetThemeChange = async () => {
    try {
      ERPAlert.show({
        title: t("are_you_sure_reset_now"),
        icon: "warning",
        confirmButtonText: t("yes_reset_now"),
        cancelButtonText: t("cancel"),
        onConfirm: async (result: any) => {
          const res = await api.postAsync(Urls.reset_user_theme, {});
          handleResponse(res,async () => {
            const theme = atob(res.item);
            // dispatch(setInputBox(res.inputBox));
            const _theme: AppState = customJsonParse(theme);
            await setStorageString("ut", res.item);
            updateAppState(_theme);
          });
        },
      });
    } catch (error) {
      console.error("Error getInputBox data:", error);
    }
  };
 const debouncedHandleChange = useDebounce(handleChange, 300);
  return (
    <Fragment>
      <ERPButton
        title={t("reset_all")}
        onClick={resetThemeChange}
        type="reset"
      />
      <div   className="grid grid-cols-12 gap-x-6 mt-[2px]">
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12 ">
          <div className="grid grid-cols-12 gap-x-6">
            <div id="avatar" className={`xxl:col-span-12 xl:col-span-12 ${path === "avatar" ? "blink" : ""} col-span-12`}>
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {t("language_&_typing")}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      {t("language_preference")}
                    </p>
                  </div>
                </div>

                <div className="box-body">
                  <div className="items-start mb-6">
                    <ERPDataCombobox
                      field={{
                        id: "language",
                        valueKey: "value",
                        labelKey: "label",
                      }}
                      id="language"
                      label={t("language")}
                      value={language}
                      onChange={(e) => { setLanguage(e?.value); }}
                      options={[
                        { value: "ar", label: "العربية" },
                        { value: "en", label: "English" },
                      ]}
                    />
                    <div className="w-full p-2 flex justify-end space-x-2">
                      <ERPButton
                        title={t("reset")}
                        onClick={restLanguage}
                        type="reset"
                      />
                      <ERPButton
                        title={t("save_changes")}
                        onClick={updateLanguage}
                        variant="primary"
                        loading={userLanguage.loading}
                        disabled={userLanguage.loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6">
            <div id="avatar" className={`xxl:col-span-12 xl:col-span-12 ${path === "avatar" ? "blink" : ""} col-span-12`}>
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {t("coloring")}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      {t("set_your_theme_here")}
                    </p>
                  </div>
                </div>

                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="ti-offcanvas-body" id="switcher-body">
                      <div
                        id="switcher-1"
                        role="tabpanel"
                        aria-labelledby="switcher-item-1"
                        className="">
                        <div className="">
                          <p className="switcher-style-head">
                            {t("theme_color_mode")}
                          </p>
                          <div className="grid grid-cols-3 switcher-style">
                            <ERPRadio
                              id="light"
                              name="light"
                              value="light"
                              checked={appState.mode === "light"}
                              onChange={async () => {
                                await switcherdata.Light(updateAppState, appState);
                              }}
                              label={t("light")}
                            />

                            <ERPRadio
                              id="dark"
                              name="dark"
                              value="dark"
                              checked={appState.mode === "dark"}
                              onChange={async () => {
                                await switcherdata.Dark(updateAppState, appState);
                              }}
                              label={t("dark")}
                            />
                          </div>
                        </div>

                        <div>
                          <p className="switcher-style-head">{t("directions")}</p>
                          <div className="grid grid-cols-3  switcher-style">
                            <ERPRadio
                              id="ltr"
                              name="ltr"
                              value="ltr"
                              checked={appState.dir === "ltr"}
                              onClick={async() => {await  switcherdata.Ltr(updateAppState, appState); }}
                              label={t("ltr")}
                            />  
                            <ERPRadio
                              id="rtl"
                              name="rtl"
                              value="rtl"
                              checked={appState.dir === "rtl"}
                              onClick={ async() => { await  switcherdata.Rtl(updateAppState, appState); }}  
                              label={t("rtl")}
                            />                                                      
                          </div>
                        </div>

                        <div className=" sidemenu-layout-styles">
                          <p className="switcher-style-head">
                            {t("side_menu_layout_styles")}
                          </p>
                          <div className="grid grid-cols-2 gap-2 switcher-style">
                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-default-menu"
                                checked={appState.dataMenuStyles == "defaultmenu"}
                                onChange={(_e) => { }}
                                onClick={async() => { await switcherdata.Defaultmenu(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-default-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                                {t("default_menu")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-closed-menu"
                                checked={appState.dataMenuStyles == "closedmenu"}
                                onChange={(_e) => { }}
                                onClick={async() => { await switcherdata.Closedmenu(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-closed-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                                {t("closed_menu")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-icontext-menu"
                                checked={appState.dataMenuStyles == "iconTextfn"}
                                onChange={(_e) => { }}
                                onClick={async() => { await switcherdata.iconTextfn(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-icontext-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                                {t("icon_text")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-icon-overlay"
                                checked={appState.dataMenuStyles == "iconOverayFn"}
                                onClick={async() => { await switcherdata.iconOverayFn(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-icon-overlay" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                                {t("icon_overlay")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-detached"
                                checked={appState.dataMenuStyles == "detachedFn"}
                                onChange={(_e) => { }}
                                onClick={async() => {await  switcherdata.DetachedFn(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-detached" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                                {t("detached")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="sidemenu-layout-styles"
                                className="ti-form-radio"
                                id="switcher-double-menu"
                                checked={appState.dataMenuStyles == "doubletFn"}
                                onChange={(_e) => { }}
                                onClick={async() => {await  switcherdata.DoubletFn(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-double-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold" >
                                {t("double_menu")}
                              </label>
                            </div>
                          </div>

                          <div className="px-4 text-secondary text-xs">
                            <b className="me-2">{t("note")}</b>
                            {t("navigation_menu_styles_won't_work_here")}
                          </div>
                        </div>

                        <div>
                          <p className="switcher-style-head">{t("page_styles")}</p>
                          <div className="grid grid-cols-3 switcher-style">
                            <div className="flex">
                              <input
                                type="radio"
                                name="data-page-styles"
                                className="ti-form-radio"
                                id="switcher-regular"
                                checked={appState.dataPageStyle == "regular"}
                                onChange={(_e) => { }}
                                onClick={async(e) => {
                                  if (true == true) {
                                     await switcherdata.Regular(
                                      updateAppState,
                                      appState
                                    );
                                  }
                                }}
                              />
                              <label htmlFor="switcher-regular" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {t("regular")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="data-page-styles"
                                className="ti-form-radio"
                                id="switcher-classic"
                                checked={appState.dataPageStyle == "classic"}
                                onChange={(_e) => { }}
                                onClick={async() => {await switcherdata.Classic(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-classic" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {t("classic")}
                              </label>
                            </div>

                            <div className="flex">
                              <input
                                type="radio"
                                name="data-page-styles"
                                className="ti-form-radio"
                                id="switcher-modern"
                                checked={appState.dataPageStyle == "modern"}
                                onChange={(_e) => { }}
                                onClick={async() => {await switcherdata.Modern(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-modern" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {t("modern")}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full p-2 flex justify-end space-x-2">
                      <ERPButton
                        title={t("save_changes")}
                        onClick={saveThemeChange}
                        variant="primary"
                        loading={isSaving}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xxl:col-span-6 xl:col-span-12  col-span-12 ">
          <div id="basic-information" className={`xxl:col-span-12 xl:col-span-12 ${path === "basic-information" ? "blink" : ""} col-span-12`}>
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  {t("theme")}
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    {t("set_your_theme_here")}
                  </p>
                </div>
              </div>

              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <div className="ti-offcanvas-body" id="switcher-body">
                    <div id="switcher-1" role="tabpanel" aria-labelledby="switcher-item-1" className="">
                      <div className="theme-colors">
                        <p className="switcher-style-head">{t("menu_colors")}</p>
                        <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-white"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "light"}
                              onChange={(_e) => { }}
                              id="switcher-menu-light"
                              onClick={async() => {await switcherdata.lightMenu(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("light_menu")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-dark"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "dark"}
                              onChange={(_e) => { }}
                              id="switcher-menu-dark"
                              onClick={async() => {await switcherdata.darkMenu(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("dark_menu")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-primary"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "color"}
                              onChange={(_e) => { }}
                              id="switcher-menu-primary"
                              onClick={async() => {await switcherdata.colorMenu(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("color_menu")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-gradient"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "gradient"}
                              onChange={(_e) => { }}
                              id="switcher-menu-gradient"
                              onClick={async() => {await switcherdata.gradientMenu(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("gradient_menu")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-transparent"
                              type="radio"
                              name="menu-colors"
                              checked={appState.dataMenuStyles == "transparent"}
                              onChange={(_e) => { }}
                              id="switcher-menu-transparent"
                              onClick={async() => {await switcherdata.transparentMenu(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip"  >
                              {t("transparent_menu")}
                            </span>
                          </div>
                        </div>

                        <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]">
                          <b className="me-2">{t("note")}</b>
                          {t("theme_color_picker")}
                        </div>
                      </div>
{appState.colorPrimaryRgb}
{appState.colorPrimary}
                      <div className="theme-colors">
                        <p className="switcher-style-head">{t("header_colors")}</p>
                        <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-white !border"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "light"}
                              onChange={(_e) => { }}
                              id="switcher-header-light"
                              onClick={async() => {await switcherdata.lightHeader(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("light_header")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-dark"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "dark"}
                              onChange={(_e) => { }}
                              id="switcher-header-dark"
                              onClick={async() => {await switcherdata.darkHeader(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("dark_header")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-primary"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "color"}
                              onChange={(_e) => { }}
                              id="switcher-header-primary"
                              onClick={async() => {await switcherdata.colorHeader(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("color_header")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-gradient"
                              type="radio"
                              name="header-colors"
                              checked={appState.dataHeaderStyles == "gradient"}
                              onChange={(_e) => { }}
                              id="switcher-header-gradient"
                              onClick={async() => {await switcherdata.gradientHeader(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip">
                              {t("gradient_header")}
                            </span>
                          </div>

                          <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                            <input
                              className="hs-tooltip-toggle ti-form-radio color-input color-transparent"
                              type="radio"
                              checked={
                                appState.dataHeaderStyles == "transparent"
                              }
                              onChange={(_e) => { }}
                              name="header-colors"
                              id="switcher-header-transparent"
                              onClick={async() => {await switcherdata.transparentHeader(updateAppState, appState); }}
                            />
                            <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black" role="tooltip" >
                              {t("transparent_header")}
                            </span>
                          </div>
                        </div>

                        <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]">
                          <b className="me-2">{t("note")}</b>
                          {t("header_color_picker")}
                        </div>
                      </div>

                      <div className="theme-colors">
                        <p className="switcher-style-head">{t("theme_primary")}</p>

                        <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-1"
                              type="radio"
                              name="theme-primary"
                              checked={appState.colorPrimaryRgb == "58, 88, 146"}
                              id="switcher-primary"
                              onClick={async() => {await switcherdata.primaryColor1(updateAppState, appState); }}
                            />
                          </div>

                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-2"
                              type="radio"
                              name="theme-primary"
                              checked={appState.colorPrimaryRgb == "92, 144 ,163"}
                              onChange={(_e) => { }}
                              id="switcher-primary1"
                              onClick={async() => {await switcherdata.primaryColor2(updateAppState, appState); }}
                            />
                          </div>

                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-3"
                              type="radio"
                              name="theme-primary"
                              checked={appState.colorPrimaryRgb == "161, 90 ,223"}
                              onChange={(_e) => { }}
                              id="switcher-primary2"
                              onClick={async() => {await switcherdata.primaryColor3(updateAppState, appState); }}
                            />
                         </div>

                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-4"
                              type="radio"
                              name="theme-primary"
                              checked={appState.colorPrimaryRgb == "78, 172, 76"}
                              onChange={(_e) => { }}
                              id="switcher-primary3"
                              onClick={async() => {await switcherdata.primaryColor4(updateAppState, appState); }}
                            />
                          </div>

                          <div className="ti-form-radio switch-select">
                            <input
                              className="ti-form-radio color-input color-primary-5"
                              type="radio"
                              name="theme-primary"
                              checked={appState.colorPrimaryRgb == "223, 90, 90"}
                              onChange={(_e) => { }}
                              id="switcher-primary4"
                              onClick={async() => {await switcherdata.primaryColor5(updateAppState, appState); }}
                            />
                          </div>

                          <div className="ti-form-radio switch-select ps-0 mt-1 ">
                            <div
                              className="theme-container"
                              style={{ backgroundColor: `rgb(${appState.colorPrimaryRgb})`, }}>
                            </div>

                            <div className="pickr-container-primary">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}>

                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={async(e: any) => {
                                        const rgb = hexToRgb(e.target?.value);
                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                          await switcherdata.primaryColorCustom(
                                            updateAppState,
                                            appState,
                                            `${r},  ${g},  ${b}`
                                          );
                                          console.log("rgb pass",rgb);
                                          
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
                        <p className="switcher-style-head">{t("scrollbar")}</p>
                        <div className="grid grid-cols-2 gap-2 switcher-style">
                          <div className="flex flex-col gap-3">
                            <h6 className="switcher-style-head ">
                              {t("scrollbar_width")}
                            </h6>
                            <div className="flex flex-col gap-2">
                              {
                                ["md", "sm"].map((width) => (
                                  <div key={width} className="flex items-center">
                                    <input
                                      type="radio"
                                      name="data-page-scrollbar"
                                      className="ti-form-radio"
                                      id={`scrollbar-${width}`}
                                      checked={appState.scrollbarWidth === width}
                                      onChange={() => { debouncedHandleChange("scrollbarWidth", width); }}
                                    />
                                    <label htmlFor={`scrollbar-${width}`} className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
                                      {width === "md" ? t("normal") : t("thin")}
                                    </label>
                                  </div>
                                ))
                              }
                             </div>
                                       <ColorPickerInput
                                        label={t("scrollbar_color")}
                                        value={appState.scrollbarColor}
                                        onChange={(value) => debouncedHandleChange("scrollbarColor", value)}
                                      />
                             </div>
                          {/* Preview Section */}
                          <ERPScrollArea className="w-full h-64 border border-gray-300 overflow-y-auto rounded-md">
                            <div className="h-96 p-2">
                              <p>{t("scrollbar_preview")}</p>
                              <p>{t("scroll_down_to_see_the_effect")}</p>
                              <p>{t("normal_and_thin_options_are_available")}</p>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                              <p>Sed do eiusmod tempor incididunt ut labore et  dolore magna aliqua.</p>
                              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                            </div>
                          </ERPScrollArea>
                        </div>
                      </div>

                      <div className="">
                        <p className="switcher-style-head mb-2">{t("input_box_style")}</p>
                        <div className="flex justify-end items-center mt-3"></div>
                          <InputBoxStyling
                            inputBox={appState.inputBox}
                            onInputBoxChange={handleInputBoxStyleChange}
                          />
                      </div>
                    </div>
                  </div>

                  <div className="w-full p-2 flex justify-end space-x-2">
                    <ERPButton
                      title={t("save_changes")}
                      onClick={saveThemeChange}
                      variant="primary"
                      loading={isSaving}
                      disabled={isSaving}
                    />
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