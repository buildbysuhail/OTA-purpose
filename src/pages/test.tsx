import React, { useState } from 'react';
import ERPDataCombobox from '../components/ERPComponents/erp-data-combobox';
import ERPInput from '../components/ERPComponents/erp-input';
import Urls from '../redux/urls';
import { LedgerType } from '../enums/ledger-types';
import ERPDateInput from '../components/ERPComponents/erp-date-input';
import MUIERPDataCombobox from '../components/ERPComponents/erp-data-combobox copy';
import ERPCheckbox from '../components/ERPComponents/erp-checkbox';
import ERPRadio from '../components/ERPComponents/erp-radio';

const Test: React.FC = () => {
    const [formState, setFormState] = useState({
        defaultCustomerLedgerID: '',
        supervisorPassword: '',
        supervisorPassword1: '',
        supervisorPassword2: '',
        date:"",
    });

    const handleFieldChange = (field: string, value: any) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-6 p-6'>
            <div className='flex items-end border-2 rounded-lg p-4'>

                <ERPInput
                    id="supervisorPassword1"
                    value={formState.supervisorPassword1}
                    data-jump-to="supervisorPassword2"
                    // jumpTo="supervisorPassword2"
                    customSize='sm'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword1', data.supervisorPassword1)}
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
            <div className='flex items-end border-2 rounded-lg p-4'>

                <ERPInput
                    id="supervisorPassword2"
                    value={formState.supervisorPassword2}
                    // jumpTarget="supervisorPassword2"
                    data={formState}
                    customSize='md'
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword2', data.supervisorPassword2)}
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
            <div className='flex items-end border-2 rounded-lg p-4'>

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
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                
            
                <ERPDateInput
                    data={formState}
                    customSize="sm"
                    onChangeData={(data) => handleFieldChange('date', data.date)}
                    value={formState.date}
                    id="date"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    data={formState}
                    customSize="md"
                    onChangeData={(data) => handleFieldChange('date', data.date)}
                    value={formState.date}
                    id="date"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    data={formState}
                    customSize="lg"
                    onChangeData={(data) => handleFieldChange('date', data.date)}
                    value={formState.date}
                    id="date"
                    type="date"
                    label="packed_date"
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                
                <ERPDateInput
                    useMUI
                    customSize="sm"
                    variant="outlined"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    useMUI
                    customSize="md"
                    variant="outlined"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    useMUI
                    customSize="lg"
                    variant="outlined"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                
            
                <ERPDateInput
                    useMUI
                    customSize="sm"
                    variant="standard"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    useMUI
                    customSize="md"
                    variant="standard"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    useMUI
                    customSize="lg"
                    variant="standard"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <ERPDateInput
                    useMUI
                    customSize="sm"
                    variant="filled"
                    id="packDate"
                    type="date"
                    label="packed_date"
                    jumpTo='packDate2121'
                />
                <ERPDateInput
                    useMUI
                    customSize="md"
                    variant="filled"
                    id="packDate"
                    type="date"
                    label="packed_date"
                />
                <ERPDateInput
                    useMUI
                    customSize="lg"
                    variant="filled"
                    id="packDate2121"
                    type="date"
                    label="packed_date"
                    jumpTarget='packDate2121'
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <ERPCheckbox
                    label="inSearch"
                    id="inSearch"
                    customSize='sm'
                    jumpTo="inSearch21"
                /><ERPCheckbox
                    label="inSearch"
                    id="inSearch"
                    customSize='md'
                /><ERPCheckbox
                    label="inSearch"
                    id="inSearch21"
                    customSize='lg'
                    jumpTarget='inSearch21'
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <ERPRadio
                    id="option1"
                    name="options"
                    value="1"
                    label="Small Option"
                    customSize="sm"
                    jumpTo='option3'
                />

                <ERPRadio
                    id="option2"
                    name="options"
                    value="2"
                    label="Medium Option"
                    customSize="md"
                />
                <ERPRadio
                    id="option3"
                    name="options"
                    value="3"
                    label="Large Option"
                    customSize="lg"
                    jumpTarget='option3'
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='sm'
                    variant='outlined'
                    className='w-full'
                    required={true}
                />
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    variant='outlined'
                    customSize='md'
                    className='w-full'
                    required={true}
                />
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    variant='outlined'
                    customSize='lg'
                    className='w-full'
                    required={true}
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='sm'
                    variant='standard'
                    className='w-full'
                    required={true}
                />
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='md'
                    variant='standard'
                    className='w-full'
                    required={true}
                />
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='lg'
                    variant='standard'
                    className='w-full'
                    required={true}
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='sm'
                    variant='filled'
                    className='w-full'
                    required={true}
                />
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='md'
                    variant='filled'
                    className='w-full'
                    required={true}
                />
                <MUIERPDataCombobox
                    id="labelDesign"
                    field={{
                        params: `TemplateType=barcode`,
                        id: "labelDesign",
                        required: true,
                        getListUrl: Urls.data_templates,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    label="label_design"
                    customSize='lg'
                    variant='filled'
                    className='w-full'
                    required={true}
                />
            </div>
            <div className='flex items-end border-2 rounded-lg p-4 gap-6'>
                <ERPDataCombobox
                    id="defaultCashAcc"
                    data={formState}
                    label="default_cash_account"
                    field={{
                        id: "defaultCashAcc",
                        //required: true,
                        getListUrl: Urls.data_CashLedgers,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    customSize='sm'
                    onChangeData={(data) => handleFieldChange('defaultCashAcc', data.defaultCashAcc)}
                />
                <ERPDataCombobox
                    id="defaultCashAcc"
                    data={formState}
                    label="default_cash_account"
                    field={{
                        id: "defaultCashAcc",
                        //required: true,
                        getListUrl: Urls.data_CashLedgers,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    customSize='md'
                    onChangeData={(data) => handleFieldChange('defaultCashAcc', data.defaultCashAcc)}
                />
                <ERPDataCombobox
                    id="defaultCashAcc"
                    data={formState}
                    label="default_cash_account"
                    field={{
                        id: "defaultCashAcc",
                        //required: true,
                        getListUrl: Urls.data_CashLedgers,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    customSize='lg'
                    onChangeData={(data) => handleFieldChange('defaultCashAcc', data.defaultCashAcc)}
                />
            </div>
        </div>
    );
};
export default Test;