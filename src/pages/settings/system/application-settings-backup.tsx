import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";

interface FormState {
    backupMethods: string,
    backupPath: string,
    duration: number,
    backupFile: boolean
}

const initialState: FormState = {
    backupMethods: "",
    backupPath: "",
    duration: 0,
    backupFile: false
};

const BackupSettingsForm: React.FC = () => {
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
                <ERPDataCombobox
                    id="backupPath"
                    value={formState.backupPath}
                    data={formState}
                    field={{
                        id: "backupPath",
                        required: false,
                        getListUrl: Urls.data_acc_ledgers,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onChangeData={(data: any) => handleFieldChange("backupPath", data)}
                    label="Backup Methods"
                />
            </div>
            <div className="form-row grid grid-cols-1 gap-3 my-3">
                <ERPInput
                    id="backupPath"
                    value={formState.backupPath.toString()}
                    data={formState}
                    label="Backup Path"
                    placeholder="Enter discount threshold"
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("backupPath", parseFloat(data.backupPath))}
                />
            </div>

            <div className="form-row grid grid-cols-2 gap-3 my-3">
                <ERPInput
                    id="duration"
                    value={formState.duration.toString()}
                    data={formState}
                    label="Duration"
                    placeholder="Enter discount threshold"
                    type="number"
                    onChangeData={(data: any) => handleFieldChange("duration", parseFloat(data.duration))}
                />
                <ERPCheckbox
                    id="backupFile"
                    checked={formState.backupFile}
                    data={formState}
                    label="Compress Backup File"
                    onChangeData={(data: any) => handleFieldChange("backupFile", data.backupFile)}
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

export default BackupSettingsForm;