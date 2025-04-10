// dataGrid.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { dateTrimmer } from "../../../../utilities/Utils";
import { type ReactNode } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { Loader2, Plus, Search } from "lucide-react";
import GridPreferenceChooser from "../../../../components/ERPComponents/erp-gridpreference";
import type { DevGridColumn, GridPreference, ColumnPreference } from "../../../../components/types/dev-grid-column";

// Generic type for any data object
type DataItem = Record<string, any>;

// Column definition type
export interface ColumnDefinition<T extends DataItem> {
  field: keyof T;
  header: string;
  width?: string;
  type?: "text" | "number" | "date" | "select" | "custom";
  editable?: boolean;
  options?: any;
  formatter?: (value: any) => ReactNode;
}

interface DataGridProps<T extends DataItem> {
  data: T[];
  columns: ColumnDefinition<T>[];
  keyField: keyof T;
  gridId: string; // Identifier for the table instance
  className?: string;
  rowHeight?: number;
  height?: number;
  isLoading?:boolean;
  onAddData?: (newItem: T) => void; // Optional custom add data handler
}

export default function DataGrid<T extends DataItem>({
  data,
  columns,
  keyField,
  gridId,
  className = "",
  rowHeight = 50,
  height = 800,
  onAddData,
  isLoading,
}: DataGridProps<T>) {
  const listRef = useRef<List>(null);
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);

  // Internal state management
  const [searchTerm, setSearchTerm] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [gridPreferences, setGridPreferences] = useState<GridPreference | null>(null);

  // Define getVisibleColumns first to avoid TDZ
  const getVisibleColumns = (): ColumnDefinition<T>[] => {
    if (!gridPreferences?.columnPreferences) {
      return columns;
    }

    const prefMap = new Map<string, ColumnPreference>();
    gridPreferences.columnPreferences.forEach((pref) => {
      prefMap.set(pref.dataField, pref);
    });

    return columns
      .filter((col) => {
        const pref = prefMap.get(col.field as string);
        return !pref || pref.visible !== false;
      })
      .map((col) => {
        const pref = prefMap.get(col.field as string);
        if (pref) {
          return {
            ...col,
            width: pref.width ? `${pref.width}px` : col.width,
            editable: pref.readOnly ? false : col.editable,
          };
        }
        return col;
      })
      .sort((a, b) => {
        const prefA = prefMap.get(a.field as string);
        const prefB = prefMap.get(b.field as string);
        const orderA = prefA ? prefA.displayOrder : 999;
        const orderB = prefB ? prefB.displayOrder : 999;
        return orderA - orderB;
      });
  };

  // Calculate total width of visible columns
  const calculateTotalWidth = () => {
    const visibleColumns = getVisibleColumns();
    return visibleColumns.reduce((total, column) => {
      const width = column.width ? parseInt(column.width, 10) : 150; // Default width of 150px if not specified
      return total + width;
    }, 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  // Update table width when columns or preferences change
  useEffect(() => {
    setTableWidth(calculateTotalWidth());
  }, [columns, gridPreferences]);

  // Load preferences from localStorage based on gridId
  useEffect(() => {
    const savedPreferences = localStorage.getItem(`gridPreferences_${gridId}`);
    if (savedPreferences) {
      try {
        setGridPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Error parsing saved grid preferences:", error);
      }
    }
  }, [gridId]);

  const visibleColumns = useMemo(() => getVisibleColumns(), [columns, gridPreferences]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return data.filter((item) => {
      return visibleColumns.some((col) => {
        const value = item[col.field];
        return String(value).toLowerCase().includes(searchTermLower);
      });
    });
  }, [data, visibleColumns, searchTerm]);

  // Add data handler (relies on onAddData prop)
  const handleAddData = () => {
    if (isLoading || !onAddData) return;
    // setIsLoading(true);
    // Simulate adding a new item (customize based on your needs)
    const newItem = { ...data[0], [keyField]: `user-${Date.now()}-${data.length}` } as T;
    onAddData(newItem);
    // if use this when need load to adding
    // setTimeout(() => {
    //   onAddData(newItem);
    //   setIsLoading(false);
    // }, 1000);
  };

  // Handle grid preference changes
  const handleApplyPreferences = (preferences: GridPreference) => {
    setGridPreferences(preferences);
    localStorage.setItem(`gridPreferences_${gridId}`, JSON.stringify(preferences));
  };

  // Convert columns to DevGridColumn for GridPreferenceChooser
  const gridColumns: DevGridColumn[] = useMemo(() => {
    return columns.map((col) => {
      let dataType: DevGridColumn["dataType"];
      switch (col.type) {
        case "text":
          dataType = "string"; // Map "text" to "string"
          break;
        case "select":
          dataType = "string"; // Map "select" to "string" (assuming string values)
          break;
        case "custom":
          dataType = "string"; // Fallback for "custom" to "string"; adjust if needed
          break;
        case "number":
        case "date":
          dataType = col.type; // Use directly if compatible
          break;
        default:
          dataType = "string"; // Default to "string" if undefined or unrecognized
      }

      return {
        dataField: col.field as string,
        caption: col.header,
        width: col.width ? parseInt(col.width, 10) : 150,
        dataType: dataType,
        alignment: "left" as const,
        isLocked: !col.editable,
        showInPdf: true,
        allowEditing: col.editable ?? true,
        allowSorting: true,
        allowResizing: true,
        allowFiltering: true,
        visible: true,
      };
    });
  }, [columns]);

  // Cell renderer
  const renderCell = (item: T, column: ColumnDefinition<T>) => {
    const value = item[column.field];
    const displayValue = column.formatter
      ? column.formatter(value)
      : column.type === "date"
      ? dateTrimmer(`${value}`)
      : value;

    return (
      <td
        className="p-3 px-4 border-r border-gray-300"
        style={{ width: column.width || "150px", minWidth: column.width || "150px" }}
      >
        <div className="w-full h-full py-2">{displayValue}</div>
      </td>
    );
  };

  // Row renderer for FixedSizeList
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = filteredData[index];
    return (
      <tr
        style={style}
        className="flex hover:bg-gray-50 border-b border-gray-100"
        key={String(item[keyField])}
      >
        {visibleColumns.map((column) => renderCell(item, column))}
      </tr>
    );
  };

  return (
    <div className={``}
    style={{ width: `${tableWidth}px`, minWidth: `${tableWidth}px` }}>
      {/* Toolbar */}
      <div
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-2 p-4w-full"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-0.3 h-4 w-4 text-muted-foreground" />
          <ERPInput
            id="Search"
            type="text"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <GridPreferenceChooser
            gridId={gridId}
            columns={gridColumns}
            onApplyPreferences={handleApplyPreferences}
          />
          <ERPButton
            type="button"
            className="primary shrink-0"
            loading={isLoading}
            startIcon={<Plus className="h-4 w-4 mr-2" />}
            onClick={handleAddData}
            title="Add Record"
            disabled={!onAddData}
          />
        </div>
      </div>
      <div className={`border border-gray-300 rounded-md  ${className} w-full`}
      //  style={{ minWidth: `${tableWidth}px`,width:`${tableWidth}px` }}
       >
      {/* Header */}
      <table className="w-full">
        <thead>
          <tr className="bg-[#f9f9fa] flex" style={{ width: `${tableWidth}px` }}>
            {visibleColumns.map((column) => (
              <th
                key={String(column.field)}
                className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-100 text-sm whitespace-nowrap"
                style={{ width: column.width || "150px", minWidth: column.width || "150px" }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* Virtualized Body 
        {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>

          {filteredData.length === 0 ? (
        <div
          className="text-center p-4 border-b border-gray-300"
          style={{ minWidth: `${tableWidth}px`, display: "flex" }}
        >
          No data available
        </div>
      ) :
      */}
     {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) :filteredData.length === 0 ? (
        <div
          className="text-center p-4 border-b border-gray-300"
          style={{ minWidth: `${tableWidth}px`, display: "flex" }}
        >
          No data available
        </div>
      ) :
       (
        <List
          ref={listRef}
          height={height}
          itemCount={filteredData.length}
          itemSize={rowHeight}
          width={tableWidth}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
          style={{ direction: appState?.dir === "rtl" ? "rtl" : "ltr", overflowX: "auto" }}
        >
          {Row}
        </List>
      )}
        </div>
    </div>
  );
}