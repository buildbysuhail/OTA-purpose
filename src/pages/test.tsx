import React, { useState } from 'react';
import ERPDataCombobox from '../components/ERPComponents/erp-data-combobox';
import ERPInput from '../components/ERPComponents/erp-input';
import Urls from '../redux/urls';
import { LedgerType } from '../enums/ledger-types';

const Test: React.FC = () => {
    const [formState, setFormState] = useState({
        defaultCustomerLedgerID: '',
        supervisorPassword: ''
    });

    const handleFieldChange = (field: string, value: any) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-6 p-6'>
            <div className='flex items-center justify-between border-2 rounded-lg p-4'>
                <ERPDataCombobox
                    id="defaultCustomerLedgerID"
                    value={formState.defaultCustomerLedgerID}
                    customSize='sm'
                    data={formState}
                    label="default_customer"
                    field={{
                        id: "defaultCustomerLedgerID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data) => handleFieldChange('defaultCustomerLedgerID', data.defaultCustomerLedgerID)}
                />
                <ERPInput
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='sm'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="outlined"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='sm'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="standard"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='sm'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="filled"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='sm'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
            </div>
            <div className='flex items-center justify-between border-2 rounded-lg p-4'>
                <ERPDataCombobox
                    id="defaultCustomerLedgerID"
                    value={formState.defaultCustomerLedgerID}
                    data={formState}
                    customSize='md'
                    label="default_customer"
                    field={{
                        id: "defaultCustomerLedgerID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data) => handleFieldChange('defaultCustomerLedgerID', data.defaultCustomerLedgerID)}
                />
                <ERPInput
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    data={formState}
                    customSize='md'
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="outlined"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    data={formState}
                    customSize='md'
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="standard"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    data={formState}
                    customSize='md'
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="filled"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    data={formState}
                    customSize='md'
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
            </div>
            <div className='flex items-center justify-between border-2 rounded-lg p-4'>
                <ERPDataCombobox
                    id="defaultCustomerLedgerID"
                    value={formState.defaultCustomerLedgerID}
                    data={formState}
                    customSize='lg'
                    label="default_customer"
                    field={{
                        id: "defaultCustomerLedgerID",
                        getListUrl: Urls.data_acc_ledgers,
                        params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data) => handleFieldChange('defaultCustomerLedgerID', data.defaultCustomerLedgerID)}
                />
                <ERPInput
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='lg'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="outlined"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='lg'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="standard"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='lg'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
                <ERPInput
                    useMUI
                    variant="filled"
                    id="supervisorPassword"
                    value={formState.supervisorPassword}
                    customSize='lg'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
                />
            </div>
        </div>
    );
};

export default Test;
