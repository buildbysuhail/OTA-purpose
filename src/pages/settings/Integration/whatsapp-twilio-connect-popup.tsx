import { Send, X } from "lucide-react";
import { useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { NotificationsChannel, NotificationsProvider } from "../../../enums/notification-chanal";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import { APIClient } from "../../../helpers/api-client";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import { information } from "./whatsapp-integration-type";

const api = new APIClient();

interface WhatsappTwilioConnectPopupProps {
  data?: information;
  id?: number;
  onSuccess?: () => void;
}

const WhatsappTwilioConnectPopup: React.FC<WhatsappTwilioConnectPopupProps> = ({ data = {}, id, onSuccess }) => {
  const [information, setInformation] = useState<Partial<information>>(data);
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSendingDemo, setIsSendingDemo] = useState(false);
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
        provider: NotificationsProvider.TwillioWhatsapp,
        channel: NotificationsChannel.Whatsapp,
        configJson: JSON.stringify(information),
        isEnable: true,
        id
      };
      const response = await api.post(Urls.notification_provider_update, requestBody);
      handleResponse(response, () => { onSuccess && onSuccess() });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendDemoMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSendingDemo(true);
    try {
      const payload = {
        provider: NotificationsProvider.TwillioWhatsapp,
        channel: NotificationsChannel.Whatsapp,
        configJson: JSON.stringify(information),
        to: phone,
        message: message,
        isEnable: true,
        id: id
      };
      const demoMessageResponse = await api.post(Urls.notification_provider_test, payload);
      await handleResponse(demoMessageResponse);
    } catch (error) {
      console.error("Error sending demo WhatsApp message:", error);
    } finally {
      setIsSendingDemo(false);
    }
  };

  const { t } = useTranslation('integration')
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 p-4">
        <h2 className="text-lg font-semibold mb-3">{t("don't_have_an_account?")}</h2>
        <p className="mb-2">{t("create_an_account")}</p>
        <a href="https://www.twilio.com/try-twilio" className="text-[#2589BD] hover:underline block mb-4" target="_blank" rel="noopener noreferrer">
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
            onChangeData={(data) => { handleFieldChange("accountSid", data.accountSid) }}
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
            <ERPButton
              title={id ? t("update") : t("new")}
              variant="primary"
              disabled={isSaving}
              loading={isSaving}
              onClick={() => handleSubmit()}
            />
            <ERPButton
              title={t("send_test_message")}
              variant="secondary"
              onClick={() => setIsPopupOpen(true)}
            />
          </div>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md backdrop-blur-sm z-50 p-4">
            <div className="bg-white dark:bg-dark-bg rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t("demo_message")}
                </h2>
                <button onClick={() => setIsPopupOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <ERPInput
                  id="phoneNumber"
                  value={phone || ""}
                  label={t("phone_number")}
                  placeholder={t("phone_number")}
                  onChange={(e) => { setPhone(e.target.value) }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#86efac] transition"
                />

                <textarea
                  placeholder={t("type_a_message")}
                  className="w-full dark:bg-dark-bg-card border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#86efac] transition"
                  value={message || ""}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-full p-3 shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#86efac]"
                  onClick={handleSendDemoMessage}
                  disabled={isSendingDemo}
                >
                  {isSendingDemo ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5 transform transition-transform duration-300 hover:rotate-45" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsappTwilioConnectPopup;
