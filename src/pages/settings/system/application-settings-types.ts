import { Countries } from "../../../redux/slices/user-session/reducer";
import { AccountSettingsState } from "./application-settings-accounts";
import { ApplicationInventorySettings } from "./application-settings-inventory";
import { ApplicationMiscellaneousSettings } from "./application-settings-miscellaneous";

export interface ApplicationSettingsType {
    mainSettings: ApplicationMainSettings;
    // accountsSettings: AccountsSettings;
    inventorySettings: ApplicationInventorySettings;
    branchSettings: ApplicationBranchSettings;
    // backUpSettings: BackUpSettings;
    // printSettings: PrintSettings;
    // productsSettings: ProductsSettings;
    // gstSettings: GstSettings;
    // taxSettings: TaxSettings;
    miscellaneousSettings: ApplicationMiscellaneousSettings;
  }
  export interface ApplicationMainSettings {
  currency: string;
  unitPrice_decimalPoint: string;
  decimalPoints: number;
  // cashSalesVoucherPrefix: string;
  showNumberFormat: string;
  roundingMethod: string;
  pOSRoundingMethod: string;
  tax_DecimalPoint: string;
  roundingMethodGLOBAL: string;
  autoChangeTransactionDateByMidnight: boolean;
  autoUpdateReleaseUpTo: number;
  oTPEmail: string;
  oTPVerification: string;
  allowPrivilegeCard: boolean;
  previlegeCardPerc: number;
  allowPostdatedTrans: boolean;
  postDatedTransInNumbers: number;
  allowPredatedTrans: boolean;
  preDatedTransInNumbers: number;
  maintainSeperatePrefixforCashSales: boolean;
  saveModTransSum: boolean;
  maintainProduction: boolean;
  showReminders: boolean;
  enableSecondDisplay: boolean;
  allowSalesRouteArea: boolean;
  enableDayEnd: boolean;
  maintainSalesRouteCreditLimit: boolean;
  maintainMultilanguage__: boolean;
  showUserMessages: boolean;
  maintainBusinessType: string;
}
export const ApplicationMainSettingsInitialState: ApplicationMainSettings = {
  currency: "2",
  unitPrice_decimalPoint: "2",
  decimalPoints: 2,
  // cashSalesVoucherPrefix: "",
  showNumberFormat: "Millions",
  roundingMethod: "Normal",
  pOSRoundingMethod: "No Rounding",
  tax_DecimalPoint: "2",
  roundingMethodGLOBAL: "Normal",
  autoChangeTransactionDateByMidnight: false,
  autoUpdateReleaseUpTo: 0,
  oTPEmail: "",
  oTPVerification: "",
  allowPrivilegeCard: false,
  previlegeCardPerc: 1,
  allowPostdatedTrans: true,
  postDatedTransInNumbers: 0,
  allowPredatedTrans: true,
  preDatedTransInNumbers: 110,
  maintainSeperatePrefixforCashSales: false,
  saveModTransSum: false,
  maintainProduction: false,
  showReminders: false,
  enableSecondDisplay: false,
  allowSalesRouteArea: false,
  enableDayEnd: false,
  maintainSalesRouteCreditLimit: false,
  maintainMultilanguage__: false,
  showUserMessages: false,
  maintainBusinessType: "General",
};
export interface ApplicationBranchSettings {
  maintainMultilanguage__: any;
  maintainTax: boolean;
  showFinancialYearSelector: boolean;
  countryName: number;
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
  kSA_EInvoice_Sync_SystemCode: string;
  createCreditNoteAutomaticallyOnSalesEdit: boolean;
  enableVanSale: boolean;
  clientPPOSBranchID: string;
  vanSaleProductSerial: string;
  pPOSEmail: string;
  maximum_Allowed_LineItem_Amount: number;
  fileAttachmentMethod: string;
  fileAttachmentFolder: string;
}
export  const ApplicationBranchSettingsInitialState: ApplicationBranchSettings = {
  maintainTax: true,
  maintainMultilanguage__ :false,
  showFinancialYearSelector: false,
  countryName: Countries.Saudi,
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
  kSA_EInvoice_Sync_SystemCode: "",
  createCreditNoteAutomaticallyOnSalesEdit: false,
  enableVanSale: false,
  clientPPOSBranchID: "",
  vanSaleProductSerial: "",
  pPOSEmail: "",
  maximum_Allowed_LineItem_Amount: 0.0,
  fileAttachmentMethod: "No",
  fileAttachmentFolder: "",
};