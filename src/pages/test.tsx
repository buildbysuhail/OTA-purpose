import React, { Fragment, useState } from 'react';
import ERPDataCombobox from '../components/ERPComponents/erp-data-combobox';
import ERPInput from '../components/ERPComponents/erp-input';
import Urls from '../redux/urls';
import { LedgerType } from '../enums/ledger-types';
import ERPDateInput from '../components/ERPComponents/erp-date-input';
import MUIERPDataCombobox from '../components/ERPComponents/erp-data-combobox-mui';
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
            <Fragment>
            <div className="grid grid-cols-12 gap-6 text-defaultsize">
                <div className="xl:col-span-12 col-span-12">
                    <>
                        <div className="grid grid-cols-12 sm:gap-6">
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <p className="mb-2 text-muted">Basic Input:</p>
                                <input type="text" className="form-control" id="input" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-label" className="form-label">Form Input With Label</label>
                                <input type="text" className="form-control" id="input-label" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-placeholder" className="form-label">Form Input With Placeholder</label>
                                <input type="text" className="form-control" id="input-placeholder" placeholder="Placeholder" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-text" className="form-label">Type Text</label>
                                <input type="text" className="form-control" id="input-text" placeholder="Text" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-number" className="form-label">Type Number</label>
                                <input type="number" className="form-control" id="input-number" placeholder="Number" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-password" className="form-label">Type Password</label>
                                <input type="password" className="form-control" id="input-password" placeholder="Password" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-email" className="form-label">Type Email</label>
                                <input type="email" className="form-control" id="input-email" placeholder="Email@xyz.com" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-tel" className="form-label">Type Tel</label>
                                <input type="tel" className="form-control" id="input-tel" placeholder="+1100-2031-1233" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-date" className="form-label">Type Date</label>
                                <input type="date" className="form-control" id="input-date" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-week" className="form-label">Type Week</label>
                                <input type="week" className="form-control" id="input-week" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-month" className="form-label">Type Month</label>
                                <input type="month" className="form-control" id="input-month" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-time" className="form-label">Type Time</label>
                                <input type="time" className="form-control" id="input-time" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-datetime-local" className="form-label">Type datetime-local</label>
                                <input type="datetime-local" className="form-control" id="input-datetime-local" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-search" className="form-label">Type Search</label>
                                <input type="search" className="form-control" id="input-search" placeholder="Search" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-submit" className="form-label">Type Submit</label>
                                <input type="submit" className="form-control ti-btn" id="input-submit" defaultValue="Submit" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-reset" className="form-label">Type Reset</label>
                                <input type="reset" className="form-control ti-btn" id="input-reset" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-button" className="form-label">Type Button</label>
                                <input type="button" className="form-control ti-btn !text-white !bg-primary" id="input-button" defaultValue="Button" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="xl:col-span-3 col-span-12 flex flex-col ">
                                        <label className="form-label">Type Color</label>
                                        <input className="form-control form-input-color !rounded-md" type="color" defaultValue="#136bd0" />
                                    </div>
                                    <div className="xl:col-span-5 col-span-12">
                                        <div className="form-check">
                                            <p className="mb-3 px-0 text-muted">Type Checkbox</p>
                                            <input className="form-check-input ms-2" type="checkbox" defaultValue="" defaultChecked />
                                        </div>
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <div className="form-check">
                                            <p className="mb-4 px-0 text-muted">Type Radio</p>
                                            <input className="form-check-input ms-2" type="radio" defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <div>
                                    <label htmlFor="file-input" className="sr-only">Type file</label>
                                    <input type="file" name="file-input" id="file-input" className="block w-full border border-gray-200 focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-gray-200 dark:focus:border-white/10 dark:border-white/10
                                                 file:border-0
                                                file:bg-gray-200 file:me-4
                                                file:py-3 file:px-4
                                                dark:file:bg-black/20 dark:file:text-white/50"/>
                                </div>
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label className="form-label">Type Url</label>
                                <input className="form-control" type="url" name="website" placeholder="http://example.com" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-disabled" className="form-label">Type Disabled</label>
                                <input type="text" id="input-disabled" className="form-control" placeholder="Disabled input" disabled />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-readonlytext" className="form-label">Input Readonly Text</label>
                                <input type="text" readOnly className="form-control-plaintext" id="input-readonlytext" defaultValue="email@example.com" />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="disabled-readonlytext" className="form-label">Disabled Readonly Input</label>
                                <input className="form-control" type="text" defaultValue="Disabled readonly input" id="disabled-readonlytext" aria-label="Disabled input example" disabled readOnly />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label className="form-label">Type Readonly Input</label>
                                <input className="form-control" type="text" defaultValue="Readonly input here..." aria-label="readonly input example" readOnly />
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="text-area" className="form-label">Textarea</label>
                                <textarea className="form-control" id="text-area" rows={1}></textarea>
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                <label htmlFor="input-DataList" className="form-label">Datalist example</label>
                                <input className="form-control" type="text" list="datalistOptions" id="input-DataList" placeholder="Type to search..." />
                                <datalist id="datalistOptions">
                                    <option value="San Francisco">
                                    </option>
                                    <option value="New York">
                                    </option>
                                    <option value="Seattle">
                                    </option>
                                    <option value="Los Angeles">
                                    </option>
                                    <option value="Chicago">
                                    </option>
                                </datalist>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </Fragment>
        </div>
    );
};
export default Test;