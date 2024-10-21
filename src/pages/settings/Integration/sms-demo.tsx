import React, { useEffect, useState } from "react";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { NotificationsChannel } from "../../../enums/notification-chanal";
import { handleResponse } from "../../../utilities/HandleResponse";
const api = new APIClient();
export default function Component() {
  const [selectedMenu, setSelectedMenu] = useState("Customers");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
   
  });
const loadData = async() => {
  const res = await api.getAsync(`${Urls.notification_template}${NotificationsChannel.Sms}`);
  handleResponse(res,() => { 
    setMenuItems(res);
  }, () => {},false,false)
}
  const SmsDemo = ({ message }: { message: string; sender: string }) => (
    <div className="bg-gray p-4 rounded-lg mt-4 w-full max-w-sm">
      <div className="bg-white rounded-lg shadow-lg  border overflow-hidden max-w-xs mx-auto">
        <div className="bg-white text-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <i className="ti ti-chevron-left mr-2 text-[15px]"></i>
            {/* <div className="w-8 h-8 bg-[#dee2e6] rounded-full mr-2"></div> */}
            <span className="font-semibold">Customer</span>
          </div>
          <div className="flex items-center">
            <i className="ti ti-phone mr-4 text-[15px]"></i>
            {/* <i className="ti ti-video mr-4 text-[15px]"></i> */}
            <i className="ti ti-dots-vertical text-[15px]"></i>
          </div>
        </div>

        <div className="bg-[#42414141] h-[] p-4 overflow-y-auto flex flex-col justify-end">
          <div className="bg-white rounded-lg p-2 max-w-[80%] ml-auto mb-2 shadow">
            <p className="text-sm">{message}</p>
            <p className="text-right text-xs text-gray mt-1">12:00 PM</p>
          </div>
        </div>

        <div className="bg-gray px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-white rounded-full px-4 py-2 flex-grow mr-2"
            readOnly
          />
          <button className="bg-white text-green-500 rounded-full p-2 border border-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
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
    const selectedItem: any = menuItems.find((item: any) => item.name === selectedMenu);

    return (
      <div className="flex flex-row min-h-screen p-6">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">{selectedMenu}</h2>
          <p className="mb-4">{selectedItem?.content}</p>
        </div>
        <div className="w-1/2">
          <SmsDemo
            message={selectedItem?.smsDemo || ""}
            sender="Your Company"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[389px] bg-gray">
      <aside className="w-64 h-auto bg-white shadow overflow-y-auto rounded-lg">
        <nav className="mt-6">
          {menuItems.map((item: any) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center px-6 py-2 mt-4 duration-200 border-r-4 ${
                selectedMenu === item.name
                  ? "bg-gray border-green text-green"
                  : "border-transparent hover:bg-gray hover:border-gray"
              }`}
              onClick={() => setSelectedMenu(item.name)}
            >
              {/* {item.icon} */}
              <span className="mx-4">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto shadow rounded-lg">
        <MainContent />
      </main>
    </div>
  );
}
