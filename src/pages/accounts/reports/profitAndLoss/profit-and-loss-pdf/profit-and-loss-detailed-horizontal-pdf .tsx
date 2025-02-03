import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import FontRegistration from '../../../../LabelDesigner/fontRegister';



const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    backgroundColor: '#ffffff',
    paddingVertical: 10, paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },

  subheader1: {
    fontSize: 10,
    fontWeight: 600, fontFamily: "Poppins", fontStyle: 'medium'
  },
  subheader2: {
    fontSize: 9,
    fontWeight: 400, fontFamily: "Poppins", fontStyle: 'normal'
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 5
  },
  subtable: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  tableHeader: {
    width: "50%",
    backgroundColor: '#d3d3d3',
    padding: 5,
    fontSize: 12, fontWeight: 600, fontFamily: "Poppins", fontStyle: 'medium'
  },
  tableCell: {
    paddingVertical: 5,
    width: "50%",
  },
  total: {
    backgroundColor: "rgb(245, 243, 243)",
    color: '#f00',
    padding: 5,
    fontSize: 12, fontWeight: 600, fontFamily: "Poppins", fontStyle: 'medium'
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  amount: {
    textAlign: 'right',
  },

  blue: {
    fontWeight: 500, fontStyle: 'medium',
    color: '#3b82f6',
    fontSize: 10, fontFamily: "Poppins",
    paddingLeft: 8
  },
  blueTextNum:{
    fontWeight: 500, fontStyle: 'medium',
    color: '#3b82f6',
    fontSize: 10, fontFamily: "Poppins",
    paddingRight: 8
  },
  red: {
    fontWeight: 700,
    fontStyle: 'bold',
    color: '#FF0000',
    fontFamily: "Poppins",
    fontSize: 10
  },
  SaddleBrown: {
    fontWeight: 700,
    fontStyle: "bold",
    color: "#8B4513",
    fontFamily: "Poppins",
    fontSize: 10,
  },
  darkText: {
    color: '#00000',
    fontWeight: 400,
    fontStyle: 'normal',
    fontFamily: "Poppins",
    fontSize: 10,
    paddingLeft: 16
  },
  darkTextnum: {
    color: '#03070f',
    fontWeight: 400,
    fontStyle: 'normal',
    fontFamily: "Poppins",
    fontSize: 10,
    paddingRight: 16
  },


});

const ProfitAndLossDetailedPDFTemplate: React.FC<{ data: any[], filter: any, getFormattedValue: any, userSession?: any }> = ({ data, filter, getFormattedValue, userSession }) => {



  const expense = data.filter(
    (item) => item?.transType === "E" && item?.groupName !== "TOTAL"
  );
  const income = data.filter(
    (item) => item?.transType === "I" && item?.groupName !== "TOTAL"
  );

  const expenseTotal =
    data?.find(
      (item: any) => item?.transType === "E" && item?.groupName === "TOTAL"
    )?.total || 0;
  const incomeTotal =
    data?.find(
      (item: any) => item?.transType === "I" && item?.groupName === "TOTAL"
    )?.total || 0;

  return (
    <Document>
      <FontRegistration />
      <Page size="A4" orientation="portrait">
        <View style={styles.page}>
          <View style={{ marginBottom: 20, }}>

            {/*
                <Image
                  src={currentBranch?.logo}
                  style={[styles.logo, { width: 80 * logoWidthRatio }]}
                />
              */}

            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "Poppins", fontStyle: 'medium' }}>
              {userSession.headerFooter?.heading7}
            </Text>


            {/* <Text style={{ fontFamily: 'Amiri', fontWeight: 400, color: '#fff', fontSize: 14, fontStyle: 'normal' }}>{userSession.headerFooter.heading8}</Text> */}
            {/* <Text style={{ fontSize: 8, fontWeight: 400, fontFamily: "Poppins", fontStyle: 'normal' }}>{userSession.headerFooter.heading9}</Text> */}
            <View style={{ display: 'flex', flexDirection: "row", gap: 0 }}>
              <Text style={styles.subheader1}>Profit and Loss Detailed - </Text>
              <Text style={styles.subheader2}>
              From{" "}
          {new Date(filter.fromDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}{" "}
          to{" "}
          {new Date(filter.toDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
              </Text>
            </View>
          </View>

          <View style={styles.table}>

            {/* table1 */}
            <View style={styles.subtable}>
              {/* table Head*/}
              <View style={styles.tableRow}>
                <View style={[styles.tableHeader,]}>
                  <Text>Expense</Text>
                </View>
                <View style={[styles.tableHeader, styles.amount]}>
                  <Text>Amount</Text>
                </View>
              </View>

              {/* table body*/}
              {expense?.map((item: any, index: number) => (
                <View key={`expense-${index}`} style={styles.tableRow}>
                  <View style={[styles.tableCell,]}>
                    <Text
                    key={`exp${index}`}
                      style={[
                        item.title === "M" ? styles.SaddleBrown : item.title === "L" || item.title === "G"?
                        styles.darkText :styles.blue    
                      ]}
                    >
                     {item?.groupName || " "}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, styles.amount]}>
                    <Text
                     key={`expense${index}`}
                       style={[
                        item.title === "M" ? styles.SaddleBrown : item.title === "L" || item.title === "G"?
                        styles.darkTextnum :styles.blueTextNum    
                      ]}
                    >
                      {item.transType === "L"
                        ? item.title === "M"
                          ? getFormattedValue(item.total)
                          : item.total > 0
                            ? "(-)" + getFormattedValue(item.total)
                            : item.total === 0
                              ? getFormattedValue(0)
                              : getFormattedValue(-1 * item.total)
                        : item.title === "M"
                          ? getFormattedValue(item.total)
                          : item.total < 0
                            ? "(-)" + getFormattedValue(-1 * item.total)
                            : item.total === 0
                              ? getFormattedValue(0)
                              : getFormattedValue(item.total)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* table2 */}


            <View style={styles.subtable}>
              {/* table Head*/}
              <View style={styles.tableRow}>
                <View style={[styles.tableHeader,]}>
                  <Text>Income</Text>
                </View>
                <View style={[styles.tableHeader, styles.amount]}>
                  <Text>Amount</Text>
                </View>
              </View>

              {/* table body*/}
              {income?.map((item: any, index: number) => (
                <View key={`income-${index}`} style={styles.tableRow}>
                  <View style={[styles.tableCell,]}>
                    <Text
                    key={`inc${index}`}
                    style={[
                      item.title === "M" ? styles.SaddleBrown : item.title === "L" || item.title === "G"?
                      styles.darkText :styles.blue    
                    ]}
                    >
                     {item?.groupName || " "}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, styles.amount]}>
                    <Text
                     key={`income${index}`}
                          style={[
                            item.title === "M" ? styles.SaddleBrown : item.title === "L" || item.title === "G"?
                            styles.darkTextnum :styles.blueTextNum    
                          ]}
                    >
                      {item.transType === "L"
                        ? item.title === "M"
                          ? getFormattedValue(item.total)
                          : item.total > 0
                            ? "(-)" + getFormattedValue(item.total)
                            : item.total === 0
                              ? getFormattedValue(0)
                              : getFormattedValue(-1 * item.total)
                        : item.title === "M"
                          ? getFormattedValue(item.total)
                          : item.total < 0
                            ? "(-)" + getFormattedValue(-1 * item.total)
                            : item.total === 0
                              ? getFormattedValue(0)
                              : getFormattedValue(item.total)}
                    </Text>
                  </View>
                </View>
              ))}

            </View>

          </View>
            <View style={styles.tableRow}>
               <View style={[{ flex: 1, padding: 5, }, styles.total]}>
                 <Text>Total</Text>
               </View>
               <View style={[{ flex: 2, padding: 5, }, styles.amount, styles.total]}>
                 <Text>{getFormattedValue(expenseTotal)}</Text>
               </View>
               <View style={[{ flex: 1, padding: 5, }, styles.total]}>
                 <Text>Total</Text>
               </View>
               <View style={[{ flex: 2, padding: 5, }, styles.amount, styles.total]}>
                 <Text>{getFormattedValue(incomeTotal)}</Text>
               </View>
             </View>       
        </View>
      </Page>
    </Document>
  );
};

export default ProfitAndLossDetailedPDFTemplate;