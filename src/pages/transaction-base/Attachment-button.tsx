import React, { useState } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
// import CustomerDetails from "../../components/ERPComponents/customerdetails";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPAttachment from "../../components/ERPComponents/erp-attachment";

interface AttachmentSidebarProps {
}
const AttachmentSidebar: React.FC<AttachmentSidebarProps> = ({
 
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isOpen, setIsOpen] = useState(false);

  const appState = useAppState();
  return (
    <>
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={setIsOpen}  children={ <ERPAttachment  setIsOpen={setIsOpen} />}></ERPResizableSidebar>
     
      <button
        className="fixed top-[3.5rem] right-[227px] p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
        onClick={() => {setIsOpen((pre: boolean) =>{ return !pre})}}
      >
      ERP attachment
      </button>
    </>
  );
};

export default AttachmentSidebar;
