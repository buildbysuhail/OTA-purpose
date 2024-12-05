
import { forwardRef, useEffect, useState } from "react";
import ERPElementValidationMessage from "./erp-element-validation-message";
import { handleNavigation } from "../../utilities/shortKeys";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface ERPCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  data?: any;
  label?: string;
  onChangeData?: (data: any) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  noLabel?: boolean;
  validation?: string;
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
  customSize?: 'sm' | 'md' | 'lg';
}

const ERPCheckbox = forwardRef<HTMLInputElement, ERPCheckboxProps>(({
  id,
  onChangeData,
  onChange,
  onFocus,
  onBlur,
  data,
  label,
  disabled,
  labelClassName,
  className,
  inputClassName,
  required,
  noLabel,
  validation,
  skip = false,
  jumpTo,
  jumpTarget,
  customSize ,
  ...props
}: ERPCheckboxProps, ref) => {
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
      case 'sm':
        return {
          checkbox: {
            width: "14px",
            height: "14px"
          },
          label: {
            fontSize: "12px",
            lineHeight: "14px"
          }
        };
        case 'md':
          return {
            checkbox: {
             width: "1rem",
              height: "1rem"
            },
            label: {
               fontSize: "14px",
              lineHeight: "1rem"
            }
          };
      case 'lg':
        return {
          checkbox: {
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
          checkbox: {
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
      <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={id}
          onChange={(e) => {
            debugger;
            onChangeData && data && onChangeData({ ...data, [id]: e.target.checked });
            onChange && onChange(e);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleNavigation}
          defaultChecked={false}
          disabled={disabled}
          required={required}
          data-skip={skip}
          data-jump-to={jumpTo}
          data-jump-target={jumpTarget}
          style={sizeStyles.checkbox}
          className={`form-check-input ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${inputClassName}`}
          {...props}
        />
        {!noLabel && (
          <span className={`ml-2 ${labelClassName} ${disabled ? 'text-gray-400' : ''}`} style={sizeStyles.label}>
            {iLabel}
            {required && !noLabel && "*"}
          </span>
        )}
      </label>
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
});

export default ERPCheckbox;
