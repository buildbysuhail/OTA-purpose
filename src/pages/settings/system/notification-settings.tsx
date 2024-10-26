import { key } from "localforage";
import React, { useEffect, useState } from "react";
import ERPSwitch from "../../../components/ERPComponents/erp-switch";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import {
  NotificationsChannel,
  NotificationsProvider,
} from "../../../enums/notification-chanal";
import { SearchResultBar } from "../AllSettings/Components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import SmsWhatsappTemplate from "./notification-settings-template-SmsWhatsapp";
import EmailTemplate from "./notification-settings-template-email";

const api = new APIClient();

interface NotificationSettings {
  transactionCode: string;
  transactionName: string;
  sms: string;
  whatsapp: string;
  email: string;
  inAppNotification: string;
}
// const location = useLocation();
// const path = location.pathname.split("/").pop();
const NotificationSettings = () => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh - 180;
    setGridHeight(gridHeight);
  }, []);
  const T_Head = [ "Transaction","Email","whatsApp","Sms","App Notification",];
  const [TableBody, setTableBody] = useState<NotificationSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState({
    isOpen: false,
    transactionCode: "",
    channel: "",
  });

  /////////// for Search

  /////////////
  useEffect(() => {
    loadNotification();
  }, []);

  const loadNotification = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.notification_transaction}`);
      debugger;
      setTableBody(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for toggling the email switch
  const handleSwitchChange = async (
    transactionCode: string,
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    try {
      setTableBody((prevTableBody) =>
        prevTableBody.map((item) =>
          item.transactionCode === transactionCode
            ? { ...item, [field]: value ? "1" : "0" }
            : item
        )
      );

      // Map the `field` to the appropriate enum value
      const fieldToChannelMap: Record<string, NotificationsChannel> = {
        sms: NotificationsChannel.Sms,
        whatsapp: NotificationsChannel.Whatsapp,
        email: NotificationsChannel.Email,
        inAppNotification: NotificationsChannel.InAppNotification,
      };
      const channel = fieldToChannelMap[field];

      const requestBody = {
        transactionCode: transactionCode,
        channel: channel,
        isEnabled: value,
      };

      // Send PATCH request to the server
      const response = await api.patch(
        `${Urls.notification_transaction}`,
        requestBody
      );
      handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const toggleTooltip = (transactionCode: string, channel: string) => {
    setTooltip((prevTooltip) => ({
      ...prevTooltip,
      isOpen: !prevTooltip.isOpen,
      transactionCode: transactionCode,
      channel: channel,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-x-6">
       <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
         <div className="box custom-box">
            {/* <div className="flex justify-start m-3"> */}
            <div className="box-header justify-between">
              <div className="box-title">
                <h5 className="font-semibold text-center text-[1.25rem] text-defaulttextcolor">
                  {" "}
                  Notification Settings
                </h5>

                <p className="text-[#8c9097] dark:text-white/50 text-center mb-6 text-[0.813rem]">
                  customize your notifications
                </p>
              </div>
            </div>
            {/* <div>
              <SearchResultBar
                isOpen={open}
                searchResults={searchResults}
                selectedIndex={selectedIndex}
                onItemClick={handleItemClick}
              />
            </div> */}

            <div className="box-body">
            <div className="grid grid-cols-1 gap-3">
                {loading ? (
                  <>
                    <p>....Loading</p>
                  </>
                ) : (
                  <div className="table-responsive max-h-[58vh] xxl:max-h-[70vh] shadow-sm m-0 p-0">
                    <table className="min-w-full relative table table-bordered rounded-t-lg dark:border-defaultborder/10 ">
                
                      <thead className="bg-[#f3f4f6] sticky top-0 z-40">
                        <tr>
                          {T_Head.map((item, index) => (
                            <th key={index} scope="col" className="text-start">
                              <span className="text-[.9375rem] font-semibold">
                                {item}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className=" bg-[#fafafa] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" >
                        {TableBody.length > 0 ? (
                          TableBody.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td>
                                <span className="font-light text-[.875rem]">
                                  {item.transactionName}
                                </span>
                              </td>

                              {/* Email Switch */}
                              <td className="py-2 px-4">
                                <div className="flex justify-start items-center space-x-4">
                                  <ERPSwitch
                                    size="sm"
                                    defaultValue={item.email === "1"}
                                    value={item.email === "1"}
                                    onChange={(e) => handleSwitchChange(item.transactionCode, "email", e.target.checked)}
                                  />
                                  {item.email === "1" && (
                                    <span
                                    onClick={() => toggleTooltip(item.transactionCode, "email")}
                                     className=""
                                    >
                                      <i title="template" 
                                      className="ri-edit-box-line text-xl  text-[#047857] opacity-0 hover:opacity-100 transition-opacity duration-300">
                                      </i>

                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* WhatsApp Switch */}
                              <td className="py-2 px-4">
                                <div className="flex justify-start items-center space-x-4 ">
                                  <ERPSwitch
                                    size="sm"
                                    defaultValue={item.whatsapp === "1"}
                                    value={item.whatsapp === "1"}
                                    onChange={(e) => handleSwitchChange(item.transactionCode, "whatsapp", e.target.checked)}
                                  />
                                  {item.whatsapp === "1" && (
                                    <span
                                    onClick={() => toggleTooltip(item.transactionCode, "whatsapp")}
                                    >
                                        <i title="template" 
                                        className="ri-edit-box-line text-xl text-[#047857] opacity-0 hover:opacity-100 transition-opacity duration-300">

                                        </i>
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* SMS Switch */}
                              <td className="py-2 px-4">
                                <div className="flex justify-start items-center space-x-4 ">
                                  <ERPSwitch
                                    size="sm"
                                    defaultValue={item.sms === "1"}
                                    value={item.sms === "1"}
                                    onChange={(e) => handleSwitchChange(item.transactionCode,"sms",e.target.checked)}
                                  />
                                  {item.sms === "1" && (
                                    <span
                                      onClick={() => toggleTooltip(item.transactionCode,"sms")}
                                    >
                                  <i title="template" 
                                  className="ri-edit-box-line text-xl text-[#047857] opacity-0 hover:opacity-100 transition-opacity duration-300"></i>

                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* In-App Notification Switch */}
                              <td  className="py-2 px-4">

                                <div className="flex justify-start items-center space-x-4">
                                  <ERPSwitch
                                    size="sm"
                                    defaultValue={item.inAppNotification === "1" }
                                    value={item.inAppNotification === "1"}
                                    onChange={(e) => handleSwitchChange(item.transactionCode, "inAppNotification", e.target.checked)}
                                  />
                                  {item.inAppNotification === "1" && (
                                    <span
                                    onClick={() => toggleTooltip(item.transactionCode, "inAppNotification")}
                                    
                                    >
                                    <i title="template" 
                                    className="ri-edit-box-line text-xl cursor-pointer text-[#047857] opacity-0 hover:opacity-100 transition-opacity duration-300"></i>
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {(tooltip.channel === "sms" || tooltip.channel === "whatsapp") && (
        <ERPModal
          isOpen={tooltip.isOpen || false}
          title={
            tooltip.channel === "sms" ? "Sms Template" : "WhatsApp  Template"
          }
          width="w-full max-w-[600px]"
          isForm={true}
          closeModal={() => {
            setTooltip((prevTooltip) => ({
              ...prevTooltip,
              isOpen: !prevTooltip.isOpen,
            }));
          }}
          content={
            <SmsWhatsappTemplate
              channel={tooltip.channel}
              templateKey={tooltip.transactionCode}
              isOpen={tooltip.isOpen}
              closeModal={() =>
                setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: false }))
              }
            />
          }
        />
      )}

      {tooltip.channel === "email" && (
        <ERPModal
          isOpen={tooltip.isOpen || false}
          title={"Email Template"}
          width="w-full max-w-[800px]"
          isForm={true}
          closeModal={() => {
            setTooltip((prevTooltip) => ({
              ...prevTooltip,
              isOpen: !prevTooltip.isOpen,
            }));
          }}
          content={
            <EmailTemplate
              channel={tooltip.channel}
              templateKey={tooltip.transactionCode}
              isOpen={tooltip.isOpen}
              closeModal={() =>
                setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: false }))
              }
            />
          }
        />
      )}
    </>
  );
};

export default NotificationSettings;
