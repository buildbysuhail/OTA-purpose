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

// Mocking the ERPElementValidationMessage component
const ERPElementValidationMessage = ({ validation, }: { validation?: string; }) => validation != undefined && validation != null && validation != "" ? (<div className="text-red text-xs">{validation}</div>) : (null);
type ERPInputBaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "color">;
interface ERPInputProps extends ERPInputBaseProps {
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
  info?: string;
  type?: string;
  autocomplete?: string;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  noLabel?: boolean;
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
      data,
      type = "text",
      customSize,
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

    useEffect(() => {
      if (customSize == undefined || customSize == null) {
        setCustomSize(appState?.inputBox?.inputSize);
      }
    }, [appState?.inputBox?.inputSize]);

    const [borderStyles, setBorderStyles] = useState<string>(appState.mode == 'dark' ? (isFocused == true || isHovered == true ? '#ffffff' : '#ffffff1a') : `${isFocused || isHovered ? `rgb(${appState?.inputBox?.borderFocus})` : `rgb(${appState?.inputBox?.borderColor})`} `);
    useEffect(() => {
      let style;
      if (appState?.mode === 'dark') {
        if (isFocused || isHovered) {
          style = '#ffffff';
          console.log('Dark mode, focused or hovered: ', style);
        } else {
          style = '#ffffff1a';
          console.log('Dark mode, not focused or hovered: ', style);
        }
      } else {
        if (isFocused || isHovered) {
          style = `rgb(${appState?.inputBox?.borderFocus})`;
          console.log('Light mode, focused or hovered: ', style);
        } else {
          style = `rgb(${appState?.inputBox?.borderColor})`;
          console.log('Light mode, not focused or hovered: ', style);
        }
      }
      setBorderStyles(style);
    }, [appState.mode, isFocused, isHovered, appState.inputBox?.borderColor, appState.inputBox?.borderFocus])

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
        },
        sx: sizeStyles.mui,
        onKeyDown: handleKeyDown,
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
                style={{ height, fontSize, fontWeight, color, borderColor: borderStyles }}>
                {prefix}
              </div>
            )}
            <div className="flex-1">
              <input
                {...commonProps}
                placeholder={iPlaceholder}
                ref={ref}
                autoComplete={autocomplete}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={(e) => {
                  setIsFocused(true);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                }}
                style={
                  {
                    height,
                    fontSize,
                    fontWeight,
                    color,
                    borderColor: borderStyles,
                    "--tw-ring-shadow": "none",
                    outline: "none",
                    transition: "border-color 0.2s ease-in-out",
                    borderTopLeftRadius: `${!prefix ? appState?.inputBox?.borderRadius : 0
                      }px`,
                    borderBottomLeftRadius: `${!prefix ? appState?.inputBox?.borderRadius : 0
                      }px`,
                    borderTopRightRadius: `${!suffix ? appState?.inputBox?.borderRadius : 0
                      }px`,
                    borderBottomRightRadius: `${!suffix ? appState?.inputBox?.borderRadius : 0
                      }px`,
                    ...(!prefix &&
                      !suffix && {
                      borderRadius: `${appState?.inputBox?.borderRadius ?? 5
                        }px`,
                    }),
                  } as React.CSSProperties
                }
                className={`form-control ${inputClassName}  placeholder:capitalize`}
                onWheel={(e: any) => { type === "number" && e?.target?.blur(); }}
                maxLength={maxLength}
                min={min}
                max={max}
                pattern={pattern}
                step={step}
                accept={accept}
                onKeyDown={handleNavigation}
                data-skip={skip}
                data-jump-to={jumpTo}
                data-jump-target={jumpTarget}
              />
            </div>
            {suffix && (
              <div
                onClick={onClickSuffix}
                className={`border border-gray-400 ${onClickSuffix && "cursor-pointer"
                  } flex items-center justify-center text-slate-400 p-2 rounded-r-md border-l-0 border bg-slate-100`}
                style={{ height, fontSize, borderColor: borderStyles, color, }}>
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