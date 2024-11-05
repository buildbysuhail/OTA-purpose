import { t } from "i18next";
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomOrderStatus: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  return (
    // <div className="min-h-screen bg-gray-100 p-4">
    <div className="p-0">
      <header className="flex justify-between items-center bg-white p-4 shadow-md border-t-[1px] border-b-[1px]">
        <h2 className="text-lg font-bold mb-0">{t("customers")}</h2>
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

      <div className="flex items-center justify-between mb-0 mt-[12px]">
        <button
          className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md ms-[10px]"
          // onClick={toggleExpand}
          // onClick={() => toggleExpand(!isExpanded)}
        >
          {/* <i className="fas fa-search me-2"></i> Search */}
          <Search className="me-2 w-5 h-5" /> Search
          {/* <i className="fas fa-chevron-down ms-2"></i> */}
          {/* <ChevronDown className="ms-2 w-5 h-5" /> */}
          {/* {isExpanded ? (
            <ChevronUp className="ms-2 w-5 h-5" />
          ) : (
            <ChevronDown className="ms-2 w-5 h-5" />
          )} */}
        </button>
        {/* <div className="flex space-x-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-md me-[10px]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-300 me-2"></div>
            <span>{t("used_in_bill")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] me-2"></div>
            <span>{t("active")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#f97316] me-2"></div>
            <span>{t("cancelled")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#6c9be7] me-2"></div>
            <span>{t("not_prepared")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6] me-2"></div>
            <span>{t("preparing")}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CustomOrderStatus;
