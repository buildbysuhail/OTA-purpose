interface SBInputProps {
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
}

const SBTextarea = ({
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
}: SBInputProps) => {
  const iLabel = label || id?.replaceAll("_", " ");
  return (
    <div>
      {!noLabel && (
        <label className=" capitalize mb-1 block text-xs  text-black">
          {iLabel}
          {required && "*"}
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
        className="block w-full placeholder:text-xs text-xs sm:text-xs rounded appearance-none border border-gray-300 bg-white/95 px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-1 focus:border-accent focus:bg-white focus:outline-none focus:ring-accent"
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        // onInvalid={(e: any) => {
        // 	e.target.setCustomValidity("Please fill out this field.");
        // }}
        // onInput={(e: any) => {
        // 	e.target.setCustomValidity("");
        // }}
      />
    </div>
  );
};

export default SBTextarea;
