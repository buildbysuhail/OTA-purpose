"use client"

import type React from "react"
import { forwardRef, useState, useEffect } from "react"
import { handleNavigation } from "../../../utilities/shortKeys"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  noLabel?: boolean
  value?: any
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  disabled?: boolean
  error?: string
  placeholder?: string
  noBorder?: boolean
  type?: string
  isEditing?: boolean
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: any) => void
  cellHeight?: number // Add cellHeight prop for grid cells
  inputStyle?:React.CSSProperties
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      noLabel,
      value,
      onChange,
      className,
      disabled,
      error,
      placeholder,
      type = "text",
      isEditing = false,
      noBorder,
      onBlur,
      onKeyDown,
      cellHeight,
      inputStyle,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [localValue, setLocalValue] = useState(value)

    useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
      onChange?.(e)
    }

    const [borderStyle, setBorderStyle] = useState<string>(noBorder ? "border-none" : "")
    const [bgColor, setBgColor] = useState<string>("bg-transparent")

    useEffect(() => {
      if (isFocused) {
        setBorderStyle("border-1 border-blue-500")
        setBgColor("bg-white")
      } else if (disabled) {
        setBorderStyle("border-none")
        setBgColor("bg-gray-100")
      } else if (isHovered) {
        setBorderStyle("border-none")
        setBgColor("bg-gray-50")
      } else {
        setBorderStyle("border-none")
        setBgColor("bg-transparent")
      }
    }, [isFocused, isHovered, disabled, noBorder])

    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
        handleNavigation(e)
      }
    }



    return (
      <div className="relative w-full" >
        <input
          ref={ref}
          type={type}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur && onBlur(e)
          }}
          className={`w-full  ${className} ${borderStyle} ${bgColor} disabled:opacity-50 disabled:cursor-not-allowed ${
            error && !noBorder ? "border-2 border-red-500" : ""
          }`}
          style={inputStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onKeyDown={(e) => {
            if (onKeyDown) {
              onKeyDown(e)
            }
            handleKeyDown(e)
          }}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"
export default Input
