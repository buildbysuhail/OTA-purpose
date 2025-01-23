import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
import { AccountTransactionProps } from ".";
import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { TemplateState } from "../../Designer/interfaces";
import { IndianRupee } from 'lucide-react';
import { AccTransactionData } from "../../../accounts/transactions/acc-transaction-types";
import VoucherType from "../../../../enums/voucher-types";

const styles = StyleSheet.create({

    bgImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -10,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      display: "flex",
      flexDirection: "column",
      gap:20,
      width: "100%",
      flexWrap: "wrap",   
    },
    VoucherInfo: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:"space-between", 
      width: "100%",
    },
    dottedBorder: {
      borderBottom: "1px dotted rgb(38, 37, 37)",
    },
 
  });
  
  export const Content = ({ data, template, currentBranch, docIDKey, currency }: { data: AccTransactionData; template?: TemplateState; currentBranch: any, docIDKey?: string; currency?: string; }) => {
    const headerState = template?.headerState;
    const fontFamily = template?.propertiesState?.font_family || "Roboto";
    const fontSize = template?.propertiesState?.font_size || 12;
    const color = template?.propertiesState?.font_color || "#000";
    const fontWeight = template?.propertiesState?.font_weight || 400;
    const fontStyle = template?.propertiesState?.fontStyle || "normal";
  
    const labelFontSize = template?.propertiesState?.label_font_size || 12;
    const labelColor = template?.propertiesState?.label_font_color || "#000";
    const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
    const labelFontStyle = template?.propertiesState?.label_font_style || "normal";
  
    const labelStyles = {
      color: labelColor,
      fontSize: labelFontSize,
      fontWeight: labelFontWeight,
      fontStyle: labelFontStyle,
      fontFamily,
    };
  
    const fontStyles = {
      color,
      fontSize,
      fontWeight,
      fontStyle,
      fontFamily,
    };
  
    return (
      
     <View style={{
      width:"100%",
      backgroundColor:  template?.propertiesState?.bg_color|| "#fff",
      position: 'relative',
      borderBottom:"1px solid rgb(104, 101, 101)",
      zIndex:10
      }}>
        {/* bgImage */}
        {template?.background_image && (
          <Image
            src={template?.background_image}
            style={[
              styles.bgImage,
              { objectPosition: headerState?.bg_image_header_position || 'center' }
            ]}
          />
        )}

      
        <View style={styles.content}>
            {/* date & No */}
          <View style={styles.VoucherInfo}>
            
              <View style={{
                display: "flex", flexDirection: "row",gap:2,
              }}>
                <Text style={labelStyles}>{headerState?.numberField?`${headerState?.numberField} :`:"No :"}</Text>
                <Text style={[fontStyles, styles.dottedBorder,{width:50}]}>
                  {data.master?.voucherNumber || 1}
                </Text>
              </View>
           
    
            
             <View style={{
                display: "flex", flexDirection: "row",gap:2,
              }}>
                <Text style={labelStyles}>{headerState?.accountTransactionInfo?.dateField?`${headerState?.accountTransactionInfo?.dateField} :`:"Date :"}</Text>
                <Text style={[fontStyles, styles.dottedBorder]}>
                  {dateTrimmer(data.master?.transactionDate)}
                </Text>
              </View>
            
          </View>
            {/* Payment Details */}
     
       
            <View style={{ display: "flex", flexDirection: "column",gap:30, width:"100%" }}>
            <View style={{ display: "flex", flexDirection: "row",alignContent:"flex-start" ,gap:5 ,width:"100%" }}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.paymentMode?`${headerState?.accountTransactionInfo?.paymentMode} :`:"PAYMENT GIVEN TO :"}</Text>
              <Text style={[fontStyles, { borderBottom:"1px dotted rgb(38, 37, 37)",width:"80%"}]}>
                {(data?.master?.voucherType == VoucherType.CashPayment || data?.master?.voucherType == VoucherType.CashReceipt || data?.master?.voucherType == VoucherType.CashPaymentEstimate|| data?.master?.voucherType == VoucherType.CashReceiptEstimate)?"Cash":
                (data?.master?.voucherType == VoucherType.BankPayment || data?.master?.voucherType == VoucherType.BankReceipt || data?.master?.voucherType == VoucherType.BankReconciliation)?"Bank":"Cash" }
              </Text>
            </View>
            <View style={{ width: "100%", borderBottom:"1px dotted rgb(38, 37, 37)" }} />
        </View>
     

            <View style={{ display: "flex", flexDirection: "row", alignContent:"flex-start",gap:5, width:"100%", }}>
              <Text style={labelStyles}>the sum of rupees :</Text>
              <Text style={[fontStyles, { borderBottom:"1px dotted rgb(38, 37, 37)",width:"80%"}]}>
                {getAmountInWords(Number(data.master?.totalDebit), currency)}
              </Text>
            </View>
          
          <View style={{ display: "flex", flexDirection: "row",gap:10, width:"100%",justifyContent:"flex-start",alignItems:"flex-start" }}>
           <View style={{ display: "flex", flexDirection: "row", alignContent:"flex-start",gap:5, width:"100%"  }}>
              <Text style={labelStyles}>by Cash/*Cheque/*DD No :</Text>
              <Text style={[fontStyles, { borderBottom:"1px dotted rgb(38, 37, 37)",width:120}]}>
                
              </Text>
            </View>

            <View style={{ display: "flex", flexDirection: "row", alignContent:"flex-start",gap:5, width:"100%"  }}>
              <Text style={labelStyles}>towards :</Text>
              <Text style={[fontStyles, { borderBottom:"1px dotted rgb(38, 37, 37)",width:200}]}>
                
              </Text>
            </View>
          </View>

        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between", width:"100%"}}>
           <View style={{display:"flex",flexDirection:"column",gap:2,flexBasis: "33.33%",
            justifyContent:"flex-start", alignItems:"flex-start",
           }}>
                <View style={{display:"flex",flexDirection:"row",border:"2px solid rgb(38, 37, 37)",borderRadius:5,width:"100%",height:30}}>
                <View style={{width:"30%",backgroundColor:"rgb(38, 37, 37)"}}>
                <Text style={{color:"rgb(251, 250, 250)",fontSize:20,fontStyle:"italic",fontFamily:fontFamily,textAlign:"center"}}>Rs:</Text>
                </View>
                <View style={{width:"70%",backgroundColor:"rgb(246, 245, 245)"}}/>
                </View>
                <Text style={{color:"rgb(87, 86, 86)",fontSize:6,fontStyle:"italic",fontFamily:fontFamily}}>*All Cheque/DD are subject to realisation</Text>
           </View>
           <View style={{flexBasis: "33.33%", display: "flex", justifyContent: "flex-end",alignItems:"flex-end" }}>
            <Text style={labelStyles}>Reciver Name </Text>
            </View>
            <View style={{flexBasis: "33.33%", display: "flex", justifyContent: "flex-end",alignItems:"flex-end" }}>
            <Text style={labelStyles}>Authorised Signatory</Text>
            </View>
        </View>

        </View>
        </View>
    );
  };
          {/* {headerState?.showNumberField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%"}}>
              <Text style={labelStyles}>{headerState?.numberField || "Payment#"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data.master?.voucherNumber}
              </Text>
            </View>
          )}

          {headerState?.accountTransactionInfo?.showDateField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.dateField  || "Payment Date"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data.master?.date || "12/5/2024"}
                {dateTrimmer(data.master?.transactionDate)}
              </Text>
            </View>
          )}

          {headerState?.accountTransactionInfo?.showReferenceField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" , width:"100%"}}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.referenceField || "Reference Number"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data?.master.referenceNumber }
              </Text>
            </View>
          )}

          {headerState?.accountTransactionInfo?.showPaymentMode && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.paymentMode || "Payment Mode"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {(data?.master?.voucherType == VoucherType.CashPayment || data?.master?.voucherType == VoucherType.CashReceipt || data?.master?.voucherType == VoucherType.CashPaymentEstimate|| data?.master?.voucherType == VoucherType.CashReceiptEstimate)?"Cash":
                (data?.master?.voucherType == VoucherType.BankPayment || data?.master?.voucherType == VoucherType.BankReceipt || data?.master?.voucherType == VoucherType.BankReconciliation)?"Bank":"" }
               
              </Text>
            </View>
          )}

         
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>Sample Tax1(4.70%)</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                $11.75
               
              </Text>
            </View>
                 
          
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>Sample Tax2(7.00%)</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                $21.75
               
              </Text>
            </View>
        
          
          {headerState?.accountTransactionInfo?.showAmountInWords && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>Amount In Words</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {getAmountInWords(Number(data.master?.totalDebit), currency)}
              </Text>
            </View>
          )} */}
          
         
   

        {/* <View style={[styles.amountReceived,
        {backgroundColor:headerState?.accountTransactionInfo?.amtReceivedBgColor??"#65a30d",
         color:headerState?.accountTransactionInfo?.amtReceivedFontColor??"#ffffff",
         fontWeight: "medium",
        }]}>
          <Text style={{fontSize:14}}>{headerState?.accountTransactionInfo?.amtReceivedLabel ||"Amount Received"}</Text>

          <Text style={{ fontSize: headerState?.accountTransactionInfo?.amtReceivedFontSize ?? 14 }}>
            {headerState?.accountTransactionInfo?.currencySymbolPosition === 'before' ? "INR" : ""} {data.master?.totalDebit} {headerState?.accountTransactionInfo?.currencySymbolPosition === 'after' ? "INR" : ""}
         </Text>

        </View> */}
     
    
   

      {/* Bill To and Signature */}
      {/* <View style={[styles.companyInfo, { marginVertical: 20 }]}>
        <View style={{display:"flex",flexDirection:"column",gap:1}}>
         {headerState?.showReceivedFrom && (
            <View>
              <Text style={labelStyles}>{headerState?.receivedFromLabel ?? "Received From"}</Text>  
            </View>
         )}   
        {headerState?.hasBillTo && (
          <View style={styles.billTo}>
            <Text style={labelStyles}>{headerState?.billTo ?? "Bill T0"}</Text>
            <Text style={{
              ...fontStyles,
               color: custNameFontColor, fontSize: custNameFontSize 
               }}>
                "Nizam Karippali"
            </Text>
            <Text style={fontStyles}>Dubai</Text>
            <Text style={fontStyles}>Karama 123ft</Text>
            <Text style={fontStyles}>Ho No:1223</Text>
            {headerState?.hasShipTo && (
            <>
                <Text style={labelStyles}>{headerState?.billTo ?? "BillTo"}</Text>
                <Text style={fontStyles}>Ho No:1223</Text>
            </>      
            )}
          </View>
        )}
        </View>
      
        {footerState?.showSignature && (
          <View style={styles.signature}>
            <Text style={fontStyles}>{footerState?.signatureLabel ?? "Authority Signature"}</Text>
            <View style={{ width: "100%", borderBottom: "0.5px solid #DFDFDF", display: "flex", justifyContent: "flex-end" }}>
            {headerState?.showLogo && (
              <Image
                src={currentBranch?.logo}
                style={[styles.logo, { width: 80 * logoWidthRatio, alignSelf: "flex-end" }]}
              />
            )}
          </View>
            
          </View>
        )}
      </View> */}

      {/* Notes */}
      {/* {template?.footerState?.showNotesLabel && (
        <View style={[styles.notes,]}>
          <Text style={labelStyles}>{template?.footerState?.notesLabel || "Notes"}</Text>
          <Text style={{ ...fontStyles, fontSize: template?.footerState?.noteFontSize }}>
            {data?.master?.notes ?? "Payment has been received by cash"}
          </Text>
        </View>
      )} */}
      {/* Refund */}
       {/* <View style={{ width: "100%", borderTop: "0.5px solid #DFDFDF", marginVertical: 10 }} />
       <View style={styles.payment} >
       
          <View style={[styles.paymentCol]}>
          <Text style={labelStyles}>{template?.headerState?.accountTransactionInfo?.paymentRefund || "Payment Refund"}</Text>
          <Text style={fontStyles}>
            {data?.master?.paymentRefund ?? "5.00$"}
          </Text>
         </View>
   

       {template?.headerState?.accountTransactionInfo?.showOverPayment &&(
         <View style={[styles.paymentCol,{borderLeft:"0.5px solid #DFDFDF"}]}>
         <Text style={labelStyles}>{template?.headerState?.accountTransactionInfo?.overPayment || "Over Payment"}</Text>
         <Text style={fontStyles}>
           {data?.master?.overPayment ?? "15.00$"}
         </Text>
        </View>
       )}
     
       </View>
       <View style={{ width: "100%", borderTop: "0.5px solid #DFDFDF", marginVertical: 10 }} /> */}



