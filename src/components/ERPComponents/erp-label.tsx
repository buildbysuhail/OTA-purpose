"use client"

import React, { forwardRef, memo, useState, useEffect, cloneElement } from "react"
import { TextField, InputAdornment, type TextFieldProps, type Theme, type SxProps, Typography } from "@mui/material"
import { useAppSelector } from "../../utilities/hooks/useAppDispatch"
import type { RootState } from "../../redux/store"
import type { inputBox } from "../../redux/slices/app/types"

interface ERPLabelProps {
  id: string
  value?: any
  label?: string
  boxed?: boolean // Controls whether to show as boxed label or simple text
  labelClassName?: string
  className?: string
  inputClassName?: string
  noLabel?: boolean
  labelDirection?: "horizontal" | "vertical"
  labelInfo?: any
  labelInfoProps?: any
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  customSize?: "sm" | "md" | "lg" | "customize"
  useMUI?: boolean
  variant?: "filled" | "outlined" | "standard" | "normal"
  localInputBox?: inputBox
  boldValue?: boolean
  textAlign?: "left" | "right" | "center"
  info?: string
  type?: string // For number formatting
}

const ERPLabel = forwardRef<HTMLDivElement, ERPLabelProps>(
  (
    {
      id,
      value,
      type = "text",
      customSize,
      label,
      labelClassName,
      className,
      inputClassName,
      noLabel,
      labelDirection = "vertical",
      labelInfo,
      labelInfoProps,
      prefix,
      suffix,
      useMUI,
      variant,
      localInputBox,
      boldValue = false,
      boxed = false,
      textAlign = "left",
      info,
      ...props
    }: ERPLabelProps,
    ref,
  ) => {
    const appState = useAppSelector((state: RootState) => state.AppState?.appState)

    const iLabel = label || id?.replaceAll("_", " ")
    const inputBoxState = React.useMemo(() => {
      return localInputBox || appState?.inputBox
    }, [localInputBox, appState?.inputBox])

    const [_customSize, setCustomSize] = useState(customSize ? customSize : inputBoxState?.inputSize)
    const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI)
    const [_variant, set_variant] = useState<"filled" | "outlined" | "standard" | undefined>(
      variant === "normal" ? undefined : variant,
    )
    const [isHovered, setIsHovered] = useState(false)
    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    useEffect(() => {
      if (customSize == undefined || customSize == null) {
        setCustomSize(inputBoxState?.inputSize)
      }
    }, [inputBoxState?.inputSize])

    const [borderStyles, setBorderStyles] = useState<string>(
      appState.mode == "dark"
        ? isHovered == true
          ? "#ffffff"
          : "#ffffff1a"
        : `${isHovered ? `rgb(${inputBoxState?.borderFocus})` : `rgb(${inputBoxState?.borderColor})`} `,
    )

    const [bgColor, setBgColor] = useState<string>(
      appState.mode == "dark"
        ? "#ffffff1a"
        : inputBoxState?.inputBgColor
          ? `rgb(${inputBoxState?.inputBgColor})`
          : "#f9f9f9",
    )

    useEffect(() => {
      let border, bgCol
      if (appState?.mode === "dark") {
        border = isHovered ? "#ffffff" : "#ffffff1a"
        bgCol = "#ffffff1a"
      } else {
        border = isHovered ? `rgb(${inputBoxState?.borderFocus})` : `rgb(${inputBoxState?.borderColor})`
        bgCol = inputBoxState?.inputBgColor ? `rgb(${inputBoxState?.inputBgColor})` : "#f9f9f9"
      }
      setBorderStyles(border)
      setBgColor(bgCol)
    }, [appState.mode, isHovered, inputBoxState])

    useEffect(() => {
      if (inputBoxState?.inputStyle !== "normal" && useMUI === undefined) {
        set_useMUI(true)
      } else if (inputBoxState?.inputStyle === "normal" && useMUI === undefined) {
        set_useMUI(false)
      }
    }, [inputBoxState?.inputStyle, useMUI])

    useEffect(() => {
      if (inputBoxState?.inputStyle !== "normal" && (variant === undefined || variant === null)) {
        set_variant(inputBoxState?.inputStyle as "filled" | "outlined" | "standard")
      } else if (inputBoxState?.inputStyle === "normal") {
        set_variant(undefined)
      } else {
        set_variant(variant as "filled" | "outlined" | "standard")
      }
    }, [inputBoxState?.inputStyle, variant])

    function infoWithLineBreaks(text?: string) {
      if (!text) return null
      return text.includes("/n")
        ? text.split("/n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))
        : text
    }

    // Format value based on type
    const formattedValue = React.useMemo(() => {
      if (value === undefined || value === null) return ""

      if (type === "number") {
        // Format as number with 2 decimal places
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) return value
        return numValue.toFixed(2)
      }

      return value
    }, [value, type])

    const getSizeStyles = () => {
      const styles: {
        mui: SxProps<Theme>
        regular: {
          height?: string
          fontSize: string
          padding: string
          fontWeight?: number
          color?: string
          backgroundColor?: string
        }
      } = {
        mui: {},
        regular: {
          height: "2.5rem",
          fontSize: "14px",
          padding: "0.5rem 1rem",
        },
      }

      const commonMuiStyles = {
        margin: "0",
        borderRadius: `${inputBoxState?.borderRadius ?? 5}px`,
        fontWeight: boldValue || inputBoxState?.bold ? 700 : 400,
        color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
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
        "& .MuiOutlinedInput-input, & .MuiFilledInput-input, & .MuiInput-input": {
          padding: "0 0.75rem",
        },
      }

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
              },
            } as SxProps<Theme>,
            regular: {
              height: "1.4rem",
              fontSize: "12px",
              color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
            },
          }
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
              },
            } as SxProps<Theme>,
            regular: {
              height: "2rem",
              fontSize: "13px",
              color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
            },
          }
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
              },
            } as SxProps<Theme>,
            regular: {
              height: "2.5rem",
              fontSize: "14px",
              color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
            },
          }
        case "customize":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: `${inputBoxState?.inputHeight ?? 3}rem`,
                fontSize: `${inputBoxState?.fontSize ?? 16}px`,
                ...commonMuiStyles,
                fontWeight: boldValue || inputBoxState?.bold ? 700 : (inputBoxState?.fontWeight ?? 500),
              },
              "& .MuiInputLabel-root": {
                fontSize: `${inputBoxState?.labelFontSize ?? 14}px`,
                color:
                  appState?.mode === "dark"
                    ? "rgb(225,224,224)"
                    : inputBoxState?.labelColor
                      ? `rgb(${inputBoxState?.labelColor})`
                      : "rgb(84,84,84)",
              },
            } as SxProps<Theme>,
            regular: {
              height: `${inputBoxState?.inputHeight ?? 2}rem`,
              fontSize: `${inputBoxState?.fontSize ?? 14}px`,
              fontWeight: inputBoxState?.fontWeight,
              color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
            },
          }
        default:
          return styles
      }
    }

    const sizeStyles = getSizeStyles()

    // Handle dynamic margin updates without directly accessing ref.current
    useEffect(() => {
      // We don't need to manually update the margins here since we're applying them directly
      // in the style prop of each div that receives the ref
    }, [inputBoxState?.marginBottom, inputBoxState?.marginTop])

    // Simple text label (non-boxed)
    if (!boxed) {
      return (
        <div
          ref={ref}
          className={`${className}`}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${inputBoxState?.marginTop ?? 0}px`,
          }}
        >
          <div className={`${labelDirection === "vertical" ? "flex flex-col" : "flex items-center gap-2"}`}>
            {!noLabel && (
              <label
                className={`capitalize text-left rtl:text-right dark:!text-dark-label ${
                  appState?.mode == "dark" ? "#000" : `rgb(${inputBoxState?.labelColor})`
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
                }}
              >
                <span style={{ whiteSpace: "nowrap" }}>
                  {`${iLabel}${labelDirection === "horizontal" ? "" : ""}`}
                  {labelDirection === "horizontal" && ":"}
                </span>
              </label>
            )}
            <div
              className={`${inputClassName}`}
              style={{
                fontSize: sizeStyles.regular.fontSize,
                fontWeight: boldValue || inputBoxState?.bold ? 700 : inputBoxState?.fontWeight,
                color: appState?.mode == "dark" ? "#ffffff" : `rgb(${inputBoxState?.fontColor})`,
              }}
            >
              {formattedValue}
            </div>
          </div>
          {info != undefined && info != null && info != "" && (
            <Typography className="text-[#374151] text-xs font-medium mt-1">{infoWithLineBreaks(info)}</Typography>
          )}
        </div>
      )
    }

    // Boxed label (looks like input field but read-only)
    if (_useMUI == true) {
      const muiProps: TextFieldProps = {
        id: `${id}_${Math.random()}`,
        name: `label_${id}_${Math.random()}`,
        value: formattedValue,
        label: !noLabel ? iLabel : undefined,
        InputProps: {
          readOnly: true,
          startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : undefined,
          endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : undefined,
        },
        fullWidth: true,
        variant: _variant,
        inputProps: {
          style: {
            textAlign: textAlign,
            color: type === "number" && Number.parseFloat(value) < 0 ? "red" : undefined,
          },
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
        },
      }

      return (
        <div
          ref={ref}
          className={`${className}`}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${inputBoxState?.marginTop ?? 0}px`,
          }}
        >
          <TextField {...muiProps} />
          {info != undefined && info != null && info != "" && (
            <Typography className="text-[#374151] text-xs font-medium mt-1">{infoWithLineBreaks(info)}</Typography>
          )}
        </div>
      )
    }

    // Custom boxed label (non-MUI)
    const { height, fontSize, fontWeight, color } = sizeStyles.regular
    return (
      <div
        ref={ref}
        className={`${className} ${
          labelDirection === "vertical" ? "flex flex-col space-y-1" : "flex items-center space-x-2"
        }`}
        style={{
          marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
          marginTop: `${inputBoxState?.marginTop ?? 0}px`,
        }}
      >
        <div className="flex justify-between">
          {!noLabel && (
            <label
              className={`capitalize text-left rtl:text-right dark:!text-dark-label ${
                appState?.mode == "dark" ? "#000" : `rgb(${inputBoxState?.labelColor})`
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
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>
                {`${iLabel}${labelDirection === "horizontal" ? "" : ""}`}
                {labelDirection === "horizontal" && ":"}
              </span>
            </label>
          )}
          {labelInfo && (
            <label
              className={`capitalize block text-right rtl:text-left ${appState?.mode == "dark" ? "form-label" : ""}`}
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
              }}
            >
              {cloneElement(labelInfo, labelInfoProps ? { labelInfoProps: labelInfoProps } : {})}
            </label>
          )}
        </div>

        <div className={`flex !mt-0 ${labelDirection === "vertical" ? "" : "basis-2/3"}`}>
          {prefix && (
            <div
              className="flex items-center justify-center text-slate-400 px-2 rounded-l-md font-medium border-r-0 border-gray-300 border dark:!bg-dark-bg-card bg-slate-100"
              style={{
                height,
                fontSize,
                fontWeight,
                color,
                borderColor: borderStyles,
                backgroundColor: bgColor,
              }}
            >
              {prefix}
            </div>
          )}
          <div className="relative flex-1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div
              className={`form-control ${inputClassName} dark:!bg-dark-bg-card placeholder:capitalize`}
              style={{
                height,
                fontSize,
                fontWeight: boldValue || inputBoxState?.bold ? 700 : fontWeight,
                color: type === "number" && Number.parseFloat(value) < 0 ? "red" : color,
                borderColor: borderStyles,
                outline: "none",
                transition: "border-color 0.2s ease-in-out",
                borderTopLeftRadius: `${!prefix ? inputBoxState?.borderRadius : 0}px`,
                borderBottomLeftRadius: `${!prefix ? inputBoxState?.borderRadius : 0}px`,
                borderTopRightRadius: `${!suffix ? inputBoxState?.borderRadius : 0}px`,
                borderBottomRightRadius: `${!suffix ? inputBoxState?.borderRadius : 0}px`,
                backgroundColor: bgColor,
                textAlign: textAlign,
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                ...(!prefix &&
                  !suffix && {
                    borderRadius: `${inputBoxState?.borderRadius ?? 5}px`,
                  }),
              }}
            >
              {formattedValue}
            </div>
          </div>
          {suffix && (
            <div
              className="flex items-center justify-center text-slate-400 p-2 rounded-r-md border-l-0 border border-gray-400 bg-slate-100"
              style={{
                height,
                fontSize,
                borderColor: borderStyles,
                color,
                backgroundColor: bgColor,
              }}
            >
              {suffix}
            </div>
          )}
        </div>
        {info != undefined && info != null && info != "" && (
          <div className="text-[#374151] text-xs font-medium">{infoWithLineBreaks(info)}</div>
        )}
      </div>
    )
  },
)

export default memo(ERPLabel)

