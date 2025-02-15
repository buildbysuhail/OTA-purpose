import React, { useEffect, useState } from "react";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { NotificationsChannel } from "../../../enums/notification-chanal";
import { useTranslation } from "react-i18next";

interface MenuItem {
  id: number;
  transactionCode: string;
  transactionName: string;
  content: string;
}

const api = new APIClient();

export default function Component() {
  const [selectedMenu, setSelectedMenu] = useState<string>("Customers");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 60000);

    setCurrentTime(formatCurrentTime());
    return () => clearInterval(intervalId);
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getAsync(`${Urls.notification_template}${NotificationsChannel.Whatsapp}`);
      if (res) {
        setMenuItems(res);
        if (res.length > 0) {
          setSelectedMenu(res[0].transactionName);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleMenuClick = (e: React.MouseEvent, transactionName: string) => {
    e.preventDefault();
    setSelectedMenu(transactionName);
    setIsSidebarOpen(false);
  };

  const { t } = useTranslation('integration');

  const WhatsAppDemo = ({ message }: { message: string }) => (
    <div className="bg-gray p-2 sm:p-4 rounded-lg w-full max-w-full sm:max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border overflow-hidden max-w-full sm:max-w-xs mx-auto">
        <div className="bg-green text-black px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center">
            <i className="ti ti-chevron-left mr-1 sm:mr-2 text-[12px] sm:text-[15px] text-white"></i>
            <div className="w-8 h-8 bg-[#dee2e6] rounded-full mr-2"></div>
            <span className="font-semibold text-sm text-white">{t("customer")}</span>
          </div>
          <div className="flex items-center text-white">
            <i className="ti ti-phone mr-4 sm:mr-4 text-[12px] sm:text-[15px]"></i>
            <i className="ti ti-video mr-4 text-[15px]"></i>
            <i className="ti ti-dots-vertical text-[12px] sm:text-[15px]"></i>
          </div>
        </div>

        <div className="dark:!bg-dark-bg bg-[#dcebdc] p-2 sm:p-4 overflow-y-auto flex flex-col justify-end min-h-[150px] sm:min-h-[200px]">
          <div className="dark:!bg-dark-bg-card bg-white rounded-lg p-2 max-w-[85%] sm:max-w-[80%] ml-auto mb-2 shadow">
            <p className="text-xs sm:text-sm">{message || t("no_message_available")}</p>
            <p className="text-right text-[10px] sm:text-xs text-gray mt-1">{currentTime}</p>
          </div>
        </div>

        <div className=" dark:!bg-dark-bg bg-gray border border-t dark:!border-dark-border  px-2 sm:px-4 py-1 sm:py-2 flex items-center">
          <input
            type="text"
            placeholder={t("type_a_message")}
            className="dark:!bg-dark-bg-card bg-white rounded-full px-2 sm:px-4 py-1 sm:py-2 flex-grow mr-2 text-xs sm:text-sm"
            readOnly
          />
          <button className="bg-green text-white w-[33px] h-[33px] flex justify-center items-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 text-center !display-revert">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const MainContent = () => {
    const selectedItem = menuItems.find((item) => item.transactionName === selectedMenu) || {
      content: "No content available",
      transactionName: selectedMenu,
    };

    return (
      <div className="flex flex-col justify-between md:flex-row h-full p-3 md:p-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{selectedMenu}</h2>
          <p className="mb-2 md:mb-4">{selectedItem.content || t("no_message_available")}</p>
        </div>
        <div>
          <WhatsAppDemo message={selectedItem.content || t("no_message_available")} />
        </div>
      </div>
    );
  };

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="dark:!border-dark-border border p-4 rounded-lg">
      <div className="flex gap-3 md:flex-row h-[389px] bg-gray relative">
        <button
          className="md:hidden absolute top-2 right-2 p-1 rounded-lg dark:!bg-dark-bg bg-white shadow"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className="ti ti-menu-2 text-base"></i>
        </button>

        {/* Sidebar */}
        <aside
          className={`${isSidebarOpen ? "block" : "hidden"
            } md:block w-full md:w-56 h-full md:h-[389px] dark:!bg-dark-bg bg-white  dark:!border-dark-border border rounded-lg absolute md:relative top-0 left-0 z-10 md:z-0`}
        >
          <div className="h-full !rounded-lg overflow-y-auto">
            <nav className="py-4 dark:!bg-dark-bg dark:!border-dark-border !rounded-lg ">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center w-full px-3 md:px-4 py-1.5 mt-1 md:mt-2 duration-200 border-r-4 text-left ${selectedMenu === item.transactionName
                      ? "bg-gray border-green text-green"
                      : "border-transparent hover:bg-gray hover:border-gray"
                      }`}
                    onClick={(e) => handleMenuClick(e, item.transactionName)}
                  >
                    <span className="mx-4 md:mx-2 text-sm">{item.transactionName}</span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-1.5 text-xs">{t("no_items_available")}</p>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto border dark:!border-dark-border rounded-lg dark:!bg-dark-bg bg-white">
          <MainContent />
        </main>

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
