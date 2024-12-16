import { useState, useCallback } from 'react'
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { handleResponse } from '../HandleResponse';
import { useAppSelector } from './useAppDispatch';
import { RootState } from '../../redux/store';

export const useApplicationMainSettings = (settings?: any) => {

    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const _settings = useAppSelector((state: RootState) => state.ApplicationSettings);
    const api = new APIClient();

    const verifyOtp = useCallback(async () => {
        setOtpVerifying(true);
        try {
            const response = await api.post(Urls.ValidateToken, {
                email: _settings?.mainSettings?.oTPEmail,
                token: _settings?.mainSettings?.oTPVerification,
            });
            setOtpVerifying(false);
            return handleResponse(response);
        } catch (error) {
            setOtpVerifying(false);
            console.error("Error verifying OTP:", error);
            throw error;
        }
    }, [_settings?.mainSettings?.oTPEmail, _settings?.mainSettings?.oTPVerification]);

    const sendOtp = useCallback(async () => {
        debugger;
        console.log(settings?.mainSettings);
        
        debugger;
        try {
            setOtpSending(true);
            const response = await api.post(Urls.SendEmailToken, {
                email: _settings?.mainSettings?.oTPEmail,
            });
            setOtpSending(false);
            return handleResponse(response);
        } catch (error) {
            setOtpSending(false);
            console.error("Error sending OTP:", error);
            throw error;
        }
    }, [_settings?.mainSettings?.oTPEmail]);



    return {
        verifyOtp,
        sendOtp,
        otpSending,
        otpVerifying


    };
};