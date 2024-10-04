import * as React from "react";
import { forwardRef, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
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
}

const ERPDateInput = forwardRef<HTMLInputElement, ERPDateInputProps>(({
  id,
  label,
  placeholder,
  disabled,
  required,
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
  ...props
}, ref) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return undefined;
    return dayjs(date).format("YYYY-MM-DD");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? null : dayjs(e.target.value).utc(true).format();
    
    if (onChange) {
      onChange(e);
    }

    if (onChangeData && data) {
      onChangeData({ ...data, [id]: newValue });
    }
  };

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
        onChange={handleChange}
        required={required}
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