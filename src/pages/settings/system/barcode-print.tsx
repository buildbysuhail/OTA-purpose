// import React, { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useRootState } from "../../../utilities/hooks/useRootState";
// import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
// import Urls from "../../../redux/urls";
// import ERPInput from "../../../components/ERPComponents/erp-input";
// import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
// import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
// import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
// import { toggleBankPosPopup } from "../../../redux/slices/popup-reducer";
// import { useTranslation } from "react-i18next";
// import { BankPoseData } from "../Administration/administration-types";

// const Barcodeprint: React.FC = React.memo(() => {
//   const rootState = useRootState();
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
//     useFormManager<BankPoseData>({
//       url: Urls.BankPosSettings,
//       onSuccess: useCallback(
//         () => dispatch(toggleBankPosPopup({ isOpen: false, key: null })),
//         [dispatch]
//       ),
//       key: rootState.PopupData.reminder.key,
//     });

//   const onClose = useCallback(() => {
//     dispatch(toggleBankPosPopup({ isOpen: false, key: null }));
//   }, []);

//   return (

//     <div className="p-4 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto">
//       <div className="flex flex-wrap justify-between items-center mb-4">
//         <div className="flex space-x-2 mb-2 md:mb-0 ">
//           <button className="px-2 py-1 bg-blue text-white rounded">
//             Print
//           </button>
//           <button className="px-2 py-1 bg-red text-white rounded">
//             Clear
//           </button>
//           <button className="px-2 py-1 bg-yellow text-white rounded">
//             Remove Line
//           </button>
//           <button className="px-2 py-1 bg-green text-white rounded">
//             Close
//           </button>
//           <button className="px-2 py-1 bg-blue text-white rounded">
//             Print Tag
//           </button>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ">
//         <div className="  border-black">
//           <label>Barcode Form</label>
//           <div className="flex space-x-2 mb-2">
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1 flex-1"
//             />
//             <span>To</span>
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1 flex-1"
//             />
//           </div>
//           <label>BarCode Comma Separated</label>
//           <input
//             type="text"
//             className="border border-gray-300 rounded p-1 w-full mb-2"
//           />
//           <div className="flex items-center space-x-2">
//             <input type="checkbox" />
//             <span>Preview</span>
//             <button className="px-2 py-1 bg-gray-300 rounded">Show</button>
//           </div>
//         </div>
//         <div>
//           <div className="flex flex-col space-y-2">
//             <div className="flex items-center space-x-2">
//               <input type="radio" name="type" />
//               <span>Sales</span>
//               <input
//                 type="text"
//                 className="border border-gray-300 rounded p-1 flex-1"
//                 placeholder="VPrefix"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <input type="radio" name="type" />
//               <span>Purchase</span>
//               <select className="border border-gray-300 rounded p-1 flex-1">
//                 <option>Form Type</option>
//               </select>
//             </div>
//             <div className="flex items-center space-x-2">
//               <input type="radio" name="type" />
//               <span>BTO</span>
//               <input
//                 type="text"
//                 className="border border-gray-300 rounded p-1 flex-1"
//                 placeholder="Bill No"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <input type="radio" name="type" />
//               <span>BTI</span>
//               <input
//                 type="text"
//                 className="border border-gray-300 rounded p-1 flex-1"
//                 placeholder="0"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <input type="radio" name="type" />
//               <span>OS</span>
//               <button className="px-2 py-1 bg-gray-300 rounded">Show</button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <input type="radio" name="type" />
//               <span>Other</span>
//               <input
//                 type="text"
//                 className="border border-gray-300 rounded p-1 flex-1"
//               />
//             </div>
//           </div>
//         </div>
//         <div>
//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1"
//               placeholder="Pack.Date"
//             />
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1"
//               placeholder="Note 3"
//             />
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1"
//               placeholder="Exp.Desc"
//             />
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1"
//               placeholder="Note 4"
//             />
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1"
//               placeholder="Note 1"
//             />
//             <input
//               type="text"
//               className="border border-gray-300 rounded p-1"
//               placeholder="Note 2"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-wrap items-center space-x-2 mb-4">
//         <label>Label Design</label>
//         <input
//           type="text"
//           className="border border-gray-300 rounded p-1"
//           placeholder="BARCODE.lba"
//         />
//         <label>Start Row</label>
//         <input
//           type="text"
//           className="border border-gray-300 rounded p-1"
//           placeholder="0"
//         />
//         <label>End Row</label>
//         <input
//           type="text"
//           className="border border-gray-300 rounded p-1"
//           placeholder="0"
//         />
//         <div className="flex items-center space-x-2">
//           <input type="checkbox" />
//           <span>In Search</span>
//         </div>
//       </div>
//       <div className="flex flex-wrap items-center space-x-2 mb-4">
//         <div className="flex items-center space-x-2">
//           <input type="checkbox" />
//           <span>Preview</span>
//         </div>
//         <button className="px-2 py-1 bg-blue-500 text-white rounded">
//           Print
//         </button>
//         <label>Label Design</label>
//         <select className="border border-gray-300 rounded p-1">
//           <option>Barcode Label1.repx</option>
//         </select>
//         <label>Printer</label>
//         <select className="border border-gray-300 rounded p-1">
//           <option></option>
//         </select>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 p-2">Bar Code</th>
//               <th className="border border-gray-300 p-2">Product</th>
//               <th className="border border-gray-300 p-2">Copies</th>
//               <th className="border border-gray-300 p-2">Unit</th>
//               <th className="border border-gray-300 p-2">Brand</th>
//               <th className="border border-gray-300 p-2">Cost</th>
//               <th className="border border-gray-300 p-2">SalesPrice</th>
//               <th className="border border-gray-300 p-2">MRP</th>
//               <th className="border border-gray-300 p-2">BarcodePrinted</th>
//               <th className="border border-gray-300 p-2">X</th>
//               <th className="border border-gray-300 p-2">MSP</th>
//               <th className="border border-gray-300 p-2">MBarc</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.from({ length: 10 }).map((_, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2 text-blue-500 cursor-pointer">
//                   X
//                 </td>
//                 <td className="border border-gray-300 p-2"></td>
//                 <td className="border border-gray-300 p-2 text-blue-500 cursor-pointer">
//                   X
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// });
// export default Barcodeprint;

// ============

// import React, { useState, ChangeEvent, FormEvent } from 'react';

// interface FormData {
//   barcodeFrom: string;
//   barcodeTo: string;
//   barcodeComma: string;
//   preview: boolean;
//   type: string;
//   vPrefix: string;
//   formType: string;
//   billNo: string;
//   btiValue: string;
//   other: string;
//   packDate: string;
//   note3: string;
//   expDesc: string;
//   note4: string;
//   note1: string;
//   note2: string;
//   labelDesign: string;
//   startRow: string;
//   endRow: string;
//   inSearch: boolean;
//   standardPreview: boolean;
//   standardLabelDesign: string;
//   printer: string;
// }

// type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

// const Barcodeprint: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     barcodeFrom: '',
//     barcodeTo: '',
//     barcodeComma: '',
//     preview: false,
//     type: 'sales',
//     vPrefix: '',
//     formType: '',
//     billNo: '',
//     btiValue: '',
//     other: '',
//     packDate: '',
//     note3: '',
//     expDesc: '',
//     note4: '',
//     note1: '',
//     note2: '',
//     labelDesign: 'BARCODE.lba',
//     startRow: '0',
//     endRow: '0',
//     inSearch: false,
//     standardPreview: false,
//     standardLabelDesign: 'Barcode Label1.repx',
//     printer: ''
//   });

//   const handleInputChange = (e: InputChangeEvent) => {
//     const { name, value, type } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="p-4 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto">
//       <div className="flex flex-wrap gap-2 mb-4 border-black">
//         {["Print", "Clear", "Remove Line", "Close", "Print Tag"].map((label) => (
//           <button key={label} className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
//             {label}
//           </button>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <div className="flex flex-col gap-2">
//             <label className="font-semibold">Barcode Form</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 name="barcodeFrom"
//                 value={formData.barcodeFrom}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 rounded p-2 flex-1"
//               />
//               <span className="self-center">To</span>
//               <input
//                 type="text"
//                 name="barcodeTo"
//                 value={formData.barcodeTo}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 rounded p-2 flex-1"
//               />
//             </div>
//             <label className="font-semibold">BarCode Comma Separated</label>
//             <input
//               type="text"
//               name="barcodeComma"
//               value={formData.barcodeComma}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded p-2 w-full"
//             />
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="preview"
//                 checked={formData.preview}
//                 onChange={handleInputChange}
//                 className="form-checkbox"
//               />
//               <span>Preview</span>
//               <button type="button" className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">Show</button>
//             </div>
//           </div>

//           <div className="flex flex-col gap-2">
//             {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map((label) => (
//               <div key={label} className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="type"
//                   value={label.toLowerCase()}
//                   checked={formData.type === label.toLowerCase()}
//                   onChange={handleInputChange}
//                   className="form-radio"
//                 />
//                 <span>{label}</span>
//                 {label === 'Sales' && (
//                   <input
//                     type="text"
//                     name="vPrefix"
//                     value={formData.vPrefix}
//                     onChange={handleInputChange}
//                     placeholder="VPrefix"
//                     className="border border-gray-300 rounded p-2 flex-1"
//                   />
//                 )}
//                 {label === 'Purchase' && (
//                   <select
//                     name="formType"
//                     value={formData.formType}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2 flex-1"
//                   >
//                     <option>Form Type</option>
//                   </select>
//                 )}
//                 {label === 'BTO' && (
//                   <input
//                     type="text"
//                     name="billNo"
//                     value={formData.billNo}
//                     onChange={handleInputChange}
//                     placeholder="Bill No"
//                     className="border border-gray-300 rounded p-2 flex-1"
//                   />
//                 )}
//                 {label === 'BTI' && (
//                   <input
//                     type="text"
//                     name="btiValue"
//                     value={formData.btiValue}
//                     onChange={handleInputChange}
//                     placeholder="0"
//                     className="border border-gray-300 rounded p-2 flex-1"
//                   />
//                 )}
//                 {label === 'OS' && (
//                   <button type="button" className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">Show</button>
//                 )}
//                 {label === 'Other' && (
//                   <input
//                     type="text"
//                     name="other"
//                     value={formData.other}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded p-2 flex-1"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             {(["packDate", "note3", "expDesc", "note4", "note1", "note2"] as const).map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 rounded p-2"
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <label className="font-semibold">Label Design</label>
//           <input
//             type="text"
//             name="labelDesign"
//             value={formData.labelDesign}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           />
//           <label className="font-semibold">Start Row</label>
//           <input
//             type="text"
//             name="startRow"
//             value={formData.startRow}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-16"
//           />
//           <label className="font-semibold">End Row</label>
//           <input
//             type="text"
//             name="endRow"
//             value={formData.endRow}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-16"
//           />
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="inSearch"
//               checked={formData.inSearch}
//               onChange={handleInputChange}
//               className="form-checkbox"
//             />
//             <span>In Search</span>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="standardPreview"
//               checked={formData.standardPreview}
//               onChange={handleInputChange}
//               className="form-checkbox"
//             />
//             <span>Preview</span>
//           </div>
//           <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Print</button>
//           <label className="font-semibold">Label Design</label>
//           <select
//             name="standardLabelDesign"
//             value={formData.standardLabelDesign}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           >
//             <option>Barcode Label1.repx</option>
//           </select>
//           <label className="font-semibold">Printer</label>
//           <select
//             name="printer"
//             value={formData.printer}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           >
//             <option value="">Select Printer</option>
//           </select>
//         </div>
//       </form>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               {["Bar Code", "Product", "Copies", "Unit", "Brand", "Cost", "SalesPrice", "MRP", "BarcodePrinted", "X", "MSP", "MBarc"].map((header) => (
//                 <th key={header} className="border border-gray-300 p-2 text-left">{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {Array.from({ length: 10 }).map((_, index) => (
//               <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                 {Array.from({ length: 12 }).map((_, cellIndex) => (
//                   <td key={cellIndex} className="border border-gray-300 p-2">
//                     {cellIndex === 9 || cellIndex === 11 ? (
//                       <span className="text-blue-500 cursor-pointer">X</span>
//                     ) : null}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Barcodeprint;
// ============

// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import ERPInput from '../../../components/ERPComponents/erp-input';

// interface FormData {
//   barcodeFrom: string;
//   barcodeTo: string;
//   barcodeComma: string;
//   preview: boolean;
//   type: string;
//   vPrefix: string;
//   formType: string;
//   billNo: string;
//   btiValue: string;
//   other: string;
//   packDate: string;
//   note3: string;
//   expDesc: string;
//   note4: string;
//   note1: string;
//   note2: string;
//   labelDesign: string;
//   startRow: string;
//   endRow: string;
//   inSearch: boolean;
//   standardPreview: boolean;
//   standardLabelDesign: string;
//   printer: string;
// }

// type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

// const Barcodeprint: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     barcodeFrom: '',
//     barcodeTo: '',
//     barcodeComma: '',
//     preview: false,
//     type: 'sales',
//     vPrefix: '',
//     formType: '',
//     billNo: '',
//     btiValue: '',
//     other: '',
//     packDate: '',
//     note3: '',
//     expDesc: '',
//     note4: '',
//     note1: '',
//     note2: '',
//     labelDesign: 'BARCODE.lba',
//     startRow: '0',
//     endRow: '0',
//     inSearch: false,
//     standardPreview: false,
//     standardLabelDesign: 'Barcode Label1.repx',
//     printer: ''
//   });

//   const handleInputChange = (e: InputChangeEvent) => {
//     const { name, value, type } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto my-6">
//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         {["Print", "Clear", "Remove Line", "Close", "Print Tag"].map((label) => (
//           <button
//             key={label}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Top Section */}
//         <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
//           {/* Barcode Inputs */}
//           <div className="flex-1 space-y-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Barcode From & To</label>
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <input
//                   type="text"
//                   name="barcodeFrom"
//                   value={formData.barcodeFrom}
//                   onChange={handleInputChange}
//                   placeholder="From"
//                   className="w-full sm:w-1/2 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <span className="hidden sm:inline-block">To</span>
//                 <input
//                   type="text"
//                   name="barcodeTo"
//                   value={formData.barcodeTo}
//                   onChange={handleInputChange}
//                   placeholder="To"
//                   className="w-full sm:w-1/2 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">BarCode Comma Separated</label>
//               <input
//                 type="text"
//                 name="barcodeComma"
//                 value={formData.barcodeComma}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex items-center space-x-4">
//               <input
//                 type="checkbox"
//                 name="preview"
//                 checked={formData.preview}
//                 onChange={handleInputChange}
//                 className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <span className="text-gray-700">Preview</span>
//               <button type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400">
//                 Show
//               </button>
//             </div>
//           </div>

//           {/* Type Selection */}
//           <div className="flex-1 space-y-4">
//             <label className="block text-sm font-semibold text-gray-700">Type</label>
//             {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map((label) => (
//               <div key={label} className="flex items-center space-x-3">
//                 <input
//                   type="radio"
//                   name="type"
//                   value={label.toLowerCase()}
//                   checked={formData.type === label.toLowerCase()}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />

//                 <span className="text-gray-700">{label}</span>
//                 {/* Conditional Inputs Based on Type */}
//                 {label === 'Sales' && (
//                   <input
//                     type="text"
//                     name="vPrefix"
//                     value={formData.vPrefix}
//                     onChange={handleInputChange}
//                     placeholder="VPrefix"
//                     className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 )}
//                 {label === 'Purchase' && (
//                   <select
//                     name="formType"
//                     value={formData.formType}
//                     onChange={handleInputChange}
//                     className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Form Type</option>
//                     {/* Add more options as needed */}
//                   </select>
//                 )}
//                 {label === 'BTO' && (
//                   <input
//                     type="text"
//                     name="billNo"
//                     value={formData.billNo}
//                     onChange={handleInputChange}
//                     placeholder="Bill No"
//                     className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 )}
//                 {label === 'BTI' && (
//                   <input
//                     type="number"
//                     name="btiValue"
//                     value={formData.btiValue}
//                     onChange={handleInputChange}
//                     placeholder="0"
//                     className="w-20 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 )}
//                 {label === 'OS' && (
//                   <button type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400">
//                     Show
//                   </button>
//                 )}
//                 {label === 'Other' && (
//                   <input
//                     type="text"
//                     name="other"
//                     value={formData.other}
//                     onChange={handleInputChange}
//                     className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Additional Fields */}
//           <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {(["packDate", "note3", "expDesc", "note4", "note1", "note2"] as const).map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Middle Section */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-6 lg:space-y-0">
//           {/* Label Design and Rows */}
//           <div className="flex flex-wrap items-center space-x-4">
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-1">Label Design</label>
//               <input
//                 type="text"
//                 name="labelDesign"
//                 value={formData.labelDesign}
//                 onChange={handleInputChange}
//                 className="w-full sm:w-64 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-1">Start Row</label>
//               <input
//                 type="number"
//                 name="startRow"
//                 value={formData.startRow}
//                 onChange={handleInputChange}
//                 className="w-24 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-1">End Row</label>
//               <input
//                 type="number"
//                 name="endRow"
//                 value={formData.endRow}
//                 onChange={handleInputChange}
//                 className="w-24 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* In Search Checkbox */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               name="inSearch"
//               checked={formData.inSearch}
//               onChange={handleInputChange}
//               className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <span className="text-gray-700">In Search</span>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-6 lg:space-y-0">
//           {/* Standard Preview */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               name="standardPreview"
//               checked={formData.standardPreview}
//               onChange={handleInputChange}
//               className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <span className="text-gray-700">Standard Preview</span>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Print
//           </button>

//           {/* Standard Label Design */}
//           <div className="flex flex-col">
//             <label className="text-sm font-semibold text-gray-700 mb-1">Standard Label Design</label>
//             <select
//               name="standardLabelDesign"
//               value={formData.standardLabelDesign}
//               onChange={handleInputChange}
//               className="w-full sm:w-64 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Barcode Label1.repx">Barcode Label1.repx</option>
//               {/* Add more options as needed */}
//             </select>
//           </div>

//           {/* Printer Selection */}
//           <div className="flex flex-col">
//             <label className="text-sm font-semibold text-gray-700 mb-1">Printer</label>
//             <select
//               name="printer"
//               value={formData.printer}
//               onChange={handleInputChange}
//               className="w-full sm:w-64 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Printer</option>
//               {/* Add more printer options here */}
//             </select>
//           </div>
//         </div>
//       </form>

//       {/* Data Table */}
//       <div className="mt-8 overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               {["Bar Code", "Product", "Copies", "Unit", "Brand", "Cost", "Sales Price", "MRP", "Barcode Printed", "X", "MSP", "MBarc"].map((header) => (
//                 <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {Array.from({ length: 10 }).map((_, index) => (
//               <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                 {Array.from({ length: 12 }).map((_, cellIndex) => (
//                   <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
//                     {cellIndex === 9 || cellIndex === 11 ? (
//                       <span className="text-blue-500 cursor-pointer">X</span>
//                     ) : (
//                       // Placeholder content; replace with actual data as needed
//                       "-"
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Barcodeprint;

// ===========

// import React, { useState, ChangeEvent, FormEvent } from "react";

// interface FormData {
//   barcodeFrom: string;
//   barcodeTo: string;
//   barcodeComma: string;
//   preview: boolean;
//   type: string;
//   vPrefix: string;
//   formType: string;
//   billNo: string;
//   btiValue: string;
//   other: string;
//   packDate: string;
//   note3: string;
//   expDesc: string;
//   note4: string;
//   note1: string;
//   note2: string;
//   labelDesign: string;
//   startRow: string;
//   endRow: string;
//   inSearch: boolean;
//   standardPreview: boolean;
//   standardLabelDesign: string;
//   printer: string;
// }

// type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

// const Barcodeprint: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     barcodeFrom: "",
//     barcodeTo: "",
//     barcodeComma: "",
//     preview: false,
//     type: "sales",
//     vPrefix: "",
//     formType: "",
//     billNo: "",
//     btiValue: "",
//     other: "",
//     packDate: "",
//     note3: "",
//     expDesc: "",
//     note4: "",
//     note1: "",
//     note2: "",
//     labelDesign: "BARCODE.lba",
//     startRow: "0",
//     endRow: "0",
//     inSearch: false,
//     standardPreview: false,
//     standardLabelDesign: "Barcode Label1.repx",
//     printer: "",
//   });

//   const handleInputChange = (e: InputChangeEvent) => {
//     const { name, value, type } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="p-4 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto my-4">
//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {["Print", "Clear", "Remove Line", "Close", "Print Tag"].map(
//           (label) => (
//             <button
//               key={label}
//               className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//             >
//               {label}
//             </button>
//           )
//         )}
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Top Section */}
//         <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
//           {/* Barcode Inputs */}
//           <div className="flex-1 space-y-2">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Barcode From & To
//               </label>
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <input
//                   type="text"
//                   name="barcodeFrom"
//                   value={formData.barcodeFrom}
//                   onChange={handleInputChange}
//                   placeholder="From"
//                   className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <span className="hidden sm:inline-block">To</span>
//                 <input
//                   type="text"
//                   name="barcodeTo"
//                   value={formData.barcodeTo}
//                   onChange={handleInputChange}
//                   placeholder="To"
//                   className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 BarCode Comma Separated
//               </label>
//               <input
//                 type="text"
//                 name="barcodeComma"
//                 value={formData.barcodeComma}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="preview"
//                 checked={formData.preview}
//                 onChange={handleInputChange}
//                 className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <span className="text-gray-700">Preview</span>
//               <button
//                 type="button"
//                 className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//               >
//                 Show
//               </button>
//             </div>
//           </div>

//           {/* Type Selection */}
//           <div className="flex-1 space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Type
//             </label>
//             {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map((label) => (
//               <div key={label} className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="type"
//                   value={label.toLowerCase()}
//                   checked={formData.type === label.toLowerCase()}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <span className="text-gray-700">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
//           <div className="flex-1 space-y-2">
//             <input
//               type="text"
//               name="vPrefix"
//               value={formData.vPrefix}
//               onChange={handleInputChange}
//               placeholder="VPrefix"
//               className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="packDate"
//               value={formData.packDate}
//               onChange={handleInputChange}
//               placeholder="Pack Date"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="expDesc"
//               value={formData.expDesc}
//               onChange={handleInputChange}
//               placeholder="Exp Desc"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="note1"
//               value={formData.note1}
//               onChange={handleInputChange}
//               placeholder="Note 1"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex-1 space-y-2">
//             <input
//               type="text"
//               name="note2"
//               value={formData.note2}
//               onChange={handleInputChange}
//               placeholder="Note 2"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="note3"
//               value={formData.note3}
//               onChange={handleInputChange}
//               placeholder="Note 3"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="note4"
//               value={formData.note4}
//               onChange={handleInputChange}
//               placeholder="Note 4"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Label Design and Row Inputs */}
//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <label className="font-semibold">Label Design</label>
//           <input
//             type="text"
//             name="labelDesign"
//             value={formData.labelDesign}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           />
//           <label className="font-semibold">Start Row</label>
//           <input
//             type="text"
//             name="startRow"
//             value={formData.startRow}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-16"
//           />
//           <label className="font-semibold">End Row</label>
//           <input
//             type="text"
//             name="endRow"
//             value={formData.endRow}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-16"
//           />
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="inSearch"
//               checked={formData.inSearch}
//               onChange={handleInputChange}
//               className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <span className="text-gray-700">In Search</span>
//           </div>
//         </div>

//         {/* Standard Preview and Printer Selection */}
//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="standardPreview"
//               checked={formData.standardPreview}
//               onChange={handleInputChange}
//               className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <span className="text-gray-700">Standard Preview</span>
//           </div>
//           <button
//             type="submit"
//             className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             Print
//           </button>
//           <label className="font-semibold">Standard Label Design</label>
//           <select
//             name="standardLabelDesign"
//             value={formData.standardLabelDesign}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded-md p-2"
//           >
//             <option>Barcode Label1.repx</option>
//           </select>
//           <label className="font-semibold">Printer</label>
//           <select
//             name="printer"
//             value={formData.printer}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded-md p-2"
//           >
//             <option value="">Select Printer</option>
//           </select>
//         </div>
//       </form>

//       {/* Data Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               {[
//                 "Bar Code",
//                 "Product",
//                 "Copies",
//                 "Unit",
//                 "Brand",
//                 "Cost",
//                 "SalesPrice",
//                 "MRP",
//                 "BarcodePrinted",
//                 "X",
//                 "MSP",
//                 "MBarc",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="border border-gray-300 p-2 text-left"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {Array.from({ length: 10 }).map((_, index) => (
//               <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                 {Array.from({ length: 12 }).map((_, cellIndex) => (
//                   <td key={cellIndex} className="border border-gray-300 p-2">
//                     {cellIndex === 9 || cellIndex === 11 ? (
//                       <span className="text-blue-500 cursor-pointer">X</span>
//                     ) : null}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Barcodeprint;

// =========?

// import React, { useState, ChangeEvent, FormEvent } from "react";

// interface FormData {
//   barcodeFrom: string;
//   barcodeTo: string;
//   barcodeComma: string;
//   preview: boolean;
//   type: string;
//   vPrefix: string;
//   formType: string;
//   billNo: string;
//   btiValue: string;
//   other: string;
//   packDate: string;
//   note3: string;
//   expDesc: string;
//   note4: string;
//   note1: string;
//   note2: string;
//   labelDesign: string;
//   startRow: string;
//   endRow: string;
//   inSearch: boolean;
//   standardPreview: boolean;
//   standardLabelDesign: string;
//   printer: string;
// }

// type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

// const Barcodeprint: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     barcodeFrom: "",
//     barcodeTo: "",
//     barcodeComma: "",
//     preview: false,
//     type: "sales",
//     vPrefix: "",
//     formType: "",
//     billNo: "",
//     btiValue: "",
//     other: "",
//     packDate: "",
//     note3: "",
//     expDesc: "",
//     note4: "",
//     note1: "",
//     note2: "",
//     labelDesign: "BARCODE.lba",
//     startRow: "0",
//     endRow: "0",
//     inSearch: false,
//     standardPreview: false,
//     standardLabelDesign: "Barcode Label1.repx",
//     printer: "",
//   });

//   const handleInputChange = (e: InputChangeEvent) => {
//     const { name, value, type } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="p-4 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto my-4">
//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {["Print", "Clear", "Remove Line", "Close", "Print Tag"].map(
//           (label) => (
//             <button
//               key={label}
//               className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//             >
//               {label}
//             </button>
//           )
//         )}
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Top Section */}
//         <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4 justify-between">
//           {/* Barcode Inputs */}
//           <div className="flex-1 space-y-2">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Barcode From & To
//               </label>
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <input
//                   type="text"
//                   name="barcodeFrom"
//                   value={formData.barcodeFrom}
//                   onChange={handleInputChange}
//                   placeholder="From"
//                   className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <span className="hidden sm:inline-block">To</span>
//                 <input
//                   type="text"
//                   name="barcodeTo"
//                   value={formData.barcodeTo}
//                   onChange={handleInputChange}
//                   placeholder="To"
//                   className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 BarCode Comma Separated
//               </label>
//               <input
//                 type="text"
//                 name="barcodeComma"
//                 value={formData.barcodeComma}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="preview"
//                 checked={formData.preview}
//                 onChange={handleInputChange}
//                 className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <span className="text-gray-700">Preview</span>
//               <button
//                 type="button"
//                 className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//               >
//                 Show
//               </button>
//             </div>
//           </div>

//           {/* Type Selection */}
//           <div className="flex-1 space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Type
//             </label>
//             {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map((label) => (
//               <div key={label} className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="type"
//                   value={label.toLowerCase()}
//                   checked={formData.type === label.toLowerCase()}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <span className="text-gray-700">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//          {/* t input */}
//         <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
//           <div className="flex-1 space-y-2">
//             <input
//               type="text"
//               name="vPrefix"
//               value={formData.vPrefix}
//               onChange={handleInputChange}
//               placeholder="VPrefix"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="packDate"
//               value={formData.packDate}
//               onChange={handleInputChange}
//               placeholder="Pack Date"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="expDesc"
//               value={formData.expDesc}
//               onChange={handleInputChange}
//               placeholder="Exp Desc"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="note1"
//               value={formData.note1}
//               onChange={handleInputChange}
//               placeholder="Note 1"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex-1 space-y-2">
//             <input
//               type="text"
//               name="note2"
//               value={formData.note2}
//               onChange={handleInputChange}
//               placeholder="Note 2"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="note3"
//               value={formData.note3}
//               onChange={handleInputChange}
//               placeholder="Note 3"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="note4"
//               value={formData.note4}
//               onChange={handleInputChange}
//               placeholder="Note 4"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Label Design and Row Inputs */}
//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <label className="font-semibold">Label Design</label>
//           <input
//             type="text"
//             name="labelDesign"
//             value={formData.labelDesign}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           />
//           <label className="font-semibold">Start Row</label>
//           <input
//             type="text"
//             name="startRow"
//             value={formData.startRow}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           />
//           <label className="font-semibold">End Row</label>
//           <input
//             type="text"
//             name="endRow"
//             value={formData.endRow}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2"
//           />
//         </div>

//         {/* Additional Options */}
//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             name="inSearch"
//             checked={formData.inSearch}
//             onChange={handleInputChange}
//             className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <span className="text-gray-700">In Search</span>
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             name="standardPreview"
//             checked={formData.standardPreview}
//             onChange={handleInputChange}
//             className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <span className="text-gray-700">Standard Preview</span>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">
//             Printer
//           </label>
//           <input
//             type="text"
//             name="printer"
//             value={formData.printer}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Barcodeprint;
// =======??

// import React, { useState, ChangeEvent, FormEvent } from "react";

// interface FormData {
//   barcodeFrom: string;
//   barcodeTo: string;
//   barcodeComma: string;
//   preview: boolean;
//   type: string;
//   vPrefix: string;
//   formType: string;
//   billNo: string;
//   btiValue: string;
//   other: string;
//   packDate: string;
//   note3: string;
//   expDesc: string;
//   note4: string;
//   note1: string;
//   note2: string;
//   labelDesign: string;
//   startRow: string;
//   endRow: string;
//   inSearch: boolean;
//   standardPreview: boolean;
//   standardLabelDesign: string;
//   printer: string;
// }

// type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

// const Barcodeprint: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     barcodeFrom: "",
//     barcodeTo: "",
//     barcodeComma: "",
//     preview: false,
//     type: "sales",
//     vPrefix: "",
//     formType: "",
//     billNo: "",
//     btiValue: "",
//     other: "",
//     packDate: "",
//     note3: "",
//     expDesc: "",
//     note4: "",
//     note1: "",
//     note2: "",
//     labelDesign: "BARCODE.lba",
//     startRow: "0",
//     endRow: "0",
//     inSearch: false,
//     standardPreview: false,
//     standardLabelDesign: "Barcode Label1.repx",
//     printer: "",
//   });

//   const handleInputChange = (e: InputChangeEvent) => {
//     const { name, value, type } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto my-4">
//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {["Print", "Clear", "Remove Line", "Close", "Print Tag"].map(
//           (label) => (
//             <button
//               key={label}
//               className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//             >
//               {label}
//             </button>
//           )
//         )}
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Top Section */}
//         <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4 justify-between">

//           <div className="flex flex-col lg:flex-row lg:space-x-4">
//              {/* Barcode Inputs */}
//             <div className="lex flex-col sm:flex-row sm:items-center gap-2">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Barcode From & To
//                 </label>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                   <input
//                     type="text"
//                     name="barcodeFrom"
//                     value={formData.barcodeFrom}
//                     onChange={handleInputChange}
//                     placeholder="From"
//                     className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="hidden sm:inline-block">To</span>
//                   <input
//                     type="text"
//                     name="barcodeTo"
//                     value={formData.barcodeTo}
//                     onChange={handleInputChange}
//                     placeholder="To"
//                     className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   BarCode Comma Separated
//                 </label>
//                 <input
//                   type="text"
//                   name="barcodeComma"
//                   value={formData.barcodeComma}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   name="preview"
//                   checked={formData.preview}
//                   onChange={handleInputChange}
//                   className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <span className="text-gray-700">Preview</span>
//                 <button
//                   type="button"
//                   className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
//                 >
//                   Show
//                 </button>
//               </div>
//             </div>

//             {/* Type Selection */}
//             <div className="flex-1 space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Type
//               </label>
//               {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map(
//                 (label) => (
//                   <div key={label} className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       name="type"
//                       value={label.toLowerCase()}
//                       checked={formData.type === label.toLowerCase()}
//                       onChange={handleInputChange}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                     />
//                     <span className="text-gray-700">{label}</span>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Additional Text Inputs */}

//             <div className="flex-1 space-y-2">
//               <input
//                 type="text"
//                 name="vPrefix"
//                 value={formData.vPrefix}
//                 onChange={handleInputChange}
//                 placeholder="VPrefix"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 name="packDate"
//                 value={formData.packDate}
//                 onChange={handleInputChange}
//                 placeholder="Pack Date"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 name="expDesc"
//                 value={formData.expDesc}
//                 onChange={handleInputChange}
//                 placeholder="Exp Desc"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 name="note1"
//                 value={formData.note1}
//                 onChange={handleInputChange}
//                 placeholder="Note 1"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex-1 space-y-2">
//               <input
//                 type="text"
//                 name="note2"
//                 value={formData.note2}
//                 onChange={handleInputChange}
//                 placeholder="Note 2"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 name="note3"
//                 value={formData.note3}
//                 onChange={handleInputChange}
//                 placeholder="Note 3"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 name="note4"
//                 value={formData.note4}
//                 onChange={handleInputChange}
//                 placeholder="Note 4"
//                 className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//         </div>

//         {/* Label Design and Row Inputs */}
//         <div className="flex flex-wrap items-center gap-4 mb-4">
//           <div className="flex flex-col">
//             <label className="font-semibold">Label Design</label>
//             <input
//               type="text"
//               name="labelDesign"
//               value={formData.labelDesign}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded p-2"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold">Start Row</label>
//             <input
//               type="text"
//               name="startRow"
//               value={formData.startRow}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded p-2"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold">End Row</label>
//             <input
//               type="text"
//               name="endRow"
//               value={formData.endRow}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded p-2"
//             />
//           </div>
//           <div className="mb-4">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">
//             Printer
//           </label>
//           <input
//             type="text"
//             name="printer"
//             value={formData.printer}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         </div>

//         {/* Additional Options */}
//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             name="inSearch"
//             checked={formData.inSearch}
//             onChange={handleInputChange}
//             className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <span className="text-gray-700">In Search</span>
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             name="standardPreview"
//             checked={formData.standardPreview}
//             onChange={handleInputChange}
//             className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <span className="text-gray-700">Standard Preview</span>
//         </div>

//         {/* <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-600 focus:outline-none"
//           >
//             Submit
//           </button>
//         </div> */}
//       </form>
//     </div>
//   );
// };

// export default Barcodeprint;

// =========add g

import React, {
  Fragment,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleCounterPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import { CounterManage } from "./counters-manage";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { TextField } from "@mui/material";
import ERPMUIInput from "../../../components/ERPComponents/erp-mui-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPSelect from "../../../components/ERPComponents/erp-select";
import ERPDatePicker from "../../../components/ERPComponents/erp-date-picker";
import dayjs from "dayjs";

// Define the FormData interface
interface FormData {
  barcodeFrom: string;
  barcodeTo: string;
  barcodeComma: string;
  preview: boolean;
  type: string;
  vPrefix: string;
  formType: string;
  billNo: string;
  btiValue: string;
  other: string;
  packDate: string;
  note3: string;
  expDesc: string;
  note4: string;
  note1: string;
  note2: string;
  labelDesign: string;
  startRow: string;
  endRow: string;
  inSearch: boolean;
  standardPreview: boolean;
  standardLabelDesign: string;
  printer: string;
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

const Barcodeprint: React.FC = () => {
  // Translation hook
  const { t } = useTranslation();

  // Redux dispatch and state
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  // State for the Barcodeprint form
  const [formData, setFormData] = useState<FormData>({
    barcodeFrom: "",
    barcodeTo: "",
    barcodeComma: "",
    preview: false,
    type: "sales",
    vPrefix: "",
    formType: "",
    billNo: "",
    btiValue: "",
    other: "",
    packDate: "",
    note3: "",
    expDesc: "",
    note4: "",
    note1: "",
    note2: "",
    labelDesign: "BARCODE.lba",
    startRow: "0",
    endRow: "0",
    inSearch: false,
    standardPreview: false,
    standardLabelDesign: "Barcode Label1.repx",
    printer: "",
  });

  const [selectedFromType, setSelectedFromType] = useState();

  const options = [
    { value: "volvo", label: "Volvo" },
    { value: "saab", label: "Saab" },
    { value: "opel", label: "Opel" },
    { value: "audi", label: "Audi" },
  ];

  const newOptions = [
    { value: "adc1", label: "ADC1" },
    { value: "adc2", label: "ADC2" },
    { value: "adc3", label: "ADC3" },
  ];

  const handleChange = (id: string, value: any) => {
    setSelectedFromType(value);
  };

  const combinedOptions = [...options, ...newOptions];

  const handleDateChange = (id: string, date: string) => {
    console.log(`Field ID: ${id}, Selected Date: ${date}`);
  };

  // const YourComponent = () => {
  //   const handleDateChange = (id: string, date: string) => {
  //     console.log(`Field ID: ${id}, Selected Date: ${date}`);
  //   };

  // Handle input changes for the form
  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Implement form submission logic here (e.g., API call)
  };

  // Define columns for the Counters grid
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "counter",
        caption: t("counter"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "descriptions",
        caption: t("descriptions"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "maintainShift",
        caption: t("maintain_shift"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 60,
      },
      {
        dataField: "createdUser",
        caption: t("created_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "modifiedUser",
        caption: t("modified_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "cashLedgerID",
        caption: "Cash Ledger ID",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "ledgerName",
        caption: t("ledger_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "vrPrefix",
        caption: t("voucher_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "actions",
        caption: t("actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{
                type: "popup",
                action: () =>
                  dispatch(
                    toggleCounterPopup({
                      isOpen: true,
                      key: cellElement?.data?.id,
                    })
                  ),
              }}
              edit={{
                type: "popup",
                action: () =>
                  dispatch(
                    toggleCounterPopup({
                      isOpen: true,
                      key: cellElement?.data?.id,
                    })
                  ),
              }}
              delete={{
                confirmationRequired: true,
                confirmationMessage:
                  "Are you sure you want to delete this item?",
                url: `${Urls.Counter}/${cellElement?.data?.id}`,
              }}
            />
          );
        },
      },
    ],
    [t, dispatch]
  );

  return (
    <Fragment>
      <div className="p-0 bg-gray-100 min-h-screen">
        {/* Barcodeprint Form */}
        <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto my-0">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["Print", "Clear", "Remove Line", "Close", "Print Tag"].map(
              (label) => (
                <button
                  key={label}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4 justify-between">
              {/* 1 div */}
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                {/* Barcode Inputs */}
                <div className="lex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Barcode
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <ERPMUIInput
                          id="barcodeFrom"
                          label="From"
                          type="text"
                          value={formData.barcodeFrom}
                          customSize="sm"
                          customWidth="100%"
                          onChange={handleInputChange}
                          placeholder="From"
                          validation=""
                        />
                        <ERPMUIInput
                          id="barcodeTo"
                          // label="To"
                          type="text"
                          value={formData.barcodeTo}
                          customSize="sm"
                          customWidth="100%"
                          onChange={handleInputChange}
                          placeholder="To"
                          validation=""
                        />
                      </div>
                    </div>

                    <div>
                      <ERPMUIInput
                        id="barcodeComma"
                        type="text"
                        value={formData.barcodeComma}
                        customSize="sm"
                        customWidth="100%"
                        onChange={handleInputChange}
                        placeholder="Comma Separated"
                        validation=""
                      />
                      <div className="flex flex-col">
                        <ERPCheckbox
                          id="preview"
                          data={formData} // You might want to pass this if necessary for onChangeData
                          onChange={handleInputChange}
                          validation=""
                        />
                        <ERPButton
                          title="Show"
                          className="px-3 py-1"
                          variant="primary" // Choose the appropriate variant if needed
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* 1 barcode form end */}
              </div>
              <div className="flex-1 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Type
                      </label>
                      {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map(
                        (label, index) => (
                          <ERPRadio
                            key={`type-${label.toLowerCase()}-${index}`} // Ensure a unique key for each radio button
                            id={`type-${label.toLowerCase()}-${index}`} // Unique ID for each radio button
                            name="type"
                            value={label.toLowerCase()}
                            checked={formData.type === label.toLowerCase()}
                            onChange={handleInputChange}
                            label={label} // Pass the label to be displayed inside ERPRadio
                            // className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" // Additional styling if needed
                          />
                        )
                      )}
                    </div>

              {/* 2 div */}
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                <div className="flex-1 space-y-2">
                  <div>
                    {/* Radio 2.1 */}
                    {/* <div className="flex-1 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Type
                      </label>
                      {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map(
                        (label, index) => (
                          <ERPRadio
                            key={`type-${label.toLowerCase()}-${index}`} // Ensure a unique key for each radio button
                            id={`type-${label.toLowerCase()}-${index}`} // Unique ID for each radio button
                            name="type"
                            value={label.toLowerCase()}
                            checked={formData.type === label.toLowerCase()}
                            onChange={handleInputChange}
                            label={label} // Pass the label to be displayed inside ERPRadio
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" // Additional styling if needed
                          />
                        )
                      )}
                    </div> */}
                  </div>
                  <ERPMUIInput
                    id="vPrefix"
                    label="VPrefix"
                    type="text"
                    value={formData.vPrefix}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="VPrefix"
                    validation=""
                  />

                  <div>
                    <ERPSelect
                      id="fromType"
                      label="From Type"
                      options={options}
                      value={selectedFromType}
                      handleChange={handleChange}
                      required={true}
                    />
                  </div>

                  <ERPMUIInput
                    id="billNo"
                    label="Bill No"
                    type="text"
                    value={formData.billNo}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="Bill No"
                    validation=""
                  />

                  <div>
                    <ERPDatePicker
                      label="Select Date"
                      field={{ id: "begin", required: true }}
                      defaultData={{ begin: dayjs("1997-01-01") }} // Set a default date if needed
                      handleChange={handleDateChange} // Use the handleDateChange method
                      onChange={(newDate) =>
                        console.log("Date changed:", newDate)
                      } // Optional additional handling
                      data={{ begin: "" }} // Pass current data as needed
                    />
                  </div>

                  <ERPMUIInput
                    id="expDesc"
                    label="Exp Desc"
                    type="text"
                    value={formData.expDesc}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="Exp Desc"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note1"
                    label="Note 1"
                    type="text"
                    value={formData.note1}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="Note 1"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note2"
                    label="Note 2"
                    type="text"
                    value={formData.note2}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="Note 2"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note3"
                    label="Note 3"
                    type="text"
                    value={formData.note3}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="Note 3"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note4"
                    label="Note 4"
                    type="text"
                    value={formData.note4}
                    customSize="sm"
                    customWidth="100%"
                    onChange={handleInputChange}
                    placeholder="Note 4"
                    validation=""
                  />
                  <ERPButton
                    title="Show"
                    className="px-3 py-1"
                    variant="primary" // Choose the appropriate variant if needed
                  />
                </div>
                <div className="flex-1 space-y-2"></div>
              </div>
            </div>
            {/* 3 input end  */}

            {/* Label Design and Row Inputs */}

            {/* 3 div  */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div></div>
              <div className="flex flex-col">
                <ERPSelect
                  id="labelDesign"
                  label="Label Design"
                  options={combinedOptions} // Use the new combined options array
                  value={formData.labelDesign}
                  handleChange={handleChange}
                  required={true}
                />
              </div>
              <div className="flex flex-col">
                {/* <label className="font-semibold">Start Row</label> */}
                <ERPMUIInput
                  id="startRow"
                  label="Start Row"
                  type="text"
                  value={formData.startRow}
                  customSize="sm"
                  customWidth="100%"
                  onChange={handleInputChange}
                  validation=""
                />
              </div>
              <div className="flex flex-col">
                {/* <label className="font-semibold">End Row</label> */}
                <ERPMUIInput
                  id="endRow"
                  label="End Row"
                  type="text"
                  value={formData.endRow}
                  customSize="sm"
                  customWidth="100%"
                  onChange={handleInputChange}
                  validation=""
                />
                <ERPCheckbox
                  id="inSearch"
                  data={formData.inSearch} // You might want to pass this if necessary for onChangeData
                  onChange={handleInputChange}
                  validation=""
                />
              </div>
            </div>

            {/* Additional Options */}

            {/* 4 div */}
            <div>
              <div className="flex flex-col">
                <ERPSelect
                  id="labelDesign"
                  label="Label Design"
                  options={combinedOptions} // Use the new combined options array
                  value={formData.labelDesign}
                  handleChange={handleChange}
                  required={true}
                />
                <ERPSelect
                  id="printer"
                  label="Printer"
                  options={combinedOptions} // Use the new combined options array
                  value={formData.labelDesign}
                  handleChange={handleChange}
                  required={true}
                />

                <ERPCheckbox
                  id="Standard Preview"
                  data={formData.inSearch} // You might want to pass this if necessary for onChangeData
                  onChange={handleInputChange}
                  validation=""
                />

                <ERPButton
                  title="Print"
                  className="px-3 py-1"
                  variant="primary" // Choose the appropriate variant if needed
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              {/* <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Submit
              </button> */}
            </div>
          </form>
        </div>
        {/* Counters Data Grid */}
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-box">
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ERPDevGrid
                    columns={columns}
                    gridHeader={t("counter")}
                    dataUrl={Urls.Counter}
                    gridId="grd_counter"
                    popupAction={toggleCounterPopup}
                    gridAddButtonType="popup"
                    gridAddButtonIcon="ri-add-line"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Counter Management */}
        <ERPModal
          isOpen={rootState.PopupData.counter.isOpen || false}
          title={t("add_new_counter")}
          width="w-full max-w-[600px]"
          isForm={true}
          closeModal={() => {
            dispatch(toggleCounterPopup({ isOpen: false }));
          }}
          content={<CounterManage />}
        />
      </div>
    </Fragment>
  );
};

export default Barcodeprint;
