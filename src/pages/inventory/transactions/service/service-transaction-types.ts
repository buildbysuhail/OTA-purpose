/**
 * Service Transaction Types
 * Based on Windows Forms frmServiceTransaction
 */

export enum ServiceStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Transferred = "Transferred",
  Invoiced = "Invoiced",
  Cancelled = "Cancelled",
}

export interface ServiceTransactionMaster {
  serviceTransMasterID: number;
  branchID: number;
  financialYearID: number;
  jobNo: number;
  orderDate: string;
  ledgerID: number;
  customerName: string;
  address1: string;
  address2: string;
  mobile: string;
  phone: string;
  serviceID: number;
  serviceName: string;
  productRemarks: string;
  serialNo: string;
  receivedItems: string;
  complaints: string;
  expectedDeliveryDate: string;
  advanceReceived: number;
  unitRate: number;
  isWarrantyService: boolean;
  status: ServiceStatus;
  createdUserID: number;
  createdDate: string;
  modifiedUserID: number;
  modifiedDate: string;
}

export interface ServiceDetails {
  serviceTransDetailID: number;
  serviceTransMasterID: number;
  serviceDoneDate: string;
  serviceCharge: number;
  consumedQtyAmount: number;
  warehouseID: number;
  warehouseName: string;
  priceCategoryID: number;
  status: ServiceStatus;
}

export interface AgentTransfer {
  serviceAgentTransferID: number;
  serviceTransMasterID: number;
  agentID: number;
  agentName: string;
  transferDate: string;
  despatchedReturnDate: string;
  expectedDeliveryDate: string;
  agentCharge: number;
  unitRate: number;
  consumedQtyAmount: number;
  isWarrantyService: boolean;
  status: ServiceStatus;
}

export interface ServiceInvoice {
  serviceInvoiceID: number;
  serviceTransMasterID: number;
  invoiceDate: string;
  accountID: number;
  accountName: string;
  consumedQtyAmount: number;
  serviceCharge: number;
  total: number;
  advanceReceived: number;
  cashReceived: number;
  balance: number;
  closingRemarks: string;
  remarks: string;
  remarks2: string;
  isWarrantyService: boolean;
}

export interface ServiceSpareDetail {
  serviceSpareDetailID: number;
  serviceTransMasterID: number;
  slNo: number;
  productID: number;
  productBatchID: number;
  pCode: string;
  barcode: string;
  manualBarcode: string;
  product: string;
  qty: number;
  unitID: number;
  unit: string;
  purchasePrice: number;
  total: number;
  stock: number;
}

export interface ServiceHistory {
  serviceTransMasterID: number;
  jobNo: number;
  orderDate: string;
  serviceName: string;
  complaints: string;
  status: ServiceStatus;
  isWarrantyService: boolean;
}

export interface ServiceTransactionData {
  master: ServiceTransactionMaster;
  serviceDetails: ServiceDetails;
  agentTransfer: AgentTransfer;
  invoice: ServiceInvoice;
  spareDetails: ServiceSpareDetail[];
  history: ServiceHistory[];
}

export interface ServiceFormElements {
  // Order Tab
  jobNo: FormElementState;
  orderDate: FormElementState;
  ledgerID: FormElementState;
  customerName: FormElementState;
  address1: FormElementState;
  address2: FormElementState;
  mobile: FormElementState;
  phone: FormElementState;
  serviceID: FormElementState;
  productRemarks: FormElementState;
  serialNo: FormElementState;
  receivedItems: FormElementState;
  complaints: FormElementState;
  expectedDeliveryDate: FormElementState;
  advanceReceived: FormElementState;
  unitRate: FormElementState;
  isWarrantyService: FormElementState;
  // Service Tab
  serviceDoneDate: FormElementState;
  serviceCharge: FormElementState;
  consumedQtyAmount: FormElementState;
  warehouseID: FormElementState;
  priceCategoryID: FormElementState;
  status: FormElementState;
  // Agent Transfer Tab
  agentID: FormElementState;
  transferDate: FormElementState;
  despatchedReturnDate: FormElementState;
  agentCharge: FormElementState;
  // Invoice Tab
  invoiceDate: FormElementState;
  accountID: FormElementState;
  cashReceived: FormElementState;
  closingRemarks: FormElementState;
  remarks: FormElementState;
  remarks2: FormElementState;
  // Buttons
  btnSave: FormElementState;
  btnClear: FormElementState;
  btnDelete: FormElementState;
  btnPrint: FormElementState;
}

export interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
  reload?: boolean;
  [key: string]: any;
}

export interface ServiceTransactionFormState {
  transaction: ServiceTransactionData;
  formElements: ServiceFormElements;
  activeTab: number;
  isEdit: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  printOnSave: boolean;
  showHistory: boolean;
  searchJobNo: number;
  searchIn: string;
}

export interface ServiceReportFilter {
  fromDate: string;
  toDate: string;
  status: ServiceStatus | "";
  serviceID: number;
  isWarrantyService: string; // 'Y' | 'N' | ''
}

export interface ServiceReportItem {
  jobCardNo: number;
  orderDate: string;
  invoiceDate: string;
  customerName: string;
  address1: string;
  mobile: string;
  serviceName: string;
  isWarranty: string;
  serviceDoneDate: string;
  status: string;
  closingRemarks: string;
  billedRate: number;
  invSpareTotal: number;
  profit: number;
  branchName: string;
}
