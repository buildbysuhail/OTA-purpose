
interface ERPSubmitButtonProps {
  text?: string;
  name?: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: React.HTMLAttributes<HTMLButtonElement>["className"];
  children?: React.ReactNode;
  varient?: "outline" | "danger" | "secondary" | "primary" | "success" | undefined;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  title?: string;
  value?: string | number;
  id?: string;
}

///
const getVarientStyle = (varient?: "outline" | "danger" | "secondary" | "primary" | "success" | undefined): string => {
  switch (varient) {
    case  'primary':"ext-white bg-primary bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    case "outline":
      return "disabled:bg-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-50";
    case "secondary":
      return "disabled:bg-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-50";
    case "danger":
      return "disabled:bg-gray-200 bg-red-300 text-gray-700 hover:bg-red-400";
    case "primary":
      return "disabled:bg-accent/70 bg-accent text-white hover:bg-accent/90";
    case "success":
      return "bg-gray-200 bg-green-600 text-white hover:bg-green-700";
    default:
      return "disabled:bg-accent/70 bg-accent text-white hover:bg-accent/90";
  }
};

const ERPSubmitButton = ({
  text = "button",
  type,
  onClick,
  disabled,
  loading,
  className,
  children,
  varient,
  iconRight,
  iconLeft,
  title,
  name = "button",
  value,
  id,
}: ERPSubmitButtonProps) => {
  const textBody = children ? children : text;
  var varientStyle = getVarientStyle(varient);

  return (
    <button
      id={id}
      name={name}
      type={type}
      title={title}
      value={value}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex leading-4 gap-3 h-9 justify-center items-center py-2 px-4 border  shadow-sm text-[13px] rounded-md  ${varientStyle}   focus:outline-none focus:ring-2 focus:ring-offset-2  ${className}`}
    >
      {iconLeft}
      {loading ? <div className="top-0 left-0 right-0 bottom-0 true h-4 w-4 bg-white rounded-full animate-ping"></div> : textBody}
      {iconRight}
    </button>
  );
};

export default ERPSubmitButton;
