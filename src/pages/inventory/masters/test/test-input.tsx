// Input.tsx
import React, { forwardRef, useState, useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  noLabel?: boolean;
  value?: any; // Updated to any to match your usage
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  noBorder?:boolean;
  type?: string;
  isEditing?: boolean; // Indicate if the cell is in edit mode
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
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // Manual focus state
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      onChange?.(e);
    };

    const [borderStyle, setBorderStyle] = useState<string>(noBorder?"border-none":""); // No border by default
    const [bgColor, setBgColor] = useState<string>("bg-white");

    useEffect(() => {
      if (disabled) {
        setBgColor("bg-gray-100");
      } else if (isFocused) {
        setBorderStyle("border-1 border-blue-500"); // Border only on focus
        setBgColor("bg-white");
      } else if (isHovered) {
        setBgColor("bg-gray-50");
      } else {
        setBgColor("bg-white");
        setBorderStyle("border-none")
      }
    }, [isFocused, isHovered, disabled]);

    return (
      <div className={`relative w-full `}>
      
        <input
        // style={{
        //     borderColor:borderStyle
        // }}
          ref={ref}
          type={type}
          value={localValue}
          onChange={handleChange}
          disabled={disabled} // Only use disabled prop, remove isEditing check for focus
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)} // Manual focus handling
          onBlur={() => setIsFocused(false)} // Manual blur handling
          className={`w-full h-full px-3 py-2   ${className} !${borderStyle} !${bgColor} disabled:opacity-50 disabled:cursor-not-allowed text-sm ${error ? "border-2 border-red-500" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;