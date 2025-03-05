import { View, Text,StyleSheet } from "@react-pdf/renderer";
import { TemplateState } from "../../Designer/interfaces";

const Table = ({ data, template,}: { data: any; template?: TemplateState}) => {
  const adviceTableState = template?.adviceTableState;
  const propertiesState = template?.propertiesState;

  const labelStyles = {
    fontWeight: propertiesState?.label_font_weight,
    fontStyle: propertiesState?.label_font_style,
    fontFamily:propertiesState?.font_family,
  };

  const styles = StyleSheet.create({
    table:{
      width: "100%",
      display: "flex",
      marginBottom: 10,
    },
    thead:{
      backgroundColor: adviceTableState?.showTableHeaderBg ? adviceTableState?.tableHeaderBgColor : "#fff",
      color: adviceTableState?.headerFontColor || "#000",
      fontSize: adviceTableState?.headerFontSize || 12,
      flexDirection: "row",
      borderBottom: `1px solid ${adviceTableState?.showTableBorder ? adviceTableState?.tableBorderColor  :""}`,
    },
    th:{
      padding: 5,
      flex: 1,
      textAlign: "center",
    },
    tbody:{
      flexDirection: "column",
  
    },
    tr:{
      flexDirection: "row",
      borderBottom: `1px solid ${adviceTableState?.showTableBorder ? adviceTableState?.tableBorderColor  :""}`,
      backgroundColor: adviceTableState?.showRowBg ? adviceTableState?.itemRowBgColor : "#fff",
    },
    td:{
      padding: 4,
      flex: 1,
      textAlign: "center",
      color: adviceTableState?.itemRowFontColor || "#000",
      fontSize: adviceTableState?.itemRowFontSize || 12,
      fontWeight:propertiesState?.font_weight,
      // fontStyle:propertiesState?.label_font_color,
      // fontFamily:propertiesState?.label_font_color,
    },
   
  });
  
  return (
    <View>
      <View style={[styles.table,labelStyles]}>
        {/* Table Header */}
        <View style={styles.thead}>
          {adviceTableState?.showLineItemNumber && <Text style={styles.th}>#</Text>}
          {/* Invoice Number */}
        {adviceTableState?.showLineItemNumber && (
          <View style={{width: adviceTableState?.lineItemNumberWidth }}>
        <Text style={[styles.th]}>
            {adviceTableState?.lineItemNumberLabel || "Invoice Number"}
          </Text>
          </View>
    
        )}

        {/* Invoice Date */}
        {adviceTableState?.showInvoiceDate && (
              <View style={{ width: adviceTableState?.InvoiceDateWidth }}>
              <Text style={[styles.th, { }]}>
            {adviceTableState?.InvoiceDateLabel || "Invoice Date"}
          </Text>
                </View>
       
        )}

        {/* Invoice Amount */}
        {adviceTableState?.showInvoiceAmount && (
          <Text style={[styles.th, { width: adviceTableState?.InvoiceAmountWidth }]}>
            {adviceTableState?.InvoiceAmountLabel || "Invoice Amount"}
          </Text>
        )}

        {/* Withholding Tax */}
        {adviceTableState?.showWithholdingTax && (
          <Text style={[styles.th, { width: adviceTableState?.WithholdingTaxWidth }]}>
            {adviceTableState?.WithholdingTaxLabel || "Withholding Tax"}
          </Text>
        )}

        {/* TCS Amount */}
        {adviceTableState?.showTCSAmount && (
          <Text style={[styles.th, { width: adviceTableState?.TCSAmountWidth }]}>
            {adviceTableState?.TCSAmountLabel || "TCS Amount"}
          </Text>
        )}

        {/* Payment Amount */}
        {adviceTableState?.showPaymentAmount && (
          <Text style={[styles.th, { width: adviceTableState?.PaymentAmountWidth }]}>
            {adviceTableState?.PaymentAmountLabel || "Payment Amount"}
          </Text>
        )}
        </View>

        {/* Table Body */}
        <View style={styles.tbody}>
          {data?.details
          .map((val: any, index: number) => (
              <View key={`tbr${index}`} style={styles.tr}>
                {adviceTableState?.showLineItemNumber && (
                  <Text style={{ ...styles.td, width: adviceTableState?.lineItemNumberWidth }}>
                    {val.slNo}
                  </Text>
                )}
                {(adviceTableState?.showLineItemNumber) && (
                  <Text style={{ ...styles.td, width: adviceTableState?.lineItemNumberWidth }}>
                    INV-00{index + 1}
                  </Text>
                )}
                {adviceTableState?.showInvoiceDate && (
                  <Text style={{ ...styles.td, width: adviceTableState?.InvoiceDateWidth }}>
                    2024-01-{10 + index}
                  </Text>
                )}
                {adviceTableState?.showInvoiceAmount && (
                  <Text style={{ ...styles.td, width: adviceTableState?.InvoiceAmountWidth }}>
                    {1000 + index * 500}.00 {/* Demo Invoice Amount */}
                  </Text>
                )}
                {adviceTableState?.showWithholdingTax && (
                  <Text style={{ ...styles.td, width: adviceTableState?.WithholdingTaxWidth }}>
                     {50 + index * 10}.00 {/* Demo Withholding Tax */} 
                  </Text>
                )}
                {adviceTableState?.showTCSAmount && (
                  <Text style={{ ...styles.td, width: adviceTableState?.TCSAmountWidth }}>
                    {20 + index * 5}.00 {/* Demo TCS Amount */}
                  </Text>
                )}
                {adviceTableState?.showPaymentAmount && (
                  <Text style={{ ...styles.td, width: adviceTableState?.PaymentAmountWidth }}>
                  {800 + index * 200}.00 {/* Demo Payment Amount */}
                  </Text>
                )}    
              </View>
            ))}
        </View>

      </View>
    </View>
  );
};

export default Table;
