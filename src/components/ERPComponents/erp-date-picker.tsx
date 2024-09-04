import { FormControl, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect } from "react";

interface ERPDatePickerProps {
  label?: string;
  data?: any;
  field?: any;
  defaultData?: any;
  handleChange?: (id: string, date: string) => void;
  onChange?: (date: Date | null) => void;
}

const ERPDatePicker = ({ label, data, field, defaultData, handleChange, onChange }: ERPDatePickerProps) => {
  let currentDate = new Date();
  useEffect(() => {
    let currentDate = new Date();
    handleChange && handleChange(field?.id, dayjs(currentDate).format());
  }, []);
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={data?.[field?.id] || defaultData?.[field?.id] || currentDate || null}
          // mask="__-__-____"
          // inputFormat="DD/MM/YYYY"
          onChange={(newValue: any) => {
            handleChange && handleChange(field?.id, dayjs(newValue).format());
            onChange && onChange(newValue);
          }}
          // renderInput={(params: any) => <TextField required={field?.required} {...params} size="small" />}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default ERPDatePicker;
