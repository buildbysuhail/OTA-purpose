import Urls from "../../redux/urls";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ActionType } from "../../redux/types";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import "./profile.css";
import { handleResponse } from "../../utilities/HandleResponse";
import { APIClient } from "../../helpers/api-client";
import { ColorPicker, hexToRgb, } from "../../components/common/switcher/switcherdata/switcherdata";
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
import InputBoxStyling from "../../components/ERPComponents/erp-inputboxStyle-preference";
import ERPAlert from "../../components/ERPComponents/erp-sweet-alert";
import { changeLanguage } from "../../utilities/languageUtils";
import { useTranslation } from "react-i18next";

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
      handleResponse(response, () => { changeLanguage(response.item, dispatch, i18n) });
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
    try{
    setIsSaving(true);
    const res = await api.postAsync(Urls.updateUserThemes, {
      userThemes: btoa(JSON.stringify(appState)),
    });
    localStorage.setItem("ut", btoa(JSON.stringify(appState)));
    handleResponse(res, () => {
      localStorage.setItem("ut", btoa(JSON.stringify(appState)));
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
          handleResponse(res, () => {
            const theme = atob(res.item);
            // dispatch(setInputBox(res.inputBox));
            const _theme: AppState = customJsonParse(theme);
            localStorage.setItem("ut", res.item);
            updateAppState(_theme);
          });
        },
      });
    } catch (error) {
      console.error("Error getInputBox data:", error);
    }
  };

  return (
    <Fragment>
      <ERPButton
        title={t("reset_all")}
        onClick={resetThemeChange}
        type="reset"
      />
      <div className="grid grid-cols-12 gap-x-6">
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
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="theme-style"
                                className="ti-form-radio"
                                id="switcher-light-theme"
                                checked={appState.mode === "light"}
                                onChange={() => { switcherdata.Light(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-light-theme" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {t("light")}
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="theme-style"
                                className="ti-form-radio"
                                id="switcher-dark-theme"
                                checked={appState.mode === "dark"}
                                onChange={() => { switcherdata.Dark(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-dark-theme" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold" >
                                {t("dark")}
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="switcher-style-head">{t("directions")}</p>
                          <div className="grid grid-cols-3  switcher-style">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="direction"
                                className="ti-form-radio"
                                id="switcher-ltr"
                                checked={appState.dir != "rtl"}
                                onChange={(e) => { }}
                                onClick={(e) => { switcherdata.Ltr(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-ltr" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {t("ltr")}
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="direction"
                                className="ti-form-radio"
                                id="switcher-rtl"
                                checked={appState.dir == "rtl"}
                                onChange={(e) => { }}
                                onClick={(e) => { switcherdata.Rtl(updateAppState, appState); }}
                              />
                              <label htmlFor="switcher-rtl" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                                {t("rtl")}
                              </label>
                            </div>
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
                                onClick={() => { switcherdata.Defaultmenu(updateAppState, appState); }}
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
                                onClick={() => { switcherdata.Closedmenu(updateAppState, appState); }}
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
                                onClick={() => { switcherdata.iconTextfn(updateAppState, appState); }}
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
                                onClick={() => { switcherdata.iconOverayFn(updateAppState, appState); }}
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
                                onClick={() => { switcherdata.DetachedFn(updateAppState, appState); }}
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
                                onClick={() => { switcherdata.DoubletFn(updateAppState, appState); }}
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
                                onClick={(e) => {
                                  if (true == true) {
                                    switcherdata.Regular(
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
                                onClick={(e) => { switcherdata.Classic(updateAppState, appState); }}
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
                                onClick={(e) => { switcherdata.Modern(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.lightMenu(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.darkMenu(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.colorMenu(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.gradientMenu(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.transparentMenu(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.lightHeader(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.darkHeader(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.colorHeader(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.gradientHeader(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.transparentHeader(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.primaryColor1(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.primaryColor2(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.primaryColor3(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.primaryColor4(updateAppState, appState); }}
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
                              onClick={() => { switcherdata.primaryColor5(updateAppState, appState); }}
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
                                      onChange={() => { handleScrollbarChange("scrollbarWidth", width); }}
                                    />
                                    <label htmlFor={`scrollbar-${width}`} className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
                                      {width === "md" ? t("normal") : t("thin")}
                                    </label>
                                  </div>
                                ))
                              }
                            </div>

                            <div className="flex  ">
                              <div className="ti-form-radio -translate-x-1">
                                <div className="  relative theme-container h-6 w-6 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden" style={{ backgroundColor: `rgb(${appState.scrollbarColor ?? "128, 128, 128"})`, }}>
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

                              <label htmlFor="selectColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70  font-semibold  self-center">
                                {t("scrollbar_color")}
                              </label>
                            </div>
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
                        <p className="switcher-style-head ">{t("input_box_style")}</p>
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