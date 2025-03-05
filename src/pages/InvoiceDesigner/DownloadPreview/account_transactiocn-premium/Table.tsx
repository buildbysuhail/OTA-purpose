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
   
        {accTableState?.showLineItemNumber && (
          <Text style={[styles.th, { width: accTableState?.lineItemNumberWidth ? accTableState?.lineItemNumberWidth: ""}]}>
            {accTableState?.lineItemNumberLabel || "SiNo"}
          </Text>
        )}
        {accTableState?.showLedgerCode && (
          <Text style={[styles.th, { width: accTableState?.ledgerCodeWidth }]}>
            {accTableState?.ledgerCodeLabel || "Ledger code"}
          </Text>
        )}
        {accTableState?.showLedger && (
          <Text style={[styles.th, { width: accTableState?.ledgerWidth }]}>
            {accTableState?.ledgerLabel || "Ledger"}
          </Text>
        )}
        {accTableState?.showAmount && (
          <Text style={[styles.th, { width: accTableState?.amountWidth }]}>
            {accTableState?.amountLabel || "Amount"}
          </Text>
        )}
        {accTableState?.showNarration && (
          <Text style={[styles.th, { width: accTableState?.narrationWidth }]}>
            {accTableState?.narrationLabel || "Narration"}
          </Text>
        )}
        {accTableState?.showBillwiseDetails && (
          <Text style={[styles.th, { width: accTableState?.billwiseDetailsWidth }]}>
            {accTableState?.billwiseDetailsLabel || "Bill wise details"}
          </Text>
        )}
             {accTableState?.showDiscount && (
          <Text style={[styles.th, { width: accTableState?.discountWidth}]}>
            {accTableState?.discountLabel || "Discount"}
          </Text>
        )}
             {accTableState?.showCostCenter && (
          <Text style={[styles.th, { width: accTableState?.costCenterWidth }]}>
            {accTableState?.costCenterLabel || "Cost Center"}
          </Text>
        )}
             {accTableState?.showAmountFc && (
          <Text style={[styles.th, { width: accTableState?.amountFcWidth }]}>
            {accTableState?.amountFcLabel || "AmountFc"}
          </Text>
        )}
             {accTableState?.showBankCharge && (
          <Text style={[styles.th, { width: accTableState?.bankChargeWidth }]}>
            {accTableState?.bankChargeLabel || "Bank Charge"}
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
        {data?.details.map((val: any, index: number) => (
              <View key={`tbr${index}`} style={styles.tr}>
                {accTableState?.showLineItemNumber && (
                  <Text style={{ ...styles.td, width: accTableState?.lineItemNumberWidth }}>
                    {val.slNo}{index + 1}
                  </Text>
                )}
                {(accTableState?.showLedgerCode) && (
                  <Text style={{ ...styles.td, width: accTableState?.ledgerCodeWidth }}>
                    INV-00{index + 1}
                  </Text>
                )}
                {accTableState?.showLedger && (
                  <Text style={{ ...styles.td, width: accTableState?.ledgerWidth }}>
                    2024-01-{10 + index}
                  </Text>
                )}
                {accTableState?.showAmount && (
                  <Text style={{ ...styles.td, width: accTableState?.amountWidth }}>
                    {1000 + index * 500}.00 {/* Demo Invoice Amount */}
                  </Text>
                )}
                {accTableState?.showNarration && (
                  <Text style={{ ...styles.td, width: accTableState?.narrationWidth }}>
                     {50 + index * 10}.00 {/* Demo Withholding Tax */} 
                  </Text>
                )}
                {accTableState?.showBillwiseDetails && (
                  <Text style={{ ...styles.td, width: accTableState?.billwiseDetailsWidth }}>
                    {20 + index * 5}.00 {/* Demo TCS Amount */}
                  </Text>
                )}
                {accTableState?.showDiscount && (
                  <Text style={{ ...styles.td, width: accTableState?.discountWidth }}>
                  {800 + index * 200}.00 {/* Demo Payment Amount */}
                  </Text>
                )}   
                   {accTableState?.showCostCenter && (
                  <Text style={{ ...styles.td, width: accTableState?.costCenterWidth }}>
                  {800 + index * 200}.00 {/* Demo Payment Amount */}
                  </Text>
                )} 
                   {accTableState?.showAmountFc && (
                  <Text style={{ ...styles.td, width: accTableState?.amountFcWidth }}>
                  {800 + index * 200}.00 {/* Demo Payment Amount */}
                  </Text>
                )} 
                   {accTableState?.showBankCharge && (
                  <Text style={{ ...styles.td, width: accTableState?.bankChargeWidth }}>
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
