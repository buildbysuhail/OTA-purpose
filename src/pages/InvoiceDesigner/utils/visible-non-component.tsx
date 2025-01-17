import { Smile,Frown } from "lucide-react"; // Import the Smile icon from Lucide React
import { useEffect, useState } from "react"; // For animation state

interface NoDataMessageProps {
  message: string; // The message to display
  icon?: JSX.Element; // Optional: Custom icon
  className?: string; // Optional: Additional CSS classes
}

const NoDataMessage = ({ message, icon, className }: NoDataMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the animation after the component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`flex items-start justify-center gap-2  transition-opacity duration-500 h-full px-3 pt-14  ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {icon || <Frown className="w-6 h-6 animate-bounce text-[#fbbf24]" />}{" "}
      <span className="text-sm font-medium text-gray-600">{message}</span>
    </div>
  );
};

export default NoDataMessage;