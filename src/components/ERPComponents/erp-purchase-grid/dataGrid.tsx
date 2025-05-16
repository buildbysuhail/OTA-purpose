"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { dateTrimmer } from "../../../utilities/Utils";
import { type ReactNode } from "react";
import ERPButton from "../erp-button";
import Input from "./test-input";
import { Loader2, Plus, Search } from "lucide-react";
import GridPreferenceChooser from "../erp-gridpreference";
import type { DevGridColumn, GridPreference, ColumnPreference } from "../../types/dev-grid-column";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import { applyGridColumnPreferences, getInitialPreference } from "../../../utilities/dx-grid-preference-updater";
import { TransactionDetail, TransactionDetails2 } from "../../../pages/inventory/transactions/purchase/transaction-types";
import { data } from "react-router-dom";
import { formStateHandleFieldChange } from "../../../pages/inventory/transactions/purchase/reducer";
type DataItem = Record<string, any>;
interface DataGridProps<T extends DataItem> {
  columns?: DevGridColumn[];
  keyField: keyof TransactionDetail;
  gridId: string;
  className?: string;
  rowHeight?: number;
  height?: number;
  isLoading?: boolean;
  onAddData?: (newItem: T) => void;
  onCellChange?: (rowIndex: number, dataField: string, value: any) => void;
}

export default function ErpPurchaseGrid<T extends DataItem>({
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
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
      // const [gridCols, setGridCols] = useState<DevGridColumn[]>(columns);
     const [preferences, setPreferences] = useState<GridPreference>();


  const calculateTotalWidth = () => {
    const visibleColumns = formState.gridColumns?.filter((column) => column.visible !== false)??[]; 
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
  }, [columns, formState.gridColumns]);

  
   useEffect(() => {
      // setGridCols(columns);
  dispatch(formStateHandleFieldChange({fields: {gridColumns: columns}}));
  
    }, []);

   useEffect(() => {
      if (gridId != "" && columns != undefined && columns != null) {
        onApplyPreferences(getInitialPreference(gridId, columns));
      }
    }, [gridId]);

    const onApplyPreferences = useCallback(
   
      (pref: GridPreference) => {
           debugger;
        setPreferences(pref);
        const updatedColumns = applyGridColumnPreferences(columns, pref);
        dispatch(formStateHandleFieldChange({fields: {gridColumns: updatedColumns}}));
      },
      [columns]
    ); 

  const renderCell = (item: TransactionDetail, column: DevGridColumn, rowIndex: number, fieldKey: keyof(TransactionDetail)) => {
    const value = item[fieldKey];
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
            noLabel
            showCheckBox={false}
            value={value as string || ""}
            productDataUrl={Urls.load_product_details}
            // searchType="modal"
          />
        </td>
      );
    }

  

    return (
      <td
        className={column.cssClass || ""}
        style={{
          width: column.width ? `${column.width}px` : "150px",
          minWidth: column.width ? `${column.width}px` : "150px",
          textAlign: column.dataField === "number" ? "right":"left",
          boxSizing: "border-box",
        }}
      >
        { (column.dataField === "string" ||  column.dataField === "number") && column.allowEditing == true? (
          <Input
            id={`${column.dataField}_${rowIndex}`}
            noLabel
            type={column.dataType === "number" ? "number" : "text"}
            className="w-full h-full"
            value={value}
            disabled={!column.allowEditing}
            noBorder
            onChange={(e) => {
              if (onCellChange) {
                onCellChange(rowIndex, column.dataField!, e.target.value);
              }
            }}
          />
        ) : (
          value
        )}
      </td>
    );
  };

  const Row = ({index, style }: ListChildComponentProps<TransactionDetail>) => {
    return (
      <tr
        style={{
          ...style,
          display: "flex",
          width: `${tableWidth}px`,
          boxSizing: "border-box", // Ensure total width includes padding/borders
        }}
        className="py-1"
        key={"inv_transaction_grid" + index}
      >
        {formState.gridColumns?.filter((x: any) => x.visible)?.map((column) => (
          <React.Fragment key={column.dataField}>
           {renderCell(formState.transaction?.details[index], column, index, column.dataField as keyof TransactionDetail)}
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
        marginTop: "10px",
      }}
    >

      
       <GridPreferenceChooser
            gridId={gridId}
            columns={columns}
            onApplyPreferences={onApplyPreferences}
            GridPreferenceChooserAccTrance={true}
           eclipseClass="my-0 ml-2"
      />
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
                {formState.gridColumns?.filter((x: any) => x.visible)?.map((column) => (
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
            key={keyField}
              ref={listRef}
              height={height}
              itemCount={formState.transaction?.details?.length}
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