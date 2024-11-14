import * as React from "react";
import { forwardRef } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, TextFieldProps } from "@mui/material";
import ERPInput from "./erp-input";
import { dateTrimmer } from "../../utilities/Utils";
import ERPElementValidationMessage from "./erp-element-validation-message";

dayjs.extend(utc);

interface ERPDateInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  minDate?: string;
  maxDate?: string;
  minDateKey?: string;
  maxDateKey?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeData?: (data: any) => void;
  defaultValue?: string;
  value?: string;
  type?: "date" | "datetime";
  data?: any;
  validation?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  useMUI?: boolean;
  variant?: "standard" | "outlined" | "filled";
  customSize?: "sm" | "md" | "lg";
  color?: TextFieldProps['color'];
}

const ERPDateInput = forwardRef<HTMLInputElement, ERPDateInputProps>(({
  id,
  label,
  placeholder,
  disabled,
  required,
  readonly,
  minDate,
  maxDate,
  minDateKey,
  maxDateKey,
  onChange,
  onChangeData,
  defaultValue,
  value,
  type = "date",
  data,
  validation,
  className,
  labelClassName,
  inputClassName,
  useMUI = false,
  variant = "outlined",
  customSize = "sm",
  color,
  ...props
}, ref) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return undefined;
    return dayjs(date).format("YYYY-MM-DD");
  };

  // Get size-specific styles for MUI DatePicker
  const getSizeStyles = () => {
    switch (customSize) {
      case "sm":
        return {
          "& .MuiInputBase-root": {
            height: "2rem",
            fontSize: "12px",
            "& .MuiOutlinedInput-input": {
              padding: "0 0.75rem"
            },
            "& .MuiFilledInput-input": {
              padding: "0 0.75rem"
            }
          },
          "& .MuiInputLabel-root": {
            fontSize: "12px",
            transform: variant === "filled"
              ? "translate(8px, 10px) scale(0.8)"
              : variant === "standard"
                ? "translate(0, 10px) scale(0.8)"
                : "translate(8px, 10px) scale(0.8)"
          },
          "& .MuiInputLabel-shrink": {
            transform: variant === "filled"
              ? "translate(8px, -10px) scale(0.75)"
              : variant === "standard"
                ? "translate(1px, 6px) scale(0.75)"
                : "translate(16px, -6px) scale(0.75)"
          }
        };
      case "lg":
        return {
          "& .MuiInputBase-root": {
            height: "3rem",
            fontSize: "16px",
            "& .MuiOutlinedInput-input": {
              padding: "0 0.75rem"
            },
            "& .MuiFilledInput-input": {
              padding: "0 0.75rem"
            }
          },
          "& .MuiInputLabel-root": {
            fontSize: "14px",
            transform: variant === "filled"
              ? "translate(10px, 15px) scale(1)"
              : variant === "standard"
                ? "translate(0, 15px) scale(1)"
                : "translate(10px, 15px) scale(1)"
          },
          "& .MuiInputLabel-shrink": {
            transform: variant === "filled"
              ? "translate(8px, -14px) scale(0.88)"
              : variant === "standard"
                ? "translate(1px,3px) scale(0.88)"
                : "translate(16px, -7px) scale(0.88)"
          }
        };
      default: // md
        return {
          "& .MuiInputBase-root": {
            height: "2.5rem",
            fontSize: "14px",
            "& .MuiOutlinedInput-input": {
              padding: "0 0.75rem"
            },
            "& .MuiFilledInput-input": {
              padding: "0 0.75rem"
            }
          },
          "& .MuiInputLabel-root": {
            fontSize: "12px",
            transform: variant === "filled"
              ? "translate(10px, 13px) scale(0.9)"
              : variant === "standard"
                ? "translate(0, 13px) scale(0.9)"
                : "translate(10px, 13px) scale(0.9)"
          },
          "& .MuiInputLabel-shrink": {
            transform: variant === "filled"
              ? "translate(8px, -12px) scale(0.90)"
              : variant === "standard"
                ? "translate(1px, 6px) scale(0.90)"
                : "translate(15px, -7px) scale(0.90)"
          }
        };
    }
  };

  const handleChange = (newValue: dayjs.Dayjs | null) => {
    if (!newValue) {
      if (onChange) {
        const event = {
          target: { value: "", id }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      if (onChangeData && data) {
        onChangeData({ ...data, [id]: null });
      }
      return;
    }

    const formattedDate = newValue.utc(true).format();

    if (onChange) {
      const event = {
        target: { value: newValue.format("YYYY-MM-DD"), id }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }

    if (onChangeData && data) {
      onChangeData({ ...data, [id]: formattedDate });
    }
  };

  if (useMUI) {
    return (
      <div className={className}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            disabled={disabled || readonly}
            value={value ? dayjs(value) : null}
            onChange={handleChange}
            minDate={minDate ? dayjs(minDate) : minDateKey ? dayjs(data?.[minDateKey]) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : maxDateKey ? dayjs(data?.[maxDateKey]) : undefined}
            slotProps={{
              textField: {
                required,
                variant,
                color,
                fullWidth: true,
                sx: getSizeStyles(),
                InputLabelProps: {
                  shrink: true
                }
              }
            }}
          />
        </LocalizationProvider>
        <ERPElementValidationMessage validation={validation} />
      </div>
    );
  }

  const displayValue = formatDate(value) || formatDate(defaultValue) || "";

  return (
    <div className={className}>
      <ERPInput
        ref={ref}
        id={id}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        onChange={onChange}
        required={required}
        readOnly={readonly}
        min={minDate ? dateTrimmer(minDate) : minDateKey ? formatDate(data?.[minDateKey]) : undefined}
        max={maxDate ? dateTrimmer(maxDate) : maxDateKey ? formatDate(data?.[maxDateKey]) : undefined}
        value={displayValue}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        {...props}
      />
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
});

export default ERPDateInput;