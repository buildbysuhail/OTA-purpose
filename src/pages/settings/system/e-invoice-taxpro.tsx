import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { ERPFormButtons } from '../../../components/ERPComponents/erp-form-buttons';
import { toggleEInvoiceGST } from '../../../redux/slices/popup-reducer';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { ActionType } from '../../../redux/types';

type EInvoiceTaxProData = {
    eInvApiSetting: {
        gspName: string;
        aspUserId: string;
        aspPassword: string;
        client_id: string;
        client_secret: string;
        authUrl: string;
        baseUrl: string;
        ewbByIRN: string;
        cancelEwbUrl: string;
    };
    eInvApiLoginDetails: {
        userName: string;
        password: string;
        gstin: string;
        appKey: string;
        authToken: string;
        sek: string;
        e_InvoiceTokenExp: string;
    };
};

const initialEInvoiceTaxProData: EInvoiceTaxProData = {
    eInvApiSetting: {
        gspName: '',
        aspUserId: '',
        aspPassword: '',
        client_id: '',
        client_secret: '',
        authUrl: '',
        baseUrl: '',
        ewbByIRN: '',
        cancelEwbUrl: ''
    },
    eInvApiLoginDetails: {
        userName: '',
        password: '',
        gstin: '',
        appKey: '',
        authToken: '',
        sek: '',
        e_InvoiceTokenExp: ''
    }
};

const EInvoiceTaxPro = () => {
    const rootState = useRootState();
    const dispatch = useDispatch();

    const {
        isEdit,
        handleSubmit,
        handleClear,
        handleFieldChange,
        getFieldProps,
        isLoading
    } = useFormManager<EInvoiceTaxProData>({
        url: Urls.eInvoiceGST,
        onSuccess: useCallback(
            () => dispatch(toggleEInvoiceGST({ isOpen: false, key: null })),
            [dispatch]
        ),
        loadDataRequired:true,
        method:ActionType.POST,
        key: rootState.PopupData.eInvoiceGST?.key,
        useApiClient: true,
        initialData: initialEInvoiceTaxProData
    });

    const onClose = useCallback(() => {
        dispatch(toggleEInvoiceGST({ isOpen: false, key: null }));
    }, [dispatch]);

    return (
        <div className="w-full pt-2">
            <div className='flex items-stretch gap-3'>
                <div className="w-2/4">
                    <h3 className="font-semibold text-sm mb-3 ml-2">E-Invoice API Setting</h3>
                    <div className=' p-4 rounded-lg flex flex-col gap-5 flex-grow'>
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.client_id')}
                            label="Client ID"
                            placeholder="Enter Client ID"
                            readOnly
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.client_id', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.client_secret')}
                            label="Client Secret"
                            placeholder="Enter Client Secret"
                            type="password"
                            readOnly
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.client_secret', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.gspName')}
                            label="GSP Name"
                            placeholder="Enter GSP Name"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.gspName', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.aspUserId')}
                            label="ASP User ID"
                            placeholder="Enter ASP User ID"
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.aspUserId', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.aspPassword')}
                            label="ASP Password"
                            required
                            placeholder="Enter ASP Password"
                            type="password"
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.aspPassword', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.authUrl')}
                            label="Auth URL"
                            placeholder="Enter Auth URL"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.authUrl', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.baseUrl')}
                            label="Base URL"
                            placeholder="Enter Base URL"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.baseUrl', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.ewbByIRN')}
                            label="EWB URL"
                            placeholder="Enter EWB URL"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.ewbByIRN', data)}
                        />
                    </div>
                </div>
                <div className='w-2/4'>
                    <h3 className="font-semibold text-sm mb-3 ml-2">E-Invoice API Login Details</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5 flex-grow'>
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.userName')}
                            label="Username"
                            placeholder="Enter Username"
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.userName', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.password')}
                            label="Password"
                            placeholder="Enter Password"
                            type="password"
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.password', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.gstin')}
                            label="GSTIN"
                            placeholder="Enter GSTIN"
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.gstin', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.appKey')}
                            label="App Key"
                            placeholder="Enter App Key"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.appKey', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.authToken')}
                            label="Auth Token"
                            placeholder="Enter Auth Token"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.authToken', data)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.sek')}
                            label="SEK"
                            placeholder="Enter SEK"
                            readOnly
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.sek', data)}
                        />
                        <ERPDateInput
                            {...getFieldProps('eInvApiLoginDetails.e_InvoiceTokenExp')}
                            label="Token Expiry"
                            required={true}
                            placeholder="Enter Token Expiry"
                            disabled
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.e_InvoiceTokenExp', data)}
                        />
                    </div>
                    <ERPInput
                        {...getFieldProps('eInvApiSetting.cancelEwbUrl')}
                        label="Cancel EWB URL"
                        placeholder="Enter Cancel EWB URL"
                        readOnly
                        onChangeData={(data: any) => handleFieldChange('eInvApiSetting.cancelEwbUrl', data)}
                    />
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

export default EInvoiceTaxPro;