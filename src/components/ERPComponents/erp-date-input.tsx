import React, { forwardRef, useEffect, useState } from "react";
import moment from "moment-timezone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Typography } from "@mui/material";
import ERPInput from "./erp-input";
import { dateTrimmer } from "../../utilities/Utils";
import ERPElementValidationMessage from "./erp-element-validation-message";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { getFocusableElements, handleNavigation } from "../../utilities/shortKeys";
import { inputBox } from "../../redux/slices/app/types";

moment.tz.setDefault("UTC");

interface ERPDateInputProps {
  id: string;
  label?: string;
  info?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  noLabel?:boolean;
  minDate?: string;
  maxDate?: string;
  minDateKey?: string;
  maxDateKey?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeData?: (data: any) => void;
  onKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disableEnterNavigation?: boolean;
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
  localInputBox?: inputBox; // Local styling preferences
}

const ERPDateInput = forwardRef<HTMLInputElement, ERPDateInputProps>(
  (
    {
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
      onKeyDown,
      disableEnterNavigation = false,
      onKeyUp,
      onBlur,
      defaultValue,
      value,
      type = "date",
      noLabel=false,
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
      localInputBox, // Destructure localInputBox
      ...props
    },
    ref
  ) => {
    const formatDate = (date: string | undefined) => {
      if (!date) return undefined;
      return moment(date).local().format("YYYY-MM-DD");
    };

    const appState = useAppSelector((state: RootState) => state?.AppState?.appState);

    // Use localInputBox if provided, otherwise fall back to global inputBox state
    const inputBoxState = localInputBox || appState?.inputBox;

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
      if (e.key === "Enter") {
        handleNavigation(e);
      }
    };

    const [_customSize, setCustomSize] = useState(customSize ? customSize : inputBoxState?.inputSize);
    const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI);
    const [_variant, set_variant] = useState<"filled" | "outlined" | "standard" | undefined>(
      variant === "normal" ? undefined : variant
    );

    useEffect(() => {
      if (customSize == undefined || customSize == null) {
        setCustomSize(inputBoxState?.inputSize);
      }
    }, [inputBoxState?.inputSize]);

    useEffect(() => {
      if (inputBoxState?.inputStyle !== "normal" && useMUI === undefined) {
        set_useMUI(true);
      } else if (inputBoxState?.inputStyle === "normal" && useMUI === undefined) {
        set_useMUI(false);
      }
    }, [inputBoxState?.inputStyle, useMUI]);

    useEffect(() => {
      if (inputBoxState?.inputStyle !== "normal" && (variant === undefined || variant === null)) {
        set_variant(inputBoxState?.inputStyle as "filled" | "outlined" | "standard");
      } else if (inputBoxState?.inputStyle === "normal") {
        set_variant(undefined);
      } else {
        set_variant(variant as "filled" | "outlined" | "standard");
      }
    }, [inputBoxState?.inputStyle, variant]);

    function infoWithLineBreaks(text?: string) {
      if (!text) return null;
      return text?.includes("/n")
        ? text?.split("/n")?.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))
        : text;
    }

    const getSizeStyles = () => {
      const commonMuiStyles = {
        borderRadius: `${inputBoxState?.borderRadius ?? 5}px`,
        color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
        fontWeight:inputBoxState?.bold ? 700:400,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: appState?.mode == "dark" ? "#ffffff1a" : `rgb(${inputBoxState?.borderColor})`,
        },
        "& .MuiFilledInput-underline, &:before": {
          borderBottomColor: appState?.mode == "dark" ? "#ffffff1a" : `rgb(${inputBoxState?.borderColor})`,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&:hover .MuiFilledInput-underline, &:hover:before": {
          borderBottomColor: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&.Mui-focused .MuiFilledInput-underline, &.Mui-focused:before, &.Mui-focused:after": {
          borderBottomColor: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.borderFocus})`,
        },
        margin: "0",
        "& .MuiOutlinedInput-input, & .MuiFilledInput-input, & .MuiInput-input": {
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
              color:
                appState?.mode === "dark"
                  ? "rgb(225,224,224)"
                  : inputBoxState?.labelColor
                  ? `rgb(${inputBoxState?.labelColor})`
                  : "rgb(84,84,84)",
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
        case "md":
          return {
            "& .MuiInputBase-root": {
              height: _variant === "filled" ? "2.8rem" : "2.5rem",
              fontSize: "15px",
              ...commonMuiStyles,
            },
            "& .MuiInputLabel-root": {
              fontSize: "13px",
              color:
                appState?.mode === "dark"
                  ? "rgb(225,224,224)"
                  : inputBoxState?.labelColor
                  ? `rgb(${inputBoxState?.labelColor})`
                  : "rgb(84,84,84)",
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
              color:
                appState?.mode === "dark"
                  ? "rgb(225,224,224)"
                  : inputBoxState?.labelColor
                  ? `rgb(${inputBoxState?.labelColor})`
                  : "rgb(84,84,84)",
              transform:
                _variant === "filled"
                  ? "translate(10px, 21px) scale(1)"
                  : _variant === "standard"
                  ? "translate(0, 15px) scale(1)"
                  : "translate(10px, 15px) scale(1)",
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
              height: `${inputBoxState?.inputHeight ?? 3}rem`,
              fontSize: `${inputBoxState?.fontSize ?? 16}px`,
              ...commonMuiStyles,
              fontWeight:inputBoxState?.bold ? 700: inputBoxState?.fontWeight ?? 500,
            },
            "& .MuiInputLabel-root": {
              fontSize: `${inputBoxState?.labelFontSize ?? 14}px`,
              color:
                appState?.mode === "dark"
                  ? "rgb(225,224,224)"
                  : inputBoxState?.labelColor
                  ? `rgb(${inputBoxState?.labelColor})`
                  : "rgb(84,84,84)",
              transform:
                _variant === "filled"
                  ? `translate(${inputBoxState?.adjustA ?? 10}px, ${inputBoxState?.adjustB ?? 20}px) scale(1)`
                  : _variant === "standard"
                  ? `translate(${inputBoxState?.adjustA ?? 10}px, ${inputBoxState?.adjustB ?? 15}px) scale(1)`
                  : `translate(${inputBoxState?.adjustA ?? 10}px, ${inputBoxState?.adjustB ?? 12}px) scale(1)`,
            },
            "& .MuiInputLabel-shrink": {
              transform:
                _variant === "filled"
                  ? `translate(${inputBoxState?.adjustC ?? 8}px, ${inputBoxState?.adjustD ?? -1}px) scale(0.88)`
                  : _variant === "standard"
                  ? `translate(${inputBoxState?.adjustC ?? 1}px, ${inputBoxState?.adjustD ?? -6}px) scale(0.88)`
                  : `translate(${inputBoxState?.adjustC ?? 15}px, ${inputBoxState?.adjustD ?? -9}px) scale(0.88)`,
            },
          };
      }
    };

    const sizeStyles = getSizeStyles();

    const handleChange = (newValue: moment.Moment | null) => {
      if (!newValue) {
        if (onChange) {
          const event = {
            target: { value: "", id },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
        if (onChangeData && data) {
          onChangeData({ ...data, [id]: null });
        }
        return;
      }

      const formattedDate = newValue.local().format();

      if (onChange) {
        const event = {
          target: { value: newValue.format("YYYY-MM-DD"), id },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }

      if (onChangeData && data) {
        onChangeData({ ...data, [id]: formattedDate });
      }
    };

    const handleChangeNormal = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      let newValue: string | null = null;

      if (inputValue !== "") {
        const parsedDate = moment(inputValue).local();
        newValue = parsedDate.isValid() ? parsedDate.format() : null;
      }

      if (onChange) {
        onChange({ ...e, target: { ...e.target, value: newValue ?? "" } });
      }

      if (onChangeData && data) {
        onChangeData({ ...data, [id]: newValue });
      }
    };

    if (_useMUI === true) {
      return (
        <div
          className={className}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${inputBoxState?.marginTop ?? 0}px`,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label={!noLabel && label}
              disabled={disabled || readonly}
              value={value ? moment(value).local() : null}
              onChange={handleChange}
              minDate={
                minDate
                  ? moment(minDate).local()
                  : minDateKey
                  ? moment(data?.[minDateKey]).local()
                  : undefined
              }
              maxDate={
                maxDate
                  ? moment(maxDate).local()
                  : maxDateKey
                  ? moment(data?.[maxDateKey]).local()
                  : undefined
              }
              closeOnSelect={true}
              format="DD/MM/YYYY"
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
                  onKeyDown: (e) =>
                    disableEnterNavigation == true
                      ? onKeyDown != undefined
                        ? onKeyDown(e)
                        : undefined
                      : handleKeyDown(e),
                  onKeyUp: onKeyUp,
                  sx: sizeStyles,
                  inputProps: {
                    shrink: true,
                    "data-skip": skip,
                    "data-jump-to": jumpTo,
                    "data-jump-target": jumpTarget,
                  },
                },
              }}
            />
          </LocalizationProvider>
          {info != undefined && info != null && info != "" && (
            <Typography className="text-[#374151] text-xs font-medium mt-1">
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
    if (_useMUI === undefined || _useMUI === false) {
      return (
        <div className={className}>
          <ERPInput
            ref={ref}
            id={id}
            customSize={
              customSize == undefined || customSize == null
                ? customSize
                : inputBoxState?.inputSize
            }
            noLabel={noLabel}
            localInputBox={inputBoxState}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            onChange={handleChangeNormal}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
            disableEnterNavigation={disableEnterNavigation}
            required={required}
            readOnly={readonly}
            min={
              minDate
                ? dateTrimmer(minDate)
                : minDateKey
                ? formatDate(data?.[minDateKey])
                : undefined
            }
            max={
              maxDate
                ? dateTrimmer(maxDate)
                : maxDateKey
                ? formatDate(data?.[maxDateKey])
                : undefined
            }
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
  }
);

export default ERPDateInput;