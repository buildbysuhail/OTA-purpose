import { useState, useCallback } from 'react'
import { useAppSelector } from './useAppDispatch';
import { RootState } from '../../redux/store';
import { ApplicationSettingsType } from '../../pages/settings/system/application-settings-types/application-settings-types';
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { handleResponse } from '../HandleResponse';
import { ApplicationMainSettings } from '../../pages/settings/system/application-settings-types/application-settings-types-main';

export const useApplicationMainSettings = () => {
    const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
    const [settings, setSettings] = useState<ApplicationSettingsType>(applicationSettings);
    const api = new APIClient();

    const verifyOtp = useCallback(async () => {
        try {
            const response = await api.post(Urls.ValidateToken, {
                email: settings?.mainSettings?.oTPEmail,
                token: settings?.mainSettings?.oTPVerification,
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw error;
        }
    }, [settings?.mainSettings?.oTPEmail, settings?.mainSettings?.oTPVerification]);

    const sendOtp = useCallback(async () => {
        try {
            const response = await api.post(Urls.SendEmailToken, {
                email: settings?.mainSettings?.oTPEmail,
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw error;
        }
    }, [settings?.mainSettings?.oTPEmail]);



    return {
        settings,
        setSettings,
        verifyOtp,
        sendOtp

    };
};