import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { TemplateState } from "../../../Designer/interfaces";

const Table = ({ data, template }: { data?: any; template?: TemplateState }) => {
  const propertiesState = template?.propertiesState;
  const fontFamily = propertiesState?.font_family || "Roboto";

  const labelStyles = {
    color: propertiesState?.label_font_color || "#000",
    fontSize: propertiesState?.label_font_size || 12,
    fontWeight: propertiesState?.label_font_weight || 400,
    fontStyle: propertiesState?.label_font_style || "normal",
    fontFamily,
  };

  const fontStyles = {
    color: propertiesState?.font_color || "#000",
    fontSize: propertiesState?.font_size || 12,
    fontWeight: propertiesState?.font_weight || 400,
    fontStyle: propertiesState?.fontStyle || "normal",
    fontFamily,
  };

  // Styles
  const styles = StyleSheet.create({
    table: {
      display: "flex",
      width: "100%",
      border: "1px solid #262626", // Outer border for the entire table
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "25%",
      padding: 5,
      borderRight: "1px solid #262626", // Right border for each column
      borderBottom: "1px solid #262626", // Bottom border for each row
    },
    tableCell: {
      // Additional cell styles if needed
    },
  });

  
  return (
    <View style={[styles.table,{borderBottom:"none"}]}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={labelStyles}>Liabilities</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={labelStyles}>Amount</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={labelStyles}>Assets</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={labelStyles}>Amount</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Capital AccountsCapital AccountsCapital AccountsCapital Accounts</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>125,414,443,455</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Current Asset</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>204,975,016,438</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Reserves & Surplus</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>125,414,443,455</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Closing Stock</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>68,298,982,378</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Current Liabilities</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>153,955,018,733</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Cash in hand</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>59,696,256,665</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Duties & Taxes</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>16,179,554,096</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Account Receivable</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>77,009,777,395</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Account Payable</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>137,775,434,635</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Profit & Loss A/c (Net Loss)</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>74,394,438,829</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}></Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}></Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Current Period</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>1,664,793,265</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}></Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}></Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Previous Period</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>72,720,645,964</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Total</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>279,369,455,267</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={fontStyles}>Total</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: "none" }]}>
          <Text style={fontStyles}>279,369,455,267</Text>
        </View>
      </View>
    </View>
  );
};

export default Table;