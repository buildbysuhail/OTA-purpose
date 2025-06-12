import React, { useRef, useState, forwardRef, Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { useDispatch } from 'react-redux';
import { toggleCustomDesignerPopup } from '../../../redux/slices/popup-reducer';
import { Component, EllipsisVertical, ListPlus, Printer } from 'lucide-react';
import { AnyAction } from 'redux';

// Define the props interface
interface CustomDesignerButtonProps {
  LabelBefore: string;
  LabelAfter: string;
  dispatch: Dispatch<AnyAction>;
  t: any;
  className?: string;
  customFieldMaster:string;

}

// Create the component with forwardRef
const CustomDesignerButton = forwardRef<HTMLButtonElement, CustomDesignerButtonProps>(
  ({ LabelBefore, LabelAfter,dispatch,t,className,
customFieldMaster,                    
   }, ref) => {
    const CusbuttonRef = useRef<HTMLButtonElement | null>(null);
    const CuspopupRef = useRef<HTMLDivElement | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);


    return (
      <div className="relative">
        <button
          ref={ref || CusbuttonRef} // Use the forwarded ref if provided, otherwise fallback to local ref
          onClick={() => setIsPopupVisible((prev) => !prev)}
          className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors"
          title={t("add_custom")}
        >
          <ListPlus className="w-3 h-3 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
        </button>

        {isPopupVisible && (
          <div
            ref={CuspopupRef}
            className="absolute rounded-sm dark:bg-dark-bg dark:text-dark-text bg-gray-100 shadow-lg p-4 z-50 "
            style={{
              top: '100%',
              left: '-211px',
              width: '251px',
              marginTop: '10px',
            }}
          >
            <nav className="w-full dark:bg-dark-bg dark:text-dark-text bg-gray-100 text-black">
              <ul className="space-y-1">
              
                   <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-400 hover:text-black transition-colors rounded-sm"
                     onClick={() => { dispatch(toggleCustomDesignerPopup({ isOpen: true,customTemplate:`${customFieldMaster}.customTop` })); }}
                     >
                      <Component  className="h-4 w-4" />
                      <span>{LabelBefore}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-400 hover:text-black transition-colors rounded-sm"
                     onClick={() => { dispatch(toggleCustomDesignerPopup({ isOpen: true,customTemplate:`${customFieldMaster}.customBottom`})); }}
                     >
                      <Component  className="h-4 w-4" />
                      <span>{LabelAfter}</span>
                    </button>
                  </li>
             
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  }
);

// Set display name for better debugging
CustomDesignerButton.displayName = 'CustomDesignerButton';

export default CustomDesignerButton;