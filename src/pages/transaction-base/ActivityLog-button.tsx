import React, { useState } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
// import CustomerDetails from "../../components/ERPComponents/customerdetails";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPAttachment from "../../components/ERPComponents/erp-attachment";
import Demo from "../../components/ERPComponents/demo";

interface ActivityLogSidebarProps {
}
const ActivityLogSidebar: React.FC<ActivityLogSidebarProps> = ({
 
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isOpen, setIsOpen] = useState(false);

  const appState = useAppState();
  return (
    <>
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={setIsOpen}  children={ <Demo  setIsOpen={setIsOpen} />}></ERPResizableSidebar>
     
      <button
        className="fixed top-[3.5rem] right-[357px] p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
        onClick={() => {setIsOpen((pre: boolean) =>{ return !pre})}}
      >
      ERP Activity
      </button>
    </>
  );
};

export default ActivityLogSidebar;
