import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { toggleEInvoiceGST } from '../../../redux/slices/popup-reducer';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { ActionType } from '../../../redux/types';
import { useTranslation } from 'react-i18next';

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

const initialEInvoiceTaxProData = {
    data: {
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
    },
    validations: {
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
    }
};

const EInvoiceTaxPro = () => {
    const rootState = useRootState();
    const dispatch = useDispatch();
    const { t } = useTranslation('applicationSettings')

    const {
        handleSubmit,
        handleFieldChange,
        getFieldProps
    } = useFormManager<EInvoiceTaxProData>({
        url: Urls.eInvoiceGST,
        onSuccess: useCallback(
            () => dispatch(toggleEInvoiceGST({ isOpen: false, key: null, reload: false })),
            [dispatch]
        ),
        loadDataRequired: true,
        method: ActionType.POST,
        key: rootState.PopupData.eInvoiceGST?.key,
        useApiClient: true,
        initialData: initialEInvoiceTaxProData
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="w-full pt-2">
            <div className='flex items-stretch gap-3'>
                <div className="w-2/4">
                    <h3 className="font-semibold text-sm mb-3 ml-2">{t('e_invoice_api_setting')}</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5 flex-grow'>
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.client_id')}
                            label={t('client_id')}
                            placeholder={t('enter_client_id')}
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.client_id', data?.eInvApiSetting?.client_id)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.client_secret')}
                            label={t('client_secret')}
                            placeholder={t('enter_client_secret')}
                            type="password"
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.client_secret', data?.eInvApiSetting?.client_secret)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.gspName')}
                            label={t('gsp_name')}
                            placeholder={t('enter_gsp_name')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.gspName', data?.eInvApiSetting?.gspName)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.aspUserId')}
                            label={t('asp_user_id')}
                            placeholder={t('enter_asp_user_id')}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.aspUserId', data.eInvApiSetting.aspUserId)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.aspPassword')}
                            label={t('asp_password')}
                            required
                            placeholder={t('enter_asp_password')}
                            type="password"
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.aspPassword', data.eInvApiSetting.aspPassword)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.authUrl')}
                            label={t('auth_url')}
                            placeholder={t('enter_auth_url')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.authUrl', data?.eInvApiSetting?.authUrl)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.baseUrl')}
                            label={t('base_url')}
                            placeholder={t('enter_base_url')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.baseUrl', data?.eInvApiSetting?.baseUrl)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.ewbByIRN')}
                            label={t('ewb_url')}
                            placeholder={t('enter_ewb_url')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.ewbByIRN', data?.eInvApiSetting?.ewbByIRN)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiSetting.cancelEwbUrl')}
                            label={t('cancel_ewb_url')}
                            placeholder={t('enter_cancel_ewb_url')}
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('eInvApiSetting.cancelEwbUrl', data?.eInvApiSetting?.cancelEwbUrl)}
                        />
                    </div>
                </div>
                <div className='w-2/4'>
                    <h3 className="font-semibold text-sm mb-3 ml-2">{t('e_invoice_api_login_details')}</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5 flex-grow'>
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.userName')}
                            label={t('username')}
                            placeholder={t('enter_username')}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.userName', data.eInvApiLoginDetails.userName)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.password')}
                            label={t('password')}
                            placeholder={t('enter_password')}
                            type="password"
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.password', data.eInvApiLoginDetails.password)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.gstin')}
                            label={t('gstin')}
                            placeholder={t('enter_gstin')}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.gstin', data.eInvApiLoginDetails.gstin)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.appKey')}
                            label={t('app_key')}
                            placeholder={t('enter_app_key')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.appKey', data?.eInvApiLoginDetails?.appKey)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.authToken')}
                            label={t('auth_token')}
                            placeholder={t('enter_auth_token')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.authToken', data?.eInvApiLoginDetails?.authToken)}
                        />
                        <ERPInput
                            {...getFieldProps('eInvApiLoginDetails.sek')}
                            label={t('sek')}
                            placeholder={t('enter_sek')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.sek', data?.eInvApiLoginDetails?.sek)}
                        />
                        <ERPDateInput
                            {...getFieldProps('eInvApiLoginDetails.e_InvoiceTokenExp')}
                            label={t('token_expiry')}
                            required={true}
                            placeholder={t('enter_token_expiry')}
                            readonly
                            onChangeData={(data: any) => handleFieldChange('eInvApiLoginDetails.e_InvoiceTokenExp', data?.eInvApiLoginDetails?.e_InvoiceTokenExp)}
                        />
                    </div>
                </div>
            </div>
            <div className='text-end mt-3'>
                <ERPButton
                    className="justify-self-end"
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    title={t('save')}
                />
            </div>
        </div >
    );
};

export default EInvoiceTaxPro;