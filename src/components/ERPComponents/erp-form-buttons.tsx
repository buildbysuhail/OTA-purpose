import React from 'react';
import ERPButton from './erp-button';

interface ERPFormButtonsProps {
  isEdit: boolean;
  isLoading: boolean;
  title?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export const ERPFormButtons: React.FC<ERPFormButtonsProps> = ({ isEdit, isLoading, title, onCancel, onSubmit, onClear }) => {
  return (
    <div className="w-full p-2 flex justify-end space-x-2">
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
          disabled={isLoading}
          variant="primary"
          onClick={onSubmit}
          loading={isLoading}
          title={title ? title:  isEdit ? 'Update' : 'Submit'}
        />
      )}
    </div>
  );
};