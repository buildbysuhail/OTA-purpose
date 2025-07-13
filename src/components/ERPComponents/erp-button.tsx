import { CircularProgress } from "@mui/material";
import { useEffect, useState, forwardRef } from "react";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { inputBox } from "../../redux/slices/app/types";
import React from "react";

type StatusType = {
  label: string;
  color: string;
};

type ERPButtonProps = {
  localInputBox?: inputBox;
  title?: string;
  disabled?: boolean;
  disableEnterNavigation?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconPosition?: "start" | "end";
  onClick?: (e?: any) => void;
  onKeyDown?: (e: any) => void;
  className?: string;
  customVariant?: string;
  variant?: "primary" | "secondary" | "custom" | "status";
  type?: "button" | "reset" | "submit";
  tabIndex?: number;
  status?: StatusType;
  rounded?: "md" | "full" | "none";
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
  backgroundColor?: string;
  foreColor?: string;
  onEnterPress?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ERPButton = forwardRef<HTMLButtonElement, ERPButtonProps>(
  (
    {
      title,
      disabled,
      backgroundColor,
      foreColor,
      loading,
      startIcon,
      endIcon,
      iconPosition = "start",
      onClick,
      onKeyDown,
      className = "",
      customVariant,
      variant = "secondary",
      type = "button",
      tabIndex,
      status,
      rounded = "md",
      skip = false,
      jumpTo,
      jumpTarget,
      disableEnterNavigation = false,
      localInputBox,
      ...props
    },
    ref
  ) => {
    const [variantType, setVariantType] = useState<string>();
    const [isFocused, setIsFocused] = useState(false);

    const appState = useAppSelector((state: RootState) => state.AppState?.appState) || {};
    const inputBoxState = React.useMemo(() => { return localInputBox || appState?.inputBox; }, [localInputBox, appState?.inputBox]);
    // const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      if (variant === "status" && status) {
        setVariantType(status.color);
        return;
      }
      switch (variant) {
        case "primary":
          setVariantType("ti-btn-primary-full");
          break;
        case "custom":
          setVariantType(customVariant || "");
          break;
        case "secondary":
        default:
          setVariantType("bg-slate-100 hover:bg-slate-200 text-black secondaryBorder ");
          break;
      }
    }, [variant, customVariant, status]);

    const getRoundedClass = () => {
      switch (rounded) {
        case "full":
          return "rounded-full";
        case "md":
          return "rounded-md";
        case "none":
          return "";
        default:
          return "rounded-md";
      }
    };

    const renderIcon = (icon: React.ReactNode) => {
      if (typeof icon === "string") {
        return <i className={icon}></i>;
      }
      return icon;
    };

    const getButtonContent = () => {
      if (variant === "status" && status) {
        return status.label;
      }

      const showStartIcon = iconPosition === "start" && (startIcon || (!endIcon && startIcon));
      const showEndIcon = iconPosition === "end" && (endIcon || (!startIcon && endIcon));
      const actualStartIcon = showStartIcon ? (startIcon || endIcon) : null;
      const actualEndIcon = showEndIcon ? (endIcon || startIcon) : null;

      return (
        <div className="flex gap-2 items-center">
          {actualStartIcon && renderIcon(actualStartIcon)}
          {title}
          {actualEndIcon && renderIcon(actualEndIcon)}
          {loading && (
            <div className="flex items-center">
              <CircularProgress className="" color="inherit" size={14} />
            </div>
          )}
        </div>
      );
    };

    const commonProps = {
      ...props,
    };
    return (
      <button
        ref={ref}
        {...commonProps}
        tabIndex={tabIndex}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onFocus={(e) => setIsFocused(true)}
        onBlur={(e) => setIsFocused(false)}
        onKeyDown={(e) => {

          if (disableEnterNavigation) {
            if (onKeyDown) {
              console.log(e);

              onKeyDown(e);
            }
          } else {
            // handleNavigation(null);
          }
        }}
        data-skip={skip}
        data-jump-to={jumpTo}
        data-jump-target={jumpTarget}
        style={{
          backgroundColor: backgroundColor ? backgroundColor : isFocused
            ? `rgb(${inputBoxState?.buttonFocusBg || '89, 137, 232'})`
            : undefined,
          marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
          marginTop: `${inputBoxState?.marginTop ?? 0}px`,
        }}
        className={`
        ${variant !== "status" ? "ti-btn ti-btn-full" : ""} 
        py-2 
        ${variant === "status" ? "px-8" : "px-4"} 
        text-sm 
        ${disabled ? "opacity-50" : ""} 
        ${getRoundedClass()} 
        font-medium 
        ${variantType} 
        ${variant === "status" ? "text-white" : ""} 
        "focus:bg-red-500"
        ${className}`
          .trim()
          .replace(/\s+/g, " ")}>
        {getButtonContent()}
      </button>
    );
  });

export default ERPButton;