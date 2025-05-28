"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import Input from "./test-input";
import { Loader2, Plus, Search } from "lucide-react";
import GridPreferenceList from "../erp-gridpreference";
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
      className="w-full h-full"
      value={value}
      noBorder
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
}

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
      className="py-1"
      key={`inv_transaction_grid_${index}`}
    >
      {columns
        .filter((col) => col.visible)
        .map((column) => {
          const fieldKey = column.dataField as keyof TransactionDetail;
          const cellValue = item[fieldKey];

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
                  value={(cellValue as string) || ""}
                  productDataUrl={Urls.load_product_details}
                />
              </td>
            );
          }

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

const ErpPurchaseGrid = forwardRef(function ErpPurchaseGrid<T extends DataItem>(
  {
    columns = [],
    keyField,
    gridId,
    className = "",
    rowHeight = 40,
    height = 800,
    onAddData,
    isLoading,
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
    // getDragState: () => { draggedDataField: string | null; targetDataField: string | null };
  }>(null);
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useAppDispatch();
  const [preferences, setPreferences] = useState<GridPreference>();

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

  return (
    <div
      style={{ width: `${tableWidth}px`, maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}
    >
      <div className={`relative border border-gray-300 rounded-md ${className} w-full overflow-hidden`}>
        <div className={`absolute top-[-7px] ${appState.dir === "ltr" ? "left-[3px]" : "right-[3px]"} z-20`}>
          <GridPreferenceList
            ref={preferenceChooserRef}
            gridId={gridId}
            columns={columns}
            onApplyPreferences={onApplyPreferences}
            GridPreferenceChooserAccTrance
            eclipseClass="m-0 p-0"
          />
        </div>
        <div
          ref={headerRef}
          className="w-full overflow-x-auto shadow-md rounded-lg sticky top-0 z-10"
        >
          <table className="min-w-full table-auto">
            <thead>
              <tr className="flex bg-[#f9f9fa]" style={{ width: `${tableWidth}px`, boxSizing: "border-box" }}>
                {formState.gridColumns?.filter((c) => c.visible).map((col) => (
                  <th
                    key={col.dataField}
                    id={`${col.dataField}_${col.dataField}`}
                    className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-100 text-sm whitespace-nowrap cursor-move"
                    style={{
                      width: col.width ? `${col.width}px` : "150px",
                      minWidth: col.width ? `${col.width}px` : "150px",
                      textAlign: col.alignment || "left",
                      boxSizing: "border-box",
                    }}
                    draggable={!col.isLocked}
                    onDragStart={(e) => preferenceChooserRef.current?.handleDragStart(e)}
                    onDragEnter={(e) => preferenceChooserRef.current?.handleDragEnd(e)}
                    onDragEnd={() => preferenceChooserRef.current?.handleDropping(true)}
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
                itemKey={(index) => `${gridId}-${index}`}
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
});

export default ErpPurchaseGrid;