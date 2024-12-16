import React, { useState } from "react";
import ERPResizableSidebar from "../../components/ERPComponents/erp-resizable-sidebar";
import CustomerDetails from "../../components/ERPComponents/customerdetails";
import { useAppState } from "../../utilities/hooks/useAppState";

interface customerDetailsSidebarProps {
}
const CustomerDetailsSidebar: React.FC<customerDetailsSidebarProps> = ({
 
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isOpen, setIsOpen] = useState(false);

  const appState = useAppState();
  return (
    <>
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={setIsOpen}  children={ <CustomerDetails  setIsOpen={setIsOpen} />}></ERPResizableSidebar>
     
      <button
        className="fixed top-[3.5rem] right-[0px] p-2 bg-primary hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
        onClick={() => {setIsOpen((pre: boolean) =>{debugger; return !pre})}}
      >
        Toggle ERP Attachment safvan
      </button>
    </>
  );
};

export default CustomerDetailsSidebar;
