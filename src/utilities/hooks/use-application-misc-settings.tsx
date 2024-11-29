import { useState, ReactNode } from 'react'
import { useAppSelector } from './useAppDispatch';
import { RootState } from '../../redux/store';
import { ApplicationSettingsType } from '../../pages/settings/system/application-settings-types/application-settings-types';
import { APIClient } from '../../helpers/api-client';

export const useApplicationMiscSettings = () => {

    const [systemCode, setSystemCode] = useState<systemCode[]>([]);
    const [loadSystemCode, setLoadSystemCode] = useState(false);
    const [isSavingSystemCode, setIsSavingSystemCode] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [addSystemCode, setAddSystemCode] = useState(false);
    const [SystemCodeAddData, setSystemCodeAddData] = useState<systemCode>({
        systemCode: "",
    });

    const handleShowComponent = (component: 'eInvoice' | 'ewb') => {
        if (component === 'eInvoice') {
            setShowEInvoicePopup(true);
        } else if (component === 'ewb') {
            setShowEWBPopup(true);
        }
    };
    const getSystemCode = async () => {
        setLoadSystemCode(true);
        try {
          const response = await api.getAsync(
            `${Urls.application_setting}GetSyncSystemCode`
          );
          setSystemCode(response);
          setDataLoaded(true);
        } catch (error) {
          console.error("Error get System Code settings:", error);
        } finally {
          setLoadSystemCode(false);
        }
      };
    
      const postSystemCode = async () => {
        setIsSavingSystemCode(true);
        const updatedSystemCodes = [...systemCode, SystemCodeAddData];
        setSystemCodeAddData({
          systemCode: "",
        });
        setAddSystemCode(false);
        try {
          const response = await api.post(
            `${Urls.application_settings}UpdateSyncSystemCode`,
            updatedSystemCodes
          );
          handleResponse(response);
          getSystemCode();
        } catch (error) {
          console.error("Error post System Code settings:", error);
        } finally {
          setIsSavingSystemCode(false);
        }
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