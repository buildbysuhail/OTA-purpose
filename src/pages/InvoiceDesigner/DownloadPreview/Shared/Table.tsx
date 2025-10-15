import { PrintDetailDto } from "../../../use-print-type";
import { TableColumn, TemplateState } from "../../Designer/interfaces";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

type DownTableProps = {
  data: PrintDetailDto[];
  template?: TemplateState<unknown>;
};
const DEFAULT_COLUMN_WIDTH = "10%";

const normalizeWidth = (widthVal?: string | number): string => {
  if (widthVal === undefined || widthVal === null) return DEFAULT_COLUMN_WIDTH;
  const w = String(widthVal).trim();
  if (w.endsWith("%")) return w;
  return `${w}pt`;
};

 export const SharedDownTable: React.FC<DownTableProps> = ({ data, template }) => {
  const accTableState = (template as any)?.tableState as TableColumn<unknown>[] | undefined;
  const tableMasterState = (template as any)?.itemTableMasterState;
  const propertiesState = (template as any)?.propertiesState;

  const labelFontFamily = propertiesState?.font_family || "Helvetica";
  const labelFontWeight = propertiesState?.label_font_weight || "normal";
  const labelFontStyle = propertiesState?.label_font_style || "normal";

  const visibleColumns = accTableState?.filter((c) => c.show) ?? [];

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "column",
    },
    thead: {
      flexDirection: "row",
      backgroundColor: tableMasterState?.showTableHeaderBg
        ? tableMasterState?.tableHeaderBgColor
        : "#fff",
      color: tableMasterState?.headerFontColor || "#000",
      fontSize: tableMasterState?.headerFontSize || 12,
      borderBottomWidth: tableMasterState?.showTableRowBorder ? 1 : 0,
      borderBottomColor: tableMasterState?.tableRowBorderColor || "#000",
    },
    th: {
      padding: 4,
      textAlign: "center",
      justifyContent: "center",
      fontFamily: labelFontFamily,
      fontWeight: labelFontWeight,
      fontStyle: labelFontStyle,
    },
    tr: {
      flexDirection: "row",
      fontSize: tableMasterState?.itemRowFontSize || 12,
      color: tableMasterState?.itemRowFontColor || "#000",
      borderBottomWidth: tableMasterState?.showTableRowBorder ? 1 : 0,
      borderBottomColor: tableMasterState?.tableRowBorderColor || "#000",
      backgroundColor: tableMasterState?.showRowBg
        ? tableMasterState?.itemRowBgColor
        : "#fff",
    },
    td: {
      padding: 4,
      textAlign: "center",
      fontFamily: labelFontFamily,
      flexGrow: 1,
    },
  });

  const renderHeader = () => (
    <View style={styles.thead} fixed>
      {visibleColumns.map((col, idx) => (
        <View
          key={String(col.field)}
          style={{
            ...styles.th,
            flex: 1,
            maxWidth: normalizeWidth(col.width || DEFAULT_COLUMN_WIDTH),
            borderRightWidth:
              tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ? 1 : 0,
            borderRightColor: tableMasterState?.tableColBorderColor || "#000",
          }}
        >
          <Text>{col.label ?? String(col.field)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {/* ✅ Each row is a separate flowing block so page break works */}
      {data?.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tr} wrap>
          {visibleColumns.map((col, idx) => (
            <View
              key={String(col.field)}
              style={{
                ...styles.td,
                maxWidth: normalizeWidth(col.width || DEFAULT_COLUMN_WIDTH),
                borderRightWidth:tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ? 1 : 0,
                borderRightColor: tableMasterState?.tableColBorderColor || "#000",
              }}
            >
             <Text>{(row as Record<string, any>)?.[String(col.field)] ?? ""}</Text>

            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
