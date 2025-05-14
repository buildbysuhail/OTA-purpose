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
import ERPProductSearch from "../../../../components/ERPComponents/erp-searchbox";
import Urls from "../../../../redux/urls";
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
  onCellChange?: (rowIndex: number, dataField: string, value: any) => void;
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
  onCellChange
}: DataGridProps<T>) {
  const listRef = useRef<List>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
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
      const width = column.width || 150; // Default width of 150px if not specified
      return total + width;
    }, 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  useEffect(() => {
    const totalWidth = calculateTotalWidth();
    const maxWidth = window.innerWidth;
    setTableWidth(totalWidth); // Use the exact total width, no capping to maxWidth for now
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

  // Synchronize header scroll with body scroll
  const handleContainerScroll = () => {
    if (outerRef.current && headerRef.current) {
      headerRef.current.scrollLeft = outerRef.current.scrollLeft;
    }
  };

  const renderCell = (item: T, column: DevGridColumn, rowIndex: number) => {
    const value = item[column.dataField!];
    let displayValue: ReactNode;

    // Handle the "product" column with ERPProductSearch
    if (column.dataField === "product" && column.allowEditing) {
      return (
        <td
          className={column.cssClass || ""}
          style={{
            width: column.width ? `${column.width}px` : "150px",
            minWidth: column.width ? `${column.width}px` : "150px",
            textAlign: column.alignment || "left",
            boxSizing: "border-box",
          }}
        >
          <ERPProductSearch 
            showCheckBox={false}
            value={value || ""}
           productDataUrl={Urls.load_product_details}
           searchType="modal"
          />
        </td>
      );
    }

    // Default rendering for other columns
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
          boxSizing: "border-box",
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
            // onChange={(e) => {
            //   if (onCellChange) {
            //     onCellChange(rowIndex, column.dataField!, e.target.value);
            //   }
            // }}
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
        style={{
          ...style,
          display: "flex",
          width: `${tableWidth}px`,
          boxSizing: "border-box", // Ensure total width includes padding/borders
        }}
        className="py-1"
        key={String(item[keyField])}
      >
        {visibleColumns.map((column) => (
          <React.Fragment key={column.dataField}>
           {renderCell(item, column, index)}
          </React.Fragment>
        ))}
      </tr>
    );
  };

  return (
    <div
      style={{
        width: `${tableWidth}px`, 
        maxWidth:"100%",
        overflow: "hidden",
        boxSizing: "border-box",
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

      <div className={`border border-gray-100 rounded-md ${className} w-full overflow-hidden`}>
        {/* Header Container */}
        <div
          ref={headerRef}
          className="w-full overflow-x-auto shadow-md rounded-lg"
          style={{
            width: "100%",
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxSizing: "border-box",
          }}
        >
          <table className="min-w-full table-auto">
            <thead>
              <tr
                className="flex bg-[#f9f9fa]"
                style={{ width: `${tableWidth}px`, boxSizing: "border-box" }}
              >
                {visibleColumns.map((column) => (
                  <th
                    key={column.dataField}
                    className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-100 text-sm whitespace-nowrap"
                    style={{
                      width: column.width ? `${column.width}px` : "150px",
                      minWidth: column.width ? `${column.width}px` : "150px",
                      textAlign: column.alignment || "left",
                      boxSizing: "border-box", // Include padding/borders in width
                    }}
                  >
                    {column.caption}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            <List
              ref={listRef}
              height={height}
              itemCount={filteredData.length}
              itemSize={rowHeight}
              width={tableWidth + 1} // Add a small buffer to ensure full visibility
              outerRef={outerRef}
              className="bg-white"
              style={{ direction: appState?.dir, overflowX: "hidden", boxSizing: "border-box" }}
            >
              {Row}
            </List>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}