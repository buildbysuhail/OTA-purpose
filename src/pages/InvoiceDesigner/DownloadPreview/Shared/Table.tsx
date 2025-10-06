import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { TemplateState, TableColumn } from "../../Designer/interfaces";
import { PrintDetailDto } from "../../../use-print-type";

const DEFAULT_COLUMN_WIDTH = "10%";

const normalizeWidth = (widthVal?: string | number): string => {
  if (widthVal === undefined || widthVal === null) return DEFAULT_COLUMN_WIDTH;
  const w = String(widthVal).trim();
  if (w.endsWith("%")) return w;
  return `${w}pt`;
};

type DownTableProps = {
  data: PrintDetailDto[];
  template?: TemplateState<unknown>;
};

const SharedDownTable: React.FC<DownTableProps> = ({ data, template }) => {
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
      marginVertical: 8,
      borderWidth: tableMasterState?.showTableColBorder ? 1 : 0,
      borderColor: tableMasterState?.tableColBorderColor || "#000",
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
    tbody: {
      flexDirection: "column",
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
    },
    cellText: {
      wordBreak: "break-word",
    },
  });

  const renderHeader = () => {
    if (!visibleColumns.length) return null;

    return (
      <View style={styles.thead}>
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
            <Text style={styles.cellText}>{col.label ?? String(col.field)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderBody = () => {
    if (!visibleColumns.length) return null;

    if (!data?.length) {
      return (
        <View style={styles.tbody}>
          <View style={styles.tr}>
            {visibleColumns.map((col, idx) => (
              <View
                key={String(col.field)}
                style={{
                  ...styles.td,
                  flex: 1,
                  maxWidth: normalizeWidth(col.width || DEFAULT_COLUMN_WIDTH),
                  borderRightWidth:
                    tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ? 1 : 0,
                  borderRightColor: tableMasterState?.tableColBorderColor || "#000",
                }}
              >
                <Text style={styles.cellText}>—</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tbody}>
        {data.map((row: any, rowIndex: number) => (
          <View key={rowIndex} style={styles.tr}>
            {visibleColumns.map((col, idx) => (
              <View
                key={String(col.field)}
                style={{
                  ...styles.td,
                  flex: 1,
                  maxWidth: normalizeWidth(col.width || DEFAULT_COLUMN_WIDTH),
                  borderRightWidth:
                    tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ? 1 : 0,
                  borderRightColor: tableMasterState?.tableColBorderColor || "#000",
                }}
              >
                <Text style={styles.cellText}>{row?.[String(col.field)] ?? ""}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default SharedDownTable;
