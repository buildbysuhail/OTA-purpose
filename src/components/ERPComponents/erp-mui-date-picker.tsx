import { FormControl, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, forwardRef } from "react";
import ERPElementValidationMessage from "./erp-element-validation-message";

interface ERPMUIDatePickerProps {
  id: string;
  label?: string; // Optional label prop
  data?: any;
  field?: any;
  defaultData?: any;
  handleChange?: (id: string, date: string) => void;
  onChange?: (date: Date | null) => void;
  required?: boolean;
  disabled?: boolean;
  customSize?: "sm" | "md" | "lg" | "auto";
  customWidth?: string;
  validation?: string;
}

const ERPMUIDatePicker = forwardRef<HTMLDivElement, ERPMUIDatePickerProps>(({
  id,
  label, // Extract label prop
  data,
  field,
  defaultData,
  handleChange,
  onChange,
  required,
  disabled,
  customSize = "sm",
  customWidth = "100%",
  validation,
}: ERPMUIDatePickerProps, ref) => {
  
  // Define size styles based on customSize prop
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

  useEffect(() => {
    const currentDate = dayjs();
    handleChange && handleChange(field?.id, currentDate.format());
  }, [field, handleChange]);

  return (
    <FormControl fullWidth style={{ width: customWidth }} ref={ref}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={
            data?.[field?.id] ? dayjs(data[field.id]) : defaultData?.[field?.id] ? dayjs(defaultData[field.id]) : null
          }
          onChange={(newValue: any) => {
            if (newValue && newValue.isValid()) {
              handleChange && handleChange(field?.id, dayjs(newValue).format());
              onChange && onChange(newValue.toDate());
            } else {
              handleChange && handleChange(field?.id, '');
              onChange && onChange(null);
            }
          }}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                id={id}
                label={label || ""} // Include the label here
                required={required}
                disabled={disabled}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    ...selectedSizeStyles, // Apply size styles
                  },
                }}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  sx: {
                    fontSize: selectedSizeStyles.fontSize || 'inherit', // Adjust label size
                  },
                }}
              />
            ),
          }}
        />
      </LocalizationProvider>
      <ERPElementValidationMessage validation={validation} />
    </FormControl>
  );
});

export default ERPMUIDatePicker;
