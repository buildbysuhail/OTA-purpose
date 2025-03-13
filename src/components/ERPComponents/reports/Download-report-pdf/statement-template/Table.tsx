import { View, Text, StyleSheet } from "@react-pdf/renderer"
import React from "react"

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
    padding: 5,
    marginVertical: 5, 
  },
  tableBody: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: 700,
    fontSize: 10,
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 8,
    fontFamily: "Roboto",
  },
  dateCell: {
    width: "12%",
  },
  voucherCell: {
    width: "12%",
  },
  poNumberCell: {
    width: "16%",
  },
  debitCell: {
    width: "20%",
    textAlign: "right",
  },
  creditCell: {
    width: "20%",
    textAlign: "right",
  },
  balanceCell: {
    width: "20%",
    textAlign: "right",
  },
  narrationRow: {
    backgroundColor: "#f9f9f9",
    fontStyle: "italic",
    fontSize: 7,
  },
})

// Format currency
const formatCurrency = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const Table = ({ data }: { data: any }) => {
  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]} fixed>
        <Text style={[styles.tableCell, styles.dateCell]}>Date</Text>
        <Text style={[styles.tableCell, styles.voucherCell]}>Voucher</Text>
        <Text style={[styles.tableCell, styles.poNumberCell]}>PO Number</Text>
        <Text style={[styles.tableCell, styles.debitCell]}>Debit</Text>
        <Text style={[styles.tableCell, styles.creditCell]}>Credit</Text>
        <Text style={[styles.tableCell, styles.balanceCell]}>Balance</Text>
      </View>

      {/* Table Body */}
      <View style={styles.tableBody}>
        {data.map((item: any, index: number) => {
          // Determine if this is a narration row
          const isNarrationRow = item.narration && item.narration.trim() !== ""

          return (
            <React.Fragment key={`${item.id}-${index}`}>
              {/* Main transaction row */}
              <View style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
                <Text style={[styles.tableCell, styles.dateCell]}>{item.date}</Text>
                <Text style={[styles.tableCell, styles.voucherCell]}>
                  {item.form} {item.vchNo}
                </Text>
                <Text style={[styles.tableCell, styles.poNumberCell]}>{item.refNo}</Text>
                <Text style={[styles.tableCell, styles.debitCell]}>
                  {item.debit > 0 ? formatCurrency(item.debit) : "0.00"}
                </Text>
                <Text style={[styles.tableCell, styles.creditCell]}>
                  {item.credit > 0 ? formatCurrency(item.credit) : "0.00"}
                </Text>
                <Text style={[styles.tableCell, styles.balanceCell]}>{formatCurrency(item.balance)} Dr</Text>
              </View>

              {/* Narration row if exists */}
              {isNarrationRow && (
                <View style={[styles.tableRow, styles.narrationRow]}>
                  <Text style={[styles.tableCell, { width: "100%" }]}>narration: {item.narration}</Text>
                </View>
              )}
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}

export default Table

