
import { OptionGroup } from "../../components/ERPComponents/erp-grouped-combo";
import { initialChequeDataForPrint, initialHeaderFooter, initialLedgerReportDataForPrint } from "../../redux/slices/user-session/reducer";
import { modelToListFromObject } from "../../utilities/Utils";
import { TransactionMasterInitialData, initialTransactionDetailData, initialProductData } from "../inventory/transactions/transaction-type-data";
import { TransactionMaster, TransactionDetail, BarcodeLabel } from "../inventory/transactions/transaction-types";
import { ChequeDataPrint, CompanyDetailsForPrint, HeaderFooter, InvDetail2ForPrint, ledgerDataPrint, LedgerReportDataForPrint, PartyDetailsForPrint, PrintCustomFields, PrintDetailDto, PrintMasterDto } from "../use-print-type";
import { initialCompanyDetailsForPrint, initialInvDetail2ForPrint, initialPartyDetailsForPrint, initialPrintCustomFields, initialPrintDetailDto, initialPrintMasterDto } from "../use-print-type-data";
interface fdf {
  fdd: number
}

export const inventoryFields: OptionGroup[] = [
  { groupName: 'Custom', options: modelToListFromObject<PrintCustomFields>(initialPrintCustomFields, "custom___") },
  { groupName: 'Master', options: modelToListFromObject<PrintMasterDto>(initialPrintMasterDto, "master___") },
  { groupName: 'Details', options: modelToListFromObject<PrintDetailDto>(initialPrintDetailDto, "details___") },
  { groupName: 'Details', options: modelToListFromObject<InvDetail2ForPrint>(initialInvDetail2ForPrint, "details2___") },
  { groupName: 'Organization', options: modelToListFromObject<CompanyDetailsForPrint>(initialCompanyDetailsForPrint, "org___") },
  { groupName: 'Customer',  options: modelToListFromObject<PartyDetailsForPrint>(initialPartyDetailsForPrint,"customer___") },
  { groupName: 'HeaderFooter', options: modelToListFromObject<HeaderFooter>(initialHeaderFooter, "headerFooter___") },

];
export const accountsFields: OptionGroup[] = [
  { groupName: 'Custom', options: modelToListFromObject<PrintCustomFields>(initialPrintCustomFields, "custom___") },
  { groupName: 'Master', options: modelToListFromObject<PrintMasterDto>(initialPrintMasterDto, "master___") },
  { groupName: 'Details', options: modelToListFromObject<PrintDetailDto>(initialPrintDetailDto, "details___") },
  { groupName: 'Details', options: modelToListFromObject<InvDetail2ForPrint>(initialInvDetail2ForPrint, "details2___") },
  { groupName: 'Organization', options: modelToListFromObject<CompanyDetailsForPrint>(initialCompanyDetailsForPrint, "org___") },
  { groupName: 'Customer',  options: modelToListFromObject<PartyDetailsForPrint>(initialPartyDetailsForPrint,"customer___") },
  { groupName: 'HeaderFooter', options: modelToListFromObject<HeaderFooter>(initialHeaderFooter, "headerFooter___") },
];

export const ledgerReportFields: OptionGroup[] = [
  { groupName: 'Organization', options: modelToListFromObject<CompanyDetailsForPrint>(initialCompanyDetailsForPrint, "org___") },
  { groupName: 'HeaderFooter', options: modelToListFromObject<HeaderFooter>(initialHeaderFooter, "headerFooter___") },
  { groupName: 'LedgerReport', options: modelToListFromObject<ledgerDataPrint>(initialLedgerReportDataForPrint, "ledgerReportDataForPrint___") },
];
export const CheckFields: OptionGroup[] = [
  { groupName: 'Cheque', options: modelToListFromObject<ChequeDataPrint>(initialChequeDataForPrint, "cheque___") },
];
export const barCodeField: OptionGroup[] = [
  { groupName: "BarCodeField", options: modelToListFromObject<BarcodeLabel>(initialProductData, "barcode___") }
]
// export const imgField: OptionGroup[] = [
//   { groupName: 'Organization', options: modelToListFromObject<CompanyDetailsForPrint>(initialCompanyDetailsForPrint, "org___") },
// ]
export const imgField: OptionGroup[] = [
  {
    groupName: "Organization",
    options: modelToListFromObject<CompanyDetailsForPrint>(initialCompanyDetailsForPrint, "org___")
      .filter(opt => opt.id === "org___companyLogo"),
  },
];

export const qrCodeField: OptionGroup[] = [
  { groupName: 'Custom', options: modelToListFromObject<PrintCustomFields>(initialPrintCustomFields, "custom___") },
]

export const bindingDemoData = {
  org_name: "Acme Corporation Pvt Ltd",
  org_branch: "Bangalore Branch",
  org_details: {
    address: "123 MG Road, Bangalore, Karnataka, India",
    contact: "+91-9876543210",
    email: "info@acmecorp.com",
    gstNumber: "29ABCDE1234F1Z5",
  },
  branch_Details: {
    branchCode: "BLR001",
    manager: "Ravi Kumar",
    phone: "+91-9876543210",
    email: "blrbranch@acmecorp.com",
  },
  invMaster_grandTotal: "₹ 1,25,000.00",
  accMaster_invDetails: [
    {
      itemName: "Steel Pipes",
      quantity: 100,
      unitPrice: 500,
      total: 50000,
    },
    {
      itemName: "Valves",
      quantity: 50,
      unitPrice: 1000,
      total: 50000,
    },
    {
      itemName: "Fittings",
      quantity: 25,
      unitPrice: 1000,
      total: 25000,
    },
  ],
  custom: "This is a custom note or dynamic field.",

  // Footer and header placeholders
  "[Footer1]": "Thank you for your business!",
  "[Footer2]": "Payment terms: 30 days",
  "[Footer3]": "Authorized Signatory",
  "[Footer4]": "Acme Corporation Pvt Ltd",
  "[Footer5]": "Visit us: www.acmecorp.com",
  "[Footer6]": "Customer care: +91-1234567890",
  "[Footer7]": "GST inclusive",
  "[Footer8]": "No returns accepted after 15 days",
  "[Footer9]": "Generated by ERP System",
  "[Footer10]": "This is a system-generated document.",

  "[Header1]": "Tax Invoice",
  "[Header2]": "Acme Corporation Pvt Ltd",
  "[Header3]": "Invoice Date: 04-Jul-2025",
  "[Header4]": "Invoice No: INV-2025-00123",
  "[Header5]": "Branch: Bangalore",
  "[Header6]": "Customer: ABC Industries",
  "[Header7]": "Dispatch through: Courier",
  "[Header8]": "Delivery address: Mumbai",
  "[Header9]": "Due Date: 03-Aug-2025",
  "[Header10]": "Page 1 of 1",
};

export const shortcutGroups = [
  {
    group: "History",
    items: [
      { keys: ["Ctrl", "Z"],              description: "Undo last action" },
      { keys: ["Ctrl", "Shift", "Z"],     description: "Redo last action " },
      { keys: ["Ctrl", "Y"],              description: "Redo last action (alt)" },
      
    ],
  },
  {
    group: "Canvas",
    items: [
      { keys: ["Ctrl", "S"],              description: "Save template" },
      { keys: ["Ctrl", "+"],              description: "Zoom in" },
      { keys: ["Ctrl", "-"],              description: "Zoom out" },
      { keys: ["Ctrl", "0"],              description: "Reset zoom to 100%" },
      { keys: ["Esc"],                    description: "Deselect element" },
    ],
  },
  {
    group: "Selected Element",
    items: [
      { keys: ["Delete"],                 description: "Delete element" },
      { keys: ["↑ ↓ ← →"],               description: "Move element (1 pt)" },
      { keys: ["Shift", "↑ ↓ ← →"],      description: "Move element (10 pt)" },
      { keys: ["Alt", "↑ ↓ ← →"],        description: "Resize element" },
    ],
  },
];