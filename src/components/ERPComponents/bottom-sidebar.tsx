"use client"

import type React from "react"
import { useEffect, useState } from "react"

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
  const [sidebarHeight] = useState(initialHeight)

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 300ms",
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? "auto" : "none",
  }

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
    // left: leftValue,
    left: 0,
    right: 0,
    zIndex: 50,
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
      <div style={backdropStyle} onClick={() => setIsOpen(false)} />

      <div
        style={{
          ...sidebarContainerStyle,
          ...(className ? { className } : {}),
        }}
      >
        <div style={handleStyle}>
          
        </div>
        <div style={contentContainerStyle}>
          <div style={scrollAreaStyle}>{children}</div>
        </div>
      </div>
    </>
  )
}

export default BottomSidebar
