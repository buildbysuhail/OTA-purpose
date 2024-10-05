import * as React from "react";
import { forwardRef } from "react";
import ERPElementValidationMessage from "./erp-element-validation-message";

interface ERPRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value?: any;
  label?: string;
  data?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeData?: (data: any) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  validation?: string;
}

const ERPRadio = forwardRef<HTMLInputElement, ERPRadioProps>(({
  id,
  name,
  value,
  label,
  data,
  onChange,
  onChangeData,
  required,
  disabled,
  className,
  inputClassName,
  labelClassName,
  validation,
  ...props
}: ERPRadioProps, ref) => {
  const iLabel = label || id?.replaceAll("_", " ");

  return (
    <div className={className}>
      <div className="form-check flex items-center">
        <input
          id={id}
          name={name}
          value={value}
          type="radio"
          ref={ref}
          onChange={(e) => {
            if (onChangeData && data) {
              onChangeData({ ...data, [id]: e.target.value });
            }
            onChange && onChange(e);
          }}
          disabled={disabled}
          required={required}
          className={`form-check-input ${inputClassName} ${
            disabled ? "text-gray-400" : "text-gray-900"
          }`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`form-check-label ml-2 ${labelClassName} capitalize text-xs text-gray-900 rtl:text-right`}
        >
          {iLabel}
        </label>
      </div>
      <ERPElementValidationMessage validation={validation}></ERPElementValidationMessage>
    </div>
  );
});

export default ERPRadio;
