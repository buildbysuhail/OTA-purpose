import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const TotalSummaryPreview = ({ template, data, currencySymbol, totalAmountInwords }: DownloadPreviewProps) => {
  ///Total Summary
  const totalState = template?.totalState;

  const itemTableState = template?.itemTableState;

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left;
  const paddingRight = template?.propertiesState?.margins?.right;

  const totalSummaryBackgroundColor = template?.totalState?.totalBgColor || "#fff";
  const wordsBackgroudColor = template?.totalState?.balanceBgColor || "#fff";
  const totalSummaryfontSize = template?.totalState?.totalFontSize || 12;
  const totalSummarycolor = template?.totalState?.totalFontColor || "#000";
  const balnceFontSize = template?.totalState?.balanceFontSize || 12;

  const ItemsborderColor = itemTableState?.tableBorderColor;

  return (
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
          width: "100%",
          height: "100%",
        }}
      >
        {totalState?.showTotalSection && (
          <View>
            <View
              style={{
                backgroundColor: totalSummaryBackgroundColor,
                fontSize: totalSummaryfontSize,
                display: "flex",
              }}
            >
              {totalState.showSubTotalLabel && data?.sub_total !== undefined && (
                <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                  <View style={{ width: "50%" }}>
                    <Text>{totalState.subTotalLabel}</Text>
                  </View>
                  <View style={{ width: "50%", textAlign: "right" }}>
                    <Text>
                      {currencySymbol} {Number(data?.sub_total).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {data?.discount_price !== undefined && (
                <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                  <View style={{ width: "50%" }}>
                    <Text>Discount</Text>
                  </View>
                  <View style={{ width: "50%", textAlign: "right" }}>
                    <Text>
                      {currencySymbol} {Number(data?.discount_price).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {totalState.showTax && data?.total_tax_amount !== undefined && (
                <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                  <View style={{ width: "50%" }}>
                    <Text>Tax</Text>
                  </View>
                  <View style={{ width: "50%", textAlign: "right" }}>
                    <Text>
                      {currencySymbol} {Number(data?.total_tax_amount).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {data?.total_price !== undefined && (
                <View
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    fontWeight: "ultrabold",
                    paddingBottom: "10pt",
                    marginBottom: "10pt",
                    paddingTop: "10pt",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: ItemsborderColor,
                    borderRight: "none",
                    borderLeft: "none",
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <Text>Total</Text>
                  </View>
                  <View style={{ width: "50%", textAlign: "right" }}>
                    <Text>
                      {currencySymbol} {Number(data?.total_price).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {data?.paid_amount !== undefined && (
                <View style={{ display: "flex", width: "100%", flexDirection: "row", paddingBottom: "10pt" }}>
                  <View style={{ width: "50%" }}>
                    <Text>Amount Paid</Text>
                  </View>
                  <View style={{ width: "50%", textAlign: "right" }}>
                    <Text>
                      {currencySymbol} {Number(data?.paid_amount).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            {totalState && data?.balance_due !== undefined && (
              <View
                style={{
                  backgroundColor: wordsBackgroudColor,
                  fontSize: balnceFontSize,
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text>Amount Due</Text>
                </View>
                <View style={{ width: "50%", textAlign: "right" }}>
                  <Text>
                    {currencySymbol} {Number(data?.balance_due).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
            {data?.total_price !== undefined && (
              <View
                style={{
                  color: totalSummarycolor,
                  fontSize: totalSummaryfontSize,
                  paddingVertical: "15pt",
                }}
              >
                <Text>Total In Words:</Text>
                <Text
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {totalAmountInwords}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default TotalSummaryPreview;
