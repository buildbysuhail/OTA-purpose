import React, { useState } from "react";
import ERPButton from "./erp-button";
import { useTranslation } from "react-i18next";

export interface CustomButtonProps {
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
  customButtons?: CustomButtonProps[];
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
    <div className="absolute bottom-0 left-0 w-full h-[44px] flex justify-end border-t border-gray-300 dark:border-dark-border dark:bg-dark-bg bg-white z-10 px-[10px] rounded-b-md">
      <div className="flex items-center space-x-2 py-[4px]">
        {customButtons.map((button, index) => (
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
        ))}
        {!skipSubmit && onSubmit && (
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
        {!skipClear && onClear && (
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
        {!skipCancel && onCancel && (
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
      </div>
    </div>
  );
};

export default ERPFormButtons;