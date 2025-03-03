import { View, Text,StyleSheet } from "@react-pdf/renderer";
import { AccountTransactionProps } from ".";
import { TemplateState } from "../../Designer/interfaces";




const Table = ({ data, template }: { data: any; template?: TemplateState,}) => {
  const accTableState = template?.accTableState;
  const propertiesState = template?.propertiesState;

  const labelStyles = {
    fontWeight: propertiesState?.label_font_weight,
    fontStyle: propertiesState?.label_font_style,
    fontFamily:propertiesState?.font_family,
  };
  

  // Styles
  const styles = StyleSheet.create({
    table: {
      width: "100%",
      display: "flex",
      marginVertical: 10,
    },
    thead: {
      backgroundColor: accTableState?.showTableHeaderBg ? accTableState?.tableHeaderBgColor : "#fff",
      color: accTableState?.headerFontColor || "#000",
      fontSize: accTableState?.headerFontSize || 12,
      flexDirection: "row",
      borderBottom: `1px solid ${accTableState?.showTableBorder ? accTableState?.tableBorderColor  :""}`,
     
    },
    th: {
      padding: 5,
      flex: 1,
      textAlign: "center",
    },
    tbody: {
      flexDirection: "column",
  
    },
    tr: {
      flexDirection: "row",
      borderBottom: `1px solid ${accTableState?.showTableBorder ? accTableState?.tableBorderColor  :""}`,
      backgroundColor: accTableState?.showRowBg ? accTableState?.itemRowBgColor : "#fff",
    },
    td: {
      padding: 4,
      flex: 1,
      textAlign: "center",
      color: accTableState?.itemRowFontColor || "#000",
      fontSize: accTableState?.itemRowFontSize || 12,
      fontWeight:propertiesState?.font_weight,
      // fontStyle:propertiesState?.label_font_color,
      // fontFamily:propertiesState?.label_font_color,
    },
   
  });
    // Function to Render the Table Header
    const renderHeader = () => (
      <View style={styles.thead} {...(accTableState?.headerRepeatOnPage ? { fixed: true } : {})}>
        {accTableState?.showLineItemNumber && <Text style={styles.th}>#</Text>}
        {accTableState?.showInvoiceNumber && (
          <Text style={[styles.th, { width: accTableState?.InvoiceNumberWidth }]}>
            {accTableState?.InvoiceNumberLabel || "Invoice Number"}
          </Text>
        )}
        {accTableState?.showInvoiceDate && (
          <Text style={[styles.th, { width: accTableState?.InvoiceDateWidth }]}>
            {accTableState?.InvoiceDateLabel || "Invoice Date"}
          </Text>
        )}
        {accTableState?.showInvoiceAmount && (
          <Text style={[styles.th, { width: accTableState?.InvoiceAmountWidth }]}>
            {accTableState?.InvoiceAmountLabel || "Invoice Amount"}
          </Text>
        )}
        {accTableState?.showWithholdingTax && (
          <Text style={[styles.th, { width: accTableState?.WithholdingTaxWidth }]}>
            {accTableState?.WithholdingTaxLabel || "Withholding Tax"}
          </Text>
        )}
        {accTableState?.showTCSAmount && (
          <Text style={[styles.th, { width: accTableState?.TCSAmountWidth }]}>
            {accTableState?.TCSAmountLabel || "TCS Amount"}
          </Text>
        )}
        {accTableState?.showPaymentAmount && (
          <Text style={[styles.th, { width: accTableState?.PaymentAmountWidth }]}>
            {accTableState?.PaymentAmountLabel || "Payment Amount"}
          </Text>
        )}
      </View>
    );

  return (
   
      <View style={[styles.table,labelStyles]} wrap>
        {/* Table Header */}
      {/* Render Header Conditionally */}
       { renderHeader()} 

        {/* Table Body */}
        <View style={styles.tbody}>
          {data?.details
        
          .map((val: any, index: number) => (
              <View key={`tbr${index}`} style={styles.tr}>
                {accTableState?.showLineItemNumber && (
                  <Text style={{ ...styles.td, width: accTableState?.lineItemNumberWidth }}>
                    {val.slNo}
                  </Text>
                )}
                {(accTableState?.showInvoiceNumber) && (
                  <Text style={{ ...styles.td, width: accTableState?.InvoiceNumberWidth }}>
                    INV-00{index + 1}
                  </Text>
                )}
                {accTableState?.showInvoiceDate && (
                  <Text style={{ ...styles.td, width: accTableState?.InvoiceDateWidth }}>
                    2024-01-{10 + index}
                  </Text>
                )}
                {accTableState?.showInvoiceAmount && (
                  <Text style={{ ...styles.td, width: accTableState?.InvoiceAmountWidth }}>
                    {1000 + index * 500}.00 {/* Demo Invoice Amount */}
                  </Text>
                )}
                {accTableState?.showWithholdingTax && (
                  <Text style={{ ...styles.td, width: accTableState?.WithholdingTaxWidth }}>
                     {50 + index * 10}.00 {/* Demo Withholding Tax */} 
                  </Text>
                )}
                {accTableState?.showTCSAmount && (
                  <Text style={{ ...styles.td, width: accTableState?.TCSAmountWidth }}>
                    {20 + index * 5}.00 {/* Demo TCS Amount */}
                  </Text>
                )}
                {accTableState?.showPaymentAmount && (
                  <Text style={{ ...styles.td, width: accTableState?.PaymentAmountWidth }}>
                  {800 + index * 200}.00 {/* Demo Payment Amount */}
                  </Text>
                )}    
              </View>
            ))}
        </View>

      </View>

  );
};

export default Table;
