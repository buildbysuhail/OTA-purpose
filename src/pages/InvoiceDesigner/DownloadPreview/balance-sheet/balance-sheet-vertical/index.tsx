import { Document, Page, View, Text, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { TemplateState } from "../../../Designer/interfaces";
import FontRegistration from "../../../../LabelDesigner/fontRegister";

export interface BalanceSheetVerticalProps {
  template?: TemplateState;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
  },
});

const BalanceSheetVerticalTemplate = ({ template }: BalanceSheetVerticalProps) => {
  const paddingLeft = template?.propertiesState?.padding?.left || 10;
  const paddingRight = template?.propertiesState?.padding?.right || 10;
  const paddingTop = template?.propertiesState?.padding?.top || 10;
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10;
  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";

  return (
    <Document>
      <FontRegistration />
      <Page size={"A4"} orientation={pageOrientation} style={styles.page}>
        <View style={styles.section}>
          <Text>As of January 15, 2024</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Liabilities</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Amount</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Assets</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Amount</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Capital Accounts</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>125,414,443,455</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Current Asset</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>204,975,016,438</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Reserves & Surplus</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>125,414,443,455</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Closing Stock</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>68,298,982,378</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Current Liabilities</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>153,955,018,733</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Cash in hand</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>59,696,256,665</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Duties & Taxes</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>16,179,554,096</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Account Receivable</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>77,009,777,395</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Account Payable</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>137,775,434,635</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Profit & Loss A/c (Net Loss)</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>74,394,438,829</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Current Period</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>1,664,793,265</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Previous Period</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>72,720,645,964</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>279,369,455,267</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>279,369,455,267</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BalanceSheetVerticalTemplate;