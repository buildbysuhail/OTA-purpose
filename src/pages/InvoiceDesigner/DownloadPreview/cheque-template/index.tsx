import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import { TemplateState } from "../../Designer/interfaces";
import FontRegistration from "../../../LabelDesigner/fontRegister";

import { AccountTransactionProps } from "../account_transactiocn-premium";
import { Header } from "./Header";
import { Content } from "./Content";
import Table from "./Table";
import { Footer } from "./Footer";
// Create styles

const ChequeTemplate = ({ data, template, currentBranch,userSession }: AccountTransactionProps) => {
// Paddings
const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor:"#F5F5F5",
    paddingLeft: template?.propertiesState?.padding?.left || 10,
    paddingTop: template?.propertiesState?.padding?.top || 10,
    paddingBottom: template?.propertiesState?.padding?.bottom || 10,
    paddingRight: template?.propertiesState?.padding?.right || 10,
    fontFamily:template?.propertiesState?.font_family || "Roboto"
  },
  checkContainer: {
    width: "100%",
    height: "auto",
    backgroundColor:  template?.propertiesState?.bg_color||"white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#E0E0E0",
    // paddingBottom: 10,
  },
  bankName: {
    fontSize: 12,
    fontWeight: 600,
    flexDirection: "row",
    alignItems: "center",
  },

  dateGrid: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: 80,
  },
  dateCell: {
    width: 10,
    height: 15,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    textAlign: "center",
    fontSize: 6,
    paddingTop: 2,
  },
  dateCellLast: {
    width: 10,
    height: 15,
    textAlign: "center",
    fontSize: 6,
    paddingTop: 2,
  },
  dateLabelRow: {
    flexDirection: "row",
    width: 80,
  },
  dateLabel: {
    width: 10,
    fontSize: 5,
    textAlign: "center",
  },
  paySection: {
    marginVertical: 10,
  },
  payLabel: {
    fontSize: 8,
  },
  payLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orBearer: {
    fontSize: 6,
    textAlign: "right",
  },
  sumSection: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sumLabel: {
    fontSize: 8,
  
  },
  sumLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 2,
    marginBottom: 2,
  },
  sumLine2: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 2,
    marginTop: 20,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  accNoSection: {
    width: "45%",
  },
  accNoLabel: {
    fontSize: 8,
    marginBottom: 2,
  },
  accNoBox: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 20,
  },
  amountSection: {
    width: "45%",
  },
  amountBox: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 20,
    marginTop: 20,
  },
  signatureSection: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  signatureText: {
    fontSize: 6,
  },
  micr: {
    fontFamily: "Courier",
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
  },
})
return (
  <Document>
  <FontRegistration />
  <Page size="A4" orientation={pageOrientation} style={styles.page}>
        <View style={styles.checkContainer}>
          {/* Header with Bank Name and Date */}
          <View style={styles.header}>
            <View style={styles.bankName}>
             
              <Text>BANK NAME</Text>
            </View>
            <View>
              <View style={styles.dateGrid}>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCell}></View>
                <View style={styles.dateCellLast}></View>
              </View>
              <View style={styles.dateLabelRow}>
                <Text style={styles.dateLabel}>D</Text>
                <Text style={styles.dateLabel}>D</Text>
                <Text style={styles.dateLabel}>M</Text>
                <Text style={styles.dateLabel}>M</Text>
                <Text style={styles.dateLabel}>Y</Text>
                <Text style={styles.dateLabel}>Y</Text>
                <Text style={styles.dateLabel}>Y</Text>
                <Text style={styles.dateLabel}>Y</Text>
              </View>
            </View>
          </View>

          {/* Pay Section */}
      
            <View style={styles.payLine}>
            <Text style={styles.payLabel}>PAY</Text>
            <Text style={styles.payLabel}>OR BEARER</Text>
            </View>
        
          {/* Sum Section */}
          <View style={styles.sumSection}>
            <View style={{width:"70%"}}>
            <Text style={styles.sumLabel}>SUM OF</Text>
            <View style={styles.sumLine}></View>
            <View style={styles.sumLine2}></View>
            </View>
            <View>

            </View>
         
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureText}>Please Sign Above</Text>
          </View>

        </View>
      </Page>
</Document>
);
};
export default ChequeTemplate;
