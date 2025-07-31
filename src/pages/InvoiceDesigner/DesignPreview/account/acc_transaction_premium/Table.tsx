import { TemplateState } from "../../../Designer/interfaces";
import type { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";
import { StyleSheet } from "@react-pdf/renderer";

const Table = ({ data, template }: { data: any; template?: TemplateState<unknown> }) => {
  const accTableState = template?.accTableState;
  const propertiesState = template?.propertiesState;
  // Default column width (in percentage) if not specified
  const DEFAULT_COLUMN_WIDTH = "10%";
  const labelStyles = {
    fontWeight: propertiesState?.label_font_weight,
    fontStyle: propertiesState?.label_font_style,
    fontFamily: propertiesState?.font_family,
  };
  const normalizeWidth = (widthVal: string | number): string => {
    const w = widthVal.toString().trim();
    if (w.endsWith("%") || w.endsWith("px")) {
      return w;
    }
    return `${w}px`;
  };

  const styles = StyleSheet.create({
    table: {
      width: "100%",
      display: "flex",
      marginBottom: 10,
      marginTop: 10,
      borderTop: accTableState?.showTableRowBorder
        ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
        : "none",
      borderBottom: accTableState?.showTableRowBorder
        ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
        : "none",
      borderLeft: accTableState?.showTableColBorder
        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
        : "none",
      borderRight: accTableState?.showTableColBorder
        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
        : "none",
    },
    thead: {
      backgroundColor: accTableState?.showTableHeaderBg
        ? accTableState?.tableHeaderBgColor
        : "#fff",
      color: accTableState?.headerFontColor || "#000",
      fontSize: accTableState?.headerFontSize || 12,
      flexDirection: "row",
      borderBottom: accTableState?.showTableRowBorder
        ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
        : "none",
    },
    th: {
      padding: 4,
      textAlign: "center",
      // display: "flex",
      // flexDirection: "column",
      // justifyContent: "center",
      // flexWrap: "wrap", 
    },
    tbody: {
      flexDirection: "column",
    },
    tr: {
      flexDirection: "row",
      color: accTableState?.itemRowFontColor || "#000",
      fontSize: accTableState?.itemRowFontSize || 12,
      borderBottom: accTableState?.showTableRowBorder
        ? `1px solid ${accTableState?.tableRowBorderColor || "#000"}`
        : "none",
      backgroundColor: accTableState?.showRowBg
        ? accTableState?.itemRowBgColor
        : "#fff",
    },
    td: {
      padding: 4,
      textAlign: "center",     // allow body text to wrap

    },
    cellText: {
      // ...labelStyles,
      // wordWrap: "break-word",
      // overflowWrap: "break-word",
      // hyphens: "auto",
    },
  });

  // Function to get the total number of visible columns
  const getVisibleColumnsCount = () => {
    let count = 0;
    if (accTableState?.showLineItemNumber) count++;
    if (accTableState?.showLedgerCode) count++;
    if (accTableState?.showLedger) count++;
    if (accTableState?.showAmount) count++;
    if (accTableState?.showNarration) count++;
    if (accTableState?.showBillwiseDetails) count++;
    if (accTableState?.showDiscount) count++;
    if (accTableState?.showCostCenter) count++;
    if (accTableState?.showAmountFc) count++;
    if (accTableState?.showBankCharge) count++;
    return count;
  };

  // Helper function to create cell style with proper width constraints
  const getCellStyle = (baseStyle: any, width: string | number) => {
    const w = normalizeWidth(width);
    return {
      ...baseStyle,
      width: w,
      minWidth: w,
      maxWidth: w,
    };
  };

  // Function to Render the Table Header
  const renderHeader = () => {
    const visibleColumns = getVisibleColumnsCount();
    let columnIndex = 0;

    return (
      // <div style={styles.thead} fixed={accTableState?.headerRepeatOnPage}>
      <div style={styles.thead} >
        {accTableState?.showLineItemNumber && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.lineItemNumberWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.lineItemNumberLabel || "SiNo"}</span>
          </div>
        )}
        {accTableState?.showLineItemNumber && (columnIndex += 1)}
        {accTableState?.showLedgerCode && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.ledgerCodeWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.ledgerCodeLabel || "Ledger code"}</span>
          </div>
        )}
        {accTableState?.showLedgerCode && (columnIndex += 1)}
        {accTableState?.showLedger && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.ledgerWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.ledgerLabel || "Ledger"}</span>
          </div>
        )}
        {accTableState?.showLedger && (columnIndex += 1)}
        {accTableState?.showAmount && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.amountWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.amountLabel || "Amount"}</span>
          </div>
        )}
        {accTableState?.showAmount && (columnIndex += 1)}
        {accTableState?.showNarration && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.narrationWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.narrationLabel || "Narration"}</span>
          </div>
        )}
        {accTableState?.showNarration && (columnIndex += 1)}
        {accTableState?.showBillwiseDetails && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.billwiseDetailsWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.billwiseDetailsLabel || "Bill wise details"}</span>
          </div>
        )}
        {accTableState?.showBillwiseDetails && (columnIndex += 1)}
        {accTableState?.showDiscount && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.discountWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.discountLabel || "Discount"}</span>
          </div>
        )}
        {accTableState?.showDiscount && (columnIndex += 1)}
        {accTableState?.showCostCenter && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.costCenterWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.costCenterLabel || "Cost Center"}</span>
          </div>
        )}
        {accTableState?.showCostCenter && (columnIndex += 1)}
        {accTableState?.showAmountFc && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.amountFcWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.amountFcLabel || "AmountFc"}</span>
          </div>
        )}
        {accTableState?.showAmountFc && (columnIndex += 1)}
        {accTableState?.showBankCharge && (
          <div
            style={{
              ...getCellStyle(styles.th, accTableState?.bankChargeWidth || DEFAULT_COLUMN_WIDTH),
              borderRight:
                accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                  ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                  : "none",
            }}>
            <span style={styles.cellText}>{accTableState?.bankChargeLabel || "Bank Charge"}</span>
          </div>
        )}
      </div>
    );
  };

  // Calculate how many rows we actually have
  const rowCount = data?.details?.length || 0;
  const visibleColumns = getVisibleColumnsCount();

  return (
    // <div style={{ ...styles.table, ...labelStyles }} wrap>
    <div style={{ ...styles.table, ...labelStyles }}>
      {/* Table Header */}
      {renderHeader()}

      {/* Table Body */}
      <div style={styles.tbody}>
        {data?.details?.map((item: AccTransactionRow, index: number) => {
          let columnIndex = 0;
          return (
            <div
              key={`tbr${index}`}
              style={{
                ...styles.tr,
                ...(index + 1 === rowCount && accTableState?.showTableRowBorder
                  ? { borderBottom: "none" }
                  : {}),
              }}>
              {accTableState?.showLineItemNumber && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.lineItemNumberWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.slNo}</span>
                </div>
              )}
              {accTableState?.showLineItemNumber && (columnIndex += 1)}
              {accTableState?.showLedgerCode && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.ledgerCodeWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.ledgerCode}</span>
                </div>
              )}
              {accTableState?.showLedgerCode && (columnIndex += 1)}
              {accTableState?.showLedger && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.ledgerWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.ledgerName}</span>
                </div>
              )}
              {accTableState?.showLedger && (columnIndex += 1)}
              {accTableState?.showAmount && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.amountWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{`${item.amount || ""}5142543`}</span>
                </div>
              )}
              {accTableState?.showAmount && (columnIndex += 1)}
              {accTableState?.showNarration && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.narrationWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.narration || (50 + index * 10).toFixed(2)}</span>
                </div>
              )}
              {accTableState?.showNarration && (columnIndex += 1)}
              {accTableState?.showBillwiseDetails && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.billwiseDetailsWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.billwiseDetails || (20 + index * 5).toFixed(2)}</span>
                </div>
              )}
              {accTableState?.showBillwiseDetails && (columnIndex += 1)}
              {accTableState?.showDiscount && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.discountWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.discount || (800 + index * 200).toFixed(2)}</span>
                </div>
              )}
              {accTableState?.showDiscount && (columnIndex += 1)}
              {accTableState?.showCostCenter && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.costCenterWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{(800 + index * 200).toFixed(2)}</span>
                </div>
              )}
              {accTableState?.showCostCenter && (columnIndex += 1)}
              {accTableState?.showAmountFc && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.amountFcWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{(800 + index * 200).toFixed(2)}</span>
                </div>
              )}
              {accTableState?.showAmountFc && (columnIndex += 1)}
              {accTableState?.showBankCharge && (
                <div
                  style={{
                    ...getCellStyle(styles.th, accTableState?.bankChargeWidth || DEFAULT_COLUMN_WIDTH),
                    borderRight:
                      accTableState?.showTableColBorder && columnIndex + 1 < visibleColumns
                        ? `1px solid ${accTableState?.tableColBorderColor || "#000"}`
                        : "none",
                  }}>
                  <span style={styles.cellText}>{item.bankCharge || (800 + index * 200).toFixed(2)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;