import React, { useCallback, useEffect, useState } from "react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { SMSIntegrationData } from "./sms-integration-type";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import WhatsAppDemo from "./whatsapp-demo";
import { X } from 'lucide-react';
import { NotificationsChannel, NotificationsProvider } from "../../../enums/notification-chanal";

const api = new APIClient();
interface Information {
  AccountSid: string;
  AuthToken: string;
  FromPhone: string;
  phoneNumber?: string;
  message?: string;
}
const WhatsappIntegration = () => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const { t } = useTranslation("integration");
  // const WhatsappTwilioConnectPopup: React.FC = () => {
  //   const initialState: Information = {
  //     AccountSid: "",
  //     AuthToken: "",
  //     FromPhone: "",
  //     phoneNumber: "",
  //     message: "",
  //   };

  //   const [formState, setFormState] = useState<SMSIntegrationData[]>([]);
  //   const [information, setInformation] = useState<Information>(initialState);
  //   const [loading, setLoading] = useState(true);
  //   const [isPopupOpen, setIsPopupOpen] = useState(false);

  //   useEffect(() => {
  //     if (isOpen) {
  //       loadSettings();
  //     }
  //   }, [isOpen]);

  //   const loadSettings = useCallback(async () => {
  //     setLoading(true);
  //     try {
  //       const response: SMSIntegrationData[] = await api.getAsync(
  //         `${Urls.notification_provider}GetByChannel?channel=2`
  //       );
  //       setFormState(response);
  //       if (response.length > 0 && response[0].configJson) {
  //         try {
  //           const parsedConfig = JSON.parse(response[0].configJson);
  //           setInformation({
  //             AccountSid: parsedConfig.AccountSid || "",
  //             AuthToken: parsedConfig.AuthToken || "",
  //             FromPhone: parsedConfig.FromPhone || "",
  //             phoneNumber: parsedConfig.phoneNumber || "",
  //             message: parsedConfig.message || "",
  //           });
  //         } catch (parseError) {
  //           console.error("Error parsing configJson:", parseError);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error loading settings:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, []);

  //   const handleFieldChange = (settingName: any, value: any) => {
  //     setInformation((prevSettings = {} as Information) => ({
  //       ...prevSettings,
  //       [settingName]: value ?? "",
  //     }));
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const configJson = JSON.stringify(information);
  //     const requestBody = {
  //       provider: NotificationsProvider.TwillioWhatsapp,
  //       channel: NotificationsChannel.Whatsapp,
  //       configJson: configJson,
  //       isEnable: true,
  //     };
  //     try {
  //       const response = await api.post(
  //         `${Urls.notification_provider}`,
  //         requestBody
  //       );
  //       handleResponse(response);
  //       await handleSendDemoMessage();
  //     } catch (error) {
  //       console.error("Error saving settings:", error);
  //     }
  //   };

  //   const handleSendDemoMessage = async () => {
  //     try {
  //       const payload = {
  //         provider: NotificationsProvider.TwillioWhatsapp,
  //         channel: NotificationsChannel.Whatsapp,
  //         configJson: JSON.stringify(information),
  //         phoneNumber: information.phoneNumber,
  //         message: information.message,
  //         isEnable: true,
  //       };
  //       const demoMessageResponse = await api.post(
  //         `${Urls.demo_whatsapp_message}`,
  //         payload
  //       );
  //       handleResponse(demoMessageResponse);
  //     } catch (error) {
  //       console.error("Error sending demo WhatsApp message:", error);
  //     }
  //   };

  //   return (
  //     <div className="w-full">
  //       <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
  //         <div className="p-4">
  //           <h2 className="text-lg font-semibold mb-3">
  //             {t("don't_have_an_account?")}
  //           </h2>
  //           <p className="mb-2">
  //             {t("create_an_account")}
  //           </p>
  //           <a
  //             href="https://www.twilio.com/try-twilio"
  //             className="text-[#2589BD] hover:underline block mb-4"
  //             target="_blank"
  //             rel="noopener noreferrer">
  //             {t("go_to_twilio")}
  //           </a>
  //           <div className="flex items-center my-4">
  //             <div className="flex-grow border-t border-gray-300"></div>
  //             <span className="px-4 text-center">{t("or")}</span>
  //             <div className="flex-grow border-t border-gray-300"></div>
  //           </div>

  //           <h2 className="text-lg font-semibold mb-3">
  //             {t("have_an_account_already?")}
  //           </h2>
  //           <p className="mb-4">
  //             {t("enter_the_following_details")}
  //           </p>

  //           <form onSubmit={handleSubmit} className="space-y-6">
  //             <div className="mb-4">
  //               <ERPInput
  //                 id="AccountSid"
  //                 value={information.AccountSid}
  //                 data={information}
  //                 label={t("account_SID")}
  //                 placeholder={t("account_SID")}
  //                 onChangeData={(data) =>
  //                   handleFieldChange("AccountSid", data.AccountSid)
  //                 }
  //               />
  //             </div>

  //             <div className="mb-4">
  //               <ERPInput
  //                 id="AuthToken"
  //                 value={information.AuthToken}
  //                 data={information}
  //                 label={t("auth_token")}
  //                 placeholder={t("auth_token")}
  //                 onChangeData={(data) =>
  //                   handleFieldChange("AuthToken", data.AuthToken)
  //                 }
  //               />
  //             </div>

  //             <div className="mb-6">
  //               <ERPInput
  //                 id="FromPhone"
  //                 value={information.FromPhone}
  //                 data={information}
  //                 label={t("from_phone")}
  //                 placeholder={t("from_phone")}
  //                 onChangeData={(data) =>
  //                   handleFieldChange("FromPhone", data.FromPhone)
  //                 }
  //               />
  //             </div>

  //             <div className="flex items-center gap-4">
  //               <ERPButton
  //                 title={t("connect_with_twilio")}
  //                 variant="primary"
  //                 type="submit"
  //                 className="!mt-[13px]"
  //               />
  //               <ERPButton
  //                 title={t("send_demo_message")}
  //                 variant="secondary"
  //                 className="!mt-[13px]"
  //                 onClick={() => setIsPopupOpen(true)}
  //               />
  //             </div>
  //           </form>

  //           {isPopupOpen && (
  //             <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 p-4 rounded-sm">
  //               <div className="bg-white dark:bg-dark-bg rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
  //                 <div className="flex justify-between items-center border-b dark:border-gray-700 p-4">
  //                   <h2 className="text-xl font-semibold dark:text-dark-text tracking-tight">{t("demo_message")}</h2>
  //                   <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
  //                     <X className="w-5 h-5" />
  //                   </button>
  //                 </div>

  //                 <div className="p-6 space-y-6">
  //                   <ERPInput
  //                     id="phoneNumber"
  //                     data={information}
  //                     label={t("phone_number")}
  //                     placeholder={t("phone_number")}
  //                     value={information.phoneNumber}
  //                     onChangeData={(data: any) => handleFieldChange("phoneNumber", data.phoneNumber)}
  //                   />
  //                   <div className="flex items-end gap-2">
  //                     <textarea
  //                       placeholder={t("type_a_message")}
  //                       className="w-full dark:bg-dark-bg-card bg-white rounded-lg px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 h-24 resize-none"
  //                       value={information.message}
  //                       onChange={(e) => handleFieldChange("message", e.target.value)}
  //                     />
  //                     <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white w-12 h-12 flex justify-center items-center rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-200 flex-shrink-0" onClick={handleSendDemoMessage}>
  //                       <svg
  //                         xmlns="http://www.w3.org/2000/svg"
  //                         fill="none"
  //                         viewBox="0 0 24 24"
  //                         stroke="currentColor"
  //                         className="w-5 h-5 text-center !display-revert transform rotate-45">
  //                         <path
  //                           strokeLinecap="round"
  //                           strokeLinejoin="round"
  //                           strokeWidth={2}
  //                           d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
  //                         />
  //                       </svg>
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // return (
  //   <div className="p-6 max-w-8xl mx-auto dark:!bg-dark-bg bg-white">
  //     <div className="min-h-screen">
  //       <h1 className="text-2xl font-bold mb-4 dark:text-dark-text text-gray-800">
  //         {t("whatsapp_integrations")}
  //       </h1>
  //       <div className="flex items-center justify-between mb-4 p-4 dark:bg-dark-bg-header bg-gray-50 rounded-lg">
  //         <div className="flex items-center">
  //           <div>
  //             <h2 className="text-xl font-semibold dark:text-dark-text text-gray-700">{t("twilio")}</h2>
  //             <p className="text-sm dark:text-dark-text text-gray-600">
  //               {t("set_up_twilio")}
  //             </p>
  //           </div>
  //         </div>
  //         <button onClick={() => setIsOpen(true)} className="rounded-sm px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 transition-colors">
  //           {t("connect")}
  //         </button>
  //       </div>

  //       <div className="mb-6">
  //         <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">{t("benefits")}</h3>
  //         <ul className="list-disc pl-5 dark:text-dark-text text-gray-600">
  //           <li className="pb-3">
  //             {t("notify_customers")}
  //           </li>
  //           <li className="pb-3">
  //             {t("configure_SMS")}
  //           </li>
  //         </ul>
  //       </div>

  //       <div>
  //         <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
  //           {t("before_you_can")}
  //         </h3>
  //         <ul className="list-disc pl-5 dark:text-dark-text text-gray-600">
  //           <li className="pb-3">
  //             {t("create_a_twilio_account")}{" "}
  //             <a
  //               href="https://www.twilio.com/try-twilio"
  //               className="text-[#2589BD] hover:underline"
  //               target="_blank"
  //               rel="noopener noreferrer">
  //               {t("sign_up_now")}
  //             </a>
  //           </li>
  //           <li className="pb-3">
  //             {t("go_to_console")}
  //           </li>
  //           <li className="pb-3">
  //             {t("have_an_active_phone_number")}{" "}
  //             <a
  //               href="https://support.twilio.com/hc/en-us/articles/223135367-Phone-Number-types-Twilio-offers-and-how-they-work"
  //               className="text-[#2589BD] hover:underline flex items-center"
  //               target="_blank"
  //               rel="noopener noreferrer">
  //               {t("read_more")}
  //               <i className="ri-external-link-line"></i>
  //             </a>
  //           </li>
  //         </ul>
  //         <WhatsAppDemo />
  //       </div>

  //       <ERPModal
  //         isOpen={isOpen}
  //         title={t("twilio")}
  //         width={600}
  //         height={600}
  //         isForm={true}
  //         closeModal={() => { setIsOpen(false); }}
  //         content={<WhatsappTwilioConnectPopup />}
  //       />
  //     </div>
  //   </div>
  // );
  return <></>
};

export default WhatsappIntegration;
