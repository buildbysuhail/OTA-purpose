import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { EyeSlashIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import usFlag from "../../assets/images/flags/us_flag.png";

// import ERPToast from "../../components/ERPComponets/ERPToast";
import {
  useAppDispatch,
  useAppSelector,
} from "../../utilities/hooks/useAppDispatch";
import type { StateBase } from "../../base/state-base";
import { LoginData, loginUser } from "../../redux/slices/auth/login/thunk";
import ERPInput from "../../components/ERPComponents/erp-input";
import type { UserModel } from "../../redux/slices/user-session/reducer";
import { useAppState } from "../../utilities/hooks/useAppState";
import { type AppState, languagesData } from "../../redux/slices/app/types";

import type { RootState } from "../../redux/store";
import { customJsonParse, modelToBase64 } from "../../utilities/jsonConverter";
import { syncAppStates } from "./syncSettings";
import LanguageSwitcher from "../../components/common/header/language-switcher";
import type { UserTypeRights } from "../../redux/slices/user-rights/reducer";
import { Button } from "../../dark/Button";
import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { Sun, Moon } from "lucide-react";
import ERPModal from "../../components/ERPComponents/erp-modal";
import CounterSettings from "../settings/system/counter-settings";
import ForgotPassword from "./ForgetPassword";
import { ApplicationSettingsType } from "../settings/system/application-settings-types/application-settings-types";
import { setApplicationSettings } from "../../redux/slices/app/application-settings-reducer";
import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";
import polo from "../../assets/images/brand-logos/polo_logo.png";
import ConfettiEffect from "./confetti-effect";

const api = new APIClient()
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginData>(new LoginData());
  const [showConfetti, setShowConfetti] = useState(false);
  const { t } = useTranslation();
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
  const load = async() => {
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
        let ass = localStorage.getItem("as");
    let appSettings: ApplicationSettingsType;
    try {
      
      if (ass != undefined && ass != null && ass != "") {
        appSettings = customJsonParse(atob(ass));
        dispatch(setApplicationSettings(
          {
            ...appSettings,
            apiLoaded: false
        }));
      }else{
        await load();
      }
    } catch (error) { }
        if (login.item.hasToChooseBranch) {
          setHasToChooseBranch(true);
          setIsLoggedToBranch(false);
        } else { 
          setIsLoggedToBranch(true);
          setHasToChooseBranch(false);
        }
        localStorage.removeItem("_token");
        localStorage.setItem("token", login.item.token);
        localStorage.setItem("up", login.item.userProfileDetails);
        localStorage.setItem("ut", login.item.userThemes);
        localStorage.setItem("ur", login.item.useRights);
        const _userProfileDetails = atob(login.item.userProfileDetails);
        const userProfileDetails: UserModel =
          customJsonParse(_userProfileDetails);
        const _userRights = atob(login.item.userRights);
        const userRights: UserTypeRights[] = customJsonParse(_userRights);
        const _userThemes = atob(login.item.userThemes);
        const userThemes: AppState = customJsonParse(_userThemes);
        const locale = languagesData.find(
          (l) => l.code == userProfileDetails.language
        ) ?? {
          code: "en",
          name: "English",
          flag: usFlag,
          rtl: false,
        };
        syncAppStates(
          dispatch,
          userThemes,
          userProfileDetails,
          userRights,
          locale 
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
      alert("Please fill all fields");
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
          style={{
            backgroundImage:
              "url('https://fourthrev.com/wp-content/uploads/2023/03/FR_Blog_How-to-Become-a-Data-Analyst-in-2023_Blog_1200x628-1-768x402.png')",
          }}
        >
          <div className="flex items-center h-full px-20">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Elevate your business to new heights
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
              size="icon"
            >
              {appState.mode === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          </div>
          <LanguageSwitcher className="!absolute top-0 right-0"></LanguageSwitcher>
          {/* <ConfettiEffect /> */}

          {showConfetti && (
            <div className="fixed inset-0 z-50 pointer-events-none">
            <ConfettiEffect />
          </div>
           )}
          <div className="flex-1">
            <div className="text-center">
              <img src={polo} alt="logo" className="unset h-[110px] w-[150px] mx-auto my-4"  />
              {/* <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-dark-text">
                Polosys
              </h2> */}
              <p className="mt-3 text-gray-500 dark:text-dark-text">
                Sign in to access your account
              </p>
            </div>

            <div className="mt-8">
              {error && (
                <div className="w-full bg-red-50 py-2 px-4 rounded-md flex items-center justify-between border border-red-100">
                  <p className="text-[13px] text-red-600">{error}</p>
                  <XMarkIcon
                    className="w-4 aspect-square stroke-red-600 cursor-pointer"
                    onClick={() => {
                      setError(null);
                    }}
                  />
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className="mt-5 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2"
              >
                <div className="col-span-full ">
                  <label className=" capitalize mb-1 block text-[12px] dark:text-dark-text text-black">
                    {t("email-phone-username")}
                  </label>
                  <input
                    id="userName"
                    type="text"
                    value={data.userName}
                    onChange={(e) =>
                      setData({ ...data, userName: e.target.value })
                    }
                    required
                    autoComplete=""
                    className="rtl:border rtl:rounded-none  rtl:rounded-r  outline-none border-b border-l border-t w-full h-10 dark:border-dark-border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-2 focus:border-blue-500  focus:bg-white focus:outline-none  sm:text-sm rounded-l"
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
                        placeholder="Password"
                        required
                        pattern="^\S+$"
                        title="Password must not contain whitespace characters."
                        onChange={(e) =>
                          setData({ ...data, password: e.target?.value })
                        }
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="rtl:border rtl:rounded-none  rtl:rounded-r  outline-none border-b border-l border-t w-full h-10 dark:border-dark-border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-2 focus:border-blue-500  focus:bg-white focus:outline-none  sm:text-sm rounded-l"
                      />
                    </div>
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="border dark:border-dark-border border-gray-300 rounded-r flex justify-center items-center px-3 cursor-pointer rtl:border rtl:rounded-none rtl:rounded-l "
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="dark:text-dark-text text-black h-4 w-4" />
                      ) : (
                        <EyeIcon className="dark:text-dark-text text-black h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-full">
                  <div className="text-xs flex justify-end text-blue-600 ">
                    {/* <span className="cursor-pointer font-medium" onClick={() => setForgotPassword((prevData: boolean) => !prevData)}>
                    {t("forgot-password")}?
                  </span> */}
                  </div>
                  <button
                    type="submit"
                    className="w-full flex h-9 mt-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-custom-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {comapanies?.loading || loginData?.loading ? (
                      <div className="true ml-1 h-4 w-4 bg-white rounded-full animate-ping"></div>
                    ) : (
                      t("login")
                    )}
                  </button>
                </div>
              </form>
              <p className="mt-6 text-sm text-center dark:text-dark-text text-gray-600">
                <a
                  href="#"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot Password?
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <ERPModal
        isForm={true}
        isOpen={counterSettings.show}
        closeButton="LeftArrow"
        hasSubmit={false}
        closeTitle="Close"
        title="Counter Settings"
        width="w-full max-w-[700px]"
        minHeight={800}
        closeModal={() => {
          setCounterSettings({ show: false, token: "" });
        }}
        content={
          <CounterSettings
          token={counterSettings.token}
          isFromLogin={true}
          onSuccess={() => setCounterSettings({ show: false, token: "" })}
        />
      }
      ></ERPModal>

      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;
