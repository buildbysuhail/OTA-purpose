// import { View, Text,StyleSheet } from "@react-pdf/renderer";
// import { AccountTransactionProps } from ".";
// import { TemplateState } from "../../../Designer/interfaces";

// // const Table = ({ data, template }: AccountTransactionProps) => {
// //   const accTableState = template?.accTableState;

// //   /// Header
// //   const headerFontSize = accTableState?.headerFontSize || "#fff";
// //   const headerFontColor = accTableState?.headerFontColor || "#000";
// //   const headerBgColor = accTableState?.tableHeaderBgColor || "#fff";

// //   /// Items
// //   const ItemsfontSize = accTableState?.itemRowFontSize;
// //   const ItemsborderColor = accTableState?.tableBorderColor;
// //   const Itemscolor = accTableState?.itemRowFontColor || "#000";
// //   const ItemsBackgroundColor = accTableState?.itemRowBgColor || "#fff";
// //   return (
// //     <View>
// //       <View
// //         style={{
// //           backgroundColor: headerBgColor,
// //           color: headerFontColor,
// //           fontSize: headerFontSize,
// //           display: "flex",
// //           flexDirection: "row",
// //         }}
// //       >
// //         <View
// //           style={{
// //             flex: "1",
// //             height: "30px",
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             alignContent: "center",
// //             padding: "5pt",
// //           }}
// //         >
// //           <Text>#</Text>
// //         </View>
// //         <View
// //           style={{
// //             flex: "5",
// //             height: "30px",
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "flex-start",
// //             alignContent: "flex-start",
// //             padding: "5pt",
// //           }}
// //         >
// //           <Text>
// //             {/* {preference?.item || "Item"} & {preference?.description || "Description"} */}
// //           </Text>
// //         </View>
// //         <View
// //           style={{
// //             flex: "3",
// //             height: "30px",
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "flex-end",
// //             alignContent: "flex-end",
// //             padding: "5pt",
// //           }}
// //         >
// //           {/* <Text>{preference?.quantity || "Qty"}</Text> */}
// //         </View>
// //       </View>
// //       <View>
// //         {data?.items?.map((val: any, index: number) => (
// //           <View key={index} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around" }} wrap={false}>
// //             <View
// //               style={{
// //                 flex: "1",
// //                 height: "auto",
// //                 padding: "5pt",
// //                 display: "flex",
// //                 color: Itemscolor,
// //                 flexDirection: "row",
// //                 fontSize: ItemsfontSize,
// //                 justifyContent: "center",
// //                 borderColor: ItemsborderColor,
// //                 backgroundColor: ItemsBackgroundColor,
// //                 borderBottomWidth: accTableState?.showTableBorder ? "2px" : "0px",
// //               }}
// //             >
// //               <Text>{index + 1}</Text>
// //             </View>
// //             <View
// //               style={{
// //                 flex: "5",
// //                 padding: "5pt",
// //                 display: "flex",
// //                 color: Itemscolor,
// //                 flexDirection: "row",
// //                 fontSize: ItemsfontSize,
// //                 justifyContent: "flex-start",
// //                 borderColor: ItemsborderColor,
// //                 backgroundColor: ItemsBackgroundColor,
// //                 borderBottomWidth: accTableState?.showTableBorder ? "2px" : "0px",
// //               }}
// //             >
// //               <Text>{val?.item_name}</Text>
// //               <View />
// //               <Text style={{ color: "gray" }}>{val?.description}</Text>
// //             </View>
// //             <View
// //               style={{
// //                 flex: "3",
// //                 padding: "5pt",
// //                 display: "flex",
// //                 color: Itemscolor,
// //                 flexDirection: "row",
// //                 fontSize: ItemsfontSize,
// //                 justifyContent: "flex-end",
// //                 borderColor: ItemsborderColor,
// //                 backgroundColor: ItemsBackgroundColor,
// //                 borderBottomWidth: accTableState?.showTableBorder ? "2px" : "0px",
// //               }}
// //             >
// //               <Text> {val?.qty}</Text>
// //             </View>
// //           </View>
// //         ))}
// //       </View>
// //     </View>
// //   );
// // };

// // export default Table;



// const Table = ({ data, template,}: { data: any; template?: TemplateState}) => {
//   const accTableState = template?.accTableState;
//   const propertiesState = template?.propertiesState;

//   const labelStyles = {
//     fontWeight: propertiesState?.label_font_weight,
//     fontStyle: propertiesState?.label_font_style,
//     fontFamily:propertiesState?.font_family,
//   };
  

//   // Styles
//   const styles = StyleSheet.create({
//     table: {
//       width: "100%",
//       marginBottom: 10,
//     },
//     thead: {
//       backgroundColor: accTableState?.showTableHeaderBg ? accTableState?.tableHeaderBgColor : "#fff",
//       color: accTableState?.headerFontColor || "#000",
//       fontSize: accTableState?.headerFontSize || 12,
//       flexDirection: "row",
//       borderBottom: `0.5px solid ${accTableState?.showTableBorder ? accTableState?.tableBorderColor  :"#DFDFDF"}`,
//     },
//     th: {
//       padding: 4,
//       flex: 1,
//       textAlign: "center",
//     },
//     tbody: {
//       flexDirection: "column",
//     },
//     tr: {
//       flexDirection: "row",
//       borderBottom: `0.5px solid ${accTableState?.showTableBorder ? accTableState?.tableBorderColor  :""}`,
//       backgroundColor: accTableState?.showRowBg ? accTableState?.itemRowBgColor : "#fff",
//     },
//     td: {
//       padding: 4,
//       flex: 1,
//       textAlign: "center",
//       color: accTableState?.itemRowFontColor || "#000",
//       fontSize: accTableState?.itemRowFontSize || 12,
//       fontWeight:propertiesState?.font_weight,
//       // fontStyle:propertiesState?.label_font_color,
//       // fontFamily:propertiesState?.label_font_color,
//     },
   
//   });

//   return (
//     <View>
//       <View style={[styles.table,labelStyles]}>
//         {/* Table Header */}
//         <View style={styles.thead}>
//           {accTableState?.showLineItemNumber && <Text style={styles.th}>#</Text>}
//           {/* Invoice Number */}
//         {accTableState?.showInvoiceNumber && (
//           <Text style={[styles.th, { width: accTableState?.InvoiceNumberWidth }]}>
//             {accTableState?.InvoiceNumberLabel || "Invoice Number"}
//           </Text>
//         )}

//         {/* Invoice Date */}
//         {accTableState?.showInvoiceDate && (
//           <Text style={[styles.th, { width: accTableState?.InvoiceDateWidth }]}>
//             {accTableState?.InvoiceDateLabel || "Invoice Date"}
//           </Text>
//         )}

//         {/* Invoice Amount */}
//         {accTableState?.showInvoiceAmount && (
//           <Text style={[styles.th, { width: accTableState?.InvoiceAmountWidth }]}>
//             {accTableState?.InvoiceAmountLabel || "Invoice Amount"}
//           </Text>
//         )}

//         {/* Withholding Tax */}
//         {accTableState?.showWithholdingTax && (
//           <Text style={[styles.th, { width: accTableState?.WithholdingTaxWidth }]}>
//             {accTableState?.WithholdingTaxLabel || "Withholding Tax"}
//           </Text>
//         )}

//         {/* TCS Amount */}
//         {accTableState?.showTCSAmount && (
//           <Text style={[styles.th, { width: accTableState?.TCSAmountWidth }]}>
//             {accTableState?.TCSAmountLabel || "TCS Amount"}
//           </Text>
//         )}

//         {/* Payment Amount */}
//         {accTableState?.showPaymentAmount && (
//           <Text style={[styles.th, { width: accTableState?.PaymentAmountWidth }]}>
//             {accTableState?.PaymentAmountLabel || "Payment Amount"}
//           </Text>
//         )}
//         </View>

//         {/* Table Body */}
//         <View style={styles.tbody}>
//           {data?.details
//            ?.slice(0,2) 
//            ?.map((val: any, index: number) => (
//               <View key={`tbr${index}`} style={styles.tr}>
//                 {accTableState?.showLineItemNumber && (
//                   <Text style={{ ...styles.td, width: accTableState?.lineItemNumberWidth }}>
//                     {index + 1}
//                   </Text>
//                 )}
//                 {(accTableState?.showInvoiceNumber) && (
//                   <Text style={{ ...styles.td, width: accTableState?.InvoiceNumberWidth }}>
//                     INV-00{index + 1} 
//                   </Text>
//                 )}
//                 {accTableState?.showInvoiceDate && (
//                   <Text style={{ ...styles.td, width: accTableState?.InvoiceDateWidth }}>
//                     2024-01-{10 + index}
//                   </Text>
//                 )}
//                 {accTableState?.showInvoiceAmount && (
//                   <Text style={{ ...styles.td, width: accTableState?.InvoiceAmountWidth }}>
//                     {1000 + index * 500}.00 {/* Demo Invoice Amount */}
//                   </Text>
//                 )}
//                 {accTableState?.showWithholdingTax && (
//                   <Text style={{ ...styles.td, width: accTableState?.WithholdingTaxWidth }}>
//                      {50 + index * 10}.00 {/* Demo Withholding Tax */} 
//                   </Text>
//                 )}
//                 {accTableState?.showTCSAmount && (
//                   <Text style={{ ...styles.td, width: accTableState?.TCSAmountWidth }}>
//                     {20 + index * 5}.00 {/* Demo TCS Amount */}
//                   </Text>
//                 )}
//                 {accTableState?.showPaymentAmount && (
//                   <Text style={{ ...styles.td, width: accTableState?.PaymentAmountWidth }}>
//                   {800 + index * 200}.00 {/* Demo Payment Amount */}
//                   </Text>
//                 )}    
//               </View>
//             ))}
//         </View>

//       </View>
//     </View>
//   );
// };

// export default Table;