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

  // Get size-specific styles for both MUI and regular inputs
  const getSizeStyles = () => {
    const styles: {
      mui: SxProps<Theme>;
      regular: {
        height: string;
        fontSize: string;
        padding: string;
      };
    } = {
      mui: {},
      regular: {
        height: "2.5rem",
        fontSize: "14px",
        padding: "0.5rem 1rem"
      }
    }

    switch (customSize) {
      case "sm":
        return {
          mui: {
            "& .MuiInputBase-root": {
              height: "2rem",
              fontSize: "12px"
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              transform: variant === "filled"
                ? "translate(8px, 9px) scale(0.8)"
                : variant === "standard"
                  ? "translate(0, 30px) scale(0.8)"
                  : "translate(8px, 8px) scale(0.8)"
            },
            "& .MuiInputLabel-shrink": {
              transform: variant === "filled"
                ? "translate(8px, -10px) scale(0.75)"
                : variant === "standard"
                  ? "translate(0, 10px) scale(0.75)"
                  : "translate(16px, -6px) scale(0.75)"
            }
          } as SxProps<Theme>,
          regular: {
            height: "2rem",
            fontSize: "12px",
            padding: "0.25rem 0.75rem"
          }
        }
      case "md":
        return {
          mui: {
            "& .MuiInputBase-root": {
              height: variant === "filled" ? "2.5rem" : variant === "standard" ? "2rem" : "2.5rem",
              fontSize: "14px"
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              transform: variant === "filled"
                ? "translate(10px, 13px) scale(0.9)"
                : variant === "standard"
                  ? "translate(0, 30px) scale(0.9)"
                  : "translate(10px, 12px) scale(0.9)"
            },
            "& .MuiInputLabel-shrink": {
              transform: variant === "filled"
                ? "translate(8px, -12px) scale(0.90)"
                : variant === "standard"
                  ? "translate(0, 8px) scale(0.90)"
                  : "translate(15px, -7px) scale(0.90)"
            }
          } as SxProps<Theme>,
          regular: {
            height: "2.5rem",
            fontSize: "14px",
            padding: "0.5rem 1rem"
          }
        }
      case "lg":
        return {
          mui: {
            "& .MuiInputBase-root": {
              height: variant === "filled" ? "3rem" : variant === "standard" ? "2rem" : "3rem",
              fontSize: "16px"
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              transform: variant === "filled"
                ? "translate(10px, 16px) scale(1)"
                : variant === "standard"
                  ? "translate(0, 26px) scale(1)"
                  : "translate(10px, 15px) scale(1)"
            },
            "& .MuiInputLabel-shrink": {
              transform: variant === "filled"
                ? "translate(8px, -14px) scale(0.88)"
                : variant === "standard"
                  ? "translate(0, 4px) scale(0.88)"
                  : "translate(16px, -7px) scale(0.88)"
            }
          } as SxProps<Theme>,
          regular: {
            height: "3rem",
            fontSize: "16px",
            padding: "0.75rem 1.25rem"
          }
        }
      default:
        return styles
    }
  }

  const sizeStyles = getSizeStyles()

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
      sx: sizeStyles.mui
    }

    return (
      <div className={className}>
        <TextField {...muiProps} />
        <ERPElementValidationMessage validation={validation} />
      </div>
    )
  }

  const { height, fontSize, padding } = sizeStyles.regular

  // Build border radius classes based on prefix/suffix presence
  const getBorderRadiusClasses = () => {
    const classes = []
    if (!prefix) classes.push('rounded-l-md')
    if (!suffix) classes.push('rounded-r-md')
    if (!prefix && !suffix) classes.push('rounded-md')
    return classes.join(' ')
  }

  return (
    <div className={className}>
      {!noLabel && (
        <label
          className={`capitalize mb-1 block text-xs text-gray-900 text-left rtl:text-right ${labelClassName}`}
          style={{ fontSize: customSize === 'sm' ? '12px' : customSize === 'md' ? '14px' : '16px' }}
        >
          {iLabel}
          {required && !noLabel && "*"}
        </label>
      )}
      <div className="flex">
        {prefix && (
          <div
            onClick={onClickPrefix}
            className={`${onClickPrefix && "cursor-pointer"} flex items-center justify-center text-slate-400 px-2 rounded-l-md font-medium border-r-0 border-gray-300 border bg-slate-100`}
            style={{ height, fontSize }}
          >
            {prefix}
          </div>
        )}
        <div className="flex-1">
          <input
            {...commonProps}
            placeholder={iPlaceholder}
            ref={ref}
            autoComplete={autocomplete}
            style={{
              height,
              fontSize,
              padding
            }}
            className={`border border-gray-400 ${getBorderRadiusClasses()} block w-full ${inputClassName} border placeholder:capitalize border-gray-300 ${disabled ? "text-gray-400" : "bg-white text-gray-900"} placeholder-gray-400 focus:ring-0 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500`}
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
            className={`border border-gray-400 ${onClickSuffix && "cursor-pointer"} flex items-center justify-center text-slate-400 p-2 rounded-r-md border-l-0 border bg-slate-100`}
            style={{ height, fontSize }}
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