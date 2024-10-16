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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import SmsWhatsappTemplate from "./notification-settings-template-SmsWhatsapp";

const api = new APIClient();

interface NotificationSettings {
  transactionCode: string;
  transactionName: string;
  sms: string;
  whatsapp: string;
  email: string;
  appNotification:string
}

const NotificationSettings = () => {
  const T_Head = [
    "Transaction",
    "Email",
    "whatsApp",
    "Sms",
    "App Notification",
  ];
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
        email: NotificationsChannel.Sms,
        whatsapp: NotificationsChannel.Whatsapp,
        sms: NotificationsChannel.Email,
        appNotification: NotificationsChannel.InAppNotification,
      };

      // Get the channel value from the map
      const channel = fieldToChannelMap[field];

      // Prepare the request body
      const requestBody = {
        transactionCode: transactionCode,
        channel: channel,
        isEnabled: value,
      };

      // Send PATCH request to the server
      const response = await api.patch(`${Urls.notification_transaction}`,requestBody );
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
      <div className="grid grid-cols-12 justify-center">
        <div className="xxl:col-span-8 col-span-12">
          <div className="container-lg">
            <div className="flex justify-start mx-6">
              <div className="">
                <h5 className="font-semibold text-center text-[1.25rem] text-defaulttextcolor">
                  {" "}
                  Notification Settings{" "}
                </h5>

                <p className="text-[#8c9097] dark:text-white/50 text-center mb-6 text-[0.813rem]">
                  customize your notifications
                </p>
              </div>
            </div>
            <div>
              {/* <SearchResultBar
                isOpen={open}
                searchResults={searchResults}
                selectedIndex={selectedIndex}
                onItemClick={handleItemClick}
              /> */}
            </div>

            <div className="box">
              <div className="box-body">
                {loading ? (
                  <>
                    <p>....Loading</p>
                  </>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered dark:border-defaultborder/10 whitespace-nowrap min-w-full">
                      <thead>
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

                      <tbody>
                        {TableBody.length > 0 ? (
                          TableBody.map((item, index) => (
                            <tr key={index} className="border">
                              <td>
                                <span className="font-bold text-[.875rem]">
                                  {item.transactionName}
                                </span>
                              </td>

                              {/* Email Switch */}
                              <td>
                                <ERPSwitch
                                  size="sm"
                                  value={item.email === "1"}
                                  onChange={(e) =>
                                    handleSwitchChange(
                                      item.transactionCode,
                                      "email",
                                      e.target.checked
                                    )
                                  }
                                />
                                {item.email === "1" && (
                                  <span
                                    onClick={() =>
                                      toggleTooltip(
                                        item.transactionCode,
                                        "email"
                                      )
                                    }
                                    className="text-[.675rem] text-center pt-1 text-[#fde047] underline decoration-sky-600 hover:decoration-blue-400 cursor-pointer "
                                  >
                                    templates
                                  </span>
                                )}
                              </td>

                              {/* WhatsApp Switch */}
                              <td>
                                <ERPSwitch
                                  size="sm"
                                  value={item.whatsapp === "1"}
                                  onChange={(e) =>
                                    handleSwitchChange(
                                      item.transactionCode,
                                      "whatsapp",
                                      e.target.checked
                                    )
                                  }
                                />
                                {item.whatsapp === "1" && (
                                  <span
                                    onClick={() =>
                                      toggleTooltip(
                                        item.transactionCode,
                                        "whatsapp"
                                      )
                                    }
                                    className="text-[.675rem] text-center pt-1 text-[#fde047] underline decoration-sky-600 hover:decoration-blue-400 cursor-pointer "
                                  >
                                    templates
                                  </span>
                                )}
                              </td>

                              {/* SMS Switch */}
                              <td>
                                <ERPSwitch
                                  size="sm"
                                  value={item.sms === "1"}
                                  onChange={(e) =>
                                    handleSwitchChange(
                                      item.transactionCode,
                                      "sms",
                                      e.target.checked
                                    )
                                  }
                                />
                                {item.sms === "1" && (
                                  <span
                                    onClick={() =>
                                      toggleTooltip(item.transactionCode, "sms")
                                    }
                                    className="text-[.675rem] text-center pt-1 text-[#fde047] underline decoration-sky-600 hover:decoration-blue-400 cursor-pointer "
                                  >
                                    templates
                                  </span>
                                )}
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

        <div className="xxl:col-span-2 col-span-12"></div>
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
          content={<SmsWhatsappTemplate 
            channel={tooltip.channel} 
            transactionCode={tooltip.transactionCode}
            closeModal={() => setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: false }))} 
            />}
        
        />
      )}
    </>
  );
};

export default NotificationSettings;
