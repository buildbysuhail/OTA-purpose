import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const TotalSummaryPreview = ({ template, data, currencySymbol, totalAmountInwords, templateGroupId, taxInfo }: DownloadPreviewProps) => {
  ///Total Summary
  const totalState = template?.totalState;
  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;

  const totalSummaryBackgroundColor = template?.totalState?.showTotalBgColor ? template?.totalState?.totalBgColor : "#fff";
  const wordsBackgroudColor = template?.totalState?.showBalanceBgColor ? template?.totalState?.balanceBgColor : "#fff";
  const totalSummaryfontSize = template?.totalState?.totalFontSize || 12;
  const totalSummarycolor = template?.totalState?.totalFontColor || "#000";
  const balnceFontSize = template?.totalState?.balanceFontSize || 12;

  return (
    <>
      <View
        style={{
          paddingLeft,
          paddingRight,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginVertical: "10px",
        }}
        wrap={false}
      >
        <View
          style={{
            width: "50%",
            height: "100%",
            textAlign: "right",
          }}
        ></View>
        <View
          style={{
            width: "50%",
            height: "100%",
            textAlign: "right",
          }}
        >
          {totalState?.showTotalSection && (
            <View>
              <View
                style={{
                  backgroundColor: totalSummaryBackgroundColor,
                  color: totalState?.totalFontColor || "#000",
                  fontSize: totalSummaryfontSize,
                  padding: "10pt",
                  display: "flex",
                }}
              >
                {totalState.showSubTotalLabel && data?.sub_total !== undefined && (
                  <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                    <View style={{ width: "50%" }}>
                      <Text>{totalState.subTotalLabel}</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text>
                        {totalState?.currencyPosition?.value === "Before" && currencySymbol}
                        {" "}{Number(data?.sub_total).toFixed(2)}{" "}
                        {totalState?.currencyPosition?.value === "After" && currencySymbol}
                      </Text>
                    </View>
                  </View>
                )}

                {data?.discount_price !== undefined && (
                  <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                    <View style={{ width: "50%" }}>
                      <Text>Discount</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text>
                        {totalState?.currencyPosition?.value === "Before" && currencySymbol}
                        {" "}{Number(data?.discount_price).toFixed(2)}{" "}
                        {totalState?.currencyPosition?.value === "After" && currencySymbol}
                      </Text>
                    </View>
                  </View>
                )}

                {totalState.showTax && data?.total_tax_amount !== undefined && (
                  <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                    <View style={{ width: "50%" }}>
                      <Text>Tax</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text>
                        {totalState?.currencyPosition?.value === "Before" && currencySymbol}
                        {" "}{Number(data?.total_tax_amount).toFixed(2)}{" "}
                        {totalState?.currencyPosition?.value === "After" && currencySymbol}
                      </Text>
                    </View>
                  </View>
                )}

                {data?.total_price !== undefined && (
                  <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                    <View style={{ width: "50%" }}>
                      <Text>Total</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text>
                        {totalState?.currencyPosition?.value === "Before" && currencySymbol}
                        {" "}{Number(data?.total_price).toFixed(2)}{" "}
                        {totalState?.currencyPosition?.value === "After" && currencySymbol}
                      </Text>
                    </View>
                  </View>
                )}

                {data?.paid_amount !== undefined && (
                  <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                    <View style={{ width: "50%" }}>
                      <Text>Amount Paid</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text>
                        {totalState?.currencyPosition?.value === "Before" && currencySymbol}
                        {" "}{Number(data?.paid_amount).toFixed(2)}{" "}
                        {totalState?.currencyPosition?.value === "After" && currencySymbol}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              {totalState && data?.balance_due !== undefined && (
                <View
                  style={{
                    backgroundColor: wordsBackgroudColor,
                    color: totalState?.balanceFontColor || "#000",
                    fontSize: balnceFontSize,
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    padding: "10pt",
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <Text>Amount Due</Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text>
                      {totalState?.currencyPosition?.value === "Before" && currencySymbol}
                      {" "}{Number(data?.balance_due).toFixed(2)}{" "}
                      {totalState?.currencyPosition?.value === "After" && currencySymbol}
                    </Text>
                  </View>
                </View>
              )}
              {data?.total_price !== undefined && (
                <View
                  style={{
                    color: totalSummarycolor,
                    fontSize: totalSummaryfontSize,
                    paddingVertical: "10pt",
                    paddingHorizontal: "5pt",
                  }}
                >

                  <Text style={{ fontWeight: "bold" }}>
                    <Text style={{ paddingBottom: "10pt" }}>Total In Words :</Text> {totalAmountInwords}
                  </Text>
                </View>
              )}
            </View>
          )}

          {templateGroupId === "journal_entry" && (
            <View>
              <View
                style={{
                  backgroundColor: totalSummaryBackgroundColor,
                  fontSize: totalSummaryfontSize,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  padding: "5px",
                }}
              >
                <View style={{ width: "20%" }}>
                  <Text> Sub Total</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>{data?.debit_sub_total}</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>{data?.credit_sub_total}</Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: wordsBackgroudColor,
                  fontSize: totalSummaryfontSize,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  padding: "5px",
                  fontWeight: "bold",
                }}
              >
                <View style={{ width: "20%" }}>
                  <Text>Total</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>
                    {currencySymbol} {data?.debit_total}
                  </Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>
                    {currencySymbol} {data?.credit_total}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {totalState?.showTaxSummaryTable && <TaxSummaryTablePDF template={template} data={data} taxInfo={taxInfo} />}
    </>
  );
};

export default TotalSummaryPreview;


const TaxSummaryTablePDF = ({ template, taxInfo }: DownloadPreviewProps) => {

  const taxSplitView = () => {
    let arr: any = [];
    let taxArr = taxInfo;
    taxArr?.map((item: any) => {
      let taxFilterList = arr?.filter((value: any) => value?.tax_label?.replace(" ", "_") == item.tax_label?.replace(" ", "_"));
      if (taxFilterList?.length > 0) {
        let idx = arr.findIndex((t: any) => t.tax_label?.replace(" ", "_") === item.tax_label?.replace(" ", "_"));
        arr.splice(idx, 1);
        arr.push({ ...item, tax_value: taxFilterList?.[0]?.tax_value + item.tax_value });
      } else {
        arr.push(item);
      }
    });
    return arr;
  };

  /* ########################################################################################### */

  const totalState = template?.totalState;
  const itemTableState = template?.itemTableState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || 12;
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.tableHeaderBgColor || "#fff";

  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;

  /// Items
  const ItemsfontSize = itemTableState?.itemRowFontSize;
  const ItemsborderColor = itemTableState?.tableBorderColor;
  const Itemscolor = itemTableState?.itemRowFontColor || "#000";
  const ItemsBackgroundColor = itemTableState?.showRowBg ? itemTableState?.itemRowBgColor : "#fff";

  const styles = StyleSheet.create({
    theadStyle: {
      display: "flex",
      flexDirection: "row",
      color: headerFontColor,
      fontSize: headerFontSize,
      backgroundColor: headerBgColor,
    },
    thStyle: {
      flex: "1",
      height: "30px",
      padding: "5pt",
      display: "flex",
      alignContent: "center",
      flexDirection: "column",
      justifyContent: "center",
    },
    trStyle: {
      width: "100%",
      height: "30px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    tdStyle: {
      flex: "1",
      height: "auto",
      width: "100%",
      padding: "5pt",
      display: "flex",
      color: Itemscolor,
      flexDirection: "column",
      fontSize: ItemsfontSize,
      borderColor: ItemsborderColor,
      backgroundColor: ItemsBackgroundColor,
      borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
    }

  });

  return (
    <View style={{
      paddingLeft,
      paddingRight,
      display: "flex",
      width: "100%",
      marginVertical: "10px",
    }}>

      <View style={{ paddingVertical: "5pt", fontSize: headerFontSize }}>
        <Text>{totalState?.taxSummaryTitle ?? "Tax Summary"}</Text>
      </View>

      <View style={[styles?.theadStyle]}>

        <View style={[styles?.thStyle, { alignItems: "flex-start" }]}>
          <Text>{totalState?.taxDetailsLabel ?? "Tax Details"}</Text>
        </View>

        {totalState?.showTaxableAmountLabel && <View style={[styles?.thStyle, { alignItems: "flex-end" }]}>
          <Text>{totalState?.taxableAmountLabel ?? "Taxable Amount"}</Text>
        </View>}

        {totalState?.showTaxAmountLabel && <View style={[styles?.thStyle, { alignItems: "flex-end" }]}>
          <Text>{totalState?.taxAmountLabel ?? "Tax Amount"}</Text>
        </View>}

        {totalState?.showTotalAmountLabel && <View style={[styles?.thStyle, { alignItems: "flex-end" }]}>
          <Text>{totalState?.totalAmountLabel ?? "Total Amount"}</Text>
        </View>}
      </View>


      {
        taxSplitView()?.map((tax: any) => {
          return <View style={[styles?.trStyle]} wrap={false}>
            <View style={[styles.tdStyle, { alignItems: "flex-start" }]}><Text>{tax?.tax_origin_name}</Text></View>
            {totalState?.showTaxableAmountLabel && <View style={[styles.tdStyle, { alignItems: "flex-end" }]}>
              <Text>{Number((tax?.tax_value / tax?.tax_rate) * 100).toFixed(2)}</Text></View>}

            {totalState?.showTaxAmountLabel && <View style={[styles.tdStyle, { alignItems: "flex-end" }]}>
              <Text>{Number(tax?.tax_value).toFixed(2)}</Text></View>}

            {totalState?.showTotalAmountLabel && <View style={[styles.tdStyle, { alignItems: "flex-end" }]}>
              <Text>{Number(((tax?.tax_value / tax?.tax_rate) * 100) + tax?.tax_value).toFixed(2)}</Text></View>}
          </View>
        })
      }

      <View style={[styles?.trStyle]}>
        <View style={[styles?.tdStyle]}><Text>{totalState?.totalLabel ?? "Total"}</Text></View>
        {totalState?.showTaxableAmountLabel && <View style={[styles.tdStyle, { alignItems: "flex-end" }]}>
          <Text>
            {Number(taxSplitView()?.reduce((accumulator: any, currentValue: any) =>
              accumulator + ((currentValue?.tax_value / currentValue?.tax_rate) * 100), 0)).toFixed(2)}
          </Text>
        </View>}

        {totalState?.showTaxAmountLabel &&
          <View style={[styles.tdStyle, { alignItems: "flex-end" }]}>
            <Text> {Number(taxSplitView()?.reduce((accumulator: any, currentValue: any) => accumulator + currentValue?.tax_value, 0)).toFixed(2)}</Text>
          </View>
        }

        {totalState?.showTotalAmountLabel &&
          <View style={[styles.tdStyle, { alignItems: "flex-end" }]}>
            <Text>
              {Number(taxSplitView()?.reduce((accumulator: any, currentValue: any) =>
                accumulator + (((currentValue?.tax_value / currentValue?.tax_rate) * 100) + currentValue?.tax_value), 0)).toFixed(2)}
            </Text>
          </View>
        }

      </View>
    </View >
  )
}
