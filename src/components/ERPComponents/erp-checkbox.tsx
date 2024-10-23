import * as React from "react";
import { forwardRef } from "react";
import ERPElementValidationMessage from "./erp-element-validation-message";

interface ERPCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  data?: any;
  label?: string;
  onChangeData?: (data: any) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  noLabel?: boolean;
  validation?: string;
}

const ERPCheckbox = forwardRef<HTMLInputElement, ERPCheckboxProps>(({
  id,
  onChangeData,
  onChange,
  onFocus,
  onBlur,
  data,
  label,
  disabled,
  labelClassName,
  className,
  inputClassName,
  required,
  noLabel,
  validation,
  ...props
}: ERPCheckboxProps, ref) => {
  const iLabel = label || id?.replaceAll("_", " ");
  
  return (
    <div className={`flex items-center ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={id}
        onChange={(e) => {
          onChangeData && data && onChangeData({ ...data, [id]: e.target.checked });
          onChange && onChange(e);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        defaultChecked={false}
        disabled={disabled}
        required={required}
        className={`form-check-input ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${inputClassName}`}
        {...props}
      />
      {!noLabel && (
        <label
          htmlFor={id}
          className={`ml-2 mr-2 block form-check-label ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          } ${labelClassName}`}
        >
          {iLabel}
          {required && !noLabel && "*"}
        </label>
      )}
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
});

export default ERPCheckbox;