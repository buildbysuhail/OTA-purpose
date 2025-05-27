"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { dateTrimmer } from "../../../utilities/Utils";
import ERPButton from "../erp-button";
import Input from "./test-input";
import { Loader2, Plus, Search } from "lucide-react";
import GridPreferenceChooser from "../erp-gridpreference";
import type { DevGridColumn, GridPreference } from "../../types/dev-grid-column";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import { applyGridColumnPreferences, getInitialPreference } from "../../../utilities/dx-grid-preference-updater";
import type { TransactionDetail } from "../../../pages/inventory/transactions/purchase/transaction-types";
import { formStateHandleFieldChange, formStateTransactionDetailsRowUpdate } from "../../../pages/inventory/transactions/purchase/reducer";
import ErpInput from "../erp-input";
import { useDispatch, useSelector } from "react-redux";

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
}

// EditableCell: local edit state, commit on blur
interface EditableCellProps {
  rowIndex: number;
  column: DevGridColumn;
  value: string | number;
}

const EditableCell: React.FC<EditableCellProps> = ({ rowIndex, column, value }) => {
  const dispatch = useDispatch();
  // const [localValue, setLocalValue] = useState<string | number>(value);

  // const handleBlur = () => {
  //   const typed = column.dataType === "number"
  //     ? parseFloat(localValue as string) || 0
  //     : localValue;
  //   dispatch(
  //     formStateTransactionDetailsRowUpdate({
  //       index: rowIndex,
  //       key: column.dataField as keyof TransactionDetail,
  //       value: typed,
  //     })
  //   );
  //   console.log("Row updated:", rowIndex, column.dataField, typed);
    
  // };

  return (
    <>
     <Input
      id={`${column.dataField}_${rowIndex}`}
      noLabel
      type={column.dataType === "number" ? "number" : "text"}
      className="w-full h-full"
      value={value}
      noBorder
      onChange={e => {
         dispatch(
      formStateTransactionDetailsRowUpdate({
        index: rowIndex,
        key: column.dataField as keyof TransactionDetail,
        value: e.target.value,
      })
    );
      }} 
      // onBlur={handleBlur}
    />
    </>
   
  );
};

// Memoized Row component
interface RowData {
  details: TransactionDetail[];
  columns: DevGridColumn[];
  tableWidth: number;
}

const Row = 
  ({ index, style, data }: ListChildComponentProps<RowData>) => {
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
        className="py-1"
        key={`inv_transaction_grid_${index}`}
      >
        {columns
          .filter(col => col.visible)
          .map(column => {
            const fieldKey = column.dataField as keyof TransactionDetail;
            const cellValue = item[fieldKey];

            // Product column
            if (column.dataField === "product" && column.allowEditing) {
              return (
                <td
                  key={column.dataField}
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
                    value={cellValue as string || ""}
                    productDataUrl={Urls.load_product_details}
                  />
                </td>
              );
            }

            // Editable string/number
            if (
              column.allowEditing &&
              (column.dataType === "string" || column.dataType === "number")
            ) {
              return (
                <td
                  key={column.dataField}
                  className={column.cssClass || ""}
                  style={{
                    width: column.width ? `${column.width}px` : "150px",
                    minWidth: column.width ? `${column.width}px` : "150px",
                    textAlign: column.dataType === "number" ? "right" : "left",
                    boxSizing: "border-box",
                  }}
                >
                  <EditableCell
                    rowIndex={index}
                    column={column}
                    value={cellValue as string | number}
                  />
                </td>
              );
            }

            // Read-only
            return (
              <td
                key={column.dataField}
                className={column.cssClass || ""}
                style={{
                  width: column.width ? `${column.width}px` : "150px",
                  minWidth: column.width ? `${column.width}px` : "150px",
                  textAlign: column.alignment || "left",
                  boxSizing: "border-box",
                }}
              >
                {cellValue}
              </td>
            );
          })}
      </tr>
    );
  };

export default function ErpPurchaseGrid<T extends DataItem>({
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
  const headerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useAppDispatch();
  const [preferences, setPreferences] = useState<GridPreference>();

  const calculateTotalWidth = () => {
    const visibleColumns = formState.gridColumns?.filter(c => c.visible) ?? [];
    return visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  };

  const [tableWidth, setTableWidth] = useState(calculateTotalWidth());

  useEffect(() => {
    setTableWidth(calculateTotalWidth());
  }, [columns, formState.gridColumns]);

  useEffect(() => {
    dispatch(formStateHandleFieldChange({ fields: { gridColumns: columns } }));
  }, []);

  useEffect(() => {
    if (gridId && columns) {
      onApplyPreferences(getInitialPreference(gridId, columns));
    }
  }, [gridId]);

  const onApplyPreferences = useCallback((pref: GridPreference) => {
    setPreferences(pref);
    const updated = applyGridColumnPreferences(columns, pref);
    dispatch(formStateHandleFieldChange({ fields: { gridColumns: updated } }));
  }, [columns]);

  return (
    <div
      style={{ width: `${tableWidth}px`, maxWidth: "100%", overflow: "hidden", boxSizing: "border-box", marginTop: 10 }}
    >
      <GridPreferenceChooser
        gridId={gridId}
        columns={columns}
        onApplyPreferences={onApplyPreferences}
        GridPreferenceChooserAccTrance
        eclipseClass="my-0 ml-2"
      />

      <div className={`border border-gray-100 rounded-md ${className} w-full overflow-hidden`}>
        {/* Header */}
        <div
          ref={headerRef}
          className="w-full overflow-x-auto shadow-md rounded-lg sticky top-0 z-10"
          style={{ boxSizing: "border-box" }}
        >
          <table className="min-w-full table-auto">
            <thead>
              <tr className="flex bg-[#f9f9fa]" style={{ width: `${tableWidth}px`, boxSizing: "border-box" }}>
                {formState.gridColumns?.filter(c => c.visible).map(col => (
                  <th
                    key={col.dataField}
                    className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-100 text-sm whitespace-nowrap"
                    style={{ width: col.width ? `${col.width}px` : "150px", minWidth: col.width ? `${col.width}px` : "150px", textAlign: col.alignment || "left", boxSizing: "border-box" }}
                  >
                    {col.caption}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <List
                key={String(keyField)}
                ref={listRef}
                height={height}
                itemCount={formState.transaction?.details?.length || 0}
                itemSize={rowHeight}
                width={tableWidth + 1}
                outerRef={outerRef}
                itemData={{
                  details: formState.transaction?.details || [],
                  columns: formState.gridColumns || [],
                  tableWidth,
                }}
                itemKey={index => `${gridId}-${index}`}
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
