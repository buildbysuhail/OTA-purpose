import React, { useState } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
import CustomerDetails from "../../components/ERPComponents/customerdetails";
import { useAppState } from "../../utilities/hooks/useAppState";
import { useTranslation } from "react-i18next";

interface customerDetailsSidebarProps {
  displayType?: "button" | "link"; // Optional prop with default value
}
const CustomerDetailsSidebar: React.FC<customerDetailsSidebarProps> = ({
  displayType = "button",
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isOpen, setIsOpen] = useState(false);

  const appState = useAppState();
  const { t } = useTranslation("transaction");
  return (
    <>
      <ERPResizableSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        children={<CustomerDetails setIsOpen={setIsOpen} />}
      ></ERPResizableSidebar>

      {displayType === "button" ? (
        <button
          className="fixed top-[3.5rem] right-[0px] p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
          onClick={() => {
            setIsOpen((pre: boolean) => {
              return !pre;
            });
          }}
        >
          {t("details")}
        </button>
      ) : (
        <span
          // href="#"
          className="hover:underline text-[#0ea5e9] capitalize ml-1"
          onClick={() => {
            setIsOpen((pre: boolean) => {
              return !pre;
            });
          }}
        >
          {t("details")}
        </span>
      )}
    </>
  );
};

export default CustomerDetailsSidebar;
