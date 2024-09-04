import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EyeSlashIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

import { DataToForm } from "../../utilities/Utils";
import desktopdark from "../../assets/images/brand-logos/desktop-dark.png";
import quotes from "../../assets/images/apps/quotes.webp";
// import SBToast from "../../components/SBComponets/SBToast";
import SocialLogins from "./SocialLogins";
import { APIClient } from "../../helpers/api-client";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { StateBase } from "../../base/state-base";
import { LoginData, loginUser, LoginValidations } from "../../redux/slices/auth/login/thunk";
import { getUserSession } from "../../redux/slices/auth/profile/thunk";
import ERPInput from "../../components/ERPComponents/erp-input";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginData>(new LoginData());
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<any>();
  const loginData: StateBase = useSelector((state: any) => state.Login);
  const comapanies = useSelector((state: any) => state?.GetUserCompanies);

  /* ########################################################################################### */

  const handleSubmit = async (event: any) => {
    
    
    event.preventDefault();
    if (data?.userName && data?.password) {
      setError(null);
      
      
        const login = await dispatch(loginUser(data)).unwrap();
        
        if (login.isOk == true) {   
          Cookies.set("token", login.item.token, { expires: 30 });       
            navigate("/");
        }
        else
        {setError(login.message)}
    } else {
      alert("Please fill all fields");
    }
  };

  /* ########################################################################################### */

  const token = Cookies.get("token");
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    } else {
      // navigate("/login");
    }
  }, [token]);

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

    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
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
                  label={t("Email or Phone or Username")}
                  data={data}
                  onChangeData={(data: any) => setData(data)}
                  id="userName"
                  autocomplete=""
                  required
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
                  className="w-full flex h-9 mt-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
