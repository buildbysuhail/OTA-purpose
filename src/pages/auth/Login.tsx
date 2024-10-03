import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { EyeSlashIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import usFlag from "../../assets/images/flags/us_flag.png";

// import ERPToast from "../../components/ERPComponets/ERPToast";
import { useAppDispatch, useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { StateBase } from "../../base/state-base";
import { LoginData, loginUser } from "../../redux/slices/auth/login/thunk";
import ERPInput from "../../components/ERPComponents/erp-input";
import { UserModel } from "../../redux/slices/user-session/reducer";
import { useAppState } from "../../utilities/hooks/useAppState";
import { languagesData, Locale, Theme } from "../../redux/slices/app/types";

import { RootState } from "../../redux/store";
import { customJsonParse } from "../../utilities/jsonConverter";
import { syncAppStates } from "./syncSettings";
import LanguageSwitcher from "../../components/common/header/language-switcher";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginData>(new LoginData());
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [hasToChooseBranch, setHasToChooseBranch] = useState(false);
  const [isLoggedToBranch, setIsLoggedToBranch] = useState(false);
  const [error, setError] = useState<any>();
  const loginData: StateBase = useSelector((state: any) => state.Login);
  const comapanies = useSelector((state: any) => state?.GetUserCompanies);
  let userSessions = useAppSelector((state: RootState) => state.UserSession);
  const { appState, updateAppState } = useAppState();

  /* ########################################################################################### */
  
  const handleSubmit = async (event: any) => {
    
    event.preventDefault();
    if (data?.userName && data?.password) {
      setError(null);
      
      
        const login = await dispatch(loginUser(data)).unwrap();
        
        setError('');
        
        if (login.isOk == true) {   
          if(login.item.hasToChooseBranch) {
            setHasToChooseBranch(true);
            setIsLoggedToBranch(false);
          }
          else
          {
            setIsLoggedToBranch(true);
            setHasToChooseBranch(false);
          }
          Cookies.set("token", login.item.token, { expires: 30 }); 
          Cookies.set("up", login.item.userProfileDetails, { expires: 30 }); 
          Cookies.set("ut", login.item.userThemes, { expires: 30 }); 
          const _userProfileDetails = atob(login.item.userProfileDetails);
          const userProfileDetails: UserModel = customJsonParse(_userProfileDetails);
          const _userThemes = atob(login.item.userThemes);
          const userThemes: Theme = customJsonParse(_userThemes);
          let locale = (languagesData.find((l) => l.code == userProfileDetails.language))??{ code: 'en', name: 'English', flag: usFlag, rtl: false };
          syncAppStates(dispatch,userThemes, userProfileDetails, locale);          
        }
        else
        {setError(login.message)}
    } else {
      alert("Please fill all fields");
    }
  };

  /* ########################################################################################### */

  
  useEffect(() => {
    
    if (isLoggedToBranch
    ) {
      navigate("/");
    } else if(hasToChooseBranch) {
        
      navigate("/select-organization");
    }
  }, [hasToChooseBranch, isLoggedToBranch]);

  return (

<div className="bg-white dark:bg-gray-900">
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
Elevate your business to
new heights</h2>
          
        </div>
      </div>
    </div>

    <div className="flex relative items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
    <LanguageSwitcher className="!absolute top-0 right-0"></LanguageSwitcher>
      <div className="flex-1">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
            Polosys
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-300">
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
            <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
              <div className="col-span-full ">
                <ERPInput
                  label={t("email-phone-username")}
                  data={data}
                  onChangeData={(_data: any) => { setData(_data)}}
                  id="userName"
                  autocomplete=""
                  required
                  value={data.userName}
                  type="text"
                />
              </div>
              <div className="col-span-full ">
                <label className=" capitalize mb-1 block text-[12px] text-black">{t("password") || "password"}*</label>
                <div className="flex">
                  <div className="w-full">
                    <input
                      autoComplete="off"
                      placeholder="Password"
                      required
                      pattern="^\S+$"
                      title="Password must not contain whitespace characters."
                      onChange={(e) => setData({ ...data, password: e.target?.value })}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="rtl:border rtl:rounded-none  rtl:rounded-r  outline-none border-b border-l border-t w-full h-10 border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-2 focus:border-blue-500  focus:bg-white focus:outline-none  sm:text-sm rounded-l"
                    />
                  </div>
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="border border-gray-300 rounded-r flex justify-center items-center px-3 cursor-pointer rtl:border rtl:rounded-none rtl:rounded-l "
                  >
                    {showPassword ? <EyeSlashIcon className="text-black h-4 w-4" /> : <EyeIcon className="text-black h-4 w-4" />}
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
          <p className="mt-6 text-sm text-center text-gray-400">
            Don&#x27;t have an account yet?{" "}
            <a
              href="#"
              className="text-blue-500 focus:outline-none focus:underline hover:underline"
            >
              Sign up
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</div>


    
  );
};

export default Login;
