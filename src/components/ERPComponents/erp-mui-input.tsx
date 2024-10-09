import * as React from "react";
import { forwardRef } from "react";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import ERPElementValidationMessage from "./erp-element-validation-message";

interface ERPMUIInputProps {
  id: string;
  label?: string;
  type?: string;
  value?: string;
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
  name?: string;
}

const StyledTextField = styled(TextField)(({ theme, customSize }) => {
  const sizeStyles = {
    sm: {
      '& .MuiInputBase-root': {
        fontSize: '12px',
        height: '30px',
        padding: '2px 8px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '12px',
        transform: 'translate(8px, 8px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -6px) scale(0.75)',
        },
      },
    },
    md: {
      '& .MuiInputBase-root': {
        fontSize: '14px',
        height: '36px',
        padding: '4px 10px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '14px',
        transform: 'translate(10px, 10px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -6px) scale(0.75)',
        },
      },
    },
    lg: {
      '& .MuiInputBase-root': {
        fontSize: '16px',
        height: '40px',
        padding: '6px 12px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '16px',
        transform: 'translate(12px, 12px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -6px) scale(0.75)',
        },
      },
    },
    auto: {
      '& .MuiInputBase-root': {
        fontSize: '16px',
        height: 'auto',
        padding: '10px 12px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '16px',
        transform: 'translate(12px, 16px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -6px) scale(0.75)',
        },
      },
    },
  };

  return {
    width: '100%',
    '& .MuiInputBase-root': {
      transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    },
    '& .MuiInputBase-input': {
      '&::placeholder': {
        opacity: 0.7,
        transition: theme.transitions.create('opacity'),
      },
    },
    '& .MuiInputBase-input:focus::placeholder': {
      opacity: 0.5,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.text.primary,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    ...sizeStyles[customSize],
  };
});

const ERPMUIInput = forwardRef<HTMLInputElement, ERPMUIInputProps>(({
  id,
  label,
  type = "text",
  customSize = "sm",
  customWidth = "100%",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  required,
  disabled,
  placeholder,
  validation,
  name,
  ...props
}: ERPMUIInputProps, ref) => {

  return (
    <div style={{ width: customWidth }}>
      <StyledTextField
        id={id}
        label={label}
        type={type}
        variant="outlined"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        fullWidth
        name={name}
        inputRef={ref}
        placeholder={placeholder}
        customSize={customSize}
        {...props}
      />
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
});

export default ERPMUIInput;