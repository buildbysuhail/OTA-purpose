// import React, { useState, useEffect } from 'react';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { FormField } from '../../../../../utilities/form-types';
// import { ProductImageDto } from '../products-type';

// // Define the ProductImageDto interface

// interface Props {
//   getFieldProps: (fieldId: string, type?: string) => FormField;
//   handleFieldChange: (field: string, value: any) => void;
//   t: any;
//   isView: boolean;
// }

// const ImageCommon: React.FC<Props> = ({ getFieldProps, handleFieldChange, t, isView }) => {
//   const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
//   const [imageDto, setImageDto] = useState<ProductImageDto>({});

//   useEffect(() => {
//     // Get the ProductImageDto from form props
//     const productImageDto = getFieldProps("EmployeeImage").value;
//     if (productImageDto) {
//       setImageDto(productImageDto);
//     }
//   }, [getFieldProps("EmployeeImage").value]);   
//   const captureImage = async () => {
//     try {
//       const image = await Camera.getPhoto({
//         quality: 90,
//         allowEditing: false,
//         resultType: CameraResultType.DataUrl,
//         source: CameraSource.Camera,
//       });

//       if (image && image.dataUrl) {
//         const newImageDto: ProductImageDto = {
//           base64String: image.dataUrl,
//           fileName: `camera-capture-${Date.now()}.jpg` // Generate filename for camera capture
//         };
//         setImageDto(newImageDto);
//         handleFieldChange('productImage', newImageDto);
//       }
//     } catch (error) {
//       console.error('Error capturing image:', error);
//     }
//   };

//   const selectImage = () => {
//     // Create a hidden file input element
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = 'image/*'; // Accept only image files
//     fileInput.onchange = async (event: any) => {
//       const file = event.target.files?.[0];

//       if (file) {
//         try {
//           // Validate file type
//           if (!file.type.startsWith('image/')) {
//             console.error('Please select an image file');
//             return;
//           }

//           // Convert file to base64
//           const reader = new FileReader();

//           reader.onload = () => {
//             const base64String = reader.result as string;

//             const newImageDto: ProductImageDto = {
//               base64String: base64String,
//               fileName: file.name // Use the actual file name
//             };

//             setImageDto(newImageDto);
//             handleFieldChange('productImage', newImageDto);
//           };

//           reader.onerror = (error) => {
//             console.error('Error reading file:', error);
//           };

//           // Read the file as data URL (base64)
//           reader.readAsDataURL(file);
//         } catch (error) {
//           console.error('Error processing image:', error);
//         }
//       }
//     };

//     // Trigger file selection dialog
//     fileInput.click();
//   };

//   const removeImage = () => {
//     setImageDto({});
//     handleFieldChange('productImage', null);
//   };

//   return (
//     <div className="border rounded-md p-4 bg-white">
//       {/* Tab Navigation */}
//       <div className="flex mb-4 border-b">
//         <button
//           disabled={isView}
//           onClick={() => setActiveTab('upload')}
//           className={`flex-1 py-2 px-4 font-medium transition-colors cursor-pointer ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
//           {t("upload_image")}
//         </button>
//         <button
//           disabled={isView}
//           onClick={() => setActiveTab('webcam')}
//           className={`flex-1 py-2 px-4 font-medium transition-colors cursor-pointer ${activeTab === 'webcam' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
//           {t("webcam_capture")}
//         </button>
//       </div>

//       {/* Upload Tab Content */}
//       {activeTab === 'upload' && (
//         <div className="text-center py-8">
//           <button
//             onClick={selectImage}
//             className={`border-dashed border-2 border-gray-300 p-8 rounded-lg transition-colors w-full hover:border-blue-400 ${isView ? 'cursor-not-allowed' : 'cursor-pointer'}`}
//             disabled={isView}
//           >
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400 mb-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//               />
//             </svg>
//             <p className="text-gray-600">{t("browse_or_drag")}</p>
//             <p className="text-xs text-gray-500 mt-2">{t("supported_formats", "JPG, PNG, GIF")}</p>
//           </button>
//         </div>
//       )
//       }

//       {/* Webcam Tab Content */}
//       {
//         activeTab === 'webcam' && (
//           <div className="text-center py-8">
//             <button
//               onClick={captureImage}
//               className="bg-green-500 hover:bg-green-600 cursor-pointer text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
//               disabled={isView}
//             >
//               <svg
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//               {t("capture_image")}
//             </button>
//             <p className="text-xs text-gray-500 mt-3">{t("camera_permission_required", "Camera permission required")}</p>
//           </div>
//         )
//       }

//       {/* Image Preview */}
//       {
//         imageDto.base64String && (
//           <div className="mt-6">
//             <div className="relative">
//               <img
//                 src={imageDto.base64String}
//                 alt="Product"
//                 className="mx-auto rounded-lg border shadow-sm max-h-64 object-contain"
//               />

//               {/* Image Info and Actions */}
//               <div className="mt-3 flex items-center justify-between">
//                 <div className="text-sm text-gray-600">
//                   {imageDto.fileName && (
//                     <span className="font-medium">{imageDto.fileName}</span>
//                   )}
//                 </div>
//                 <button
//                   onClick={removeImage}
//                   className="text-red-500 hover:text-red-700 cursor-pointer text-sm font-medium transition-colors"
//                   disabled={isView}
//                 >
//                   {t("remove_image")}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }
//     </div >
//   );
// };

// export default React.memo(ImageCommon);