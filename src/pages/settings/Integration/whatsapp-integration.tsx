import React, { useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsProvider, NotificationsChannel } from "../../../enums/notification-chanal";
import { CircleCheck } from "lucide-react";
import WhatsAppDemo from "./whatsapp-demo";
import { information, WhatsappIntegrationData } from "./whatsapp-integration-type";
import WhatsappTwilioConnectPopup from "./whatsapp-twilio-connect-popup";
import WhatsappGatewayCenterPopup from "./whatsapp-gateway-center-popup";

interface ProviderState {
  isOpen: boolean;
  information?: any;
  providerName?: string;
  provider?: NotificationsProvider;
  id?: number
}

const api = new APIClient();

const WhatsappIntegration: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submittingSetAsDefault, setSubmittingSetAsDefault] = useState(false);
  const [selectedForDefaultId, setSelectedForDefaultId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ProviderState>({
    isOpen: false,
    information: undefined,
    providerName: undefined,
  });
  const [formState, setFormState] = useState<WhatsappIntegrationData[]>([]);
  // state to store the selected integration
  const [selectedIntegration, setSelectedIntegration] = useState<WhatsappIntegrationData | null>(null);
  const { t } = useTranslation("integration");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const Channel = NotificationsChannel.Whatsapp;
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

  const setAsDefault = async (id: number) => {
    setSubmittingSetAsDefault(true);
    setSelectedForDefaultId(id);
    try {
      const requestBody = {
        provider: NotificationsProvider.TwillioWhatsapp,
        channel: NotificationsChannel.Whatsapp,
        id: id
      };
      const response = await api.post(Urls.notification_provider_set_as_default, requestBody);
      handleResponse(response, async () => {
        await loadSettings();
      }, () => {

      });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSubmittingSetAsDefault(false);
      setSelectedForDefaultId(null);
    }
  };

  const handleOpen = (item: any) => {
    let parsedConfig: any = {};

    if (typeof item?.configJson === "string" && item?.configJson.trim() !== "") {
      try {
        parsedConfig = JSON.parse(item?.configJson);
      } catch (error) {
        console.error("Error parsing configJson:", error);
      }
    } else if (typeof item?.configJson === "object" && item?.configJson !== null) {
      parsedConfig = item?.configJson;
    }

    if (item.provider == NotificationsProvider.SmsGateway) {
      setProvider({
        isOpen: true,
        provider: item.provider,
        information:
        {
          configJson: parsedConfig
        },
        id: item.id,
        providerName: item?.name ?? "",
      });
    } else {
      setProvider({
        isOpen: true,
        provider: item.provider,
        information: {
          accountSid: parsedConfig.accountSid ?? "",
          authToken: parsedConfig.authToken ?? "",
          verifyServiceSid: parsedConfig.verifyServiceSid ?? "",
          fromPhone: parsedConfig.fromPhone ?? "",
        },
        id: item.id,
        providerName: item?.name ?? "",
      });
    }


  };

  return (
    <div className="p-6 max-w-8xl mx-auto dark:bg-dark-bg bg-white dark:text-dark-text">
      <div className="xxl:h-[61.8rem]">
        <h1 className="text-2xl font-bold mb-4 dark:text-dark-text text-gray-800">
          {t("whatsapp_integration")}
        </h1>

        {formState?.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between mb-4 p-4 dark:bg-dark-bg-header dark:text-dark-text bg-gray-50 rounded-lg group relative">
            <div className="cursor-pointer" onClick={() => setSelectedIntegration(item)}>
              <h2 className="text-xl font-semibold dark:text-dark-text text-gray-700">
                {item.name}
              </h2>
              <p className="text-sm dark:text-dark-text text-gray-600">
                {item.description}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
              {item.isDefault ? (
                <div className="flex items-center justify-center min-w-[40px]">
                  <div className="relative p-1 rounded-full bg-[#d1fae5] dark:bg-[#14532d]">
                    <CircleCheck
                      className="text-[#16a34a] dark:text-[#4ade80]"
                      size={24}
                      strokeWidth={3}
                    />
                    {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] rounded-full animate-pulse"></span> */}
                  </div>
                </div>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <ERPButton
                    title={t("Set as default")}
                    onClick={() => setAsDefault(item.id)}
                    className="min-w-[120px]"
                    loading={submittingSetAsDefault && item.id === selectedForDefaultId}
                  />
                </div>
              )}
              <ERPButton
                title={item.isEnable ? t("maintain") : t("connect")}
                onClick={() => handleOpen(item)}
                variant="primary"
                className="min-w-[120px]"
              />
            </div>
          </div>

        ))}

        <div className="mt-8">
          {selectedIntegration ? (
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
                {t("selected_integration")} : {selectedIntegration.name}
              </h3>
              <p className="mb-4 dark:text-dark-text text-gray-600">
                {selectedIntegration.description}
              </p>
              {/* <WhatsAppDemo /> */}
            </div>
          ) : (
            <div>
              {/* <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
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
              </ul> */}
              {/* <WhatsAppDemo /> */}
            </div>
          )}
        </div>

        <ERPModal
          isOpen={provider.isOpen}
          title={
            provider.provider === NotificationsProvider.TwillioWhatsapp ? t(provider.providerName?.toLowerCase() || "twilio"):""
          }
          width={600}
          height={ 620}
          isForm={true}
          closeModal={() => { setProvider({ isOpen: false, information: undefined, providerName: undefined }); }}
          content={
            provider.provider === NotificationsProvider.TwillioWhatsapp ? (
              <WhatsappTwilioConnectPopup data={provider.information} id={provider.id} onSuccess={() => {
                setProvider({ isOpen: false, information: undefined, provider: undefined });
                loadSettings();
              }} />
            ) : (
              <></>
            )
          }
        />
      </div>
    </div>
  );
};

export default WhatsappIntegration;