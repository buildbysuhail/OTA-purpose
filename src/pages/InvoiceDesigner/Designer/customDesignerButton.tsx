import React, { useRef, useState, forwardRef, Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { useDispatch } from 'react-redux';
import { toggleCustomDesignerPopup } from '../../../redux/slices/popup-reducer';
import { Component, EllipsisVertical, ListPlus, Printer } from 'lucide-react';
import { AnyAction } from 'redux';

// Define the props interface
interface CustomDesignerButtonProps {
  Label: string;
  dispatch: Dispatch<AnyAction>;
  className?: string;
  customFieldMaster:string;

}

// Create the component with forwardRef
const CustomDesignerButton = forwardRef<HTMLButtonElement, CustomDesignerButtonProps>(
  ({ Label,dispatch,customFieldMaster,className}) => {

    return (
      <div className="relative">
                    <button
                      className={`w-full flex items-center justify-center gap-3 px-4 py-2 bg-gray-200  hover:bg-gray-400 hover:text-black transition-colors rounded-sm !${className}`}
                     onClick={() => { dispatch(toggleCustomDesignerPopup({ isOpen: true,customTemplate:`${customFieldMaster}.customElements` })); }}
                     >
                      <Component  className="h-4 w-4" />
                      <span>{Label}</span>
                    </button>
      </div>
    );
  }
);

// Set display name for better debugging
CustomDesignerButton.displayName = 'CustomDesignerButton';

export default CustomDesignerButton;