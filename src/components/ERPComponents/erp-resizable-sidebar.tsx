import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./erp-resizable-sidebar.scss";
import { useAppState } from "../../utilities/hooks/useAppState";
import { ERPScrollArea } from "./erp-scrollbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ERPResizableSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
   setIsOpen: ((isOpen: boolean) => void) | (() => void);
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  childrenHeight?: number;
  position?: "right" | "left";
  zIndex?: number;  // New prop for custom z-index
  overlayNeeded?: boolean;
}

const ERPResizableSidebar: React.FC<ERPResizableSidebarProps> = ({
  children,
  isOpen = false,
  setIsOpen,
  minWidth = 200,
  maxWidth = 800,
  initialWidth,
  childrenHeight = 800,
  position = "right",
  zIndex = 53,
  overlayNeeded = true,
}) => {
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth ?? (deviceInfo.isMobile ? 350 : 410));
  const appState = useAppState();
  const isLeft = position === "left";
  const basePositionClass = isLeft ? "left-0" : "right-0";
  const translateClass = isLeft ? (isOpen ? "translate-x-0" : "-translate-x-full") : (isOpen ? "translate-x-0" : "translate-x-full");
  const resizeHandleSide = isLeft ? (appState.appState.dir === "rtl" ? "w" : "e") : (appState.appState.dir === "rtl" ? "e" : "w");
  const handleClassDir = isLeft ? (appState.appState.dir === "rtl" ? "rtl" : "ltr") : (appState.appState.dir === "rtl" ? "ltr" : "rtl");
  const handleClose = () => {
    if (setIsOpen.length === 0) {
      // Function expects no arguments → probably a dispatch wrapper
      (setIsOpen as () => void)();
    } else {
      // Function expects a boolean → probably a useState setter
      (setIsOpen as (isOpen: boolean) => void)(false);
    }
  };
  return (
    <>
      {/* Backdrop */}
      {overlayNeeded && (
        <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={handleClose} />
      )}

      {/* Resizable Sidebar */}
      <div className={`fixed top-0 ${basePositionClass} h-full bg-white transition-transform duration-500 ease-in-out ${translateClass}`} style={{ width: sidebarWidth, zIndex: zIndex }}>
        <ResizableBox
          width={sidebarWidth}
          height={Infinity}
          minConstraints={[minWidth, Infinity]}
          maxConstraints={[maxWidth, Infinity]}
          resizeHandles={[resizeHandleSide]}
          handle={<div className={`custom-handle ${handleClassDir}`} />}
          onResize={(e, { size }) => setSidebarWidth(size.width)}
          className="resizable-sidebar resizable-sidebar-custom"
        >
          <ERPScrollArea className="w-full overflow-y-auto max-h-[99%]">
            {children}
          </ERPScrollArea>
        </ResizableBox>
      </div>
    </>
  );
};

export default ERPResizableSidebar;