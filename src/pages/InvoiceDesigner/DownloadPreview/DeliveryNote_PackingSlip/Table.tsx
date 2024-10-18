import { View, Text } from "@react-pdf/renderer";
import { DNSPTEmpProps } from ".";

const Table = ({ data, template }: DNSPTEmpProps) => {
  const itemTableState = template?.itemTableState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.tableHeaderBgColor || "#fff";

  /// Items
  const ItemsfontSize = itemTableState?.itemRowFontSize;
  const ItemsborderColor = itemTableState?.tableBorderColor;
  const Itemscolor = itemTableState?.itemRowFontColor || "#000";
  const ItemsBackgroundColor = itemTableState?.itemRowBgColor || "#fff";
  return (
    <View>
      <View
        style={{
          backgroundColor: headerBgColor,
          color: headerFontColor,
          fontSize: headerFontSize,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
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
          <Text>#</Text>
        </View>
        <View
          style={{
            flex: "5",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            alignContent: "flex-start",
            padding: "5pt",
          }}
        >
          <Text>
            {/* {preference?.item || "Item"} & {preference?.description || "Description"} */}
          </Text>
        </View>
        <View
          style={{
            flex: "3",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            alignContent: "flex-end",
            padding: "5pt",
          }}
        >
          {/* <Text>{preference?.quantity || "Qty"}</Text> */}
        </View>
      </View>
      <View>
        {data?.items?.map((val: any, index: number) => (
          <View key={index} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around" }} wrap={false}>
            <View
              style={{
                flex: "1",
                height: "auto",
                padding: "5pt",
                display: "flex",
                color: Itemscolor,
                flexDirection: "row",
                fontSize: ItemsfontSize,
                justifyContent: "center",
                borderColor: ItemsborderColor,
                backgroundColor: ItemsBackgroundColor,
                borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
              }}
            >
              <Text>{index + 1}</Text>
            </View>
            <View
              style={{
                flex: "5",
                padding: "5pt",
                display: "flex",
                color: Itemscolor,
                flexDirection: "row",
                fontSize: ItemsfontSize,
                justifyContent: "flex-start",
                borderColor: ItemsborderColor,
                backgroundColor: ItemsBackgroundColor,
                borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
              }}
            >
              <Text>{val?.item_name}</Text>
              <View />
              <Text style={{ color: "gray" }}>{val?.description}</Text>
            </View>
            <View
              style={{
                flex: "3",
                padding: "5pt",
                display: "flex",
                color: Itemscolor,
                flexDirection: "row",
                fontSize: ItemsfontSize,
                justifyContent: "flex-end",
                borderColor: ItemsborderColor,
                backgroundColor: ItemsBackgroundColor,
                borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
              }}
            >
              <Text> {val?.qty}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Table;
