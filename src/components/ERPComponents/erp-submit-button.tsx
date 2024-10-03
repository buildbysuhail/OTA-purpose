import { useEffect, useState } from "react";

interface ERPSubmitButtonProps {
  text?: string;
  name?: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: React.HTMLAttributes<HTMLButtonElement>["className"];
  children?: React.ReactNode;
  variant?: "outline" | "danger" | "secondary" | "primary" | "success" | undefined;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  title?: string;
  value?: string | number;
  id?: string;
}

///


const ERPSubmitButton = ({
  text = "button",
  type,
  onClick,
  disabled,
  loading,
  className,
  children,
  variant,
  iconRight,
  iconLeft,
  title,
  name = "button",
  value,
  id,
}: ERPSubmitButtonProps) => {
  const [variantType, setVariantType] = useState<any>();
  const textBody = children ? children : text;
  useEffect(() => {
    
  switch (variant) {
    case  "primary":
      setVariantType("ti-btn-primary-full");
      break;
    case "outline":
      setVariantType("disabled:bg-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-50");
      break;
    case "secondary":
      setVariantType("disabled:bg-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-50");
      break;
    case "danger":
      setVariantType("disabled:bg-gray-200 bg-red-300 text-gray-700 hover:bg-red-400");
      break;
    case "success":
      setVariantType("bg-gray-200 bg-green-600 text-white hover:bg-green-700");
      break;
    default:
      setVariantType("disabled:bg-accent/70 bg-accent text-white hover:bg-accent/90");
      break;
  }
}, []);

  return (
    <button
      id={id}
      name={name}
      type={type}
      title={title}
      value={value}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex leading-4 gap-3 h-9 justify-center items-center py-2 px-4 border  shadow-sm text-[13px] rounded-md  ${variantType}   focus:outline-none focus:ring-2 focus:ring-offset-2  ${className}`}
    >
      {iconLeft}
      {loading ? <div className="top-0 left-0 right-0 bottom-0 true h-4 w-4 bg-white rounded-full animate-ping"></div> : textBody}
      {iconRight}
    </button>
  );
};

export default ERPSubmitButton;
