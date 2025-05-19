// ===
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ResizableBox } from "react-resizable"
import "react-resizable/css/styles.css"
import BottomSidebarGrid from "../../pages/inventory/transactions/purchase/bottom-sidebar-grid"

interface BottomSidebarProps {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  minHeight?: number
  maxHeight?: number
  initialHeight?: number
  className?: string
}

const BottomSidebar: React.FC<BottomSidebarProps> = ({
  children,
  isOpen = false,
  setIsOpen,
  minHeight = 200,
  maxHeight = 800,
  initialHeight = 400,
  className,
}) => {
  const [sidebarHeight, setSidebarHeight] = useState(initialHeight)

  const [leftValue, setLeftValue] = useState("0px")

  useEffect(() => {
    const handleResize = () => {
      setLeftValue(window.innerWidth >= 992 ? "241px" : "0px")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const sidebarContainerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 51,
    backgroundColor: "white",
    boxShadow:
      "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "transform 300ms ease-in-out",
    transform: isOpen ? "translateY(0)" : "translateY(100%)",
    borderTop: "1px solid #e5e7eb",
    height: sidebarHeight,
  }

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "8px",
    cursor: "ns-resize",
    display: "flex",
    justifyContent: "center",
  }

  const handleIndicatorStyle: React.CSSProperties = {
    width: "64px",
    height: "4px",
    borderRadius: "9999px",
    backgroundColor: "rgba(107, 114, 128, 0.3)",
    marginTop: "4px",
    transition: "background-color 150ms",
  }

  const contentContainerStyle: React.CSSProperties = {
    paddingTop: "16px",
    height: "100%",
  }

  const scrollAreaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "16px",
    overflowY: "auto",
  }

  return (
    <>
      <div
        style={{
          ...sidebarContainerStyle,
          ...(className ? { className } : {}),
        }}
      >
        <ResizableBox
          width={Number.POSITIVE_INFINITY}
          height={sidebarHeight}
          minConstraints={[Number.POSITIVE_INFINITY, minHeight]}
          maxConstraints={[Number.POSITIVE_INFINITY, maxHeight]}
          resizeHandles={["n"]}
          handle={
            <div style={handleStyle}>
              <div
                style={handleIndicatorStyle}
                onMouseOver={(e) => {
                  (e.target as HTMLDivElement).style.backgroundColor = "rgba(107, 114, 128, 0.5)"
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLDivElement).style.backgroundColor = "rgba(107, 114, 128, 0.3)"
                }}
              />
            </div>
          }
          onResize={(e, { size }) => setSidebarHeight(size.height)}
          axis="y"
          style={{ width: "100%", height: "100%" }}
        >
          <div style={contentContainerStyle}>
            <div style={scrollAreaStyle}>
              {children}
              <BottomSidebarGrid sidebarHeight={sidebarHeight} />
            </div>
          </div>
        </ResizableBox>
      </div>
    </>
  )
}

export default BottomSidebar