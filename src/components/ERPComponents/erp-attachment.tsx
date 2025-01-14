"use client";

import { X } from "lucide-react";
import React, { useState, useCallback, Dispatch, SetStateAction, useEffect, useRef } from "react";

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

export default function ERPAttachment({ setIsOpen }: ERPAttachmentProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    []
  );

  const addFiles = (newFiles: File[]) => {
    const newUploads = newFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newUploads]);

    // Simulate upload for each file
    newUploads.forEach((upload) => {
      simulateUpload(upload.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress, uploaded: true } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div  className=" w-full  p-2  self-end max-h-[100%] overflow-auto  pb-[64px]">
      <button
        className="text-gray-500 hover:text-gray-700 right-0"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <X className="h-5 w-5" />
      </button>
      <div
        className={`border-2 border-dashed rounded-lg p-3  text-center transition-colors ${
          isDragging
            ? "border-[#3b82f6] bg-[#eff6ff]"
            : "border-gray-300 hover:border-[#93c5fd]"
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
              className="px-4 py-2 font-semibold text-sm bg-[#3b82f6] text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Browse Files
            </button>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          <p className="text-sm text-gray-500">Or drop files here</p>
        </div>
      </div>

      <div className="mt-1 ">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center  bg-gray-50 rounded-lg p-3 transition-all hover:bg-gray-300 border border-b-[#00000024]"
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
            <div className="flex-grow min-w-0 flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-hidden">
                <p className="font-medium truncate text-sm">{file.file.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {formatFileSize(file.file.size)}
                </p>
                <button
                  onClick={() => removeFile(file.id)}
                  className="h-6 w-6 flex items-center justify-center text-gray-500 hover:text-red-[#ef4444]"
                >
                  {file.uploaded ? (
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
            <div className="flex items-center space-x-2 w-24 flex-shrink-0">
              <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3b82f6] transition-all duration-300 ease-out"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
              <p className="text-xs font-medium text-gray-500 w-8 text-right">
                {file.uploaded ? (
                  <span className="text-green-600">Done</span>
                ) : (
                  `${Math.round(file.progress)}%`
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
