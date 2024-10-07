// import React, { useState } from "react";
// import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
// import { getAction, postAction } from "../../../redux/slices/app-thunks";
// import Urls from "../../../redux/urls";
// import { handleResponse } from "../../../utilities/HandleResponse";
// import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";

// interface FormState {
//   maintainTax: boolean;
//   showFinancialYearSelector: boolean;
//   countryName: string;
//   maintainSynchronization: boolean;
//   autoPostingTransaction: boolean;
//   allowEditPostedTransactions: boolean;
//   maintainMasterEntry: boolean;
//   maintainInventoryTransactionsEntry: boolean;
//   syncMethod: string;
//   syncIntervals: number;
//   reportMode: string;
//   useBranchWiseSalesPrice: boolean;
//   useTemplateSelectionForPrinting: boolean;
//   showBTINotification: boolean;
//   applyVATOnPurchaseToBTO: boolean;
//   maintainCounterWisePrefixForTransaction: boolean;
//   refreshStockAfterSync: boolean;
//   refreshServerStockAfterSync: boolean;
//   maintainKSA_EInvoice: boolean;
//   invoicePrintingStyle: string;
//   enableTaxOnBillDiscount: boolean;
//   apply_KSA_EInvoice_Validation_Rules: boolean;
//   ksa_EInvoice_Sync_SystemCode: string;
//   createCreditNoteAutomaticallyOnSalesEdit: boolean;
//   enableVanSale: boolean;
//   clientPPOSBranchID: string;
//   vanSaleProductSerial: string;
//   pposEmail: string;
//   maximum_Allowed_LineItem_Amount: number;
//   fileAttachmentMethod: string;
//   fileAttachmentFolder: string;
// }

// const TaxAndInventorySettingsForm: React.FC = () => {
//   const initialState: FormState = {
//     maintainTax: true,
//     showFinancialYearSelector: false,
//     countryName: "1",
//     maintainSynchronization: false,
//     autoPostingTransaction: true,
//     allowEditPostedTransactions: true,
//     maintainMasterEntry: true,
//     maintainInventoryTransactionsEntry: true,
//     syncMethod: "",
//     syncIntervals: 0,
//     reportMode: "Classic",
//     useBranchWiseSalesPrice: false,
//     useTemplateSelectionForPrinting: false,
//     showBTINotification: false,
//     applyVATOnPurchaseToBTO: true,
//     maintainCounterWisePrefixForTransaction: false,
//     refreshStockAfterSync: true,
//     refreshServerStockAfterSync: true,
//     maintainKSA_EInvoice: false,
//     invoicePrintingStyle: "Default",
//     enableTaxOnBillDiscount: false,
//     apply_KSA_EInvoice_Validation_Rules: false,
//     ksa_EInvoice_Sync_SystemCode: "",
//     createCreditNoteAutomaticallyOnSalesEdit: false,
//     enableVanSale: false,
//     clientPPOSBranchID: "",
//     vanSaleProductSerial: "",
//     pposEmail: "",
//     maximum_Allowed_LineItem_Amount: 0.0,
//     fileAttachmentMethod: "No",
//     fileAttachmentFolder: "",
//   };

//   const [formState, setFormState] = useState<FormState>(initialState);
//   const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   const dispatch = useAppDispatch();
//   //   useEffect(() => {
//   //     loadSettings();
//   //   }, []);

//   const loadSettings = async () => {
//     setLoading(true);
//     try {
//       const response = await dispatch(
//         getAction({ apiUrl: `${Urls.application_setting}branch` }) as any
//       ).unwrap();

//       setFormStatePrev(response);
//       setFormState(response);
//     } catch (error) {
//       console.error("Error loading settings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFieldChange = (settingName: any, value: any) => {
//     setFormState((prevSettings = {} as FormState) => ({
//       ...prevSettings,
//       [settingName]: value ?? "",
//     }));
//   };
//   const handleSubmit = async () => {
//     const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
//       const currentValue = formState[key as keyof FormState];
//       const prevValue = formStatePrev[key as keyof FormState];

//       if (currentValue !== prevValue) {
//         acc.push({
//           settingsName: key,
//           settingsValue: currentValue,
//         });
//       }
//       return acc;
//     }, [] as { settingsName: string; settingsValue: any }[]);
//     const response: any = (await postAction({
//       apiUrl: Urls.application_setting,
//       data: modifiedSettings,
//     })) as any;
//     handleResponse(response);
//     console.log(modifiedSettings);
//     // You can send this list to your API or handle it as needed
//   };

//   return (
//     <div className="w-full max-w-4xl">
//       <div className="grid grid-cols-3 gap-6">
//         <div className="space-y-4">
//           {/* Left Column */}
//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />

//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />
//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />
//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />
//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />
//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />
//           <ERPCheckbox
//             id="autoChangeTransactionDate"
//             label="Auto Change Transaction Date By 12:00 AM"
//             checked={formsate?.autoChangeTransactionDate}
//             onChangeData={(data) =>
//               handleFieldChange(
//                 "autoChangeTransactionDate",
//                 data.autoChangeTransactionDate
//               )
//             }
//           />

//           {/* <div className="space-y-2">
//               <label>Select Country</label>
//               <Select 
//                 value={formState.countryName}
//                 onValueChange={(value) => handleFieldChange("countryName", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select country" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="1">Country 1</SelectItem>
//                   <SelectItem value="2">Country 2</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div> */}

//           <div className="space-y-2">
//             <label>Regional Language</label>
//             <Select
//               value={formState.invoicePrintingStyle}
//               onValueChange={(value) =>
//                 handleFieldChange("invoicePrintingStyle", value)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select language" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Default">Default</SelectItem>
//                 <SelectItem value="Arabic">Arabic</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <ERPCheckbox
//             id="maintainInventoryMasterEntry"
//             value={formState.maintainMasterEntry}
//             data={formState}
//             label="Maintain Inventory Master Entry"
//             onChangeData={(data: boolean) =>
//               handleFieldChange("maintainMasterEntry", data)
//             }
//           />

//           <ERPCheckbox
//             id="maintainInventoryTransactionsEntry"
//             value={formState.maintainInventoryTransactionsEntry}
//             data={formState}
//             label="Maintain Inventory Transactions Entry"
//             onChangeData={(data: boolean) =>
//               handleFieldChange("maintainInventoryTransactionsEntry", data)
//             }
//           />
//         </div>

//         <div className="space-y-4">
//           {/* Right Column */}
//           <ERPCheckbox
//             id="maintainKSA_EInvoice"
//             value={formState.maintainKSA_EInvoice}
//             data={formState}
//             label="Maintain KSA E-Invoice"
//             onChangeData={(data: boolean) =>
//               handleFieldChange("maintainKSA_EInvoice", data)
//             }
//           />

//           <ERPCheckbox
//             id="enableTaxOnBillDiscount"
//             value={formState.enableTaxOnBillDiscount}
//             data={formState}
//             label="Enable Tax On Bill Discount"
//             onChangeData={(data: boolean) =>
//               handleFieldChange("enableTaxOnBillDiscount", data)
//             }
//           />

//           <ERPInput
//             id="maximum_Allowed_LineItem_Amount"
//             value={formState.maximum_Allowed_LineItem_Amount.toString()}
//             data={formState}
//             label="Maximum Allowed Line Item Amount"
//             type="number"
//             onChangeData={(data: string) =>
//               handleFieldChange(
//                 "maximum_Allowed_LineItem_Amount",
//                 parseFloat(data)
//               )
//             }
//           />

//           <div className="border p-4 rounded-md space-y-4">
//             <ERPCheckbox
//               id="enableVanSale"
//               value={formState.enableVanSale}
//               data={formState}
//               label="Enable PPOS Integration (VanSales)"
//               onChangeData={(data: boolean) =>
//                 handleFieldChange("enableVanSale", data)
//               }
//             />

//             <div className="flex space-x-2">
//               <ERPInput
//                 id="clientPPOSBranchID"
//                 value={formState.clientPPOSBranchID}
//                 data={formState}
//                 label="PPOS BranchID"
//                 onChangeData={(data: string) =>
//                   handleFieldChange("clientPPOSBranchID", data)
//                 }
//               />
//               <Button onClick={handleVerifyPPOS} className="mt-6">
//                 Verify
//               </Button>
//             </div>

//             <ERPInput
//               id="vanSaleProductSerial"
//               value={formState.vanSaleProductSerial}
//               data={formState}
//               label="PPOS Product Serial"
//               onChangeData={(data: string) =>
//                 handleFieldChange("vanSaleProductSerial", data)
//               }
//             />

//             <ERPInput
//               id="pposEmail"
//               value={formState.pposEmail}
//               data={formState}
//               label="PPOS Email"
//               type="email"
//               onChangeData={(data: string) =>
//                 handleFieldChange("pposEmail", data)
//               }
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <label>Report Mode</label>
//           <Select
//             value={formState.reportMode}
//             onValueChange={(value) => handleFieldChange("reportMode", value)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select report mode" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Classic">Classic</SelectItem>
//               <SelectItem value="Modern">Modern</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <label>File Attachment Method</label>
//           <Select
//             value={formState.fileAttachmentMethod}
//             onValueChange={(value) =>
//               handleFieldChange("fileAttachmentMethod", value)
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select attachment method" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="No">No</SelectItem>
//               <SelectItem value="Yes">Yes</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <ERPInput
//           id="fileAttachmentFolder"
//           value={formState.fileAttachmentFolder}
//           data={formState}
//           label="Shared Folder"
//           onChangeData={(data: string) =>
//             handleFieldChange("fileAttachmentFolder", data)
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default TaxAndInventorySettingsForm;
