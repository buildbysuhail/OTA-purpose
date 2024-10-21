import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { ERPFormButtons } from '../../../components/ERPComponents/erp-form-buttons';
import { toggleEWayBillTaxPro } from '../../../redux/slices/popup-reducer';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';

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
        isEdit,
        handleSubmit,
        handleClear,
        handleFieldChange,
        getFieldProps,
        isLoading
    } = useFormManager<EWBTaxProData>({
        url: Urls.eWayBill,
        onSuccess: useCallback(
            () => dispatch(toggleEWayBillTaxPro({ isOpen: false, key: null })),
            [dispatch]
        ),
        key: rootState.PopupData.eWayBillTaxPro?.key,
        useApiClient: true,
        initialData: initialEWBTaxProData
    });

    const onClose = useCallback(() => {
        dispatch(toggleEWayBillTaxPro({ isOpen: false, key: null }));
    }, []);

    return (
        <div className="w-full pt-4">
            <div className="flex flex-center justify-between gap-3">
                <div className='w-2/4 border p-4 rounded-lg flex flex-col  gap-5'>
                    <h3 className="font-semibold text-sm mb-3">E-WayBill API Setting</h3>
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.ewbClientId')}
                        label="Client ID"
                        placeholder="Enter Client ID"
                        required={false}
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbClientId', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.ewbClientSecret')}
                        label="Client Secret"
                        placeholder="Enter Client Secret"
                        type="password"
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbClientSecret', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.ewbgspUserID')}
                        label="GSP User ID"
                        placeholder="Enter GSP User ID"
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbgspUserID', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.aspUserId')}
                        label="ASP User ID"
                        placeholder="Enter ASP User ID"
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.aspUserId', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.aspPassword')}
                        label="ASP Password"
                        placeholder="Enter ASP Password"
                        type="password"
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.aspPassword', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.authUrl')}
                        label="Auth URL"
                        placeholder="Enter Auth URL"
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.authUrl', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiSetting.baseUrl')}
                        label="Base URL"
                        placeholder="Enter Base URL"
                        onChangeData={(data: any) => handleFieldChange('ewbApiSetting.baseUrl', data)}
                    />
                </div>
                <div className='w-2/4 border p-4 rounded-lg flex flex-col gap-5'>
                    <h3 className="font-semibold text-sm">E-WayBill API Login Details</h3>
                    <ERPInput
                        {...getFieldProps('ewbApiLoginDetails.ewbGstin')}
                        label="GSTIN"
                        placeholder="Enter GSTIN"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbGstin', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiLoginDetails.ewbUserID')}
                        label="EWB User ID"
                        placeholder="Enter EWB User ID"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbUserID', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiLoginDetails.ewbPassword')}
                        label="EWB Password"
                        placeholder="Enter EWB Password"
                        type="password"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbPassword', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiLoginDetails.ewbAppKey')}
                        label="App Key"
                        placeholder="Enter App Key"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbAppKey', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiLoginDetails.ewbAuthToken')}
                        label="Auth Token"
                        placeholder="Enter Auth Token"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbAuthToken', data)}
                    />
                    <ERPDateInput
                        {...getFieldProps('ewbApiLoginDetails.ewbTokenExp')}
                        label="Token Expiry"
                        required={true}
                        placeholder="Enter Token Expiry"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbTokenExp', data)}
                    />
                    <ERPInput
                        {...getFieldProps('ewbApiLoginDetails.ewbSEK')}
                        label="SEK"
                        placeholder="Enter SEK"
                        onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbSEK', data)}
                    />
                </div>
            </div>
            <ERPFormButtons
                onClear={handleClear}
                isEdit={isEdit}
                isLoading={isLoading}
                onCancel={onClose}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default EWBTaxPro;
