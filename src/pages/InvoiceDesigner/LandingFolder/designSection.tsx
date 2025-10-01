import { ComponentType, lazy, ReactNode } from "react";
import {
  DocumentTextIcon,
  BarsArrowUpIcon,
  AdjustmentsHorizontalIcon,
  TableCellsIcon,
  PaintBrushIcon
} from "@heroicons/react/20/solid";

import TablePremiumDesigner from "./account/premium/designer/table-designer";
import { PrintDetailDto } from "../../use-print-type";
import { generateTableColumns } from "../../../utilities/Utils";
import { initialPrintDetailDto } from "../../use-print-type-data";
import SharedDownloadTemplate from "../DownloadPreview/Shared";
import SharedTemplatePreview from "../DesignPreview/shared";
import VoucherType from "../../../enums/voucher-types";

export  interface DesignSectionType {
  id: number;
  name: string;
  type: "properties" | "transactions" | "table" |"header"|"footer" | "barcode";
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Updated to ComponentType
}
export interface DesignerConfig {
  downloadComponent:JSX.Element;
  PreviewComponent: JSX.Element;
  sections: {
    transactions?: ComponentType<any>; // Use specific prop types if available
    table?: ComponentType<any>;
    footer?: ComponentType<any>;

  };
}

// Map: templateGroup -> templateType -> templateKind
export type DesignerConfigMap = Partial<
  Record<
    VoucherType,
    Record<string, Record<string, DesignerConfig>>
  >
>;

export const templateConfig: DesignerConfigMap = {
 
  CP:{
    STANDARD: {
      standard: {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
    },
    PREMIUM: {
      premium: {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent:  <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
    },
    UNIVERSAL: {
      universal: {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
    },
  },
  PI:{
      STANDARD: {
      standard: {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
    },
    PREMIUM: {
      premium: {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent:  <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
      })},
      },
    },
    UNIVERSAL: {
      universal: {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
    },
     SPREDSHEET:{
       spreadsheet:{
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
    }
    },

    RETAIL: {
      "retail-standard": {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
      "2inch": {
        downloadComponent: <SharedDownloadTemplate />,
        PreviewComponent: <SharedTemplatePreview />,
        sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
        tableState: generateTableColumns(initialPrintDetailDto)
        })},
      },
    },

  }
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
    name: "header",
    description: "Headerconfiguration",
    type: "header",
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
    name: "footer",
    description: "footer configuration",
    type: "footer",
    icon: PaintBrushIcon,
  },

];

// Now nested by templateType -> templateKind -> section types
export const designerSectionsConfig: Record<string, Record<string, string[]>> = {
  STANDARD: {
    standard: ["properties", "header",  "table", "footer", ],
  },
  PREMIUM: {
    premium: ["properties", "header",  "table", "footer", ],
  },
  UNIVERSAL: {
    universal: ["properties", "header",  "table", "footer", ],
  },
  RETAIL: {
    "retail-standard": ["properties", "header",  "table", "footer", ],
    "2inch":["properties", "header",  "table", "footer", ],
  },
  ADVANCE: {
    advice: ["properties", "header",  "table", "footer", ],
  },
  CHEQUE: {
    cheque: ["properties", "header",  "table", "footer", ],
  },
  CUSTOMERBALANCE: {
    customerBalance: ["properties", "header",  "table", "footer", ],
  },
};


//acc-trance table columns


