
import React, { forwardRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, TextFieldProps, Typography } from "@mui/material";
import ERPInput from "./erp-input";
import { dateTrimmer } from "../../utilities/Utils";
import ERPElementValidationMessage from "./erp-element-validation-message";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { getFocusableElements, handleNavigation } from "../../utilities/shortKeys";

dayjs.extend(utc);
interface ERPDateInputProps {
  id: string;
  label?: string;
  info?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  minDate?: string;
  maxDate?: string;
  minDateKey?: string;
  maxDateKey?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeData?: (data: any) => void;
  defaultValue?: string;
  value?: any;
  type?: "date" | "datetime";
  data?: any;
  validation?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  useMUI?: boolean;
  variant?: "standard" | "outlined" | "filled" | "normal";
  customSize?: "sm" | "md" | "lg" | "customize";
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
}

const ERPDateInput = forwardRef<HTMLInputElement, ERPDateInputProps>(({
  id,
  label,
  placeholder,
  disabled,
  required,
  readonly,
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
  useMUI,
  variant,
  info,
  customSize,
  skip = false,
  jumpTo,
  jumpTarget,
  ...props
}, ref) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return undefined;
    return dayjs(date).format("YYYY-MM-DD");
  };
  const appState = useAppSelector(
    (state: RootState) => state?.AppState?.appState
  );

  const moveToNextField = () => {
    const allFocusableElements = getFocusableElements();
    const currentIndex = allFocusableElements?.findIndex(
      (element) => element === document.activeElement
    );

    if (currentIndex !== -1 && currentIndex < allFocusableElements.length - 1) {
      const nextElement = allFocusableElements[currentIndex + 1] as HTMLElement;
      nextElement.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleNavigation(e);
  };

  const [_customSize, setCustomSize] = useState(customSize ? customSize : appState?.inputBox?.inputSize);
  const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI);
  const [_variant, set_variant] = useState<"filled" | "outlined" | "standard" | undefined>(
    variant === "normal" ? undefined : variant
  );

  useEffect(() => {
    if (customSize == undefined || customSize == null) {
      setCustomSize(appState?.inputBox?.inputSize);
    }
  }, [appState?.inputBox?.inputSize]);

  useEffect(() => {
    if (appState?.inputBox?.inputStyle !== "normal" && useMUI === undefined) {
      set_useMUI(true);
    } else if (
      appState?.inputBox?.inputStyle === "normal" &&
      useMUI === undefined
    ) {
      set_useMUI(false);
    }
  }, [appState?.inputBox?.inputStyle, useMUI]);

  useEffect(() => {
    if (appState?.inputBox?.inputStyle !== "normal" && (variant === undefined || variant === null)) {
      set_variant(appState?.inputBox?.inputStyle as "filled" | "outlined" | "standard");
    } else if (appState?.inputBox?.inputStyle === "normal") {
      set_variant(undefined);
    } else {
      set_variant(variant as "filled" | "outlined" | "standard");
    }
  }, [appState?.inputBox?.inputStyle, variant]);

  function infoWithLineBreaks(text?: string) {
    if (!text) return null;
    return text?.includes('/n')
      ? text?.split('/n')?.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))
      : text;
  }
  const getSizeStyles = () => {

    const commonMuiStyles = {
      borderRadius: `${appState?.inputBox?.borderRadius ?? 5}px`,
      color: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState?.inputBox?.fontColor})`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: appState?.mode == 'dark' ? '#ffffff1a' : `rgb(${appState?.inputBox?.borderColor})`,
      },
      "& .MuiFilledInput-underline, &:before": {
        borderBottomColor: appState?.mode == 'dark' ? '#ffffff1a' : `rgb(${appState?.inputBox?.borderColor})`,
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState?.inputBox?.borderFocus})`,
      },
      "&:hover .MuiFilledInput-underline, &:hover:before": {
        borderBottomColor: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState?.inputBox?.borderFocus})`,
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState?.inputBox?.borderFocus})`,
      },
      "&.Mui-focused .MuiFilledInput-underline, &.Mui-focused:before, &.Mui-focused:after":
      {
        borderBottomColor: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState?.inputBox?.borderFocus})`,
      },
      margin: "0",
      "& .MuiOutlinedInput-input, & .MuiFilledInput-input, & .MuiInput-input":
      {
        padding: "0 0.75rem",
      },
    };
    switch (_customSize) {
      case "sm":
        return {
          "& .MuiInputBase-root": {
            height: _variant === "filled" ? "2.3rem" : "2rem",
            fontSize: "12px",
            ...commonMuiStyles,
          },
          "& .MuiInputLabel-root": {

            fontSize: "12px",
            color: appState?.mode === 'dark' ? 'rgb(225,224,224)' :
              (appState?.inputBox?.labelColor ? `rgb(${appState?.inputBox?.labelColor})` : 'rgb(84,84,84)'),
            transform:
              _variant === "filled"
                ? "translate(8px, 14px) scale(1)"
                : _variant === "standard"
                  ? "translate(0, 10px) scale(1)"
                  : "translate(8px, 10px) scale(1)",
          },
          "& .MuiInputLabel-shrink": {
            transform:
              _variant === "filled"
                ? "translate(8px, -1px) scale(0.90)"
                : _variant === "standard"
                  ? "translate(0, -6px) scale(0.90)"
                  : "translate(13px, -6px) scale(0.80)",
          },
        };
      case "md": // md
        return {
          "& .MuiInputBase-root": {
            height: _variant === "filled" ? "2.8rem" : "2.5rem",
            fontSize: "15px",
            ...commonMuiStyles,
          },
          "& .MuiInputLabel-root": {
            fontSize: "13px",
            color: appState?.mode === 'dark' ? 'rgb(225,224,224)' :
              (appState?.inputBox?.labelColor ? `rgb(${appState?.inputBox?.labelColor})` : 'rgb(84,84,84)'),
            transform:
              _variant === "filled"
                ? "translate(10px, 18px) scale(1)"
                : _variant === "standard"
                  ? "translate(0, 13px) scale(1)"
                  : "translate(10px, 13px) scale(1)",
          },
          "& .MuiInputLabel-shrink": {
            transform:
              _variant === "filled"
                ? "translate(8px, -1px) scale(0.90)"
                : _variant === "standard"
                  ? "translate(0, -6px) scale(0.90)"
                  : "translate(12px, -8px) scale(0.90)",
          },
        };
      case "lg":
        return {
          "& .MuiInputBase-root": {
            height: _variant === "filled" ? "3.3rem" : "3rem",
            fontSize: "16px",
            ...commonMuiStyles,
          },
          "& .MuiInputLabel-root": {

            fontSize: "14px",
            color: appState?.mode === 'dark' ? 'rgb(225,224,224)' :
              (appState?.inputBox?.labelColor ? `rgb(${appState?.inputBox?.labelColor})` : 'rgb(84,84,84)'),
            transform:
              _variant === "filled"
                ? "translate(10px, 21px) scale(1)"
                : _variant === "standard"
                  ? "translate(0, 15px) scale(1)"
                  : "translate(10px, 15px) scale(1)"
          },
          "& .MuiInputLabel-shrink": {
            transform:
              _variant === "filled"
                ? "translate(8px, -1px) scale(0.90)"
                : _variant === "standard"
                  ? "translate(1px,-6px) scale(0.90)"
                  : "translate(15px, -9px) scale(0.90)",
          },
        };


      case "customize":
        return {
          "& .MuiInputBase-root": {

            height: `${appState?.inputBox?.inputHeight ?? 3}rem`,
            fontSize: `${appState?.inputBox?.fontSize ?? 16}px`,
            fontWeight: appState?.inputBox?.fontWeight ?? 500,
            ...commonMuiStyles,
          },
          "& .MuiInputLabel-root": {
            fontSize: `${appState?.inputBox?.labelFontSize ?? 14}px`,
            color: appState?.mode === 'dark' ? 'rgb(225,224,224)' :
              (appState?.inputBox?.labelColor ? `rgb(${appState?.inputBox?.labelColor})` : 'rgb(84,84,84)'),
            transform:
              _variant === "filled"
                ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 20
                }px) scale(1)`
                : _variant === "standard"
                  ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 15
                  }px) scale(1)`
                  : `translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 12
                  }px) scale(1)`,
          },
          "& .MuiInputLabel-shrink": {
            transform:
              _variant === "filled"
                ? `translate(${appState?.inputBox?.adjustC ?? 8}px, ${appState?.inputBox?.adjustD ?? -1
                }px) scale(0.88)`
                : _variant === "standard"
                  ? `translate(${appState?.inputBox?.adjustC ?? 1}px, ${appState?.inputBox?.adjustD ?? -6
                  }px) scale(0.88)`
                  : `translate(${appState?.inputBox?.adjustC ?? 15}px, ${appState?.inputBox?.adjustD ?? -9
                  }px) scale(0.88)`,
          },
        };
    }
  };
  const sizeStyles = getSizeStyles();
  const handleChange = (newValue: dayjs.Dayjs | null) => {
    if (!newValue) {
      if (onChange) {
        const event = {
          target: { value: "", id }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      if (onChangeData && data) {
        onChangeData({ ...data, [id]: null });
      }
      return;
    }

    const formattedDate = newValue?.utc(true)?.format();

    if (onChange) {
      const event = {
        target: { value: newValue.format("YYYY-MM-DD"), id }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }

    if (onChangeData && data) {
      onChangeData({ ...data, [id]: formattedDate });
    }
    setTimeout(() => {
      moveToNextField();
    }, 10);
  };

  const handleChangeNormal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target?.value;
    let newValue: string | null = null;

    if (inputValue !== "") {
      const parsedDate = dayjs(inputValue)?.utc(true);
      newValue = parsedDate?.isValid() ? parsedDate?.format() : null; // Validate and format the date
    }

    if (onChange) {
      onChange({ ...e, target: { ...e?.target, value: newValue ?? "", } }); // Ensure consistent value
    }

    if (onChangeData && data) {
      onChangeData({ ...data, [id]: newValue });
    }
  };


  if (_useMUI == true) {
    return (
      <div className={className}
        style={{
          marginBottom: `${appState?.inputBox?.marginBottom ?? 0}px`,
          marginTop: `${appState?.inputBox?.marginTop ?? 0}px`
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            disabled={disabled || readonly}
            value={value ? dayjs(value) : null}
            onChange={handleChange}
            minDate={minDate ? dayjs(minDate) : minDateKey ? dayjs(data?.[minDateKey]) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : maxDateKey ? dayjs(data?.[maxDateKey]) : undefined}
            closeOnSelect={true}
            onClose={() => {
              if (value) {
                setTimeout(() => {
                  moveToNextField();
                }, 100);
              }
            }}
            slotProps={{
              textField: {
                required,
                variant: _variant,
                fullWidth: true,
                onKeyDown: (e) => {
                  if (e?.key === 'Enter' && value) {
                    e?.preventDefault();
                    moveToNextField();
                  } else {
                    handleNavigation(e);
                  }
                },
                sx: sizeStyles,
                inputProps: {
                  shrink: true,
                  'data-skip': skip,
                  'data-jump-to': jumpTo,
                  'data-jump-target': jumpTarget
                }
              }
            }}
          />
        </LocalizationProvider>
        {info != undefined && info != null && info != "" && (
          <Typography
            className="text-[#374151] text-xs font-medium mt-1">
            {infoWithLineBreaks(info)}
          </Typography>
        )}
        {validation != undefined && validation != null && validation != "" && (
          <ERPElementValidationMessage validation={validation} />
        )}
      </div>
    );
  }

  const displayValue = formatDate(value) || formatDate(defaultValue) || "";
  if (_useMUI == undefined || _useMUI == false) {
    return (
      <div className={className}>
        <ERPInput
          ref={ref}
          id={id}
          customSize={customSize == undefined || customSize == null ? customSize : appState?.inputBox?.inputSize}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          onChange={handleChangeNormal}
          required={required}
          readOnly={readonly}
          min={minDate ? dateTrimmer(minDate) : minDateKey ? formatDate(data?.[minDateKey]) : undefined}
          max={maxDate ? dateTrimmer(maxDate) : maxDateKey ? formatDate(data?.[maxDateKey]) : undefined}
          value={displayValue}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
          data-skip={skip}
          data-jump-to={jumpTo}
          data-jump-target={jumpTarget}
          {...props}
        />
        <ERPElementValidationMessage validation={validation} />
      </div>
    );
  }
});
export default ERPDateInput;