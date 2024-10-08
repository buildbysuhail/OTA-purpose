import * as React from "react";
import { forwardRef } from "react";
import TextField from '@mui/material/TextField';
import ERPElementValidationMessage from "./erp-element-validation-message";

interface ERPMUIInputProps {
  id: string;
  label?: string;
  type?: string;
  value?: string; // Set type to string for better type safety
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  customSize?: "sm" | "md" | "lg" | "auto";
  customWidth?: string;
  placeholder?: string;
  validation?: string;
  name?: string; // Add name property
}

const ERPMUIInput = forwardRef<HTMLInputElement, ERPMUIInputProps>(({
  id,
  label,
  type = "text",
  customSize = "sm",
  customWidth = "100%", // Default width to full width if not provided
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  required,
  disabled,
  placeholder,
  validation,
  name, // Destructure name from props
  ...props
}: ERPMUIInputProps, ref) => {
  // Define size classes based on customSize prop
  const sizeStyles = {
    sm: {
      fontSize: '12px',
      height: '30px',
      padding: '2px 8px',
    },
    md: {
      fontSize: '14px',
      height: '36px',
      padding: '6px 12px',
    },
    lg: {
      fontSize: '16px',
      height: '40px',
      padding: '8px 16px',
    },
    auto: {
      fontSize: '16px',
      height: '40px',
      padding: '8px 16px',
    },
  };

  const selectedSizeStyles = sizeStyles[customSize];

  return (
    <div style={{ width: customWidth }}>
      <TextField
        id={id}
        label={label || placeholder}
        type={type}
        variant="outlined"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        InputProps={{
          sx: {
            ...selectedSizeStyles, // Apply size styles based on customSize prop
          },
        }}
        InputLabelProps={{
          sx: {
            fontSize: selectedSizeStyles.fontSize || 'inherit', // Adjust label size
          },
        }}
        fullWidth
        name={name} // Pass the name prop to TextField
        ref={ref} // Make sure to pass ref to TextField
        {...props}
      />
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
});

export default ERPMUIInput;
