import { ComponentType, lazy, ReactNode } from "react";
import {
  DocumentTextIcon,
  BarsArrowUpIcon,
  AdjustmentsHorizontalIcon,
  TableCellsIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/20/solid";
import { TicketIcon } from "lucide-react";
import AccPremiumTransaction from "./account/premium/designer/transaction-desiner";
import TablePremiumDesigner from "./account/premium/designer/table-designer";
import TotalPremiumDesigner from "./account/premium/designer/total-designer";
import AccStandardTransaction from "./account/standard/designer/transactions-designer";
import TotalStdDesigner from "./account/standard/designer/total-designer";
import AccUniversalTransaction from "./account/universal/designer/transactions-designer";
import AdviceTableDesigner from "../Designer/accounts/advice/adviceTableDesigner";
import AccountDowTransactionsVoucher from "../DownloadPreview/account/account_transactiocn_standard";
import AccountTransactionsTemplate from "../DownloadPreview/account/account_transactiocn-premium";
import AccountTransactionsUniversal from "../DownloadPreview/account/account_transaction-universal";
import AdviceTemplate  from "../DownloadPreview/advice-template";
import ChequeTemplate  from "../DownloadPreview/cheque-template";
import CustomerBalanceTemplateDesigner   from "./reports/customerBalace/customer-balance-report-designe";
import AccountPrvTransactionsVoucher from "../DesignPreview/account/acc_transaction_standard/prevIndex";
import RetailRollSheetPrev from "../DesignPreview/RetailPreview/two-inch-preview";
import { TransactionDetail } from "../../inventory/transactions/purchase/transaction-types";
import AccountTransactionsTemplatePreview from "../DesignPreview/account/acc_transaction_premium";
import AccountTransactionsUniversalPreview from "../DesignPreview/account/acc_transaction_universal";
import { PrintDetailDto } from "../../use-print-type";
import { generateTableColumns } from "../../../utilities/Utils";
import { initialPrintDetailDto } from "../../use-print-type-data";

export  interface DesignSectionType {
  id: number;
  name: string;
  type: "properties" | "transactions" | "table" | "total" | "others" | "header&footer" | "barcode";
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Updated to ComponentType
}
export interface DesignerConfig {
  downloadComponent:JSX.Element;
  PreviewComponent: JSX.Element;
  sections: {
    transactions?: ComponentType<any>; // Use specific prop types if available
    table?: ComponentType<any>;
    total?: ComponentType<any>;
    others?: ComponentType<any>;
  };
}

// Map: templateGroup -> templateType -> templateKind
export type DesignerConfigMap = Record<
  string,
  Record<
    string,
    Record<string, DesignerConfig>
  >
>;
export const templateConfig: DesignerConfigMap = {
  SI: {
    STANDARD: {
      standard: {
        downloadComponent: <AccountDowTransactionsVoucher />,
        PreviewComponent: <AccountPrvTransactionsVoucher />,
        sections: { transactions: AccStandardTransaction, total: TotalStdDesigner, others: () => null },
      },
    },
    PREMIUM: {
      premium: {
        downloadComponent: <AccountTransactionsTemplate />,
        PreviewComponent: <AccountPrvTransactionsVoucher />,
        sections: { transactions: AccPremiumTransaction, table: TablePremiumDesigner, total: TotalPremiumDesigner, others: () => null },
      },
    },
    UNIVERSAL: {
      universal: {
        downloadComponent: <AccountTransactionsUniversal />,
        PreviewComponent: <AccountPrvTransactionsVoucher />,
        sections: { transactions: AccUniversalTransaction, others: () => null },
      },
    },
    SPREDSHEET:{
       spreadsheet:{
        downloadComponent: <AccountTransactionsTemplate />,
        PreviewComponent: <AccountPrvTransactionsVoucher />,
        sections: { transactions: AccPremiumTransaction, table: TablePremiumDesigner, total: TotalPremiumDesigner, others: () => null },
    }
    },

    RETAIL: {
      "retail-standard": {
        downloadComponent: <AccountTransactionsTemplate />,
        PreviewComponent: <AccountPrvTransactionsVoucher />,
        sections: { transactions: AccStandardTransaction, total: TotalStdDesigner, others: () => null },
      },
      "2inch": {
        downloadComponent: <AccountTransactionsTemplate />,
        PreviewComponent: <RetailRollSheetPrev />,
        sections: { transactions: AccStandardTransaction, total: TotalStdDesigner, others: () => null },
      },
    },

  },
  CP:{
    STANDARD: {
      standard: {
        downloadComponent: <AccountDowTransactionsVoucher />,
        PreviewComponent: <AccountPrvTransactionsVoucher />,
        sections: { transactions: AccStandardTransaction, total: TotalStdDesigner, others: () => null },
      },
    },
    PREMIUM: {
      premium: {
        downloadComponent: <AccountTransactionsTemplate />,
        PreviewComponent:  <AccountTransactionsTemplatePreview />,
        sections: { transactions: AccPremiumTransaction, table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
      }), total: TotalPremiumDesigner, others: () => null },
      },
    },
    UNIVERSAL: {
      universal: {
        downloadComponent: <AccountTransactionsUniversal />,
        PreviewComponent: <AccountTransactionsUniversalPreview />,
        sections: { transactions: AccUniversalTransaction, others: () => null },
      },
    },
  },
      // ADVANCE: {
    //   advice: {
    //     downloadComponent: <AdviceTemplate />,
    //     PreviewComponent: <AdviceTemplate />,
    //     sections: { transactions: AdviceTableDesigner, total: () => null, others: () => null },
    //   },
    // },
    // CHEQUE: {
    //   cheque: {
    //     downloadComponent: <ChequeTemplate />,
    //     PreviewComponent: <ChequeTemplate />,
    //     sections: { transactions: () => null, total: () => null, others: () => null },
    //   },
    // },
    // CUSTOMERBALANCE: {
    //   customerBalance: {
    //     downloadComponent: <CustomerBalanceTemplateDesigner />,
    //     PreviewComponent: <CustomerBalanceTemplateDesigner />,
    //     sections: { transactions: () => null, total: () => null, others: () => null },
    //   },
    // },
};

export const designSections: DesignSectionType[] = [
  {
    id: 1,
    name: "template_properties",
    description: "Template properties configuration",
    type: "properties",
    icon: DocumentTextIcon,
  },
  {
    id: 2,
    name: "header_&_footer",
    description: "Header and footer configuration",
    type: "header&footer",
    icon: BarsArrowUpIcon,
  },
  {
    id: 3,
    name: "transaction_details",
    description: "Transaction details configuration",
    type: "transactions",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    id: 4,
    name: "table",
    description: "Table configuration",
    type: "table",
    icon: TableCellsIcon,
  },
  {
    id: 5,
    name: "total",
    description: "Total configuration",
    type: "total",
    icon: CurrencyDollarIcon,
  },
  {
    id: 6,
    name: "other_details",
    description: "Other details configuration",
    type: "others",
    icon: TicketIcon,
  },
];

// Now nested by templateType -> templateKind -> section types
export const designerSectionsConfig: Record<string, Record<string, string[]>> = {
  STANDARD: {
    standard: ["properties", "header&footer", "transactions", "total", "others"],
  },
  PREMIUM: {
    premium: ["properties", "header&footer", "transactions", "table", "total", "others"],
  },
  UNIVERSAL: {
    universal: ["properties", "header&footer", "transactions", "others"],
  },
  RETAIL: {
    "retail-standard": ["properties", "header&footer", "transactions", "table", "total", "others"],
    "2inch": ["properties", "header&footer", "transactions", "table", "total", "others"],
  },
  ADVANCE: {
    advice: ["properties", "header&footer", "transactions", "total", "others"],
  },
  CHEQUE: {
    cheque: ["properties", "header&footer", "transactions", "total", "others"],
  },
  CUSTOMERBALANCE: {
    customerBalance: ["properties", "header&footer", "transactions", "total", "others"],
  },
};


//acc-trance table columns

export const tableState = [
  { field: "slNo", label: "slNo", show: false, width: 100 },
  { field: "invTransactionDetailID", label: "invTransactionDetailID", show: false, width: 100 },
  { field: "invTransactionMasterID", label: "invTransactionMasterID", show: false, width: 100 },
  { field: "productBatchID", label: "productBatchID", show: false, width: 100 },
  { field: "productDescription", label: "productDescription", show: false, width: 100 },
  { field: "quantity", label: "quantity", show: false, width: 100 },
  { field: "qtyInBaseUnit", label: "qtyInBaseUnit", show: false, width: 100 },
  { field: "baseUnitUnitPrice", label: "baseUnitUnitPrice", show: false, width: 100 },
  { field: "taxIncludedBasePrice", label: "taxIncludedBasePrice", show: false, width: 100 },
  { field: "baseQty", label: "baseQty", show: false, width: 100 },
  { field: "free", label: "free", show: false, width: 100 },
  { field: "qtyInNumbers", label: "qtyInNumbers", show: false, width: 100 },
  { field: "unitID", label: "unitID", show: false, width: 100 },
  { field: "totalQty", label: "totalQty", show: false, width: 100 },
  { field: "barcodeQty", label: "barcodeQty", show: false, width: 100 },
  { field: "unitPrice", label: "unitPrice", show: false, width: 100 },
  { field: "valuationPrice", label: "valuationPrice", show: false, width: 100 },
  { field: "rateWithTax", label: "rateWithTax", show: false, width: 100 },
  { field: "grossValue", label: "grossValue", show: false, width: 100 },
  { field: "discountPer1", label: "discountPer1", show: false, width: 100 },
  { field: "discountAmt1", label: "discountAmt1", show: false, width: 100 },
  { field: "totalDiscount", label: "totalDiscount", show: false, width: 100 },
  { field: "vatPercentage", label: "vatPercentage", show: false, width: 100 },
  { field: "vat", label: "vat", show: false, width: 100 },
  { field: "netValue", label: "netValue", show: false, width: 100 },
  { field: "taxIncludedPrice", label: "taxIncludedPrice", show: false, width: 100 },
  { field: "cstPerc", label: "cstPerc", show: false, width: 100 },
  { field: "cst", label: "cst", show: false, width: 100 },
  { field: "netAmount", label: "netAmount", show: false, width: 100 },
  { field: "costPerItem", label: "costPerItem", show: false, width: 100 },
  { field: "totalProfit", label: "totalProfit", show: false, width: 100 },
  { field: "marginPer", label: "marginPer", show: false, width: 100 },
  { field: "marginAmt", label: "marginAmt", show: false, width: 100 },
  { field: "stdSalesPrice", label: "stdSalesPrice", show: false, width: 100 },
  { field: "mrp", label: "mrp", show: false, width: 100 },
  { field: "invStatus", label: "invStatus", show: false, width: 100 },
  { field: "salesManID", label: "salesManID", show: false, width: 100 },
  { field: "qtyIn", label: "qtyIn", show: false, width: 100 },
  { field: "qtyOut", label: "qtyOut", show: false, width: 100 },
  { field: "qtyNosIn", label: "qtyNosIn", show: false, width: 100 },
  { field: "qtyNosOut", label: "qtyNosOut", show: false, width: 100 },
  { field: "adjQty", label: "adjQty", show: false, width: 100 },
  { field: "adjQtyNos", label: "adjQtyNos", show: false, width: 100 },
  { field: "modelNo", label: "modelNo", show: false, width: 100 },
  { field: "specification", label: "specification", show: false, width: 100 },
  { field: "color", label: "color", show: false, width: 100 },
  { field: "autoBarcode", label: "autoBarcode", show: false, width: 100 },
  { field: "mannualBarcode", label: "mannualBarcode", show: false, width: 100 },
  { field: "mfgDate", label: "mfgDate", show: false, width: 100 },
  { field: "brandName", label: "brandName", show: false, width: 100 },
  { field: "brandID", label: "brandID", show: false, width: 100 },
  { field: "brandShortName", label: "brandShortName", show: false, width: 100 },
  { field: "sVatPerc", label: "sVatPerc", show: false, width: 100 },
  { field: "pVatPerc", label: "pVatPerc", show: false, width: 100 },
  { field: "taxCategoryName", label: "taxCategoryName", show: false, width: 100 },
  { field: "productCode", label: "productCode", show: false, width: 100 },
  { field: "productName", label: "productName", show: false, width: 100 },
  { field: "hsnCode", label: "hsnCode", show: false, width: 100 },
  { field: "commodityCode", label: "commodityCode", show: false, width: 100 },
  { field: "itemAliasCode", label: "itemAliasCode", show: false, width: 100 },
  { field: "itemAlias", label: "itemAlias", show: false, width: 100 },
  { field: "itemNameinSecondLanguage", label: "itemNameinSecondLanguage", show: false, width: 100 },
  { field: "arabicName", label: "arabicName", show: false, width: 100 },
  { field: "batchStdSalesPrice", label: "batchStdSalesPrice", show: false, width: 100 },
  { field: "stdPurchasePrice", label: "stdPurchasePrice", show: false, width: 100 },
  { field: "batchMRP", label: "batchMRP", show: false, width: 100 },
  { field: "modelNumber", label: "modelNumber", show: false, width: 100 },
  { field: "batchSpecification", label: "batchSpecification", show: false, width: 100 },
  { field: "upcCode", label: "upcCode", show: false, width: 100 },
  { field: "packing", label: "packing", show: false, width: 100 },
  { field: "partNumber", label: "partNumber", show: false, width: 100 },
  { field: "productColour", label: "productColour", show: false, width: 100 },
  { field: "warranty", label: "warranty", show: false, width: 100 },
  { field: "productCategoryCode", label: "productCategoryCode", show: false, width: 100 },
  { field: "productCategoryName", label: "productCategoryName", show: false, width: 100 },
  { field: "unitCode", label: "unitCode", show: false, width: 100 },
  { field: "unitName", label: "unitName", show: false, width: 100 },
  { field: "unitRemarks", label: "unitRemarks", show: false, width: 100 },
  { field: "groupName", label: "groupName", show: false, width: 100 },
  { field: "serialNumber", label: "serialNumber", show: false, width: 100 },
  { field: "location", label: "location", show: false, width: 100 },
  { field: "salesValue", label: "salesValue", show: false, width: 100 },
  { field: "unitSalesValue", label: "unitSalesValue", show: false, width: 100 },
  { field: "unitQty", label: "unitQty", show: false, width: 100 },
  { field: "additionalExpense", label: "additionalExpense", show: false, width: 100 },
  { field: "scannedBarcode", label: "scannedBarcode", show: false, width: 100 },
  { field: "unitPriceFC", label: "unitPriceFC", show: false, width: 100 },
  { field: "grossFC", label: "grossFC", show: false, width: 100 },
  { field: "netValueFC", label: "netValueFC", show: false, width: 100 },
  { field: "netAmountFC", label: "netAmountFC", show: false, width: 100 },
  { field: "totalDiscountFC", label: "totalDiscountFC", show: false, width: 100 },
  { field: "exchangeRate", label: "exchangeRate", show: false, width: 100 },
  { field: "productUnitRemarks", label: "productUnitRemarks", show: false, width: 100 },
  { field: "warehouseID", label: "warehouseID", show: false, width: 100 },
  { field: "warehouse", label: "warehouse", show: false, width: 100 },
  { field: "supplierReferenceProductCode", label: "supplierReferenceProductCode", show: false, width: 100 },
  { field: "batchNo", label: "batchNo", show: false, width: 100 },
  { field: "expiryDate", label: "expiryDate", show: false, width: 100 },
  { field: "schemeDiscAmt", label: "schemeDiscAmt", show: false, width: 100 },
  { field: "schemeDiscPerc", label: "schemeDiscPerc", show: false, width: 100 },
  { field: "memo", label: "memo", show: false, width: 100 },
  { field: "stock", label: "stock", show: false, width: 100 },
  { field: "netWeight", label: "netWeight", show: false, width: 100 },
  { field: "netWeightUnitName", label: "netWeightUnitName", show: false, width: 100 },
  { field: "productNotes1", label: "productNotes1", show: false, width: 100 },
  { field: "productNotes2", label: "productNotes2", show: false, width: 100 },
  { field: "productNotes3", label: "productNotes3", show: false, width: 100 },
  { field: "productNotes4", label: "productNotes4", show: false, width: 100 },
  { field: "itemType", label: "itemType", show: false, width: 100 },
  { field: "gatePass", label: "gatePass", show: false, width: 100 },
  { field: "stockDetails", label: "stockDetails", show: false, width: 100 },
  { field: "voucherNumber", label: "voucherNumber", show: false, width: 100 },
  { field: "dailyVoucherNumber", label: "dailyVoucherNumber", show: false, width: 100 },
  { field: "voucherType", label: "voucherType", show: false, width: 100 },
  { field: "branchID", label: "branchID", show: false, width: 100 },
  { field: "counterID", label: "counterID", show: false, width: 100 },
  { field: "partyName", label: "partyName", show: false, width: 100 },
  { field: "vatAmount", label: "vatAmount", show: false, width: 100 },
  { field: "billDiscount", label: "billDiscount", show: false, width: 100 },
  { field: "grandTotal", label: "grandTotal", show: false, width: 100 },
  { field: "roundAmount", label: "roundAmount", show: false, width: 100 },
  { field: "cashReceived", label: "cashReceived", show: false, width: 100 },
  { field: "advanceAmt", label: "advanceAmt", show: false, width: 100 },
  { field: "cashReturned", label: "cashReturned", show: false, width: 100 },
  { field: "salesManIncentive", label: "salesManIncentive", show: false, width: 100 },
  { field: "adjustmentAmount", label: "adjustmentAmount", show: false, width: 100 },
  { field: "branch", label: "branch", show: false, width: 100 },
  { field: "siNo", label: "siNo", show: false, width: 100 },
  { field: "accTransactionDetailID", label: "accTransactionDetailID", show: false, width: 100 },
  { field: "ledgerCode", label: "ledgerCode", show: false, width: 100 },
  { field: "accountName", label: "accountName", show: false, width: 100 },
  { field: "relatedLedgerCode", label: "relatedLedgerCode", show: false, width: 100 },
  { field: "particulars", label: "particulars", show: false, width: 100 },
  { field: "particularLedgerCode", label: "particularLedgerCode", show: false, width: 100 },
  { field: "ledgerID", label: "ledgerID", show: false, width: 100 },
  { field: "relatedLedgerID", label: "relatedLedgerID", show: false, width: 100 },
  { field: "debit", label: "debit", show: false, width: 100 },
  { field: "credit", label: "credit", show: false, width: 100 },
  { field: "amount", label: "amount", show: false, width: 100 },
  { field: "narration", label: "narration", show: false, width: 100 },
  { field: "discount", label: "discount", show: false, width: 100 },
  { field: "incentives", label: "incentives", show: false, width: 100 },
  { field: "adjAmount", label: "adjAmount", show: false, width: 100 },
  { field: "bankDate", label: "bankDate", show: false, width: 100 },
  { field: "chequeNumber", label: "chequeNumber", show: false, width: 100 },
  { field: "checkStatus", label: "checkStatus", show: false, width: 100 },
  { field: "checkBouncedDate", label: "checkBouncedDate", show: false, width: 100 },
  { field: "chequeDate", label: "chequeDate", show: false, width: 100 },
  { field: "billwiseDetails", label: "billwiseDetails", show: false, width: 100 },
  { field: "ledgerNameArabic", label: "ledgerNameArabic", show: false, width: 100 },
  { field: "relatedLedgerNameArabic", label: "relatedLedgerNameArabic", show: false, width: 100 },
  { field: "costCentreName", label: "costCentreName", show: false, width: 100 },
  { field: "txp_PartyName", label: "txp_PartyName", show: false, width: 100 },
  { field: "txp_TaxNo", label: "txp_TaxNo", show: false, width: 100 },
  { field: "txp_TaxPercentage", label: "txp_TaxPercentage", show: false, width: 100 },
  { field: "txp_TaxAmount", label: "txp_TaxAmount", show: false, width: 100 },
  { field: "txp_TaxableAmount", label: "txp_TaxableAmount", show: false, width: 100 },
  { field: "txp_RefNo", label: "txp_RefNo", show: false, width: 100 },
  { field: "txp_RefDate", label: "txp_RefDate", show: false, width: 100 },
  { field: "detail2Data", label: "detail2Data", show: false, width: 100 },
];
