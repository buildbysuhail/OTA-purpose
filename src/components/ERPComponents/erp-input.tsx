import React, {
  forwardRef,
  memo,
  KeyboardEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  TextField,
  InputAdornment,
  TextFieldProps,
  Theme,
  SxProps,
  Typography,
} from "@mui/material";
import {
  setFgAccordingToBgPrimary,
  setNestedValue,
} from "../../utilities/Utils";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { handleNavigation } from "../../utilities/shortKeys";
import { Background } from "devextreme-react/cjs/range-selector";
import { ChevronDown, ChevronUp } from "lucide-react";

// Mocking the ERPElementValidationMessage component
const ERPElementValidationMessage = ({ validation, }: { validation?: string; }) => validation != undefined && validation != null && validation != "" ? (<div className="text-red text-xs">{validation}</div>) : (null);
type ERPInputBaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "color">;


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
  onKeyDown?: (e: any) => void;
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
  showCustomNumberChanger?: false | true ;
  labelDirection?: "horizontal" | "vertical";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onClickPrefix?: () => void;
  onClickSuffix?: () => void;
  accept?: string;
  validation?: string;
  autoFocus?: boolean;
  customSize?: "sm" | "md" | "lg" | "customize";
  useMUI?: boolean;
  disableEnterNavigation?: boolean;
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
  variant?: "filled" | "outlined" | "standard" | "normal";
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
      showCustomNumberChanger,
      labelDirection = "vertical",
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
      ...props
    }: ERPInputProps,
    ref
  ) => {
    const appState = useAppSelector(
      (state: RootState) => state.AppState?.appState
    );
    const iLabel = label || id?.replaceAll("_", " ");
    const iPlaceholder = placeholder || label;
    const [_customSize, setCustomSize] = useState(customSize ? customSize : appState?.inputBox?.inputSize);
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
      if (type == "number" && ds != undefined && ds >= 0 && sd < 0) {
        return false;
      }
      onChangeData &&
        data &&
        onChangeData(setNestedValue(data, id, e.target?.value));
      onChange && onChange(e);
    };
    

    // useEffect(() => {

    //   const handleWheel = (event: WheelEvent) => {
    //     if (type === 'number') {
    //       event.preventDefault();
    //       const delta = event.deltaY < 0 ? 1 : -1;
    //       const currentValue = parseFloat(value as string) || 0;
    //       const newValue = currentValue + delta * (step ? parseFloat(step.toString()) : 1);

    //       if ((min === undefined || newValue >= parseFloat(min.toString())) &&
    //         (max === undefined || newValue <= parseFloat(max.toString()))) {
    //         const changeEvent = {
    //           target: { value: newValue.toString() }
    //         } as React.ChangeEvent<HTMLInputElement>;
    //         handleChange(changeEvent);
    //       }
    //       if (Voucherno) {
    //       console.log(event.deltaY < 0 ? 'Mouse Scroll Up' : 'Mouse Scroll Down');
    //       }
    //     }
    //   };

    //   const inputElement = document.getElementById(id);
    //   if (inputElement) {
    //     inputElement.addEventListener('wheel', handleWheel, { passive: false });
    //   }

    //   return () => {
    //     if (inputElement) {
    //       inputElement.removeEventListener('wheel', handleWheel);
    //     }
    //   };
    // }, [id, value, min, max, step, handleChange]);

    useEffect(() => {
      if (customSize == undefined || customSize == null) {
        setCustomSize(appState?.inputBox?.inputSize);
      }
    }, [appState?.inputBox?.inputSize]);

    const [borderStyles, setBorderStyles] = useState<string>(appState.mode == 'dark' ? (isFocused == true || isHovered == true ? '#ffffff' : '#ffffff1a') : `${isFocused || isHovered ? `rgb(${appState?.inputBox?.borderFocus})` : `rgb(${appState?.inputBox?.borderColor})`} `);
    const [bgColor, setBgColor] = useState<string>(appState.mode == 'dark' ? (isFocused == true ? '#ffffff' : '#ffffff1a') : `${isFocused ? `rgb(${appState?.inputBox?.focusBgColor})` : ``} `)
    useEffect(() => {
      let border, bgCol;
      if (appState?.mode === 'dark') {
        border = isFocused || isHovered ? '#ffffff' : '#ffffff1a';
        bgCol = isFocused ? '#ffffff' : '#ffffff1a';
      } else {
        border = isFocused || isHovered
          ? `rgb(${appState?.inputBox?.borderFocus})`
          : `rgb(${appState?.inputBox?.borderColor})`;
        bgCol = isFocused
          ? `rgb(${appState?.inputBox?.focusBgColor})`
          : ``;
      }
      setBorderStyles(border);
      setBgColor(bgCol);
    }, [appState.mode, isFocused, isHovered, appState.inputBox?.borderColor, appState.inputBox?.borderFocus, appState.inputBox?.focusBgColor, appState.inputBox?.defaultBgColor]);

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
      if (
        appState?.inputBox?.inputStyle !== "normal" &&
        (variant === undefined || variant === null)
      ) {
        set_variant(
          appState?.inputBox?.inputStyle as "filled" | "outlined" | "standard"
        );
      } else if (appState?.inputBox?.inputStyle === "normal") {
        set_variant(undefined);
      } else {
        set_variant(variant as "filled" | "outlined" | "standard");
      }
    }, [appState?.inputBox?.inputStyle, variant]);

    function infoWithLineBreaks(text?: string) {
      if (!text) return null;
      return text.includes('/n')
        ? text.split('/n').map((line, index) => (
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
        borderRadius: `${appState.inputBox?.borderRadius ?? 5}px`,
        color: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox?.fontColor})`,
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
            } as SxProps<Theme>,
            regular: {
              height: "2rem",
              fontSize: "12px",
              color: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox?.fontColor})`
              // padding: "0.25rem 0.75rem"
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
            } as SxProps<Theme>,
            regular: {
              height: "2.5rem",
              fontSize: "14px",
              color: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox?.fontColor})`
              // padding: "0.5rem 1rem"
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
            } as SxProps<Theme>,
            regular: {
              height: "3rem",
              fontSize: "16px",
              color: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox?.fontColor})`
              // label: "10px",
              // padding: "0.75rem 1.25rem"
            },
          };
        case "customize":
          return {
            mui: {
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
            } as SxProps<Theme>,
            regular: {
              height: `${appState?.inputBox?.inputHeight ?? 2.5}rem`,
              fontSize: `${appState?.inputBox?.fontSize ?? 15}px`,
              fontWeight: appState?.inputBox?.fontWeight,
              color: appState?.mode == 'dark' ? '#ffffff' : `rgb(${appState?.inputBox?.fontColor})`
            },
          };
        default:
          return styles;
      }
    };
    const sizeStyles = getSizeStyles();
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    //   const ds = min != undefined ? parseFloat(min.toString()) : undefined;
    //   const sd = parseFloat(e.target?.value);
    //   if (type == "number" && ds != undefined && ds >= 0 && sd < 0) {
    //     return false;
    //   }
    //   onChangeData &&
    //     data &&
    //     onChangeData(setNestedValue(data, id, e.target?.value));
    //   onChange && onChange(e);
    // };
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
      ...props,
    };
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      handleNavigation(e);
    };

    if (_useMUI == true) {
      const muiProps: TextFieldProps = {
        ...commonProps,
        label: !noLabel ? iLabel : undefined,
        // InputProps: {
        //   startAdornment: prefix ? (
        //     <InputAdornment position="start" onClick={onClickPrefix}>
        //       {prefix}
        //     </InputAdornment>
        //   ) : undefined,
        //   endAdornment: suffix ? (
        //     <InputAdornment position="end" onClick={onClickSuffix}>
        //       {suffix}
        //     </InputAdornment>
        //   ) : undefined,
        // },
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
              {/* {!noLabel && ( */}
              {/* {type === "number" && ( */}
              {showCustomNumberChanger && (
                <div
                  className="absolute right-0 top-0 h-full flex flex-col  "
                  style={{
                    // background:
                    //   initial?.value !== undefined &&
                    //   initial?.value !== null &&
                    //   initial?.value !== ""
                    //     ? `rgb(${appState?.inputBox?.selectColor})`
                    //     : "#f9f9f9",
                    ...(document.documentElement.dir === "rtl"
                      ? {
                          borderTopLeftRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                          borderBottomLeftRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                        }
                      : {
                          borderTopRightRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                          borderBottomRightRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                        }),
                  }}
                >
                  <button
                    type="button"
                    className="flex items-center justify-center h-1/2 w-6  focus:outline-none"
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
                        } as any;
                        handleChange(event);
                        console.log("Increment clicked, new value:", newValue);
                      }
                    }}
                    style={{
                      // background: `rgb(${appState?.inputBox?.selectColor})`,
                      ...(document.documentElement.dir === "rtl"
                        ? {
                            borderTopLeftRadius: `${
                              appState?.inputBox?.borderRadius ?? 5
                            }px`,
                          }
                        : {
                            borderTopRightRadius: `${
                              appState?.inputBox?.borderRadius ?? 5
                            }px`,
                          }),
                    }}
                  >
                    <ChevronUp className="h-3 w-3 text-black hover:text-gray-500 transition-transform duration-200" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center h-1/2 w-6   focus:outline-none"
                    onClick={() => {
                      const currentValue = parseFloat(value as string) || 0;
                      const newValue =
                        currentValue - (step ? parseFloat(step.toString()) : 1);
                      if (
                        min === undefined ||
                        newValue >= parseFloat(min.toString())
                      ) {
                        const event = {
                          target: { value: newValue.toString() },
                          isCustomNumberChangerEvent: true,
                        } as any;
                        handleChange(event);
                        console.log("Decrement clicked, new value:", newValue);
                      }
                    }}
                    style={{
                      // background: `rgb(${appState?.inputBox?.selectColor})`,
                      ...(document.documentElement.dir === "rtl"
                        ? {
                            borderBottomLeftRadius: `${
                              appState?.inputBox?.borderRadius ?? 5
                            }px`,
                          }
                        : {
                            borderBottomRightRadius: `${
                              appState?.inputBox?.borderRadius ?? 5
                            }px`,
                          }),
                    }}
                  >
                    <ChevronDown className="h-3 w-3 text-black hover:text-gray-500 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </>
          ),
        },
        fullWidth: true,
        variant: _variant,
        inputProps: {
          maxLength,
          min,
          max,
          pattern,
          step,
          accept,
          "data-skip": skip,
          "data-jump-to": jumpTo,
          "data-jump-target": jumpTarget,
          style: { appearance: "none" },
        },
        // sx: sizeStyles.mui,
        sx: {
          ...sizeStyles.mui,
          "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
            appearance: "none",
          },
          "& input[type=number]": {
            appearance: "textfield", // For cross-browser consistency
          },
        },
        onKeyDown:disableEnterNavigation == true ? undefined : onKeyDown != undefined ? onKeyDown: handleKeyDown,
        onKeyUp: onKeyUp,
      };
      return (
        <div className={`${className}`}
          style={{
            marginBottom: `${appState?.inputBox?.marginBottom ?? 0}px`,
            marginTop: `${appState?.inputBox?.marginTop ?? 0}px`
          }}
        >
          <TextField {...muiProps}
          // className= {`${appState.mode == 'dark' ? "form-control" : ``}`} 
          />
          {validation != undefined && validation != null && validation != "" && (
            <ERPElementValidationMessage validation={validation} />
          )}
          {info != undefined && info != null && info != "" && (<Typography
            className="text-[#374151] text-xs font-medium mt-1">
            {infoWithLineBreaks(info)}
          </Typography>)}
        </div>
      );
    }
    const { height, fontSize, fontWeight, color } = sizeStyles.regular;
    if (_useMUI == undefined || _useMUI == false) {
      return (
        <div className={`${className} ${labelDirection === "vertical" ? "flex flex-col space-y-1" : "flex items-center space-x-2"}`}
          style={{
            marginBottom: `${appState?.inputBox?.marginBottom ?? 0}px`,
            marginTop: `${appState?.inputBox?.marginTop ?? 0}px`,
          }}>
          {!noLabel && (
            <label
              className={`capitalize  text-left rtl:text-right ${appState?.mode == 'dark' ? "#000" : `rgb(${appState?.inputBox?.labelColor})`} ${labelClassName}
              ${labelDirection === "vertical" ? "" : ""}`}
              style={{
                fontSize: _customSize
                  ? _customSize === "sm"
                    ? "12px"
                    : _customSize === "md"
                      ? "14px"
                      : _customSize === "lg"
                        ? "16px"
                        : `${appState?.inputBox?.labelFontSize}px`
                  : `14px`,
                color: appState?.mode === 'dark' ? 'rgb(225,224,224)' :
                  (appState?.inputBox?.labelColor ? `rgb(${appState?.inputBox?.labelColor})` : 'rgb(84,84,84)'),
                transform: _customSize === "customize" ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 10}px) scale(1)` : ``,
              }}
            >
              {`${iLabel}  ${labelDirection === "horizontal" ? ":" : ""}`}
              {required && !noLabel && "*"}
            </label>
          )}

          <div className={`flex  ${labelDirection === "vertical" ? "" : "basis-2/3"}}`}>
            {prefix && (
              <div
                onClick={onClickPrefix}
                className={`${onClickPrefix && "cursor-pointer"
                  } flex items-center justify-center text-slate-400 px-2 rounded-l-md font-medium border-r-0 border-gray-300 border bg-slate-100`}
                style={{ height, fontSize, fontWeight, color, borderColor: borderStyles, backgroundColor: bgColor }}>
                {prefix}
              </div>
            )}
            <div className="relative flex-1">
            <input
              {...commonProps}
              placeholder={iPlaceholder}
              ref={ref}
              autoComplete={autocomplete}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus && onFocus(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur && onBlur(e);
              }}
              style={{
                height,
                fontSize,
                fontWeight,
                color,
                borderColor: borderStyles,
                // "--tw-ring-shadow": "none",
                outline: "none",
                transition: "border-color 0.2s ease-in-out",
                borderTopLeftRadius: `${!prefix ? appState?.inputBox?.borderRadius : 0}px`,
                borderBottomLeftRadius: `${!prefix ? appState?.inputBox?.borderRadius : 0}px`,
                borderTopRightRadius: `${!suffix && type !== 'number' ? appState?.inputBox?.borderRadius : 0}px`,
                borderBottomRightRadius: `${!suffix && type !== 'number' ? appState?.inputBox?.borderRadius : 0}px`,
                backgroundColor: bgColor,
                paddingRight: type === 'number' ? '2rem' : undefined,
                ...(!prefix && !suffix && {
                  borderRadius: `${appState?.inputBox?.borderRadius ?? 5}px`,
                }),
              }}
              className={`form-control ${inputClassName} placeholder:capitalize [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              // onWheel={(e) => { type === "number" && (e.target as HTMLInputElement)?.blur(); }}
              onWheel={(e) => { 
                if (type === "number") {
                  e.preventDefault();
                }
              }}
              maxLength={maxLength}
              min={min}
              max={max}
              pattern={pattern}
              step={step}
              accept={accept}
              onKeyDown={disableEnterNavigation == true ? undefined :onKeyDown != undefined ? onKeyDown : handleNavigation}
              onKeyUp={onKeyUp}
              data-skip={skip}
              data-jump-to={jumpTo}
              data-jump-target={jumpTarget}
            />
           

          {showCustomNumberChanger && (
              // <div className="absolute right-0 top-0 h-full flex flex-col border-l border-gray-300">
              <div
              // className={`absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center m-[2px] pr-1`}
              className={`absolute right-0 top-0 h-[86%] flex flex-col border-l border-gray-300 m-[2px]`}
              style={{
                background:
                  initial?.value !== undefined &&
                  initial?.value !== null &&
                  initial?.value !== ""
                    ? `rgb(${appState?.inputBox?.selectColor})`
                    : "#f9f9f9",
                ...(document.documentElement.dir === "rtl"
                  ? {
                      borderTopLeftRadius: `${
                        appState?.inputBox?.borderRadius ?? 5
                      }px`,
                      borderBottomLeftRadius: `${
                        appState?.inputBox?.borderRadius ?? 5
                      }px`,
                    }
                  : {
                      borderTopRightRadius: `${
                        appState?.inputBox?.borderRadius ?? 5
                      }px`,
                      borderBottomRightRadius: `${
                        appState?.inputBox?.borderRadius ?? 5
                      }px`,
                    }),
              }}
            >
                <button
                  type="button"
                  className="flex items-center justify-center h-1/2 w-6 hover:bg-gray-100 focus:outline-none  "
                  onClick={() => {
                    const currentValue = parseFloat(value as string) || 0;
                    const newValue = currentValue + (step ? parseFloat(step.toString()) : 1);
                    if (max === undefined || newValue <= parseFloat(max.toString())) {
                      const event = {
                        isCustomNumberChangerEvent: true,
                        target: { value: newValue.toString() }
                      } as any;
                      handleChange(event);
                      console.log('Increment clicked, new value:', newValue); // Add this line
                    }
                  }}
                  style={{
                    background:
                     `rgb(${appState?.inputBox?.selectColor})`,
                    ...(document.documentElement.dir === "rtl"
                      ? {
                          borderTopLeftRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                          // borderBottomLeftRadius: `${
                          //   appState?.inputBox?.borderRadius ?? 5
                          // }px`,
                        }
                      : {
                          borderTopRightRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                          // borderBottomRightRadius: `${
                          //   appState?.inputBox?.borderRadius ?? 5
                          // }px`,
                        }),
                  }}
                >
                  <ChevronUp className="h-3 w-3  text-gray-400 hover:text-gray-500 transition-transform duration-200" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center h-1/2 w-6 hover:bg-gray-100 border-t border-gray-300 focus:outline-none  "
                  onClick={() => {
                    const currentValue = parseFloat(value as string) || 0;
                    const newValue = currentValue - (step ? parseFloat(step.toString()) : 1);
                    if (min === undefined || newValue >= parseFloat(min.toString())) {
                      const event = {
                        isCustomNumberChangerEvent: true,
                        target: { value: newValue.toString() }
                      } as any;
                      handleChange(event);
                      console.log('Decrement clicked, new value:', newValue); // Add this line
                    }
                  }}
                  style={{
                    background:
                     `rgb(${appState?.inputBox?.selectColor})`,
                    ...(document.documentElement.dir === "rtl"
                      ? {
                          // borderTopLeftRadius: `${
                          //   appState?.inputBox?.borderRadius ?? 5
                          // }px`,
                          borderBottomLeftRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                        }
                      : {
                          // borderTopRightRadius: `${
                          //   appState?.inputBox?.borderRadius ?? 5
                          // }px`,
                          borderBottomRightRadius: `${
                            appState?.inputBox?.borderRadius ?? 5
                          }px`,
                        }),
                  }}
                >
                  <ChevronDown className="h-3 w-3  text-gray-400 hover:text-gray-500 transition-transform duration-200" />
                </button>
              </div>
            )}
            </div>
            {suffix && (
              <div
                onClick={onClickSuffix}
                className={`border border-gray-400 ${onClickSuffix && "cursor-pointer"
                  } flex items-center justify-center text-slate-400 p-2 rounded-r-md border-l-0 border bg-slate-100`}
                style={{ height, fontSize, borderColor: borderStyles, color,  backgroundColor: isFocused ? appState?.inputBox?.focusBgColor : appState?.inputBox?.defaultBgColor, }}>
                {suffix}
              </div>
            )}
          </div>
          {validation != undefined && validation != null && validation != "" && (
            <ERPElementValidationMessage validation={validation} />
          )}
          {info != undefined && info != null && info != "" && (
            <div className="text-[#374151] text-xs font-medium ">
              {infoWithLineBreaks(info)}
            </div>)}
        </div>
      );
    }
  }
);
export default memo(ERPInput);