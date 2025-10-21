import { PrintDetailDto } from "../../../use-print-type";
import { ItemTableMasterState, TableColumn, TemplateState } from "../../Designer/interfaces";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { containsArabicString } from "../../utils/pdf-util";

type DownTableProps = {
  data: PrintDetailDto[];
  template?: TemplateState<unknown>;
};
const DEFAULT_COLUMN_WIDTH = "10%";

 export const SharedDownTable: React.FC<DownTableProps> = ({ data, template }) => {
  const accTableState = (template as any)?.tableState as TableColumn<unknown>[] | undefined;
  const tableMasterState = (template as TemplateState<unknown>)?.itemTableMasterState;

  const HeadFontFamily = tableMasterState?.headerFontFamily || "Roboto";
  const arabicHeadFontFamily = tableMasterState?.arabicHeaderFontFamily?? "Amiri";
  const rowFontFamily = tableMasterState?.itemRowFontFamily || "Roboto";
  const arabicrowFontFamily = tableMasterState?.arabicItemRowFontFamily?? "Amiri";
 const property =  template?.propertiesState
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
    borderTopWidth: tableMasterState?.showTableRowBorder ? 1 : 0,
    borderTopColor: tableMasterState?.tableRowBorderColor || "#000",
    borderBottomWidth: tableMasterState?.showTableRowBorder ? 1 : 0,
    borderBottomColor: tableMasterState?.tableRowBorderColor || "#000",
    borderLeftWidth:(tableMasterState?.showTableColBorder)? 1 : 0,
    borderLeftColor: tableMasterState?.tableColBorderColor || "#000",  
    borderRightWidth:(tableMasterState?.showTableColBorder)? 1 : 0,
    borderRightColor: tableMasterState?.tableColBorderColor || "#000",     

    },
    th: {
      padding: 4,
      textAlign: "center",
      justifyContent: "center",
      color: tableMasterState?.headerFontColor || "#000",
      fontSize: tableMasterState?.headerFontSize || 12,
      fontWeight: tableMasterState?.headerFontWeight || 400,
      fontStyle:  tableMasterState?.headerFontStyle || "normal",
    },
    tr: {
      flexDirection: "row",
      borderBottomWidth: tableMasterState?.showTableRowBorder ? 1 : 0,
      borderBottomColor: tableMasterState?.tableRowBorderColor || "#000",
      borderLeftWidth:(tableMasterState?.showTableColBorder)? 1 : 0,
      borderLeftColor: tableMasterState?.tableColBorderColor || "#000",  
      borderRightWidth:(tableMasterState?.showTableColBorder)? 1 : 0,
      borderRightColor: tableMasterState?.tableColBorderColor || "#000",         
      backgroundColor: tableMasterState?.showRowBg
        ? tableMasterState?.itemRowBgColor
        : "#fff",
    },
    td: {
      padding: 4,
      textAlign: "center",
      flexGrow: 1,
      fontSize: tableMasterState?.itemRowFontSize || 12,
      color: tableMasterState?.itemRowFontColor || "#000",
      fontWeight: tableMasterState?.itemRowFontWeight || 400,
      fontStyle:  tableMasterState?.itemRowFontStyle || "normal",      
    },
  });

  const renderHeader = () => (
    <View style={styles.thead} fixed={tableMasterState?.headerRepeatOnPage}>
      {visibleColumns.map((col, idx) => {
        const isArabic = containsArabicString(col.label)
        return(
        <View
          key={String(col.field)}
          style={{
            ...styles.th,
            fontFamily:isArabic ? arabicHeadFontFamily: HeadFontFamily,
            flex: 1,
            maxWidth:col.width || DEFAULT_COLUMN_WIDTH,
            borderRightWidth:(tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ) ? 1 : 0,
            borderRightColor: tableMasterState?.tableColBorderColor || "#000",
          
          }}
        >
          <Text>{col.label ?? String(col.field)}</Text>
        </View>
        )

       })}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {/* ✅ Each row is a separate flowing block so page break works */}
      {data?.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tr} wrap>
          {visibleColumns.map((col, idx) => {
   // Get cell value
      const cellValue = (row as Record<string, any>)?.[String(col.field)] ?? "";

      // Check if text is Arabic
        const isArabic = containsArabicString(cellValue);
            return(
            <View
              key={String(col.field)}
              style={{
                ...styles.td,
                fontFamily:isArabic ? arabicrowFontFamily: rowFontFamily,
                maxWidth: col.width || DEFAULT_COLUMN_WIDTH,
                borderRightWidth:tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ? 1 : 0,
                borderRightColor: tableMasterState?.tableColBorderColor || "#000",
              }}
            >
             <Text>{cellValue}</Text>

            </View>
            )

         })}
        </View>
      ))}
    </View>
  );
};
