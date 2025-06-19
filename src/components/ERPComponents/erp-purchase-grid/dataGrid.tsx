"use client";
import React, { useState, useEffect, useRef, useCallback, forwardRef, useMemo } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import Input from "./erp-grid-input";
import { Loader2, Plus, Search, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import GridPreferenceChooser from "../erp-gridpreference";
import type { DevGridColumn, GridPreference } from "../../types/dev-grid-column";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import { applyGridColumnPreferences, getInitialPreference } from "../../../utilities/dx-grid-preference-updater";
import type { FormElementState, TransactionDetail } from "../../../pages/inventory/transactions/purchase/transaction-types";
import { formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly, formStateTransactionDetailsRowUpdate } from "../../../pages/inventory/transactions/purchase/reducer";

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
  rowHeight?: number;
  height?: number;
  isLoading?: boolean;
  onAddData?: (newItem: T) => void;
  allowColumnReordering?: boolean;
  summaryConfig?: SummaryConfig<TransactionDetail>[];

}

interface EditableCellProps {
  rowIndex: number;
  column: DevGridColumn;
  value: string | number;
  onFocus: () => void;
  onBlur: () => void;
  gridId: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, column: DevGridColumn) => void;
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
  gridRef: React.RefObject<HTMLDivElement>; // Added gridRef to RowData  
  onQPressed: (e: React.KeyboardEvent<HTMLElement>, column: keyof TransactionDetail) => void;
  useInSearch?: boolean;
  useCodeSearch?: boolean;
  advancedProductSearching?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = React.memo(({ rowIndex, column, value, onFocus, onBlur, gridId, onKeyDown }) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState<string>(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const validateNumberInput = (value: string) => {
    // Allow empty input during typing
    if (value === "") return true;

    // Split the value into parts before and after the decimal point
    const parts = value.split('.');

    // Check for multiple decimal points
    if (parts.length > 2) return false;

    // Check the part before the decimal point (should be digits only, or minus sign)
    if (parts[0] && !/^-?\d*$/.test(parts[0])) return false;

    // Check the part after the decimal point (should be 0, 1, or 2 digits)
    if (parts.length === 2) {
      if (parts[1].length > 2) return false;
      if (!/^\d*$/.test(parts[1])) return false;
    }

    return true;
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let inputValue = e.currentTarget.value;

    // Check if the input is just a dot (and nothing else)
    if (column.dataType === "number" && inputValue === '.') {
      inputValue = '0.';
      e.currentTarget.value = inputValue;
    }

    // Check if the input starts with a dot followed by digits (e.g., .2)
    if (column.dataType === "number" && inputValue.startsWith('.') && inputValue.length > 1) {
      // Check if the second character is a digit
      const secondChar = inputValue.charAt(1);
      if (/^\d$/.test(secondChar)) {
        inputValue = '0' + inputValue;
        e.currentTarget.value = inputValue;
      }
    }

    if (column.dataType === "number" && !validateNumberInput(inputValue)) {
      // Revert to the previous valid value
      e.currentTarget.value = localValue;
      return;
    }

    setLocalValue(inputValue);

    // Dispatch the update with the string value to preserve the exact format
    dispatch(
      formStateTransactionDetailsRowUpdate({
        index: rowIndex,
        key: column.dataField as keyof TransactionDetail,
        value: column.dataType === "number" ? inputValue : inputValue,
      })
    );
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (column.dataType === "number") {
      const pastedText = e.clipboardData.getData('text');
      const currentValue = localValue;
      const startPos = inputRef.current?.selectionStart || 0;
      const endPos = inputRef.current?.selectionEnd || 0;
      const newValue = currentValue.substring(0, startPos) + pastedText + currentValue.substring(endPos);
      if (!validateNumberInput(newValue)) {
        e.preventDefault();
      }
    }
  };

  const handleFocus = () => {
    onFocus();
    inputRef.current?.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      return;
    }

    if (column.dataType === "number") {
      const key = e.key;
      const inputElement = inputRef.current;
      const currentValue = localValue;
      const cursorPosition = inputElement?.selectionStart || 0;
      const beforeCursor = currentValue.substring(0, cursorPosition);

      // If the key is a dot and the input is empty or cursor is at position 0
      if (key === '.') {
        // Check if we're at the start of the input or after a minus sign
        if (cursorPosition === 0 || beforeCursor === '-') {
          e.preventDefault();
          const newValue = beforeCursor === '-' ? '-0.' : '0.';

          if (inputElement) {
            // Insert the new value at cursor position
            const afterCursor = currentValue.substring(cursorPosition);
            const fullNewValue = beforeCursor + newValue + afterCursor;

            inputElement.value = fullNewValue;

            // Set the cursor position right after the decimal point
            setTimeout(() => {
              if (inputElement) {
                const newCursorPosition = cursorPosition + (beforeCursor === '-' ? 3 : 2); // For "-0." or "0."
                inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
              }
            }, 0);
          }

          // Update local state and dispatch
          const finalNewValue = beforeCursor === '-' ? '-0.' + currentValue.substring(cursorPosition) : '0.' + currentValue.substring(cursorPosition);
          setLocalValue(finalNewValue);
          dispatch(
            formStateTransactionDetailsRowUpdate({
              index: rowIndex,
              key: column.dataField as keyof TransactionDetail,
              value: finalNewValue, // Store the string value to preserve the decimal point
            })
          );
        }
      }
    }

    // Call the original onKeyDown for navigation, etc.
    onKeyDown(e, column);
  };

  return (
    <Input
      ref={inputRef}
      id={`${gridId}_${column.dataField}_${rowIndex}`}
      noLabel
      // type={column.dataType === "number" ? "number" : "text"}
      type={column.dataType === "number" ? "text" : "text"}
      className="w-full !h-[20px] text-sm text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none px-1 py-0 flex items-center"
      value={localValue}
      noBorder

      readOnly={column.readOnly}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      tabIndex={0}
    />
  );
});









const Row = React.memo(({ index, style, data }: ListChildComponentProps<RowData>) => {
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

  const handleFocus = useCallback((columnKey: string) => {
    setFocusedColumn(columnKey);
    console.log(`Focus on column: ${columnKey}, row: ${index}`);
  }, [index]);

  const handleBlur = useCallback(() => {
    if (document.activeElement?.closest(".dx-datagrid")) {
      console.log("Blur skipped: Focus within ERPProductSearch dropdown");
      return;
    }
    setFocusedColumn(null);
    console.log("Blur: Cleared focused column");
  }, []);

  const handleProductSelected = (selectedRow: any) => {
    console.log(`Product selected: ${JSON.stringify(selectedRow)}`);
    dispatch(
      formStateTransactionDetailsRowUpdate({
        index,
        key: "product" as keyof TransactionDetail,
        value: selectedRow.productName || selectedRow.productCode || "",
      })
    );
  };

  const focusCell = useCallback(
    (targetRow: number, targetColumnIndex: number) => {
      if (
        targetRow < 0 ||
        targetRow >= itemCount ||
        targetColumnIndex < 0 ||
        targetColumnIndex >= columns.filter((col) => col.visible && col.dataField != null).length
      ) {
        console.log(`Invalid navigation: row=${targetRow}, colIndex=${targetColumnIndex}`);
        return;
      }

      const visibleColumns = columns.filter((col) => col.visible && col.dataField != null);
      const targetColumn = visibleColumns[targetColumnIndex];
      const targetCellId = `${gridId}_${targetColumn.dataField}_${targetRow}`;
      console.log(`Attempting to focus cell: ${targetCellId}`);

      if (listRef.current && targetRow !== index) {
        listRef.current.scrollToItem(targetRow, "smart");
        console.log(`Scrolled to row: ${targetRow}`);
      }

      const attemptFocus = () => {
        const targetCell = document.getElementById(targetCellId) as HTMLElement | null;
        if (targetCell) {
          if (targetColumn.dataField === "product") {
            const erpSearchInput = targetCell.querySelector(`input[id="${targetCellId}"]`) as HTMLInputElement | null;
            if (erpSearchInput) {
              erpSearchInput.focus();
              erpSearchInput.select();
              console.log(`Focused ERPProductSearch input: ${targetCellId}`);
              return true;
            } else {
              console.log(`ERPProductSearch input not found for ${targetCellId}`);
            }
          }
          targetCell.focus();
          const input = targetCell.tagName === "INPUT"
            ? targetCell as HTMLInputElement
            : targetCell.querySelector("input") as HTMLInputElement | null;
          if (input) {
            input.select();
            console.log(`Focused input: ${targetCellId}`);
          } else {
            console.log(`No input found in cell: ${targetCellId}`);
          }
          return true;
        }
        console.log(`Cell not found: ${targetCellId}`);
        return false;
      };

      if (attemptFocus()) {
        const targetCell = document.getElementById(targetCellId) as HTMLElement;
        if (gridRef.current && targetCell) {
          const cellRect = targetCell.getBoundingClientRect();
          const gridRect = gridRef.current.getBoundingClientRect();
          const scrollLeft = gridRef.current.scrollLeft;

          if (cellRect.left < gridRect.left) {
            gridRef.current.scrollLeft = scrollLeft + (cellRect.left - gridRect.left);
          } else if (cellRect.right > gridRect.right) {
            gridRef.current.scrollLeft = scrollLeft + (cellRect.right - gridRect.right);
          }
        }
      }

      if (attemptFocus()) return;

      const maxAttempts = 5;
      let attempts = 0;
      const interval = setInterval(() => {
        if (attemptFocus() || attempts >= maxAttempts) {
          clearInterval(interval);
          if (attempts >= maxAttempts) {
            console.log(`Failed to focus cell after ${maxAttempts} attempts: ${targetCellId}`);
          }
        }
        attempts++;
      }, 50);
    },
    [columns, gridId, index, itemCount, listRef]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, column: DevGridColumn) => {
      const target = e.target as HTMLElement;
      if (!target.id) return;

      const visibleColumns = columns.filter((col) => col.visible && col.dataField != null);
      const currentColumnIndex = visibleColumns.findIndex((col) => col.dataField === column.dataField);
debugger;
      if (["Q", "q"].includes(e.key) && column.dataField == "qty") {
        data.onQPressed(e, column.dataField as keyof TransactionDetail)
        return;
      }
      if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
        return;
      }

      let shouldNavigate = true;
      if (target.tagName === "INPUT" || target.querySelector("input")) {
        const input = target.tagName === "INPUT"
          ? target as HTMLInputElement
          : target.querySelector("input") as HTMLInputElement | null;
        if (input && input.type !== "number") { // Skip cursor check for number inputs
          const { selectionStart, selectionEnd, value } = input;
          const effectiveValue = value || "";
          const effectiveStart = selectionStart ?? 0;
          const effectiveEnd = selectionEnd ?? 0;
          if (e.key === "ArrowRight" && (effectiveStart !== effectiveValue.length || effectiveEnd !== effectiveValue.length)) {
            shouldNavigate = false;
          } else if (e.key === "ArrowLeft" && (effectiveStart !== 0 || effectiveEnd !== 0)) {
            shouldNavigate = false;
          }
        }
      }

      if (!shouldNavigate) {
        console.log(`Navigation skipped: Cursor not at boundary`);
        return;
      }

      e.preventDefault(); // Prevent default browser behavior (e.g., increment/decrement in number inputs)
      switch (e.key) {
        case "ArrowRight":
          if (currentColumnIndex < visibleColumns.length - 1) {
            focusCell(index, currentColumnIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (currentColumnIndex > 0) {
            focusCell(index, currentColumnIndex - 1);
          }
          break;
        case "ArrowUp":
          focusCell(index - 1, currentColumnIndex);
          break;
        case "ArrowDown":
          focusCell(index + 1, currentColumnIndex);
          break;
      }
    },
    [columns, index, itemCount, focusCell]
  );

  return (
    <tr
      ref={rowRef}
      style={{
        ...style,
        display: "flex",
        width: `${tableWidth}px`,
        boxSizing: "border-box",
      }}
      className="py-0 border-b border-gray-300"
      key={`inv_transaction_grid_${index}`}
    >
      {columns
        .filter((col) => col.visible && col.dataField != null)
        .map((column) => {
          const fieldKey = column.dataField as keyof TransactionDetail;
          const cellValue = item[fieldKey];
          const isFocused = focusedColumn === column.dataField;
          const cellId = `${gridId}_${column.dataField}_${index}`;

          return (
            <td
              key={column.dataField}
              className={`px-0 py-0 last:border-r-0 ${column.cssClass || ""} ${
                isFocused ? "!border-[#4447ef]" : "!border-gray-300"
              }`}
              style={{
                width: column.width ? `${column.width}px` : "150px",
                minWidth: column.width ? `${column.width}px` : "150px",
                textAlign: column.alignment || (column.dataType === "number" ? "right" : "left"),
                boxSizing: "border-box",
                height: "24px",
                border: isFocused ? "2px solid #EF4444" : "1px solid #D1D5DB",
              }}
              role="gridcell"
            >
               {column.dataField === "product" && !column.readOnly ? (
                <ERPProductSearch
                  id={cellId}
                  inputId={`${gridId}_${column.dataField}_${index}`}
                  noLabel={true}
                  showCheckBox={false}
                  contextClassNametwo="!h-[22px] !text-sm !px-1 !py-0 !border-none !bg-transparent"
                  value={(cellValue as string) || ""}
                  productDataUrl={Urls.load_product_details}
                  tabIndex={0}
                  className="h-[22px] text-sm"
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, column)}
                  searchKey="product"
                  advancedProductSearching ={data.advancedProductSearching}
                  useInSearch = {data.useInSearch}
                  useCodeSearch = {data.useCodeSearch}
                />
              ) :column.dataField === "pCode" && !column.readOnly ? (
                <ERPProductSearch
                  id={cellId}
                  inputId={`${gridId}_${column.dataField}_${index}`}
                  noLabel={true}
                  showCheckBox={false}
                  contextClassNametwo="!h-[22px] !text-sm !px-1 !py-0 !border-none !bg-transparent"
                  value={(cellValue as string) || ""}
                  productDataUrl={Urls.load_product_details}
                  tabIndex={0}
                  className="h-[22px] text-sm"
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, column)}
                  searchKey="pCode"
                  advancedProductSearching ={data.advancedProductSearching}
                  useInSearch = {data.useInSearch}
                  useCodeSearch = {data.useCodeSearch}
                />
              ) : column.dataField === "status" ? (
                <span
                  id={cellId}
                  tabIndex={0}
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-default ${
                    cellValue === "Active" ? "bg-[#dcfce7] text-[#166534]" : ""
                  } ${cellValue === "Inactive" ? "bg-[#fee2e2] text-[#991b1b]" : ""} ${
                    cellValue === "Pending" ? "bg-[#fef9c3] text-[#854d0e]" : ""
                  }`}
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, column)}
                >
                  {cellValue}
                </span>
              ) : column.readOnly || txtData.visible !== true ? (
                <span
                  id={cellId}
                  tabIndex={0}
                  className="text-sm text-gray-800 px-1 flex items-center h-[22px] cursor-default"
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, column)}
                >
                  {cellValue}
                </span>
              ) : (
                <EditableCell
                  rowIndex={index}
                  column={column}
                  value={cellValue as string | number}
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                  gridId={gridId}
                  onKeyDown={handleKeyDown}
                />
              )}
            </td>
          );
        })}
    </tr>
  );
});

const SummaryRow: React.FC<{
  columns: DevGridColumn[];
  tableWidth: number;
  summaryValues: Record<string, any>;
  summaryConfig: SummaryConfig[];
}> = ({ columns, tableWidth, summaryValues, summaryConfig }) => {
  return (
    <tr
      className="flex bg-gray-100 border-t border-gray-300"
      style={{ width: `${tableWidth}px`, boxSizing: "border-box" }}
    >
      {columns
        .filter((col) => col.visible && col.dataField != null)
        .map((column) => {
          const summary = summaryConfig.find(
            (s) => s.showInColumn === column.dataField || s.column === column.dataField
          );
          const value = summary ? summaryValues[summary.column as string] : null;
          const formattedValue = summary?.customizeText
            ? summary.customizeText({ value })
            : value;

          return (
            <td
              key={`summary_${column.dataField}`}
              className="px-1 py-1 border-r border-gray-300 last:border-r-0 text-sm font-medium text-gray-700"
              style={{
                width: column.width ? `${column.width}px` : "150px",
                minWidth: column.width ? `${column.width}px` : "150px",
                textAlign: summary?.alignment || column.alignment || (column.dataType === "number" ? "right" : "left"),
                boxSizing: "border-box",
                height: "24px",
              }}
            >
              {summary ? formattedValue : ""}
            </td>
          );
        })}
    </tr>
  );
};

const ErpPurchaseGrid = forwardRef(function ErpPurchaseGrid<T extends DataItem>(
  {
    columns = [],
    keyField,
    gridId,
    className = "",
    rowHeight = 24,
    height = 800,
    allowColumnReordering = true,
    summaryConfig = [],
  }: DataGridProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
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
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useAppDispatch();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedColumn: null,
    draggedIndex: null,
    dropPosition: null,
    startX: 0,
    startY: 0,
  });
  const [dragPreviewPosition, setDragPreviewPosition] = useState({ x: 0, y: 0 });

  const calculateTotalWidth = () => {
    const visibleColumns = formState.gridColumns?.filter((c) => c.visible && c.dataField != null) ?? [];
    return visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  const calculateSummaryValues = useCallback(() => {
    const details = formState.transaction?.details || [];
    const summaryValues: Record<string, any> = {};

    summaryConfig.forEach((config) => {
      const { column, summaryType } = config;
      let value: any;

      switch (summaryType) {
        case "sum":
          value = details.reduce((sum, item) => {
            const val = item[column];
            const num = typeof val === "number" ? val : parseFloat(String(val));
            return isNaN(num) ? sum : sum + num;
          }, 0);
          break;
        case "min":
          value = details.reduce((min, item) => {
            const val = item[column];
            const num = typeof val === "number" ? val : parseFloat(String(val));
            return isNaN(num) ? min : Math.min(min, num);
          }, Infinity);
          break;
        case "max":
          value = details.reduce((max, item) => {
            const val = item[column];
            const num = typeof val === "number" ? val : parseFloat(String(val));
            return isNaN(num) ? max : Math.max(max, num);
          }, -Infinity);
          break;
        case "avg":
          const validNumbers = details
            .map((item) => {
              const val = item[column];
              return typeof val === "number" ? val : parseFloat(String(val));
            })
            .filter((num) => !isNaN(num));
          value = validNumbers.length ? validNumbers.reduce((sum, num) => sum + num, 0) / validNumbers.length : 0;
          break;
        case "count":
          value = details.length;
          break;
        case "custom":
          value = config.customizeText ? config.customizeText({ value: details }) : 0;
          break;
        default:
          value = 0;
      }

      summaryValues[column as string] = value;
    });

    return summaryValues;
  }, [formState.transaction?.details, summaryConfig]);

  const itemData = useMemo(() => ({
    details: formState.transaction?.details || [],
    columns: formState.gridColumns || [],
    tableWidth: tableWidth,
    txtData: formState.formElements.txtData,
    gridId: gridId,
    listRef: listRef,
    itemCount: formState.transaction?.details.length || 0,
    gridRef: gridRef,
    onQPressed: (e: any, column: keyof TransactionDetail) =>{
      debugger;
      dispatch(formStateHandleFieldChangeKeysOnly({fields:{showQuantityFactors: true}}))
    }
  }), [formState.transaction?.details, formState.gridColumns, tableWidth, formState.formElements.txtData, gridId]);

  useEffect(() => {
    setTableWidth(calculateTotalWidth());
  }, [formState.gridColumns]);

  useEffect(() => {
    dispatch(formStateHandleFieldChange({ fields: { gridColumns: columns } }));
  }, [columns, dispatch]);

  useEffect(() => {
    if (gridId && columns) {
      onApplyPreferences(getInitialPreference(gridId, columns));
    }
  }, [gridId, columns]);

  const onApplyPreferences = useCallback(
    (pref: GridPreference) => {
      const updated = applyGridColumnPreferences(columns, pref);
      dispatch(formStateHandleFieldChange({ fields: { gridColumns: updated } }));
    },
    [columns, dispatch]
  );

  return (
    <div
      ref={ref}
      style={{ width: `${tableWidth}px`, maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}
      className="bg-white border border-gray-300 rounded-none shadow-none"
    >
      <div className={`relative ${className} w-full overflow-hidden`}>
        <div className={`absolute top-[-7px] ${appState.dir === "ltr" ? "left-[3px]" : "right-[3px]"} z-20`}>
          <GridPreferenceChooser
            ref={preferenceChooserRef}
            gridId={gridId}
            columns={formState.gridColumns || columns}
            onApplyPreferences={onApplyPreferences}
            showChooserOnGridHead
            eclipseClass="m-0 p-0"
          />
        </div>
        <div
          ref={gridRef}
          className="w-full overflow-x-auto rounded-none sticky top-0 z-10"
        >
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="flex bg-gray-100 border-b border-gray-300 relative" style={{ width: `${tableWidth}px`, boxSizing: "border-box" }}>
                {formState.gridColumns?.filter((c) => c.visible).map((col, index) => (
                  <React.Fragment key={col.dataField}>
                    {dragState.dropPosition === index && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-lg z-10"
                        style={{
                          left: appState.dir === "ltr"
                            ? `${(formState.gridColumns ?? [])
                                .filter((c) => c.visible)
                                .slice(0, index)
                                .reduce((sum, c) => sum + (c.width || 150), 0)}px`
                            : undefined,
                          right: appState.dir === "rtl"
                            ? `${(formState.gridColumns ?? [])
                                .filter((c) => c.visible)
                                .slice(0, index)
                                .reduce((sum, c) => sum + (c.width || 150), 0)}px`
                            : undefined,
                        }}
                      />
                    )}
                    {dragState.dropPosition === (formState.gridColumns?.filter((c) => c.visible).length ?? 0) && index === (formState.gridColumns?.filter((c) => c.visible).length ?? 0) - 1 && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-lg z-10"
                        style={{
                          right: appState.dir === "ltr" ? 0 : undefined,
                          left: appState.dir === "rtl" ? 0 : undefined,
                        }}
                      />
                    )}
                    <th
                      id={`${col.dataField}_${col.dataField}`}
                      key={col.dataField}
                      className="relative !bg-[#f0f09285] px-1 py-1 text-left text-sm font-medium text-gray-700 border-r border-gray-300 last:border-r-0"
                      style={{
                        width: col.width ? `${col.width}px` : "150px",
                        minWidth: col.width ? `${col.width}px` : "150px",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
                      draggable={!col.isLocked}
                      onDragStart={(e) => preferenceChooserRef.current?.handleDragStart(e)}
                      onDragEnter={(e) => preferenceChooserRef.current?.handleDragEnd(e)}
                      onDragEnd={() => preferenceChooserRef.current?.handleDropping(true)}
                    >
                      {col.caption}
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
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
                className="bg-white"
                style={{ direction: appState?.dir, overflowX: "hidden" }}
              >
                {Row}
              </List>
            </tbody>
            {summaryConfig.length > 0 && (
              <tfoot>
                <SummaryRow
                  columns={formState.gridColumns || []}
                  tableWidth={tableWidth}
                  summaryValues={formState.summary}
                  summaryConfig={summaryConfig}
                />
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {dragState.isDragging && dragState.draggedColumn && (
        <div
          ref={dragPreviewRef}
          className="fixed z-50 pointer-events-none bg-white border-2 border-blue-400 rounded-lg shadow-xl px-4 py-2"
          style={{
            left: `${dragPreviewPosition.x}px`,
            top: `${dragPreviewPosition.y}px`,
            transform: "rotate(3deg)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              {formState.gridColumns?.find((col) => col.dataField === dragState.draggedColumn)?.caption}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ErpPurchaseGrid;