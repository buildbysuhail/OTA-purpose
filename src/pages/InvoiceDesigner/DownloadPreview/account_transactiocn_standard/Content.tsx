import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
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
  
  export const Content = ({ data, template, currentBranch, docIDKey, currency,indexNO = 0 }: { data: AccTransactionData; template?: TemplateState; currentBranch: any, docIDKey?: string; currency?: string;indexNO?:number }) => {
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
                  {data.master?.voucherNumber }
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
            <View style={{ display: "flex", flexDirection: "row",justifyContent:"flex-start" ,gap:5 ,width:"100%" }}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.paymentMode?`${headerState?.accountTransactionInfo?.paymentMode}`:"PAYMENT GIVEN TO"}:</Text>
              <View style={{ flex: 1,  borderBottom:"1px dotted rgb(38, 37, 37)"}}>
                <Text style={fontStyles}>
              {data.details[indexNO]?.ledgerName}
              </Text>
              </View>
            </View>
            <View style={{ width: "100%", borderBottom:"1px dotted rgb(38, 37, 37)" }} />
          </View>


             <View style={{ display: "flex", flexDirection: "row", justifyContent:"flex-start",gap:5, width:"100%", }}>
              <Text style={labelStyles}>the sum of rupees :</Text>
              <View style={{ flex: 1,  borderBottom:"1px dotted rgb(38, 37, 37)"}}>
                <Text style={fontStyles}>
                {getAmountInWords(Number(data.details[indexNO]?.amount), currency)}
              </Text>
              </View>
            </View>
          
          <View style={{ display: "flex", flexDirection: "row",gap:10, width:"100%",justifyContent:"flex-start",alignItems:"flex-start" }}>
           <View style={{ display: "flex", flexDirection: "row",gap:5, width:"100%",justifyContent:"flex-start" }}>
              <Text style={labelStyles}>by Cash/*Cheque/*DD No :</Text>
              <View style={{ flex: 1,  borderBottom:"1px dotted rgb(38, 37, 37)"}}>
              <Text style={fontStyles}>
                {(data?.master?.voucherType == VoucherType.CashPayment || data?.master?.voucherType == VoucherType.CashReceipt || data?.master?.voucherType == VoucherType.CashPaymentEstimate|| data?.master?.voucherType == VoucherType.CashReceiptEstimate)?"Cash":
                (data?.master?.voucherType == VoucherType.BankPayment || data?.master?.voucherType == VoucherType.BankReceipt || data?.master?.voucherType == VoucherType.BankReconciliation)?"Bank":"Cash" }
              </Text>
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row",gap:5, width:"100%",justifyContent:"flex-start"}}>
              <Text style={labelStyles}>towards :</Text>
              <View style={{ flex: 1,  borderBottom:"1px dotted rgb(38, 37, 37)"}}>
                <Text style={fontStyles}>
                
              </Text>
              </View>
            </View>
          </View>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start", width:"100%"}}>
  
           <View style={{display:"flex",flexDirection:"column",gap:2,
            
           }}>
            <View style={{display:"flex",flexDirection:"row",border:"2px solid rgb(38, 37, 37)",borderRadius:5,width:"100%",height:30}}>
              <View style={{width:"30%",backgroundColor:"rgb(38, 37, 37)"}}>
              <Text style={{color:"rgb(251, 250, 250)",fontSize:14,fontStyle:"italic",fontFamily:"RobotoMono",textAlign:"center",padding:2}}>Rs:</Text>
              </View>
              <View style={{flex:1,backgroundColor:"rgb(246, 245, 245)"}}>
              <Text style={{color:"rgb(61, 60, 60)",fontSize:14,fontStyle:"italic",fontFamily:"RobotoMono",textAlign:"center",padding:2}}>
               {data.details[indexNO]?.amount}
              </Text>
              </View>
            </View>
              <Text style={{color:"rgb(87, 86, 86)",fontSize:6,fontStyle:"italic",fontFamily:"RobotoMono"}}>*All Cheque/DD are subject to realisation</Text>
           </View>
           <View style={{alignSelf:"flex-end"}}>
            <Text style={labelStyles}>Reciver Name </Text>
            </View >
            <View style={{alignSelf:"flex-end"}}>
            <Text style={labelStyles}>Authorised Signatory</Text>
            </View>
        </View>

        </View>
        </View>
    );
  };
          