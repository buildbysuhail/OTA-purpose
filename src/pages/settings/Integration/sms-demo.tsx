import React, { useEffect, useState } from "react";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { NotificationsChannel } from "../../../enums/notification-chanal";

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getAsync(`${Urls.notification_template}${NotificationsChannel.Sms}`);
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

  const SmsDemo = ({ message, sender }: { message: string; sender: string }) => (
    <div className="bg-gray p-2 sm:p-4 rounded-lg w-full max-w-full sm:max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border overflow-hidden max-w-full sm:max-w-xs mx-auto">
        <div className="bg-white text-black px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center">
            <i className="ti ti-chevron-left mr-1 sm:mr-2 text-[12px] sm:text-[15px]"></i>
            <span className="font-semibold text-sm sm:text-base">Customer</span>
          </div>
          <div className="flex items-center">
            <i className="ti ti-phone mr-2 sm:mr-4 text-[12px] sm:text-[15px]"></i>
            <i className="ti ti-dots-vertical text-[12px] sm:text-[15px]"></i>
          </div>
        </div>

        <div className="bg-[#42414141] p-2 sm:p-4 overflow-y-auto flex flex-col justify-end min-h-[150px] sm:min-h-[200px]">
          <div className="bg-white rounded-lg p-2 max-w-[85%] sm:max-w-[80%] ml-auto mb-2 shadow">
            <p className="text-xs sm:text-sm">{message || "No message available"}</p>
            <p className="text-right text-[10px] sm:text-xs text-gray mt-1">12:00 PM</p>
          </div>
        </div>

        <div className="bg-gray px-2 sm:px-4 py-1 sm:py-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-white rounded-full px-2 sm:px-4 py-1 sm:py-2 flex-grow mr-2 text-xs sm:text-sm"
            readOnly
          />
          <button className="bg-white text-green-500 rounded-full p-1 sm:p-2 border border-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 sm:w-6 sm:h-6"
            >
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
          <p className="mb-2 md:mb-4">{selectedItem.transactionName}</p>
        </div>
        <div>
          <SmsDemo
            message={selectedItem.content || "No message available"}
            sender="Polosys L.L.P"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex gap-3 md:flex-row h-[389px] bg-gray relative">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden absolute top-2 right-2 p-1 rounded-lg bg-white shadow"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className="ti ti-menu-2 text-base"></i>
        </button>

        {/* Sidebar */}
        <aside
          className={`
          ${isSidebarOpen ? 'block' : 'hidden'} 
          md:block 
          w-full md:w-56 
          h-full md:h-[389px]
          bg-white 
          border
          rounded-lg
          absolute md:relative
          top-0 left-0
          z-10 md:z-0
        `}
        >
          <div className="h-full overflow-y-auto">
            <nav className="py-4">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`
                    flex items-center 
                    w-full 
                    px-3 md:px-4 
                    py-1.5 
                    mt-1 md:mt-2 
                    duration-200 
                    border-r-4 
                    text-left
                    ${selectedMenu === item.transactionName
                        ? "bg-gray border-green text-green"
                        : "border-transparent hover:bg-gray hover:border-gray"
                      }
                  `}
                    onClick={(e) => handleMenuClick(e, item.transactionName)}
                  >
                    <span className="mx-4 md:mx-2 text-sm">{item.transactionName}</span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-1.5 text-xs">No items available</p>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto border rounded-lg bg-white">
          <MainContent />
        </main>

        {/* Overlay for mobile when sidebar is open */}
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