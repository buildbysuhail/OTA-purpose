import React, { useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";

interface FormState {
  maintainTax: boolean;
  showFinancialYearSelector: boolean;
  countryName: string;
  maintainSynchronization: boolean;
  maintainSynchronizationdata: string;
  autoPostingTransaction: boolean;
  allowEditPostedTransactions: boolean;
  maintainMasterEntry: boolean;
  maintainInventoryTransactionsEntry: boolean;
  syncMethod: string;
  syncIntervals: number;
  reportMode: string;
  useBranchWiseSalesPrice: boolean;
  useTemplateSelectionForPrinting: boolean;
  showBTINotification: boolean;
  applyVATOnPurchaseToBTO: boolean;
  maintainCounterWisePrefixForTransaction: boolean;
  refreshStockAfterSync: boolean;
  refreshServerStockAfterSync: boolean;
  maintainKSA_EInvoice: boolean;
  invoicePrintingStyle: string;
  enableTaxOnBillDiscount: boolean;
  apply_KSA_EInvoice_Validation_Rules: boolean;
  ksa_EInvoice_Sync_SystemCode: string;
  createCreditNoteAutomaticallyOnSalesEdit: boolean;
  enableVanSale: boolean;
  clientPPOSBranchID: string;
  vanSaleProductSerial: string;
  pposEmail: string;
  maximum_Allowed_LineItem_Amount: number;
  fileAttachmentMethod: string;
  fileAttachmentFolder: string;
}

const BranchSettingsForm: React.FC = () => {
  const initialState: FormState = {
    maintainTax: true,
    showFinancialYearSelector: false,
    countryName: "1",
    maintainSynchronization: false,
    autoPostingTransaction: true,
    allowEditPostedTransactions: true,
    maintainMasterEntry: true,
    maintainInventoryTransactionsEntry: true,
    maintainSynchronizationdata: "",
    syncMethod: "",
    syncIntervals: 0,
    reportMode: "Classic",
    useBranchWiseSalesPrice: false,
    useTemplateSelectionForPrinting: false,
    showBTINotification: false,
    applyVATOnPurchaseToBTO: true,
    maintainCounterWisePrefixForTransaction: false,
    refreshStockAfterSync: true,
    refreshServerStockAfterSync: true,
    maintainKSA_EInvoice: false,
    invoicePrintingStyle: "Default",
    enableTaxOnBillDiscount: false,
    apply_KSA_EInvoice_Validation_Rules: false,
    ksa_EInvoice_Sync_SystemCode: "",
    createCreditNoteAutomaticallyOnSalesEdit: false,
    enableVanSale: false,
    clientPPOSBranchID: "",
    vanSaleProductSerial: "",
    pposEmail: "",
    maximum_Allowed_LineItem_Amount: 0.0,
    fileAttachmentMethod: "No",
    fileAttachmentFolder: "",
  };

  const [formState, setFormState] = useState<FormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useAppDispatch();

  //loading on render
  //   useEffect(() => {
  //     loadSettings();
  //   }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAction({ apiUrl: `${Urls.application_setting}branch` }) as any
      ).unwrap();

      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (settingName: any, value: any) => {
    setFormState((prevSettings = {} as FormState) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };

  const handleSubmit = async () => {
    const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
      const currentValue = formState[key as keyof FormState];
      const prevValue = formStatePrev[key as keyof FormState];

      if (currentValue !== prevValue) {
        acc.push({
          settingsName: key,
          settingsValue: currentValue,
        });
      }
      return acc;
    }, [] as { settingsName: string; settingsValue: any }[]);
    const response: any = (await postAction({
      apiUrl: Urls.application_setting,
      data: modifiedSettings,
    })) as any;
    handleResponse(response);
    console.log(modifiedSettings);
    // You can send this list to your API or handle it as needed
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div className="flex flex-col space-y-4">
          {/* Left Column */}
          <ERPCheckbox
            id="maintainTax"
            label="Maintain Tax"
            data={formState}
            checked={formState?.maintainTax}
            onChangeData={(data) =>
              handleFieldChange("maintainTax", data.maintainTax)
            }
          />

          <ERPCheckbox
            data={formState}
            id="showFinancialYearSelector"
            label="Show FinancialYear Selector"
            checked={formState?.showFinancialYearSelector}
            onChangeData={(data) =>
              handleFieldChange(
                "showFinancialYearSelector",
                data.showFinancialYearSelector
              )
            }
          />
          <ERPCheckbox
            id="autoPostingTransaction"
            label="Maintain Auto Posting Transaction"
            data={formState}
            checked={formState?.autoPostingTransaction}
            onChangeData={(data) =>
              handleFieldChange(
                "autoPostingTransaction",
                data.autoPostingTransaction
              )
            }
          />
          <ERPCheckbox
            id="allowEditPostedTransactions"
            label="AllowEdit Posted Transactions"
            data={formState}
            checked={formState?.allowEditPostedTransactions}
            onChangeData={(data) =>
              handleFieldChange(
                "allowEditPostedTransactions",
                data.allowEditPostedTransactions
              )
            }
          />
          <ERPCheckbox
            id="maintainMasterEntry"
            label="Maintain Inventory Master Entry"
            data={formState}
            checked={formState?.maintainMasterEntry}
            onChangeData={(data) =>
              handleFieldChange("maintainMasterEntry", data.maintainMasterEntry)
            }
          />
          <ERPCheckbox
            id="maintainInventoryTransactionsEntry"
            label="Maintain Inventory Transactions Entry"
            data={formState}
            checked={formState?.maintainInventoryTransactionsEntry}
            onChangeData={(data) =>
              handleFieldChange(
                "maintainInventoryTransactionsEntry",
                data.maintainInventoryTransactionsEntry
              )
            }
          />
          <ERPCheckbox
            id="useBranchWiseSalesPrice"
            label="Use Branch Wise Sales Price"
            data={formState}
            checked={formState?.useBranchWiseSalesPrice}
            onChangeData={(data) =>
              handleFieldChange(
                "useBranchWiseSalesPrice",
                data.useBranchWiseSalesPrice
              )
            }
          />
        </div>
        <div className="flex flex-col  space-y-4">
          <ERPDataCombobox
            id="countryName"
            value={formState.countryName}
            field={{
              id: "countryName",
              required: true,
              getListUrl: Urls.data_countries,
              valueKey: "id",
              labelKey: "name",
            }}
            data={formState}
            label="Selected Country"
            onChangeData={(data) =>
              handleFieldChange("countryName", data.countryName)
            }
          />
          <ERPDataCombobox
            id="invoicePrintingStyle"
            value={formState.invoicePrintingStyle}
            field={{
              id: "invoicePrintingStyle",
              required: true,
              getListUrl: Urls.data_languages,

              valueKey: "id",
              labelKey: "name",
            }}
            data={formState}
            label="Regional Language"
            onChangeData={(data) =>
              handleFieldChange(
                "invoicePrintingStyle",
                data.invoicePrintingStyle
              )
            }
          />
          <ERPCheckbox
            id="useTemplateSelectionForPrinting"
            data={formState}
            label="Use Template Selection For Printing"
            checked={formState?.useTemplateSelectionForPrinting}
            onChangeData={(data) =>
              handleFieldChange(
                "useTemplateSelectionForPrinting",
                data.useTemplateSelectionForPrinting
              )
            }
          />
          <ERPCheckbox
            id="applyVATOnPurchaseToBTO"
            label="Apply VAT On Purchase To BTO"
            data={formState}
            checked={formState?.applyVATOnPurchaseToBTO}
            onChangeData={(data) =>
              handleFieldChange(
                "applyVATOnPurchaseToBTO",
                data.applyVATOnPurchaseToBTO
              )
            }
          />
          <ERPCheckbox
            id="maintainCounterWisePrefixForTransaction"
            label="Maintain Counter Wise Prefix For Transaction"
            data={formState}
            checked={formState?.maintainCounterWisePrefixForTransaction}
            onChangeData={(data) =>
              handleFieldChange(
                "maintainCounterWisePrefixForTransaction",
                data.maintainCounterWisePrefixForTransaction
              )
            }
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-start gap-3">
            <ERPCheckbox
              id="maintainKSA_EInvoice"
              label="Maintain KSA EInvoice"
              data={formState}
              checked={formState?.maintainKSA_EInvoice}
              onChangeData={(data) =>
                handleFieldChange(
                  "maintainKSA_EInvoice",
                  data.maintainKSA_EInvoice
                )
              }
            />
            <ERPCheckbox
              id="enableTaxOnBillDiscount"
              label="Enable Tax On Bill Discount"
              data={formState}
              checked={formState?.enableTaxOnBillDiscount}
              onChangeData={(data) =>
                handleFieldChange(
                  "enableTaxOnBillDiscount",
                  data.enableTaxOnBillDiscount
                )
              }
            />
          </div>

          <ERPCheckbox
            id="apply_KSA_EInvoice_Validation_Rules"
            label=" Apply KSA EInvoice Validation Rules"
            checked={formState?.apply_KSA_EInvoice_Validation_Rules}
            data={formState}
            onChangeData={(data) =>
              handleFieldChange(
                "apply_KSA_EInvoice_Validation_Rules",
                data.apply_KSA_EInvoice_Validation_Rules
              )
            }
          />
          <ERPCheckbox
            id="createCreditNoteAutomaticallyOnSalesEdit"
            label="Maintain Counter Wise Prefix For Transaction"
            data={formState}
            checked={formState?.createCreditNoteAutomaticallyOnSalesEdit}
            onChangeData={(data) =>
              handleFieldChange(
                "createCreditNoteAutomaticallyOnSalesEdit",
                data.createCreditNoteAutomaticallyOnSalesEdit
              )
            }
          />

          <ERPInput
            id="ksa_EInvoice_Sync_SystemCode"
            value={formState.ksa_EInvoice_Sync_SystemCode}
            data={formState}
            label="EInvoice Sync SystemCode"
            onChangeData={(data) =>
              handleFieldChange(
                "ksa_EInvoice_Sync_SystemCode",
                data.ksa_EInvoice_Sync_SystemCode
              )
            }
          />

          <ERPInput
            id="maximum_Allowed_LineItem_Amount"
            value={formState.maximum_Allowed_LineItem_Amount}
            data={formState}
            type="number"
            label="Maximum Allowed LineItem Amount"
            onChangeData={(data) =>
              handleFieldChange(
                "maximum_Allowed_LineItem_Amount",
                data.maximum_Allowed_LineItem_Amount
              )
            }
          />
        </div>
      </div>
      <div className="flex justify-start items-start gap-6 mb-4">
        <ERPCheckbox
          id="maintainSynchronization"
          checked={formState.maintainSynchronization}
          data={formState}
          label="Maintain Synchronization"
          onChangeData={(data) =>
            handleFieldChange("maintainSynchronization", data.maintainSynchronization)
          }
        />
        <ERPDataCombobox
          id="maintainSynchronizationdata"
          value={formState.maintainSynchronizationdata}
          field={{
            id: "maintainSynchronizationdata",
            required: true,
            valueKey: "value",
            labelKey: "label",
          }}
          data={formState}
          label="Regional Language"
          onChangeData={(data) =>
            handleFieldChange("maintainSynchronizationdata", data.maintainSynchronizationdata)
          }
          options={[
            { value: '0', label: 'Manual Sync' },
            { value: '1', label: 'Auto Sync' },
            { value: '1', label: 'Auto Sync and Upload Only' },
            { value: '1', label: 'Manual Sync and Upload Only' },
            { value: '1', label: 'UploadAndDownload' },
          ]}
        />

        <ERPInput
          id="syncIntervals"
          value={formState.syncIntervals}
          data={formState}
          label="Intervals"
          type="number"
          onChangeData={(data) =>
            handleFieldChange("syncIntervals", data.syncIntervals)
          }
        />
      </div>
      <div className="flex justify-start items-start gap-6 mb-4">
        <ERPCheckbox
          id="refreshStockAfterSync"
          checked={formState.refreshStockAfterSync}
          data={formState}
          label="Refresh Stock After Sync"
          onChangeData={(data) =>
            handleFieldChange("refreshStockAfterSync", data.refreshStockAfterSync)
          }
        />
        <ERPCheckbox
          id="refreshServerStockAfterSync"
          checked={formState.refreshServerStockAfterSync}
          data={formState}
          label="Refresh Server Stock After Sync"
          onChangeData={(data) =>
            handleFieldChange("refreshServerStockAfterSync", data.refreshServerStockAfterSync)
          }
        />
       
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          <ERPCheckbox
            id="showBTINotification"
            checked={formState.showBTINotification}
            data={formState}
            label="Show BTI Notification"
            onChangeData={(data) =>
              handleFieldChange("showBTINotification", data.showBTINotification)
            }
          />
          
          <ERPDataCombobox
            id="reportMode"
            value={formState.reportMode}
            field={{
              id: "reportMode",
              required: true,
            
              valueKey: "value",
              labelKey: "label",
            }}
            data={formState}
            label="Report Mode"
            onChangeData={(data) =>
              handleFieldChange(
                "reportMode",
                data.reportMode
              )
            }
            options={[
                { value: '0', label: 'classic' },
                { value: '1', label: 'Standard' },
               
              ]}
          />
            
          <ERPDataCombobox
            id="invoicePrintingStyle"
            value={formState.invoicePrintingStyle}
            field={{
              id: "invoicePrintingStyle",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={formState}
            label="Invoice Printing Style"
            onChangeData={(data) =>
              handleFieldChange(
                "invoicePrintingStyle",
                data.invoicePrintingStyle
              )
            }
            options={[
                { value: '0', label: 'Default' },
                { value: '1', label: 'Standard' },
               
              ]}
          />
          <ERPDataCombobox
            id="fileAttachmentMethod"
            value={formState.fileAttachmentMethod}
            field={{
              id: "fileAttachmentMethod",
              required: true,
            
              valueKey: "value",
              labelKey: "label",
            }}
            data={formState}
            label="File Attachment Method"
            onChangeData={(data) =>
              handleFieldChange(
                "fileAttachmentMethod",
                data.fileAttachmentMethod
              )
            }
            options={[
                { value: '0', label: 'No' },
                { value: '1', label: 'File System' },
                { value: '2', label: 'Cloud' },
              ]}
          />
          <ERPInput
            id="fileAttachmentFolder"
            value={formState.fileAttachmentFolder}
            data={formState}
            label="Shared Folder"
            onChangeData={(data) =>
              handleFieldChange("fileAttachmentFolder", data.fileAttachmentFolder)
            }
          />
        </div>
        <div className="flex flex-col space-y-4">
        <ERPCheckbox
          id="enableVanSale"
          checked={formState.enableVanSale}
          data={formState}
          label="Enable PPOS Integration (VanSale)"
          onChangeData={(data) =>
            handleFieldChange("enableVanSale", data.enableVanSale)
          }
        />
          <div className="flex justify-start items-center gap-4">
            <ERPInput
              id="clientPPOSBranchID"
              value={formState.clientPPOSBranchID}
              data={formState}
              label="PPOS Branch ID"
              onChangeData={(data) =>
                handleFieldChange("clientPPOSBranchID", data.clientPPOSBranchID)
              }
            />
            <div className="self-end">
            <ERPButton title="Verify" variant="secondary" type="submit"/>
            </div>
          </div>

          <ERPInput
            id="vanSaleProductSerial"
            value={formState.vanSaleProductSerial}
            data={formState}
            label="PPOS Product Serial"
            onChangeData={(data) =>
              handleFieldChange("vanSaleProductSerial", data.vanSaleProductSerial)
            }
          />
          <ERPInput
            id="pposEmail"
            value={formState.pposEmail}
            data={formState}
            label="Shared Folder"
            onChangeData={(data) =>
              handleFieldChange("pposEmail", data.pposEmail)
            }
          />
        </div>
      </div>
  
    </div>
  );
};

export default BranchSettingsForm;
