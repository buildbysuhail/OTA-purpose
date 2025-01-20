import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
import { AccountTransactionProps } from ".";
import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { TemplateState } from "../../Designer/interfaces";
import { IndianRupee } from 'lucide-react';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  headerBG: {
    height: 50,
    width: "100%",
    overflow: "hidden",
  },
  companyInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    // flexWrap: "wrap",
    width: "100%",
    zIndex: 10,
  },
  logo: {
    marginVertical: 4,
  },
  orgName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
  },
  orgAddress: {
    display: "flex",
    flexDirection: "column",
    gap:2
  },
  docTitle:{
    fontSize: 18,
    fontWeight: "medium",
    marginBottom: 8,
  },
  amountInfo: {
    display: "flex",
    flexDirection: "row",
    gap:30,
    flexWrap: "wrap",
    width: "100%",
    zIndex: 10,
    marginVertical: 40,
  },
  amountReceived: {
    height: 120,
    width: 150,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  billTo: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
  },
  signature: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    
  },
  notes: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 20,
   
  },
  payment: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"flex-start",
    gap:5,
    width:"100%",
  },
  paymentCol: {
    display: "flex",
    flexDirection: "column",
    alignItems:"center",
    flexBasis:"50%"
  },
});

export  const Content = ({ data, template, currentBranch,docIDKey,currency}: { data: any; template?: TemplateState; currentBranch: any, docIDKey?: string;currency?: string;}) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;
  const totalState = template?.totalState;
  const footerState = template?.footerState;

  const titleColor = template?.headerState?.docTitleFontColor || "#000";
  const titleFontSize = headerState?.docTitleFontSize || 16;

  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";

  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
  const labelFontStyle = template?.propertiesState?.label_font_style || "normal";

  const custNameFontColor = headerState?.customerNameFontColor;
  const custNameFontSize = headerState?.customerNameFontSize || 12;

  const docTitleVal =  headerState?.docTitle;

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
    <View style={styles.container}>
     
      {/* Doc Title */}
      {headerState?.showDocTitle && (
        <Text style={[styles.docTitle, { color: titleColor, fontSize: titleFontSize , fontFamily:fontFamily,
         textAlign:"center",textDecoration:"underline"
        }]}>
          {docTitleVal}
        </Text>
      )}

      {/* Amount Info */}
      <View style={[styles.amountInfo,]}>
        <View style={{ flex: 1, display: "flex", flexDirection: "column", gap:10, width: "66.66%" }}>
          {headerState?.showNumberField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%"}}>
              <Text style={labelStyles}>{headerState?.numberField || "Payment#"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {dateTrimmer(data.master?.number) || 1}
              </Text>
            </View>
          )}

          {headerState?.accountTransactionInfo?.showDateField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.dateField  || "Payment Date"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data.master?.date || "12/5/2024"}
              </Text>
            </View>
          )}

          {headerState?.accountTransactionInfo?.showReferenceField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" , width:"100%"}}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.referenceField || "Reference Number"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data?.master.referenceNumber ?? "23"}
              </Text>
            </View>
          )}

          {headerState?.accountTransactionInfo?.showPaymentMode && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%" }}>
              <Text style={labelStyles}>{headerState?.accountTransactionInfo?.paymentMode || "Payment Mode"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data?.master?.paymentMode || "Cash"}
               
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
          )}
          
         
        </View>

        <View style={[styles.amountReceived,
        {backgroundColor:headerState?.accountTransactionInfo?.amtReceivedBgColor??"#65a30d",
         color:headerState?.accountTransactionInfo?.amtReceivedFontColor??"#ffffff",
         fontWeight: "medium",
        }]}>
          <Text style={{fontSize:14}}>{headerState?.accountTransactionInfo?.amtReceivedLabel ||"Amount Received"}</Text>

          <Text style={{ fontSize: headerState?.accountTransactionInfo?.amtReceivedFontSize ?? 14 }}>
            {headerState?.accountTransactionInfo?.currencySymbolPosition === 'before' ? "INR" : ""} {data.master?.totalDebit} {headerState?.accountTransactionInfo?.currencySymbolPosition === 'after' ? "INR" : ""}
         </Text>

        </View>
      </View>

      {/* Bill To and Signature */}
      <View style={[styles.companyInfo, { marginVertical: 20 }]}>
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
      </View>

      {/* Notes */}
      {template?.footerState?.showNotesLabel && (
        <View style={[styles.notes,]}>
          <Text style={labelStyles}>{template?.footerState?.notesLabel || "Notes"}</Text>
          <Text style={{ ...fontStyles, fontSize: template?.footerState?.noteFontSize }}>
            {data?.master?.notes ?? "Payment has been received by cash"}
          </Text>
        </View>
      )}
       <View style={{ width: "100%", borderTop: "0.5px solid #DFDFDF", marginVertical: 10 }} />
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
       <View style={{ width: "100%", borderTop: "0.5px solid #DFDFDF", marginVertical: 10 }} />

    </View>
  );
};

