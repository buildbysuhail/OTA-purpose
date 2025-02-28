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

interface WhatsappGatewayCenterPopupProps {
  data?: information;
  id?: number;
  onSuccess?: () => void;
}

const WhatsappGatewayCenterPopup: React.FC<WhatsappGatewayCenterPopupProps> = ({ data = {}, id, onSuccess }) => {
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
        provider: NotificationsProvider.LinkWhatsapp,
        channel: NotificationsChannel.Whatsapp,
        configJson: JSON.stringify(information),
        isEnable: true,
        id: id
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
    try {
      const payload = {
        provider: NotificationsProvider.LinkWhatsapp,
        channel: NotificationsChannel.Whatsapp,
        configJson: JSON.stringify(information),
        to: phone,
        message: message,
        isEnable: true,
      };
      const demoMessageResponse = await api.post(Urls.notification_provider_test, payload);
      await handleResponse(demoMessageResponse);
    } catch (error) {
      console.error("Error sending demo Whatsapp message:", error);
    }
  };

  const { t } = useTranslation('integration');

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 gap-3 p-4">
        <div className="space-y-6">
          <ERPInput
            id="url"
            value={information.url || ""}
            label={t("url")}
            placeholder={t("url")}
            data={information}
            onChangeData={(data) => handleFieldChange("url", data.url)}
          />

          <div className="flex items-center gap-4">
            <ERPButton
              title={id ? t('connect') : t('save')}
              variant="primary"
              disabled={isSaving}
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
              <div className="flex justify-between items-center  pb-4">
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
                  onChange={(e) => setPhone(e.target.value)}
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

export default WhatsappGatewayCenterPopup;