import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { EyeSlashIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector, } from "../../utilities/hooks/useAppDispatch";
import type { StateBase } from "../../base/state-base";
import { LoginData, loginUser } from "../../redux/slices/auth/login/thunk";
import { useAppState } from "../../utilities/hooks/useAppState";
import type { RootState } from "../../redux/store";
import { modelToBase64 } from "../../utilities/jsonConverter";
import LanguageSwitcher from "../../components/common/header/language-switcher";
import { Button } from "../../dark/Button";
import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { Sun, Moon } from "lucide-react";
import ERPModal from "../../components/ERPComponents/erp-modal";
import CounterSettings from "../settings/system/counter-settings";
import ForgotPassword from "./ForgetPassword";
import { setApplicationSettings } from "../../redux/slices/app/application-settings-reducer";
import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";
import polo from "../../assets/images/brand-logos/polo_logo.png";
import loginBg from "../../assets/images/login.jpg";
import ConfettiEffect from "./confetti-effect";
import { handleLoginSuccess } from "../../utilities/handles-login-success-utils";

const api = new APIClient()
const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('main')
  const [data, setData] = useState<LoginData>(new LoginData());
  const [showConfetti, setShowConfetti] = useState(false);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [hasToChooseBranch, setHasToChooseBranch] = useState(false);
  const [isLoggedToBranch, setIsLoggedToBranch] = useState(false);
  const [error, setError] = useState<any>();
  const loginData: StateBase = useSelector((state: any) => state.Login);
  const comapanies = useSelector((state: any) => state?.GetUserCompanies);
  const userSessions = useAppSelector((state: RootState) => state.UserSession);
  const { appState, updateAppState } = useAppState();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  /* ########################################################################################### */

  const [counterSettings, setCounterSettings] = useState<{
    show: boolean;
    token: string;
  }>({ show: false, token: "" });

  const load = async () => {
    const settings = await api.getAsync(Urls.application_setting);
    localStorage.setItem('as', modelToBase64(settings))
    dispatch(setApplicationSettings(
      {
        ...settings,
        apiLoaded: true
      }));
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (data?.userName && data?.password) {
      setError(null);
      const login = await dispatch(loginUser(data)).unwrap();
      setError("");
      if (login.isOk == true) {
        await handleLoginSuccess(
          login,
          dispatch,
          load,
          setIsLoggedToBranch,
          setHasToChooseBranch
        );
        
      } else {
        if (login.item.hasToSetCounter) {
          localStorage.setItem("_token", login.item.token);
          setCounterSettings({ show: true, token: login.item.token });
        } else {
          setError(login.message);
        }
      }
    } else {
      alert(t("please_fill_all_fields"));
    }
  };

  /* ########################################################################################### */

  useEffect(() => {
    if (isLoggedToBranch) {
      navigate("/");
    } else if (hasToChooseBranch) {
      navigate("/select-organization");
    }
  }, [hasToChooseBranch, isLoggedToBranch]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedLogin');
    if (!hasVisited) {
      setShowConfetti(true);
      localStorage.setItem('hasVisitedLogin', 'true');
    }
  }, []);

  return (
    <div className="bg-white dark:bg-dark-bg">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{ backgroundImage: `url(${loginBg})`, }}>
          <div className="flex items-center h-full px-20">
            <div>
              <h2 className="text-4xl font-bold text-white">
                {t("elevate_your_business_to_new_heights")}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex relative items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="!absolute top-[7px] right-[26px]">
            {/* <span className="mr-2">{appState.mode === 'dark' ? 'Dark' : 'Light'} Mode</span> */}
            <Button
              onClick={() => {
                appState.mode === "light"
                  ? switcherdata.Dark(updateAppState, appState)
                  : switcherdata.Light(updateAppState, appState);
              }}
              variant="ghost"
              size="icon">
              {appState.mode === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">{t("toggle_dark_mode")}</span>
            </Button>
          </div>

          <LanguageSwitcher className="!absolute top-0 right-0"></LanguageSwitcher>
          {/* <ConfettiEffect /> */}

          {
            showConfetti && (
              <div className="fixed inset-0 z-50 pointer-events-none">
                <ConfettiEffect />
              </div>
            )
          }

          <div className="flex-1">
            <div className="text-center">
              <img src={polo} alt="logo" className="unset h-[110px] w-[150px] mx-auto my-4" />
              {/* <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-dark-text">
                Polosys
              </h2> */}
              <p className="mt-3 text-gray-500 dark:text-dark-text">
                {t("sign_in_to_access_your_account")}
              </p>
            </div>

            <div className="mt-8">
              {
                error && (
                  <div className="w-full bg-[#fef2f2] py-2 px-4 rounded-md flex items-center justify-between border border-[#fee2e2]">
                    <p className="text-[13px] text-[#dc2626]">{error}</p>
                    <XMarkIcon
                      className="w-4 aspect-square stroke-[#dc2626] cursor-pointer"
                      onClick={() => { setError(null); }}
                    />
                  </div>
                )
              }

              <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2" >
                <div className="col-span-full ">
                  <label className=" capitalize mb-1 block text-[12px] dark:text-dark-text text-black">
                    {t("email-phone-username")}
                  </label>
                  <input
                    id="userName"
                    type="text"
                    value={data.userName}
                    onChange={(e) => setData({ ...data, userName: e.target.value })}
                    required
                    autoComplete=""
                    className="rtl:border rtl:rounded-none  rtl:rounded-r  outline-none border-b border-l border-t w-full h-10 dark:border-dark-border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-2 focus:border-[#3b82f6]  focus:bg-white focus:outline-none  sm:text-sm rounded-l"
                  />
                </div>

                <div className="col-span-full ">
                  <label className=" capitalize mb-1 block text-[12px] dark:text-dark-text text-black">
                    {t("password") || "password"}*
                  </label>
                  <div className="flex">
                    <div className="w-full">
                      <input
                        autoComplete="off"
                        placeholder={t("password")}
                        required
                        pattern="^\S+$"
                        title={t("password_whitespace_error")}
                        onChange={(e) => setData({ ...data, password: e.target?.value })}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="rtl:border rtl:rounded-none  rtl:rounded-r  outline-none border-b border-l border-t w-full h-10 dark:border-dark-border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-2 focus:border-[#3b82f6]  focus:bg-white focus:outline-none  sm:text-sm rounded-l"
                      />
                    </div>

                    <div onClick={() => setShowPassword(!showPassword)} className="border dark:border-dark-border border-gray-300 rounded-r flex justify-center items-center px-3 cursor-pointer rtl:border rtl:rounded-none rtl:rounded-l ">
                      {
                        showPassword ? (
                          <EyeSlashIcon className="dark:text-dark-text text-black h-4 w-4" />
                        ) : (
                          <EyeIcon className="dark:text-dark-text text-black h-4 w-4" />
                        )
                      }
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="text-xs flex justify-end text-[#2563eb] ">
                    {/* <span className="cursor-pointer font-medium" onClick={() => setForgotPassword((prevData: boolean) => !prevData)}>
                    {t("forgot-password")}?
                  </span> */}
                  </div>

                  <button type="submit" className="w-full flex h-9 mt-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-custom-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]">
                    {
                      comapanies?.loading || loginData?.loading ? (
                        <div className="true ml-1 h-4 w-4 bg-white rounded-full animate-ping"></div>
                      ) : (
                        t("login")
                      )
                    }
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center dark:text-dark-text text-gray-600">
                <a
                  href="#"
                  className="text-[#3b82f6] focus:outline-none focus:underline hover:underline"
                  onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }} >
                  {t("forgot_password")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {counterSettings.show &&
      <ERPModal
        isForm={true}
        isOpen={counterSettings.show}
        closeButton="LeftArrow"
        hasSubmit={false}
        closeTitle={t("close")}
        title={t("counter_settings")}
        width={800}
        height={600}
        minHeight={600}
        closeModal={() => { setCounterSettings({ show: false, token: "" }); }}
        content={
          <CounterSettings
            token={counterSettings.token}
            isFromLogin={true}
            onSuccess={() => setCounterSettings({ show: false, token: "" })}
          />
        }
      />
      }
      {
        showForgotPassword && (
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        )
      }
    </div>
  );
};

export default Login;
