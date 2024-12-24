import React, { useState } from 'react';
import ERPInput from '../components/ERPComponents/erp-input';
import ERPButton from '../components/ERPComponents/erp-button';

const TestInputButton: React.FC = () => {
    const [formState, setFormState] = useState({
        supervisorPassword1: '',
    });

    const [isInputFocus, setIsInputFocus] = useState(false);
    const [isButtonAFocus, setIsButtonAFocus] = useState(false);
    const [isButtonBFocus, setIsButtonBFocus] = useState(false);

    const handleFieldChange = (field: string, value: any) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleButtonAClick = () => {
        setIsInputFocus(true);
        setIsButtonAFocus(true);
        setIsButtonBFocus(false);
    };

    const handleButtonBClick = () => {
        setIsInputFocus(false);
        setIsButtonAFocus(true);
        setIsButtonBFocus(true);
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
                    autoFocus={isInputFocus}
                    disabled={!isInputFocus}
                />
                <ERPButton
                    onClick={handleButtonAClick}
                    autoFocus={isButtonAFocus && !isInputFocus}
                    title="Button A"
                    variant="primary"
                />
                <ERPButton
                    title="Active Primary"
                    variant="secondary"
                    onClick={handleButtonBClick}
                    autoFocus={isButtonBFocus}
                />
            </div>
        </div>
    );
};

export default TestInputButton;