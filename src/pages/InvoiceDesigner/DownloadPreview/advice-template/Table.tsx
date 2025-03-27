import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { TemplateState } from "../../Designer/interfaces";
import { dateTrimmer } from "../../../../utilities/Utils";

// Helper function to get column styles based on width input
const getColumnStyle = (widthSetting: any) => {
  return (!widthSetting || widthSetting === "")
    ? { width: "auto", flexGrow: 1 }
    : { width: `${widthSetting}%`, flexGrow: 0 };
};

const Table = ({ data, template }: { data: any; template?: TemplateState }) => {
  const adviceTableState = template?.adviceTableState;
  const propertiesState = template?.propertiesState;

  const labelStyles = {
    fontWeight: propertiesState?.label_font_weight,
    fontStyle: propertiesState?.label_font_style,
    fontFamily: propertiesState?.font_family,
  };

  const styles = StyleSheet.create({
    table: {
      marginVertical: 20,
    },
    thead: {
      backgroundColor: adviceTableState?.showTableHeaderBg
        ? adviceTableState?.tableHeaderBgColor
        : "#fff",
      color: adviceTableState?.headerFontColor || "#000",
      fontSize: adviceTableState?.headerFontSize || 12,
      flexDirection: "row",
      flexWrap: "nowrap",
      borderBottom: `1px solid ${
        adviceTableState?.showTableBorder ? adviceTableState?.tableBorderColor : ""
      }`,
    },
    th: {
      padding: 5,
      textAlign: "center",
      flexGrow: 1,
    },
    tbody: {
      flexDirection: "column",
    },
    tr: {
      flexDirection: "row",
      flexWrap: "nowrap",
      borderBottom: `1px solid ${
        adviceTableState?.showTableBorder ? adviceTableState?.tableBorderColor : ""
      }`,
      backgroundColor: adviceTableState?.showRowBg
        ? adviceTableState?.itemRowBgColor
        : "#fff",
    },
    td: {
      padding: 5,
      textAlign: "center",
      color: adviceTableState?.itemRowFontColor || "#000",
      fontSize: adviceTableState?.itemRowFontSize || 12,
      fontWeight: propertiesState?.font_weight,
      flexGrow: 1,
    },
  });

  return (
    <View>
      <View style={[styles.table, labelStyles]}>
        {/* Table Header */}
        <View
          style={styles.thead}
          {...(adviceTableState?.headerRepeatOnPage ? { fixed: true } : {})}
        >
          {adviceTableState?.showLineItemNumber && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.lineItemNumberWidth)]}>
              {adviceTableState?.lineItemNumberLabel || "Invoice Number"}
            </Text>
          )}
          {adviceTableState?.showDate && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.DateWidth)]}>
              {adviceTableState?.DateLabel || "Date"}
            </Text>
          )}
          {adviceTableState?.showAmount && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.AmountWidth)]}>
              {adviceTableState?.AmountLabel || "Amount"}
            </Text>
          )}
          {adviceTableState?.showDueAmount && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.DueAmountWidth)]}>
              {adviceTableState?.DueAmountLabel || "Due Amount"}
            </Text>
          )}
          {adviceTableState?.showPayment && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.PaymentWidth)]}>
              {adviceTableState?.PaymentLabel || "Payment"}
            </Text>
          )}
          {adviceTableState?.showBalance && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.BalanceWidth)]}>
              {adviceTableState?.BalanceLabel || "Balance"}
            </Text>
          )}
            {adviceTableState?.showPaidStatement && (
            <Text style={[styles.th, getColumnStyle(adviceTableState?.PaidStatementWidth)]}>
              {adviceTableState?.PaidStatementLabel || "Full paid"}
            </Text>
          )}
        </View>

      {   /* Table Body */}
      {data?.details?.length > 0 && (
        <View style={styles.tbody}>
        { data?.details.map((val: any, index: number) => (
            <View key={`tbr${index}`} style={styles.tr}>
              {adviceTableState?.showLineItemNumber && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.lineItemNumberWidth)]}>
                  {`${val.voucherType} ${val.voucherNumber}`}
                </Text>
              )}
              {adviceTableState?.showDate && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.DateWidth)]}>
                  {dateTrimmer(val.transactionDate)}
                </Text>
              )}
              {adviceTableState?.showAmount && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.AmountWidth)]}>
                  {val.amount}
                </Text>
              )}
              {adviceTableState?.showDueAmount && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.DueAmountWidth)]}>
                  {val.amountDue}
                </Text>
              )}
              {adviceTableState?.showPayment && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.PaymentWidth)]}>
                  {val.payment}
                </Text>
              )}
              {adviceTableState?.showBalance && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.BalanceWidth)]}>
                 {val.balance}
                </Text>
              )}
              {adviceTableState?.showPaidStatement && (
                <Text style={[styles.td, getColumnStyle(adviceTableState?.PaidStatementWidth)]}>
                  {val.fullAmountPaid ? "Yes": "No"}
                </Text>
              )}
            </View>
          ))}
        </View>
        )}
      </View>
    </View>
  );
};

export default Table;
