import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import SBInput from "./SBInput";
import { useState } from "react";

interface SBStepInputProps {
  id: string;
  data?: any;
  value?: any;
  defaultValue?: any;
  label?: string;
  placeholder?: string;
  onChangeData?: (data: any) => void;
  onChange?: (e: number) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: any;
  pattern?: string;
  autocomplete?: string;
  disabled?: boolean;
  className?: string;
  noLabel?: boolean;
  prefix?: any;
  suffix?: any;
  accept?: string;
}

const SBStepInput = ({
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
  min,
  max,
  pattern,
  noLabel,
  prefix,
  suffix,
  step,
  accept,
  ...props
}: SBStepInputProps) => {
  //   const iLabel = label || id?.replaceAll("_", " ");
  //   let labeText = noLabel ? "" : iLabel;
  //   if (min !== undefined) {
  //     labeText = `${labeText} (min: ${min}`;
  //   }
  //   if (max !== undefined) {
  //     labeText = `${labeText}, max: ${max})`;
  //   }
  return (
    <SBInput
      defaultValue={defaultValue}
      disabled={true}
      type="number"
      id={id}
      value={value}
      label={label}
      onClickPrefix={() => {
        if (min !== undefined && value <= min) return;
        const addValue = step ? step : 1;
        // addValue = addValue ? addValue : defaultValue ? defaultValue : 8;
        onChange?.((value || defaultValue) - addValue);
      }}
      onClickSuffix={() => {
        if (max !== undefined && value >= max) return;
        const addValue = step ? step : 1;
        // addValue = addValue ? addValue : defaultValue ? defaultValue : 8;
        onChange?.((value || defaultValue) + addValue);
      }}
      onChange={(e) => {
        console.log(`SBStepInput,  : `);
        const nValue = parseInt(e.target.value);
        onChange?.(nValue);
      }}
      prefix={<MinusIcon className=" cursor-pointer w-4 h-4" />}
      suffix={<PlusIcon className=" w-4 h-4" />}
      inputClassName="text-center"
    />
  );
};

export default SBStepInput;
