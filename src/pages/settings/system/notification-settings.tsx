import { useEffect, useState } from "react";
import ERPSwitch from "../../../components/ERPComponents/erp-switch";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsChannel } from "../../../enums/notification-chanal";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import SmsWhatsappTemplate from "./notification-settings-template-SmsWhatsapp";
import EmailTemplate from "./notification-settings-template-email";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

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
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number }>
    ({ mobile: 500, windows: 500 });
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200;
    let gridHeightWindows = wh - 300;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const { t } = useTranslation("system");
  const T_Head = [
    t("transaction"),
    t("email"),
    t("whatsApp"),
    t("sms"),
    // t("app_notification"),
  ];
  const [TableBody, setTableBody] = useState<NotificationSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState({ isOpen: false, transactionCode: "", channel: "" });
  const [searchCols, setSearchCols] = useState<String>("");
  /////////// for Search
  /////////////
  useEffect(() => {
    loadNotification();
  }, []);
  const loadNotification = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.notification_transaction}`);
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
      <div className="grid grid-cols-12 gap-x-6 dark:!bg-dark-bg bg-[#fafafa] h-full">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            {/* <div className="flex justify-start m-3"> */}
            <div className="box-header justify-between">
              <div className="box-title">
                <h5 className="font-semibold text-center text-[1.25rem] ">{" "}{t("notification_settings")}</h5>
                <p className="text-[#8c9097] dark:text-white/50 text-center mb-6 text-[0.813rem]">{t("customize_your_notifications")}</p>
              </div>
            </div>
            <div className="box-body flex flex-col gap-1">
              <ERPInput
                noLabel
                className="mb-3"
                id="search_cols"
                value={searchCols}
                placeholder="Search"
                onChange={(e: any) => setSearchCols(e?.target?.value)}
                prefix={<MagnifyingGlassIcon className="w-4 h-4" />}
              />
              <div className="grid grid-cols-1 gap-3">
                {loading ? (
                  <>
                    <p>{t("....loading")}</p>
                  </>
                ) : (
                  // <div className="table-responsive max-h-[60vh] xxl:max-h-[70vh] shadow-sm m-0 p-0">
                  <div className={`table-responsive overflow-auto shadow-sm`} style={{ maxHeight: `${gridHeight.windows}px` }}>
                    <table className="min-w-full relative table table-bordered rounded-t-sm dark:border-defaultborder/10 ">
                      <thead className="dark:bg-dark-bg-header bg-[#f3f4f6] sticky top-[-1px] z-40">
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
                      <tbody className="dark:!bg-dark-bg bg-[#fafafa]">
                        {
                          TableBody.length > 0 ? (
                            TableBody?.filter((item) =>
                              item.transactionName?.toLowerCase().includes(searchCols.toLowerCase())
                            )?.map((item, index) => (
                              <tr key={index} className="dark:hover:bg-dark-hover-black hover:bg-gray-100">
                                <td>
                                  <span className="font-light text-[.875rem]">
                                    {item.transactionName}
                                  </span>
                                </td>
                                {/* Email Switch */}
                                <td className="py-2 px-4 group">
                                  <div className="flex justify-start items-center space-x-4">
                                    <ERPSwitch
                                      size="sm"
                                      defaultValue={item.email === "1"}
                                      value={item.email === "1"}
                                      onChange={(e) => handleSwitchChange(item.transactionCode, "email", e.target.checked)}
                                    />
                                    {
                                      item.email === "1" && (
                                        <span onClick={() => toggleTooltip(item.transactionCode, "email")} className="">
                                          <i title="template" className="ri-edit-box-line text-xl text-[#00000017] group-hover:text-[#047857] duration-300"></i>
                                        </span>
                                      )
                                    }
                                  </div>
                                </td>
                                {/* WhatsApp Switch */}
                                <td className="py-2 px-4 group">
                                  <div className="flex justify-start items-center space-x-4">
                                    <ERPSwitch
                                      size="sm"
                                      defaultValue={item.whatsapp === "1"}
                                      value={item.whatsapp === "1"}
                                      onChange={(e) => handleSwitchChange(item.transactionCode, "whatsapp", e.target.checked)}
                                    />
                                    {
                                      item.whatsapp === "1" && (
                                        <span onClick={() => toggleTooltip(item.transactionCode, "whatsapp")}>
                                          <i title="template" className="ri-edit-box-line text-xl text-[#00000017] group-hover:text-[#047857] duration-300"></i>
                                        </span>
                                      )
                                    }
                                  </div>
                                </td>
                                {/* SMS Switch */}
                                <td className="py-2 px-4 group">
                                  <div className="flex justify-start items-center space-x-4">
                                    <ERPSwitch
                                      size="sm"
                                      defaultValue={item.sms === "1"}
                                      value={item.sms === "1"}
                                      onChange={(e) => handleSwitchChange(item.transactionCode, "sms", e.target.checked)}
                                    />
                                    {
                                      item.sms === "1" && (
                                        <span onClick={() => toggleTooltip(item.transactionCode, "sms")}>
                                          <i title="template" className="ri-edit-box-line text-xl text-[#00000017] group-hover:text-[#047857] duration-300"></i>
                                        </span>
                                      )
                                    }
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center">
                                {t("no_data_available")}
                              </td>
                            </tr>
                          )
                        }
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        (tooltip.channel === "sms" || tooltip.channel === "whatsapp") && (
          <ERPModal
            isOpen={tooltip.isOpen || false}
            title={tooltip.channel === "sms" ? t("sms_template") : t("whatsApp_template")}
            // width="w-full max-w-[600px]"
            isForm={true}
            closeModal={() => { setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: !prevTooltip.isOpen, })); }}
            content={
              <SmsWhatsappTemplate
                channel={tooltip.channel}
                templateKey={tooltip.transactionCode}
                isOpen={tooltip.isOpen}
                closeModal={() => setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: false }))}
              />
            }
          />
        )
      }

      {
        tooltip.channel === "email" && (
          <ERPModal
            isOpen={tooltip.isOpen || false}
            title={t("email_template")}
            width={600}
            height={800}
            isForm={true}
            closeModal={() => { setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: !prevTooltip.isOpen, })); }}
            content={
              <EmailTemplate
                channel={tooltip.channel}
                templateKey={tooltip.transactionCode}
                isOpen={tooltip.isOpen}
                closeModal={() => setTooltip((prevTooltip) => ({ ...prevTooltip, isOpen: false }))}
              />
            }
          />
        )}
    </>
  );
};

export default NotificationSettings;
