import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { toggleEWayBillTaxPro } from '../../../redux/slices/popup-reducer';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { ActionType } from '../../../redux/types';

type EWBTaxProData = {
    ewbApiSetting: {
        gspName: string;
        aspUserId: string;
        aspPassword: string;
        ewbClientId: string;
        ewbClientSecret: string;
        ewbgspUserID: string;
        authUrl: string;
        baseUrl: string;
        aspUrl: string;
    };
    ewbApiLoginDetails: {
        ewbGstin: string;
        ewbUserID: string;
        ewbPassword: string;
        ewbAppKey: string;
        ewbAuthToken: string;
        ewbTokenExp: string;
        ewbSEK: string;
    };
};

const initialEWBTaxProData: EWBTaxProData = {
    ewbApiSetting: {
        gspName: '',
        aspUserId: '',
        aspPassword: '',
        ewbClientId: '',
        ewbClientSecret: '',
        ewbgspUserID: '',
        authUrl: '',
        baseUrl: '',
        aspUrl: ''
    },
    ewbApiLoginDetails: {
        ewbGstin: '',
        ewbUserID: '',
        ewbPassword: '',
        ewbAppKey: '',
        ewbAuthToken: '',
        ewbTokenExp: '',
        ewbSEK: ''
    }
};

const EWBTaxPro = () => {
    const rootState = useRootState();
    const dispatch = useDispatch();

    const {
        handleSubmit,
        handleFieldChange,
        getFieldProps
    } = useFormManager<EWBTaxProData>({
        url: Urls.eWayBill,
        onSuccess: useCallback(
            () => dispatch(toggleEWayBillTaxPro({ isOpen: false, key: null })),
            [dispatch]
        ),
        loadDataRequired: true,
        method: ActionType.POST,
        key: rootState.PopupData.eWayBillTaxPro?.key,
        useApiClient: true,
        initialData: initialEWBTaxProData
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="w-full pt-2">
            <div className='flex align-center gap-3'>
                <div className='w-2/4'>
                    <h3 className="font-semibold text-sm mb-3 ml-2">E-WayBill API Setting</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5'>
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.ewbClientId')}
                            label="Client ID"
                            placeholder="Enter Client ID"
                            //readOnly
                            style={{ color: 'black' }}
                            required={false}
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbClientId', data.ewbApiSetting.ewbClientId)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.ewbClientSecret')}
                            label="Client Secret"
                            placeholder="Enter Client Secret"
                            //readOnly
                            style={{ color: 'black' }}
                            type="password"
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbClientSecret', data?.ewbApiSetting?.ewbClientSecret)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.ewbgspUserID')}
                            label="GSP User ID"
                            placeholder="Enter GSP User ID"
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbgspUserID', data?.ewbApiSetting?.ewbgspUserID)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.gspName')}
                            label="GSP Name"
                            placeholder="Enter GSP Name"
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.gspName', data?.ewbApiSetting?.gspName)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.aspUserId')}
                            label="ASP User ID"
                            placeholder="Enter ASP User ID"
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.aspUserId', data.ewbApiSetting.aspUserId)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.aspPassword')}
                            label="ASP Password"
                            placeholder="Enter ASP Password"
                            required
                            type="password"
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.aspPassword', data.ewbApiSetting.aspPassword)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.baseUrl')}
                            label="Base URL"
                            placeholder="Enter Base URL"
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.baseUrl', data?.ewbApiSetting?.baseUrl)}
                        />
                    </div>
                </div>
                <div className='w-2/4'>
                    <h3 className="font-semibold text-sm mb-3 ml-2">E-WayBill API Setting</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5'>
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbGstin')}
                            label="GSTIN"
                            placeholder="Enter GSTIN"
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbGstin', data.ewbApiLoginDetails.ewbGstin)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbUserID')}
                            label="EWB User ID"
                            placeholder="Enter EWB User ID"
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbUserID', data.ewbApiLoginDetails.ewbUserID)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbPassword')}
                            label="EWB Password"
                            placeholder="Enter EWB Password"
                            type="password"
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbPassword', data.ewbApiLoginDetails.ewbPassword)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbAppKey')}
                            label="App Key"
                            placeholder="Enter App Key"
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbAppKey', data?.ewbApiLoginDetails.ewbAppKey)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbAuthToken')}
                            label="Auth Token"
                            placeholder="Enter Auth Token"
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbAuthToken', data?.ewbApiLoginDetails?.ewbAuthToken)}
                        />
                        <ERPDateInput
                            {...getFieldProps('ewbApiLoginDetails.ewbTokenExp')}
                            label="Token Expiry"
                            required={true}
                            placeholder="Enter Token Expiry"
                            readonly
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbTokenExp', data?.ewbApiLoginDetails?.ewbTokenExp)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbSEK')}
                            label="SEK"
                            placeholder="Enter SEK"
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbSEK', data?.ewbApiLoginDetails?.ewbSEK)}
                        />
                    </div>
                </div>
            </div>
            <div className='text-right mt-3'>
                <ERPButton
                    className="justify-self-end"
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    title="Save"
                ></ERPButton>
            </div>
        </div >
    );
};

export default EWBTaxPro;
