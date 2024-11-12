import * as React from "react"
import { forwardRef } from "react"
import { TextField, InputAdornment, TextFieldProps, Theme, SxProps } from "@mui/material"
import { setNestedValue } from "../../utilities/Utils"

// Mocking the ERPElementValidationMessage component
const ERPElementValidationMessage = ({ validation }: { validation?: string }) => (
  <div className="text-red-500 text-xs mt-1">{validation}</div>
)

type ERPInputBaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'color'>

interface ERPInputProps extends ERPInputBaseProps {
  id: string
  data?: any
  value?: any
  defaultValue?: any
  label?: string
  placeholder?: string
  onChangeData?: (data: any) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number | string
  max?: number | string
  step?: any
  pattern?: string
  type?: string
  autocomplete?: string
  disabled?: boolean
  labelClassName?: string
  className?: string
  inputClassName?: string
  noLabel?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  onClickPrefix?: () => void
  onClickSuffix?: () => void
  accept?: string
  validation?: string
  autoFocus?: boolean
  customSize?: "sm" | "md" | "lg" | "auto"
  useMUI?: boolean
  color?: TextFieldProps['color']
  variant?: "filled" | "outlined" | "standard" | undefined
}

const ERPInput = forwardRef<HTMLInputElement, ERPInputProps>(({
  id,
  onChangeData,
  onChange,
  onFocus,
  onBlur,
  data,
  type = "text",
  customSize = "sm",
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
  useMUI = false,
  color,
  variant = "outlined",
  ...props
}: ERPInputProps, ref) => {
  const iLabel = label || id?.replaceAll("_", " ")
  const iPlaceholder = placeholder || label

  // Custom size styles for MUI TextField
  const getMuiSizeStyles = (): SxProps<Theme> => {
    switch (customSize) {
      case "sm":
        return {
          "& .MuiInputBase-root": {
            height: "12px !importent",
            fontSize: "12px",
            padding: "0 8px"
          },
        
        }
     
      default:
        return {}
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeData && data && onChangeData(setNestedValue(data, id, e.target?.value))
    onChange && onChange(e)
  }

  const commonProps = {
    id,
    name: id,
    value: value === undefined ? "" : value,
    defaultValue,
    onChange: handleChange,
    onFocus,
    onBlur,
    type,
    required,
    disabled,
    placeholder: iPlaceholder,
    ...props
  }

  if (useMUI) {
    const muiProps: TextFieldProps = {
      ...commonProps,
      label: !noLabel ? iLabel : undefined,
      InputProps: {
        startAdornment: prefix ? (
          <InputAdornment position="start" onClick={onClickPrefix}>
            {prefix}
          </InputAdornment>
        ) : undefined,
        endAdornment: suffix ? (
          <InputAdornment position="end" onClick={onClickSuffix}>
            {suffix}
          </InputAdornment>
        ) : undefined,
      },
      fullWidth: true,
      variant: variant,
      color: color,
      inputProps: {
        maxLength,
        min,
        max,
        pattern,
        step,
        accept,
      },
      sx: getMuiSizeStyles() // Apply custom size styles
    }

    return (
      <div className={className}>
        <TextField {...muiProps} />
        <ERPElementValidationMessage validation={validation} />
      </div>
    )
  }

  return (
    <div className={className}>
      {!noLabel && (
        <label className={`capitalize mb-1 block text-xs text-gray-900 text-left rtl:text-right ${labelClassName}`}>
          {iLabel}
          {required && !noLabel && "*"}
        </label>
      )}
      <div className="flex">
        {prefix && (
          <div
            onClick={onClickPrefix}
            className={`${onClickPrefix && "cursor-pointer"} flex items-center justify-center text-slate-400 text-xs px-2 rounded-l font-medium border-r-0 border-gray-300 border bg-slate-100`}
          >
            {prefix}
          </div>
        )}
        <div className="flex-1">
          <input
            {...commonProps}
            ref={ref}
            autoComplete={autocomplete}
            className={`border border-gray-400 rounded-md block w-full ${prefix ? "" : "rounded-l"} ${suffix ? "" : "rounded-r"} ${inputClassName} border placeholder:capitalize h-9 border-gray-300 ${disabled ? "text-gray-400" : "bg-white text-gray-900"} px-3 py-2 placeholder-gray-400 focus:ring-0 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 text-xs`}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            onWheel={(e: any) => {
              type === "number" && e?.target?.blur()
            }}
            maxLength={maxLength}
            min={min}
            max={max}
            pattern={pattern}
            step={step}
            accept={accept}
          />
        </div>
        {suffix && (
          <div
            onClick={onClickSuffix}
            className={`${onClickSuffix && "cursor-pointer"} flex items-center justify-center text-slate-400 text-xs p-2 rounded-r-md border-l-0 border bg-slate-100`}
          >
            {suffix}
          </div>
        )}
      </div>
      <ERPElementValidationMessage validation={validation} />
    </div>
  )
})

export default ERPInput