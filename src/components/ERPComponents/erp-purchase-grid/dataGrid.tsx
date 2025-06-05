"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import Input from "./test-input";
import { Loader2, Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
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

const EditableCell: React.FC<EditableCellProps> = ({ rowIndex, column, value }) => {
  const dispatch = useAppDispatch();
  return (
    <Input
      id={`${column.dataField}_${rowIndex}`}
      noLabel
      type={column.dataType === "number" ? "number" : "text"}
      className="w-full h-[26px] text-sm text-gray-800 bg-transparent border-2 border-gray-600 focus:ring-0 focus:outline-none px-1 py-0 flex items-center"
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

interface RowData {
  details: TransactionDetail[];
  columns: DevGridColumn[];
  tableWidth: number;
  filteredDetails: TransactionDetail[];
}

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const item = data.filteredDetails[index];
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
      className="py-0 border-t border-gray-200"
      key={`inv_transaction_grid_${index}`}
    >
      {columns
        .filter((col) => col.visible)
        .map((column) => {
          const fieldKey = column.dataField as keyof TransactionDetail;
          const cellValue = item[fieldKey];
          return (
            <td
              key={column.dataField}
              className={column.cssClass || ""}
              style={{
                width: column.width ? `${column.width}px` : "150px",
                minWidth: column.width ? `${column.width}px` : "150px",
                textAlign: column.alignment || (column.dataType === "number" ? "right" : "left"),
                boxSizing: "border-box",
                height: "30px",
                borderRight: "1px solid #e5e7eb", // Matches border-gray-200
              }}
              role="gridcell"
            >
              {column.dataField === "product" && !column.readOnly ? (
                <ERPProductSearch
                  noLabel
                  showCheckBox={false}
                  value={(cellValue as string) || ""}
                  productDataUrl={Urls.load_product_details}
                  tabIndex={-1}
                />
              ) : column.dataField === "slNo" || column.readOnly ? (
                <span className="text-sm text-gray-800 px-1 flex items-center h-[26px]">{cellValue}</span>
              ) : column.dataType === "string" ? (
                <span className="text-sm text-gray-800 px-1 flex items-center h-[26px]">{cellValue}</span>
              ) : column.allowEditing == true ? (
                <EditableCell
                  rowIndex={index}
                  column={column}
                  value={cellValue as string | number}
                />
              ) : (
                <span className="text-sm text-gray-800 px-1 flex items-center h-[26px]">{cellValue}</span>
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
    rowHeight = 30,
    height = 800,
    onAddData,
    isLoading,
    // allowColumnReordering = false,
    allowColumnReordering = true,
  }: DataGridProps<T>,
  ref: React.Ref<any>
) {
  const listRef = useRef<List>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRange, setFilterRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const calculateTotalWidth = () => {
    const visibleColumns = formState.gridColumns?.filter((c) => c.visible) ?? [];
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

  const handleColumnClick = (dataField: string) => {
    setSelectedColumn(dataField);
  };

  const handleSort = (dataField: string) => {
    if (selectedColumn === dataField) {
      setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc");
    } else {
      setSelectedColumn(dataField);
      setSortOrder("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (min: number | null, max: number | null) => {
    setFilterRange({ min, max });
  };

  const sortedAndFilteredDetails = useMemo(() => {
    let details = [...(formState.transaction?.details || [])];

    // Apply search
    if (searchQuery && selectedColumn) {
      details = details.filter((item) =>
        String(item[selectedColumn as keyof TransactionDetail])
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter for slNo (numeric range)
    if (selectedColumn === "slNo" && (filterRange.min !== null || filterRange.max !== null)) {
      details = details.filter((item) => {
        const value = Number(item.slNo);
        const minPass = filterRange.min !== null ? value >= filterRange.min : true;
        const maxPass = filterRange.max !== null ? value <= filterRange.max : true;
        return minPass && maxPass;
      });
    }

    // Apply sorting
    if (sortOrder && selectedColumn) {
      details.sort((a, b) => {
        const aValue = a[selectedColumn as keyof TransactionDetail];
        const bValue = b[selectedColumn as keyof TransactionDetail];
        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortOrder === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return 0;
      });
    }

    return details;
  }, [formState.transaction?.details, searchQuery, filterRange, sortOrder, selectedColumn]);

  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, dataField: string) => {
    if (!allowColumnReordering || !dataField) return;
    setDraggedColumn(dataField);
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    setDragPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    e.dataTransfer.setData("text/plain", dataField);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (dataField: string) => {
    if (allowColumnReordering && draggedColumn && dataField !== draggedColumn) {
      setTargetColumn(dataField);
    }
  };

  const handleDragLeave = () => {
    setTargetColumn(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetDataField: string) => {
    e.preventDefault();
    if (!allowColumnReordering || !draggedColumn || draggedColumn === targetDataField) return;

    const columnsCopy = [...(formState.gridColumns || [])];
    const draggedIndex = columnsCopy.findIndex((col) => col.dataField === draggedColumn);
    const targetIndex = columnsCopy.findIndex((col) => col.dataField === targetDataField);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedCol] = columnsCopy.splice(draggedIndex, 1);
    columnsCopy.splice(targetIndex, 0, draggedCol);

    dispatch(formStateHandleFieldChange({ fields: { gridColumns: columnsCopy } }));

    setDraggedColumn(null);
    setTargetColumn(null);
    setDragPosition(null);

    // Notify GridPreferenceChooser of the change
    preferenceChooserRef.current?.handleDropping(true);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setTargetColumn(null);
    setDragPosition(null);
  };

  return (
    <div
      style={{ width: `${tableWidth}px`, maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}
    >
      <div className={`relative border border-gray-200 rounded-none ${className} w-full overflow-hidden`}>
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
          ref={headerRef}
          className="w-full overflow-x-auto rounded-none sticky top-0 z-10"
        >
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="flex bg-gray-200 border-b border-gray-200 relative" style={{ width: `${tableWidth}px`, boxSizing: "border-box" }}>
                {formState.gridColumns?.filter((c) => c.visible).map((col, index) => (
                  <React.Fragment key={col.dataField}>
                    {/* Drop Indicator */}
                    {targetColumn === col.dataField && draggedColumn !== col.dataField && (
                      <div
                        className="absolute w-1 bg-blue-500 h-full"
                        style={{
                          left: appState.dir === "ltr"
                            ? `${columns.slice(0, index).reduce((sum, c) => sum + (c.width || 150), 0)}px`
                            : undefined,
                          right: appState.dir === "rtl"
                            ? `${columns.slice(0, index).reduce((sum, c) => sum + (c.width || 150), 0)}px`
                            : undefined,
                          zIndex: 20,
                        }}
                      />
                    )}
                    <th
                      id={`${col.dataField}_${col.dataField}`}
                      className={`text-center py-1 px-1 font-medium text-gray-700 border-r border-gray-200 text-sm whitespace-nowrap cursor-pointer flex items-center justify-center relative
                        ${selectedColumn === col.dataField ? "border-2 border-gray-600" : ""}
                        ${draggedColumn === col.dataField ? "opacity-50" : ""}
                        ${targetColumn === col.dataField && draggedColumn !== col.dataField ? "bg-gray-300" : "hover:bg-gray-300"}
                      `}
                      style={{
                        width: col.width ? `${col.width}px` : "150px",
                        minWidth: col.width ? `${col.width}px` : "150px",
                        boxSizing: "border-box",
                        ...(selectedColumn === col.dataField && {
                          width: col.width ? `${col.width - 2}px` : "148px", // Adjust for border width
                          minWidth: col.width ? `${col.width - 2}px` : "148px",
                        }),
                      }}
                      draggable={allowColumnReordering && !col.isLocked}
                      onDragStart={(e) => {
                        if (col.dataField) {
                          handleDragStart(e, col.dataField);
                        }
                        preferenceChooserRef.current?.handleDragStart(e);
                      }}
                      onDragOver={handleDragOver}
                      onDragEnter={() => col.dataField && handleDragEnter(col.dataField)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => col.dataField && handleDrop(e, col.dataField)}
                      onDragEnd={() => {
                        handleDragEnd();
                        preferenceChooserRef.current?.handleDropping(true);
                      }}
                      onClick={() => {
                        if (col.dataField) {
                          if (col.allowSorting) {
                            handleSort(col.dataField);
                          }
                          handleColumnClick(col.dataField);
                        }
                      }}
                    >
                      {col.caption}
                      {col.allowSorting && selectedColumn === col.dataField && sortOrder && (
                        sortOrder === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
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
                itemCount={sortedAndFilteredDetails.length}
                itemSize={rowHeight}
                width={tableWidth + 1}
                outerRef={outerRef}
                itemData={{
                  details: formState.transaction?.details || [],
                  columns: formState.gridColumns || [],
                  tableWidth,
                  filteredDetails: sortedAndFilteredDetails,
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

      {/* Drag Preview */}
      {draggedColumn && dragPosition && (
        <div
          className="fixed pointer-events-none bg-gray-200 text-gray-700 text-sm font-medium opacity-75 border border-gray-200 rounded-sm shadow-md"
          style={{
            top: dragPosition.y,
            left: dragPosition.x,
            width: formState.gridColumns?.find((col) => col.dataField === draggedColumn)?.width || 150,
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            // transform: "translate(-50%, -50%)",
          }}
        >
          {formState.gridColumns?.find((col) => col.dataField === draggedColumn)?.caption}
        </div>
      )}
    </div>
  );
});

export default ErpPurchaseGrid;