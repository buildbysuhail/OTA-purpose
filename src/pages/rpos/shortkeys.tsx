import { t } from "i18next";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ShortKeys: React.FC = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  return (
    // <div className="min-h-screen bg-gray-100 p-4">
    <div className="p-0">
      <header className="flex justify-between items-center bg-white p-4 shadow-md border-t-[1px] border-b-[1px]">
        <h2 className="text-lg font-bold mb-0">{t("shortcut_keys")}</h2>
        <div
          className="flex items-center space-x-4 absolute ltr:right-4 rtl:left-4 "
          // style={{ insetInlineEnd: "1rem" }}
        >
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 me-2" />
            <span>{t("call_for_support")}</span>
            <div>
              {/* <span className="font-bold">+91 9335 87623</span> */}
              <span className="font-bold">
                {"+91 " +
                  "123456789"
                    .split("")
                    .reverse()
                    .join("")
                    .replace(/(\d{3})(?=\d)/, "$1 ")}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 me-2" />
            <span>{t("send_a_mail")}</span>
            <span className="font-bold">support@polosys.com</span>
          </div>
          <div
            className="flex items-center space-x-1 p-2 border rounded-lg cursor-pointer"
            onClick={handleClick}
          >
            <ArrowLeft className="w-5 h-5 me-1" />
            <span className="text-black ">{t("back")}</span>
          </div>
        </div>
      </header>
      {/* <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg"> */}
      <div className=" mx-auto bg-white shadow-md h-screen">
        {/* <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-semibold">Help Tips</h1>
          <div className="flex items-center space-x-2">
            <i className="fas fa-envelope text-red-500"></i>
            <span className="text-red-500">support@potpooja.com</span>
            <button className="flex items-center space-x-1 text-gray-600">
              <i className="fas fa-arrow-left"></i>
              <span>Back</span>
            </button>
          </div>
        </div> */}
        <div className="overflow-x-auto  m-3  ">
          <table className=" w-[98%] divide-y divide-gray-200 m-3 shadow-md rounded rounded-lg scroll-m-1">
            <thead className="bg-gray-100 rounded-lg">          
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded rounded-tl-lg ">
                  {t("shortcut_keys")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded rounded-tr-lg">
                  {t("description")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F1</td>
                <td className="px-6 py-4 whitespace-nowrap">Save Order</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F2</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Save & Print Order
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F3</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Generate KOT without Print
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F4</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Get focus to Add New Item on Billing Screen
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F5</td>
                <td className="px-6 py-4 whitespace-nowrap">New Order</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F6</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Generate KOT with Print
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F7</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Search using Table no.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F8</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Save & eBill Order
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F9</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Select Delivery on Billing screen
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F11</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Select Dine In on Billing screen
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">F12</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Select Pick Up on Billing screen
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ctrl+D</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Calculate Distance
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ctrl+H</td>
                <td className="px-6 py-4 whitespace-nowrap">Help Text</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ctrl+I</td>
                <td className="px-6 py-4 whitespace-nowrap">Item Report</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ctrl+K</td>
                <td className="px-6 py-4 whitespace-nowrap">Kot Listing</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ctrl+Shift+K</td>
                <td className="px-6 py-4 whitespace-nowrap">Kot Live View</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ctrl+L</td>
                <td className="px-6 py-4 whitespace-nowrap">Logout</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShortKeys;
