import React from "react";
import { inputBox } from "../../redux/slices/app/types";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface ERPInputProps {
  id: string;
  data?: any;
  value?: string;
  defaultValue?: any;
  label?: string;
  placeholder?: string;
  onChangeData?: (data: any) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  cols?: number;
  autocomplete?: string;
  disabled?: boolean;
  className?: string;
  noLabel?: boolean;
  localInputBox?: inputBox;
}

const ERPTextarea = ({
  id,
  onChangeData,
  onChange,
  onFocus,
  data,
  autocomplete,
  label,
  placeholder,
  disabled,
  className,
  value,
  defaultValue,
  required,
  minLength,
  maxLength,
  rows,
  cols,
  noLabel,
  localInputBox,
}: ERPInputProps) => {
  const appState = useAppSelector(
    (state: RootState) => state.AppState?.appState
  );
  const iLabel = label || id?.replaceAll("_", " ");
  const inputBoxState = React.useMemo(() => {
    return localInputBox || appState?.inputBox;
  }, [localInputBox, appState?.inputBox]);

  return (
    <div>
      {!noLabel && (
        <label className="capitalize mb-1 block text-xs dark:text-dark-text text-gray-700">
          {iLabel}
          {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}
      <textarea
        onChange={(e) => {
          onChangeData && data && onChangeData({ ...data, [id]: e.target?.value });
          onChange && onChange(e);
        }}
        onFocus={onFocus}
        id={id}
        value={value}
        defaultValue={defaultValue}
        name={id}
        rows={rows}
        cols={cols}
        autoComplete={autocomplete}
        disabled={disabled}
        placeholder={placeholder || label}
        className={`block w-full placeholder:text-xs text-xs sm:text-xs rounded appearance-none border dark:border-dark-border dark:bg-dark-bg-card dark:text-dark-text border-gray-300 bg-white/95 px-3 py-2 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-dark-bg-card focus:outline-none focus:ring-accent disabled:text-gray-600 dark:disabled:text-gray-500 ${className || ""}`}
        style={{
          borderColor: appState?.mode === "dark" ? (value ? "#ffffff" : "#ffffff1a") : `rgb(${inputBoxState?.borderColor})`,
          backgroundColor: appState?.mode === "dark" ? (value ? "#ffffff" : "#ffffff1a") : `rgb(${inputBoxState?.inputBgColor || "255,255,255"})`,
        }}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  );
};

export default ERPTextarea;