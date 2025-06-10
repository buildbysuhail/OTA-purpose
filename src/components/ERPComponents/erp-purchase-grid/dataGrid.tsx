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
import type { TransactionDetail } from "../../../pages/inventory/transactions/purchase/transaction-types";
import { formStateHandleFieldChange, formStateTransactionDetailsRowUpdate } from "../../../pages/inventory/transactions/purchase/reducer";

type DataItem = Record<string, any>;

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
}

interface EditableCellProps {
  rowIndex: number;
  column: DevGridColumn;
  value: string | number;
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
}

const EditableCell: React.FC<EditableCellProps> = ({ rowIndex, column, value }) => {
  const dispatch = useAppDispatch();
  return (
    <Input
      id={`${column.dataField}_${rowIndex}`}
      noLabel
      type={column.dataType === "number" ? "number" : "text"}
      className="w-full !h-[23px] text-sm text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none px-1 py-0 flex items-center"
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
    />
  );
};

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const item = data.details[index];
  const columns = data.columns;
  const tableWidth = data.tableWidth;

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
          return (
            <td
              key={column.dataField}
              className={`px-1 py-0 border-r border-gray-300 last:border-r-0 ${column.cssClass || ""}`}
              style={{
                width: column.width ? `${column.width}px` : "150px",
                minWidth: column.width ? `${column.width}px` : "150px",
                textAlign: column.alignment || (column.dataType === "number" ? "right" : "left"),
                boxSizing: "border-box",
                height: "24px",
              }}
              role="gridcell"
            >
              {column.dataField === "product" && !column.readOnly ? (
                <ERPProductSearch
                  noLabel
                  showCheckBox={false}
                  contextClassNametwo="!h-[22px] !text-sm !px-1 !py-0 !border-none !bg-transparent"
                  value={(cellValue as string) || ""}
                  productDataUrl={Urls.load_product_details}
                  tabIndex={-1}
                  className="h-[22px] text-sm"
                />
              ) : column.dataField === "status" ? (
                <span
                  className={`
                    inline-flex px-2 py-1 text-xs font-medium rounded-full
                    ${cellValue === "Active" ? "bg-green-100 text-green-800" : ""}
                    ${cellValue === "Inactive" ? "bg-red-100 text-red-800" : ""}
                    ${cellValue === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                  `}
                >
                  {cellValue}
                </span>
              ) : column.readOnly ? (
                <span className="text-sm text-gray-800 px-1 flex items-center h-[22px]">{cellValue}</span>
              ) : (
                <EditableCell
                  rowIndex={index}
                  column={column}
                  value={cellValue as string | number}
                />
              )}
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
    onAddData,
    isLoading,
    allowColumnReordering = true,
  }: DataGridProps<T>,
  ref: React.Ref<any>
) {
  const listRef = useRef<List>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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
  const [preferences, setPreferences] = useState<GridPreference>();
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRange, setFilterRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedColumn: null,
    draggedIndex: null,
    dropPosition: null,
    startX: 0,
    startY: 0,
  });
  const [dragPreviewPosition, setDragPreviewPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const calculateTotalWidth = () => {
    const visibleColumns = formState.gridColumns?.filter((c) => c.visible && c.dataField != null) ?? [];
    return visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

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
      setPreferences(pref);
      const updated = applyGridColumnPreferences(columns, pref);
      dispatch(formStateHandleFieldChange({ fields: { gridColumns: updated } }));
    },
    [columns, dispatch]
  );

  const resetDragState = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedColumn: null,
      draggedIndex: null,
      dropPosition: null,
      startX: 0,
      startY: 0,
    });
    isDraggingRef.current = false;
  }, []);

  const calculateDropPosition = useCallback((clientX: number): number => {
    if (!gridRef.current) return -1;

    const headerRow = gridRef.current.querySelector("thead tr");
    if (!headerRow) return -1;

    const headers = Array.from(headerRow.querySelectorAll("th"));
    for (let i = 0; i < headers.length; i++) {
      const headerRect = headers[i].getBoundingClientRect();
      const centerX = headerRect.left + headerRect.width / 2;
      if (clientX < centerX) {
        return i;
      }
    }
    return headers.length;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      setDragPreviewPosition({
        x: e.clientX + 10,
        y: e.clientY - 10,
      });

      const newDropPosition = calculateDropPosition(e.clientX);
      setDragState((prev) => ({
        ...prev,
        dropPosition: newDropPosition,
      }));
    },
    [calculateDropPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    setDragState((currentDragState) => {
      if (
        currentDragState.draggedIndex !== null &&
        currentDragState.dropPosition !== null &&
        currentDragState.draggedIndex !== currentDragState.dropPosition
      ) {
        const columnsCopy = [...(formState.gridColumns || [])];
        const draggedIndex = columnsCopy.findIndex((col) => col.dataField === currentDragState.draggedColumn);
        let insertIndex = currentDragState.dropPosition!;
        if (insertIndex > currentDragState.draggedIndex!) {
          insertIndex--;
        }
        const [draggedCol] = columnsCopy.splice(draggedIndex, 1);
        columnsCopy.splice(insertIndex, 0, draggedCol);

        dispatch(formStateHandleFieldChange({ fields: { gridColumns: columnsCopy } }));
        preferenceChooserRef.current?.handleDropping(true);
      }
      return {
        isDragging: false,
        draggedColumn: null,
        draggedIndex: null,
        dropPosition: null,
        startX: 0,
        startY: 0,
      };
    });

    isDraggingRef.current = false;
  }, [dispatch, formState.gridColumns]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, dataField: string | undefined) => {
      if (!allowColumnReordering || !dataField) return;
      e.preventDefault();
      e.stopPropagation();

      const columnIndex = formState.gridColumns?.findIndex((col) => col.dataField === dataField) ?? -1;
      if (columnIndex === -1) return;

      const rect = (e.target as HTMLElement).closest("th")?.getBoundingClientRect();
      if (!rect) return;

      isDraggingRef.current = true;

      setDragState({
        isDragging: true,
        draggedColumn: dataField,
        draggedIndex: columnIndex,
        dropPosition: null,
        startX: e.clientX,
        startY: e.clientY,
      });

      setDragPreviewPosition({
        x: e.clientX + 10,
        y: e.clientY - 10,
      });
    },
    [formState.gridColumns, allowColumnReordering]
  );

  // useEffect(() => {
  //   if (dragState.isDragging) {
  //     document.addEventListener("mousemove", handleMouseMove);
  //     document.addEventListener("mouseup", handleMouseUp);
  //     document.body.style.cursor = "grabbing";
  //     document.body.style.userSelect = "none";

  //     return () => {
  //       document.removeEventListener("mousemove", handleMouseMove);
  //       document.removeEventListener("mouseup", handleMouseUp);
  //       document.body.style.cursor = "";
  //       document.body.style.userSelect = "";
  //     };
  //   }
  // }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // useEffect(() => {
  //   return () => {
  //     document.body.style.cursor = "";
  //     document.body.style.userSelect = "";
  //   };
  // }, []);

  const handleColumnClick = (dataField: string) => {
    setSelectedColumn(dataField);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (min: number | null, max: number | null) => {
    setFilterRange({ min, max });
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, dataField: string) => {
    if (!allowColumnReordering || !dataField) return;
    setDragState((prev) => ({ ...prev, draggedColumn: dataField }));
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    setDragPreviewPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    e.dataTransfer.setData("text/plain", dataField);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (dataField: string) => {
    if (allowColumnReordering && dragState.draggedColumn && dataField !== dragState.draggedColumn) {
      const columnIndex = formState.gridColumns?.findIndex((col) => col.dataField === dataField) ?? -1;
      setDragState((prev) => ({ ...prev, dropPosition: columnIndex }));
    }
  };

  const handleDragLeave = () => {
    setDragState((prev) => ({ ...prev, dropPosition: null }));
  };

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetDataField: string) => {
    e.preventDefault();
    if (!allowColumnReordering || !dragState.draggedColumn || dragState.draggedColumn === targetDataField) return;

    const columnsCopy = [...(formState.gridColumns || [])];
    const draggedIndex = columnsCopy.findIndex((col) => col.dataField === dragState.draggedColumn);
    const targetIndex = columnsCopy.findIndex((col) => col.dataField === targetDataField);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedCol] = columnsCopy.splice(draggedIndex, 1);
    columnsCopy.splice(targetIndex, 0, draggedCol);

    dispatch(formStateHandleFieldChange({ fields: { gridColumns: columnsCopy } }));

    resetDragState();
    preferenceChooserRef.current?.handleDropping(true);
  };

  const handleDragEnd = () => {
    resetDragState();
    preferenceChooserRef.current?.handleDropping(true);
  };

  return (
    <div
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
                      textAlign:"center",
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
                  tableWidth,
                }}
                itemKey={(index) => `${gridId}-${index}`}
                className="bg-white"
                style={{ direction: appState?.dir, overflowX: "hidden" }}
              >
                {Row}
              </List>
            </tbody>
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

      {/* <div className="px-1 py-1 bg-gray-100 border-t border-gray-300 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>Showing {formState.transaction?.details.length} records</span>
          
        </div>
      </div> */}
    </div>
  );
});

export default ErpPurchaseGrid;