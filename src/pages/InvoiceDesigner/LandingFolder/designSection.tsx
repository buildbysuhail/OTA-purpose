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
        sections: { transactions: AccPremiumTransaction, table: () => TablePremiumDesigner<TransactionDetail>({
        tableState: [{field: "pCode", label: "Code", show: true, width: 100}]
    }),  total: TotalPremiumDesigner, others: () => null },
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
