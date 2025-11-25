/**
 * Service Transaction Initial Data
 */

import moment from "moment";
import {
  ServiceTransactionMaster,
  ServiceDetails,
  AgentTransfer,
  ServiceInvoice,
  ServiceSpareDetail,
  ServiceTransactionData,
  ServiceFormElements,
  ServiceTransactionFormState,
  ServiceStatus,
  ServiceReportFilter,
} from "./service-transaction-types";

export const initialServiceMaster: ServiceTransactionMaster = {
  serviceTransMasterID: 0,
  branchID: 0,
  financialYearID: 0,
  jobNo: 0,
  orderDate: moment().toISOString(),
  ledgerID: 0,
  customerName: "",
  address1: "",
  address2: "",
  mobile: "",
  phone: "",
  serviceID: 0,
  serviceName: "",
  productRemarks: "",
  serialNo: "",
  receivedItems: "",
  complaints: "",
  expectedDeliveryDate: moment().toISOString(),
  advanceReceived: 0,
  unitRate: 0,
  isWarrantyService: false,
  status: ServiceStatus.Pending,
  createdUserID: 0,
  createdDate: moment().toISOString(),
  modifiedUserID: 0,
  modifiedDate: moment().toISOString(),
};

export const initialServiceDetails: ServiceDetails = {
  serviceTransDetailID: 0,
  serviceTransMasterID: 0,
  serviceDoneDate: moment().toISOString(),
  serviceCharge: 0,
  consumedQtyAmount: 0,
  warehouseID: 0,
  warehouseName: "",
  priceCategoryID: 0,
  status: ServiceStatus.Pending,
};

export const initialAgentTransfer: AgentTransfer = {
  serviceAgentTransferID: 0,
  serviceTransMasterID: 0,
  agentID: 0,
  agentName: "",
  transferDate: moment().toISOString(),
  despatchedReturnDate: moment().toISOString(),
  expectedDeliveryDate: moment().toISOString(),
  agentCharge: 0,
  unitRate: 0,
  consumedQtyAmount: 0,
  isWarrantyService: false,
  status: ServiceStatus.Pending,
};

export const initialServiceInvoice: ServiceInvoice = {
  serviceInvoiceID: 0,
  serviceTransMasterID: 0,
  invoiceDate: moment().toISOString(),
  accountID: 0,
  accountName: "",
  consumedQtyAmount: 0,
  serviceCharge: 0,
  total: 0,
  advanceReceived: 0,
  cashReceived: 0,
  balance: 0,
  closingRemarks: "",
  remarks: "",
  remarks2: "",
  isWarrantyService: false,
};

export const initialSpareDetail: ServiceSpareDetail = {
  serviceSpareDetailID: 0,
  serviceTransMasterID: 0,
  slNo: 0,
  productID: 0,
  productBatchID: 0,
  pCode: "",
  barcode: "",
  manualBarcode: "",
  product: "",
  qty: 0,
  unitID: 0,
  unit: "",
  purchasePrice: 0,
  total: 0,
  stock: 0,
};

export const initialServiceTransactionData: ServiceTransactionData = {
  master: initialServiceMaster,
  serviceDetails: initialServiceDetails,
  agentTransfer: initialAgentTransfer,
  invoice: initialServiceInvoice,
  spareDetails: [],
  history: [],
};

export const initialFormElements: ServiceFormElements = {
  // Order Tab
  jobNo: { visible: true, disabled: false, label: "Job No." },
  orderDate: { visible: true, disabled: false, label: "Date" },
  ledgerID: { visible: true, disabled: false, label: "Cash/Bank" },
  customerName: { visible: true, disabled: false, label: "Name" },
  address1: { visible: true, disabled: false, label: "Address 1" },
  address2: { visible: true, disabled: false, label: "Address 2" },
  mobile: { visible: true, disabled: false, label: "Mobile" },
  phone: { visible: true, disabled: false, label: "Phone" },
  serviceID: { visible: true, disabled: false, label: "Service" },
  productRemarks: { visible: true, disabled: false, label: "Product Remarks" },
  serialNo: { visible: true, disabled: false, label: "Serial No" },
  receivedItems: { visible: true, disabled: false, label: "Received Items" },
  complaints: { visible: true, disabled: false, label: "Complaints" },
  expectedDeliveryDate: { visible: true, disabled: false, label: "Expected Delivery Date" },
  advanceReceived: { visible: true, disabled: false, label: "Advance Received" },
  unitRate: { visible: true, disabled: false, label: "Unit Rate" },
  isWarrantyService: { visible: true, disabled: false, label: "Is Warranty Service" },
  // Service Tab
  serviceDoneDate: { visible: true, disabled: false, label: "Date" },
  serviceCharge: { visible: true, disabled: false, label: "Service Charge" },
  consumedQtyAmount: { visible: true, disabled: false, label: "Consumed Qty Amt" },
  warehouseID: { visible: true, disabled: false, label: "Warehouse" },
  priceCategoryID: { visible: true, disabled: false, label: "Price Category" },
  status: { visible: true, disabled: false, label: "Status" },
  // Agent Transfer Tab
  agentID: { visible: true, disabled: false, label: "Agent Name" },
  transferDate: { visible: true, disabled: false, label: "Date" },
  despatchedReturnDate: { visible: true, disabled: false, label: "Despatched Return Date" },
  agentCharge: { visible: true, disabled: false, label: "Agent Charge" },
  // Invoice Tab
  invoiceDate: { visible: true, disabled: false, label: "Date" },
  accountID: { visible: true, disabled: false, label: "Account" },
  cashReceived: { visible: true, disabled: false, label: "Cash Received" },
  closingRemarks: { visible: true, disabled: false, label: "Closed With" },
  remarks: { visible: true, disabled: false, label: "Remarks" },
  remarks2: { visible: true, disabled: false, label: "Remarks 2" },
  // Buttons
  btnSave: { visible: true, disabled: false, label: "Save" },
  btnClear: { visible: true, disabled: false, label: "Clear" },
  btnDelete: { visible: true, disabled: false, label: "Delete" },
  btnPrint: { visible: true, disabled: false, label: "Print" },
};

export const initialServiceTransactionFormState: ServiceTransactionFormState = {
  transaction: initialServiceTransactionData,
  formElements: initialFormElements,
  activeTab: 0,
  isEdit: false,
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  printOnSave: true,
  showHistory: false,
  searchJobNo: 0,
  searchIn: "JobNo",
};

export const initialReportFilter: ServiceReportFilter = {
  fromDate: moment().startOf("month").toISOString(),
  toDate: moment().toISOString(),
  status: "",
  serviceID: 0,
  isWarrantyService: "",
};

export const statusOptions = [
  { value: "", label: "All" },
  { value: ServiceStatus.Pending, label: "Pending" },
  { value: ServiceStatus.InProgress, label: "In Progress" },
  { value: ServiceStatus.Completed, label: "Completed" },
  { value: ServiceStatus.Transferred, label: "Transferred" },
  { value: ServiceStatus.Invoiced, label: "Invoiced" },
  { value: ServiceStatus.Cancelled, label: "Cancelled" },
];

export const searchInOptions = [
  { value: "JobNo", label: "Job No" },
  { value: "SerialNo", label: "Serial No" },
  { value: "Mobile", label: "Mobile" },
  { value: "CustomerName", label: "Customer Name" },
];

export const closingRemarksOptions = [
  { value: "", label: "Select..." },
  { value: "Repaired", label: "Repaired" },
  { value: "Replaced", label: "Replaced" },
  { value: "Returned", label: "Returned" },
  { value: "Not Repairable", label: "Not Repairable" },
  { value: "Parts Unavailable", label: "Parts Unavailable" },
];
