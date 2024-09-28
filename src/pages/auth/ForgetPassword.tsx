import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";


const ForgetPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  /* ########################################################################################### */

  const handleForgotPassword = async (event: any) => {
    // event.preventDefault();
    // if (data?.email) {
    //   setIsLoading(true);
    //   const response = (await dispatch(passwordReset(data))) as any;
    //   handleResponse(response, () => {
    //     setIsResetMailSend({ is_reset: true, email: data?.email });
    //     setData({});
    //   });
    //   setIsLoading(false);
    // }
  };

  /* ########################################################################################### */

  return (
    <>
     <div>
          <div className="mt-8">
            <p className="mt-2 text-sm text-gray-700">{t("forgot-password-title")}</p>
          </div>
          <div>
            <div className="flex flex-col ">
              <form autoComplete="off" onSubmit={handleForgotPassword} className="mt-10 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
                <div className="col-span-full ">
                  {/* <ERPInput label={t("email") || "email"} data={data} onChangeData={(data) => setData(data)} id="email" required type="email" /> */}
                </div>

                <div className="col-span-full">
                  <button
                    type="submit"
                    className="w-full flex h-9 mt-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? <div className="true ml-1 h-4 w-4 bg-white rounded-full animate-ping"></div> : t("reset-password")}
                  </button>
                </div>
              </form>
              <div className="flex justify-center pt-5">
                {/* <ChevronLeftIcon
                  className="h-5 w-5 text-gray-800 cursor-pointer"
                  onClick={() => setForgotPassword((prevData: boolean) => !prevData)}
                /> */}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default ForgetPasswordForm;
