
  import React, { useState, useRef, useEffect } from 'react';
  import { useTranslation } from 'react-i18next';
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormField } from '../../../../../utilities/form-types';
  
  interface Props {
    getFieldProps: (fieldId: string, type?: string) => FormField;
    handleFieldChange: (field: string, value: any) => void;
    t: any;
  }
  
  const ImageCommon: React.FC<Props> = ({ getFieldProps, handleFieldChange, t }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
    const [image, setImage] = useState('');
  useEffect(() => {
    setImage(getFieldProps("productImageString").value);
  },[getFieldProps("productImageString")])
    const captureImage = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
  
      if (image && image.dataUrl) {
        handleFieldChange('productImageString', image.dataUrl);
      }
    };
  
    const selectImage = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
  
      if (image && image.dataUrl) {
        handleFieldChange('productImageString', image.dataUrl);
      }
    };
  
    return (
      <div className="border rounded-md p-4 bg-white">
        {/* <div className="flex mb-4">
          <button onClick={() => setActiveTab('upload')} className={`flex-1 py-2 ${activeTab === 'upload' ? 'border-b-2 border-blue-500' : ''}`}>
            {t("upload_image")}
          </button>
          <button onClick={() => setActiveTab('webcam')} className={`flex-1 py-2 ${activeTab === 'webcam' ? 'border-b-2 border-blue-500' : ''}`}>
            {t("webcam_capture")}
          </button>
        </div> */}
  
        {/* {activeTab === 'upload' && ( */}
          <div className="text-center">
            <button onClick={selectImage} className="border-dashed border-2 p-4 rounded">
              {t("browse_or_drag")}
            </button>
          </div>
        {/* )} */}
  
        {/* {activeTab === 'webcam' && (
          <div className="text-center">
            <button onClick={captureImage} className="bg-green-500 text-white px-4 py-2 rounded">
              {t("capture_image")}
            </button>
          </div>
        )} */}
  
        {image && (
          <div className="mt-4">
            <img src={image} alt="Product" className="mx-auto rounded border" />
          </div>
        )}
      </div>
    );
  };
  
  export default React.memo(ImageCommon);
  