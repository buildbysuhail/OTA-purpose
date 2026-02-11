import React, { useMemo } from "react";
import type { CSSProperties } from "react";
import type { TableColumn, TemplateState } from "../../Designer/interfaces";
import { InvDetail2ForPrint, PrintDetailDto } from "../../../use-print-type";
import { containsArabicString } from "../../utils/pdf-util";
import { formatValue } from "../../../use-print";

const DEFAULT_COLUMN_WIDTH = "10%";
const TABLE_CELL_PADDING = 4; // Must match PDF padding: 4
 // Must match PDF borderWidth: 1

type AccPrvTableProps = {
  data: PrintDetailDto[];
  template?: TemplateState<unknown>;
  isAutoHeight?: boolean;
};

const SharedPrvTable: React.FC<AccPrvTableProps> = ({ data, template,isAutoHeight }) => {
  const accTableState = (template as TemplateState<unknown>)?.tableState as TableColumn<unknown>[] | undefined;
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
  
  // label font preferences from propertiesState
  const HeaderFontBase: CSSProperties = {
    fontWeight: tableMasterState?.headerFontWeight ?? undefined,
    fontStyle: tableMasterState?.headerFontStyle ?? undefined,
    color: tableMasterState?.headerFontColor || "#000",
    fontSize: `${tableMasterState?.headerFontSize ?? 12}pt`,
    lineHeight: 1.2,
  };

  const RowFontBase: CSSProperties = {
    fontWeight: tableMasterState?.itemRowFontWeight ?? undefined,
    fontStyle: tableMasterState?.itemRowFontStyle ?? undefined,
    color: tableMasterState?.itemRowFontColor || "#000",
    fontSize: `${tableMasterState?.itemRowFontSize ?? 12}pt`,
    lineHeight: 1.2,
  };


  // compute visible columns once
  const visibleColumns = useMemo(() => {
    if (!accTableState) return [];
    return accTableState.filter((c) => c.show);
  }, [accTableState]);
  //preview rows
const rows = useMemo(() => {
  return isAutoHeight
    ? data
    : data.slice(0, 3);
}, [data, isAutoHeight]);

  // component-level styles (DOM-friendly)
  const styles = useMemo(() => {
    const borderTop = tableMasterState?.showTableRowBorder
      ? `${ROW_BORDER_WIDTH}pt  ${ROW_BORDER_STYLE}  ${ROW_BORDER_COLOR}`
      : undefined;
    const borderBottom = tableMasterState?.showTableRowBorder
      ? `${ROW_BORDER_WIDTH}pt  ${ROW_BORDER_STYLE}  ${ROW_BORDER_COLOR}`
      : undefined;
    const borderLeft = tableMasterState?.showTableColBorder
      ? `${COL_BORDER_WIDTH}pt  ${COL_BORDER_STYLE}  ${COL_BORDER_COLOR}`
      : undefined;
    const borderRight = tableMasterState?.showTableColBorder
      ? `${COL_BORDER_WIDTH}pt  ${COL_BORDER_STYLE}  ${COL_BORDER_COLOR}`
      : undefined;

    const commonTh: CSSProperties = {
      padding: `${TABLE_CELL_PADDING}pt`,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      // prevent overflow and allow wrapping
      overflow: "hidden",
      boxSizing: "border-box",
      // Prevent flex from changing dimensions
      flexShrink: 0,
      flexGrow: 0,
    };

    return {
      container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 0,
        marginTop: 0,
        borderTop,
        borderBottom,
        borderLeft,
        borderRight,
        boxSizing: "border-box",
      } as CSSProperties,
      thead: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: tableMasterState?.showTableHeaderBg
          ? tableMasterState?.tableHeaderBgColor
          : "#fff",

        borderBottom: tableMasterState?.showTableRowBorder
          ? `${ROW_BORDER_WIDTH}pt ${ROW_BORDER_STYLE} ${ROW_BORDER_COLOR}`
          : undefined,

      } as CSSProperties,
      th: commonTh as CSSProperties,
      tbody: {
        display: "flex",
        flexDirection: "column",

      } as CSSProperties,
      tr: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: tableMasterState?.showRowBg ? tableMasterState?.itemRowBgColor : "#fff",
      } as CSSProperties,
      td: {
        padding: `${TABLE_CELL_PADDING}pt`,
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        // Prevent flex from changing dimensions
        flexShrink: 0,
        flexGrow: 0,
      } as CSSProperties,
      // cellText for DOM: allow wrapping and hyphenation
      cellText: {
        // ...labelStylesBase,
        overflowWrap: "break-word",
        wordBreak: "break-word",
        hyphens: "auto" as CSSProperties["hyphens"],
        margin: 0,
        padding: 0,
      } as CSSProperties,
    };
  }, [tableMasterState]);

  // header render
  const renderHeader = () => {
    if (!visibleColumns.length) return null;

    return (
      <div style={styles.thead}>
        {visibleColumns.map((col, idx) => {
          const borderRight =
            tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length
              ? `${COL_BORDER_WIDTH}pt ${COL_BORDER_STYLE} ${COL_BORDER_COLOR}`
              : undefined;
          const text = col.label ?? String(col.field)
          const isArabic = containsArabicString(text)
          return (
            <div
              key={String(col.field)}
              style={{
                ...styles.th,
                width: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                minWidth: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                maxWidth: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                borderRight,
              }}
            >
              <span
                style={{
                  ...HeaderFontBase,
                  fontFamily: isArabic ? arabicHeadFontFamily : HeadFontFamily,
                  ...styles.cellText
                }}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // body render (example)
  const renderBody = () => {
    if (!visibleColumns.length) return null;
    if (!data?.length) {
      // empty rows or placeholder
      return (
        <div style={styles.tbody}>
          <div style={styles.tr}>
            {visibleColumns.map((col) => (
              <div
                key={String(col.field)}
                style={{
                  ...styles.td,
                  width: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                  minWidth: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                  maxWidth: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                }}
              >
                <span style={styles.cellText}>—</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.tbody}>
        {rows?.map((row: any, rowIndex: number) => (

          <div key={rowIndex}
            style={{
              ...styles.tr,
              borderBottom: tableMasterState?.showTableRowBorder && rowIndex + 1 < data.length
                ? `${ROW_BORDER_WIDTH}pt ${ROW_BORDER_STYLE} ${ROW_BORDER_COLOR}`
                : undefined,
            }}>
            {visibleColumns.map((col, index) => {
              const borderRight =
                tableMasterState?.showTableColBorder && index + 1 < visibleColumns.length
                  ? `${COL_BORDER_WIDTH}pt ${COL_BORDER_STYLE} ${COL_BORDER_COLOR}`
                  : undefined;
              // Get cell value
              console.log(`col.field-${col.field}`);

              const splitData = String(col.field).split("___");
              const field = col.field as string;
              const group = splitData[0] as any;
              const key = splitData[1];
              let cellValue = ""; row?.[String(key)] ?? "";
              if (!field.includes("___")) {

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
                  cellValue = row?.[String(col.field)] ?? ""
                  console.log(row);


                }
                else {
                  console.log(`col.field-3`);
                  cellValue = row?.detail2Data?.[col.field as (keyof InvDetail2ForPrint)]

                }
              } else {
                console.log(`col.field-4`);
                if (group == "details") {
                  console.log(`col.field-5`);
                  cellValue = row?.[String(key)] ?? ""

                }
                else if (group == "details2") {
                  console.log(`col.field-6`);
                  cellValue = row?.detail2Data?.[key as (keyof InvDetail2ForPrint)]

                }
              }
              // Check if text is Arabic
              const isArabic = containsArabicString(cellValue);
              return (
                <div
                  key={String(col.field)}
                  style={{
                    ...styles.td,
                    width: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                    minWidth: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                    maxWidth: `${col.width}pt` || DEFAULT_COLUMN_WIDTH,
                    borderRight
                  }}
                >
                  <span
                    style={{
                      ...RowFontBase,
                      fontFamily: isArabic ? arabicrowFontFamily : rowFontFamily,
                      ...styles.cellText
                    }}>
                    {/* safely access value */}
                    {/* {formatValue(cellValue,col.format)}  */}
                    {cellValue}
                  </span>
                </div>
              )

            })}
          </div>
        ))}
        <span>{``}</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

export default SharedPrvTable;
