// import { Document, Page, View, Text, StyleSheet, Font, Image } from "@react-pdf/renderer";
// import { TemplateGroupTypes } from "../InvoiceDesigner/constants/TemplateCategories";
// import { TemplateState } from "../InvoiceDesigner/Designer/interfaces";
// import BottomPreview from "../InvoiceDesigner/DownloadPreview/StandardPreview/FooterPreview";
// import ItemTablePreview from "../InvoiceDesigner/DownloadPreview/StandardPreview/ItemTablePreview";
// import TotalSummaryPreview from "../InvoiceDesigner/DownloadPreview/StandardPreview/TotalSummaryPreview";

// export interface DownloadPreviewProps {
//   data: any;
//   docTitle?: any;
//   docIDKey?: string;
//   currencySymbol?: string;
//   template?: TemplateState;
//   templateGroupId?: TemplateGroupTypes;
//   templateImages?: any;
//   currentBranch?: any;
// }

// type TemplatePageSizes = "A4" | "A5" | "LETTER" | { width: string | number; height?: string | number };

// // Font.register({ family: 'Roboto', src: source });

// const DownloadStandardPreview = ({
//   data,
//   template,
//   docIDKey,
//   docTitle,
//   currencySymbol,
//   templateGroupId,
//   templateImages
// }: DownloadPreviewProps) => {

//   const backgroundColor = template?.propertiesState?.bg_color || "#fff";
//   const topBackgroundColor = template?.headerState?.bgColor || "#fff";
//   const bottomBackgroundColor = template?.footerState?.bg_color || "#fff";

//   const footerFontColor = template?.footerState?.footerFontColor || "#000";

//   /// Padings
//   const paddingLeft = template?.propertiesState?.margins?.left;
//   const paddingRight = template?.propertiesState?.margins?.right;

//   // Selection of paper size from the template

//   let paperSize = (template?.propertiesState?.pageSize as TemplatePageSizes) || "A4";
//   if (template?.propertiesState?.pageSize === "3Inch") {
//     paperSize = {
//       width: 3 * 72, // 3 inches in points
//     };
//   } else if (template?.propertiesState?.pageSize === "4Inch") {
//     paperSize = {
//       width: 4 * 72, // 4 inches in points
//     };
//   }

//   // Styling

//   const styles = StyleSheet.create({
//     headerFooterStyle: {
//       fontSize: 12,
//       fontWeight: 500,
//       display: "flex",
//       paddingLeft,
//       paddingRight,
//       width: "100%",
//       height: "50px",
//     },
//   });

//   const templateFont = ["borel", "Poppins"].includes(template?.propertiesState?.font!) ? "Helvetica" : template?.propertiesState?.font

//   return (
//     <Document>
//       <Page size={paperSize} orientation="portrait" style={{ backgroundColor, fontFamily: templateFont }} wrap>
        
//         {/*   */}
//         <View style={{ backgroundColor }}>
//           <TotalSummaryPreview
//             data={data}
//             template={template}
//             taxInfo={taxInfo}
//             currencySymbol={currencySymbol}
//             templateGroupId={templateGroupId}
//             totalAmountInwords={totalAmountInwords}
//           />
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default DownloadStandardPreview;
