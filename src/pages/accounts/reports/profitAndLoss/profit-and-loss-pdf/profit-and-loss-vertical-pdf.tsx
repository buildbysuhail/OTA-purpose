import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import FontRegistration from "../../../../LabelDesigner/fontRegister";


const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },

  subheader1: {
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "Poppins",
    fontStyle: "medium",
  },
  subheader2: {
    fontSize: 9,
    fontWeight: 400,
    fontFamily: "Poppins",
    fontStyle: "normal",
  },
  table: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tableHeader: {
    width: "50%",
    backgroundColor: "#d3d3d3",
    padding: 5,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Poppins",
    fontStyle: "medium",
  },
  tableCell: {
    paddingVertical: 5,
    width: "50%",
  },
  total: {
    color: "#f00",

    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Poppins",
    fontStyle: "medium",
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
  },
  amount: {
    textAlign: "right",
  },
  bold: {
    fontWeight: 700,
    fontStyle: "bold",
  },
  blue: {
    color: "#3b82f6",
    fontSize: 10,
    fontFamily: "Poppins",
  },
  red: {
    fontWeight: 700,
    fontStyle: "bold",
    color: "#FF0000",
    fontFamily: "Poppins",
    fontSize: 10,
  },
  SaddleBrown: {
    fontWeight: 700,
    fontStyle: "bold",
    color: "#8B4513",
    fontFamily: "Poppins",
    fontSize: 10,
  },
  darkText: {
    color: "#03070f",
    fontWeight: 400,
    fontStyle: "normal",
    fontFamily: "Poppins",
    fontSize: 10,
    paddingLeft: 10,
  },
  darkTextnum: {
    color: "#03070f",
    fontWeight: 400,
    fontStyle: "normal",
    fontFamily: "Poppins",
    fontSize: 10,
    paddingRight: 10,
  },

  greyText: {
    color: "#666",
  },
});

const ProfitAndLossVerticalPDFTemplate: React.FC<{
  data: any[];
  filter: any;
  getFormattedValue: any;
  userSession?: any;
}> = ({ data, filter, getFormattedValue, userSession }) => {
  const expense = data?.filter((item: any) => item?.transType == "E");
  const income = data?.filter((item: any) => item?.transType == "I");

  // const expense = data?.filter(
  //   (item: any) => item?.transType === "A" && item?.groupName !== "TOTAL"
  // );
  // const income = data?.filter(
  //   (item: any) => item?.transType === "L" && item?.groupName !== "TOTAL"
  // );

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
          <View style={{ marginBottom: 20 }}>
            {/*
                <Image
                  src={currentBranch?.logo}
                  style={[styles.logo, { width: 80 * logoWidthRatio }]}
                />
              */}

            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "Poppins",
                fontStyle: "medium",
              }}
            >
              {userSession.headerFooter?.heading7}
            </Text>
            <Text
              style={{
                fontFamily: "Amiri",
                fontWeight: 400,
                color: "#fff",
                fontSize: 14,
                fontStyle: "normal",
              }}
            >
              {userSession.headerFooter.heading8}
            </Text>
            <Text
              style={{
                fontSize: 8,
                fontWeight: 400,
                fontFamily: "Poppins",
                fontStyle: "normal",
              }}
            >
              {userSession.headerFooter.heading9}
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 0 }}>
              <Text style={styles.subheader1}>Profit and Loss Account - </Text>
              <Text style={styles.subheader2}>
                {/* as of  {new Date(filter.asonDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })} */}
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

            {/* table Head*/}
            <View style={styles.tableRow}>
              <View style={[styles.tableHeader]}>
                <Text>Account</Text>
              </View>
              <View style={[styles.tableHeader, styles.amount]}>
                <Text>Total</Text>
              </View>
            </View>

            {/* table body*/}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell]}>
                {expense?.map((item: any, index: number) => (
                  <Text
                   key={`exp${index}`}
                    style={[
                      item.title === "M" || item.groupName === "TOTAL"
                        ? styles.bold
                        : {},
                      item.title === "M"
                        ? styles.SaddleBrown
                        : item.groupName === "TOTAL"
                        ? styles.red
                        : styles.darkText,
                    ]}
                  >
                     {item?.groupName || " "}
                  </Text>
                ))}
                {/* <Text style={styles.total}>total</Text> */}
                {income?.map((item: any, index: number) => (
                  <Text
                  key={`inc${index}`}
                    style={[
                      item.title === "M" || item.groupName === "TOTAL"
                        ? styles.bold
                        : {},
                      item.title === "M"
                        ? styles.SaddleBrown
                        : item.groupName === "TOTAL"
                        ? styles.red
                        : styles.darkText,
                    ]}
                  >
                    {item?.groupName || " "}
                  </Text>
                ))}

                {/* <Text style={styles.total}>total</Text> */}
              </View>
              <View style={[styles.tableCell, styles.amount]}>
                {expense?.map((item: any, index: number) => (
                  <Text
                  key={`expT${index}`}
                    style={[
                      item.title === "M" || item.groupName === "TOTAL"
                        ? styles.bold
                        : {},
                      item.title === "M"
                        ? styles.SaddleBrown
                        : item.groupName === "TOTAL"
                        ? styles.red
                        : styles.darkTextnum,
                    ]}
                  >
                   {item.total < 0
                          ? "(-)" + getFormattedValue(-1*item.total)
                          :parseFloat(getFormattedValue(item.total)) === 0
                          ? ' '
                          : getFormattedValue(item.total)
                      }
                  </Text>
                ))}
                {/* <Text style={[styles.total,styles.amount]}>{getFormattedValue(assetTotal)}</Text> */}
                {income?.map((item: any, index: number) => (
                  <Text
                  key={`incT${index}`}
                    style={[
                      item.title === "M" || item.groupName === "TOTAL"
                        ? styles.bold
                        : {},
                      item.title === "M"
                        ? styles.SaddleBrown
                        : item.groupName === "TOTAL"
                        ? styles.red
                        : styles.darkTextnum,
                    ]}
                  >
                   {item.total < 0
                          ? "(-)" + getFormattedValue(-1*item.total)
                          :parseFloat(getFormattedValue(item.total)) === 0
                          ? ' '
                          : getFormattedValue(item.total)
                      }
                  </Text>
                ))}
                {/* <Text style={[styles.total,styles.amount]}>{getFormattedValue(liabilityTotal)}</Text> */}
              </View>
            </View>
          </View>
        </View>

 
      </Page>
    </Document>
  );
};

export default ProfitAndLossVerticalPDFTemplate;
