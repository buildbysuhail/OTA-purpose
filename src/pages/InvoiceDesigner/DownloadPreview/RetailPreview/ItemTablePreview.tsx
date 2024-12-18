import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const ItemTablePreview = ({ template, data }: DownloadPreviewProps) => {
  const itemTableState = template?.itemTableState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.tableHeaderBgColor || "#fff";

  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingTop = template?.propertiesState?.padding?.top || 10;

  /// Items
  const ItemsfontSize = itemTableState?.itemRowFontSize;
  const ItemsborderColor = itemTableState?.tableBorderColor;
  const Itemscolor = itemTableState?.itemRowFontColor || "#000";
  const ItemsBackgroundColor = itemTableState?.itemRowBgColor || "#fff";

  return (
    <View style={{ paddingLeft, paddingRight, marginVertical: 10 }}>
      <View
        style={{
          backgroundColor: headerBgColor,
          color: headerFontColor,
          fontSize: headerFontSize,
          display: "flex",
          flexDirection: "row",
          borderWidth: "1px",
          borderStyle: "dashed",
          borderLeft: "none",
          borderRight: "none",
          borderColor: ItemsborderColor,
        }}
      >
        {itemTableState?.showLineItemNumber && (
          <Text
            style={{
              flex: "1",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            #
          </Text>
        )}
        {itemTableState?.showLineItem && (
          <Text
            style={{
              flex: "5",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            {itemTableState?.lineItemLabel}
          </Text>
        )}
        {itemTableState?.showHsnSac && (
          <Text
            style={{
              flex: "3",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            {itemTableState?.hsnSacLabel}
          </Text>
        )}
        {itemTableState?.showQuantity && (
          <Text
            style={{
              flex: "3",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            {itemTableState?.quantityLabel}
          </Text>
        )}
        {itemTableState?.showRate && (
          <Text
            style={{
              flex: "3",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            {itemTableState?.rateLabel}
          </Text>
        )}
        {itemTableState?.showAmount && (
          <Text
            style={{
              flex: "3",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            {itemTableState?.amountLabel}
          </Text>
        )}
      </View>
      <View>
        {data?.items?.map((val: any, index: number) => (
          <View key={index} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around" }} wrap={false}>
            {itemTableState?.showLineItemNumber && (
              <View
                style={{
                  backgroundColor: ItemsBackgroundColor,
                  borderColor: ItemsborderColor,
                  color: Itemscolor,
                  fontSize: ItemsfontSize,
                  borderBottomWidth: itemTableState.showTableBorder ? "1px" : "0px",
                  borderStyle: "dashed",
                  borderLeft: "none",
                  borderRight: "none",
                  flex: "1",
                  height: "auto",
                  padding: "5pt",
                }}
              >
                <Text>{index + 1}</Text>
              </View>
            )}
            {itemTableState?.showLineItem && (
              <View
                style={{
                  backgroundColor: ItemsBackgroundColor,
                  borderColor: ItemsborderColor,
                  color: Itemscolor,
                  fontSize: ItemsfontSize,
                  borderBottomWidth: itemTableState.showTableBorder ? "1px" : "0px",
                  borderStyle: "dashed",
                  borderLeft: "none",
                  borderRight: "none",
                  flex: "5",
                  padding: "5pt",
                }}
              >
                <Text> {val?.item_name}</Text>
                {itemTableState?.showDiscription && <Text> {val?.description}</Text>}
              </View>
            )}
            {itemTableState?.showHsnSac && (
              <View
                style={{
                  backgroundColor: ItemsBackgroundColor,
                  borderColor: ItemsborderColor,
                  color: Itemscolor,
                  fontSize: ItemsfontSize,
                  borderBottomWidth: itemTableState.showTableBorder ? "1px" : "0px",
                  borderStyle: "dashed",
                  borderLeft: "none",
                  borderRight: "none",
                  flex: "3",
                  padding: "5pt",
                }}
              >
                <Text> {val?.hsn_code}</Text>
              </View>
            )}
            {itemTableState?.showQuantity && (
              <View
                style={{
                  backgroundColor: ItemsBackgroundColor,
                  borderColor: ItemsborderColor,
                  color: Itemscolor,
                  fontSize: ItemsfontSize,
                  borderBottomWidth: itemTableState.showTableBorder ? "1px" : "0px",
                  borderStyle: "dashed",
                  borderLeft: "none",
                  borderRight: "none",
                  flex: "3",
                  padding: "5pt",
                }}
              >
                <Text> {val?.qty}</Text>
              </View>
            )}
            {itemTableState?.showRate && (
              <View
                style={{
                  backgroundColor: ItemsBackgroundColor,
                  borderColor: ItemsborderColor,
                  color: Itemscolor,
                  fontSize: ItemsfontSize,
                  borderBottomWidth: itemTableState.showTableBorder ? "1px" : "0px",
                  borderStyle: "dashed",
                  borderLeft: "none",
                  borderRight: "none",
                  flex: "3",
                  padding: "5pt",
                }}
              >
                <Text> {val?.item_rate}</Text>
              </View>
            )}
            {itemTableState?.showAmount && (
              <View
                style={{
                  backgroundColor: ItemsBackgroundColor,
                  borderColor: ItemsborderColor,
                  color: Itemscolor,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: ItemsfontSize,
                  borderBottomWidth: itemTableState.showTableBorder ? "1px" : "0px",
                  borderStyle: "dashed",
                  borderLeft: "none",
                  borderRight: "none",
                  flex: "3",
                }}
              >
                <Text> {val?.total_price}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ItemTablePreview;
