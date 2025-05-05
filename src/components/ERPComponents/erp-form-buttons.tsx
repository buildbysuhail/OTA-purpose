import React, { useState } from "react";
import ERPButton from "./erp-button";
import { useTranslation } from "react-i18next";

interface CustomButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  loading?: boolean;
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
  onEnterPress?: () => void;
}

interface ERPFormButtonsProps {
  isEdit?: boolean;
  isLoading?: boolean;
  title?: string;
  submitDisabled?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  onClear?: () => void;
  skipClear?: boolean;
  skipCancel?: boolean;
  skipSubmit?: boolean;
  jumpToClear?: string;
  jumpTargetClear?: string;
  jumpToCancel?: string;
  jumpTargetCancel?: string;
  jumpToSubmit?: string;
  jumpTargetSubmit?: string;
  onClearEnterPress?: () => void;
  onCancelEnterPress?: () => void;
  onSubmitEnterPress?: () => void;
  customButtons?: CustomButtonProps[]
  customButtonsPosition?: "left" | "right";
}


export const ERPFormButtons: React.FC<ERPFormButtonsProps> = ({
  isEdit = false,
  isLoading = false,
  submitDisabled = false,
  onCancel,
  onSubmit,
  onClear,
  skipClear = false,
  skipCancel = false,
  skipSubmit = false,
  jumpToClear,
  jumpTargetClear,
  jumpToCancel,
  jumpTargetCancel,
  jumpToSubmit,
  jumpTargetSubmit,
  onClearEnterPress,
  onCancelEnterPress,
  onSubmitEnterPress,
  customButtons = [],
  customButtonsPosition = "left",
  
}) => {
  const { t } = useTranslation('main');
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const handleSubmit = async () => {
    if (onSubmit) {
      setIsSubmitClicked(true);
      try {
        await onSubmit(); // Assuming `onSubmit` is an async function
        setIsSubmitClicked(false); // Reset after successful submission
      } catch (error) {
        setIsSubmitClicked(false); // Reset if validation or submission fails
      }
    }
  };
  return (
    <div className="absolute -bottom-0 h-[42px] flex flex-row  left-0  w-full   dark:!border-dark-border dark:!bg-dark-bg bg-white  border-t  z-10  px-[10px] rounded-b-md">
   
  <div
    className={` flex space-x-2 py-[4px] basis-1/2 ${
      customButtonsPosition === "left" ? "justify-start" : "justify-end"
    }`}
  >
     {customButtons.length > 0 && 
    customButtons.map((button, index) => (
      <ERPButton
        key={`custom-button-${index}`}
        title={button.title}
        onClick={button.onClick}
        disabled={button.disabled}
        variant={button.variant || "secondary"}
        loading={button.loading}
        skip={button.skip}
        jumpTo={button.jumpTo}
        jumpTarget={button.jumpTarget}
        onEnterPress={button.onEnterPress}
      />
    ))
  }
  </div>

      <div className="flex justify-end  space-x-2 py-[4px] basis-1/2 ">
      {onClear && (
        <ERPButton
          title={t("clear")}
          onClick={onClear}
          skip={skipClear}
          jumpTo={jumpToClear}
          jumpTarget={jumpTargetClear}
          onEnterPress={onClearEnterPress}
          variant="secondary"
        />
      )}

      {onCancel && (
        <ERPButton
          title={t("cancel")}
          onClick={onCancel}
          skip={skipCancel}
          jumpTo={jumpToCancel}
          jumpTarget={jumpTargetCancel}
          onEnterPress={onCancelEnterPress}
          variant="secondary"
        />
      )}
     
      {onSubmit && (
          <ERPButton
          title={t("submit")}
          onClick={handleSubmit}
          loading={isLoading || isSubmitClicked}
          disabled={submitDisabled || isSubmitClicked}
          skip={skipSubmit}
          jumpTo={jumpToSubmit}
          jumpTarget={jumpTargetSubmit}
          onEnterPress={onSubmitEnterPress}
          variant="primary"
        />
      )}
      </div>
      
    </div>
  );
};

export default ERPFormButtons;


