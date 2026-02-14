import { InvDetail2ForPrint, PrintDetailDto } from "../../../use-print-type";
import { ItemTableMasterState, TableColumn, TemplateState } from "../../Designer/interfaces";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { containsArabicString } from "../../utils/pdf-util";
import { formatValue } from "../../../use-print";
import { CSSProperties, useMemo } from "react";

type DownTableProps = {
  data: PrintDetailDto[];
  template?: TemplateState<unknown>;
};
const DEFAULT_COLUMN_WIDTH = "10%";

export const SharedDownTable: React.FC<DownTableProps> = ({ data, template }) => {
  const accTableState = (template as any)?.tableState as TableColumn<unknown>[] | undefined;
  const tableMasterState = (template as TemplateState<unknown>)?.itemTableMasterState;
  const HeadFontFamily = tableMasterState?.headerFontFamily || "Roboto";
  const arabicHeadFontFamily = tableMasterState?.arabicHeaderFontFamily ?? "Amiri";
  const rowFontFamily = tableMasterState?.itemRowFontFamily || "Roboto";
  const arabicrowFontFamily = tableMasterState?.arabicItemRowFontFamily ?? "Amiri";
  const ROW_BORDER_WIDTH= tableMasterState?.tableRowBorderWidth ?? 1;
  const COL_BORDER_WIDTH= tableMasterState?.tableColBorderWidth ?? 1;
  const COL_BORDER_STYLE= tableMasterState?.borderColStyle ?? "solid";
  const ROW_BORDER_STYLE= tableMasterState?.borderRowStyle ?? "solid";
  const ROW_BORDER_COLOR= tableMasterState?.tableRowBorderColor ?? "#000";
  const COL_BORDER_COLOR= tableMasterState?.tableColBorderColor ?? "#000";
  
  // compute visible columns once
  const visibleColumns = accTableState?.filter(c => c.show !== false) ?? [];


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
      borderTopWidth: tableMasterState?.showTableRowBorder ? ROW_BORDER_WIDTH : 0,
      borderTopColor: ROW_BORDER_COLOR,
      borderTopStyle:ROW_BORDER_STYLE,
      borderBottomWidth: tableMasterState?.showTableRowBorder ? ROW_BORDER_WIDTH : 0,
      borderBottomColor: ROW_BORDER_COLOR,
      borderBottomStyle:ROW_BORDER_STYLE,
      borderLeftWidth: (tableMasterState?.showTableColBorder) ? COL_BORDER_WIDTH : 0,
      borderLeftColor: COL_BORDER_COLOR,
      borderLeftStyle:COL_BORDER_STYLE,
      borderRightWidth: (tableMasterState?.showTableColBorder) ? COL_BORDER_WIDTH : 0,
      borderRightColor: COL_BORDER_COLOR,
      borderRightStyle:COL_BORDER_STYLE,

    },
    th: {
      padding: 4,
      textAlign: "center",
      justifyContent: "center",
      color: tableMasterState?.headerFontColor || "#000",
      fontSize: tableMasterState?.headerFontSize || 12,
      fontWeight: tableMasterState?.headerFontWeight || 400,
      fontStyle: tableMasterState?.headerFontStyle || "normal",
      lineHeight: 1.2
    },
    tr: {
      flexDirection: "row",
      borderBottomWidth: tableMasterState?.showTableRowBorder ? ROW_BORDER_WIDTH : 0,
      borderBottomColor: ROW_BORDER_COLOR,
      borderBottomStyle:ROW_BORDER_STYLE,
      borderLeftWidth: (tableMasterState?.showTableColBorder) ? COL_BORDER_WIDTH : 0,
      borderLeftColor: COL_BORDER_COLOR,
      borderLeftStyle:COL_BORDER_STYLE,
      borderRightWidth: (tableMasterState?.showTableColBorder) ? COL_BORDER_WIDTH : 0,
      borderRightColor: COL_BORDER_COLOR,
      borderRightStyle:COL_BORDER_STYLE,
      backgroundColor: tableMasterState?.showRowBg
        ? tableMasterState?.itemRowBgColor
        : "#fff",
    },
    td: {
      padding: 4,
      textAlign: "center",
      // flexGrow: 1,
      fontSize: tableMasterState?.itemRowFontSize || 12,
      color: tableMasterState?.itemRowFontColor || "#000",
      fontWeight: tableMasterState?.itemRowFontWeight || 400,
      fontStyle: tableMasterState?.itemRowFontStyle || "normal",
      lineHeight: 1.2,
    },
  });

  const renderHeader = () => (
    <View style={styles.thead} fixed={tableMasterState?.headerRepeatOnPage}>
      {visibleColumns.map((col, idx) => {
        const isArabic = containsArabicString(col.label)
        return (
          <View
            key={String(col.field)}
            style={{
              ...styles.th,
              fontFamily: isArabic ? arabicHeadFontFamily : HeadFontFamily,
              width: col.width || DEFAULT_COLUMN_WIDTH,
              minWidth: col.width || DEFAULT_COLUMN_WIDTH,
              maxWidth: col.width || DEFAULT_COLUMN_WIDTH,
              borderRightWidth: (tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length) ? COL_BORDER_WIDTH : 0,
              borderRightColor: COL_BORDER_COLOR,
              borderRightStyle: COL_BORDER_STYLE ,

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
        <View key={rowIndex} style={styles.tr} wrap={false}>
          {visibleColumns.map((col, idx) => {
            const field = col.field as string;
            const splitData = String(col.field).split("___");
            const group = splitData[0] as any;
            const key = splitData[1];
            let cellValue: any = "";
            row?.[key as keyof PrintDetailDto] ?? "";

            if (!field?.includes("___")) {

              console.log(`col.field-1`);
              if (![
                "cgst",
                "cgstPerc",
                "sgst",
                "sgstPerc",
                "igst",
                "igstPerc",
                "cessAmt",
                "cessPerc",
                "additionalCess",
                "additionalCessPerc",
                "gstPerc"
              ].includes(col.field)) {
                console.log(`col.field-2`);
                cellValue = row?.[field as keyof PrintDetailDto] ?? ""
                console.log(row);


              }
              else {
                console.log(`col.field-3`);
                cellValue = row?.detail2Data?.[col.field as (keyof InvDetail2ForPrint)]

              }
            } else {
              if (group == "details") {
                cellValue = (row?.[key as keyof PrintDetailDto] ?? "");;

              }
              else if (group == "details2") {
                cellValue = row?.detail2Data?.[key as (keyof InvDetail2ForPrint)]

              }
            }


            // Check if text is Arabic
            const isArabic = containsArabicString(cellValue);
            return (
              <View
                key={String(col.field)}
                style={{
                  ...styles.td,
                  fontFamily: isArabic ? arabicrowFontFamily : rowFontFamily,
                  width: col.width || DEFAULT_COLUMN_WIDTH,
                  minWidth: col.width || DEFAULT_COLUMN_WIDTH,
                  maxWidth: col.width || DEFAULT_COLUMN_WIDTH,
                  borderRightWidth: tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length ? COL_BORDER_WIDTH : 0,
                  borderRightColor: COL_BORDER_COLOR,
                  borderRightStyle: COL_BORDER_STYLE,
                }}
              >
                <Text>{formatValue(cellValue, col.format)}</Text>

              </View>
            )

          })}
        </View>
      ))}
    </View>
  );
};
