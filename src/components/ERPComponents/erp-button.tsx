import { CircularProgress } from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { handleNavigation } from "../../utilities/shortKeys";

type StatusType = {
  label: string;
  color: string;
};

type ERPButtonProps = {
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  onClick?: () => void;
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
  onEnterPress?: () => void;
};

const ERPButton = ({
  title,
  disabled,
  loading,
  startIcon,
  onClick,
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
}: ERPButtonProps) => {
  const [variantType, setVariantType] = useState<string>();
  const buttonRef = useRef<HTMLButtonElement>(null);
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
        setVariantType("bg-slate-100 hover:bg-slate-200 text-black");
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
  const getButtonContent = () => {
    if (variant === "status" && status) {
      return status.label;
    }
    return (
      <div className="flex gap-2 items-center">
        {typeof startIcon === "string" && <i className={startIcon}></i>}
        {title}
        {loading && (
          <div className="flex items-center">
            <CircularProgress className="" color="inherit" size={14} />
          </div>
        )}
      </div>
    );
  };
  return (
    <button
      ref={buttonRef}
      tabIndex={tabIndex}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={handleNavigation}
      data-skip={skip}
      data-jump-to={jumpTo}
      data-jump-target={jumpTarget}
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
        ${className}`
        .trim()
        .replace(/\s+/g, " ")}>
      {getButtonContent()}
    </button>
  );
};

export default ERPButton;