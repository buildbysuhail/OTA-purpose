"use client";

import { Download, Info, X } from "lucide-react";
import React, {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import {
  accFormStateHandleFieldChange,
  accFormStateTransactionAttachmentsRowAdd,
  accFormStateTransactionAttachmentsRowRemove,
  accFormStateTransactionAttachmentsRowUpdate,
} from "../../pages/accounts/transactions/reducer";
import { Attachments } from "../../pages/accounts/transactions/acc-transaction-types";
import axios from "axios";

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  uploaded?: boolean;
  error?: string;
}
interface ERPAttachmentProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Prop for controlling sidebar visibility
}
const api = new APIClient();

export default function ERPAttachment({ setIsOpen }: ERPAttachmentProps) {
  const [ERPAttachmentOpen, setERPAttachmentOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const dispatch = useDispatch();
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
      }
    },
    [formState.transactionType]
  );
  const download = async (file: Attachments) => {
    try {
      debugger;
      const res = await axios.get(Urls.acc_attachmentInfo_download, {
        params: { FileKey: file.id },
        responseType: "blob",
      });
  
      // Debug headers
      console.log("Response Headers:", res.headers);
  
      // Set filename
      let filename = file.name || "downloaded-file.jpg";
  
      const blob = new Blob([res as any], { type: file.type || "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
  
      // Create and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const addFiles = async (newFiles: File[]) => {
    debugger;
    const newUpload = {
      id: Math.random().toString(36).slice(2),
      file: newFiles[0],
      name: newFiles[0].name,
      progress: 0,
    };
    const key = Math.random().toString(36).slice(2);
    const row: Attachments = {
      key: key,
      name: newFiles[0].name,
      size: newFiles[0].size,
      aType: "file",
      isNew: true,
      type: newFiles[0].type,
      uploading: true,
      progress: 0,
    };
    dispatch(
      accFormStateTransactionAttachmentsRowAdd({
        row,
      })
    );
    debugger;
    let formData = new FormData();
    formData.append("file", newUpload.file, newUpload.name);
    formData.append("key", key);
    const res = api.post(
      `${Urls.acc_transaction_base}${formState.transactionType}/UploadFile`,
      formData,
      {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      }, (progressEvent: any) => {

        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(percentCompleted);

        dispatch(
          accFormStateTransactionAttachmentsRowUpdate({
            row: {
              ...row,
              id: undefined,
              isNew: true,
              uploading: true,
              uploaded: false,
              error: "",
              progress: percentCompleted,
            },
          })
        );
      },
    ).then((res: any) => {
      if (res.isOk) {
        debugger;
        dispatch(
          accFormStateTransactionAttachmentsRowUpdate({
            row: {
              ...row,
              id: res.item.attachmentId,
              isNew: true,
              uploading: false,
              uploaded: true,
              progress: 100,
            },
          })
        );
      } else {
        dispatch(
          accFormStateTransactionAttachmentsRowUpdate({
            row: {
              ...row,
              id: res.item.attachmentId,
              isNew: true,
              uploading: false,
              uploaded: false,
              error: res.message,
              progress: 0,
            },
          })
        );
      }
    });


  };

  const removeFile = (index: number) => {
    dispatch(accFormStateTransactionAttachmentsRowRemove({ index: index }))
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const { t } = useTranslation("transaction");
  return (
    <div className="w-full p-2 self-end max-h-[100%] overflow-auto pb-[64px]">
      {/* <button
        className="dark:text-dark-text text-gray-500 dark:hover:text-dark-text hover:text-gray-700 right-0"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <X className="h-5 w-5" />
      </button> */}
      <div className="flex items-center justify-between mb-1 sticky top-0   dark:!bg-dark-bg  h-[3rem] py-4 z-50">
        <h6 className=" font-medium  dark:text-dark-text  capitalize">
          {t("attachment")}
        </h6>
        <button
          className="dark:text-dark-text text-gray-500 dark:hover:text-dark-text  hover:text-gray-700"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${isDragging
          ? "border-[#3b82f6] dark:bg-dark-bg-header bg-[#eff6ff]"
          : " dark:border-dark-border border-gray-300 hover:border-[#93c5fd]"
          }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-[6px]">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <button
              onClick={() => document.getElementById("file-input")?.click()}
              className="px-4 py-2 font-semibold text-sm bg-[#3b82f6] text-white rounded-lg shadow-sm hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-opacity-75"
            >
              {t("browse_files")}
            </button>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          <p className="text-sm dark:text-dark-text text-gray-500">
            {t("or_drop")}
          </p>
        </div>
      </div>

      <div className="mt-1 ">
        {formState.transaction.attachments.map((file,index) => (
          <div
            key={file?.id}
            className={`flex items-center dark:bg-dark-bg-card bg-gray-50 rounded-lg p-3 transition-all hover:bg-gray-300 border ${file?.error ? "" : "dark:border-dark-border border-b-[#00000024]"
              }`}
          >
            <svg
              className="w-5 h-5 text-[#3b82f6] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div className="flex-grow min-w-0 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <p className="font-medium truncate text-sm">{file?.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs dark:text-dark-text text-gray-500 whitespace-nowrap">
                    {file?.size  && formatFileSize(file?.size)}
                  </p>
                  <button
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 flex items-center justify-center dark:text-dark-text text-gray-500 hover:text-[#ef4444]"
                  >
                    {file?.uploaded ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {/* Show error message if there's an error */}

            </div>
            {file?.error ? (
              <div className="flex items-center gap-2">
                <p className="text-xs text-red mt-1">{'failed'}</p>
                <button onClick={() => setIsPopupOpen(true)}>
                  <Info className="w-4 h-4" />
                </button>
                {isPopupOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-96 relative">
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsPopupOpen(false)}>
                        <X className="w-5 h-5" />
                      </button>

                      <p className="text-gray-800 text-center font-medium">
                      {file.error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : file.isNew? (
              <div className="flex items-center space-x-2 w-24 flex-shrink-0">
                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ease-out ${file?.error ? "bg-red" : "bg-[#3b82f6]"}`} style={{ width: `${file?.progress}%` }}></div>
                </div>
                <p className="text-xs font-medium text-gray-500 w-8 text-right">
                  {file?.uploaded ? (
                    <span className="text-[#16a34a]">{t("done")}</span>
                  ) : (
                    `${Math.round(file?.progress)}%`
                  )}
                </p>
              </div>
            ): (
              <>
               <button onClick={() => download(file)}>
                  <Download className="w-4 h-4" />
                </button></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
