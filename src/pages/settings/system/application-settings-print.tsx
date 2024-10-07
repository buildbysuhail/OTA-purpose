import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";

interface FormState {
    defaultPrinter: string,
    printGatePass: boolean,
    showReprintAuthorization: boolean,
    mobileNumberMandatoryInSales: boolean
}

const initialState: FormState = {
    defaultPrinter: "",
    printGatePass: false,
    showReprintAuthorization: false,
    mobileNumberMandatoryInSales: false
};

const PrintSettingForm: React.FC = () => {
    const [formState, setFormState] = useState(initialState);
    const [formStatePrev, setFormStatePrev] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dispatch(
                getAction({ apiUrl: `${Urls.application_setting}print` }) as any
            ).unwrap();

            if (response) {
                setFormStatePrev(response);
                setFormState(response);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            setError("Failed to load settings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field: keyof typeof initialState, value: any) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
            const typedKey = key as keyof typeof initialState;
            const currentValue = formState[typedKey];
            const prevValue = (formStatePrev as any)[key];

            if (currentValue !== prevValue) {
                acc.push({
                    settingsName: key,
                    settingsValue: currentValue,
                });
            }
            return acc;
        }, [] as { settingsName: string; settingsValue: any }[]);

        setIsSaving(true);
        setError(null);
        try {
            const response = await dispatch(
                postAction({
                    apiUrl: Urls.application_setting,
                    data: modifiedSettings,
                }) as any
            ).unwrap();
            handleResponse(response);
        } catch (error) {
            console.error("Error saving settings:", error);
            setError("Failed to save settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div>Loading settings...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
                <button onClick={loadSettings}>Retry</button>
            </div>
        );
    }


    return (
        <div className="erp-settings-form">
            <div className="form-row grid grid-cols-1 gap-3 my-3">
                <ERPInput
                    id="defaultPrinter"
                    value={formState.defaultPrinter.toString()}
                    data={formState}
                    label="Keep User Actions (in Days)"
                    placeholder="Enter number of days"
                    type="text"
                    onChangeData={(data: any) => handleFieldChange("defaultPrinter", data.defaultPrinter)}
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPCheckbox
                    id="printGatePass"
                    checked={formState.printGatePass}
                    data={formState}
                    label="Print GatePass"
                    onChangeData={(data: any) => handleFieldChange("printGatePass", data.printGatePass)}
                />
                <ERPCheckbox
                    id="mobileNumberMandatoryInSales"
                    checked={formState.mobileNumberMandatoryInSales}
                    data={formState}
                    label="Mobile Number Mandatory in Sales"
                    onChangeData={(data: any) => handleFieldChange("mobileNumberMandatoryInSales", data.mobileNumberMandatoryInSales)}
                />
            </div>

            <div className="my-4 flex items-center justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    type="button"
                    className=""
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default PrintSettingForm;