import React, { useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import { NotificationsChannel } from "../../../enums/notification-chanal";
import ERPInput from "../../../components/ERPComponents/erp-input";
import HtmlEditor from "../../../components/ERPComponents/erp-html-editor";

interface NotificationContent {
  Subject: string;
  Body: string;
}

export interface NotificationTemplate {
  id: number;
  branchId: number;
  templateName: string;
  templateKey: string;
  content: NotificationContent;
  channel: number;
  isAttachFile: boolean;
  isActive: boolean;
}

interface TemplateProps {
  channel: string;
  templateKey: string;
  isOpen: boolean;
  closeModal: () => void;
  isMaximized?: boolean;
  modalHeight?: any;
  formState: NotificationTemplate;
  setFormState: React.Dispatch<React.SetStateAction<NotificationTemplate>>;
}

export const initialState: NotificationTemplate = {
  id: 0,
  branchId: 0,
  templateName: "",
  templateKey: "",
  content: {
    Subject: "",
    Body: "",
  },
  channel: 0,
  isAttachFile: false,
  isActive: false,
};

const api = new APIClient();

const EmailTemplate: React.FC<TemplateProps> = React.memo(
  ({ channel, isOpen, templateKey, closeModal, isMaximized, modalHeight, formState, setFormState }) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [Height, setHeight] = useState<{ mobile: number; windows: number }>({ mobile: 500, windows: 500 });

    useEffect(() => {
      let gridHeightMobile = modalHeight - 50;
      let gridHeightWindows = isMaximized ? modalHeight - 270 : modalHeight - 400;
      setHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [isMaximized, modalHeight]);

    const handleFieldChange = (field: any, value: any) => {
      setFormState((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          [field]: value,
        },
      }));
    };

    useEffect(() => {
      if (isOpen) {
        loadNotification();
      }
    }, [isOpen]);

    const processHtmlFromBackend = (html: string) => {
      html = html.replace(/\\"/g, '"');
      if (html.startsWith('"<') && html.endsWith('"<')) {
        html = html.slice(1, -1);
      }
      if (html.startsWith('"<') && html.endsWith('>"')) {
        html = html.slice(1, -1);
      }
      return html;
    };

    const loadNotification = async () => {
      setLoading(true);
      try {
        const response = await api.getAsync(
          `${Urls.notification_template}?templatekey=${templateKey}&Channel=${NotificationsChannel.Email}`
        );
        const parsedContent = JSON.parse(response.content);
        const ht = processHtmlFromBackend(parsedContent.Body);
        setFormState({
          ...response,
          content: {
            Subject: parsedContent.Subject || "",
            Body: ht,
          },
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };



    return (
      <div className="space-y-6">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-3">
            <div className="mr-[21rem]">
              <ERPInput
                id="Subject"
                value={formState.content?.Subject || ""}
                data={formState.content}
                label="Subject"
                onChange={(e) => handleFieldChange("Subject", e.target?.value)}
              />
            </div>
            <div className="">
              <HtmlEditor value={formState.content?.Body} onchange={(value) => handleFieldChange("Body", value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default EmailTemplate;