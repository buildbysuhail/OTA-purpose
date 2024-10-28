import React, { useCallback, useEffect, useState } from "react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import {
  SMSIntegrationData,
} from "./sms-integration-type";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsChannel, NotificationsProvider } from "../../../enums/notification-chanal";

const api = new APIClient();
interface information {
  AccountSid: string;
  AuthToken: string;
  FromPhone: string;
}
const EmailIntegration = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const EmailTwilioConnectPopup: React.FC = () => {
    const initialState: information = {
      AccountSid: "",
      AuthToken: "",
      FromPhone: "",
    };
    const [formState, setFormState] = useState<SMSIntegrationData[]>([]);
    const [information, setInformation] = useState<information>(initialState);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      if (isOpen) {
        loadSettings();
      }
    }, [isOpen]);

    const loadSettings = useCallback(async () => {
      setLoading(true);
      try {
        const response: SMSIntegrationData[] = await api.getAsync(
          `${Urls.notification_provider}GetByChannel?channel=3`
        );

        setFormState(response);

        if (response.length > 0 && response[0].configJson) {
          try {
            const parsedConfig = JSON.parse(response[0].configJson);
            setInformation({
              AccountSid: parsedConfig.AccountSid || "",
              AuthToken: parsedConfig.AuthToken || "",
              FromPhone: parsedConfig.FromPhone || "",
            });
          } catch (parseError) {
            console.error("Error parsing configJson:", parseError);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    }, []);

    const handleFieldChange = (settingName: any, value: any) => {
      setInformation((prevSettings = {} as information) => ({
        ...prevSettings,
        [settingName]: value ?? "",
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const configJson = JSON.stringify(information);
      const requestBody={
        provider:NotificationsProvider.FireBase,
        channel:NotificationsChannel.Email,
        configJson:configJson,
        isEnable:true,
      };

      try {
        const response = await api.post(
          `${Urls.notification_provider}`,
          requestBody
        );
        handleResponse(response);
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };

    return (
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">
              {t("don't_have_an_account?")}
            </h2>
            <p className="mb-2">
              {t("create_an_account")}
            </p>
            <a
              href="https://www.twilio.com/try-twilio"
              className="text-[#2589BD] hover:underline block mb-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("go_to_twilio")}
            </a>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-center">{t("or")}</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <h2 className="text-lg font-semibold mb-3">
              {t("have_an_account_already?")}
            </h2>
            <p className="mb-4">
              {t("enter_the_following_details")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">

                <ERPInput
                  id="AccountSid"
                  value={information.AccountSid}
                  data={information}
                  label={t("account_SID")}
                  placeholder={t("account_SID")}
                  onChangeData={(data) =>
                    handleFieldChange("AccountSid", data.AccountSid)
                  }
                />
              </div>
              <div className="mb-4">
                <ERPInput
                  id="AuthToken"
                  value={information.AuthToken}
                  data={information}
                  label={t("auth_token")}
                  placeholder={t("auth_token")}
                  onChangeData={(data) =>
                    handleFieldChange("AuthToken", data.AuthToken)
                  }
                />
              </div>
              <div className="mb-6">
                <ERPInput
                  id="FromPhone"
                  value={information.FromPhone}
                  data={information}
                  label={t("from_phone")}
                  placeholder={t("from_phone")}
                  onChangeData={(data) =>
                    handleFieldChange("FromPhone", data.FromPhone)
                  }
                />
              </div>

              <ERPButton
                title={t("connect_with_twilio")}
                variant="primary"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {t("email_integrations")}
      </h1>

      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          {/* <img src="/api/placeholder/40/40" alt="Twilio logo" className="mr-4 rounded" /> */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700">{t("twilio")}</h2>
            <p className="text-sm text-gray-600">
              {t("set_up_twilio")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-sm px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t("connect")}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">{t("benefits")}</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li className="pb-3">
            {t("notify_customers")}
          </li>
          <li className="pb-3">
            {t("configure_SMS")}
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          {t("before_you_can")}
        </h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li className="pb-3">
            {t("create_a_twilio_account")}{" "}
            <a
              href="https://www.twilio.com/try-twilio"
              className="text-[#2589BD] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("sign_up_now")}
            </a>
          </li>
          <li className="pb-3">
            {t("go_to_console")}
          </li>
          <li className="pb-3">
            {t("have_an_active_phone_number")}{" "}
            <a
              href="https://support.twilio.com/hc/en-us/articles/223135367-Phone-Number-types-Twilio-offers-and-how-they-work"
              className="text-[#2589BD] hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("read_more")}
              {/* <ExternalLink size={14} className="ml-1" /> */}
              <i className="ri-external-link-line"></i>
            </a>
          </li>
        </ul>
      </div>

      <ERPModal
        isOpen={isOpen}
        title={t("twilio")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          setIsOpen(false);
        }}
        content={<EmailTwilioConnectPopup />}
      />
    </div>
  );
};

export default EmailIntegration
