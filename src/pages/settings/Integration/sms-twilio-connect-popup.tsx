import { t } from "i18next";
import { X } from "lucide-react";
import { useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { NotificationsChannel, NotificationsProvider } from "../../../enums/notification-chanal";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import { APIClient } from "../../../helpers/api-client";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { information, information as InformationType } from "./sms-integration-type";
import { useTranslation } from "react-i18next";

const api = new APIClient();

interface SMSTwilioConnectPopupProps {
  data?: information;
}

const SMSTwilioConnectPopup: React.FC<SMSTwilioConnectPopupProps> = ({ data = {} }) => {
  const [information, setInformation] = useState<Partial<information>>(data);
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleFieldChange = (settingName: keyof information, value: any) => {
    setInformation((prevSettings) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const requestBody = {
        provider: NotificationsProvider.TwillioSms,
        channel: NotificationsChannel.Sms,
        configJson: JSON.stringify(information),
        isEnable: true,
      };

      const response = await api.post(Urls.notification_provider_update, requestBody);
      await handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendDemoMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        provider: NotificationsProvider.TwillioSms,
        channel: NotificationsChannel.Sms,
        configJson: JSON.stringify(information),
        to: phone,
        message: message,
        isEnable: true,
      };

      const demoMessageResponse = await api.post(Urls.notification_provider_test, payload);
      await handleResponse(demoMessageResponse);
    } catch (error) {
      console.error("Error sending demo WhatsApp message:", error);
    }
  };

  const { t } = useTranslation('integration')

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 p-4">
        <h2 className="text-lg font-semibold mb-3">{t("don't_have_an_account?")}</h2>
        <p className="mb-2">{t("create_an_account")}</p>
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

        <h2 className="text-lg font-semibold mb-3">{t("have_an_account_already?")}</h2>
        <p className="mb-4">{t("enter_the_following_details")}</p>

        <div className="space-y-6">
          <ERPInput
            id="accountSid"
            value={information.accountSid || ""}
            label={t("account_SID")}
            placeholder={t("account_SID")}
            data={information}
            onChangeData={(data) => {
              debugger;
              handleFieldChange("accountSid", data.accountSid)
            }}
          />

          <ERPInput
            id="authToken"
            data={information}
            value={information.authToken || ""}
            label={t("auth_token")}
            placeholder={t("auth_token")}
            onChangeData={(data) => handleFieldChange("authToken", data.authToken)}
          />

          <ERPInput
            id="fromPhone"
            data={information}
            value={information.fromPhone || ""}
            label={t("from_phone")}
            placeholder={t("from_phone")}
            onChangeData={(data) => handleFieldChange("fromPhone", data.fromPhone)}
          />

          <div className="flex items-center gap-4">
            <ERPButton title={t("connect_with_twilio")} variant="primary" disabled={isSaving}
              onClick={() => handleSubmit()} />
            <ERPButton
              title={t("send_test_message")}
              variant="secondary"
              onClick={() => setIsPopupOpen(true)}
            />
          </div>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white dark:bg-dark-bg rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
                <h2 className="text-xl font-semibold">{t("demo_message")}</h2>
                <button onClick={() => setIsPopupOpen(false)} className="p-1">
                  <X className="w-5 h-5  hover:text-gray-700" />
                </button>
              </div>

              <ERPInput
                id="phoneNumber"
                value={phone || ""}
                label={t("phone_number")}
                placeholder={t("phone_number")}
                onChange={(e) => {
                  debugger;
                  setPhone(e.target.value)
                }}
              />

              <textarea
                placeholder={t("type_a_message")}
                className="w-full dark:bg-dark-bg-card border rounded-lg p-3 h-24 resize-none"
                value={message || ""}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex justify-end mt-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg"
                  onClick={handleSendDemoMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 transform rotate-45"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSTwilioConnectPopup;
