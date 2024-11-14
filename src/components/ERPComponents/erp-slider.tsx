interface ERPSliderProps {
  id?: string;
  label?: string;
  placeholder?: string;
  noLabel?: boolean;
  required?: boolean;
  //   data?: any;
  //   onChangeData?: (data: any) => void;
  className?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const ERPSlider = ({ id, label, placeholder, required, noLabel, min, max, value, defaultValue, disabled, onChange,className }: ERPSliderProps) => {
  const iLabel = label || id?.replaceAll("_", " ");
  return (
    <div>
      {!noLabel && (
        <label className=" capitalize text-[12px] font-medium text-gray-700 mb-1">
          {iLabel}
          {required && "*"}
        </label>
      )}
      <input
        id="default-range"
        type="range"
        min={min}
        max={max}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-1 ${className ? className : "bg-gray-200"} rounded-lg appearance-none cursor-pointer dark:bg-gray-700`}
      />
    </div>
  );
};

export default ERPSlider;
