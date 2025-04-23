import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    validation?:object;
}

interface NewUserForm extends UserForm { }
interface ValidationErrors {
    userName?: string;
    email?: string;
    phoneNumber?: string;
    displayName?: string;
    userTypeCode?: string;
    counterID?: string;
    employeeID?: string;
    maxDiscPercAllowed?: string;
    passkey?: string;
    passwd?: string;
    confrimPassword?: string;
    [key: string]: string | undefined;
}   
interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
const apiClient = new APIClient();

// Default initial form state - extracted outside component to prevent recreation
const initialNewUserForm: NewUserForm = {
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
    passkey: '',
    validation: {},

};

const initialExistingUserForm: UserForm = {
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
};

const InviteModal: React.FC<InviteModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [mode, setMode] = useState<'new' | 'existing'>('new');
    const [isLoading, setIsLoading] = useState(false);
    const [existingUser, setExistingUser] = useState<string>('');
    const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
    const [newUserForm, setNewUserForm] = useState<NewUserForm>(initialNewUserForm);
    const [existingUserForm, setExistingUserForm] = useState<UserForm>(initialExistingUserForm);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    // const formData = mode === 'new' ? newUserForm : existingUserForm;
    // Memoize the form data to prevent unnecessary rerenders
    const formData = useMemo(() => 
        mode === 'new' ? newUserForm : existingUserForm, 
    [mode, newUserForm, existingUserForm]);

    const { t } = useTranslation("userManage");
    const dispatch = useDispatch();
  

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
            console.log("handlleUserSelect");
            const hygu = userData.value
            setExistingUser(hygu);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };



    const handleClear = () => {
        debugger;
        if (mode === 'new') {
            setNewUserForm(initialNewUserForm);
        } else {
            setExistingUserForm(initialExistingUserForm);
            setExistingUser('');
        }
   
         setValidationErrors({});
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!existingUser) return;
            
            try {
                const response = await apiClient.getAsync(`${Urls.Users}${existingUser}`);
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
                  setValidationErrors({});
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        
        fetchUserData();
    }, [existingUser, apiClient]);
  
   // Reset validation errors when switching modes
   useEffect(() => {
    setValidationErrors({});
   }, [mode]);
    
 
    const handleInvite = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.post(Urls.invite_link, {...formData,mode});
           
            handleResponse(response, () => {
                onSuccess?.();
                handleClose();
            },()=>{
                setValidationErrors(response.validations);
            });

        } catch (error) {
            console.error('Failed to send invitation:', error);
        } finally {
            setIsLoading(false);
           
        }
    }, [dispatch, formData, mode, onSuccess]);

      const handleClose = () => {
        handleClear();
        setMode('new');
        onClose();
    };
        // Memoize these values to prevent rerenders
        const showNewUserFields = mode === 'new';
        const showCounterField = applicationSettings.accountsSettings?.allowSalesCounter;
    // Memoize the modal content to prevent rerenders
    const modalContent = useMemo(() => (
        <div className="space-y-4">
            <div className="flex space-x-4 mb-6 ml-2 gap-4">
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

            {mode === 'existing' && (
                <ERPDataCombobox
                    id="existingUser"
                    field={{
                        id: 'existingUser',
                        required: true,
                        getListUrl: Urls.data_pending_users_to_CRM,
                                valueKey: 'id',
                                labelKey: 'name',
                    }}
                    value={existingUser}
                    label={t('select_user')}
                    required={true}
                    data={formData}
                    onSelectItem={handlleUserSelect}
                 
                />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             
                <ERPInput
                    value={formData.userName}
                    label={t('username')}
                    placeholder={t('username')}
                    required={true}
                    onChange={(e: any) => handleFieldChange('userName', e.target.value)}
                    id={'userName'}
                    validation={validationErrors.userName}
                />

                {showNewUserFields && (
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
                )}

                <ERPInput
                    value={formData.email}
                    onChange={(e: any) => handleFieldChange('email', e.target.value)}
                    label={t('email')}
                    type="email"
                    placeholder={t('email')}
                    required={true}
                    id={'email'}
                />

                <ERPInput
                    value={formData.phoneNumber}
                    onChange={(e: any) => handleFieldChange('phoneNumber', e.target.value)}
                    label={t('mobile')}
                    placeholder={t('mobile')}
                    required={false}
                    id={'phoneNumber'}
                />

                <ERPInput
                    value={formData.displayName}
                    onChange={(e: any) => handleFieldChange('displayName', e.target.value)}
                    label={t('name')}
                    placeholder={t('name')}
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
                    label={t('usertype')}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange('userTypeCode', data.userTypeCode)}
                />

                {showCounterField && (
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
                        required={true}
                        onChangeData={(data: any) => handleFieldChange('counterID', data.counterID)}
                    />
                )}

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
                    required={false}
                    id={'maxDiscPercAllowed'}
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <ERPButton
                    title={t("clear")}
                    variant="secondary"
                    disabled={isLoading}
                    onClick={handleClear}
                />
                <ERPButton
                    title={t("cancel")}
                    variant="secondary"
                    disabled={isLoading}
                    onClick={handleClose}
                />
                <ERPButton
                    title={t("invite")}
                    variant="primary"
                    onClick={handleInvite}
                    disabled={isLoading}
                />
            </div>
        </div>
    ), [
        mode, 
        existingUser, 
        formData, 
        handleFieldChange, 
        handlleUserSelect, 
        handleClear, 
        handleClose, 
        handleInvite, 
        isLoading,
        showNewUserFields,
        showCounterField,
        t
    ]);
    return (
        <ERPModal
            isOpen={isOpen}
            closeModal={handleClose}
            title={mode === 'new' ? t('invite_new_user') : t('invite_existing_user')}
            content={modalContent}
            width={600}
            height={600}
            isButton={false}
            hasSubmit={false}
        />
    );
};

export default InviteModal;