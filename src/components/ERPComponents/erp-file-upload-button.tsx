import React from 'react';

interface FileUploadButtonProps {
  buttonText?: string;
  buttonClassName?: string;
  iconClassName?: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
}

const ERPFileUploadButton: React.FC<FileUploadButtonProps> = ({
  buttonText = 'Upload File',
  buttonClassName = 'ti-btn ti-btn-primary-full m-2',
  iconClassName = 'ri-upload-line text-[1rem]',
  handleFileChange,
  multiple = false,
  accept,
  disabled = false,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <button
        type="button"
        className={buttonClassName}
        onClick={handleButtonClick}
        disabled={disabled}
      >
        <span className="me-2">{buttonText}</span>
        <i className={iconClassName}></i>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
        accept={accept}
      />
    </div>
  );
};

export default ERPFileUploadButton;
