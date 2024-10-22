import * as React from "react"
import { forwardRef } from "react";
import ERPElementValidationMessage from "./erp-element-validation-message";
import { setNestedValue } from "../../utilities/Utils";
interface ERPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  data?: any;
  value?: any;
  defaultValue?: any;
  label?: string;
  placeholder?: string;
  onChangeData?: (data: any) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: any;
  pattern?: string;
  type?: string;
  autocomplete?: string;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  noLabel?: boolean;
  prefix?: any;
  suffix?: any;
  onClickPrefix?: () => void;
  onClickSuffix?: () => void;
  accept?: string;
  validation?: string;
  autoFocus?: boolean;
  customSize?: "sm" | "md" | "lg" | "auto";
}

const ERPInput = forwardRef<HTMLInputElement, ERPInputProps>(({
  id,
  onChangeData,
  onChange,
  onFocus,
  onBlur,
  data,
  type = "text",
  customSize = "auto",

  autocomplete = "off",
  label,
  placeholder,
  disabled,
  labelClassName,
  className,
  inputClassName,
  value,
  defaultValue,
  required,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  noLabel,
  prefix,
  suffix,
  step,
  accept,
  validation,
  onClickPrefix,
  onClickSuffix,
  ...props
}: ERPInputProps, ref) => {
  const iLabel = label || id?.replaceAll("_", " ");
  let sizeClasses = "";
  if (customSize === "sm") {
    sizeClasses = "!p-1 !h-6 !text-[12px]";
  } else if (customSize === "md") {
    sizeClasses = "p-1 h-5 text-[11px]";
  } else if (customSize === 'lg') {
    sizeClasses = "p-1 h-5 text-[11px]";
  } else {
    sizeClasses = "";
  }


  return (
    <div className={className}>
      {!noLabel && (
        <label className={`${labelClassName} capitalize mb-1  block text-xs text-gray-900 text-left rtl:text-right`}>
          {iLabel}
          {required && !noLabel && "*"}
        </label>
      )}
      <div className=" flex">
        {prefix ? (
          <div
            onClick={onClickPrefix}
            className={`${onClickPrefix && "cursor-pointer"
              } flex items-center justify-center text-slate-400 text-xs px-2 rounded-l font-medium border-r-0 border-gray-300 border bg-slate-100`}
          >
            {prefix}
          </div>
        ) : null}
        <div className=" flex-1">
          <input
            onChange={(e) => {

              onChangeData && data && onChangeData(setNestedValue(data, id, e.target?.value));
              onChange && onChange(e);
            }}
            onFocus={onFocus}
            onWheel={(e: any) => {
              type == "number" && e?.target?.blur();
            }}
            onBlur={onBlur}
            id={id}
            value={value == undefined ? "" : value}
            defaultValue={defaultValue}
            type={type}
            name={id}
            ref={ref}
            autoComplete={autocomplete}
            disabled={disabled}
            placeholder={placeholder || label}
            className={`block w-full ${sizeClasses}  ${prefix ? "" : "rounded-l"} ${suffix ? "" : " rounded-r"
              } ${inputClassName} border placeholder:capitalize h-9 border-gray-300 ${disabled ? "text-gray-400" : "bg-white text-gray-900"
              }  px-3 py-2  placeholder-gray-400 focus:ring-0 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 text-xs`}
            required={required}
            maxLength={maxLength}
            min={min}
            max={max}
            pattern={pattern}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            step={step}
            accept={accept}
            {...props}
          />
        </div>
        {suffix ? (
          <div
            onClick={onClickSuffix}
            className={` ${onClickSuffix && "cursor-pointer"
              } flex items-center justify-center text-slate-400 text-xs p-2 rounded-r-md border-l-0 border bg-slate-100`}
          >
            {suffix}
          </div>
        ) : null}
      </div>
      <ERPElementValidationMessage validation={validation}></ERPElementValidationMessage>
    </div>
  );
});

export default ERPInput;
