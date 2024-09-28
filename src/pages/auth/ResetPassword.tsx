import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";


const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);

  const [ResetError, setResetError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<any>({});
  const [resetPassswordData, setResetPassswordData] = useState<any>({});
  const [timer, setTimer] = useState(60);

  /* ########################################################################################### */

  const submitResetPassword = async (event: any) => {
    event.preventDefault();
    if (resetPassswordData?.password && resetPassswordData?.token) {
      if (/\s/.test(resetPassswordData?.password)) {
        // ERPToast.show("Password must not contain any whitespace characters.", "error");
      } else if (confirmPassword?.confirmPassword === resetPassswordData?.password) {
        setIsLoading(true);
        // const response = (await dispatch(passwordResetConfirm({ ...resetPassswordData, email: data?.email }))) as any;
        // handleResponse(response, () => {
        //   setResetError(false);
        //   setIsResetMailSend({ is_reset: false });
        //   setForgotPassword(false);
        //   setResetPassswordData({});
        // });
        // setIsLoading(false);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  /* ########################################################################################### */

  // ============ Resend Secret Code function ============
  const handleResendCode = async () => {
    // setIsResendLoading(true);
    // const response = (await dispatch(passwordReset(data))) as any;
    // handleResponse(response, () => {
    //   setIsResendLoading(false);
    //   setTimer(60);
    // });
  };

  // ===================== Timer ==================
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     show && setTimer((prevValue: number) => (prevValue == 0 ? 0 : prevValue - 1));
  //   }, 1000);
  //   return () => {
  //     clearInterval(timer);
  //     setTimer(60);
  //   };
  // }, [show]);

  return (
    <>
      <div>
          <div className="mt-8">
            <p className="mt-2 text-sm text-gray-700">{t("new-password-title")}</p>
          </div>
          <div>
            <div className="flex flex-col ">
              <form onSubmit={submitResetPassword} className="mt-5 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
                <div className="col-span-full "></div>
                <div className="col-span-full ">
                  {/* <ERPInput
                    label={t("new-password")}
                    autocomplete="off"
                    data={resetPassswordData}
                    onChangeData={(data) => setResetPassswordData(data)}
                    id="password"
                    required
                    type="password"
                  /> */}
                </div>
                <div className="col-span-full ">
                  {/* <ERPInput
                    label={t("new-password-confirm")}
                    autocomplete="off"
                    data={confirmPassword}
                    onChangeData={(data) => {
                      data.confirmPassword !== resetPassswordData.password ? setResetError(true) : setResetError(false);
                      setConfirmPassword(data);
                    }}
                    id="confirmPassword"
                    required
                    type="text"
                  /> */}
                </div>
                {ResetError ? <div className="col-span-full text-xs text-red-500">{t("new-password-confirm-error")}</div> : null}
                <div className="col-span-full ">
                  {/* <ERPInput
                    label={t("secret-code")}
                    data={resetPassswordData}
                    onChangeData={(data) => setResetPassswordData(data)}
                    id="token"
                    required
                    type="text"
                  /> */}
                </div>
                <button
                  className="text-left text-xs text-accent disabled:cursor-not-allowed disabled:text-gray-600"
                  disabled={isLoading || timer > 0}
                  onClick={handleResendCode}
                  type="button"
                >
                  Resend Secret Code {timer != 0 && `in ${timer}s`}
                </button>
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
                  onClick={() => {
                    setIsResetMailSend({ is_reset: false });
                    setForgotPassword(true);
                    setResetError(false);
                  }}
                /> */}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default ResetPasswordForm;
