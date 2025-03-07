// import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
// import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
// import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
// import { TemplateState } from "../../Designer/interfaces";
// import { IndianRupee } from 'lucide-react';
// import { AccTransactionData } from "../../../accounts/transactions/acc-transaction-types";
// import VoucherType from "../../../../enums/voucher-types";

// const styles = StyleSheet.create({

//     content: {
//       paddingVertical: 20,
//       display: "flex",
//       flexDirection: "column",
//       gap:20,
//       width: "100%",
//       flexWrap: "wrap",   
//     },
//     VoucherInfo: {
//       display: "flex",
//       flexDirection: "row",
//       justifyContent:"space-between", 
//       width: "100%",
//     },
//     customer: {
//       display: "flex",
//       flexDirection: "row",
//       justifyContent:"flex-start",
//       gap:2
//     },
//     customerInfo: {
//       display: "flex",
//       flexDirection: "column",
//       flexBasis:"60%"
//     },
 
//   });
  
//   export const Content = ({ data, template, currentBranch, docIDKey, currency }: { data: AccTransactionData; template?: TemplateState; currentBranch: any, docIDKey?: string; currency?: string; }) => {
//     const headerState = template?.headerState;
//     const fontFamily = template?.propertiesState?.font_family || "Roboto";
//     const fontSize = template?.propertiesState?.font_size || 12;
//     const color = template?.propertiesState?.font_color || "#000";
//     const fontWeight = template?.propertiesState?.font_weight || 400;
//     const fontStyle = template?.propertiesState?.fontStyle || "normal";
  
//     const labelFontSize = template?.propertiesState?.label_font_size || 12;
//     const labelColor = template?.propertiesState?.label_font_color || "#000";
//     const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
//     const labelFontStyle = template?.propertiesState?.label_font_style || "normal";

//     const custNameFontColor = headerState?.customerNameFontColor;
//     const custNameFontSize = headerState?.customerNameFontSize || 12;
//     const labelStyles = {
//       color: labelColor,
//       fontSize: labelFontSize,
//       fontWeight: labelFontWeight,
//       fontStyle: labelFontStyle,
//       fontFamily,
//     };
  
//     const fontStyles = {
//       color,
//       fontSize,
//       fontWeight,
//       fontStyle,
//       fontFamily,
//     };
  
//     return (
      
//      <View style={{
//       width:"100%",
//       backgroundColor:  template?.propertiesState?.bg_color|| "#fff",
//       position: 'relative',
//       zIndex:10
//       }}>
      
//         <View style={styles.content}>
//             {/* date & No */}
//           <View style={styles.VoucherInfo}>
//               <View style={{
//                 display: "flex", flexDirection: "column",gap:2,border:2,borderColor:"rgb(104, 101, 101)",borderStyle:"solid",padding:10,width:"50%"
//               }} wrap>
//                   {/* {headerState?.showReceivedFrom && (
//                           <View>
//                             <Text style={labelStyles}>{headerState?.receivedFromLabel ?? "Received From"}</Text>
//                           </View>
//                         )} */}
                      
//                             <Text style={{
//                               ...fontStyles,
//                               color: custNameFontColor, fontSize: custNameFontSize
//                             }}>
//                               "Nizam Karippali "
//                             </Text>

//                             {headerState?.hasBillTo && (
//                               <View style={styles.customer}>
//                              <View style={{flexBasis:"30%"}}>
//                              <Text style={labelStyles}>{`${headerState?.billTo ?? "Bill T0"}` }</Text>
//                              </View>
//                              <View style={{flexBasis:"10%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                              </View>
//                                 <View style={styles.customerInfo}>
//                                   <Text style={fontStyles}>Dubai</Text>
//                                   <Text style={fontStyles}>Karama 123ft</Text>
//                                   <Text style={fontStyles}>Ho No:1223</Text>
//                                 </View>
                              
//                               </View>
//                             )} 

//                         {headerState?.hasShipTo && (
//                         <>
//                           <View style={styles.customer}>
//                           <View style={{flexBasis:"30%"}}>
//                           <Text style={labelStyles}>{`${headerState?.shipTo ??  "Ship To"}` }</Text>
//                              </View>
//                              <View style={{flexBasis:"10%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                              </View>
                                
                           
//                                 <View style={styles.customerInfo}>
//                                   <Text style={fontStyles}>Dubai</Text>
//                                   <Text style={fontStyles}>Karama 123ft</Text>
                                
//                                 </View>
                              
//                               </View>
                       

//                         </>
//                       )}
                           
               
//               </View>
           
    
            
//               <View style={{
//                 display: "flex", flexDirection: "column",gap:2,border:2,borderColor:"rgb(104, 101, 101)",borderStyle:"solid",paddingLeft:5,paddingTop:5,width:"40%"
//               }} wrap>

//                   {headerState?.adviceTransInfo?.showDateField && (
//                    <View style={styles.customer}>
//                      <View style={{flexBasis:"50%"}}>
//                           <Text style={labelStyles}>{headerState?.adviceTransInfo?.dateField || "Payment Date"}</Text>
//                       </View>
//                       <View style={{flexBasis:"5%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                       </View>
//                       <View style={{...styles.customerInfo,flexBasis:"45%"}}>
//                       <Text style={fontStyles}>
//                         {/* {data.master?.date || "12/5/2024"} */}
//                         {dateTrimmer(data.master?.transactionDate)}
//                       </Text>
//                       </View>
//                     </View>
//                   )}

//     {headerState?.adviceTransInfo?.showReferenceField && (
//                    <View style={styles.customer}>
//                      <View style={{flexBasis:"50%"}}>
//                           <Text style={labelStyles}>{headerState?.adviceTransInfo?.referenceField || "Reference No"}</Text>
//                       </View>
//                       <View style={{flexBasis:"5%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                       </View>
//                       <View style={{...styles.customerInfo,flexBasis:"45%"}}>
//                       <Text style={fontStyles}>
//                         {/* {data.master?.date || "12/5/2024"} */}
//                         {dateTrimmer(data.master?.transactionDate)}
//                       </Text>
//                       </View>
//                     </View>
//                   )}
// {headerState?.adviceTransInfo?.showPaymentAmount && (
//                    <View style={styles.customer}>
//                      <View style={{flexBasis:"50%"}}>
//                           <Text style={labelStyles}>{headerState?.adviceTransInfo?.paymentAmount || "Payment Amount"}</Text>
//                       </View>
//                       <View style={{flexBasis:"5%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                       </View>
//                       <View style={{...styles.customerInfo,flexBasis:"45%"}}>
//                       <Text style={fontStyles}>
//                         {/* {data.master?.date || "12/5/2024"} */}
//                         {dateTrimmer(data.master?.transactionDate)}
//                       </Text>
//                       </View>
//                     </View>
//                   )}
// {headerState?.adviceTransInfo?.showPaymentMode && (
//                    <View style={styles.customer}>
//                      <View style={{flexBasis:"50%"}}>
//                           <Text style={labelStyles}>{headerState?.adviceTransInfo?.paymentMode || "Payment Method"}</Text>
//                       </View>
//                       <View style={{flexBasis:"5%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                       </View>
//                       <View style={{...styles.customerInfo,flexBasis:"45%"}}>
//                       <Text style={fontStyles}>
//                         {/* {data.master?.date || "12/5/2024"} */}
//                         {dateTrimmer(data.master?.transactionDate)}
//                       </Text>
//                       </View>
//                     </View>
//                   )}


// {headerState?.adviceTransInfo?.showBank && (
//                    <View style={styles.customer}>
//                      <View style={{flexBasis:"50%"}}>
//                           <Text style={labelStyles}>{headerState?.adviceTransInfo?.bank || "Bank"}</Text>
//                       </View>
//                       <View style={{flexBasis:"5%"}}>
//                              <Text style={labelStyles}>{`:` }</Text>
//                       </View>
//                       <View style={{...styles.customerInfo,flexBasis:"45%"}}>
//                       <Text style={fontStyles}>
//                         {/* {data.master?.date || "12/5/2024"} */}
//                         {dateTrimmer(data.master?.transactionDate)}
//                       </Text>
//                       </View>
//                     </View>
//                   )}

//               </View>
            
//              </View>
//             {/* Payment Details */}
          
//        <View>
//        <Text style={labelStyles}>Dear Sir,</Text>
    
//         <Text style={fontStyles}>
//           We have cleared the below invoices with document number 3
//         </Text>
//         </View> 
     
      
          
//         </View>
//         </View>
//     );
//   };
          