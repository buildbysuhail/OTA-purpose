import React, { useCallback, useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsChannel } from "../../../enums/notification-chanal";

interface NotificationTemplate {
  id: number;
  branchId: number;
  templateName: string;
  templateKey: string;
  content: string;
  channel: number;
  isAttachFile: boolean;
  isActive: boolean;
}

interface TemplateProps {
  channel: string;
  templateKey:string;
  isOpen:boolean;
  closeModal: () => void;
}
const initialState: NotificationTemplate = {
  id: 0,
  branchId: 0,
  templateName: "",
  templateKey: "",
  content: "",
  channel: 0,
  isAttachFile: false,
  isActive: false,
};
const api = new APIClient();
const SmsWhatsappTemplate: React.FC<TemplateProps> = React.memo(({ channel,templateKey, isOpen, closeModal }) => {
    const [formState, setFormState] =useState<NotificationTemplate>(initialState);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();

    const handleFieldChange = (
      field: keyof typeof initialState,
      value: any
    ) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };
    //identify the channel from props
    const fieldToChannelMap: Record<string, NotificationsChannel> = {
      whatsapp: NotificationsChannel.Whatsapp,
      sms: NotificationsChannel.Sms,
    };
    const channelNo = fieldToChannelMap[channel];

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
      
        const requestBody = {
          ...formState,
          channel: channelNo,
          templateKey,
          templateName:channel
        };
        const response = await api.post(`${Urls.notification_template}`,requestBody);
        handleResponse(response,()=>{closeModal()});
        
      } catch (error) {
        console.error("Error saving settings:", error);
      } finally {
     setIsSaving(false)
      }
    };

    useEffect(() => {
        if(isOpen){
        loadNotification();
        }
      }, [isOpen]);
    
      const loadNotification = async () => {
        setLoading(true);
        try {
          const response = await api.getAsync(`${Urls.notification_template}?templatekey=${templateKey}&Channel=${channelNo}`);
          debugger;
          setFormState(response);
        } catch (error) {
          console.error("Error loading settings:", error);
        } finally {
          setLoading(false);
        }
      };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full pt-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="form-group">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
              {channel} Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formState.content}
                onChange={(e) => handleFieldChange("content", e.target.value)}
                rows={5}
                placeholder="Enter template content"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <ERPCheckbox
              id="isAttachFile"
              checked={formState.isAttachFile}
              data={formState}
              label="Attach File"
              onChangeData={(data) =>
                handleFieldChange("isAttachFile", data.isAttachFile)
              }
            />
          </div>
          <div className="flex justify-end items-center gap-5">
            <ERPButton
              title={t("save")}
              variant="primary"
              loading={isSaving}
              disabled={isSaving}
              type="submit"
              startIcon="ri-save-line"
            />
          </div>
        </div>
      </form>
    );
  }
);

export default SmsWhatsappTemplate;
