import React, { forwardRef, Dispatch } from 'react';
import { toggleCustomDesignerPopup } from '../../../redux/slices/popup-reducer';
import { Component } from 'lucide-react';
import { AnyAction } from 'redux';

// Define the props interface
interface CustomDesignerButtonProps {
  Label: string;
  dispatch: Dispatch<AnyAction>;
  className?: string;
  customFieldMaster: string;

}

// Create the component with forwardRef
const CustomDesignerButton = forwardRef<HTMLButtonElement, CustomDesignerButtonProps>(
  ({ Label, dispatch, customFieldMaster, className }, ref) => {
    return (
      <div className="relative">
        <button className={`w-full flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 dark:bg-dark-bg-card hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white transition-colors rounded-sm !${className}`} onClick={() => { dispatch(toggleCustomDesignerPopup({ isOpen: true, customTemplate: `${customFieldMaster}.customElements` })); }}>
          <Component className="h-4 w-4" />
          <span>{Label}</span>
        </button>
      </div>
    );
  }
);

// Set display name for better debugging
CustomDesignerButton.displayName = 'CustomDesignerButton';
export default CustomDesignerButton;