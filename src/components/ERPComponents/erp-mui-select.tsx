import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ERPMUISelectProps {
  id: string;
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number;  // Allow both string and number
  handleChange: (event: SelectChangeEvent<string | number>) => void; // Updated type for handleChange
  required?: boolean;
  disabled?: boolean;
  customSize?: "sm" | "md" | "lg" | "auto";
  customWidth?: string;
}

const ERPMUISelect: React.FC<ERPMUISelectProps> = ({
  id,
  label,
  options,
  value,
  handleChange,
  required = false,
  disabled = false,
  customSize = "sm",
  customWidth = "100%", // Default to full width
}) => {
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

  return (
    <FormControl
      sx={{ m: 1, minWidth: customWidth, width: customWidth }} // Apply customWidth
      size="small"
      required={required}
      disabled={disabled}
    >
      <InputLabel id={`${id}-label`} sx={{ fontSize: selectedSizeStyles.fontSize }}>
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={handleChange}
        sx={{
          ...selectedSizeStyles, // Apply selected size styles
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ERPMUISelect;
