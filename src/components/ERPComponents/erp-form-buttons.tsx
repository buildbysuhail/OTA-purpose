import React from 'react';
import ERPButton from './erp-button';

interface ERPFormButtonsProps {
  isEdit?: boolean;
  isLoading: boolean;
  title?: string;
  submitDisabled?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export const ERPFormButtons: React.FC<ERPFormButtonsProps> = ({ isEdit, isLoading, title, onCancel, onSubmit, onClear,submitDisabled = false }) => {
  return (
    <div className="sticky bottom-0 left-0  w-full  flex justify-end space-x-2 bg-white mt-2 pt-1 pr-3 border-t  z-20">
      
       {onClear && (
      <ERPButton
        type="button"
        title="Clear"
        variant="secondary"
        onClick={onClear}
      />
    )}
       {onCancel && (
      <ERPButton
        type="reset"
        title="Cancel"
        variant="secondary"
        onClick={onCancel}
      />
      )}
       {onSubmit && (
        <ERPButton
          type="button"
          disabled={isLoading || submitDisabled}
          variant="primary"
          onClick={onSubmit}
          loading={isLoading}
          title={title ? title:  isEdit ? 'Update' : 'Submit'}
        />
      )}
    </div>
  );
};