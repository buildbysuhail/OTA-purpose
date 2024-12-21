
import { forwardRef, useEffect, useState } from "react";
import ERPElementValidationMessage from "./erp-element-validation-message";
import { handleNavigation } from "../../utilities/shortKeys";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface ERPRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value?: any;
  label?: string;
  data?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeData?: (data: any) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  validation?: string;
  customSize?: "sm" | "md" | "lg",
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
}

const ERPRadio = forwardRef<HTMLInputElement, ERPRadioProps>(({
  id,
  name,
  value,
  label,
  data,
  onChange,
  onChangeData,
  required,
  disabled,
  className,
  inputClassName,
  labelClassName,
  validation,
  customSize ,
  skip = false,
  jumpTo,
  jumpTarget,
  ...props
}: ERPRadioProps, ref) => {
  const iLabel = label || id?.replaceAll("_", " ");
  const appState = useAppSelector(
    (state: RootState) => state.AppState.appState
  );
  const [_customSize, setCustomSize] = useState(customSize ? customSize : appState?.inputBox?.checkButtonInputSize);
 useEffect(() => {
    if (customSize == undefined || customSize == null) {
      setCustomSize(appState?.inputBox?.checkButtonInputSize);
    }
  }, [appState?.inputBox?.checkButtonInputSize]);


  const getSizeStyles = () => {
    switch (_customSize) {
      case "sm":
        return {
          radio: {
            width: "14px",
            height: "14px"
          },
          label: {
            fontSize: "12px",
            lineHeight: "14px"
          }
        };
        case "md":
          return {
            radio: {
              width: "1rem",
              height: "1rem"
            },
            label: {
              fontSize: "14px",
              lineHeight: "1rem"
            }
          };
      case "lg":
        return {
          radio: {
            width: "1.25rem",
            height: "1.25rem"
          },
          label: {
            fontSize: "16px",
            lineHeight: "1.25rem"
          }
        };
       
      default:
        return {
          radio: {
            width: "1rem",
            height: "1rem"
          },
          label: {
            fontSize: "14px",
            lineHeight: "1rem"
          }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className={className}>
      <div className="form-check flex items-center">
        <input
          id={id}
          name={name}
          value={value}
          type="radio"
          ref={ref}
          onChange={(e) => {
            if (onChangeData && data) {
              onChangeData({ ...data, [id]: e.target?.value });
            }
            onChange && onChange(e);
          }}
          onKeyDown={handleNavigation}
          disabled={disabled}
          required={required}
          data-skip={skip}
          data-jump-to={jumpTo}
          data-jump-target={jumpTarget}
          style={{
            ...sizeStyles.radio,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          className={`form-check-input appearance-none rounded-full border border-gray-300 
            checked:bg-blue-500 checked:border-blue-500 focus:outline-none transition duration-200 
            align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer
            ${inputClassName} 
            ${disabled ? "opacity-50 bg-gray-100" : "hover:border-blue-500"}`}
          {...props}
        />
        <label
          htmlFor={id}
          style={sizeStyles.label}
          className={`form-check-label ${labelClassName} ${_customSize == "sm" ? '-translate-y-[2.5px]':"-translate-y-[1px]"} 
            capitalize text-gray-900 rtl:text-right select-none
            ${disabled ? "text-gray-400" : "text-gray-900"}`}>
          {iLabel}
          {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
});

ERPRadio.displayName = "ERPRadio";
export default ERPRadio;