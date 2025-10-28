import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { NotificationsChannel, NotificationsProvider } from "../../../enums/notification-chanal";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import { APIClient } from "../../../helpers/api-client";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import { information } from "./file-upload-integration-type";
import ERPFormButtons from "../../../components/ERPComponents/erp-form-buttons";

const api = new APIClient();

interface CloudinaryConnectPopupProps {
    data?: any;
    id?: number;
    onSuccess?: () => void;
}

const CloudinaryConnectPopup: React.FC<CloudinaryConnectPopupProps> = ({ data = {}, id, onSuccess }) => {

    const [information, setInformation] = useState<Partial<information>>({
        apiKey: data?.apiKey || "",
        apiSecret: data?.apiSecret || "",
        cloudName: data?.cloudName || "",
        // uploadPreset: data?.uploadPreset || ""
    });

    const [testFile, setTestFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        setInformation(data);
    }, [data]);

    const handleFieldChange = (fieldName: keyof information, value: any) => {
        setInformation(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const cloudinaryUrl = `cloudinary://${information.apiKey}:${information.apiSecret}@${information.cloudName}`;
            const requestBody = {
                provider: NotificationsProvider.Cloudinary,
                channel: NotificationsChannel.FileUpload,
                configJson: cloudinaryUrl,
                isEnable: true,
                id: id,
                limit: 1000,
            };
            const response = await api.post(Urls.notification_provider_update, requestBody);
            handleResponse(response, () => { onSuccess && onSuccess() });
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    }; 

    const handleTestUpload = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!testFile) return;

        setIsTesting(true);
        try {
            const cloudinaryUrl = `cloudinary://${information.apiKey}:${information.apiSecret}@${information.cloudName}`;
            const formData = new FormData();
            formData.append('file', testFile);

            const payload = {
                provider: NotificationsProvider.Cloudinary,
                channel: NotificationsChannel.FileUpload,
                configJson: cloudinaryUrl,
                file: formData,
                isEnable: true,
                limit: 1000,
            };
            const testUploadResponse = await api.post(Urls.notification_provider_test, payload);
            await handleResponse(testUploadResponse);
        } catch (error) {
            console.error("Error testing file upload:", error);
        } finally {
            setIsTesting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTestFile(file);
        }
    };

    const { t } = useTranslation('integration');
    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 gap-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg-header p-2 rounded-md break-all">
                        <strong>Example:</strong> CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@mycloudname
                    </p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg-header p-2 rounded-md break-words">
                        <strong>Example:</strong> CLOUDINARY_URL=cloudinary://&lt;your_api_key&gt;:&lt;your_api_secret&gt;@&lt;Cloud_name&gt;
                    </p>
                    <ERPInput
                        id="apiKey"
                        value={information.apiKey || ""}
                        label={t("api_key")}
                        placeholder={t("enter_api_key")}
                        onChange={(e) => handleFieldChange("apiKey", e.target.value)}
                    />
                    <ERPInput
                        id="apiSecret"
                        value={information.apiSecret || ""}
                        label={t("api_secret")}
                        placeholder={t("enter_api_secret")}
                        onChange={(e) => handleFieldChange("apiSecret", e.target.value)}
                    />
                    <ERPInput
                        id="cloudName"
                        value={information.cloudName || ""}
                        label={t("cloud_name")}
                        placeholder={t("enter_cloud_name")}
                        onChange={(e) => handleFieldChange("cloudName", e.target.value)}
                    />
                </div>

                {/* <div className="flex items-center justify-end gap-2 mt-4">
                    <ERPButton
                        title={id ? t("update") : t("save")}
                        variant="primary"
                        disabled={isSaving}
                        loading={isSaving}
                        onClick={() => handleSubmit()}
                    />
                    <ERPButton
                        title={t("test_upload")}
                        variant="secondary"
                        onClick={() => setIsPopupOpen(true)}
                    />
                </div> */}
                <ERPFormButtons
                isLoading={isSaving}
                customButtons={[
                    
                    // {
                    // title: t("test_upload"),
                    // variant: "secondary",
                    // onClick: () => setIsPopupOpen(true),
                    // },
                    {
                    title: id ? t("update") : t("save"),
                    variant: "primary",
                    disabled: isSaving,
                    loading: isSaving,
                    onClick: () => handleSubmit(),
                    }
                ]}
                customButtonsPosition="right"
                skipSubmit={true}
                skipCancel={true}
                skipClear={true}
                />                

                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md backdrop-blur-sm z-50 p-4">
                        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300">
                            <div className="flex justify-between items-center pb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {t("test_file_upload")}
                                </h2>
                                <button onClick={() => setIsPopupOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t("select_file")}
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#86efac] transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                                    />
                                </div>

                                {testFile && (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t("selected_file")}: {testFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {t("size")}: {(testFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full p-3 shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleTestUpload}
                                    disabled={isTesting || !testFile}
                                >
                                    {isTesting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Upload className="w-5 h-5 transform transition-transform duration-300 hover:scale-110" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CloudinaryConnectPopup;