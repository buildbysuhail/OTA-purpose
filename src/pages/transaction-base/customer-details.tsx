import React, { useState, useRef } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
import CustomerDetails from "../../components/ERPComponents/customerdetails";
import { useAppState } from "../../utilities/hooks/useAppState";
import { useTranslation } from "react-i18next";

interface CustomerDetailsSidebarProps {
  displayType?: "button" | "link";
}

const CustomerDetailsSidebar: React.FC<CustomerDetailsSidebarProps> = ({
  displayType = "button",
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const appState = useAppState();
  const { t } = useTranslation("transaction");

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node) &&
      !(e.target as HTMLElement).closest(".resize-handle")
    ) {
      setIsOpen(false);
    }
  };

  return (
    <div onClick={handleOutsideClick}>
      <div ref={sidebarRef}>
        <ERPResizableSidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          children={<CustomerDetails setIsOpen={setIsOpen} />}
        />
      </div>

      {displayType === "button" ? (
        <button
          className="fixed top-[3.5rem] right-[0px] p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          {t("details")}
        </button>
      ) : (
        <span
          className="hover:underline text-[#0ea5e9] capitalize ml-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          {t("details")}
        </span>
      )}
    </div>
  );
};

export default CustomerDetailsSidebar;
