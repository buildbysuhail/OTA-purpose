import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleResponse } from '../../utilities/HandleResponse';
import Urls from '../../redux/urls';
import ERPModal from '../../components/ERPComponents/erp-modal';
import ERPButton from '../../components/ERPComponents/erp-button';
import ERPInput from '../../components/ERPComponents/erp-input';
import ERPDataCombobox from '../../components/ERPComponents/erp-data-combobox';
import ERPRadio from '../../components/ERPComponents/erp-radio';
import { APIClient } from '../../helpers/api-client';
import { useTranslation } from 'react-i18next';
import { ResponseModelWithValidation } from '../../base/response-model';
import { postAction } from '../../redux/slices/app-thunks';
import { RootState } from '../../redux/store';

interface UserForm {
    userName: string;
    email: string;
    phoneNumber: string;
    displayName: string;
    userTypeCode: string;
    counterID: number;
    employeeID: number;
    maxDiscPercAllowed: number | null;
    passkey: string;
    Passwd: string;
    confrimPassword: string;
}

interface NewUserForm extends UserForm { }

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [mode, setMode] = useState<'new' | 'existing'>('new');
    const [isLoading, setIsLoading] = useState(false);
    const [existingUser, setExistingUser] = useState<number>(0);
    const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
    const [newUserForm, setNewUserForm] = useState<NewUserForm>({
        userName: '',
        Passwd: 'hjoi',
        confrimPassword: '',
        email: '',
        phoneNumber: '',
        displayName: '',
        userTypeCode: '',
        counterID: 0,
        employeeID: 0,
        maxDiscPercAllowed: null,
        passkey: ''
    });
    const [existingUserForm, setExistingUserForm] = useState<UserForm>({
        userName: '',
        email: '',
        phoneNumber: '',
        displayName: '',
        userTypeCode: '',
        counterID: 0,
        employeeID: 0,
        maxDiscPercAllowed: null,
        passkey: '',
        Passwd: '',
        confrimPassword: '',
    });
    const formData = mode === 'new' ? newUserForm : existingUserForm;
    const { t } = useTranslation("userManage");
    const dispatch = useDispatch();
    const apiClient = new APIClient();
    const handleFieldChange = useCallback((field: string, value: any) => {
        if (mode === 'new') {
            setNewUserForm(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            setExistingUserForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    }, [mode]);

    const handlleUserSelect = async (userData: any) => {
        try {
            console.log(userData);
            const hygu = userData.value
            setExistingUser(hygu);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };

    const handleClear = () => {
        if (mode === 'new') {
            setNewUserForm({
                userName: '',
                Passwd: '',
                confrimPassword: '',
                email: '',
                phoneNumber: '',
                displayName: '',
                userTypeCode: '',
                counterID: 0,
                employeeID: 0,
                maxDiscPercAllowed: null,
                passkey: ''
            });
        } else {
            setExistingUserForm({
                userName: '',
                email: '',
                phoneNumber: '',
                displayName: '',
                userTypeCode: '',
                counterID: 0,
                employeeID: 0,
                maxDiscPercAllowed: null,
                passkey: '',
                Passwd: '',
                confrimPassword: '',
            });
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiClient.getAsync(`${Urls.Users}${existingUser}`)
                const userData = {
                    userName: response?.userName || '',
                    email: response?.email || '',
                    phoneNumber: response?.phoneNumber || '',
                    displayName: response?.displayName || '',
                    userTypeCode: response?.userTypeCode || '',
                    counterID: response?.counterID || 0,
                    employeeID: response?.employeeID || 0,
                    maxDiscPercAllowed: response?.maxDiscPercAllowed || null,
                    passkey: response?.passkey || '',
                    Passwd: '',
                    confrimPassword: '',
                };
                setExistingUserForm(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        if (existingUser) {
            fetchUserData();
        }
    }, [existingUser]);

    const handleInvite = async () => {
        setIsLoading(true);
        try {
            const response: ResponseModelWithValidation<any, any> = await dispatch(
                postAction({
                    apiUrl: Urls.invite_link,
                    data: {
                        ...formData,
                        mode,
                        userId: existingUser

                    }
                }) as any
            ).unwrap();
            handleResponse(response, () => {
                onSuccess?.();
                handleClose();
            });
        } catch (error) {
            console.error('Failed to send invitation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        handleClear();
        setMode('new');
        onClose();
    };

    return (
        <ERPModal
            isOpen={isOpen}
            closeModal={handleClose}
            title={mode === 'new' ? t('invite_new_user') : t('invite_existing_user')}
            content={<div className="space-y-4">
                <div className="flex space-x-4 mb-6 ml-2 gap-4">
                    {existingUser}
                    <ERPRadio
                        id="newUser"
                        name="mode"
                        value="new"
                        label={t("new_user")}
                        checked={mode === 'new'}
                        onChange={() => setMode('new')}
                        className="flex items-center space-x-2"
                    />
                    <ERPRadio
                        id="existingUser"
                        name="mode"
                        value="existing"
                        label={t("existing_user")}
                        checked={mode === 'existing'}
                        onChange={() => setMode('existing')}
                        className="flex items-center space-x-2"
                    />
                </div>

                {
                    mode === 'existing' && (
                        <ERPDataCombobox
                            id="userId"
                            field={{
                                id: 'userId',
                                required: true,
                                getListUrl: Urls.data_users,
                                valueKey: 'name',
                                labelKey: 'name',
                            }}
                            value={existingUser}
                            label={t('select_user')}
                            required={true}
                            data={formData}
                            onSelectItem={(data: any) => { handlleUserSelect(data); }}
                        />
                    )
                }

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ERPInput
                        value={formData.userName}
                        label={t('username')}
                        placeholder={t('username')}
                        // disabled={mode === 'existing'}
                        required={true}
                        onChange={(e: any) => handleFieldChange('userName', e.target.value)}
                        id={'userName'}
                    />

                    {
                        mode === 'new' && (
                            <>
                                <ERPInput
                                    value={formData.Passwd ?? ''}
                                    onChange={(e: any) => handleFieldChange('Passwd', e.target.value)}
                                    label={t('password')}
                                    type="password"
                                    placeholder={t('password')}
                                    required={true}
                                    id={'Passwd'}
                                />

                                <ERPInput
                                    value={formData.confrimPassword ?? ''}
                                    onChange={(e: any) => handleFieldChange('confrimPassword', e.target.value)}
                                    label={t('confirm_password')}
                                    type="password"
                                    placeholder={t('confirm_password')}
                                    required={true}
                                    id={'confrimPassword'}
                                />
                            </>
                        )
                    }

                    <ERPInput
                        value={formData.email}
                        onChange={(e: any) => handleFieldChange('email', e.target.value)}
                        label={t('email')}
                        type="email"
                        // disabled={mode === 'existing'}
                        placeholder={t('email')}
                        required={true}
                        id={'email'}
                    />

                    <ERPInput
                        value={formData.phoneNumber}
                        onChange={(e: any) => handleFieldChange('phoneNumber', e.target.value)}
                        label={t('mobile')}
                        placeholder={t('mobile')}
                        // disabled={mode === 'existing'}
                        required={false}
                        id={'phoneNumber'}
                    />

                    <ERPInput
                        value={formData.displayName}
                        onChange={(e: any) => handleFieldChange('displayName', e.target.value)}
                        label={t('name')}
                        placeholder={t('name')}
                        // disabled={mode === 'existing'}
                        required={true}
                        id={'displayName'}
                    />

                    <ERPDataCombobox
                        value={formData.userTypeCode}
                        id="userTypeCode"
                        field={{
                            id: 'userTypeCode',
                            required: true,
                            getListUrl: Urls.data_user_types,
                            valueKey: 'id',
                            labelKey: 'name',
                        }}
                        data={formData}
                        // disabled={mode === 'existing'}
                        label={t('usertype')}
                        required={true}
                        onChangeData={(data: any) => handleFieldChange('userTypeCode', data.userTypeCode)}
                    />

                    {
                        applicationSettings.accountsSettings?.allowSalesCounter &&
                        <ERPDataCombobox
                            value={formData.counterID}
                            id="counterID"
                            field={{
                                id: 'counterID',
                                required: true,
                                getListUrl: Urls.data_counters,
                                valueKey: 'id',
                                labelKey: 'name',
                            }}

                            data={formData}
                            label={t('counter')}
                            // disabled={mode === 'existing'}
                            required={true}
                            onChangeData={(data: any) => handleFieldChange('counterID', data.counterID)}
                        />
                    }

                    <ERPDataCombobox
                        value={formData.employeeID}
                        id="employeeID"
                        field={{
                            id: 'employeeID',
                            required: true,
                            getListUrl: Urls.data_employees,
                            valueKey: 'id',
                            labelKey: 'name',
                        }}
                        data={formData}
                        label={t('employee')}
                        // disabled={mode === 'existing'}
                        required={true}
                        onChangeData={(data: any) => handleFieldChange('employeeID', data.employeeID)}
                    />

                    <ERPInput
                        value={formData.maxDiscPercAllowed}
                        onChange={(e: any) => handleFieldChange('maxDiscPercAllowed', parseInt(e.target.value))}
                        label={t('max_dis%')}
                        type="number"
                        min={0}
                        placeholder={t('max_dis%')}
                        // disabled={mode === 'existing'}
                        required={false}
                        id={'maxDiscPercAllowed'}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <ERPButton
                        title={t("clear")}
                        variant="secondary"
                        onClick={handleClear}
                    />
                    <ERPButton
                        title={t("cancel")}
                        variant="secondary"
                        onClick={handleClose}
                    />
                    <ERPButton
                        title={t("invite")}
                        variant="primary"
                        onClick={handleInvite}
                        disabled={isLoading}
                    />
                </div>
            </div>}
            width={600}
            height={600}
            isButton={false}
            hasSubmit={false}
        />
    );
};

export default InviteModal;