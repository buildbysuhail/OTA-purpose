import { Send, X } from "lucide-react";
import { useState, useEffect } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { NotificationsChannel, NotificationsProvider } from "../../../enums/notification-chanal";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import { APIClient } from "../../../helpers/api-client";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import { information } from "./email-integration-type";

const api = new APIClient();

interface EmailSmtpConnectPopupProps {
  data?: information;
  id?: number;
  onSuccess?: () => void;

}

const EmailSmtpConnectPopup: React.FC<EmailSmtpConnectPopupProps> = ({ data = {}, id, onSuccess }) => {
  const [information, setInformation] = useState<Partial<information>>(data);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t } = useTranslation('integration');

  useEffect(() => {
    if (data) {
      setInformation(data);
    }
  }, [data]);

  const handleFieldChange = (settingName: keyof information, value: any) => {
    setInformation((prevSettings) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const configData = {
        from: information.from || "",
        SmtpServer: information.smtpServer || "",
        Port: information.port || "",
        UserName: information.userName || "",
        Password: information.password || ""
      };

      const requestBody = {
        id: id || 0,
        provider: NotificationsProvider.Smtp,
        channel: NotificationsChannel.Email,
        configJson: JSON.stringify(configData),
        isEnable: true,
        name: "SMTP"
      };

      const response = await api.post(Urls.notification_provider_update, requestBody);

      await handleResponse(response, () => { onSuccess && onSuccess() });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendDemoMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const configData = {
        from: information.from || "",
        SmtpServer: information.smtpServer || "",
        Port: information.port || "",
        UserName: information.userName || "",
        Password: information.password || ""
      };

      const payload = {
        provider: NotificationsProvider.Smtp,
        channel: NotificationsChannel.Email,
        configJson: JSON.stringify(configData),
        to: email,
        message: message,
        isEnable: true,
        id: id
      };

      const demoMessageResponse = await api.post(Urls.notification_provider_test, payload);
      await handleResponse(demoMessageResponse);
    } catch (error) {
      console.error("Error sending demo email message:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 p-4">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ERPInput
              id="from"
              value={information.from || ""}
              label={t("from_email")}
              placeholder={t("from_email")}
              data={information}
              onChangeData={(data) => { handleFieldChange("from", data.from) }}
            />

            <ERPInput
              id="smtpServer"
              data={information}
              value={information.smtpServer || ""}
              label={t("smtp_server")}
              placeholder={t("smtp_server")}
              onChangeData={(data) => handleFieldChange("smtpServer", data.smtpServer)}
            />

            <ERPInput
              id="port"
              data={information}
              value={information.port || ""}
              label={t("port")}
              placeholder={t("port")}
              onChangeData={(data) => handleFieldChange("port", data.port)}
              type="number"
            />

            <ERPInput
              id="userName"
              data={information}
              value={information.userName || ""}
              label={t("username")}
              placeholder={t("username")}
              onChangeData={(data) => handleFieldChange("userName", data.userName)}
            />

            <ERPInput
              id="password"
              data={information}
              value={information.password || ""}
              label={t("password")}
              placeholder={t("password")}
              type="password"
              onChangeData={(data) => handleFieldChange("password", data.password)}
            />
          </div>

          <div className="flex items-center gap-4">
            <ERPButton
              title={id ? t("update") : t("connect_email")}
              variant="primary"
              disabled={isSaving}
              onClick={() => handleSubmit()}
            />
            <ERPButton
              title={t("send_test_email")}
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
                  {t("demo_email")}
                </h2>
                <button onClick={() => setIsPopupOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <ERPInput
                  id="toEmail"
                  value={email || ""}
                  label={t("recipient_email")}
                  placeholder={t("recipient_email")}
                  onChange={(e) => setEmail(e.target.value)}
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
                <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full p-3 shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#93c5fd]" onClick={handleSendDemoMessage}>
                  <Send className="w-5 h-5 transform transition-transform duration-300 hover:rotate-45" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSmtpConnectPopup;