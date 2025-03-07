// import { View, Text, StyleSheet } from "@react-pdf/renderer";
// import { TemplateState } from "../../Designer/interfaces";

// // Helper function to get column styles based on width input
// const getColumnStyle = (widthSetting: any) => {
//   return (!widthSetting || widthSetting === "")
//     ? { width: "auto", flexGrow: 1 }
//     : { width: `${widthSetting}%`, flexGrow: 0 };
// };

// const Table = ({ data, template }: { data: any; template?: TemplateState }) => {
//   const adviceTableState = template?.adviceTableState;
//   const propertiesState = template?.propertiesState;

//   const labelStyles = {
//     fontWeight: propertiesState?.label_font_weight,
//     fontStyle: propertiesState?.label_font_style,
//     fontFamily: propertiesState?.font_family,
//   };

//   const styles = StyleSheet.create({
//     table: {
//       marginBottom: 10,
//     },
//     thead: {
//       backgroundColor: adviceTableState?.showTableHeaderBg
//         ? adviceTableState?.tableHeaderBgColor
//         : "#fff",
//       color: adviceTableState?.headerFontColor || "#000",
//       fontSize: adviceTableState?.headerFontSize || 12,
//       flexDirection: "row",
//       flexWrap: "nowrap",
//       borderBottom: `1px solid ${
//         adviceTableState?.showTableBorder ? adviceTableState?.tableBorderColor : ""
//       }`,
//     },
//     th: {
//       padding: 5,
//       textAlign: "center",
//       flexGrow: 1,
//     },
//     tbody: {
//       flexDirection: "column",
//     },
//     tr: {
//       flexDirection: "row",
//       flexWrap: "nowrap",
//       borderBottom: `1px solid ${
//         adviceTableState?.showTableBorder ? adviceTableState?.tableBorderColor : ""
//       }`,
//       backgroundColor: adviceTableState?.showRowBg
//         ? adviceTableState?.itemRowBgColor
//         : "#fff",
//     },
//     td: {
//       padding: 5,
//       textAlign: "center",
//       color: adviceTableState?.itemRowFontColor || "#000",
//       fontSize: adviceTableState?.itemRowFontSize || 12,
//       fontWeight: propertiesState?.font_weight,
//       flexGrow: 1,
//     },
//   });

//   return (
//     <View>
//       <View style={[styles.table, labelStyles]}>
//         {/* Table Header */}
//         <View
//           style={styles.thead}
//           {...(adviceTableState?.headerRepeatOnPage ? { fixed: true } : {})}
//         >
//           {adviceTableState?.showLineItemNumber && (
//             <Text style={[styles.th, getColumnStyle(adviceTableState?.lineItemNumberWidth)]}>
//               {adviceTableState?.lineItemNumberLabel || "Invoice Number"}
//             </Text>
//           )}
//           {adviceTableState?.showInvoiceDate && (
//             <Text style={[styles.th, getColumnStyle(adviceTableState?.InvoiceDateWidth)]}>
//               {adviceTableState?.InvoiceDateLabel || "Invoice Date"}
//             </Text>
//           )}
//           {adviceTableState?.showInvoiceAmount && (
//             <Text style={[styles.th, getColumnStyle(adviceTableState?.InvoiceAmountWidth)]}>
//               {adviceTableState?.InvoiceAmountLabel || "Invoice Amount"}
//             </Text>
//           )}
//           {adviceTableState?.showWithholdingTax && (
//             <Text style={[styles.th, getColumnStyle(adviceTableState?.WithholdingTaxWidth)]}>
//               {adviceTableState?.WithholdingTaxLabel || "Withholding Tax"}
//             </Text>
//           )}
//           {adviceTableState?.showTCSAmount && (
//             <Text style={[styles.th, getColumnStyle(adviceTableState?.TCSAmountWidth)]}>
//               {adviceTableState?.TCSAmountLabel || "TCS Amount"}
//             </Text>
//           )}
//           {adviceTableState?.showPaymentAmount && (
//             <Text style={[styles.th, getColumnStyle(adviceTableState?.PaymentAmountWidth)]}>
//               {adviceTableState?.PaymentAmountLabel || "Payment Amount"}
//             </Text>
//           )}
//         </View>

//         {/* Table Body */}
//         <View style={styles.tbody}>
//           {data?.details.map((val: any, index: number) => (
//             <View key={`tbr${index}`} style={styles.tr}>
//               {adviceTableState?.showLineItemNumber && (
//                 <Text style={[styles.td, getColumnStyle(adviceTableState?.lineItemNumberWidth)]}>
//                   INV-00{index + 1}
//                 </Text>
//               )}
//               {adviceTableState?.showInvoiceDate && (
//                 <Text style={[styles.td, getColumnStyle(adviceTableState?.InvoiceDateWidth)]}>
//                   2024-01-{10 + index}
//                 </Text>
//               )}
//               {adviceTableState?.showInvoiceAmount && (
//                 <Text style={[styles.td, getColumnStyle(adviceTableState?.InvoiceAmountWidth)]}>
//                   {1000 + index * 500}.00
//                 </Text>
//               )}
//               {adviceTableState?.showWithholdingTax && (
//                 <Text style={[styles.td, getColumnStyle(adviceTableState?.WithholdingTaxWidth)]}>
//                   {50 + index * 10}.00
//                 </Text>
//               )}
//               {adviceTableState?.showTCSAmount && (
//                 <Text style={[styles.td, getColumnStyle(adviceTableState?.TCSAmountWidth)]}>
//                   {20 + index * 5}.00
//                 </Text>
//               )}
//               {adviceTableState?.showPaymentAmount && (
//                 <Text style={[styles.td, getColumnStyle(adviceTableState?.PaymentAmountWidth)]}>
//                   {800 + index * 200}.00
//                 </Text>
//               )}
//             </View>
//           ))}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Table;
