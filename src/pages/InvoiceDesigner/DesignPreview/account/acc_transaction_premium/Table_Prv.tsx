import React, { useMemo } from "react";
import type { CSSProperties } from "react";
import type { TableColumn, TemplateState } from "../../../Designer/interfaces";
import type { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

const DEFAULT_COLUMN_WIDTH = "10%";

const normalizeWidth = (widthVal?: string | number): string => {
  if (widthVal === undefined || widthVal === null) return DEFAULT_COLUMN_WIDTH;
  const w = String(widthVal).trim();
  if (w.endsWith("%") || w.endsWith("px")) return w;
  return `${w}px`;
};

const getCellStyle = (base: CSSProperties, width?: string | number): CSSProperties => {
  const w = normalizeWidth(width);
  return {
    ...base,
    width: w,
    minWidth: w,
    maxWidth: w,
    boxSizing: "border-box",
  };
};

type AccPrvTableProps = {
  data: any[];
  template?: TemplateState<unknown>;
};

const AccPrvTable: React.FC<AccPrvTableProps> = ({ data, template }) => {
  const accTableState = (template as any)?.tableState as TableColumn<unknown>[] | undefined;
  const tableMasterState = (template as any)?.itemTableMasterState;
  const propertiesState = (template as any)?.propertiesState;

  // label font preferences from propertiesState
  const labelStylesBase: CSSProperties = {
    fontWeight: propertiesState?.label_font_weight ?? undefined,
    fontStyle: propertiesState?.label_font_style ?? undefined,
    fontFamily: propertiesState?.font_family ?? undefined,
  };

  // compute visible columns once
  const visibleColumns = useMemo(() => {
    if (!accTableState) return [];
    return accTableState.filter((c) => c.show);
  }, [accTableState]);

  // component-level styles (DOM-friendly)
  const styles = useMemo(() => {
    const borderTop = tableMasterState?.showTableRowBorder
      ? `1px solid ${tableMasterState?.tableRowBorderColor || "#000"}`
      : undefined;
    const borderBottom = tableMasterState?.showTableRowBorder
      ? `1px solid ${tableMasterState?.tableRowBorderColor || "#000"}`
      : undefined;
    const borderLeft = tableMasterState?.showTableColBorder
      ? `1px solid ${tableMasterState?.tableColBorderColor || "#000"}`
      : undefined;
    const borderRight = tableMasterState?.showTableColBorder
      ? `1px solid ${tableMasterState?.tableColBorderColor || "#000"}`
      : undefined;

    const commonTh: CSSProperties = {
      padding: 6,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flexWrap: "wrap",
      // prevent overflow and allow wrapping
      overflow: "hidden",
    };

    return {
      container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 10,
        marginTop: 10,
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
        color: tableMasterState?.headerFontColor || "#000",
        fontSize: tableMasterState?.headerFontSize || 12,
        borderBottom: tableMasterState?.showTableRowBorder
          ? `1px solid ${tableMasterState?.tableRowBorderColor || "#000"}`
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
        color: tableMasterState?.itemRowFontColor || "#000",
        fontSize: tableMasterState?.itemRowFontSize || 12,
        borderBottom: tableMasterState?.showTableRowBorder
          ? `1px solid ${tableMasterState?.tableRowBorderColor || "#000"}`
          : undefined,
        backgroundColor: tableMasterState?.showRowBg ? tableMasterState?.itemRowBgColor : "#fff",
      } as CSSProperties,
      td: {
        padding: 6,
        textAlign: "center",
        overflow: "hidden",
      } as CSSProperties,
      // cellText for DOM: allow wrapping and hyphenation
      cellText: {
        ...labelStylesBase,
        overflowWrap: "break-word",
        wordBreak: "break-word",
        hyphens: "auto" as CSSProperties["hyphens"],
      } as CSSProperties,
    };
  }, [tableMasterState, propertiesState, labelStylesBase]);

  // header render
  const renderHeader = () => {
    if (!visibleColumns.length) return null;

    return (
      <div style={styles.thead}>
        {visibleColumns.map((col, idx) => {
          const borderRight =
            tableMasterState?.showTableColBorder && idx + 1 < visibleColumns.length
              ? `1px solid ${tableMasterState?.tableColBorderColor || "#000"}`
              : undefined;

          return (
            <div
              key={String(col.field)}
              style={{
                ...getCellStyle(styles.th, col.width || DEFAULT_COLUMN_WIDTH),
                borderRight,
              }}
            >
              <span style={styles.cellText}>{col.label ?? String(col.field)}</span>
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
                style={getCellStyle(styles.td, col.width || DEFAULT_COLUMN_WIDTH)}
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
        {data.map((row: any, rowIndex: number) => (
          <div key={rowIndex} style={styles.tr}>
            {visibleColumns.map((col) => (
              <div
                key={String(col.field)}
                style={getCellStyle(styles.td, col.width || DEFAULT_COLUMN_WIDTH)}
              >
                <span style={styles.cellText}>
                  {/* safely access value */}
                  {row?.[String(col.field)] ?? ""}
                </span>
              </div>
            ))}
          </div>
        ))}
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

export default AccPrvTable;
