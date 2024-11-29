import { useState, useCallback } from 'react'
import { useAppSelector } from './useAppDispatch';
import { RootState } from '../../redux/store';
import { ApplicationSettingsType } from '../../pages/settings/system/application-settings-types/application-settings-types';
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { handleResponse } from '../HandleResponse';

export const useApplicationMainSettings = () => {
    const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
    const [settings, setSettings] = useState<ApplicationSettingsType>(applicationSettings);

    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const api = new APIClient();

    const verifyOtp = useCallback(async () => {
        setOtpVerifying(true);
        try {
            const response = await api.post(Urls.ValidateToken, {
                email: settings?.mainSettings?.oTPEmail,
                token: settings?.mainSettings?.oTPVerification,
            });
            setOtpVerifying(false);
            return handleResponse(response);
        } catch (error) {
            setOtpVerifying(false);
            console.error("Error verifying OTP:", error);
            throw error;
        }
    }, [settings?.mainSettings?.oTPEmail, settings?.mainSettings?.oTPVerification]);

    const sendOtp = useCallback(async () => {
        try {
            setOtpSending(true);
            const response = await api.post(Urls.SendEmailToken, {
                email: settings?.mainSettings?.oTPEmail,
            });
            setOtpSending(false);
            return handleResponse(response);
        } catch (error) {
            setOtpSending(false);
            console.error("Error sending OTP:", error);
            throw error;
        }
    }, [settings?.mainSettings?.oTPEmail]);



    return {
        settings,
        setSettings,
        verifyOtp,
        sendOtp,
        otpSending,
        otpVerifying


    };
};