import React, { useState } from 'react';
import ERPDataCombobox from '../components/ERPComponents/erp-data-combobox';
import ERPInput from '../components/ERPComponents/erp-input';
import useERPState from '../utilities/hooks/focus-button-input';
import ERPButton from '../components/ERPComponents/erp-button';

const TestInputButton: React.FC = () => {
    const [formState, setFormState] = useState({
        supervisorPassword1: '',
        accGroupID: '',
    });

    const {
        isInputFocus,
        isButtonAFocus,
        isComboboxFocus,
        handleButtonAClick,
        handleButtonBClick,
        handleButtonCClick,
        inputRef,
        buttonARef,
        comboboxRef
    } = useERPState();

    const handleFieldChange = (field: string, value: any) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className='border p-4 rounded-md flex flex-col gap-4'>
                <ERPInput
                    id="supervisorPassword1"
                    value={formState.supervisorPassword1}
                    customSize='sm'
                    data={formState}
                    label="supervisor_password"
                    onChangeData={(data) => handleFieldChange('supervisorPassword1', data.supervisorPassword1)}
                    disabled={!isInputFocus}
                    ref={inputRef}
                />
                <ERPDataCombobox
                    field={{
                        id: "accGroupID",
                        required: true,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => {
                        handleFieldChange("accGroupID", data.accGroupID);
                    }}
                    label="Combobox"
                    id={'accGroupID'}
                    disabled={!isComboboxFocus}
                />
                <ERPButton
                    onClick={handleButtonAClick}
                    title="Button A"
                    variant="primary"
                    ref={buttonARef}
                />
                <ERPButton
                    title="Button B"
                    variant="secondary"
                    onClick={handleButtonBClick}
                />
                <ERPButton
                    title="Combo Button"
                    variant="secondary"
                    onClick={handleButtonCClick}
                />
            </div>
        </div>
    );
};

export default TestInputButton;

