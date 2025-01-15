import React from "react";
import ERPButton from "./erp-button";
import { useTranslation } from "react-i18next";


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
}) => {
  const { t } = useTranslation('main');
  return (
    <div className="absolute -bottom-0 left-0  w-full  flex justify-end space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-white pt-3  border-t  z-10  pb-[12px] pr-[10px] rounded-b-md">
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
          onClick={onSubmit}
          loading={isLoading}
          disabled={submitDisabled}
          skip={skipSubmit}
          jumpTo={jumpToSubmit}
          jumpTarget={jumpTargetSubmit}
          onEnterPress={onSubmitEnterPress}
          variant="primary"
        />
      )}
    </div>
  );
};

export default ERPFormButtons;
