import { useState, useCallback } from 'react'
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { handleResponse } from '../HandleResponse';

export const useApplicationMainSettings = (settings?: any) => {

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
        verifyOtp,
        sendOtp,
        otpSending,
        otpVerifying


    };
};