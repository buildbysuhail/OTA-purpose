import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Urls from "../../redux/urls";
import { handleLoginSuccess } from "../../utilities/handles-login-success-utils";
import { APIClient } from "../../helpers/api-client";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { modelToBase64 } from "../../utilities/jsonConverter";
import { setApplicationSettings } from "../../redux/slices/app/application-settings-reducer";
import ERPModal from "../../components/ERPComponents/erp-modal";
import CounterSettings from "../settings/system/counter-settings";
import { useTranslation } from "react-i18next";

const api = new APIClient();
const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing your invitation...");
  const [isLoading, setIsLoading] = useState(true);
  const [gotoMain, setGotoMain] = useState(false);

  const { t } = useTranslation("main");
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [error, setError] = useState<any>();
  const [counterSettings, setCounterSettings] = useState<{
    show: boolean;
    token: string;
  }>({ show: false, token: "" });
  if (!userId || !email || !token) {
    setMessage("Invalid invitation link.");
    setIsLoading(false);
    return;
  }
  const [loginState, setLoginState] = useState({
    succeeded: false,
    isLoggedToBranch: false,
    hasToChooseBranch: false
  });
  useEffect(() => {
    
    if (loginState.succeeded) {
      // if (loginState.isLoggedToBranch) {
        navigate("/");
      // } else if (loginState.hasToChooseBranch) {
      //   navigate("/select-organization");
      // }
    }
  }, [loginState]);
  const updateLoginState = (updates: any) => {
    setLoginState(prev => ({...prev, ...updates}));
  };
  useEffect(() => {
    const acceptInvitation = async () => {
      try {
        const response = await api.postAsync(Urls.accept_link, {
          userId: parseInt(userId),
          email: email,
          token: token,
        });
        
        if (response.isOk == true) {
          await handleLoginSuccess(
            response,
            dispatch,
            load,
            (value) => updateLoginState({isLoggedToBranch: value}),
            (value) => updateLoginState({hasToChooseBranch: value})
          );
        } else {
          if (response.item.hasToSetCounter) {
            localStorage.setItem("_token", response.item.token);
            setCounterSettings({ show: true, token: response.item.token });
          } else {
            setError(response.message);
          }
        }
      } catch (error: any) {
        setMessage(
          error?.response?.data?.message ||
            "An error occurred while accepting the invitation."
        );
      } finally {
        setIsLoading(false);
      }
    };

    acceptInvitation();
  }, [searchParams]);
  const decodedEmail = decodeURIComponent(email);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const load = async () => {
    const settings = await api.getAsync(Urls.application_setting);
    localStorage.setItem("as", modelToBase64(settings));
    dispatch(
      setApplicationSettings({
        ...settings,
        apiLoaded: true,
      })
    );
  };
  

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      {isLoading && !error && <p>Loading...</p>}
      {!isLoading && !error && <p>{message}</p>}
      {error && <p>{error}</p>}
      {counterSettings.show && (
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
          closeModal={() => {
            setCounterSettings({ show: false, token: "" });
          }}
          content={
            <CounterSettings
              token={counterSettings.token}
              isFromLogin={true}
              onSuccess={() => {
                setCounterSettings({ show: false, token: "" });
                updateLoginState({succeeded: true});
              }}
            />
          }
        />
      )}
    </div>
  );
};

export default AcceptInvitation;
