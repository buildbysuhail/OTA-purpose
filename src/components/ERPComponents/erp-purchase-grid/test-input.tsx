import React, { forwardRef, useState, useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  noLabel?: boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  noBorder?: boolean;
  type?: string;
  isEditing?: boolean;
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
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      onChange?.(e);
    };

    const [borderStyle, setBorderStyle] = useState<string>(noBorder ? "border-none" : "");
    const [bgColor, setBgColor] = useState<string>("bg-white");

    useEffect(() => {
      if (isFocused) {
        setBorderStyle("border-1 border-blue-500"); // Always show border on focus
      } else if (noBorder) {
        setBorderStyle("border-none"); // Apply noBorder when not focused
      } else if (disabled) {
        setBorderStyle("border-none");
      } else if (isHovered) {
        setBorderStyle("border-none");
      } else {
        setBorderStyle("border-none");
      }

      if (disabled) {
        setBgColor("bg-gray-100");
      } else if (isHovered && !isFocused) {
        setBgColor("bg-gray-50");
      } else {
        setBgColor("bg-white");
      }
    }, [isFocused, isHovered, disabled, noBorder]);

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-full px-3 py-2 ${className} ${borderStyle} ${bgColor} disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
            error && !noBorder ? "border-2 border-red-500" : ""
          }`}
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