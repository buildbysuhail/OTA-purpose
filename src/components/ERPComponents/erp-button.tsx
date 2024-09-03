import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

type ERPButtonProps = {
	title: string;
	disabled?: boolean;
	loading?: boolean;
	startIcon?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	variant?: "primary" | "secondary" | "custom";
	type?: "button" | "reset" | "submit";
	tabIndex?: number;
};

const ERPButton = ({
	title,
	disabled,
	loading,
	startIcon,
	onClick,
	className,
	variant,
	type = "button",
	tabIndex,
}: ERPButtonProps) => {
	const [variantType, setVariantType] = useState<any>();
	useEffect(() => {
		variant === "primary"
			? setVariantType("ti-btn-primary-full")
			: variant === "custom"
			? setVariantType(className)
			: setVariantType(" bg-slate-100 hover:bg-slate-200 text-black");
	}, []);
	return (
    <button
      tabIndex={tabIndex}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`ti-btn ti-btn-full m-2 py-2 px-4 text-sm ${disabled && "opacity-60"} rounded-md font-medium ${variantType}`}
    >
      <div className="flex gap-2">
        {startIcon && startIcon}
        {title}
        {loading && (
          <div className="flex items-center">
            <CircularProgress className="" color="inherit" size={14} />
          </div>
        )}
      </div>
    </button>
  );
};

export default ERPButton;
