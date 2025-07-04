"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useMemo,
  Ref,
} from "react";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import Input from "./erp-grid-input";
import { GripVertical } from "lucide-react";
import GridPreferenceChooser from "../erp-gridpreference";
import type {
  DevGridColumn,
  GridPreference,
} from "../../types/dev-grid-column";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import {
  applyGridColumnPreferences,
  getInitialPreference,
} from "../../../utilities/dx-grid-preference-updater";
import type {
  FormElementState,
  TransactionDetail,
} from "../../../pages/inventory/transactions/purchase/transaction-types";
import {
  formStateHandleFieldChange,
  formStateTransactionDetailsRowUpdate,
} from "../../../pages/inventory/transactions/purchase/reducer";
import { useSelector } from "react-redux";
import useDebounce from "../../../pages/inventory/transactions/purchase/use-debounce";
import { generateUniqueKey } from "../../../utilities/Utils";

import "../../../assets/css/loader-style.css"; 
type DataItem = Record<string, any>;
export interface SummaryConfig<T = any> {
  column: keyof T;
  summaryType: "sum" | "min" | "max" | "avg" | "count" | "custom";
  valueFormat?: string;
  displayFormat?: string;
  showInColumn?: string;
  alignment?: "center" | "left" | "right";
  customizeText?: (itemInfo: { value: any }) => string;
}

interface DataGridProps<T extends DataItem> {
  columns?: DevGridColumn[];
  keyField: string;
  gridId: string;
  className?: string;
  transactionType?: string;
  rowHeight?: number;
  height?: number;
  isLoading?: boolean;
  onAddData?: (newItem: T) => void;
  onChange: (
    value: any,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  onKeyDown: (
    value: any,
    e: React.KeyboardEvent<HTMLElement>,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  allowColumnReordering?: boolean;
  summaryConfig?: SummaryConfig<TransactionDetail>[];
  gridFontSize?: number;
  gridIsBold?: boolean;
  gridBorderColor?: string;
  gridHeaderBg?: string;
}

interface EditableCellProps {
  rowIndex: number;
  column: DevGridColumn;
  value: string | number;
  onFocus: () => void;
  onBlur: () => void;
  gridId: string;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLElement>,
    column: DevGridColumn,
    rowIndex: number
  ) => void;
  onChange: (
    value: any,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  blockUnitOnDecimalPoint: boolean;
  decimalLimit: number;
  productId: number;
  gridFontSize: number;
  gridIsBold: boolean;
}

interface DragState {
  isDragging: boolean;
  draggedColumn: string | null;
  draggedIndex: number | null;
  dropPosition: number | null;
  startX: number;
  startY: number;
}

interface RowData {
  details: TransactionDetail[];
  columns: DevGridColumn[];
  tableWidth: number;
  txtData: Partial<FormElementState>;
  gridId: string;
  listRef: React.RefObject<List>;
  itemCount: number;
  gridRef: React.RefObject<HTMLDivElement>;
  onKeyDown: (
    value: any,
    e: React.KeyboardEvent<HTMLElement>,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  onChange: (
    value: any,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  useInSearch?: boolean;
  useCodeSearch?: boolean;
  advancedProductSearching?: boolean;
  transactionType?: string;
  blockUnitOnDecimalPoint: boolean;
  focusCell: (targetRow: number, targetColumnIndex: number) => void;
  nextCellFind: (rowIndex: number, column: string, focus?: boolean) => void;
  currentCell?: { column: string; rowIndex: number };
  gridFontSize: number;
  gridIsBold: boolean;
}

const EditableCell: React.FC<EditableCellProps> = React.memo(
  ({
    decimalLimit,
    blockUnitOnDecimalPoint,
    rowIndex,
    column,
    value,
    onFocus,
    onBlur,
    gridId,
    onKeyDown,
    onChange,
    productId,
    gridFontSize,
    gridIsBold,
  }) => {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    const [localValue, setLocalValue] = useState<string>(
      productId > 0 ? value?.toString() : ""
    );

    useEffect(() => {
      setLocalValue(value?.toString());
    }, [value]);

    const validateNumberInput = (value: string) => {
      if (value === "") return true;
      const parts = value.split(".");
      if (parts.length > 2) return false;
      if (parts[0] && !/^-?\d*$/.test(parts[0])) return false;
      if (blockUnitOnDecimalPoint && parts.length === 2) {
        if (parts[1].length > decimalLimit) return false;
        if (!/^\d*$/.test(parts[1])) return false;
      }
      return true;
    };
    const debounceCellChange = useDebounce(
      (value: string, key: keyof TransactionDetail, index: number) => {
        onChange && onChange(value, key, rowIndex);
      },
      300 // 300ms debounce delay
    );

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      let inputValue = e.currentTarget.value;
      if (column.dataType === "number" && inputValue === ".") {
        inputValue = "0.";
        e.currentTarget.value = inputValue;
      }
      if (
        column.dataType === "number" &&
        inputValue.startsWith(".") &&
        inputValue.length > 1
      ) {
        const secondChar = inputValue.charAt(1);
        if (/^\d$/.test(secondChar)) {
          inputValue = "0" + inputValue;
          e.currentTarget.value = inputValue;
        }
      }
      if (column.dataType === "number" && !validateNumberInput(inputValue)) {
        e.currentTarget.value = localValue;
        return;
      }
      setLocalValue(inputValue);
      debounceCellChange(
        inputValue,
        column.dataField as keyof TransactionDetail,
        rowIndex
      );
    };

    const handleFocus = () => {
      onFocus();
      inputRef.current?.select();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" || e.key === "Delete") return;
      if (column.dataType === "number") {
        const key = e.key;
        const inputElement = inputRef.current;
        const currentValue = localValue;
        const cursorPosition = inputElement?.selectionStart || 0;
      }
      onKeyDown(e, column, rowIndex);
    };

    return (
      <Input
        ref={inputRef}
        id={`${gridId}_${column.dataField}_${rowIndex}`}
        noLabel
        type={column.dataType === "number" ? "text" : "text"}
        className="w-full h-full bg-transparent border-none focus:ring-0 focus:outline-none !px-1 !py-0 flex items-center"
        style={{
             fontSize: `${gridFontSize}px`,
             fontWeight: gridIsBold ? "bold" : "normal",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
             textAlign: column.alignment || "center", 

        }}
        value={localValue}
        noBorder
        readOnly={column.readOnly}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
    );
  }
);

const Row = React.memo(
  ({ index, style, data }: ListChildComponentProps<RowData>) => {
    const [focusedColumn, setFocusedColumn] = useState<string | null>(null);
    const item = data.details[index];
    const columns = data.columns;
    const tableWidth = data.tableWidth;
    const txtData = data.txtData;
    const gridId = data.gridId;
    const listRef = data.listRef;
    const itemCount = data.itemCount;
    const gridRef = data.gridRef;
    const rowRef = useRef<HTMLTableRowElement>(null);
    const dispatch = useAppDispatch();
    const formState = useSelector(
      (state: RootState) => state.InventoryTransaction
    );

    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );

    const handleFocus = useCallback(
      (columnKey: string) => {
        setFocusedColumn(columnKey);
      }, [index]
    );

    const handleBlur = useCallback(() => {
      if (document.activeElement?.closest(".dx-datagrid")) return;
      setFocusedColumn(null);
    }, []);

    const handleKeyDown = useCallback(
      (
        value: any,
        e: React.KeyboardEvent<HTMLElement>,
        column: DevGridColumn,
        rowIndex: number
      ) => {
        const target = e.target as HTMLElement;
        if (!target.id) return;

        const visibleColumns = data.columns.filter(
          (col) => col.visible != false && col.dataField != null
        );

        const currentColumnIndex = visibleColumns.findIndex(
          (col) => col.dataField === column.dataField
        );

        if (
          !["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          data.onKeyDown(
            value,
            e,
            column.dataField as keyof TransactionDetail,
            rowIndex
          );
          return;
        }

        let shouldNavigate = true;
        if (target.tagName === "INPUT" || target.querySelector("input")) {
          const input =
            target.tagName === "INPUT"
              ? (target as HTMLInputElement)
              : (target.querySelector("input") as HTMLInputElement | null);
          if (input && input.type !== "number") {
            const { selectionStart, selectionEnd, value } = input;
            const effectiveValue = value || "";
            const effectiveStart = selectionStart ?? 0;
            const effectiveEnd = selectionEnd ?? 0;
            if (
              e.key === "ArrowRight" &&
              (effectiveStart !== effectiveValue.length ||
                effectiveEnd !== effectiveValue.length)
            ) {
              shouldNavigate = false;
            } else if (
              e.key === "ArrowLeft" &&
              (effectiveStart !== 0 || effectiveEnd !== 0)
            ) {
              shouldNavigate = false;
            }
          }
        }

        if (!shouldNavigate) return;

        e.preventDefault();
        switch (e.key) {
          case "ArrowRight":
            if (currentColumnIndex < visibleColumns.length - 1)
              data.focusCell(index, currentColumnIndex + 1);
            break;
          case "ArrowLeft":
            if (currentColumnIndex > 0)
              data.focusCell(index, currentColumnIndex - 1);
            break;
          case "ArrowUp":
            data.focusCell(index - 1, currentColumnIndex);
            break;
          case "ArrowDown":
            data.focusCell(index + 1, currentColumnIndex);
            break;
        }
      }, [data]
    );

    return (
      <tr
        ref={rowRef}
        style={{
          ...style,
          display: "flex",
          width: `${tableWidth}px`,
          boxSizing: "border-box",
          borderBottom: `0.5px solid rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)`,
        }}
        className="py-0 hover:bg-gradient-to-r hover:from-[#eff6ff66] hover:to-[#eef2ff4d] transition-all duration-200 ease-in-out group"
        // column bg transition ☝
        key={`inv_transaction_grid_${index}`}
      >
        {columns
          .filter((col) => col.visible != false && col.dataField != null)
          .map((column, columnIndex) => {
            const fieldKey = column.dataField as keyof TransactionDetail;
            const productId = item.productID;
            const cellValue = item[fieldKey];
            const isFocused = focusedColumn === column.dataField;
            const cellId = `${gridId}_${column.dataField}_${index}`;

            return (
              <td
                title={JSON.stringify({
                  dataField: column.dataField,
                  readOnly: column.readOnly,
                  currentCellColumn: data.currentCell?.column,
                  currentCellRowIndex: data.currentCell?.rowIndex,
                  currentRowIndex: index,
                  cellId,
                  gridId,
                })}
                key={column.dataField}
                className={` p-0 ${column.cssClass || ""} ${isFocused ? "!border-[#3b82f6] bg-[#eff6ff80]" : ""}${column.allowEditing && !column.readOnly ? "hover:bg-gradient-to-r hover:from-gray-50/60 hover:to-slate-50/40 transition-all duration-150" : ""}`}
                style={{
                  width: column.width ? `${column.width}px` : "150px",
                  minWidth: column.width ? `${column.width}px` : "150px",              
                  boxSizing: "border-box",
                  borderTop: isFocused ? "1px solid #3B82F6" : "none",
                  borderBottom: isFocused ? "1px solid #3B82F6" : "none",
                  borderLeft: isFocused ? "1px solid #3B82F6" : "none",
                  borderRight: isFocused
                    ? "1px solid #3b82f6"
                    : columnIndex <
                      columns.filter(
                        (col) => col.visible != false && col.dataField != null
                      ).length - 1 ? `0.5px solid rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)` : "none",
                  boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
                }}

                role="gridcell"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    formStateHandleFieldChange({
                      fields: {
                        currentCell: {
                          column: column.dataField,
                          rowIndex: index,
                        },
                      },
                    })
                  );
                }}
              >
                  {/* {!formState.transactionLoading ? ( */}
                  {formState.transactionLoading ? (
                    <div className="parent-selector-loading" style={{ width: "100%", margin: "3px 0" }}>
                      <div className="card_description loading"
                      style={{
                              width: `${Math.floor(Math.random() * 50) + 40}%`, // 40–90%
                            }}
                      ></div>
                    </div>
                  ) :
                  column.dataField === "slNo" ? (
                    <span
                      className="px-1"
                      style={{
                        fontSize: `${data.gridFontSize}px`,
                        fontWeight: data.gridIsBold ? "bold" : "normal",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        width: "100%",
                        textAlign: column.alignment || "center",
                      }}
                      id={cellId}

                    >
                      {index + 1}
                    </span>
                  ) :
                    (column.dataField === "product" ||
                      column.dataField === "pCode") &&
                      !column.readOnly &&
                      data.currentCell?.column === column.dataField &&
                      data.currentCell?.rowIndex === index ? (
                      <ERPProductSearch
                      textAlign={column.alignment === "right" ? "right" : "left"}
                        rowIndex={index}
                        id={cellId}
                        inputId={`${gridId}_${column.dataField}_${index}`}
                        searchType={
                          applicationSettings?.productsSettings
                            ?.usePopupWindowForItemSearch
                            ? "modal"
                            : "grid"
                        }
                        noLabel={true}
                        showCheckBox={false}
                        contextClassNametwo="!h-[22px] !text-sm !px-1 !py-0 !border-none !bg-transparent"
                        value={(cellValue as string) || ""}
                        productDataUrl={`${Urls.inv_transaction_base}${data.transactionType}/products`}
                        batchDataUrl={`${Urls.inv_transaction_base}${data.transactionType}/batches/`}
                        // tabIndex={0}
                        className="h-[22px] text-sm"
                        onFocus={() => handleFocus(column.dataField!)}
                        onBlur={handleBlur}
                        onKeyDown={(value, e) =>
                          handleKeyDown(value, e, column, index)
                        }
                        searchKey={column.dataField}
                        advancedProductSearching={data.advancedProductSearching}
                        useInSearch={data.useInSearch}
                        useCodeSearch={data.useCodeSearch}
                        onNextCellFind={data.nextCellFind}
                        onRowSelected={(data: any, rowValue?: string) => {
                          const res = {
                            slNo: item.slNo,
                            rowIndex: index,
                            productBatchID: data.productBatchID,
                            autoBarcode: data.autoBarcode,
                            productCode: data.productCode,
                            useProductCode: column.dataField === "pCode",
                            searchText: rowValue,
                            key: generateUniqueKey(),
                          };
                          dispatch(
                            formStateHandleFieldChange({
                              fields: { batchSelectionData: JSON.stringify(res) },
                            })
                          );
                        }}
                      />
                    ) : column.dataField === "product" && !column.readOnly ? (
                      <span
                        style={{
                          fontSize: `${data.gridFontSize}px`,
                          fontWeight: data.gridIsBold ? "bold" : "normal",
                          textAlign: column.alignment || "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                          width: "100%",
                        }}
                        className="px-1 cursor-default"
                        id={cellId}
                        tabIndex={0}
                        // className="w-full h-full flex items-center px-1 cursor-default"
                        onFocus={() => handleFocus(column.dataField!)}
                        onBlur={handleBlur}
                        onKeyDown={(e) =>
                          handleKeyDown(cellValue, e, column, index)
                        }
                      >
                        {productId > 0 ? cellValue : ""}
                      </span>
                    ) : column.dataField === "status" ? (
                      <span
                        style={{
                          fontSize: `${data.gridFontSize}px`,
                          fontWeight: data.gridIsBold ? "bold" : "normal",
                            textAlign: column.alignment || "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                          width: "100%",
                        }}
                        id={cellId}
                        tabIndex={0}
                        className={`inline-flex px-2 py-1 font-medium rounded-full cursor-default ${cellValue === "Active"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : ""
                          } ${cellValue === "Inactive"
                            ? "bg-[#fee2e2] text-[#991b1b]"
                            : ""
                          } ${cellValue === "Pending"
                            ? "bg-[#fef9c3] text-[#854d0e]"
                            : ""
                          }`}
                        onFocus={() => handleFocus(column.dataField!)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => handleKeyDown(cellValue, e, column, index)}
                      >
                        {productId > 0 ? cellValue : ""}
                      </span>
                    ) : column.allowEditing &&
                      !column.readOnly &&
                      txtData.visible == true ? (
                      <EditableCell
                        productId={productId}
                        onChange={data.onChange}
                        blockUnitOnDecimalPoint={data.blockUnitOnDecimalPoint}
                        decimalLimit={2}
                        rowIndex={index}
                        column={column}
                        value={cellValue as string | number}
                        onFocus={() => handleFocus(column.dataField!)}
                        onBlur={handleBlur}
                        gridId={gridId}
                        onKeyDown={(e) =>
                          handleKeyDown(cellValue, e, column, index)
                        }
                        gridFontSize={data.gridFontSize}
                        gridIsBold={data.gridIsBold}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: `${data.gridFontSize}px`,
                          fontWeight: data.gridIsBold ? "bold" : "normal",
                          textAlign: column.alignment || "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                          width: "100%",
                        }}
                        id={cellId}
                        tabIndex={0}
                        // className="w-full h-full flex items-center px-1 cursor-default"
                        className="px-1 cursor-default"
                        onFocus={() => handleFocus(column.dataField!)}
                        onBlur={handleBlur}
                        onKeyDown={(e) =>
                          handleKeyDown(cellValue, e, column, index)
                        }
                      >
                        {productId > 0 ? cellValue : ""}
                      </span>
                    )}
              </td>
            );
          })}
      </tr>
    );
  }
);

const SummaryRow: React.FC<{
  columns: DevGridColumn[];
  tableWidth: number;
  summaryValues: Record<string, any>;
  summaryConfig: SummaryConfig[];
  gridFontSize: number;
  gridIsBold: boolean;
}> = ({
  columns,
  tableWidth,
  summaryValues,
  summaryConfig,
  gridFontSize,
  gridIsBold,
}) => {
    const formState = useAppSelector(
      (state: RootState) => state.InventoryTransaction
    );

    return (
      <tr
        className="flex bg-gradient-to-r from-slate-100/80 via-gray-100/60 to-slate-100/80"
        style={{
          width: `${tableWidth}px`,
          boxSizing: "border-box",
          // borderTop: `1px solid rgb(${
          //   formState.userConfig?.gridBorderColor || "209,213,219"
          // })`,
          // the above border is the border of the footer 
        }}
      >
        {columns
          .filter((col) => col.visible != false && col.dataField != null)
          .map((column, index) => {
            const summary = summaryConfig.find(
              (s) =>
                s.showInColumn === column.dataField ||
                s.column === column.dataField
            );
            const value = summary
              ? summaryValues[summary.column as string]
              : null;
            const formattedValue = summary?.customizeText
              ? summary.customizeText({ value })
              : value;

            return (
              <td
                key={`summary_${column.dataField}`}
                className="flex items-center px-1 py-1 font-semibold bg-slate-200 text-gray-700 border-r border-gray-200/50 last:border-r-0"
                style={{
                  fontSize: `${gridFontSize}px`,
                  fontWeight: gridIsBold ? "bold" : "600",
                  width: column.width ? `${column.width}px` : "150px",
                  minWidth: column.width ? `${column.width}px` : "150px",
                  textAlign:
                    summary?.alignment ||
                    column.alignment ||
                    (column.dataType === "number" ? "right" : "left"),
                  boxSizing: "border-box",
                  borderRight:
                    index <
                      columns.filter(
                        (col) => col.visible != false && col.dataField != null
                      ).length -
                      1
                      ? `0px solid rgb(${formState.userConfig?.gridBorderColor || "209,213,219"
                      })`
                      : "none",
                }}
              >
                {summary ? formattedValue : ""}
              </td>
              // footer td
            );
          })}
      </tr>
    );
  };

const ErpPurchaseGrid = forwardRef(function ErpPurchaseGrid<T extends DataItem>(
  {
    columns = [],
    keyField,
    transactionType,
    onKeyDown,
    onChange,
    gridId,
    className = "",
    rowHeight = 24,
    height = 800,
    allowColumnReordering = true,
    summaryConfig = [],
    gridFontSize = 14,
    gridIsBold = false,
    gridBorderColor,
    gridHeaderBg,
  }: DataGridProps<T>,
  ref: Ref<any>
) {
  const listRef = useRef<List>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragPreviewRef = useRef<HTMLDivElement>(null);
  const preferenceChooserRef = useRef<{
    handleDragStart: (e: React.DragEvent<HTMLElement>) => void;
    handleDragEnd: (e: React.DragEvent<HTMLElement>) => void;
    handleDropping: (eFromDataGrid?: boolean) => void;
  }>(null);
  const appState = useAppSelector(
    (state: RootState) => state.AppState?.appState
  );
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const applicationState = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const dispatch = useAppDispatch();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedColumn: null,
    draggedIndex: null,
    dropPosition: null,
    startX: 0,
    startY: 0,
  });
  const [dragPreviewPosition, setDragPreviewPosition] = useState({
    x: 0,
    y: 0,
  });

  const calculateTotalWidth = () => {
    const visibleColumns =
      formState.gridColumns?.filter(
        (c) => c.visible != false && c.dataField != null
      ) ?? [];
    return visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  const focusCell = useCallback(
    (targetRow: number, targetColumnIndex: number) => {
      const visibleColumns =
        formState.gridColumns?.filter(
          (col) => col.visible != false && col.dataField != null
        ) ?? [];
      const itemCount = formState.transaction?.details.length || 0;
      if (
        targetRow < 0 ||
        targetRow >= itemCount ||
        targetColumnIndex < 0 ||
        targetColumnIndex >= visibleColumns.length
      )
        return;

      const targetColumn = visibleColumns[targetColumnIndex];
      const targetCellId = `${gridId}_${targetColumn.dataField}_${targetRow}`;

      if (listRef.current) listRef.current.scrollToItem(targetRow, "smart");

      const attemptFocus = () => {
        const targetCell = document.getElementById(
          targetCellId
        ) as HTMLElement | null;
        if (targetCell) {
          if (targetColumn.dataField === "product") {
            const erpSearchInput = targetCell.querySelector(
              `input[id="${targetCellId}"]`
            ) as HTMLInputElement | null;
            if (erpSearchInput) {
              erpSearchInput.focus();
              erpSearchInput.select();
              return true;
            }
          }
          targetCell.focus();
          const input =
            targetCell.tagName === "INPUT"
              ? (targetCell as HTMLInputElement)
              : (targetCell.querySelector("input") as HTMLInputElement | null);
          if (input) input.select();
          return true;
        }
        return false;
      };

      if (attemptFocus()) {
        const targetCell = document.getElementById(targetCellId) as HTMLElement;
        if (gridRef.current && targetCell) {
          const cellRect = targetCell.getBoundingClientRect();
          const gridRect = gridRef.current.getBoundingClientRect();
          const scrollLeft = gridRef.current.scrollLeft;
          if (cellRect.left < gridRect.left) {
            gridRef.current.scrollLeft =
              scrollLeft + (cellRect.left - gridRect.left);
          } else if (cellRect.right > gridRect.right) {
            gridRef.current.scrollLeft =
              scrollLeft + (cellRect.right - gridRect.right);
          }
        }
      }

      if (attemptFocus()) return;

      const maxAttempts = 5;
      let attempts = 0;
      const interval = setInterval(() => {
        if (attemptFocus() || attempts >= maxAttempts) clearInterval(interval);
        attempts++;
      }, 50);
    },
    [
      formState.gridColumns,
      formState.transaction?.details.length,
      gridId,
      listRef,
      gridRef,
    ]
  );

  const focusCurrentColumn = useCallback(
    (rowIndex: number, column: string) => {
      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );
      const currentEditableIndex = findCurrentEditableIndex(rowIndex, column);
      const editable = editableColumns
        ? editableColumns[currentEditableIndex]
        : undefined;
      const targetColumnIndex = visibleColumns?.findIndex(
        (col) => col.dataField === editable?.dataField
      );
      if (rowIndex >= 0 && (targetColumnIndex ?? -1) >= 0) {
        focusCell(rowIndex, targetColumnIndex ?? -1);
      }
    },
    [formState.gridColumns, focusCell]
  );
  const findCurrentEditableIndex = useCallback(
    (rowIndex: number, column: string) => {
      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );

      if (editableColumns?.length === 0) {
        return -1; // No editable columns, exit early
      }

      return !editableColumns
        ? -1
        : editableColumns?.findIndex((col) => col.dataField === column);
    },
    [formState.gridColumns, focusCell]
  );

  const nextCellFind = useCallback(
    (rowIndex: number, column: string) => {
      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );
      const currentEditableIndex = findCurrentEditableIndex(rowIndex, column);
      let targetRow = rowIndex;
      let targetColumnIndex = -1;
      if (visibleColumns && editableColumns) {
        if (
          currentEditableIndex >= 0 &&
          currentEditableIndex < editableColumns?.length - 1
        ) {
          const nextEditable = editableColumns![currentEditableIndex + 1];
          targetColumnIndex = visibleColumns.findIndex(
            (col) => col.dataField === nextEditable.dataField
          );
        } else {
          targetRow += 1;
          const firstEditable = editableColumns[0];
          targetColumnIndex = visibleColumns.findIndex(
            (col) => col.dataField === firstEditable.dataField
          );
        }
      }

      if (targetColumnIndex >= 0) {
        focusCell(targetRow, targetColumnIndex);
      }
    },
    [formState.gridColumns, focusCell]
  );

  React.useImperativeHandle(ref, () => ({
    focusCell,
    nextCellFind,
    focusCurrentColumn,
  }));

  const itemData = useMemo(
    () => ({
      details: formState.transaction?.details || [],
      columns: formState.gridColumns || [],
      tableWidth: tableWidth,
      txtData: formState.formElements.txtData,
      gridId: gridId,
      listRef: listRef,
      itemCount: formState.transaction?.details.length || 0,
      gridRef: gridRef,
      onKeyDown: (
        value: any,
        e: any,
        column: keyof TransactionDetail,
        rowIndex: number
      ) => {
        onKeyDown(value, e, column, rowIndex);
      },
      onChange: (
        value: any,
        column: keyof TransactionDetail,
        rowIndex: number
      ) => {
        onChange(value, column, rowIndex);
      },
      transactionType: transactionType ?? formState.transactionType,
      blockUnitOnDecimalPoint:
        applicationState.inventorySettings?.blockUnitOnDecimalPoint,
      focusCell: focusCell,
      nextCellFind: nextCellFind,
      currentCell: formState.currentCell,
      gridFontSize: gridFontSize || 14,
      gridIsBold: gridIsBold || false,
    }),
    [
      formState.transaction?.details,
      formState.gridColumns,
      tableWidth,
      formState.formElements.txtData,
      gridId,
      formState.transactionType,
      focusCell,
      nextCellFind,
      formState.currentCell,
      gridFontSize,
      gridIsBold,
    ]
  );

  useEffect(() => {
    setTableWidth(calculateTotalWidth());
  }, [formState.gridColumns]);

  useEffect(() => {
    if (gridId && columns) {
      onApplyPreferences(getInitialPreference(gridId, columns));
    }
  }, [gridId, columns]);

  const onApplyPreferences = useCallback(
    (pref: GridPreference) => {
      const updated = applyGridColumnPreferences(
        formState.gridColumns || columns,
        pref
      );
      dispatch(
        formStateHandleFieldChange({ fields: { gridColumns: updated } })
      );
    },
    [columns, dispatch, formState.gridColumns]
  );

  return (
    <div
      ref={gridRef}
      style={{
        width: `${tableWidth}px`,
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        border: `0.5px solid rgba(${gridBorderColor ? gridBorderColor : "203,213,225"}, 0.4)`,
        // borderRadius: "16px",
        boxShadow: "0 4px 25px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        // boxShadow: "0 4px 25px rgba(0, 0, 0, 0.08)",
        // table whole shadow
      }}
      className="bg-gradient-to-br from-slate-50/80 via-white to-[#eff6ff4d] rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm"
    >
      <div className={`relative ${className} w-full overflow-hidden`}>
        <div
          className={`absolute top-[-7px] ${appState.dir === "ltr" ? "left-[3px]" : "right-[3px]"
            } z-20`}
        >
          <GridPreferenceChooser
            ref={preferenceChooserRef}
            gridId={gridId}
            columns={formState.gridColumns ?? []}
            onApplyPreferences={onApplyPreferences}
            showChooserOnGridHead
            eclipseClass="m-0 p-0"
          />
        </div>

        <div className="w-full overflow-x-auto scrollbar rounded-t-xl sticky top-0 z-10">
          <table
            className="w-full border-collapse"
            style={{
              border: "none",
              borderSpacing: "0",
            }}
          >
            <thead>
              <tr
                className="flex relative backdrop-blur-sm"
                style={{
                  width: `${tableWidth}px`,
                  boxSizing: "border-box",
                  borderBottom: `0.5px solid rgba(${gridBorderColor ? gridBorderColor : "203,213,225"}, 0.4)`,
                  background: gridHeaderBg
                    ? `rgb(${gridHeaderBg})`
                    : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                }}
              >
                {formState.gridColumns
                  ?.filter((c) => c.visible != false)
                  .map((col, index) => (
                    <React.Fragment key={col.dataField}>
                      {dragState.dropPosition === index && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#60A5FA] to-[#2563EB] shadow-lg z-10 rounded-full"
                          style={{
                            left:
                              appState.dir === "ltr"
                                ? `${(formState.gridColumns ?? [])
                                  .filter((c) => c.visible != false)
                                  .slice(0, index)
                                  .reduce(
                                    (sum, c) => sum + (c.width || 150),
                                    0
                                  )}px`
                                : undefined,
                            right:
                              appState.dir === "rtl"
                                ? `${(formState.gridColumns ?? [])
                                  .filter((c) => c.visible != false)
                                  .slice(0, index)
                                  .reduce(
                                    (sum, c) => sum + (c.width || 150),
                                    0
                                  )}px`
                                : undefined,
                            boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                          }}
                        />
                      )}
                      {dragState.dropPosition ===
                        (formState.gridColumns?.filter(
                          (c) => c.visible != false
                        ).length ?? 0) &&
                        index ===
                        (formState.gridColumns?.filter(
                          (c) => c.visible != false
                        ).length ?? 0) - 1 && (
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#60A5FA] to-[#2563EB] shadow-lg z-10 rounded-full"
                            style={{
                              right: appState.dir === "ltr" ? 0 : undefined,
                              left: appState.dir === "rtl" ? 0 : undefined,
                              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                            }}
                          />
                        )}
                      <th
                        id={`${col.dataField}_${col.dataField}`}
                        key={col.dataField}
                        className="relative p-2 text-left font-semibold   transition-all duration-300 hover:bg-white/50 cursor-pointer group"
                        style={{
                          fontSize: `${gridFontSize}px`,
                          fontWeight: gridIsBold ? "bold" : "600",
                          width: col.width ? `${col.width}px` : "150px",
                          minWidth: col.width ? `${col.width}px` : "150px",
                          textAlign: col.alignment ||(col.dataType === "number" ? "right" : "left"),
                          boxSizing: "border-box",
                          borderRight:
                            index <
                              (formState.gridColumns?.filter(
                                (c) => c.visible != false
                              ).length ?? 0) -
                              1
                              ? `0.5px solid rgba(${gridBorderColor ? gridBorderColor : "203,213,225"
                              }, 0.4)`
                              : "none",
                          background: "transparent",
                          color: "#1f2937",
                        }}
                        draggable={!col.isLocked}
                        onDragStart={(e) =>
                          preferenceChooserRef.current?.handleDragStart(e)
                        }
                        onDragEnter={(e) =>
                          preferenceChooserRef.current?.handleDragEnd(e)
                        }
                        onDragEnd={() =>
                          preferenceChooserRef.current?.handleDropping(true)
                        }
                      >
                        <span
                          className="relative z-10 group-hover:text-[#1e40af] transition-all duration-300 max-w-full truncate group-hover:scale-105"
                          style={{
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={col.caption}
                        >
                          {col.caption}
                          {/* <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" /> */}
                        </span>
                        {!col.isLocked && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DBEAFE33] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        )}
                      </th>
                    </React.Fragment>
                  ))}
              </tr>
            </thead>

            <tbody style={{ background: "linear-gradient(180deg, #ffffff 0%, #fefefe 50%, #f9fafb 100%)" }}>
              <List
                key={String(keyField)}
                ref={listRef}
                height={height}
                itemCount={formState.transaction?.details.length || 0}
                itemSize={rowHeight}
                width={tableWidth + 1}
                outerRef={outerRef}
                itemData={itemData}
                itemKey={(index) => `${gridId}-${index}`}
                className="bg-transparent"
                style={{
                  direction: appState?.dir,
                  overflowX: "hidden",
                  background: "transparent",
                }}
              >
                {Row}
              </List>
            </tbody>

            {summaryConfig.length > 0 && (
              <tfoot
                style={{
                  background:
                    "linear-gradient(to right, #f8fafc, #ffffff, #f8fafc)",
                  borderTop: `0px solid rgba(${gridBorderColor ? gridBorderColor : "226,232,240"
                    }, 0.8)`,
                }}
              >
                <SummaryRow
                  columns={formState.gridColumns || []}
                  tableWidth={tableWidth}
                  summaryValues={formState.summary}
                  summaryConfig={summaryConfig}
                  gridFontSize={gridFontSize}
                  gridIsBold={gridIsBold}
                />
              </tfoot>
            )}
          </table>
        </div>
      </div>
      {/* {JSON.stringify(formState.summary)} */}
      {dragState.isDragging && dragState.draggedColumn && (
        <div
          ref={dragPreviewRef}
          className="fixed z-50 pointer-events-none bg-gradient-to-br from-white to-[#EFF6FF] border-2 border-[#93C5FD] rounded-xl shadow-2xl p-2 backdrop-blur-sm"
          style={{
            left: `${dragPreviewPosition.x}px`,
            top: `${dragPreviewPosition.y}px`,
            transform: "rotate(2deg) scale(1.05)",
            boxShadow:
              "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8)",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.95) 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gradient-to-br from-[#60A5FA] to-[#2563EB] rounded-full flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 tracking-wide">
              {
                formState.gridColumns?.find(
                  (col) => col.dataField === dragState.draggedColumn
                )?.caption
              }
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/10 to-[#C084FC1A] rounded-xl animate-pulse" />
        </div>
      )}
    </div>
  );
});

export default ErpPurchaseGrid;