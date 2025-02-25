import React, { useCallback, useEffect, useState } from "react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import SmsDemo from "./sms-demo";
import { information, SMSIntegrationData } from "./sms-integration-type";
import {
  NotificationsProvider,
  NotificationsChannel,
} from "../../../enums/notification-chanal";
import { CircleCheck, X } from "lucide-react";
import SMSTwilioConnectPopup from "./sms-twilio-connect-popup";

const api = new APIClient();

const SMSIntegration: React.FC = () => {
  debugger;
  const [loading, setLoading] = useState(true);
  const [SubmittingSetAsDefault, setSubmittingSetAsDefault] = useState(false);
  const [provider, setProvider] = useState<{isOpen: boolean, information?: information}>({isOpen: false, information:undefined});
  const [formState, setFormState] = useState<SMSIntegrationData[]>([]);
  const { t } = useTranslation("integration");

  useEffect(() => {
    debugger;
    console.log('SMSTwilioConnectPopup');
    
    loadSettings();
  }, []);

  const loadSettings = async () => {
    debugger;
    setLoading(true);
    const Channel = NotificationsChannel.Sms;
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
        provider: NotificationsProvider.TwillioSms,
        channel: NotificationsChannel.Sms
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

    setProvider({isOpen: true, information: {
      accountSid: parsedConfig.accountSid ?? "",
      authToken: parsedConfig.authToken ?? "",
      verifyServiceSid: parsedConfig.verifyServiceSid ?? "",
      fromPhone: parsedConfig.fromPhone ?? "",
    }});

  };
  
  return (
    <div className="p-6 max-w-8xl  mx-auto dark:bg-dark-bg bg-white dark:text-dark-text">
      <div className="xxl:h-[61.8rem]">
        <h1 className="text-2xl font-bold mb-4 dark:text-dark-text text-gray-800">
          {t("SMS_integrations")}
        </h1>

        {formState?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between mb-4 p-4 dark:bg-dark-bg-header dark:text-dark-text bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div>
                <h2 className="text-xl font-semibold dark:text-dark-text text-gray-700">
                  {item.name}
                </h2>
                <p className="text-sm dark:text-dark-text text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ERPButton
                title={item.isEnable ? t("maintain") : t("connect")}
                onClick={() => {debugger; handleOpen(item.configJson)}}
                variant="primary"
              ></ERPButton>
              {/* <button onClick={() => setIsOpen(true)} className="rounded-sm px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 transition-colors">
            
        </button> */}
              {item.isDefault ? (
                <>
                  <CircleCheck className="" />
                </>
              ) : (
                <ERPButton
                  title={t("set as default")}
                   onClick={setAsDefault}
                ></ERPButton>
                //   <button onClick={() => setIsOpen(true)} className="rounded-sm px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 transition-colors">
                //     {t("set as default")}
                // </button>
              )}
            </div>
          </div>
        ))}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
            {t("benefits")}
          </h3>
          <ul className="list-disc pl-5 dark:text-dark-text text-gray-600">
            <li className="pb-3">{t("notify_customers")}</li>
            <li className="pb-3">{t("configure_SMS")}</li>
          </ul>
        </div>

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
                rel="noopener noreferrer"
              >
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
                rel="noopener noreferrer"
              >
                {t("read_more")}
                {/* <ExternalLink size={14} className="ml-1" /> */}
                <i className="ri-external-link-line"></i>
              </a>
            </li>
          </ul>
          <SmsDemo />
        </div>

        <ERPModal
          isOpen={provider.isOpen}
          title={t("twilio")}
          width={600}
          height={600}
          isForm={true}
          closeModal={() => {
            setProvider({isOpen: false, information: undefined});
          }}
          content={<SMSTwilioConnectPopup data={provider.information}/>}
        />
      </div>
    </div>
  );
  // return <></>
};

export default SMSIntegration;
