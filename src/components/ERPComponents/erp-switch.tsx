
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  value?: any;
  offLabel?: string;
  onChange?: (e: any) => void;
  defaultValue?: any;
  disabled?: boolean;
  required?: boolean;
}

const ERPSwitch = ({ id, title, label, onLabel, offLabel, disabled, defaultValue, required, onChange }: ERPSwitchProps) => {
  const [checked, setChecked] = useState(defaultValue);

  const currentLabel = checked ? onLabel || label : offLabel || label;

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  return (
    <div className="flex flex-col items-start ">
      {title && (
        <label className=" capitalize mb-3 block text-[13px] text-gray-800">
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
              // defaultChecked={defaultValue ? true : false}
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
            <div className={`w-10 h-4 ${disabled ? "bg-gray-50" : "bg-gray-200"} rounded-full shadow-inner`}></div>
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
              className={` absolute w-6 h-6 ease-in-out transform-gpu ${
                checked ? ` translate-x-full ${disabled ? "bg-gray-200" : "bg-accent"}` : ` ${disabled ? "bg-gray-200" : "bg-gray-400"}`
              } rounded-full shadow -left-1 -top-1 cursor-pointer transition`}
            ></label>
          </div>
          <div className={`mr-3 capitalize block text-xs text-gray-700 dis`}>{currentLabel}</div>
        </label>
      </div>
    </div>
  );
};

export default ERPSwitch;
