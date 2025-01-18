import React, { useState } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPAttachment from "../../components/ERPComponents/erp-attachment";
import { useTranslation } from "react-i18next";

interface AttachmentSidebarProps {
  displayType?: "button" | "link"; // Optional prop with default value
}

const AttachmentSidebar: React.FC<AttachmentSidebarProps> = ({
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
        children={<ERPAttachment setIsOpen={setIsOpen} />}
      ></ERPResizableSidebar>

      {displayType === "button" ? (
        <button
          className=" p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
          onClick={() => setIsOpen((prev: boolean) => !prev)}
        >
          {t("attachment")}
        </button>
      ) : (
        <span
          // href="#"
          className="hover:underline text-[#0ea5e9] capitalize ml-1"
          onClick={(e) => {
            e.preventDefault(); // Prevent default link behavior
            setIsOpen((prev: boolean) => !prev);
          }}
        >
          {t("attachment")}
        </span>
      )}
    </>
  );
};

export default AttachmentSidebar;
