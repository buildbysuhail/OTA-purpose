"use client";
import React, { useState, useEffect, useRef, useCallback, forwardRef, useMemo, Ref } from "react";
import { GripVertical } from "lucide-react";
import Input from "./erp-grid-input";
import GridPreferenceChooser from "../erp-gridpreference";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import { applyGridColumnPreferences, getInitialPreference } from "../../../utilities/dx-grid-preference-updater";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { formStateHandleFieldChange, formStateTransactionDetailsRowUpdate } from "../../../pages/inventory/transactions/purchase/reducer";
import type { DevGridColumn, GridPreference } from "../../types/dev-grid-column";
import type { FormElementState, TransactionDetail } from "../../../pages/inventory/transactions/purchase/transaction-types";
import { useSelector } from "react-redux";

// Virtual scrolling hook (unchanged from your provided code)
const useVirtualScrolling = (
  items: any[],
  columns: any[],
  itemHeight: number,
  containerHeight: number,
  containerWidth: number,
  overscanRows: number = 5,
  overscanCols: number = 2
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const scrollingResetTimeoutId = useRef<number | null>(null);
  
  const visibleColumns = columns.filter(col => col.visible);
  const totalHeight = items.length * itemHeight;
  const totalWidth = visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0);

  const startRowIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanRows);
  const endRowIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscanRows 
  );

  const getColumnRange = useCallback(() => {
    let startColIndex = 0;
    let endColIndex = visibleColumns.length - 1;
    let accumulatedWidth = 0;
    
    for (let i = 0; i < visibleColumns.length; i++) {
      if (accumulatedWidth + visibleColumns[i].width > scrollLeft) {
        startColIndex = Math.max(0, i - overscanCols);
        break;
      }
      accumulatedWidth += visibleColumns[i].width;
    }
    
    accumulatedWidth = 0;
    for (let i = 0; i < visibleColumns.length; i++) {
      accumulatedWidth += visibleColumns[i].width;
      if (accumulatedWidth >= scrollLeft + containerWidth) {
        endColIndex = Math.min(visibleColumns.length - 1, i + overscanCols);
        break;
      }
    }
    
    return { startColIndex, endColIndex };
  }, [scrollLeft, containerWidth, visibleColumns, overscanCols]);
  
  const { startColIndex, endColIndex } = getColumnRange();

  const visibleColumnsWithOffset = useMemo(() => {
    let offsetX = 0;
    const result = [];
    
    for (let i = 0; i < visibleColumns.length; i++) {
      if (i >= startColIndex && i <= endColIndex) {
        result.push({
          ...visibleColumns[i],
          index: i,
          offsetX: offsetX,
        });
      }
      offsetX += visibleColumns[i].width || 150;
    }
    
    return result;
  }, [visibleColumns, startColIndex, endColIndex]);

  const visibleItems = useMemo(() => {
    return items.slice(startRowIndex, endRowIndex + 1).map((item, index) => ({
      ...item,
      index: startRowIndex + index,
      offsetY: (startRowIndex + index) * itemHeight,
    }));
  }, [items, startRowIndex, endRowIndex, itemHeight]);
  
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newScrollLeft = e.currentTarget.scrollLeft;

    setScrollTop(scrollTop);
    setScrollLeft(newScrollLeft);
    setIsScrolling(true);
    
    if (scrollingResetTimeoutId.current !== null) {
      clearTimeout(scrollingResetTimeoutId.current);
    }
    
    scrollingResetTimeoutId.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);
  
  return {
    scrollElementRef,
    totalHeight,
    totalWidth,
    visibleItems,
    visibleColumnsWithOffset,
    startRowIndex,
    endRowIndex,
    startColIndex,
    endColIndex,
    onScroll,
    isScrolling,
    scrollLeft,
    scrollTop,
  };
};

// Types (unchanged)
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
  width?: number;
  isLoading?: boolean;
  onAddData?: (newItem: T) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, column: keyof TransactionDetail, rowIndex: number) => void;
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
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, column: DevGridColumn, rowIndex: number) => void;
  blockUnitOnDecimalPoint: boolean;
  decimalLimit: number;
  productId: number;
}

interface DragState {
  isDragging: boolean;
  draggedColumn: string | null;
  draggedIndex: number | null;
  dropPosition: number | null;
  startX: number;
  startY: number;
}

// EditableCell component (unchanged)
const EditableCell: React.FC<EditableCellProps> = React.memo(({ decimalLimit, blockUnitOnDecimalPoint, rowIndex, column, value, onFocus, onBlur, gridId, onKeyDown, productId }) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [localValue, setLocalValue] = useState<string>(productId > 0 ? value?.toString() : '');

  useEffect(() => {
    setLocalValue(value?.toString());
  }, [value]);

  const validateNumberInput = (value: string) => {
    if (value === "") return true;
    const parts = value.split('.');
    if (parts.length > 2) return false;
    if (parts[0] && !/^-?\d*$/.test(parts[0])) return false;
    if (blockUnitOnDecimalPoint && parts.length === 2) {
      if (parts[1].length > decimalLimit) return false;
      if (!/^\d*$/.test(parts[1])) return false;
    }
    return true;
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let inputValue = e.currentTarget.value;
    if (column.dataType === "number" && inputValue === '.') {
      inputValue = '0.';
      e.currentTarget.value = inputValue;
    }
    if (column.dataType === "number" && inputValue.startsWith('.') && inputValue.length > 1) {
      const secondChar = inputValue.charAt(1);
      if (/^\d$/.test(secondChar)) {
        inputValue = '0' + inputValue;
        e.currentTarget.value = inputValue;
      }
    }
    if (column.dataType === "number" && !validateNumberInput(inputValue)) {
      e.currentTarget.value = localValue;
      return;
    }
    setLocalValue(inputValue);
    dispatch(
      formStateTransactionDetailsRowUpdate({
        index: rowIndex,
        key: column.dataField as keyof TransactionDetail,
        value: column.dataType === "number" ? inputValue : inputValue,
      })
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
      className="w-full !h-[20px] text-sm text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none px-1 py-0 flex items-center"
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
});

// ErpPurchaseGrid component
const ErpPurchaseGrid = forwardRef(function ErpPurchaseGrid<T extends DataItem>(
  {
    columns = [],
    keyField,
    transactionType,
    onKeyDown,
    gridId,
    className = "",
    rowHeight = 24,
    height = 800,
    width = 800,
    allowColumnReordering = true,
    summaryConfig = [],
  }: DataGridProps<T>,
  ref: Ref<any>
) {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragPreviewRef = useRef<HTMLDivElement>(null);
  const preferenceChooserRef = useRef<{
    handleDragStart: (e: React.DragEvent<HTMLElement>) => void;
    handleDragEnd: (e: React.DragEvent<HTMLElement>) => void;
    handleDropping: (eFromDataGrid?: boolean) => void;
  }>(null);
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const applicationState = useAppSelector((state: RootState) => state.ApplicationSettings);
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
  const transactionData = useMemo(() => formState.transaction?.details || [], [formState.transaction?.details]);
  
  const calculateTotalWidth = () => {
    const visibleColumns = formState.gridColumns?.filter((c) => c.visible && c.dataField != null) ?? [];
    return visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  const {
    scrollElementRef: virtualScrollRef,
    totalHeight,
    totalWidth,
    visibleItems,
    visibleColumnsWithOffset,
    startRowIndex,
    endRowIndex,
    startColIndex,
    endColIndex,
    onScroll,
    isScrolling,
    scrollLeft,
    scrollTop,
  } = useVirtualScrolling(
    transactionData,
    formState.gridColumns || columns,
    rowHeight,
    height,
    width
  );

  const calculateSummaryValues = useCallback(() => {
    const details = transactionData || [];
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
  }, [transactionData, summaryConfig]);

  const focusCell = useCallback(
    (targetRow: number, targetColumnIndex: number) => {
      const visibleColumns = formState.gridColumns?.filter((col) => col.visible && col.dataField != null) ?? [];
      const itemCount = transactionData.length || 0;
      if (
        targetRow < 0 ||
        targetRow >= itemCount ||
        targetColumnIndex < 0 ||
        targetColumnIndex >= visibleColumns.length
      ) {
        console.log(`Invalid navigation: row=${targetRow}, colIndex=${targetColumnIndex}`);
        return;
      }

      const targetColumn = visibleColumns[targetColumnIndex];
      const targetCellId = `${gridId}_${targetColumn.dataField}_${targetRow}`;
      console.log(`Attempting to focus cell: ${targetCellId}`);

      const attemptFocus = () => {
        const targetCell = document.getElementById(targetCellId) as HTMLElement | null;
        if (targetCell) {
          if (targetColumn.dataField === "product" || targetColumn.dataField === "pCode") {
            const erpSearchInput = targetCell.querySelector(`input[id="${targetCellId}"]`) as HTMLInputElement | null;
            if (erpSearchInput) {
              erpSearchInput.focus();
              erpSearchInput.select();
              console.log(`Focused ERPProductSearch input: ${targetCellId}`);
              return true;
            }
          }
          targetCell.focus();
          const input = targetCell.querySelector("input") as HTMLInputElement | null;
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
        if (scrollElementRef.current && targetCell) {
          const cellRect = targetCell.getBoundingClientRect();
          const containerRect = scrollElementRef.current.getBoundingClientRect();
          const scrollLeft = scrollElementRef.current.scrollLeft;
          const scrollTop = scrollElementRef.current.scrollTop;

          if (cellRect.left < containerRect.left) {
            scrollElementRef.current.scrollLeft = scrollLeft + (cellRect.left - containerRect.left);
          } else if (cellRect.right > containerRect.right) {
            scrollElementRef.current.scrollLeft = scrollLeft + (cellRect.right - containerRect.right);
          }
          if (cellRect.top < containerRect.top) {
            scrollElementRef.current.scrollTop = scrollTop + (cellRect.top - containerRect.top);
          } else if (cellRect.bottom > containerRect.bottom) {
            scrollElementRef.current.scrollTop = scrollTop + (cellRect.bottom - containerRect.bottom);
          }
        }
        return;
      }

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
    [formState.gridColumns, transactionData.length, gridId]
  );

  const nextCellFind = useCallback(
    (rowIndex: number, column: string) => {
      const visibleColumns = (formState.gridColumns ?? []).filter(
        (col) => col.visible && col.dataField != null
      );

      const editableColumns = visibleColumns.filter(
        (col) => col.allowEditing && !col.readOnly
      );

      if (editableColumns.length === 0) return;

      const currentEditableIndex = editableColumns.findIndex(
        (col) => col.dataField === column
      );

      let targetRow = rowIndex;
      let targetColumnIndex = -1;

      if (currentEditableIndex >= 0 && currentEditableIndex < editableColumns.length - 1) {
        const nextEditable = editableColumns[currentEditableIndex + 1];
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

      if (targetColumnIndex >= 0) {
        focusCell(targetRow, targetColumnIndex);
      }
    },
    [formState.gridColumns, focusCell]
  );

  React.useImperativeHandle(ref, () => ({
    focusCell,
    nextCellFind,
  }));

  const renderCell = (item: any, column: any, rowIndex: number) => {
    const fieldKey = column.dataField;
    const cellValue = item[fieldKey];
    const isCurrentCell = formState.currentCell?.column === column.dataField && formState.currentCell?.rowIndex === rowIndex;
    const productId = item.productID;
    const cellId = `${gridId}_${column.dataField}_${rowIndex}`;

    const handleFocus = () => {
      dispatch(formStateHandleFieldChange({ fields: { currentCell: { column: column.dataField, rowIndex } } }));
    };

    const handleBlur = () => {
      if (document.activeElement?.closest(".dx-datagrid")) return;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      const visibleColumns = (formState.gridColumns ?? []).filter((col) => col.visible && col.dataField != null);
      const currentColumnIndex = visibleColumns.findIndex((col) => col.dataField === column.dataField);

      let shouldNavigate = true;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT") {
        const input = target as HTMLInputElement;
        if (input.type !== "number") {
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

      if (!shouldNavigate) return;

      e.preventDefault();
      switch (e.key) {
        case "ArrowRight":
          if (currentColumnIndex < visibleColumns.length - 1) {
            focusCell(rowIndex, currentColumnIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (currentColumnIndex > 0) {
            focusCell(rowIndex, currentColumnIndex - 1);
          }
          break;
        case "ArrowUp":
          if (rowIndex > 0) {
            focusCell(rowIndex - 1, currentColumnIndex);
          }
          break;
        case "ArrowDown":
          if (rowIndex < transactionData.length - 1) {
            focusCell(rowIndex + 1, currentColumnIndex);
          }
          break;
        default:
          onKeyDown(e, column.dataField as keyof TransactionDetail, rowIndex);
      }
    };

    if ((column.dataField === "product" || column.dataField === "pCode") && !column.readOnly && isCurrentCell) {
      return (
        <ERPProductSearch
          id={cellId}
          inputId={cellId}
          noLabel={true}
          searchType={applicationState.productsSettings.usePopupWindowForItemSearch ? "modal" : "grid"}
          showCheckBox={false}
          contextClassNametwo="!h-[22px] !text-sm !px-1 !py-0 !border-none !bg-transparent"
          value={(cellValue as string) || ""}
          productDataUrl={`${Urls.inv_transaction_base}${transactionType}/products`}
          batchDataUrl={`${Urls.inv_transaction_base}${transactionType}/batches/`}
          tabIndex={0}
          className="h-[22px] text-sm"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          searchKey={column.dataField}
          advancedProductSearching={item.advancedProductSearching}     
          useInSearch={item.useInSearch}
          useCodeSearch={item.useCodeSearch}
          onRowSelected={(data: any, rowValue?: string) => {
            const res = {
              transaction: {
                details: [{
                  slNo: item.slNo,
                  productBatchID: data.productBatchID,
                  autoBarcode: data.autoBarcode,
                  productCode: data.productCode,
                  useProductCode: false,
                  searchText: rowValue,
                }],
              },
              key: crypto.randomUUID(),
            };
            dispatch(formStateHandleFieldChange({ fields: { batchSelectionData: JSON.stringify(res) } }));
          }}
        />
      );
    } else if (column.dataField === "status") {
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            cellValue === "Active" ? "bg-[#dcfce7] text-[#166534]" : ""
          } ${cellValue === "Inactive" ? "bg-[#fee2e2] text-[#991b1b]" : ""} ${
            cellValue === "Pending" ? "bg-[#fef9c3] text-[#854d0e]" : ""
          }`}
        >
          {productId > 0 ? cellValue : ''}
        </span>
      );
    } else if (column.allowEditing && !column.readOnly && formState.formElements.txtData.visible) {
      return (
        <EditableCell
          productId={productId}
          blockUnitOnDecimalPoint={applicationState.inventorySettings?.blockUnitOnDecimalPoint}
          decimalLimit={2}
          rowIndex={rowIndex}
          column={column}
          value={cellValue as string | number}
          onFocus={handleFocus}
          onBlur={handleBlur}
          gridId={gridId}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      );
    } else {
      return (
        <span className="text-sm text-gray-800 px-1 flex items-center h-full">
          {productId > 0 ? cellValue : ''}
        </span>
      );
    }
  };

  const onApplyPreferences = useCallback(
    (pref: GridPreference) => {
      const updated = applyGridColumnPreferences(columns, pref);
      dispatch(formStateHandleFieldChange({ fields: { gridColumns: updated } }));
    },
    [columns, dispatch]
  );

  useEffect(() => {
    setTableWidth(calculateTotalWidth());
  }, [formState.gridColumns]);

  useEffect(() => {
    if (gridId && columns) {
      onApplyPreferences(getInitialPreference(gridId, columns));
    }
  }, [gridId, columns, onApplyPreferences]);

  return (
    <div
      ref={gridRef}
      style={{ width: `${width}px`, maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}
      className="bg-white border border-gray-300 rounded-none shadow-none"
    >
      <div className={`relative ${className} w-full`}>
        {/* Grid Preference Chooser */}
        <div className={`absolute top-[-7px] ${appState?.dir === "ltr" ? "left-[3px]" : "right-[3px]"} z-20`}>
          <GridPreferenceChooser
            ref={preferenceChooserRef}
            gridId={gridId}
            columns={formState.gridColumns || columns}
            onApplyPreferences={onApplyPreferences}
            showChooserOnGridHead
            eclipseClass="m-0 p-0"
          />
        </div>

        {/* Header */}
        <div className="relative overflow-hidden border-b border-gray-200" style={{ width: `${width}px` }}>
          <div
            className="flex bg-gray-100"
            style={{
              width: `${totalWidth}px`,
              transform: `translateX(-${scrollLeft}px)`,
            }}
          >
            {visibleColumnsWithOffset.map((col, index) => (
              <React.Fragment key={col.dataField}>
                {dragState.dropPosition === index && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-lg z-10"
                    style={{
                      left: `${(formState.gridColumns ?? [])
                        .filter((c) => c.visible)
                        .slice(0, index)
                        .reduce((sum, c) => sum + (c.width || 150), 0)}px`,
                    }}
                  />
                )}
                {dragState.dropPosition === visibleColumnsWithOffset.length && index === visibleColumnsWithOffset.length - 1 && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-lg z-10"
                  />
                )}
                <div
                  id={`${col.dataField}_${col.dataField}`}
                  className="px-1 py-1 text-center text-sm font-medium text-gray-700 border-r border-gray-300 last:border-r-0 flex items-center justify-center !bg-[#f0f09285]"
                  style={{
                    width: `${col.width || 150}px`,
                    minWidth: `${col.width || 150}px`,
                    position: "absolute",
                    left: `${col.offsetX}px`,
                  }}
                  draggable={!col.isLocked && allowColumnReordering}
                  onDragStart={(e) => preferenceChooserRef.current?.handleDragStart(e)}
                  onDragEnter={(e) => preferenceChooserRef.current?.handleDragEnd(e)}
                  onDragEnd={() => preferenceChooserRef.current?.handleDropping(true)}
                >
                  {col.caption}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div
          ref={virtualScrollRef}
          onScroll={onScroll}
          style={{
            height: `${height}px`,
            width: `${width}px`,
            overflow: "auto",
          }}
          className="relative"
        >
          <div
            style={{
              height: `${totalHeight}px`,
              width: `${totalWidth}px`,
              position: "relative",
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={`${gridId}-${item.index}`}
                className="absolute border-b border-gray-300"
                style={{
                  top: `${item.offsetY}px`,
                  height: `${rowHeight}px`,
                  left: 0,
                  width: `${totalWidth}px`,
                }}
              >
                {visibleColumnsWithOffset.map((column) => (
                  <div
                    key={`${item.id}-${column.dataField}`}
                    id={`${gridId}_${column.dataField}_${item.index}`}
                    className={`absolute border-r border-gray-300 last:border-r-0 flex items-center ${
                      formState.currentCell?.column === column.dataField && formState.currentCell?.rowIndex === item.index
                        ? "!border-[#4447ef]"
                        : "!border-gray-300"
                    } ${column.cssClass || ""}`}
                    style={{
                      left: `${column.offsetX}px`,
                      width: `${column.width || 150}px`,
                      minWidth: `${column.width || 150}px`,
                      height: `${rowHeight}px`,
                      textAlign: column.alignment || (column.dataType === "number" ? "right" : "left"),
                    }}
                    tabIndex={0}
                    onClick={() => dispatch(formStateHandleFieldChange({ fields: { currentCell: { column: column.dataField, rowIndex: item.index } } }))}
                  >
                    {renderCell(item, column, item.index)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {summaryConfig.length > 0 && (
          <div className="relative overflow-hidden border-t border-gray-200" style={{ width: `${width}px` }}>
            <div
              className="flex bg-gray-100"
              style={{
                width: `${totalWidth}px`,
                transform: `translateX(-${scrollLeft}px)`,
              }}
            >
              {visibleColumnsWithOffset.map((column) => {
                const summary = summaryConfig.find(
                  (s) => s.showInColumn === column.dataField || s.column === column.dataField
                );
                const value = summary ? formState?.summary[summary.column] : null;
                const formattedValue = summary?.customizeText
                  ? summary.customizeText({ value })
                  : value;

                return (
                  <div
                    key={`summary_${column.dataField}`}
                    className="px-1 py-1 border-r border-gray-300 last:border-r-0 text-sm font-medium text-gray-700 flex items-center"
                    style={{
                      width: `${column.width || 150}px`,
                      minWidth: `${column.width || 150}px`,
                      textAlign: summary?.alignment || column.alignment || (column.dataType === "number" ? "right" : "left"),
                      position: "absolute",
                      left: `${column.offsetX}px`,
                    }}
                  >
                    {summary ? formattedValue : ""}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Drag Preview */}
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