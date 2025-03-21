import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
import CustomerDetails from "../../components/ERPComponents/customerdetails";
import { useAppState } from "../../utilities/hooks/useAppState";
import { useTranslation } from "react-i18next";

interface CustomerDetailsSidebarProps {
  displayType?: "button" | "link" | "none";
  isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CustomerDetailsSidebar: React.FC<CustomerDetailsSidebarProps> = ({
  displayType = "link",
  isOpen = false,
    setIsOpen
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [_isOpen, _setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const appState = useAppState();
  const { t } = useTranslation("transaction");

  useEffect(() => {
    _setIsOpen(isOpen);
  }, [isOpen]);
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      _isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node) &&
      !(e.target as HTMLElement).closest(".resize-handle")
    ) {
      _setIsOpen(false);
    }
  };

  return (
    <div onClick={handleOutsideClick}>
      {_isOpen && (
        <div ref={sidebarRef}>
          <ERPResizableSidebar
            isOpen={_isOpen}
            setIsOpen={(isO: boolean) => {_setIsOpen(isO); setIsOpen(isO)}}
            children={<CustomerDetails setIsOpen={(isO: boolean) => {_setIsOpen(isO); setIsOpen(isO)}} />}
          />
        </div>
      )}
      {displayType === "button" ? (
        <button
          className="fixed top-[3.5rem] right-[0px] p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            _setIsOpen((prev) => !prev);
          }}
        >
          {t("details")}
        </button>
      ) : displayType === "link" ? (
        <span
          className="hover:underline text-[#0ea5e9] capitalize ml-1"
          onClick={(e) => {
            e.stopPropagation();
            _setIsOpen((prev) => !prev);
          }}
        >
          {t("details")}
        </span>
      ): (
        <></>
      )}
    </div>
  );
};

export default CustomerDetailsSidebar;
