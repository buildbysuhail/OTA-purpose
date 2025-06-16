"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
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
import { formStateHandleFieldChange, formStateTransactionDetailsRowUpdate } from "../../../pages/inventory/transactions/purchase/reducer";

type DataItem = Record<string, any>;

interface SummaryConfig {
  column: keyof TransactionDetail;
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
  summaryConfig?: SummaryConfig[];
}

interface EditableCellProps {
  rowIndex: number;
  column: DevGridColumn;
  value: string | number;
  onFocus: () => void;
  onBlur: () => void;
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
}

const EditableCell: React.FC<EditableCellProps> = ({ rowIndex, column, value, onFocus, onBlur }) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    onFocus();
  };

  const handleBlur = () => {
    onBlur();
  };

  return (
    <Input
      ref={inputRef}
      id={`${column.dataField}_${rowIndex}`}
      noLabel
      type={column.dataType === "number" ? "number" : "text"}
      className="w-full !h-[20px] text-sm text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none px-1 py-0 flex items-center"
      value={value}
      noBorder
      readOnly={column.readOnly}
      onChange={(e) =>
        dispatch(
          formStateTransactionDetailsRowUpdate({
            index: rowIndex,
            key: column.dataField as keyof TransactionDetail,
            value: e.target.value,
          })
        )
      }
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const [focusedColumn, setFocusedColumn] = useState<string | null>(null);
  const item = data.details[index];
  const columns = data.columns;
  const tableWidth = data.tableWidth;
  const txtData = data.txtData;

  const handleFocus = (columnKey: string) => {
    setFocusedColumn(columnKey);
  };

  const handleBlur = () => {
    setFocusedColumn(null);
  };

  return (
    <tr
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
                  noLabel={true}
                  showCheckBox={false}
                  contextClassNametwo="!h-[22px] !text-sm !px-1 !py-0 !border-none !bg-transparent"
                  value={(cellValue as string) || ""}
                  productDataUrl={Urls.load_product_details}
                  tabIndex={-1}
                  className="h-[22px] text-sm"
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                />
              ) : column.dataField === "status" ? (
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    cellValue === "Active" ? "bg-[#dcfce7] text-[#166534]" : ""
                  } ${cellValue === "Inactive" ? "bg-[#fee2e2] text-[#991b1b]" : ""} ${
                    cellValue === "Pending" ? "bg-[#fef9c3] text-[#854d0e]" : ""
                  }`}
                >
                  {cellValue}
                </span>
              ) : column.readOnly || txtData.visible != true ? (
                <span className="text-sm text-gray-800 px-1 flex items-center h-[22px]">{cellValue}</span>
              ) : (
                <EditableCell
                  rowIndex={index}
                  column={column}
                  value={cellValue as string | number}
                  onFocus={() => handleFocus(column.dataField!)}
                  onBlur={handleBlur}
                />
              )}
            </td>
          );
        })}
    </tr>
  );
};

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
          const value = summary ? summaryValues[summary.column] : null;
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

  // const resetDragState = useCallback(() => {
  //   setDragState({
  //     isDragging: false,
  //     draggedColumn: null,
  //     draggedIndex: null,
  //     dropPosition: null,
  //     startX: 0,
  //     startY: 0,
  //   });
  //   isDraggingRef.current = false;
  // }, []);

  // const calculateDropPosition = useCallback((clientX: number): number => {
  //   if (!gridRef.current) return -1;

  //   const headerRow = gridRef.current.querySelector("thead tr");
  //   if (!headerRow) return -1;

  //   const headers = Array.from(headerRow.querySelectorAll("th"));
  //   for (let i = 0; i < headers.length; i++) {
  //     const headerRect = headers[i].getBoundingClientRect();
  //     const centerX = headerRect.left + headerRect.width / 2;
  //     if (clientX < centerX) {
  //       return i;
  //     }
  //   }
  //   return headers.length;
  // }, []);













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
                itemCount={formState.transaction?.details.length}
                itemSize={rowHeight}
                width={tableWidth + 1}
                outerRef={outerRef}
                itemData={{
                  details: formState.transaction?.details || [],
                  columns: formState.gridColumns || [],
                  tableWidth:tableWidth,
                  txtData: formState.formElements
                }}
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