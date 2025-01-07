import React, { useState, useEffect, useRef } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; 
import "./erp-resizable-sidebar.css"; 
import { useAppState } from "../../utilities/hooks/useAppState";
import { ERPScrollArea } from "./erp-scrollbar";

interface ERPResizableSidebarProps {
  children: React.ReactNode; // Content to render inside the sidebar
  isOpen: boolean; // Controls whether the sidebar is open
  setIsOpen: (isOpen: boolean) => void; // Function to toggle the sidebar visibility
  minWidth?: number; // Minimum width for the sidebar
  maxWidth?: number; // Maximum width for the sidebar
  initialWidth?: number; // Initial width of the sidebar
  childrenHeight?: number; // Custom height for children
}

const ERPResizableSidebar: React.FC<ERPResizableSidebarProps> = ({
  children,
  isOpen = false,
  setIsOpen,
  minWidth = 200,
  maxWidth = 800,
  initialWidth = 400,
  childrenHeight = 800,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const appState = useAppState();
  const windowHeight = window.innerHeight;

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set height of the scrollable area dynamically
    if (scrollAreaRef.current) {
      scrollAreaRef.current.style.height = `${windowHeight - 128}px`;  // Adjust according to your needs
    }
  }, [windowHeight]);

  return (
    <>
      {isOpen && (
        <ResizableBox
          width={sidebarWidth}
          height={windowHeight - 128} // Set height to the window height (minus some offset)
          minConstraints={[minWidth, 0]} // Min height set to 0
          maxConstraints={[maxWidth, Infinity]}
          resizeHandles={[appState.appState.dir === "rtl" ? "e" : "w"]} 
          handle={
            <div className={`custom-handle ${ appState.appState.dir === "rtl" ? "ltr" : "rtl"}`} />
          }
          onResize={(e, { size }) => setSidebarWidth(size.width)}
          className="resizable-sidebar resizable-sidebar-custom"
        >
          <div 
            ref={scrollAreaRef}
            className="w-full overflow-y-auto"  // Ensure the content area is scrollable
            style={{ height: "100%" }}  // Set full height for the content container
          >
            <ERPScrollArea className="w-full h-full overflow-y-auto">
              {children}
            </ERPScrollArea>
          </div>
        </ResizableBox>
      )}
    </>
  );
};

export default ERPResizableSidebar;
