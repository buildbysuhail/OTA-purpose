import { useEffect, useState } from "react";

interface ERPSwitchProps {
  id?: string;
  /**
   * The title to display
   */
  title?: string;
  /**
   * The label to display
   */
  label?: string;
  /**
   * The label to display when the switch is on
   */
  onLabel?: string;
  /**
   * The label to display when the switch is off
   */
  offLabel?: string;
  value?: any;
  onChange?: (e: any) => void;
  defaultValue?: any;
  disabled?: boolean;
  required?: boolean;
  /**
   * The size of the switch: sm, md, lg, or default
   */
  size?: "sm" | "md" | "lg" | "default";
}

const ERPSwitch = ({ id, title, label, onLabel, offLabel, disabled, defaultValue, required, onChange, size = "default" }: ERPSwitchProps) => {
  const [checked, setChecked] = useState(defaultValue);

  const currentLabel = checked ? onLabel || label : offLabel || label;

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  // Define size-based classes
  const sizeClasses = {
    sm: {
      switchWidth: "w-7",
      switchHeight: "h-2",
      circleSize: "w-[14px] h-[14px]",
      translateSize: "translate-x-4",
    },
    md: {
      switchWidth: "w-10",
      switchHeight: "h-4",
      circleSize: "w-6 h-6",
      translateSize: "translate-x-5",
    },
    lg: {
      switchWidth: "w-12",
      switchHeight: "h-5",
      circleSize: "w-7 h-7",
      translateSize: "translate-x-6",
    },
    default: {
      switchWidth: "w-10",
      switchHeight: "h-4",
      circleSize: "w-6 h-6",
      translateSize: "translate-x-5",
    },
  };

  const { switchWidth, switchHeight, circleSize, translateSize } = sizeClasses[size];

  return (
    <div className="flex flex-col items-start">
      {title && (
        <label className="capitalize mb-3 block text-[13px] text-gray-800">
          {title}
          {required && "*"}
        </label>
      )}
      <div className={`flex items-center relative w-full px-1`}>
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              id={id}
              tabIndex={-1}
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                if (!disabled) {
                  onChange?.(e);
                  setChecked(e.target.checked);
                }
              }}
              className="sr-only"
              disabled={disabled}
              required={required}
            />
            <div className={`${switchWidth} ${switchHeight} ${disabled ? "bg-gray-50" : "bg-gray-200"} rounded-full shadow-inner`}></div>
            <label
              onClick={(e) => {
                if (!disabled) {
                  setChecked(!checked);
                  onChange?.({ target: { checked: !checked } });
                }
              }}
              onKeyUp={(e) => {
                if ((e.key === "Enter" || e.keyCode == 32) && !disabled) {
                  setChecked(!checked);
                  onChange?.({ target: { checked: !checked } });
                }
              }}
              tabIndex={0}
              className={`absolute ${circleSize} ease-in-out transform-gpu ${
                checked
                  ? ` ${translateSize} ${disabled ? "bg-gray-200" : "bg-primary"}`
                  : ` ${disabled ? "bg-gray-200" : "bg-gray-400"}`
              } rounded-full shadow -left-1 -top-1 cursor-pointer transition`}
            ></label>
          </div>
          <div className={`mr-3 capitalize block text-xs text-gray-700`}>{currentLabel}</div>
        </label>
      </div>
    </div>
  );
};

export default ERPSwitch;
