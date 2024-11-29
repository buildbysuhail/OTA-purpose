import { useState, ReactNode } from 'react'
import { useAppSelector } from './useAppDispatch';
import { RootState } from '../../redux/store';
import { ApplicationSettingsType } from '../../pages/settings/system/application-settings-types/application-settings-types';
import { APIClient } from '../../helpers/api-client';

export const useApplicationGstSettings = () => {

    const [showEInvoicePopup, setShowEInvoicePopup] = useState<boolean>(false);
    const [showEWBPopup, setShowEWBPopup] = useState<boolean>(false);
    const handleShowComponent = (component: 'eInvoice' | 'ewb') => {
        if (component === 'eInvoice') {
            setShowEInvoicePopup(true);
        } else if (component === 'ewb') {
            setShowEWBPopup(true);
        }
    };
    interface PopupComponentProps {
        isOpen: boolean;
        onClose: () => void;
        children: ReactNode;
    }

    const PopupComponent: React.FC<PopupComponentProps> = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-6xl w-full min-h-[70vh] overflow-y-auto">
                    <div className="flex justify-start">
                        <i
                            onClick={onClose}
                            className="ri-arrow-left-line mr-2 rtl:mr-0 rtl:ml-2 rtl:ri-arrow-right-line cursor-pointer"
                            style={{ fontSize: "23px" }}>
                        </i>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    return {
        PopupComponent,
        showEInvoicePopup,
        showEWBPopup,
        setShowEInvoicePopup,
        setShowEWBPopup,
        handleShowComponent

    };
};