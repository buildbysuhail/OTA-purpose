import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import {
  initialPartiesData,
  initialProjectOrJobData,
  PartiesData,
  ProjectOrJob,
} from "./parties-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { APIClient } from "../../../../helpers/api-client";
import { RootState } from "../../../../redux/store";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { convertFileToBase64 } from "../../../../utilities/file-utils";
import ErpCropper from "../../../../components/ERPComponents/erp-cropper";
import ERPToast from "../../../../components/ERPComponents/erp-toast";

interface PartiesManageProps {
  type: string; // Define type as a string prop
}
const api = new APIClient();
export const PartiesManage: React.FC<PartiesManageProps> = React.memo(
  ({ type = "Cust" }) => {
    const [activeTab, setActiveTab] = useState("address");
    const rootState = useRootState();
    const dispatch = useDispatch();
    const userSession = useSelector((state: RootState) => state.UserSession);
    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );
    const isIndianCompany = userSession.countryId === Countries.India;
    const [isTCSApplicable, setIsTCSApplicable] = useState(false);
    const [projectOrJob, setProjectOrJob] = useState<ProjectOrJob>(
      initialProjectOrJobData.data
    );
    const [image, setImage] = useState<string>("#");

    const {
      isEdit,
      handleClear,
      handleSubmit,
      handleFieldChange,
      getFieldProps,
      handleClose,
      isLoading,
      formState,
    } = useFormManager<PartiesData>({
      url: Urls.parties,
      onClose: useCallback(
        () => dispatch(toggleParties({ isOpen: false, key: null, reload: false })),
        [dispatch]
      ),
      onSuccess: useCallback(
        () =>
          dispatch(toggleParties({ isOpen: false, key: null, reload: true })),
        [dispatch]
      ),
      key: rootState.PopupData.parties.key,
      useApiClient: true,
      initialData: {
        ...initialPartiesData,
        data: {
          ...initialPartiesData.data,
          partyType: type,
          accGroupID: type == "Cust" ? 154 : 22,
          partyCategoryID: type == "Cust" ? 1 : 2,
          priceCategoryID: 1,
          country: "Saudi Arabia",
          registrationType: "Regular",
          drCr: "Dr",
        },
      },
    });

    const [fileLoading, setFileLoading] = useState(false);
    const { t } = useTranslation("masters");
    const handleFileChange = (e: { target: { files: any[] } }) => {
      const file = e.target.files[0];
      if (file) {
        console.log("File selected:", file.name);
      }
    };
    useEffect(() => {
      const key = rootState.PopupData.parties.key;
      if (Boolean(key && key !== "0" && key !== "") == false) {
        load();
      }
    }, []);
    const load = async () => {
      const res = await api.getAsync(Urls.get_next_party_code);
      handleFieldChange("partyCode", res.toString());
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
    };
    const onImageSuccess = useMemo(() => {
      return (url: string) => {
        setImage(url);
      };
    }, []);

    const handleFileUpload = async (key: any, value: any) => {
      setFileLoading(true);
      const payload = {
        FileData: value,
      };
      try {
        const res = await api.postAsync(Urls.acc_attachment_upload, payload);
        handleFieldChange(key, res.item.fileData);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setFileLoading(false);
      }
    };

    const handleDownload = async (fileData: string) => {
      debugger;
      ERPToast.show("Download started...", "success");
      try {
        const parts = fileData.split("-");
        let fileType = parts[parts.length - 1];
        parts.pop();
        const link = document.createElement("a");
        if (fileType == "FileUrl") {
          link.href = parts.join("-");
        }
        else {
          const url = `${Urls.acc_attachmentInfo_download
            }?fileData=${encodeURIComponent(fileData)}`;

          const res = await api.getNativeAsync(url, undefined, {
            responseType: "blob", // Ensure the response is treated as a binary blob
          });
          debugger;
          if (res) {
            link.href = url;
          }
        }
        // Fallback to the provided fileName or a default name
        const suggestedFileName = parts.join("-") || "download";

        link.setAttribute("download", suggestedFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error("Error downloading file:", error);
        ERPToast.show("Download failed.", "error");
      } finally {
        setFileLoading(false);
      }
    };

    return (
      <div className="w-full bordered-tab relative pb-16">
          <ERPInput
              {...getFieldProps("creditDays")}
              min={0}
              label={t("credit_days")}
              type="number"
              placeholder={t("credit_days")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("creditDays",  parseInt(data.creditDays))
              }
            />
      </div>
    );
  }
);

export default PartiesManage;
