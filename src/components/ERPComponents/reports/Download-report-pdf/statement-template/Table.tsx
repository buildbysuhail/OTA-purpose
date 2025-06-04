import { View, Text, StyleSheet } from "@react-pdf/renderer"
import React from "react"
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format"

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


const Table = ({ data, getFormattedValue }: { data: any , getFormattedValue: any}) => {
  const ob = data.find((x: any) => x.particulars == "Opening Balance")
  const tot = data.find((x: any) => x.particulars == "TOTAL")
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
                  {item.particulars === "TOTAL"
                ? getFormattedValue(item.debit)
                : getFormattedValue(item.debit, false, 3)}
                </Text>
                <Text style={[styles.tableCell, styles.creditCell]}>
                   {item.particulars === "TOTAL"
                ? getFormattedValue(item.credit)
                : getFormattedValue(item.credit, false, 3)}
                </Text>
                <Text style={[styles.tableCell, styles.balanceCell]}>{
                   item.balance == null
              ? ""
              : item.balance < 0
                ? getFormattedValue(-1 * item.balance, false, 3) + " Cr"
                : getFormattedValue(item.balance, false, 3) + " Dr"} </Text>
              </View>

              {/* Narration row if exists */}
              {isNarrationRow && (
                <View style={[styles.tableRow, styles.narrationRow]}>
                  <Text style={[styles.tableCell, { width: "100%" }]}>{item.narration}</Text>
                </View>
              )}
            </React.Fragment>
          )
        })}
         <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.dateCell]}></Text>
                <Text style={[styles.tableCell, styles.voucherCell]}>
                  
                </Text>
                <Text style={[styles.tableCell, styles.poNumberCell]}></Text>
                <Text style={[styles.tableCell, styles.debitCell]}>
                  
                </Text>
                <Text style={[styles.tableCell, styles.creditCell]}>
                   
                </Text>
                <Text style={[styles.tableCell, styles.balanceCell]}>
                   </Text>
              </View>
        <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.dateCell]}></Text>
                <Text style={[styles.tableCell, styles.voucherCell]}>
                  
                </Text>
                <Text style={[styles.tableCell, styles.poNumberCell]}></Text>
                <Text style={[styles.tableCell, styles.debitCell]}>
                  {ob.debit == null && ob.credit == null
              ? ""
              : ob.debit > 0
                ?getFormattedValue(ob.debit, false, 3) + " Dr" 
              : ob.credit > 0
                ?getFormattedValue(ob.credit, false, 3) + " Cr" : "0"}
                </Text>
                <Text style={[styles.tableCell, styles.creditCell]}>
                   
                </Text>
                <Text style={[styles.tableCell, styles.balanceCell]}>
                   </Text>
              </View>
              
        <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.dateCell]}></Text>
                <Text style={[styles.tableCell, styles.voucherCell]}>
                  
                </Text>
                <Text style={[styles.tableCell, styles.poNumberCell]}></Text>
                <Text style={[styles.tableCell, styles.debitCell]}>
                  {tot.debit == null && tot.credit == null
              ? ""
              : tot.debit > 0
                ?getFormattedValue(tot.debit, false, 3) + " Dr" 
              : tot.credit > 0
                ?getFormattedValue(tot.credit, false, 3) + " Cr" : "0"}
                </Text>
                <Text style={[styles.tableCell, styles.creditCell]}>
                   
                </Text>
                <Text style={[styles.tableCell, styles.balanceCell]}>
                   </Text>
              </View>
      </View>
    </View>
  )
}

export default Table

