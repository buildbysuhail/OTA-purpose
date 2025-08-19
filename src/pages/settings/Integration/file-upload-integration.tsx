import React, { useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsProvider, NotificationsChannel } from "../../../enums/notification-chanal";
import { CircleCheck } from "lucide-react";
import { information, FileUploadIntegrationData } from "./file-upload-integration-type";
import CloudinaryConnectPopup from "./file-upload-claudinary-connect-popup";

interface ProviderState {
  isOpen: boolean;
  information?: any;
  providerName?: string;
  provider?: NotificationsProvider;
  id?: number
}

const api = new APIClient();

const FileUploadIntegration: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submittingSetAsDefault, setSubmittingSetAsDefault] = useState(false);
  const [selectedForDefaultId, setSelectedForDefaultId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ProviderState>({ isOpen: false, information: undefined, providerName: undefined, });
  const [formState, setFormState] = useState<FileUploadIntegrationData[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<FileUploadIntegrationData | null>(null);
  const { t } = useTranslation("integration");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const Channel = NotificationsChannel.FileUpload;
    try {
      const response = await api.getAsync(`${Urls.notification_provider}?channel=${Channel}`);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const setAsDefault = async (id: number) => {
    setSubmittingSetAsDefault(true);
    setSelectedForDefaultId(id);
    try {
      const requestBody = {
        provider: NotificationsProvider.Cloudinary,
        channel: NotificationsChannel.FileUpload,
        id: id
      };
      const response = await api.post(Urls.notification_provider_set_as_default, requestBody);
      handleResponse(response, async () => {
        await loadSettings();
      }, () => {

      });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSubmittingSetAsDefault(false);
      setSelectedForDefaultId(null);
    }
  };

  const handleOpen = (item: any) => {
    let parsedConfig: any = {};

    if (typeof item?.configJson === "string" && item?.configJson.trim() !== "") {
      try {
        parsedConfig = JSON.parse(item?.configJson);
      } catch (error) {
        console.error("Error parsing configJson:", error);
      }
    } else if (typeof item?.configJson === "object" && item?.configJson !== null) {
      parsedConfig = item?.configJson;
    }

    setProvider({
      isOpen: true,
      provider: item?.provider,
      information: {
        // cloudName: parsedConfig?.cloudName ?? "",
        apiKey: parsedConfig?.apiKey ?? "",
        // apiSecret: parsedConfig?.apiSecret ?? "",
        // uploadPreset: parsedConfig?.uploadPreset ?? "",
      },
      id: item?.id,
      providerName: item?.name ?? "",
    });
  };

  return (
    <div className="p-6 max-w-8xl mx-auto dark:bg-dark-bg bg-white dark:text-dark-text">
      <div className="xxl:h-[61.8rem]">
        <h1 className="text-2xl font-bold mb-4 dark:text-dark-text text-gray-800">
          {t("file_upload_integration")}
        </h1>

        {formState?.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between mb-4 p-4 dark:bg-dark-bg-header dark:text-dark-text bg-gray-50 rounded-lg group relative">
            <div className="cursor-pointer" onClick={() => setSelectedIntegration(item)}>
              <h2 className="text-xl font-semibold dark:text-dark-text text-gray-700">
                {item.name}
              </h2>
              <p className="text-sm dark:text-dark-text text-gray-600">
                {item.description}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
              {item.isDefault ? (
                <div className="flex items-center justify-center min-w-[40px]">
                  <div className="relative p-1 rounded-full bg-[#d1fae5] dark:bg-[#14532d]">
                    <CircleCheck
                      className="text-[#16a34a] dark:text-[#4ade80]"
                      size={24}
                      strokeWidth={3}
                    />
                  </div>
                </div>
              ) : item.id > 0 ? (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <ERPButton
                    title={t("set_as_default")}
                    onClick={() => setAsDefault(item.id)}
                    className="min-w-[120px]"
                    loading={submittingSetAsDefault && item.id === selectedForDefaultId}
                  />
                </div>
              ) : <></>
              }
              <ERPButton
                title={item.isEnable ? t("maintain") : t("connect")}
                onClick={() => handleOpen(item)}
                variant="primary"
                className="min-w-[120px]"
              />
            </div>
          </div>

        ))}

        <div className="mt-8">
          {selectedIntegration ? (
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-dark-text text-gray-700">
                {t("selected_integration")} : {selectedIntegration.name}
              </h3>
              <p className="mb-4 dark:text-dark-text text-gray-600">
                {selectedIntegration.description}
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>

        <ERPModal
          isOpen={provider.isOpen}
          title={t(provider.providerName?.toLowerCase() || "cloudinary")}
          width={600}
          height={150}
          isForm={true}
          closeModal={() => { setProvider({ isOpen: false, information: undefined, providerName: undefined }); }}
          content={
            <CloudinaryConnectPopup data={provider.information} id={provider.id} onSuccess={() => {
              setProvider({ isOpen: false, information: undefined, provider: undefined });
              loadSettings();
            }} />
          }
        />
      </div>
    </div>
  );
};

export default FileUploadIntegration;