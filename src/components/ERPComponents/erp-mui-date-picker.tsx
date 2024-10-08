import { FormControl, SelectChangeEvent, TextField } from "@mui/material";
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
  handleChange?: (event: SelectChangeEvent<string | number> | { id: string; date: string }) => void;
  onChange?: (date: Date | null) => void;
  required?: boolean;
  disabled?: boolean;
  customSize?: "sm" | "md" | "lg" | "auto";
  customWidth?: string;
  validation?: string;
}

const ERPMUIDatePicker = forwardRef<HTMLDivElement, ERPMUIDatePickerProps>(({
  id,
  label,
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
  
  const sizeStyles = {
    sm: { fontSize: '12px', height: '30px', padding: '2px 8px' },
    md: { fontSize: '14px', height: '36px', padding: '6px 12px' },
    lg: { fontSize: '16px', height: '40px', padding: '8px 16px' },
    auto: { fontSize: '16px', height: '40px', padding: '8px 16px' },
  };
  
  const selectedSizeStyles = sizeStyles[customSize];

  useEffect(() => {
    const currentDate = dayjs();
    handleChange && handleChange({ id: field?.id, date: currentDate.format() });
  }, [field, handleChange]);

  return (
    <FormControl fullWidth style={{ width: customWidth }} ref={ref}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={data?.[field?.id] ? dayjs(data[field.id]) : defaultData?.[field?.id] ? dayjs(defaultData[field.id]) : null}
          onChange={(newValue) => {
            const dateString = newValue && newValue.isValid() ? dayjs(newValue).format() : '';
            handleChange && handleChange({ id: field?.id, date: dateString });
            onChange && onChange(newValue ? newValue.toDate() : null);
          }}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                id={id}
                label={label || ""}
                required={required}
                disabled={disabled}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  sx: { ...selectedSizeStyles },
                }}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  sx: { fontSize: selectedSizeStyles.fontSize || 'inherit' },
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
