"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { dateTrimmer } from "../../../../utilities/Utils";
import { type ReactNode } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Input from "./test-input";
import { Loader2, Plus, Search } from "lucide-react";
import GridPreferenceChooser from "../../../../components/ERPComponents/erp-gridpreference";
import type { DevGridColumn, GridPreference, ColumnPreference } from "../../../../components/types/dev-grid-column";

type DataItem = Record<string, any>;
interface DataGridProps<T extends DataItem> {
  data?: T[];
  columns?: DevGridColumn[];
  keyField: keyof T;
  gridId: string;
  className?: string;
  rowHeight?: number;
  height?: number;
  isLoading?: boolean;
  onAddData?: (newItem: T) => void;
}

export default function DataGridTest<T extends DataItem>({
  data = [],
  columns = [],
  keyField,
  gridId,
  className = "",
  rowHeight = 40,
  height = 800,
  onAddData,
  isLoading,
}: DataGridProps<T>) {
  const listRef = useRef<List>(null);
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);

  const [searchTerm, setSearchTerm] = useState("");
  const [gridPreferences, setGridPreferences] = useState<GridPreference | null>(null);

  const getVisibleColumns = (): DevGridColumn[] => {
    if (!columns) {
      return [];
    }

    if (!gridPreferences?.columnPreferences) {
      return columns.filter((col) => col.visible !== false);
    }

    const prefMap = new Map<string, ColumnPreference>();
    gridPreferences.columnPreferences.forEach((pref) => {
      prefMap.set(pref.dataField, pref);
    });

    return columns
      .filter((col) => {
        const pref = prefMap.get(col.dataField!);
        return col.visible !== false && (!pref || pref.visible !== false);
      })
      .map((col) => {
        const pref = prefMap.get(col.dataField!);
        if (pref) {
          return {
            ...col,
            width: pref.width || col.width,
            allowEditing: pref.readOnly ? false : col.allowEditing ?? true,
          };
        }
        return col;
      })
      .sort((a, b) => {
        const prefA = prefMap.get(a.dataField!);
        const prefB = prefMap.get(b.dataField!);
        const orderA = prefA ? prefA.displayOrder : 999;
        const orderB = prefB ? prefB.displayOrder : 999;
        return orderA - orderB;
      });
  };

  const calculateTotalWidth = () => {
    const visibleColumns = getVisibleColumns();
    return visibleColumns.reduce((total, column) => {
      const width = column.width || 150;
      return total + width;
    }, 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  useEffect(() => {
    const totalWidth = calculateTotalWidth();
    const maxWidth = window.innerWidth;
    setTableWidth(Math.min(totalWidth, maxWidth));
  }, [columns, gridPreferences]);

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

  const filteredData = useMemo(() => {
    if (!data) {
      return [];
    }

    const searchTermLower = searchTerm.toLowerCase();
    return data.filter((item) => {
      return visibleColumns.some((col) => {
        const value = item[col.dataField!];
        return String(value).toLowerCase().includes(searchTermLower);
      });
    });
  }, [data, visibleColumns, searchTerm]);

  const handleAddData = () => {
    if (isLoading || !onAddData || !data) {
      return;
    }
    const newItem = { ...data[0], [keyField]: `user-${Date.now()}-${data.length}` } as T;
    onAddData(newItem);
  };

  const handleApplyPreferences = (preferences: GridPreference) => {
    setGridPreferences(preferences);
    localStorage.setItem(`gridPreferences_${gridId}`, JSON.stringify(preferences));
  };

  const renderCell = (item: T, column: DevGridColumn) => {
    const value = item[column.dataField!];
    let displayValue: ReactNode;


      switch (column.dataType) {
        case "date":
        case "datetime":
          displayValue = dateTrimmer(`${value}`);
          break;
        case "number":
          displayValue = value;
          break;
        case "boolean":
          displayValue = value ? "Yes" : "No";
          break;
        default:
          displayValue = value;
      }
    

    return (
      <td
        className={column.cssClass || ""}
        style={{
          width: column.width ? `${column.width}px` : "150px",
          minWidth: column.width ? `${column.width}px` : "150px",
          textAlign: column.alignment || "left",
        }}
      >
        {typeof displayValue === "string" || typeof displayValue === "number" ? (
          <Input
            id={`${column.caption}_${item[column.dataField!]}`}
            noLabel
            type={column.dataType === "number" ? "number" : "text"}
            className="w-full h-full"
            value={displayValue}
            disabled={!column.allowEditing}
            noBorder
          />
        ) : (
          displayValue
        )}
      </td>
    );
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = filteredData[index];
    return (
      <tr
        style={style}
        className="flex py-1"
        key={String(item[keyField])}
      >
        {visibleColumns.map((column) => (
          <React.Fragment key={column.dataField}>
            {renderCell(item, column)}
          </React.Fragment>
        ))}
      </tr>
    );
  };

  return (
    <div
      style={{
        maxWidth: `${window.innerWidth}px`, // Cap at window width
        overflowX: "auto", // Enable horizontal scrolling for entire grid
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-2 p-4 w-full">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-0.3 h-4 w-4 text-muted-foreground" />
          <Input
            id="Search"
            type="text"
            placeholder="Search..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <GridPreferenceChooser
            gridId={gridId}
            columns={columns}
            onApplyPreferences={handleApplyPreferences}
          />
          <ERPButton
            type="button"
            className="primary shrink-0"
            loading={isLoading}
            startIcon={<Plus className="h-4 w-4 mr-2" />}
            onClick={handleAddData}
            title="Add Record"
            disabled={!onAddData || !data.length}
          />
        </div>
      </div>
      <div className={`border border-gray-100 rounded-md ${className} w-full`}>
        <div
          style={{
            width: `${tableWidth}px`, // Set full table width
            overflowX: "hidden", // Prevent extra horizontal scroll in wrapper
          }}
        >
          <table className="w-full">
            <thead>
              <tr
                className="flex bg-[#f9f9fa]"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10, // Keep above body content
                }}
              >
                {visibleColumns.map((column) => (
                  <th
                    key={column.dataField}
                    className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-100 text-sm whitespace-nowrap"
                    style={{
                      width: column.width ? `${column.width}px` : "150px",
                      minWidth: column.width ? `${column.width}px` : "150px",
                      textAlign: column.alignment || "left",
                    }}
                  >
                    {column.caption}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No data available
            </div>
          ) : (
            <List
              ref={listRef}
              height={height}
              itemCount={filteredData.length}
              itemSize={rowHeight}
              width={tableWidth}
              className="bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
              style={{ direction: appState?.dir }}
            >
              {Row}
            </List>
          )}
        </div>
      </div>
    </div>
  );
}