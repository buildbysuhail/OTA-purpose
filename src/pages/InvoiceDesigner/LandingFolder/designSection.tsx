import { ComponentType } from "react";
import {
  DocumentTextIcon,
  BarsArrowUpIcon,
  AdjustmentsHorizontalIcon,
  TableCellsIcon,
  PaintBrushIcon
} from "@heroicons/react/20/solid";


export  interface DesignSectionType {
  id: number;
  name: string;
  type: "properties" | "transactions" | "table" |"header"|"footer" | "barcode";
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Updated to ComponentType
}
// export interface DesignerConfig {
//   downloadComponent:JSX.Element;
//   PreviewComponent: JSX.Element;
//   sections: {
//     transactions?: ComponentType<any>; // Use specific prop types if available
//     table?: ComponentType<any>;
//     footer?: ComponentType<any>;

//   };
// }

// Map: templateGroup -> templateType -> templateKind
// export type DesignerConfigMap = Partial<
//   Record<
//     VoucherType,
//     Record<string, Record<string, DesignerConfig>>
//   >
// >;

// export const templateConfig: DesignerConfigMap = {
 
//   CP:{
//     STANDARD: {
//       standard: {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//     },
//     PREMIUM: {
//       premium: {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent:  <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//     },
//     UNIVERSAL: {
//       universal: {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//     },
//   },
//   PI:{
//       STANDARD: {
//       standard: {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//     },
//     PREMIUM: {
//       premium: {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent:  <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//       })},
//       },
//     },
//     UNIVERSAL: {
//       universal: {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//     },
//      SPREDSHEET:{
//        spreadsheet:{
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//     }
//     },

//     RETAIL: {
//       "retail-standard": {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//       "2inch": {
//         downloadComponent: <SharedDownloadTemplate />,
//         PreviewComponent: <SharedTemplatePreview />,
//         sections: {  table: () => TablePremiumDesigner<PrintDetailDto>({
//         tableState: []
//         })},
//       },
//     },

//   }
// };

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
  ADVICE: {
    advice: ["properties", "header",  "table", "footer", ],
  },
  CHEQUE: {
    cheque: ["properties", "header",  "table", "footer", ],
  },
  CUSTOMERBALANCE: {
    customerBalance: ["properties", "header", "footer", ],
  },
};


//acc-trance table columns


