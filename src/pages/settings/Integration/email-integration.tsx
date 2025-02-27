import React, { useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import EmailDemo from "./email-demo";
import { NotificationsProvider, NotificationsChannel, } from "../../../enums/notification-chanal";
import { CircleCheck } from "lucide-react";
import { EmailIntegrationData, information } from "./email-integration-type";
import EmailTwilioConnectPopup from "./email-twilio-connect-popup";

const api = new APIClient();
const EmailIntegration: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [SubmittingSetAsDefault, setSubmittingSetAsDefault] = useState(false);
  const [provider, setProvider] = useState<{ isOpen: boolean, information?: information }>({
    isOpen: false,
    information: undefined,
  });
  const [formState, setFormState] = useState<EmailIntegrationData[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<EmailIntegrationData | null>(null);
  const { t } = useTranslation("integration");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const Channel = NotificationsChannel.Email;
    try {
      const response = await api.getAsync(
        `${Urls.notification_provider}?channel=${Channel}`
      );
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const setAsDefault = async () => {
    setSubmittingSetAsDefault(true);
    try {
      const requestBody = {
        provider: NotificationsProvider.Smtp,
        channel: NotificationsChannel.Email,
      };
      const response = await api.post(Urls.notification_provider_set_as_default, requestBody);
      await handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSubmittingSetAsDefault(false);
    }
  };

  const handleOpen = (configJson: any) => {
    let parsedConfig: any = {};

    if (typeof configJson === "string" && configJson.trim() !== "") {
      try {
        parsedConfig = JSON.parse(configJson);
      } catch (error) {
        console.error("Error parsing configJson:", error);
      }
    } else if (typeof configJson === "object" && configJson !== null) {
      parsedConfig = configJson;
    }

    setProvider({
      isOpen: true,
      information: {
        accountSid: parsedConfig.accountSid ?? "",
        authToken: parsedConfig.authToken ?? "",
        verifyServiceSid: parsedConfig.verifyServiceSid ?? "",
        fromPhone: parsedConfig.fromPhone ?? "",
      },
    });
  };

  return (
    <div className="p-6 max-w-8xl mx-auto dark:bg-dark-bg bg-white dark:text-dark-text">
      <div className="xxl:h-[61.8rem]">
        <h1 className="text-2xl font-bold mb-4 dark:text-dark-text text-gray-800">
          {t("email_integrations")}
        </h1>

        {formState?.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between mb-4 p-4 dark:bg-dark-bg-header dark:text-dark-text bg-gray-50 rounded-lg">
            <div className="cursor-pointer" onClick={() => setSelectedIntegration(item)}>
              <h2 className="text-xl font-semibold dark:text-dark-text text-gray-700">
                {item.name}
              </h2>
              <p className="text-sm dark:text-dark-text text-gray-600">{item.description}</p>
            </div>

            {/* Button container */}
            <div className="mt-4 md:mt-0 flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
              <ERPButton
                title={item.isEnable ? t("maintain") : t("connect")}
                onClick={() => handleOpen(item.configJson)}
                variant="primary"
                className="min-w-[120px]"
              />
              {item.isDefault ? (
                <CircleCheck className="min-w-[40px]" />
              ) : (
                <ERPButton title={t("Set as default")} onClick={setAsDefault} className="min-w-[120px]" />
              )}
            </div>
          </div>
        ))}

        {/* Conditional rendering of the lower section */}
        <div className="mt-8">
          {selectedIntegration ? (
            // New content based on the selected integration
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
                {t("selected_integration")} : {selectedIntegration.name}
              </h3>
              <p className="mb-4 dark:text-dark-text text-gray-600">
                {selectedIntegration.description}
              </p>
              {/* You can include additional details or components specific to the selected integration */}
              <EmailDemo />
            </div>
          ) : (
            // Default content
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
                {t("before_you_can")}
              </h3>
              <ul className="list-disc pl-5 dark:text-dark-text text-gray-600">
                <li className="pb-3">
                  {t("create_a_twilio_account")}{" "}
                  <a
                    href="https://www.twilio.com/try-twilio"
                    className="text-[#2589BD] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer">
                    {t("sign_up_now")}
                  </a>
                </li>
                <li className="pb-3">{t("go_to_console")}</li>
                <li className="pb-3">
                  {t("have_an_active_phone_number")}{" "}
                  <a
                    href="https://support.twilio.com/hc/en-us/articles/223135367-Phone-Number-types-Twilio-offers-and-how-they-work"
                    className="text-[#2589BD] hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer">
                    {t("read_more")}
                    <i className="ri-external-link-line ml-1"></i>
                  </a>
                </li>
              </ul>
              <EmailDemo />
            </div>
          )}
        </div>

        <ERPModal
          isOpen={provider.isOpen}
          title={t("twilio")}
          width={600}
          height={620}
          isForm={true}
          closeModal={() => { setProvider({ isOpen: false, information: undefined }); }}
          content={<EmailTwilioConnectPopup data={provider.information} />}
        />
      </div>
    </div>
  );
};

export default EmailIntegration;
