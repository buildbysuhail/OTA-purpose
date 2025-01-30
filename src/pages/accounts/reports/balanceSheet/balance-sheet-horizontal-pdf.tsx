import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { BalanceSheetFilterInitialState } from "./balance-sheet-filter";
import FontRegistration from '../../../LabelDesigner/fontRegister';

// Register a custom font if needed
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2' });

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,paddingHorizontal:20,
    flex: 1, 
    flexDirection: 'column', 
    width: '100%', 
    height: '100%'
  },

  subheader1: {
    fontSize: 10,
    fontWeight: 600,fontFamily:"Poppins",fontStyle:'medium' 
  },
  subheader2: {
    fontSize: 9,
    fontWeight: 400,fontFamily:"Poppins",fontStyle:'normal' 
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#d3d3d3',
    padding: 6,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 6,
    flex: 1,
  },
  total: {
    backgroundColor: '#f00',
    color: '#fff',
    padding: 6,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  amount: {
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  blue: {
    color: '#3b82f6',
  },
  red: {
    color: '#FF0000',
  },
  darkText: {
    color: '#03070f',
  },
  greyText: {
    color: '#666',
  },
});

const BalanceSheetPDFTemplate: React.FC<{ data: any[], filter: any ,getFormattedValue:any,userSession?:any}> = ({ data, filter,getFormattedValue,userSession }) => {


  const assets = data?.filter(
    (item: any) => item?.transType === "A" && item?.groupName !== "TOTAL"
  );
  const liabilities = data?.filter(
    (item: any) => item?.transType === "L" && item?.groupName !== "TOTAL"
  );

  const assetTotal =
    data?.find(
      (item: any) => item?.transType === "A" && item?.groupName === "TOTAL"
    )?.total || 0;
  const liabilityTotal =
    data?.find(
      (item: any) => item?.transType === "L" && item?.groupName === "TOTAL"
    )?.total || 0;

  return (
    <Document>
     <FontRegistration />
      <Page size="A4" orientation="portrait">
      <View style={styles.page}>
          <View style={{ marginBottom:30, }}>
            
              {/*
                <Image
                  src={currentBranch?.logo}
                  style={[styles.logo, { width: 80 * logoWidthRatio }]}
                />
              */}
             
                <Text style={{ color: '#fff' , fontSize:14 , fontWeight: 600,fontFamily:"Poppins",fontStyle:'medium'}}>
                  {userSession.headerFooter?.heading7}
                </Text>
         
            
                <Text style={{ fontFamily: 'Amiri',fontWeight: 400, color:'#fff', fontSize:14 ,fontStyle: 'normal'}}>{userSession.headerFooter.heading8}</Text>
                <Text style={{fontSize: 8,fontWeight: 400,fontFamily:"Poppins",fontStyle:'normal'}}>{userSession.headerFooter.heading9}</Text>
                <View style={{display:'flex',flexDirection:"row", gap:0}}>
                <Text style={styles.subheader1}>Balance Sheet - </Text>
                <Text style={styles.subheader2}>
                as of {new Date(filter.asonDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                })}
                </Text>
                </View>
              
         
        
        </View>
        
   

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeader, { flex: 2 }]}>
              <Text>liabilities</Text>
            </View>
            <View style={[styles.tableHeader, { flex: 1 }, styles.amount]}>
              <Text>amount</Text>
            </View>
            <View style={[styles.tableHeader, { flex: 2 }]}>
              <Text>assets</Text>
            </View>
            <View style={[styles.tableHeader, { flex: 1 }, styles.amount]}>
              <Text>amount</Text>
            </View>
          </View>

          {liabilities?.map((item: any, index: number) => (
            <View key={`liability-${index}`} style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text
                  style={[
                    styles.tableCell,
                    item.title === "M" || item.groupName === "TOTAL"
                      ? styles.bold
                      : {},
                    item.title === "M"
                      ? styles.blue
                      : item.groupName === "TOTAL"
                      ? styles.red
                      : styles.darkText,
                  ]}
                >
                  {item.groupName}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 1 }, styles.amount]}>
                <Text
                  style={[
                    styles.tableCell,
                    item.title === "M" || item.groupName === "TOTAL"
                      ? styles.bold
                      : {},
                    item.title === "M"
                      ? styles.blue
                      : item.groupName === "TOTAL"
                      ? styles.red
                      : styles.darkText,
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
              {assets[index] && (
                <>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text
                      style={[
                        styles.tableCell,
                        assets[index].title === "M" || assets[index].groupName === "TOTAL"
                          ? styles.bold
                          : {},
                        assets[index].title === "M"
                          ? styles.blue
                          : assets[index].groupName === "TOTAL"
                          ? styles.red
                          : styles.darkText,
                      ]}
                    >
                      {assets[index].groupName}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }, styles.amount]}>
                    <Text
                      style={[
                        styles.tableCell,
                        assets[index].title === "M" || assets[index].groupName === "TOTAL"
                          ? styles.bold
                          : {},
                        assets[index].title === "M"
                          ? styles.blue
                          : assets[index].groupName === "TOTAL"
                          ? styles.red
                          : styles.darkText,
                      ]}
                    >
                      {assets[index].transType === "L"
                        ? assets[index].title === "M"
                          ? getFormattedValue(assets[index].total)
                          : assets[index].total > 0
                          ? "(-)" + getFormattedValue(assets[index].total)
                          : assets[index].total === 0
                          ? getFormattedValue(0)
                          : getFormattedValue(-1 * assets[index].total)
                        : assets[index].title === "M"
                        ? getFormattedValue(assets[index].total)
                        : assets[index].total < 0
                        ? "(-)" + getFormattedValue(-1 * assets[index].total)
                        : assets[index].total === 0
                        ? getFormattedValue(0)
                        : getFormattedValue(assets[index].total)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ))}

          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2 }, styles.total]}>
              <Text>total</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1 }, styles.amount, styles.total]}>
              <Text>{getFormattedValue(liabilityTotal)}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }, styles.total]}>
              <Text>total</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1 }, styles.amount, styles.total]}>
              <Text>{getFormattedValue(assetTotal)}</Text>
            </View>
          </View>
        </View>
     </View>
      </Page>
    </Document>
  );
};

export default BalanceSheetPDFTemplate;