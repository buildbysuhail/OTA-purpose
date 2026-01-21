"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { ResizableBox } from "react-resizable"
import "react-resizable/css/styles.css"
import BottomSidebarGrid from "../../pages/inventory/transactions/purchase/bottom-sidebar-grid"
import { Z_INDEX } from "../../utilities/constants/z-index-tokens"

interface BottomSidebarProps {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  minHeight?: number
  maxHeight?: number
  initialHeight?: number
  className?: string
  footerHeight?: number
  onHeightChange?: (height: number) => void
}

const BottomSidebar: React.FC<BottomSidebarProps> = ({
  children,
  isOpen = false,
  setIsOpen,
  minHeight = 200,
  maxHeight = 800,
  initialHeight = 400,
  className,
  footerHeight = 0,
  onHeightChange,
}) => {
  const [sidebarHeight, setSidebarHeight] = useState(initialHeight)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Calculate max height based on window size and footer
  const calculatedMaxHeight = Math.min(
    maxHeight,
    windowHeight - footerHeight - 100 // Leave space for header and footer
  )

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Notify parent of height changes
  useEffect(() => {
    if (onHeightChange && isOpen) {
      onHeightChange(sidebarHeight)
    } else if (onHeightChange && !isOpen) {
      onHeightChange(0)
    }
  }, [sidebarHeight, isOpen, onHeightChange])

  // Adjust height if it exceeds new max
  useEffect(() => {
    if (sidebarHeight > calculatedMaxHeight) {
      setSidebarHeight(calculatedMaxHeight)
    }
  }, [calculatedMaxHeight, sidebarHeight])

  const handleResizeStop = useCallback(
    (_e: React.SyntheticEvent, { size }: { size: { height: number } }) => {
      const newHeight = Math.min(size.height, calculatedMaxHeight)
      setSidebarHeight(newHeight)
    },
    [calculatedMaxHeight]
  )

  const sidebarContainerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: footerHeight, // Position above the footer
    left: 0,
    right: 0,
    zIndex: Z_INDEX.SIDEBAR,
    backgroundColor: "white",
    boxShadow:
      "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "transform 300ms ease-in-out, bottom 300ms ease-in-out",
    transform: isOpen ? "translateY(0)" : "translateY(100%)",
    borderTop: "1px solid #e5e7eb",
    height: sidebarHeight,
    maxHeight: calculatedMaxHeight,
  }

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "12px",
    cursor: "ns-resize",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  }

  const handleIndicatorStyle: React.CSSProperties = {
    width: "64px",
    height: "4px",
    borderRadius: "9999px",
    backgroundColor: "rgba(107, 114, 128, 0.3)",
    transition: "background-color 150ms, transform 150ms",
  }

  const contentContainerStyle: React.CSSProperties = {
    paddingTop: "16px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }

  const scrollAreaStyle: React.CSSProperties = {
    width: "100%",
    flex: 1,
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "16px",
    overflowY: "auto",
    overflowX: "hidden",
  }

  return (
    <>
      {/* Backdrop when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 dark:bg-black/20 transition-opacity duration-300"
          style={{ zIndex: Z_INDEX.BACKDROP }}
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        ref={sidebarRef}
        className={`dark:bg-dark-bg-card dark:border-dark-border ${className || ""}`}
        style={sidebarContainerStyle}
      >
        <ResizableBox
          width={Number.POSITIVE_INFINITY}
          height={sidebarHeight}
          minConstraints={[Number.POSITIVE_INFINITY, minHeight]}
          maxConstraints={[Number.POSITIVE_INFINITY, calculatedMaxHeight]}
          resizeHandles={["n"]}
          handle={
            <div style={handleStyle}>
              <div
                style={handleIndicatorStyle}
                className="hover:bg-gray-400 dark:hover:bg-gray-500"
                onMouseOver={(e) => {
                  const target = e.target as HTMLDivElement
                  target.style.backgroundColor = "rgba(107, 114, 128, 0.5)"
                  target.style.transform = "scaleY(1.5)"
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLDivElement
                  target.style.backgroundColor = "rgba(107, 114, 128, 0.3)"
                  target.style.transform = "scaleY(1)"
                }}
              />
            </div>
          }
          onResizeStop={handleResizeStop}
          onResize={(_e, { size }) => setSidebarHeight(size.height)}
          axis="y"
          style={{ width: "100%", height: "100%" }}
        >
          <div style={contentContainerStyle}>
            <div style={scrollAreaStyle} className="dark:text-dark-text">
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