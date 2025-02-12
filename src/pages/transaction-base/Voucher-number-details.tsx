import React, { useState, useRef } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
import { useAppState } from "../../utilities/hooks/useAppState";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import VoucherNumberDetails from "../../components/ERPComponents/Voucher-number-sidebar-details";

interface VoucherNumberDetailsSidebarProps {
  displayType?: "button" | "link";
}

const VoucherNumberDetailsSidebar: React.FC<VoucherNumberDetailsSidebarProps> = ({
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
          children={<VoucherNumberDetails setIsOpen={setIsOpen} />}
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
        <Info 
        size={15}
        />
        </button>
      ) : (
        <span
          className="hover:underline text-[#0ea5e9] capitalize "
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
        <Info 
        size={15}
        />
        </span>
      )}
    </div>
  );
};

export default VoucherNumberDetailsSidebar;