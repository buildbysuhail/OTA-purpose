import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./erp-resizable-sidebar.scss";
import { useAppState } from "../../utilities/hooks/useAppState";
import { ERPScrollArea } from "./erp-scrollbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ERPResizableSidebarProps {
  children: React.ReactNode; // Content to render inside the sidebar
  isOpen: boolean; // Controls whether the sidebar is open
  setIsOpen: (isOpen: boolean) => void; // Function to toggle the sidebar visibility
  minWidth?: number; // Minimum width for the sidebar
  maxWidth?: number; // Maximum width for the sidebar
  initialWidth?: number; // Initial width of the sidebar
  childrenHeight?: number;
}

const ERPResizableSidebar: React.FC<ERPResizableSidebarProps> = ({
  children,
  isOpen = false,
  setIsOpen,
  minWidth = 200,
  maxWidth = 800,
  initialWidth,
  childrenHeight = 800,
}) => {
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth ?? (deviceInfo.isMobile ? 350 : 400));
  const appState = useAppState();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Resizable Sidebar */}
      <div className={`fixed top-0 right-0 h-full z-50 bg-white shadow-xl transition-transform duration-500 ease-in-out ${ isOpen ? "translate-x-0" : "translate-x-full" }`} style={{ width: sidebarWidth }}>
        <ResizableBox
          width={sidebarWidth}
          height={Infinity}
          minConstraints={[minWidth, Infinity]}
          maxConstraints={[maxWidth, Infinity]}
          resizeHandles={[appState.appState.dir === "rtl" ? "e" : "w"]}
          handle={<div className={`custom-handle ${ appState.appState.dir === "rtl" ? "ltr" : "rtl" }`}/>}
          onResize={(e, { size }) => setSidebarWidth(size.width)}
          className="resizable-sidebar resizable-sidebar-custom"
        >
          <ERPScrollArea className="w-full  overflow-y-auto max-h-[99%]">
            {children}
          </ERPScrollArea>
        </ResizableBox>
      </div>
    </>
  );
};

export default ERPResizableSidebar;