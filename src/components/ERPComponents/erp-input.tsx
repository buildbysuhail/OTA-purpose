import React, { forwardRef, memo, KeyboardEvent, useEffect, useState, cloneElement } from "react";
import { TextField, InputAdornment, TextFieldProps, Theme, SxProps, Typography } from "@mui/material";
import { setNestedValue } from "../../utilities/Utils";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { handleNavigation } from "../../utilities/shortKeys";
import { ChevronDown, ChevronUp } from "lucide-react";
import { inputBox } from "../../redux/slices/app/types";

// Mocking the ERPElementValidationMessage component
const ERPElementValidationMessage = ({ validation }: { validation?: string }) =>
  validation != undefined && validation != null && validation != "" ? (<div className="text-red text-xs">{validation}</div>) : null;

type ERPInputBaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "color"
>;

interface Option {
  value: string;
  label: string;
  is_active?: boolean;
}

interface ERPInputProps extends ERPInputBaseProps {
  id: string;
  data?: any;
  value?: any;
  defaultValue?: any;
  label?: string;
  placeholder?: string;
  onChangeData?: (data: any) => void;
  disableEnterNavigation?: boolean;
  onKeyDown?: (e: any) => void;
  onEnterKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
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
  info?: string;
  type?: string;
  autocomplete?: string;
  initialValue?: any;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  noLabel?: boolean;
  noBorder?: boolean;
  showCustomNumberChanger?: boolean;
  labelDirection?: "horizontal" | "vertical";
  labelInfo?: any;
  labelInfoProps?: any;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onClickPrefix?: () => void;
  onClickSuffix?: () => void;
  accept?: string;
  validation?: string;
  autoFocus?: boolean;
  customSize?: "sm" | "md" | "lg" | "customize";
  useMUI?: boolean;
  skip?: boolean;
  isTransaction?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
  variant?: "filled" | "outlined" | "standard" | "normal";
  localInputBox?: inputBox; // Local styling preferences
  boldInput?: boolean;
}

const ERPInput = forwardRef<HTMLInputElement, ERPInputProps>(
  (
    {
      id,
      onChangeData,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onEnterKeyDown,
      onKeyUp,
      data,
      type = "text",
      customSize,
      autocomplete = "off",
      initialValue,
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
      noBorder,
      showCustomNumberChanger,
      labelDirection = "vertical",
      labelInfo,
      labelInfoProps,
      prefix,
      suffix,
      step,
      accept,
      validation,
      onClickPrefix,
      onClickSuffix,
      useMUI,
      skip = false,
      disableEnterNavigation = false,
      jumpTo,
      jumpTarget,
      variant,
      info,
      localInputBox, // Destructure localInputBox
      isTransaction,
      boldInput = false,
      ...props
    }: ERPInputProps,
    ref
  ) => {
    const appState = useAppSelector(
      (state: RootState) => state.AppState?.appState
    );

    const iLabel = label || id?.replaceAll("_", " ");
    const iPlaceholder = placeholder || label;
    const inputBoxState = React.useMemo(() => {
      return localInputBox || appState?.inputBox;
    }, [localInputBox, appState?.inputBox]);
    // const [inputBoxState] = useState(localInputBox);
    // Use localInputBox if provided, otherwise fall back to global inputBox state
    // const inputBoxState = localInputBox || appState?.inputBox;
    useEffect(() => {
      document.querySelectorAll("input").forEach((input) => {
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");
        input.setAttribute("autocorrect", "off");
      });
    }, []);
    const [_customSize, setCustomSize] = useState(customSize ? customSize : inputBoxState?.inputSize);
    const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI);
    const [_variant, set_variant] = useState<"filled" | "outlined" | "standard" | undefined>(variant === "normal" ? undefined : variant);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const [initial, setInitial] = useState<Option | null>(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const ds = min != undefined ? parseFloat(min.toString()) : undefined;
      const sd = parseFloat(e.target?.value);
      
      if (type === "number") {
        const value = e.target.value;
        // Allow empty string, decimal point, or valid numbers
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          if (ds !== undefined && ds >= 0 && sd < 0) return;
          onChangeData && data && onChangeData(setNestedValue(data, id, value));
          onChange && onChange(e);
        }
      } else {
        onChangeData && data && onChangeData(setNestedValue(data, id, e.target?.value));
        onChange && onChange(e);
      }
    };

    useEffect(() => {
      if (customSize == undefined || customSize == null) {
        setCustomSize(inputBoxState?.inputSize);
      }
    }, [inputBoxState?.inputSize]);

    const [borderStyles, setBorderStyles] = useState<string>(
      appState.mode == "dark"
        ? isFocused == true || isHovered == true
          ? "#ffffff"
          : "#ffffff1a"
        : `${isFocused || isHovered
          ? `rgb(${inputBoxState?.borderFocus})`
          : `rgb(${inputBoxState?.borderColor})`
        } `
    );

    const [bgColor, setBgColor] = useState<string>(
      appState.mode == "dark"
        ? isFocused == true
          ? "#ffffff"
          : "#ffffff1a"
        : `${isFocused ? `rgb(${inputBoxState?.focusBgColor})` : ``} `
    );

    useEffect(() => {
      let border, bgCol;
      if (appState?.mode === "dark") {
        border = isFocused || isHovered ? "#ffffff" : "#ffffff1a";
        bgCol = isFocused ? "#ffffff" : "#ffffff1a";
      } else {
        border =
          isFocused || isHovered
            ? `rgb(${inputBoxState?.borderFocus})`
            : `rgb(${inputBoxState?.borderColor})`;
        // bgCol = isFocused ? `rgb(${inputBoxState?.focusBgColor})` : `${inputBoxState?.inputBgColor? `!rgb(${inputBoxState?.inputBgColor})`:``}`;
        bgCol = isFocused
          ? `rgb(${inputBoxState?.focusBgColor})`
          : inputBoxState?.inputBgColor
            ? `rgb(${inputBoxState?.inputBgColor})`
            : "";
      }
      setBorderStyles(border);
      setBgColor(bgCol);
    }, [appState.mode, isFocused, isHovered, inputBoxState]);

    useEffect(() => {
      if (inputBoxState?.inputStyle !== "normal" && useMUI === undefined) {
        set_useMUI(true);
      } else if (
        inputBoxState?.inputStyle === "normal" &&
        useMUI === undefined
      ) {
        set_useMUI(false);
      }
    }, [inputBoxState?.inputStyle, useMUI]);

    useEffect(() => {
      if (
        inputBoxState?.inputStyle !== "normal" &&
        (variant === undefined || variant === null)
      ) {
        set_variant(
          inputBoxState?.inputStyle as "filled" | "outlined" | "standard"
        );
      } else if (inputBoxState?.inputStyle === "normal") {
        set_variant(undefined);
      } else {
        set_variant(variant as "filled" | "outlined" | "standard");
      }
    }, [inputBoxState?.inputStyle, variant]);

    function infoWithLineBreaks(text?: string) {
      if (!text) return null;
      return text.includes("/n")
        ? text.split("/n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))
        : text;
    }

    const getSizeStyles = () => {
      const styles: {
        mui: SxProps<Theme>;
        regular: {
          height?: string;
          fontSize: string;
          padding: string;
          fontWeight?: number;
          color?: string;
          backgroundColor?: string;
        };
      } = {
        mui: {},
        regular: {
          height: "2.5rem",
          fontSize: "14px",
          padding: "0.5rem 1rem",
        },
      };

      const commonMuiStyles = {
        margin: "0",
        borderRadius: `${inputBoxState?.borderRadius ?? 5}px`,
        fontWeight: boldInput || inputBoxState?.bold ? 700 : 400,
        color:
          appState?.mode == "dark"
            ? "#ffffff"
            : `rgb(${inputBoxState?.fontColor})`,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff1a"
              : `rgb(${inputBoxState?.borderColor})`,
        },
        "& .MuiFilledInput-underline, &:before": {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff1a"
              : `rgb(${inputBoxState?.borderColor})`,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&:hover .MuiFilledInput-underline, &:hover:before": {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&.Mui-focused .MuiFilledInput-underline, &.Mui-focused:before, &.Mui-focused:after":
        {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "& .MuiOutlinedInput-input, & .MuiFilledInput-input, & .MuiInput-input":
        {
          padding: "0 0.75rem",
        },
      };

      switch (_customSize) {
        case "sm":
          return {
            mui: {
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
            } as SxProps<Theme>,
            regular: {
              height: "1.4rem",
              fontSize: "12px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        case "md":
          return {
            mui: {
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
            } as SxProps<Theme>,
            regular: {
              height: "2rem",
              fontSize: "13px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        case "lg":
          return {
            mui: {
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
            } as SxProps<Theme>,
            regular: {
              height: "2.5rem",
              fontSize: "14px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        case "customize":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: `${inputBoxState?.inputHeight ?? 3}rem`,
                fontSize: `${inputBoxState?.fontSize ?? 16}px`,
                ...commonMuiStyles,
                fontWeight: boldInput || inputBoxState?.bold ? 700 : inputBoxState?.fontWeight ?? 500,
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
                    ? `translate(${inputBoxState?.adjustA ?? 10}px, ${inputBoxState?.adjustB ?? 20
                    }px) scale(1)`
                    : _variant === "standard"
                      ? `translate(${inputBoxState?.adjustA ?? 10}px, ${inputBoxState?.adjustB ?? 15
                      }px) scale(1)`
                      : `translate(${inputBoxState?.adjustA ?? 10}px, ${inputBoxState?.adjustB ?? 12
                      }px) scale(1)`,
              },
              "& .MuiInputLabel-shrink": {
                transform:
                  _variant === "filled"
                    ? `translate(${inputBoxState?.adjustC ?? 8}px, ${inputBoxState?.adjustD ?? -1
                    }px) scale(0.88)`
                    : _variant === "standard"
                      ? `translate(${inputBoxState?.adjustC ?? 1}px, ${inputBoxState?.adjustD ?? -6
                      }px) scale(0.88)`
                      : `translate(${inputBoxState?.adjustC ?? 15}px, ${inputBoxState?.adjustD ?? -9
                      }px) scale(0.88)`,
              },
            } as SxProps<Theme>,
            regular: {
              height: `${inputBoxState?.inputHeight ?? 2}rem`,
              fontSize: `${inputBoxState?.fontSize ?? 14}px`,
              fontWeight: inputBoxState?.fontWeight,
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        default:
          return styles;
      }
    };

    const sizeStyles = getSizeStyles();
    const commonProps = {
      id: `${id}_${Math.random()}`,
      name: `input_${id}_${Math.random()}`,
      value: value === undefined ? "" : value,
      defaultValue,
      onChange: handleChange,
      onFocus: (e: React.FocusEvent<HTMLInputElement, Element>) => {
        setIsFocused(true);
        e.target.select(); // Select the text when the input gains focus
        onFocus && onFocus(e);
      },
      onBlur,
      required,
      disabled,
      ...props,
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter") {
        handleNavigation(e);
      }
    };

    const numberInputProps = type === "number" ? {
      type: "tel", // Use tel instead of number to have more control
      inputMode: "decimal" as const, // Shows numeric keyboard with decimal support
      pattern: "[0-9]*\\.?[0-9]*", // Allows numbers and decimal point
    } : {
      type: type === "text" || type === undefined ? "text" : type,
    };

    if (_useMUI == true) {
      const muiProps: TextFieldProps = {
        ...commonProps,
        ...numberInputProps,
        label: !noLabel ? iLabel : undefined,
        InputProps: {
          startAdornment: prefix ? (
            <InputAdornment position="start" onClick={onClickPrefix}>
              {prefix}
            </InputAdornment>
          ) : undefined,
          endAdornment: (
            <>
              {suffix && (
                <InputAdornment position="end" onClick={onClickSuffix}>
                  {suffix}
                </InputAdornment>
              )}
              {showCustomNumberChanger && (
                <div
                  className="absolute right-0 top-0 h-full flex flex-col"
                  style={{
                    ...(document.documentElement.dir === "rtl"
                      ? {
                        borderTopLeftRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                        borderBottomLeftRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                      }
                      : {
                        borderTopRightRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                        borderBottomRightRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                      }),
                  }}>
                  <button
                    type="button"
                    className="flex items-center justify-center h-1/2 w-6 focus:outline-none"
                    onClick={() => {
                      const currentValue = parseFloat(value as string) || 0;
                      const newValue =
                        currentValue + (step ? parseFloat(step.toString()) : 1);
                      if (
                        max === undefined ||
                        newValue <= parseFloat(max.toString())
                      ) {
                        const event = {
                          isCustomNumberChangerEvent: true,
                          target: { value: newValue.toString() },
                          mode: "up",
                        } as any;
                        handleChange(event);
                      }
                    }}
                    style={{
                      ...(document.documentElement.dir === "rtl"
                        ? {
                          borderTopLeftRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }
                        : {
                          borderTopRightRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }),
                    }}>
                    <ChevronUp className="h-3 w-3 text-black hover:text-gray-500 transition-transform duration-200" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center h-1/2 w-6 focus:outline-none"
                    onClick={() => {
                      const currentValue = parseFloat(value as string) || 0;
                      const newValue =
                        currentValue - (step ? parseFloat(step.toString()) : 1);
                      if (
                        min === undefined ||
                        newValue >= parseFloat(min.toString())
                      ) {
                        const event = {
                          isCustomNumberChangerEvent: true,
                          target: { value: newValue.toString() },
                          mode: "down",
                        } as any;
                        handleChange(event);
                      }
                    }}
                    style={{
                      ...(document.documentElement.dir === "rtl"
                        ? {
                          borderBottomLeftRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }
                        : {
                          borderBottomRightRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }),
                    }}>
                    <ChevronDown className="h-3 w-3 text-black hover:text-gray-500 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </>
          ),
          inputRef: ref, // Add the ref attribute here
        },
        fullWidth: true,
        variant: _variant,
        inputProps: {
          maxLength,
          min,
          max,
          step,
          accept,
          "data-skip": skip,
          "data-jump-to": jumpTo,
          "data-jump-target": jumpTarget,
          style: { appearance: "none" },
          ...(type === "number" && {
            inputMode: "decimal",
            pattern: "[0-9]*\\.?[0-9]*",
          }),
        },
        sx: {
          ...sizeStyles.mui,
          "& .MuiInputBase-input.Mui-disabled": {
            "-webkit-text-fill-color": "#606060 !important",
            color: "#606060 !important",
          },
          "& .Mui-disabled input": {
            "-webkit-text-fill-color": "#606060 !important",
            color: "#606060 !important",
          },
          "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
          {
            appearance: "none",
          },
          "& input[type=number]": {
            appearance: "textfield",
          },
        },
        onKeyDown: (e) =>
          disableEnterNavigation == true
            ? onKeyDown != undefined
              ? onKeyDown(e)
              : undefined
            : handleKeyDown(e),
        onKeyUp: onKeyUp,
      };
      return (
        <div
          className={`${className}`}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${inputBoxState?.marginTop ?? 0}px`,
          }}>
          <TextField {...muiProps} />
          {validation != undefined &&
            validation != null &&
            validation != "" && (
              <ERPElementValidationMessage validation={validation} />
            )}
          {info != undefined && info != null && info != "" && (
            <Typography className="text-[#374151] text-xs font-medium mt-1">
              {infoWithLineBreaks(info)}
            </Typography>
          )}
        </div>
      );
    }

    const { height, fontSize, fontWeight, color } = sizeStyles.regular;
    if (_useMUI == undefined || _useMUI == false) {
      return (
        <div
          className={`${className} ${labelDirection === "vertical"
            ? "flex flex-col space-y-1"
            : "flex items-center space-x-2"
            }`}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${inputBoxState?.marginTop ?? 0}px`,
          }}>
          
            <div className="flex justify-between">
            {!noLabel && (
              <label
                className={`capitalize text-left rtl:text-right dark:!text-dark-label ${appState?.mode == "dark"
                  ? "#000"
                  : `rgb(${inputBoxState?.labelColor})`
                  } ${labelClassName}`}
                style={{
                  fontSize: _customSize
                    ? _customSize === "sm"
                      ? "12px"
                      : _customSize === "md"
                        ? "13px"
                        : _customSize === "lg"
                          ? "14px"
                          : `${inputBoxState?.labelFontSize}px`
                    : "14px",
                  color:
                    appState?.mode === "dark"
                      ? "rgb(225,224,224)"
                      : inputBoxState?.labelColor
                        ? `rgb(${inputBoxState?.labelColor})`
                        : "rgb(84,84,84)",
                  transform:
                    _customSize === "customize"
                      ? `translate(${inputBoxState?.adjustA ?? 2}px, ${inputBoxState?.adjustB ?? 5
                      }px) scale(1)`
                      : `translate( 1px,3px) scale(1)`,
                }} >
                <span style={{ whiteSpace: "nowrap" }}>
                  {`${iLabel}${labelDirection === "horizontal" ? "" : ""}`}
                  {required && !noLabel && <span className="dark:text-red text-red">*</span>}
                  {labelDirection === "horizontal" && ":"}
                </span>
              </label>
              )}
              <label
         
                className={`capitalize block text-right rtl:text-left ${appState?.mode == "dark" ? "form-label" : ""
                  }`}
                style={{
                  fontSize: _customSize
                    ? _customSize === "sm"
                      ? "12px"
                      : _customSize === "md"
                        ? "13px"
                        : _customSize === "lg"
                          ? "14px"
                          : `${inputBoxState?.labelFontSize}px`
                    : "14px",
             
               
                     
                }}  >
                {labelInfo &&
                  cloneElement(
                    labelInfo,
                    labelInfoProps ? { labelInfoProps: labelInfoProps } : {}
                  )}
              </label>
            </div>
          

          <div className={`flex ${labelDirection === "vertical" ? "" : "basis-2/3"}`} >
            {prefix && (
              <div
                onClick={onClickPrefix}
                className={`${onClickPrefix && "cursor-pointer"
                  } flex items-center justify-center text-slate-400 px-2 rounded-l-md font-medium border-r-0 border-gray-300 border dark:!bg-dark-bg-card bg-slate-100 ${disabled ? "border-dashed" : ""
                  }`}
                style={{ height, fontSize, fontWeight, color, borderColor: borderStyles, backgroundColor: bgColor, }}>
                {prefix}
              </div>
            )}
            <div className="relative flex-1">
              <input
                {...commonProps}
                {...numberInputProps}
                placeholder={iPlaceholder}
                ref={ref}
                autoComplete="new-password"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={(e) => {
                  e.target.select();
                  setIsFocused(true);
                  // e.target.setAttribute("autocomplete", "off");
                  // e.target.setAttribute("readonly", "true");
                  // setTimeout(() => e.target.removeAttribute("readonly"), 100);
                  onFocus && onFocus(e);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  onBlur && onBlur(e);
                }}
                style={{
                  height:!inputClassName?height:"",
                  fontSize,
                  fontWeight: boldInput || inputBoxState?.bold ? 700 : fontWeight,
                  color: disabled ? "#606060 !important" : color,
                  borderColor:!inputClassName?borderStyles:"",
                  outline: "none",
                  transition: "border-color 0.2s ease-in-out",
                  borderTopLeftRadius: `${!prefix ? inputBoxState?.borderRadius : 0
                    }px`,
                  borderBottomLeftRadius: `${!prefix ? inputBoxState?.borderRadius : 0
                    }px`,
                  borderTopRightRadius: `${!suffix && type !== "number"
                    ? inputBoxState?.borderRadius
                    : 0
                    }px`,
                  borderBottomRightRadius: `${!suffix && type !== "number"
                    ? inputBoxState?.borderRadius
                    : 0
                    }px`,
                  backgroundColor: bgColor,
                  textAlign: type === "number" ? "right" : "left",
                  paddingRight:
                    type === "number" && showCustomNumberChanger == true
                      ? "2rem"
                      : undefined,
                  ...(!prefix &&
                    !suffix && {
                    borderRadius: `${inputBoxState?.borderRadius ?? 5}px`,
                  }),
                }}
                className={`form-control !${inputClassName} dark:!bg-dark-bg-card placeholder:capitalize [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${disabled ? "border-dashed !#606060" : ""
                  }`} 
                onWheel={(e) => {
                  if (type === "number") {
                    e.preventDefault();
                  }
                }}
                maxLength={maxLength}
                min={min}
                max={max}
                step={step}
                accept={accept}
                onKeyDown={(e) => {
                  const isEnter =
                    e.key === "NumpadEnter" || e.key === "Enter" || e.keyCode === 13 || e.which === 13;
                
                  if (disableEnterNavigation === true) {
                    if (isEnter && onEnterKeyDown) {
                      onEnterKeyDown(e);
                    }
                    if (onKeyDown) {
                      onKeyDown(e);
                    }
                    
                  } else {
                    handleKeyDown(e);
                  }
                }}
                onKeyUp={onKeyUp}
                data-skip={skip}
                data-jump-to={jumpTo}
                data-jump-target={jumpTarget}
              />

              {showCustomNumberChanger && (
                <div
                  className="absolute right-0 top-0 h-[91%] flex flex-col border-l dark:!border-dark-border  border-gray-300 m-[2px]"
                  style={{
                    // background:
                    //   initial?.value !== undefined && initial?.value !== null && initial?.value !== ""
                    //     ? `rgb(${inputBoxState?.selectColor})`
                    //     : "#f9f9f9",
                    ...(document.documentElement.dir === "rtl"
                      ? {
                        borderTopLeftRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                        borderBottomLeftRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                      }
                      : {
                        borderTopRightRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                        borderBottomRightRadius: `${inputBoxState?.borderRadius ?? 5
                          }px`,
                      }),
                  }}>
                  <button
                    type="button"
                    className="flex items-center justify-center h-1/2 w-6 dark:bg-dark-combo-dd dark:hover:bg-dark-hover-bg bg-[#f9f9f9] hover:bg-gray-100 focus:outline-none"
                    onClick={() => {
                      const currentValue = parseFloat(value as string) || 0;
                      const newValue =
                        currentValue + (step ? parseFloat(step.toString()) : 1);
                      if (
                        max === undefined ||
                        newValue <= parseFloat(max.toString())
                      ) {
                        const event = {
                          isCustomNumberChangerEvent: true,
                          target: { value: newValue.toString() },
                          mode: "up",
                        } as any;
                        handleChange(event);
                      }
                    }}
                    style={{
                      ...(document.documentElement.dir === "rtl"
                        ? {
                          borderTopLeftRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }
                        : {
                          borderTopRightRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }),
                    }}>
                    <ChevronUp className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-transform duration-200" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center h-1/2 w-6 dark:bg-dark-combo-dd dark:hover:bg-dark-hover-bg bg-[#f9f9f9] hover:bg-gray-100 border-t dark:!border-dark-border border-gray-300 focus:outline-none"
                    onClick={() => {
                      const currentValue = parseFloat(value as string) || 0;
                      const newValue =
                        currentValue - (step ? parseFloat(step.toString()) : 1);
                      if (
                        min === undefined ||
                        newValue >= parseFloat(min.toString())
                      ) {
                        const event = {
                          isCustomNumberChangerEvent: true,
                          target: { value: newValue.toString() },
                          mode: "down",
                        } as any;
                        handleChange(event);
                      }
                    }}
                    style={{
                      ...(document.documentElement.dir === "rtl"
                        ? {
                          borderBottomLeftRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }
                        : {
                          borderBottomRightRadius: `${inputBoxState?.borderRadius ?? 5
                            }px`,
                        }),
                    }}>
                    <ChevronDown className="h-4 w-4  text-gray-400 hover:text-gray-500 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </div>
            {suffix && (
              <div
                onClick={onClickSuffix}
                className={`border border-gray-400 ${onClickSuffix && "cursor-pointer"
                  } flex items-center justify-center text-slate-400 p-2 rounded-r-md border-l-0 border bg-slate-100 ${disabled ? "border-dashed" : ""
                  }`}
                style={{
                  height,
                  fontSize,
                  borderColor: borderStyles,
                  color,
                  backgroundColor: isFocused
                    ? `rgb(${inputBoxState?.focusBgColor})`
                    : `rgb(${inputBoxState?.defaultBgColor})`,
                }}>
                {suffix}
              </div>
            )}
          </div>
          {validation != undefined &&
            validation != null &&
            validation != "" && (
              <ERPElementValidationMessage validation={validation} />
            )}
          {info != undefined && info != null && info != "" && (
            <div className="text-[#374151] text-xs font-medium">
              {infoWithLineBreaks(info)}
            </div>
          )}
        </div>
      );
    }
  }
);

export default memo(ERPInput);