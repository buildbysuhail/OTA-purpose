import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { toggleEWayBillTaxPro } from '../../../redux/slices/popup-reducer';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { ActionType } from '../../../redux/types';
import { useTranslation } from 'react-i18next';

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

const initialEWBTaxProData = {
    data: {
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
    },
    validations: {
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
    }
};

const EWBTaxPro = () => {
    const rootState = useRootState();
    const dispatch = useDispatch();
    const { t } = useTranslation('applicationSettings')
    const {
        handleSubmit,
        handleFieldChange,
        getFieldProps
    } = useFormManager<EWBTaxProData>({
        url: Urls.eWayBill,
        onSuccess: useCallback(
            () => dispatch(toggleEWayBillTaxPro({ isOpen: false, key: null, reload: false })),
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
                    <h3 className="font-semibold text-sm mb-3 ml-2">{t('e_way_bill_api_setting')}</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5'>
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.ewbClientId')}
                            label={t('client_id')}
                            placeholder={t('enter_client_id')}
                            //readOnly
                            style={{ color: 'black' }}
                            required={false}
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbClientId', data.ewbApiSetting.ewbClientId)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.ewbClientSecret')}
                            label={t('client_secret')}
                            placeholder={t('enter_client_secret')}
                            //readOnly
                            style={{ color: 'black' }}
                            type="password"
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbClientSecret', data?.ewbApiSetting?.ewbClientSecret)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.ewbgspUserID')}
                            label={t('gsp_user_id')}
                            placeholder={t('enter_gsp_user_id')}
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.ewbgspUserID', data?.ewbApiSetting?.ewbgspUserID)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.gspName')}
                            label={t('gsp_name')}
                            placeholder={t('enter_gsp_name')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.gspName', data?.ewbApiSetting?.gspName)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.aspUserId')}
                            label={t('asp_user_id')}
                            placeholder={t('enter_asp_user_id')}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.aspUserId', data.ewbApiSetting.aspUserId)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.aspPassword')}
                            label={t('asp_password')}
                            placeholder={t('enter_asp_password')}
                            required
                            type="password"
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.aspPassword', data.ewbApiSetting.aspPassword)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiSetting.baseUrl')}
                            label={t('base_url')}
                            placeholder={t('enter_base_url')}
                            //readOnly
                            style={{ color: 'black' }}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiSetting.baseUrl', data?.ewbApiSetting?.baseUrl)}
                        />
                    </div>
                </div>
                <div className='w-2/4'>
                    <h3 className="font-semibold text-sm mb-3 ml-2">{t('e_way_bill_api_setting')}</h3>
                    <div className='border p-4 rounded-lg flex flex-col gap-5'>
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbGstin')}
                            label={t('gstin')}
                            placeholder={t('enter_gstin')}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbGstin', data.ewbApiLoginDetails.ewbGstin)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbUserID')}
                            label={t('ewb_user_id')}
                            placeholder={t('enter_ewb_user_id')}
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbUserID', data.ewbApiLoginDetails.ewbUserID)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbPassword')}
                            label={t('ewb_password')}
                            placeholder={t('enter_ewb_password')}
                            type="password"
                            required
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbPassword', data.ewbApiLoginDetails.ewbPassword)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbAppKey')}
                            label={t("app_key")}
                            placeholder={t("enter_app_key")}
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbAppKey', data?.ewbApiLoginDetails.ewbAppKey)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbAuthToken')}
                            label={t("auth_token")}
                            placeholder={t("enter_auth_token")}
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbAuthToken', data?.ewbApiLoginDetails?.ewbAuthToken)}
                        />
                        <ERPDateInput
                            {...getFieldProps('ewbApiLoginDetails.ewbTokenExp')}
                            label={t("token_expiry")}
                            required={true}
                            placeholder={t("enter_token_expiry")}
                            readonly
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbTokenExp', data?.ewbApiLoginDetails?.ewbTokenExp)}
                        />
                        <ERPInput
                            {...getFieldProps('ewbApiLoginDetails.ewbSEK')}
                            label={t("sek")}
                            placeholder={t("enter_sek")}
                            //readOnly
                            style={{ color: 'black' }}
                            onChangeData={(data: any) => handleFieldChange('ewbApiLoginDetails.ewbSEK', data?.ewbApiLoginDetails?.ewbSEK)}
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
                    title={t("save")}
                />
            </div>
        </div >
    );
};

export default EWBTaxPro;
