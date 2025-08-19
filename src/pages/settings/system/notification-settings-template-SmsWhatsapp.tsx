import React, { useCallback, useEffect, useRef, useState } from "react";
import Urls from "../../../redux/urls";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsChannel } from "../../../enums/notification-chanal";
import ERPFormButtons from "../../../components/ERPComponents/erp-form-buttons";
import ERPButton from "../../../components/ERPComponents/erp-button";

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
  templateKey: string;
  isOpen: boolean;
  closeModal: () => void;
  isMaximized?: boolean;
  modalHeight?: any;
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

const SmsWhatsappTemplate: React.FC<TemplateProps> = React.memo(({ channel, templateKey, isOpen, closeModal, isMaximized, modalHeight }) => {
  const [formState, setFormState] = useState<NotificationTemplate>(initialState);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState<number>(500);
  const { t } = useTranslation();

  // Refs for measuring sibling elements
  const labelRef = useRef<HTMLLabelElement>(null);
  const checkboxRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Calculate textarea height dynamically
  const calculateTextareaHeight = useCallback(() => {
    if (!modalHeight || !labelRef.current || !checkboxRef.current || !buttonsRef.current) return 500;

    // Get heights of sibling elements
    const labelHeight = labelRef.current.getBoundingClientRect().height;
    const checkboxHeight = checkboxRef.current.getBoundingClientRect().height;
    const buttonsHeight = buttonsRef.current.getBoundingClientRect().height;

    // Estimate additional margins/paddings and modal borders
    const extraPadding = 40; // Adjust based on CSS (e.g., space-y-6, gap-3)
    const modalHeaderFooter = isMaximized ? 80 : 100; // Adjust for header/footer

    // Calculate available height
    const calculatedHeight = modalHeight - labelHeight - checkboxHeight - buttonsHeight - extraPadding - modalHeaderFooter;

    // Clamp between min (100px) and max (80% of modalHeight)
    const minHeight = 100;
    const maxHeight = modalHeight * 0.8;
    return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
  }, [modalHeight, isMaximized]);

  // Update textarea height on mount, modalHeight/isMaximized change, or resize
  useEffect(() => {
    const updateHeight = () => {
      const newHeight = calculateTextareaHeight();
      setTextareaHeight(newHeight);
    };

    updateHeight();

    // Handle window resize with debounce
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateHeight, 100); // Debounce by 100ms
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [calculateTextareaHeight]);

  const handleFieldChange = (
    field: keyof typeof initialState,
    value: any
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Identify the channel from props
  const fieldToChannelMap: Record<string, NotificationsChannel> = {
    whatsapp: NotificationsChannel.Whatsapp,
    sms: NotificationsChannel.Sms,
  };
  const channelNo = fieldToChannelMap[channel];

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const requestBody = {
        ...formState,
        channel: channelNo,
        templateKey,
        templateName: channel,
      };
      const response = await api.post(`${Urls.notification_template}`, requestBody);
      handleResponse(response, () => { closeModal() });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotification();
    }
  }, [isOpen]);

  const loadNotification = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.notification_template}?templatekey=${templateKey}&Channel=${channelNo}`);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label
              ref={labelRef}
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              {channel} Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formState.content}
              onChange={(e) => handleFieldChange("content", e.target?.value)}
              placeholder="Enter template content"
              style={{ height: `${textareaHeight}px` }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div ref={checkboxRef}>
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
          {/* <div className="flex justify-end items-center gap-5">
            <ERPButton
              title={t("save")}
              variant="primary"
              loading={isSaving}
              disabled={isSaving}
              type="submit"
              startIcon="ri-save-line"
            />
          </div> */}
        </div>
        <div ref={buttonsRef}>
          <ERPFormButtons
            isLoading={isSaving}
            customButtons={[
              {
                title: t("save"),
                variant: "primary",
                disabled: isSaving,
                loading: isSaving,
                onClick: handleSubmit,
              },
            ]}
            customButtonsPosition="right"
            skipSubmit={true}
            skipCancel={true}
            skipClear={true}
          />
        </div>
      </div>
    </form>
  );
});

export default SmsWhatsappTemplate;