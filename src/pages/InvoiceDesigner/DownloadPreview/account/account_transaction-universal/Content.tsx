import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
import { dateTrimmer, getAmountInWords } from "../../../../../utilities/Utils";
import useCurrentBranch from "../../../../../utilities/hooks/use-current-branch";
import { TemplateState } from "../../../Designer/interfaces";
import { IndianRupee } from 'lucide-react';
import { AccTransactionData } from "../../../../accounts/transactions/acc-transaction-types";
import VoucherType from "../../../../../enums/voucher-types";

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
      justifyContent:"space-between", 
      width: "100%",
    },
    docTitle:{
      fontSize: 18,
      fontWeight: "medium",
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
            <Text style={[styles.docTitle, { color: headerState?.docTitleFontColor, fontSize: headerState?.docTitleFontSize, fontFamily: fontFamily,textAlign:"center" }]}>
                {headerState?.docTitle || "CASH RECEIPT VOUCHER"}
             </Text>
            {/* date & No */}
          <View style={styles.VoucherInfo}>
          <View style={{ display: "flex", flexDirection: "column",gap:10,}}>
              <View style={{
                display: "flex", flexDirection: "row",gap:2,
              }}>
                <Text style={labelStyles}>{headerState?.numberField?`${headerState?.numberField} :`:"No :"}</Text>
                <Text style={fontStyles}>
                  {data.master?.voucherNumber || 1}
                </Text>
              </View>

              <View style={{
                display: "flex", flexDirection: "row",gap:2,
              }}>
                  <Text style={labelStyles}>{headerState?.accountTransactionInfo?.dateField?`${headerState?.accountTransactionInfo?.dateField} :`:"Date :"}</Text>
                <Text style={fontStyles}>
                 {dateTrimmer(data.master?.transactionDate)}
                </Text>
              </View>
          </View>
    
            
             <View style={{ display: "flex", flexDirection: "column",gap:2,}}>
                <Text style={labelStyles}>{currency?`${currency} :`:"SR :"}</Text>
                <View style={{border:"1pt solid rgb(23, 23, 23)",padding:4,borderRadius:2,width:100}}>
                <Text style={[fontStyles,{textAlign:"center"}]}>
                  {data.master?.totalDebit || "500"}
                </Text>
                </View>
               
              </View>
            
          </View>
            {/* Payment Details */}
            <View style={{ display: "flex", flexDirection: "row", justifyContent:"flex-start",gap:5, width:"100%", }}>
              <Text style={labelStyles}>{template?.headerState?.receivedFromLabel? `${template?.headerState?.receivedFromLabel}`:"Received From"} :</Text>
              <View style={{ flex: 1, borderBottom: "1pt solid rgb(25, 25, 25)"}}>
              <Text style={fontStyles}>
                {template?.headerState?.billTo}
              </Text>
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row", justifyContent:"flex-start",gap:5, width:"100%", }}>
              <Text style={labelStyles}>the sum of rupees :</Text>
              <View style={{ flex: 1, borderBottom: "1pt solid rgb(25, 25, 25)"}}>
              <Text style={fontStyles}>
              {getAmountInWords(Number(data.master?.totalDebit))}
              </Text>
              </View>
            </View>

        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-around",alignItems:"flex-start", width:"100%"}}>
            <Text style={labelStyles}>Reciver</Text>
            <Text style={labelStyles}>Cashier</Text>
            <Text style={labelStyles}>Account</Text>
        </View>

        </View>
        </View>
    );
  };
         