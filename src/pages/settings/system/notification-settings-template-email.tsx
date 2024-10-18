import React, { useCallback, useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../utilities/HandleResponse";
import { NotificationsChannel } from "../../../enums/notification-chanal";
import ERPInput from "../../../components/ERPComponents/erp-input";
import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item,
} from "devextreme-react/html-editor";

interface NotificationContent {
  subject: string;
  body: string;
}

interface NotificationTemplate {
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
}
const initialState: NotificationTemplate = {
  id: 0,
  branchId: 0,
  templateName: "",
  templateKey: "",
  content: {
    subject: "",
    body: "",
  },
  channel: 0,
  isAttachFile: false,
  isActive: false,
};

const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const fontValues = [
  "Arial",
  "Courier New",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
  inputAttr: {
    "aria-label": "Font size",
  },
};
const fontFamilyOptions = {
  inputAttr: {
    "aria-label": "Font family",
  },
};
const headerOptions = {
  inputAttr: {
    "aria-label": "Font family",
  },
};
const api = new APIClient();
const EmailTemplate: React.FC<TemplateProps> = React.memo(
  ({ channel, isOpen, templateKey, closeModal }) => {
    const [formState, setFormState] =
      useState<NotificationTemplate>(initialState);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    // const onClose = useCallback(() => {
    //   closeModal();
    // }, []);

    const handleFieldChange = (field: any, value: any) => {
      setFormState((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          [field]: value,
        },
      }));
      console.log(formState);
      
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const requestBody = {
          ...formState,
          channel: NotificationsChannel.Email,
          templateKey,
          templateName: channel,
        };
        const response = await api.post(
          `${Urls.notification_template}`,
          requestBody
        );
        handleResponse(response);
      } catch (error) {
        console.error("Error saving settings:", error);
      } finally {
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
        const response = await api.getAsync(
          `${Urls.notification_template}?templatekey=${templateKey}&Channel=${NotificationsChannel.Email}`
        );
        debugger;
        setFormState(response);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
   
    const valueChanged = (e: any) => {
        handleFieldChange("body", e.value);
      };
      
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full pt-4">
          <div className="grid grid-cols-1 gap-3">
            <ERPInput
              id="subject"
              value={formState.content?.subject || ""}
              data={formState.content}
              label="Subject"
              onChange={(e) => handleFieldChange("subject", e.target.value)}
            />
            <div className="form-group">
              <HtmlEditor
                height={300}
                defaultValue={formState.content?.body}
                onValueChanged={valueChanged}
              >
                <MediaResizing enabled={true} />
                <ImageUpload tabs={["file", "url"]} fileUploadMode="both" />
                <Toolbar multiline={true}>
                  <Item name="undo" />
                  <Item name="redo" />
                  <Item name="separator" />
                  <Item
                    name="size"
                    acceptedValues={sizeValues}
                    options={fontSizeOptions}
                  />
                  <Item
                    name="font"
                    acceptedValues={fontValues}
                    options={fontFamilyOptions}
                  />
                  <Item name="separator" />
                  <Item name="bold" />
                  <Item name="italic" />
                  <Item name="strike" />
                  <Item name="underline" />
                  <Item name="separator" />
                  <Item name="alignLeft" />
                  <Item name="alignCenter" />
                  <Item name="alignRight" />
                  <Item name="alignJustify" />
                  <Item name="separator" />
                  <Item name="orderedList" />
                  <Item name="bulletList" />
                  <Item name="separator" />
                  <Item
                    name="header"
                    acceptedValues={headerValues}
                    options={headerOptions}
                  />
                  <Item name="separator" />
                  <Item name="color" />
                  <Item name="background" />
                  <Item name="separator" />
                  <Item name="link" />
                  <Item name="image" />
                  <Item name="separator" />
                  <Item name="clear" />
                  <Item name="codeBlock" />
                  <Item name="blockquote" />
                  <Item name="separator" />
                </Toolbar>
              </HtmlEditor>
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
              type="submit"
              startIcon="ri-save-line"
            />
             <ERPButton
              title={t("cancel")}
              variant="secondary"
              type="button"
              onClick={()=>closeModal()}
              startIcon="ri-close-circle-line"
            />
          </div>
        </div>
      </form>
    );
  }
);

export default EmailTemplate;
