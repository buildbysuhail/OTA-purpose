// import { View, Text, StyleSheet } from "@react-pdf/renderer";
// import type { TemplateState } from "../../../Designer/interfaces";
// import type { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

// const Table = ({ data, template }: { data: any; template?: TemplateState<unknown> }) => {
//   const accTableState = template?.accTableState;
//   const propertiesState = template?.propertiesState;

//   // Default column width (in percentage) if not specified
//   const DEFAULT_COLUMN_WIDTH = "10%";

//   const labelStyles = {
//     fontWeight: propertiesState?.label_font_weight ,
//     fontStyle: propertiesState?.label_font_style ,
//     fontFamily: propertiesState?.font_family ,
//   };
//   const normalizeWidth = (widthVal: string | number): string => {
//     const w = widthVal.toString().trim();
//     if (w.endsWith("%") || w.endsWith("pt")) {
//       return w;
//     }
//     return `${w}pt`;
//   };
//   // Styles
//   const styles = StyleSheet.create({
//     table: {
//       width: "100%",
//       display: "flex",
//       marginBottom: 10,
//       marginTop: 10,
//       borderTop: accTableState?.showTableRowBorder
//         ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
//         : "none",
//       borderBottom: accTableState?.showTableRowBorder
//         ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
//         : "none",
//       borderLeft: accTableState?.showTableColBorder
//         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//         : "none",
//       borderRight: accTableState?.showTableColBorder
//         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//         : "none",
//     },
//     thead: {
//       backgroundColor: accTableState?.showTableHeaderBg
//         ? accTableState?.tableHeaderBgColor
//         : "#fff",
//       color: accTableState?.headerFontColor || "#000",
//       fontSize: accTableState?.headerFontSize || 12,
//       flexDirection: "row",
//       borderBottom: accTableState?.showTableRowBorder
//         ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
//         : "none",
//     },
//     th: {
//     padding: 4,
//     textAlign: "center",
//     // display: "flex",
//     // flexDirection: "column",
//     // justifyContent: "center",
//     // flexWrap: "wrap", 
//     },
//     tbody: {
//       flexDirection: "column",
//     },
//     tr: {
//       flexDirection: "row",
//       color: accTableState?.itemRowFontColor || "#000",
//       fontSize: accTableState?.itemRowFontSize   || 12,
//       borderBottom: accTableState?.showTableRowBorder
//         ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
//         : "none",
//       backgroundColor: accTableState?.showRowBg
//         ? accTableState?.itemRowBgColor
//         : "#fff",
//     },
//     td: {
//      padding: 4,
//     textAlign: "center",     // allow body text to wrap
   
//     },
//     cellText: {
//       // ...labelStyles,
//       // wordWrap: "break-word",
//       // overflowWrap: "break-word",
//       // hyphens: "auto",
//     },
//   });

//   // Function to get the total number of visible columns
//   const getVisibleColumnsCount = () => {
//     let count = 0;
//     if (accTableState?.showLineItemNumber) count++;
//     if (accTableState?.showLedgerCode) count++;
//     if (accTableState?.showLedger) count++;
//     if (accTableState?.showAmount) count++;
//     if (accTableState?.showNarration) count++;
//     if (accTableState?.showBillwiseDetails) count++;
//     if (accTableState?.showDiscount) count++;
//     if (accTableState?.showCostCenter) count++;
//     if (accTableState?.showAmountFc) count++;
//     if (accTableState?.showBankCharge) count++;
//     return count;
//   };

//   // Helper function to create cell style with proper width constraints
// const getCellStyle = (baseStyle: any, width: string | number) => {
//     const w = normalizeWidth(width);
//     return {
//       ...baseStyle,
//       width: w,
//       minWidth: w,
//       maxWidth: w,
//     };
//   };

//   // Function to Render the Table Header
//   const renderHeader = () => {
//     const visibleColumns = getVisibleColumnsCount();
//     let columnIndex = 0;

//     return (
//       <View style={styles.thead} fixed={accTableState?.headerRepeatOnPage}>
//         {accTableState?.showLineItemNumber && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.lineItemNumberWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.lineItemNumberLabel || "SiNo"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showLineItemNumber && (columnIndex += 1)}
//         {accTableState?.showLedgerCode && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.ledgerCodeWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.ledgerCodeLabel || "Ledger code"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showLedgerCode && (columnIndex += 1)}
//         {accTableState?.showLedger && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.ledgerWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.ledgerLabel || "Ledger"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showLedger && (columnIndex += 1)}
//         {accTableState?.showAmount && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.amountWidth  || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.amountLabel || "Amount"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showAmount && (columnIndex += 1)}
//         {accTableState?.showNarration && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.narrationWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.narrationLabel || "Narration"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showNarration && (columnIndex += 1)}
//         {accTableState?.showBillwiseDetails && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.billwiseDetailsWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.billwiseDetailsLabel || "Bill wise details"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showBillwiseDetails && (columnIndex += 1)}
//         {accTableState?.showDiscount && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.discountWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.discountLabel || "Discount"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showDiscount && (columnIndex += 1)}
//         {accTableState?.showCostCenter && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.costCenterWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.costCenterLabel || "Cost Center"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showCostCenter && (columnIndex += 1)}
//         {accTableState?.showAmountFc && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.amountFcWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.amountFcLabel || "AmountFc"}
//             </Text>
//           </View>
//         )}
//         {accTableState?.showAmountFc && (columnIndex += 1)}
//         {accTableState?.showBankCharge && (
//           <View
//             style={{
//               ...getCellStyle(styles.th, accTableState?.bankChargeWidth || DEFAULT_COLUMN_WIDTH),
//               borderRight:
//                 accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                   ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                   : "none",
//             }}
//           >
//             <Text style={styles.cellText}>
//               {accTableState?.bankChargeLabel || "Bank Charge"}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   // Calculate how many rows we actually have
//   const rowCount = data?.details?.length || 0;
//   const visibleColumns = getVisibleColumnsCount();

//   return (
//     <View style={[styles.table,labelStyles]} wrap>
//       {/* Table Header */}
//       {renderHeader()}

//       {/* Table Body */}
//       <View style={styles.tbody}>
//         {data?.details?.map((item: AccTransactionRow, index: number) => {
//           let columnIndex = 0;
//           return (
//             <View
//               key={`tbr${index}`}
//               style={[
//                 styles.tr,
//                 index + 1 === rowCount && accTableState?.showTableRowBorder
//                   ? { borderBottom: "none" }
//                   : {},
//               ]}
          
//             >
//               {accTableState?.showLineItemNumber && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.lineItemNumberWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.slNo}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showLineItemNumber && (columnIndex += 1)}
//               {accTableState?.showLedgerCode && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.ledgerCodeWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.ledgerCode}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showLedgerCode && (columnIndex += 1)}
//               {accTableState?.showLedger && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.ledgerWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.ledgerName}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showLedger && (columnIndex += 1)}
//               {accTableState?.showAmount && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.amountWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {`${item.amount || ""}5142543`}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showAmount && (columnIndex += 1)}
//               {accTableState?.showNarration && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.narrationWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.narration || (50 + index * 10).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showNarration && (columnIndex += 1)}
//               {accTableState?.showBillwiseDetails && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.billwiseDetailsWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.billwiseDetails || (20 + index * 5).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showBillwiseDetails && (columnIndex += 1)}
//               {accTableState?.showDiscount && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.discountWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.discount || (800 + index * 200).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showDiscount && (columnIndex += 1)}
//               {accTableState?.showCostCenter && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.costCenterWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {(800 + index * 200).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showCostCenter && (columnIndex += 1)}
//               {accTableState?.showAmountFc && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.amountFcWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {(800 + index * 200).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//               {accTableState?.showAmountFc && (columnIndex += 1)}
//               {accTableState?.showBankCharge && (
//                 <View
//                   style={{
//                     ...getCellStyle(styles.th, accTableState?.bankChargeWidth || DEFAULT_COLUMN_WIDTH),
//                     borderRight:
//                       accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
//                         ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
//                         : "none",
//                   }}
//                 >
//                   <Text style={styles.cellText}>
//                     {item.bankCharge || (800 + index * 200).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default Table;