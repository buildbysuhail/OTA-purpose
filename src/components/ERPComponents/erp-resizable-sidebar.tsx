import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; 
import "./erp-resizable-sidebar.css"; 
import { useAppState } from "../../utilities/hooks/useAppState";

interface ERPResizableSidebarProps {
  children: React.ReactNode; // Content to render inside the sidebar
  isOpen: boolean; // Controls whether the sidebar is open
  setIsOpen: (isOpen: boolean) => void; // Function to toggle the sidebar visibility
  minWidth?: number; // Minimum width for the sidebar
  maxWidth?: number; // Maximum width for the sidebar
  initialWidth?: number; // Initial width of the sidebar
}

const ERPResizableSidebar: React.FC<ERPResizableSidebarProps> = ({
  children,
  isOpen = false,
  setIsOpen,
  minWidth = 200,
  maxWidth = 800,
  initialWidth = 400,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
    const appState = useAppState();
    

  return (
    <>
      {isOpen && (
        <ResizableBox
          width={sidebarWidth}
          height={Infinity}
          minConstraints={[minWidth, Infinity]}
          maxConstraints={[maxWidth, Infinity]}
          resizeHandles={[appState.appState.dir === "rtl" ? "e" : "w"]}
          handle={<div className={`custom-handle ${ appState.appState.dir === "rtl" ? "ltr" : "rtl"}`} />}
          onResize={(e, { size }) => setSidebarWidth(size.width)}
          className="resizable-sidebar resizable-sidebar-custom  h-svh"
        >
          {children}
        </ResizableBox>
      )}
     {isOpen.toString()}
      <button
        className="toggle-sidebar-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle Sidebar
      </button>
    </>
  );
};

export default ERPResizableSidebar;
