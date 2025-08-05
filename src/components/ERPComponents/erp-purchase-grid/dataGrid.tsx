"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useMemo,
  Ref,
} from "react";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { EllipsisVertical, FileUp, GripVertical, Info, Settings, Trash2 } from "lucide-react";
import GridPreferenceChooser from "../erp-gridpreference";
import ERPDataCombobox from "../erp-data-combobox";
import type {
  DevGridColumn,
  GridPreference,
} from "../../types/dev-grid-column";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import {
  applyGridColumnPreferences,
  getInitialPreference,
} from "../../../utilities/dx-grid-preference-updater";
import type {
  ColumnModel,
  CurrentCell,
  FormElementState,
  SummaryItems,
  TransactionDetail,
} from "../../../pages/inventory/transactions/purchase/transaction-types";
import {
  formStateHandleFieldChange,
} from "../../../pages/inventory/transactions/purchase/reducer";
import { useSelector } from "react-redux";
import useDebounce from "../../../pages/inventory/transactions/purchase/use-debounce";
import { generateUniqueKey } from "../../../utilities/Utils";
import "../../../assets/css/loader-style.css";
import { ERPSimpleComboboxRef } from '../../ERPComponents/erp-simple-combobox';
import { inputBox } from "../../../redux/slices/app/types";
import { useTranslation } from "react-i18next";
import ERPModal from "../erp-modal";
import ERPCheckbox from "../erp-checkbox";
import ERPButton from "../erp-button";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { APIClient } from "../../../helpers/api-client";
import { useTableResizeAndReorder } from "./use-resizing";
import { useUltraFastVirtualScrolling } from "./use-virtual-scrolling";
import { toast } from "react-toastify";

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
  _columns?: ColumnModel[];
  keyField: string;
  gridId: string;
  className?: string;
  transactionType?: string;
  rowHeight?: number;
  height?: number;
  isLoading?: boolean;
  onAddData?: (newItem: T) => void;
  onChange: (
    value: any,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  onKeyDown: (
    value: any,
    e: React.KeyboardEvent<HTMLElement>,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  allowColumnReordering?: boolean;
  summaryConfig?: SummaryConfig<TransactionDetail>[];
  gridFontSize?: number;
  gridIsBold?: boolean;
  gridBorderColor?: string;
  gridHeaderBg?: string;
  gridHeaderFontColor?: string;
  gridBorderRadius?: number;
}

interface EditableCellProps {
  rowIndex: number;
  column: ColumnModel;
  options: any;
  value: string | number;
  onFocus: () => void;
  onBlur: () => void;
  gridId: string;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLElement>,
    column: ColumnModel,
    rowIndex: number
  ) => void;
  onChange: (
    value: any,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  blockUnitOnDecimalPoint: boolean;
  decimalLimit: number;
  productId: number;
  gridFontSize: number;
  gridIsBold: boolean;
  type: "any" | "cb"
  rowHeight: number
  formState: any
  appState: any
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
  columns: ColumnModel[];
  tableWidth: number;
  txtData: Partial<FormElementState>;
  gridId: string;
  listRef: React.RefObject<List>;
  itemCount: number;
  gridRef: React.RefObject<HTMLDivElement>;
  onKeyDown: (
    value: any,
    e: React.KeyboardEvent<HTMLElement>,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  onChange: (
    value: any,
    column: keyof TransactionDetail,
    rowIndex: number
  ) => void;
  useInSearch?: boolean;
  searchByCodeAndName?: boolean;
  advancedProductSearching?: boolean;
  transactionType?: string;
  blockUnitOnDecimalPoint: boolean;
    index: number;
    top: number
  focusCell: (targetRow: number, targetColumnIndex: number) => { column: string; rowIndex: number } | null;
 nextCellFind: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => { column: string; rowIndex: number } | null;
  currentCell?: { column: string; rowIndex: number, data: TransactionDetail };
  setCurrentCell: React.Dispatch<React.SetStateAction<CurrentCell | undefined>>;
  gridFontSize: number;
  gridIsBold: boolean;
  rowHeight: number;
  dir: "ltr" | "rtl";
   columnWidths: number[];
   gridBorderColor?: string;
}

const EditableCell: React.FC<EditableCellProps> = React.memo(
  ({
    decimalLimit,
    blockUnitOnDecimalPoint,
    rowIndex,
    column,
    options,
    value,
    onFocus,
    onBlur,
    gridId,
    onKeyDown,
    onChange,
    productId,
    gridFontSize,
    gridIsBold,
    formState,
    appState,
    type,
    rowHeight,
  }) => {

    const cbRef = useRef<ERPSimpleComboboxRef>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    console.log(appState);

    const editCellComboBox: inputBox = formState?.userConfig?.inputBoxStyle
    const gridBorderCol = formState?.userConfig?.gridBorderCol
    const mergedInputBox: inputBox = {
      inputStyle: "normal",
      inputSize: "customize",
      checkButtonInputSize: editCellComboBox?.checkButtonInputSize ?? "md",
      inputHeight: (rowHeight - 0.6) / 16,
      fontSize: gridFontSize ?? 13,
      fontWeight: gridIsBold ? 700 : 400,
      labelFontSize: editCellComboBox?.labelFontSize ?? 11,
      otherLabelFontSize: editCellComboBox?.otherLabelFontSize ?? 11,
      inputBgColor: editCellComboBox?.inputBgColor,
      buttonFocusBg: editCellComboBox?.buttonFocusBg,
      borderColor: gridBorderCol,
      selectColor: editCellComboBox?.selectColor,
      fontColor: editCellComboBox?.fontColor,
      labelColor: editCellComboBox?.labelColor,
      borderFocus: editCellComboBox?.borderFocus,
      borderRadius: 0,
      adjustA: 0,
      adjustB: 0,
      adjustC: 0,
      adjustD: 0,
      marginTop: 0,
      marginBottom: 0,
      focusForeColor: editCellComboBox?.focusForeColor,
      focusBgColor: editCellComboBox?.focusBgColor,
      defaultBgColor: editCellComboBox?.defaultBgColor,
      bold: editCellComboBox?.bold,
    };
    const [localValue, setLocalValue] = useState<string>(
      productId > 0 ? value?.toString() : ""
    );
    const [bgColor, setBgColor] = useState<string>(
      appState.mode == "dark"
        ? document.activeElement === inputRef.current
          ? "#ffffff"
          : "#ffffff1a"
        : `rgb(${mergedInputBox?.focusBgColor})`
    );

    const [foreColor, setForeColor] = useState<string>(
      appState.mode === "dark"
        ? document.activeElement === inputRef.current
          ? "#000000"
          : "#ffffff"
        : `rgb(${mergedInputBox?.focusForeColor || "0,0,0"})`
    );

    useEffect(() => {
      setBgColor(appState.mode == "dark"
        ? document.activeElement === inputRef.current
          ? "#ffffff"
          : "#ffffff1a"
        : `rgb(${mergedInputBox?.focusBgColor})`);
      setForeColor(
        appState.mode === "dark"
          ? document.activeElement === inputRef.current
            ? "#000000"
            : "#ffffff"
          : `rgb(${mergedInputBox?.focusForeColor || "0,0,0"})`
      );
    }, [document.activeElement,
    inputRef.current,
    appState.mode,
    mergedInputBox?.focusBgColor,
    mergedInputBox?.defaultBgColor,
    mergedInputBox?.focusForeColor,
    mergedInputBox?.fontColor,]);

    useEffect(() => {
      setLocalValue(value?.toString());
    }, [value]);

    const validateNumberInput = (value: string) => {
      if (value === "") return true;
      const parts = value.split(".");
      if (parts.length > 2) return false;
      if (parts[0] && !/^-?\d*$/.test(parts[0])) return false;
      if (blockUnitOnDecimalPoint && parts.length === 2) {
        if (parts[1].length > decimalLimit) return false;
        if (!/^\d*$/.test(parts[1])) return false;
      }
      return true;
    };
    const debounceCellChange = useDebounce(
      (value: string, key: keyof TransactionDetail, index: number) => {
        onChange && onChange(value, key, rowIndex);
      }, 300
    );

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      let inputValue = e.currentTarget.value;
      if (column.dataType === "number" && inputValue === ".") {
        inputValue = "0.";
        e.currentTarget.value = inputValue;
      }
      if (
        column.dataType === "number" &&
        inputValue.startsWith(".") &&
        inputValue.length > 1
      ) {
        const secondChar = inputValue.charAt(1);
        if (/^\d$/.test(secondChar)) {
          inputValue = "0" + inputValue;
          e.currentTarget.value = inputValue;
        }
      }
      if (column.dataType === "number" && !validateNumberInput(inputValue)) {
        e.currentTarget.value = localValue;
        return;
      }
      setLocalValue(inputValue);
      debounceCellChange(
        inputValue,
        column.dataField as keyof TransactionDetail,
        rowIndex
      );
    };

    const handleFocus = () => {
      onFocus();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    const handleCbFocus = () => {
      onFocus();
      cbRef.current?.focus();
      cbRef.current?.select();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      
      if (e.key === "Backspace" || e.key === "Delete") return;

      onKeyDown(e, column, rowIndex);
    };
    // Common style for consistent height
    const cellStyle = {
      height: `${rowHeight - 0.6}px`,
      minHeight: `${rowHeight - 0.6}px`,
      maxHeight: `${rowHeight}px`,
      lineHeight: "normal",
      fontSize: `${gridFontSize}px`,
      fontWeight: gridIsBold ? "bold" : "normal",
      display: "flex",
      alignItems: "center",
      textAlign: column.alignment || "center",
      paddingLeft: "4px",
      paddingRight: "4px",
    } as React.CSSProperties

    return (
      <>
        {type == "cb" ? (


          <ERPDataCombobox

            options={options ?? []}
            onChange={(e) => { onChange(e.value, column.dataField as keyof TransactionDetail, rowIndex) }}
            id={`${gridId}_${column.dataField}_${rowIndex}`}
            noLabel
            enableClearOption={false}
            className="!w-full !h-full !bg-inherit   !p-0 !space-y-0"
            disableEnterNavigation
            value={value}
            label={column.dataField}
            field={{
              id: `${gridId}_${column.dataField}_${rowIndex}-cb`,
              valueKey: column?.field && column?.field.valueKey ? column?.field.valueKey : "value",
              labelKey: column?.field && column?.field.labelKey ? column?.field.labelKey : "label",
            }}
            noBorder
            onKeyDown={handleKeyDown}
            localInputBox={mergedInputBox}
          />


        ) : (
          <>
            <input
              ref={inputRef}
              id={`${gridId}_${column.dataField}_${rowIndex}`}
              type={column.dataType === "number" ? "text" : "text"}
              className="bg-transparent border-none focus:ring-0 focus:outline-none  "
              style={{
                ...cellStyle,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor: bgColor,
                color: foreColor,
                border: "none",
                width: "100%"
              }}
              value={localValue}
              readOnly={column.readOnly}
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              tabIndex={0}

            />
          </>
        )}
      </>

    );
  }
);


const SummaryRow: React.FC<{
  columns: ColumnModel[];
  tableWidth: number;
  summaryValues: Record<string, any>;
  summaryConfig: SummaryConfig[];
  gridFontSize: number;
  gridIsBold: boolean;
  rowHeight: number;
  gridBorderColor?: string;
}> = ({
  columns,
  tableWidth,
  summaryValues,
  summaryConfig,
  gridFontSize,
  gridIsBold,
  rowHeight,
  gridBorderColor,
}) => {
    const formState = useAppSelector(
      (state: RootState) => state.InventoryTransaction
    );

    return (
      <tr
        className="flex bg-gradient-to-r from-slate-100/80 via-gray-100/60 to-slate-100/80"
        style={{
          width: `${tableWidth}px`,
          height: `${rowHeight}px`,
          minHeight: `${rowHeight}px`,
          maxHeight: `${rowHeight}px`,
          boxSizing: "border-box",
          borderBottom: `0.5px solid rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)`,
          // the above border is the border of the footer
        }}
      >
        {columns
          .filter((col) => col.visible != false && col.dataField != null)
          .map((column, columnIndex) => {
            const summary = summaryConfig.find(
              (s) =>
                s.showInColumn === column.dataField ||
                s.column === column.dataField
            );
            const value = summary
              ? summaryValues[summary.column as string]
              : null;
            const formattedValue = summary?.customizeText
              ? summary.customizeText({ value })
              : value;

              const isFocused = false;

            return (
              <td
                key={`summary_${column.dataField}`}
                className="flex items-center justify-end px-1 py-1 font-semibold bg-slate-200 text-gray-700 "
                style={{
                  fontSize: `${gridFontSize}px`,
                  fontWeight: gridIsBold ? "bold" : "600",
                  width: column.width ? `${column.width}px` : "150px",
                  minWidth: column.width ? `${column.width}px` : "150px",
                  textAlign:
                    summary?.alignment ||
                    column.alignment ||
                    (column.dataType === "number" ? "right" : "left"),
                  boxSizing: "border-box",
                  borderRight: `0.2px solid rgba(${gridBorderColor ? gridBorderColor : "226,232,240"}, 0.8)`,
              }}
              >
                {summary ? formattedValue : ""}
              </td>
              // footer td
            );
          })}
      </tr>
    );
  };

// Ultra-fast memoized row component

const VirtualRow = React.memo(({
  details,
    columns,
    tableWidth,
    txtData,
    gridId,
    listRef,
    itemCount,
    gridRef,
    onKeyDown,
    onChange,
    useInSearch,
    searchByCodeAndName,
    advancedProductSearching,
    transactionType,
    blockUnitOnDecimalPoint,
    index,
    top,
    focusCell,
    nextCellFind,
    currentCell,
    gridFontSize,
    gridIsBold,
    rowHeight,
    dir,
    columnWidths,
    gridBorderColor,
    setCurrentCell
}: RowData) => {
   const [focusedColumn, setFocusedColumn] = useState<string | null>(null);
      const item = details[index];
      const rowRef = useRef<HTMLTableRowElement>(null);
      const dispatch = useAppDispatch();
      const formState = useSelector(
        (state: RootState) => state.InventoryTransaction
      );
      const appState = useSelector(
        (state: RootState) => state.AppState
      );

      const applicationSettings = useSelector(
        (state: RootState) => state.ApplicationSettings
      );

      const handleFocus = useCallback((columnKey: string) => {
        setFocusedColumn(columnKey);
      }, [index]);

      const handleBlur = useCallback(() => {
        if (document.activeElement?.closest(".dx-datagrid")) return;
        setFocusedColumn(null);
      }, []);
      // Common cell content style for consistent height
      const getCellContentStyle = (column: ColumnModel) => ({
        fontSize: `${gridFontSize}px`,
        fontWeight: gridIsBold ? "bold" : "normal",
        height: `${rowHeight}px`,
        minHeight: `${rowHeight}px`,
        maxHeight: `${rowHeight}px`,
        lineHeight: "normal",
        display: "flex",
        alignItems: "center",
        justifyContent: column.alignment === "left" ? "flex-start" : column.alignment === "right" ? "flex-end" : "center",
        textAlign: column.alignment || "center",
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
        WebkitUserSelect: "none" as const,
        MozUserSelect: "none" as const,
        msUserSelect: "none" as const,
        caretColor: "transparent",
        outline: "none",
        paddingLeft: "4px",
        paddingRight: "4px",
        boxSizing: "border-box" as const,
      })

      const customStyle = {
        ...formState.userConfig?.inputBoxStyle,
        inputSize: 'customize',
        inputHeight: (rowHeight - 0.6) / 16,
        fontSize: gridFontSize ?? 13,
        fontWeight: gridIsBold ?700:400,
      } as inputBox;



      const handleKeyDown = useCallback(
        (value: any, e: React.KeyboardEvent<HTMLElement>, column: ColumnModel, rowIndex: number) => {
          const target = e.target as HTMLElement
          
          if (!target.id) return

          const visibleColumns = columns.filter((col) => col.visible != false && col.dataField != null)
          const currentColumnIndex = visibleColumns.findIndex((col) => col.dataField === column.dataField)

          if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
            onKeyDown(value, e, column.dataField as keyof TransactionDetail, rowIndex)
            return
          }

          let shouldNavigate = true;
          if (target.tagName === "INPUT" || target.querySelector("input")) {
            const input =
              target.tagName === "INPUT"
                ? (target as HTMLInputElement)
                : (target.querySelector("input") as HTMLInputElement | null);
            if (input && input.type !== "number") {
              const { selectionStart, selectionEnd, value } = input;
              const effectiveValue = value || "";
              const effectiveStart = selectionStart ?? 0;
              const effectiveEnd = selectionEnd ?? 0;
              if (
                e.key === "ArrowRight" &&
                (effectiveStart !== effectiveValue.length || effectiveEnd !== effectiveValue.length)
              ) {
                shouldNavigate = false
              } else if (e.key === "ArrowLeft" && (effectiveStart !== 0 || effectiveEnd !== 0)) {
                shouldNavigate = false
              }
            }
          }

          if (!shouldNavigate) return;

          e.preventDefault();
          
          switch (e.key) {
            case "ArrowRight":
              if (currentColumnIndex < visibleColumns.length - 1) {
                const res = focusCell(index, currentColumnIndex + 1)
                if(res != null) {
                setCurrentCell({...res, data: details[index]})
                }
              }
              break
            case "ArrowLeft":
              if (currentColumnIndex > 1) {
                const res = focusCell(index, currentColumnIndex - 1)
               if(res != null) {
                setCurrentCell({...res, data: details[index]})
                }
              }
              break
            case "ArrowUp":
              {
                const res = focusCell(index - 1, currentColumnIndex)
                if(res != null) {
                setCurrentCell({...res, data: details[index]})
                }
              }
              break
            case "ArrowDown":
              {
                const res = focusCell(index + 1, currentColumnIndex)
                if(res != null) {
                setCurrentCell({...res, data: details[index]})
                }
              }
              break
          }
        },
        [columns, focusCell, setCurrentCell, onKeyDown],
      )

      const handleDelete = ()=>{
        console.log("Delete clicked for row", index);
        toast.error("There is nothing to delete");
      }

      const handleInfoClick = (index:number)=>{
        dispatch(
          formStateHandleFieldChange({
            fields:{
              showProductInformation:true
            }
          })
        )
      }

  const totalColumnWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  return (
    <div
      className={`py-0 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-gradient-to-r hover:from-[#eff6ff66] hover:to-[#eef2ff4d] transition-all duration-300 ease-in-out group`}
      style={{
        position: 'absolute',
        transform: `translateY(${top}px)`, // Use transform for better performance
        left: 0,
        height: `${rowHeight}px`,
        width: `${totalColumnWidth}px`, // Add this line
        minWidth: `${totalColumnWidth}px`, // Add this line
        display: 'flex',
          borderBottom:  `0.5px solid rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)`,
        // backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
        willChange: 'transform', // Optimize for animations
         fontSize: `${gridFontSize}px`,
        fontWeight: gridIsBold ? 'bold' : '600'
      }}
    >
      {columns.map((column, colIndex) => {
         const fieldKey = column.dataField as keyof TransactionDetail;
            const idField = column.idField as keyof TransactionDetail; // for cb
            const productId = item.productID;
            const cellValue = item[fieldKey];
            const idValue = item[idField]; // for cb
            let options: any[] = []
            if(fieldKey == "unit") {
              options = formState.batchesUnits?.filter(x => x.productBatchID == item.productBatchID) ??[] as any [];
            }  if(fieldKey == "warranty") {
              options = formState.dataWarranty ??[] as any [];
            }
            if(fieldKey == "brandID") {
              options = formState.dataBrands ??[] as any [];
            }
            const isFocused = false;
            const cellId = `${gridId}_${column.dataField}_${index}`;

        return (
          <div
          key={`${column.dataField}`}
          style={{
            width: `${columnWidths[colIndex]}px`,
            minWidth: `${columnWidths[colIndex]}px`,
            maxWidth: `${columnWidths[colIndex]}px`,
            borderRight: colIndex === columnWidths.length - 1  ? 'none'  : `0.2px solid rgba(${gridBorderColor ?? "226,232,240"}, 0.8)`,
            fontSize: `${gridFontSize}px`,
            textAlign: column.dataField === 'slNo'  ? 'center'  : ['qty'].includes(column.dataField ?? '')    ? 'right'    : 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={(e) => {
                            e.preventDefault();
                setCurrentCell({column: column.dataField??"",
                                    data:item,
                                    rowIndex: index})
                          }}
        >


          {formState.transactionLoading ? (
                            <div className="parent-selector-loading" style={{ width: "100%", margin: "3px 0", height: `${rowHeight}px` }}>
                              <div className="card_description loading"
                                style={{
                                  width: `${Math.floor(Math.random() * 50) + 40}%`,
                                  height: `${Math.min(rowHeight - 6, 16)}px`,
                                }}
                              ></div>
                            </div>
                          ) : column.dataField === "slNo" ? (
                            <div style={getCellContentStyle(column)} id={cellId}>
                              {index + 1}
                            </div>
                          ): column.dataField === "removeCol" ? (
                            <div className="flex items-center justify-center gap-4 p-6">
                              <button onClick={()=> handleInfoClick(index)} className="group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:bg-blue-50 hover:rounded-full hover:scale-105 hover:shadow-lg hover:border hover:border-blue-200">
                                <Info className="w-4 h-4 text-blue-600 transition-all duration-300 group-hover:text-blue-700" />
                              </button>

                              <button onClick={handleDelete} className="group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:bg-red-50 hover:rounded-full hover:scale-105 hover:shadow-lg hover:border hover:border-red-200">
                                <Trash2 className="w-4 h-4 text-red-600 transition-all duration-300 group-hover:text-red-700" />
                              </button>
                            </div>
                          )  : (column.dataField === "product" || column.dataField === "pCode") &&
                            !column.readOnly &&
                            currentCell?.column === column.dataField &&
                            currentCell?.rowIndex === index ? (
                            <ERPProductSearch
                              customStyle={customStyle}
                              appState={appState.appState}
                              textAlign={column.alignment === "right" ? "right" : "left"}
                              rowIndex={index}
                              id={cellId}
                              inputId={`${gridId}_${column.dataField}_${index}`}
                              searchType={
                                applicationSettings?.productsSettings?.usePopupWindowForItemSearch
                                  ? "modal"
                                  : "grid"
                              }
                              noLabel={true}
                              showCheckBox={false}
                              contextClassNametwo={`!text-sm !px-1 !py-0 !border-none !bg-transparent`}
                              value={(cellValue as string) || ""}
                              productDataUrl={`${Urls.inv_transaction_base}${transactionType}/products`}
                              batchDataUrl={`${Urls.inv_transaction_base}${transactionType}/batches/`}
                              className="h-[22px] text-sm"
                              onFocus={() => handleFocus(column.dataField!)}
                              onBlur={handleBlur}
                              onKeyDown={(value, e) => {handleKeyDown(value, e, column, index)}}
                              searchKey={column.dataField}
                              advancedProductSearching={advancedProductSearching}
                              useInSearch={useInSearch}

                              searchByCodeAndName={searchByCodeAndName}
                              onNextCellFind={nextCellFind}
                              onRowSelected={(data: any, rowValue?: string) => {
                                const res = {
                                  slNo: item.slNo,
                                  rowIndex: index,
                                  productBatchID: data.productBatchID,
                                  autoBarcode: data.autoBarcode,
                                  productCode: data.productCode,
                                  useProductCode: column.dataField === "pCode",
                                  searchText: rowValue,
                                  key: generateUniqueKey(),
                                };
                                dispatch(
                                  formStateHandleFieldChange({
                                    fields: { batchSelectionData: JSON.stringify(res) },
                                  })
                                );
                              }}
                            />
                          ) : column.dataField === "product" && !column.readOnly ? (
                            <div
                              style={getCellContentStyle(column)}
                              id={cellId}
                              tabIndex={0}
                              // className="w-full h-full flex items-center px-1 cursor-default"
                              onFocus={() => handleFocus(column.dataField!)}
                              onBlur={handleBlur}
                              onKeyDown={(e) => handleKeyDown(cellValue, e, column, index)}
                            >
                              {productId > 0 ? cellValue??"" : ""}
                            </div>
                          ) : column.dataField === "status" ? (
                            <div
                              style={{
                                ...getCellContentStyle(column),
                                justifyContent: "center",
                              }}
                              id={cellId}
                              tabIndex={0}
                              className={`inline-flex px-2 py-1 font-medium rounded-full cursor-default ${cellValue === "Active"
                                  ? "bg-[#dcfce7] text-[#166534]"
                                  : ""
                                } ${cellValue === "Inactive"
                                  ? "bg-[#fee2e2] text-[#991b1b]"
                                  : ""
                                } ${cellValue === "Pending"
                                  ? "bg-[#fef9c3] text-[#854d0e]"
                                  : ""
                              }`}
                              onFocus={() => handleFocus(column.dataField!)}
                              onBlur={handleBlur}
                              onKeyDown={(e) => handleKeyDown(cellValue, e, column, index)}
                            >
                              {productId > 0 ? cellValue??"" : ""}
                            </div>
                          ) : column.allowEditing && !column.readOnly && txtData.visible == true
                            &&  currentCell?.column === column.dataField &&
                            currentCell?.rowIndex === index ? (
                            <EditableCell
                              appState={appState.appState}
                              type={column.dataType == "cb" ? "cb": "any"}
                              productId={productId}
                              onChange={onChange}
                              blockUnitOnDecimalPoint={blockUnitOnDecimalPoint}
                              decimalLimit={2}
                              rowIndex={index}
                              column={column}
                              value={column.dataType == "cb" ? (idValue as string | number): (cellValue as string | number)}
                              options={options}
                              onFocus={() => handleFocus(column.dataField!)}
                              onBlur={handleBlur}
                              gridId={gridId}
                              onKeyDown={(e) => handleKeyDown(cellValue, e, column, index)}
                              gridFontSize={gridFontSize}
                              gridIsBold={gridIsBold}
                              formState={formState}
                              rowHeight={rowHeight}
                            />
                          ) : (
                            <div
                            title={JSON.stringify(currentCell)}
                              style={getCellContentStyle(column)}
                              id={cellId}
                              tabIndex={0}
                              // className="w-full h-full flex items-center px-1 cursor-default"
                              className="px-1 cursor-default"
                              onFocus={() => handleFocus(column.dataField!)}
                              onBlur={handleBlur}
                              onKeyDown={(e) => handleKeyDown(cellValue??"", e, column, index)}
                            >
                               {productId > 0 ? cellValue??"" : ""}
                            </div>
                          )}
        </div>
        )
      })}
    </div>
  );
});

const UltraFastReorderableVirtualTableGrid = forwardRef(function ErpPurchaseGrid<T extends DataItem>(
  {
    _columns = [],
    keyField,
    transactionType,
    onKeyDown,
    onChange,
    gridId, rowHeight = 33,
    className = "",
    height = 800,
    allowColumnReordering = true,
    summaryConfig = [],
    gridFontSize = 14,
    gridIsBold = false,
    gridBorderColor,
    gridHeaderBg,
    gridHeaderFontColor,
  }: DataGridProps<T>,
  ref: Ref<any>
) {
  const {
    startResize,
    columnWidths,
    setColumnWidths,
    columnOrder,
    setColumnOrder,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    dragOverIndex
  } = useTableResizeAndReorder(gridId);
  const appState = useAppSelector(
    (state: RootState) => state.AppState?.appState
  );
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const applicationState = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
   const preferenceChooserRef = useRef<{
    handleDragStart: (e: React.DragEvent<HTMLElement>) => void;
    handleDragEnd: (e: React.DragEvent<HTMLElement>) => void;
    handleDropping: (eFromDataGrid?: boolean) => void;
  }>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('transaction')
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
  const [isExcelMenuOpen, setIsExcelMenuOpen] = useState(false);
  const [exportVisibleColumns, setExportVisibleColumns] = useState(true);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualContainerRef = useRef<HTMLDivElement>(null);


   const totalGridWidth = useMemo(() => {
    return columnWidths.reduce((sum, width) => sum + width, 0);
  }, [columnWidths]);

    useEffect(() => {
    const fetchPreferences = async () => {
      // onApplyPreferences(await getInitialPreference(gridId, _columns, new APIClient()));
    };

    if (gridId && _columns) {
      fetchPreferences();
    }
  }, [gridId, _columns]);

    const onApplyPreferences = useCallback(
      (pref: GridPreference) => {
        const updated = applyGridColumnPreferences(
          (formState.gridColumns || _columns) as DevGridColumn[],
          pref
        );
        dispatch(
          formStateHandleFieldChange({ fields: { gridColumns: updated as ColumnModel[] } })
        );
      },
      [_columns, dispatch, formState.gridColumns]
    );


  // Memoized ordered columns
//   const columns = useMemo(() =>
//     columnOrder.length > 0 && formState.gridColumns
//       ? columnOrder.map(index => formState.gridColumns![index])
//       : formState.gridColumns,
//     [columnOrder, formState.gridColumns]
// );
 const columns = useMemo(() => {

  const visibleColumns = formState.gridColumns?.filter(x => x.visible !== false) ?? [];

  if (columnOrder.length > 0 && visibleColumns?.length > 0) {
    return columnOrder.map(index => visibleColumns[index]).filter(col => col !== undefined);
  }

  return visibleColumns;
}, [columnOrder, formState.gridColumns]);
//   const columns = useMemo(() =>{
//     if(formState.gridColumns) {
//       return []
//     } else {
// return columnOrder.length > 0 && (formState.gridColumns as ColumnModel[]).length > 0
//       ? columnOrder.map(index => formState.gridColumns![index])
//       : formState.gridColumns
//     }

// },
//     [columnOrder, formState.gridColumns]
// );



  // Virtual scrolling configuration
  const ITEM_HEIGHT =formState.userConfig?.gridRowHeight??32;

  const { scrollTop, updateScroll, visibleItems, totalHeight } = useUltraFastVirtualScrolling(
    formState.transaction.details.length,
    ITEM_HEIGHT,
    height
  );

  // Initialize column order and widths
  // useEffect(() => {
  //   if (columnOrder.length === 0 && formState.gridColumns) {
  //     setColumnOrder(formState.gridColumns.map((_, index) => index));
  //   }
  //   if (columnWidths.length === 0 && formState.gridColumns) {
  //     setColumnWidths(formState.gridColumns.map(col => col.width??0));
  //   }
  // }, [formState.gridColumns, columnOrder.length, columnWidths.length, setColumnOrder, setColumnWidths]);

  useEffect(() => {
  const visibleColumns = formState.gridColumns?.filter(col => col.visible !== false) ?? [];

  if (columnOrder.length === 0) {
    setColumnOrder(visibleColumns.map((_, index) => index));
  }

  if (columnWidths.length === 0) {
    setColumnWidths(visibleColumns.map(col => col.width ?? 0));
  }
}, [formState.gridColumns, columnOrder.length, columnWidths.length, setColumnOrder, setColumnWidths]);


  // Memoized footer data


  // Ultra-fast scroll handler with immediate updates to prevent white areas
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    updateScroll(scrollTop);
  }, [updateScroll]);

  // Attach resize handlers
  useEffect(() => {
    if (!containerRef.current || columnWidths.length === 0) return;

    const handles = containerRef.current.querySelectorAll('[data-resize-handle]');
    const cleanupFunctions: (() => void)[] = [];
     const isRTL =appState.direction==='rtl';
    handles.forEach((handle, index) => {
      const handleMouseDown = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        if (containerRef.current) {
          //Arabic resize
          startResize(mouseEvent,isRTL? index-1:index, containerRef.current, columnWidths);
        }
      };

      handle.addEventListener('mousedown', handleMouseDown);
      cleanupFunctions.push(() => {
        handle.removeEventListener('mousedown', handleMouseDown);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [startResize, columns, columnWidths]);

  if (columnWidths.length === 0 || columnOrder.length === 0) {
    // return <div>Loading...</div>;
  }


 const openExcelMenu = () => {
    setIsExcelMenuOpen(true);
  };

  const closeExcelMenu = () => {
    setIsExcelMenuOpen(false);
  };
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Grid Data');

    const excelColumns = exportVisibleColumns
      ? formState.gridColumns?.filter((col) => col.visible != false && col.dataField != null)
      : formState.gridColumns;

    worksheet.columns = (excelColumns ?? []).map((col) => ({
      header: col.caption,
      key: col.dataField,
      width: col.width ? col.width / 7 : 20,
    }));

    formState.transaction?.details.forEach((item, index) => {
      const row: { [key: string]: any } = {};
      excelColumns?.forEach((col) => {
        const fieldKey = col.dataField as keyof TransactionDetail;
        if (fieldKey === 'slNo') {
          row[fieldKey] = index + 1;
        } else {
          row[fieldKey] = item[fieldKey] ?? '';
        }
      });
      worksheet.addRow(row);
    });

    if (summaryConfig.length > 0) {
      const summaryRow: { [key: string]: any } = {};
      excelColumns?.forEach((col) => {
        const summary = summaryConfig.find(
          (s) => s.showInColumn === col.dataField || s.column === col.dataField
        );
        if (summary && col.dataField !== undefined) {
          const value = formState.summary[summary.column as keyof typeof formState.summary];
          summaryRow[col.dataField] = summary.customizeText
            ? summary.customizeText({ value })
            : value ?? '';
        } else {
          if (col.dataField !== undefined) {
            summaryRow[col.dataField] = '';
          }
        }
      });
      worksheet.addRow(summaryRow);
    }

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      };
    });
    if (summaryConfig.length > 0) {
      const lastRowIndex = worksheet.rowCount;
      const summaryRow = worksheet.getRow(lastRowIndex);
      summaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' },
      };
      summaryRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        };
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${gridId}_export.xlsx`);
  };
 const focusCell = useCallback(
    (targetRow: number, targetColumnIndex: number) => {
      const visibleColumns =
        formState.gridColumns?.filter(
          (col) => col.visible != false && col.dataField != null
        ) ?? [];
      const itemCount = formState.transaction?.details.length || 0;
      if (
        targetRow < 0 ||
        targetRow >= itemCount ||
        targetColumnIndex < 0 ||
        targetColumnIndex >= visibleColumns.length
      )
        return null;

      const targetColumn = visibleColumns[targetColumnIndex];

      // if (listRef.current) listRef.current.scrollToItem(targetRow, "smart");

      const attemptFocus = () => {
        return {column: targetColumn.dataField??"", rowIndex: targetRow};
      };

      return attemptFocus();
    },
    [
      formState.gridColumns,
      formState.transaction?.details.length,
      gridId,
      // listRef,
      // gridRef,
    ]
  );

  const focusCurrentColumn = useCallback(
    (rowIndex: number, column: string) => {
      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );
      const currentEditableIndex = findCurrentEditableIndex(rowIndex, column);
      const editable = editableColumns
        ? editableColumns[currentEditableIndex]
        : undefined;
      const targetColumnIndex = visibleColumns?.findIndex(
        (col) => col.dataField === editable?.dataField
      );
      if (rowIndex >= 0 && (targetColumnIndex ?? -1) >= 0) {
        return focusCell(rowIndex, targetColumnIndex ?? -1);

      }
      return null
    },
    [formState.gridColumns, focusCell]
  );
  const findCurrentEditableIndex = useCallback(
    (rowIndex: number, column: string) => {
      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );

      if (editableColumns?.length === 0) {
        return -1;
      }

      return !editableColumns
        ? -1
        : editableColumns?.findIndex((col) => col.dataField === column);
    },
    [formState.gridColumns, focusCell]
  );
  const focusColumn = useCallback(
    (rowIndex: number, column: string) => {

      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );

      if (editableColumns?.length === 0) {
        return -1;
      }

      const currentEditableIndex = !editableColumns
        ? -1
        : editableColumns?.findIndex((col) => col.dataField === column);

      const currentEditable = editableColumns![currentEditableIndex];
      const targetColumnIndex = visibleColumns?.findIndex(
        (col) => col.dataField === currentEditable.dataField
      );

      if (targetColumnIndex??-1 >= 0) {
        return focusCell(rowIndex, targetColumnIndex!);
      }
      return null;
    },
    [formState.gridColumns, focusCell]
  );

  const nextCellFind = useCallback(
    (
      rowIndex: number,
      column: string,
      excludedColumns?: (keyof TransactionDetail)[]
    ) => {
      const visibleColumns = formState.gridColumns?.filter(
        (col) => col.visible != false && col.dataField != null
      );

      const editableColumns = visibleColumns?.filter(
        (col) => col.allowEditing && col.readOnly !== true
      );
      const currentEditableIndex = findCurrentEditableIndex(rowIndex, column);
      let targetRow = rowIndex;
      let targetColumnIndex = -1;
      if (visibleColumns && editableColumns) {
        if (
          currentEditableIndex >= 0 &&
          currentEditableIndex < editableColumns?.length - 1
        ) {
        const nextEditable = excludedColumns
  ? (() => {
      // Start from the next index after current
      for (let i = currentEditableIndex + 1; i < editableColumns.length; i++) {
        const column = editableColumns[i];
        if (column.dataField &&
            !excludedColumns.includes(column.dataField as keyof TransactionDetail)) {
          return column;
        }
      }
      // If no next column found, wrap around to beginning
      for (let i = 0; i <= currentEditableIndex; i++) {
        const column = editableColumns[i];
        if (column.dataField &&
            !excludedColumns.includes(column.dataField as keyof TransactionDetail)) {
          return column;
        }
      }
      return null; // or undefined, depending on your needs
    })()
  : editableColumns[currentEditableIndex + 1];
          targetColumnIndex = visibleColumns.findIndex(
            (col) => col.dataField === nextEditable?.dataField
          );
        } else {
          targetRow += 1;
          const firstEditable = editableColumns[0];
          targetColumnIndex = visibleColumns.findIndex(
            (col) => col.dataField === firstEditable.dataField
          );
        }
      }

      if (targetColumnIndex >= 0) {
        return focusCell(targetRow, targetColumnIndex);
      }
      return null;
    },
    [formState.gridColumns, focusCell]
  );

const [currentCell, setCurrentCell] = useState<CurrentCell | undefined>(formState.currentCell);
const [prevCell, setPrevCell] = useState<number>(formState.currentCell?.rowIndex??-1);
  useEffect(() => {
  setCurrentCell(formState.currentCell)

  }, [formState.currentCell])
useEffect(() => {
    if (
      currentCell &&
      currentCell.column != "" &&
      currentCell.rowIndex > -1
    ) {
      const targetCellId = `${gridId}_${currentCell.column}_${currentCell.rowIndex}`;
      const targetCell = document.getElementById(
        targetCellId
      ) as HTMLElement | null;
      if (targetCell) {
        if (currentCell.column === "product" || currentCell.column === "pCode") {
          const erpSearchInput = targetCell.querySelector(
            `input[id="${targetCellId}"]`
          ) as HTMLInputElement | null;
          if (erpSearchInput) {
            erpSearchInput.focus();
            erpSearchInput.select();
            return;
          }
        }
        targetCell.focus();
        const input =
          targetCell.tagName === "INPUT"
            ? (targetCell as HTMLInputElement)
            : (targetCell.querySelector("input") as HTMLInputElement | null);
        if (input) input.select();

        //  const targetCell = document.getElementById(targetCellId) as HTMLElement;
        // if (purchaseGridRef?.current && targetCell) {
        //   const cellRect = targetCell?.getBoundingClientRect();
        //   const gridRect =
        //     purchaseGridRef?.current?.gridRef?.getBoundingClientRect();
        //   const scrollLeft = purchaseGridRef?.current?.gridRef?.scrollLeft;
        //   if (
        //     cellRect?.left < gridRect?.left &&
        //     purchaseGridRef &&
        //     purchaseGridRef.current &&
        //     purchaseGridRef?.current?.gridRef
        //   ) {
        //     purchaseGridRef.current.gridRef.scrollLeft =
        //       scrollLeft + (cellRect?.left - gridRect?.left);
        //   } else if (
        //     cellRect?.right > gridRect?.right &&
        //     purchaseGridRef &&
        //     purchaseGridRef.current &&
        //     purchaseGridRef?.current?.gridRef
        //   ) {
        //     purchaseGridRef.current.gridRef.scrollLeft =
        //       scrollLeft + (cellRect?.right - gridRect?.right);
        //   }
        // }
      }
    }
    setPrevCell(currentCell?.rowIndex??-1)
     if(prevCell != currentCell?.rowIndex) {
    localStorage.setItem(`${formState.transaction.master.voucherType}${formState.transaction.master.voucherForm}`, JSON.stringify(formState.transaction.details.filter(x => x.productID > 0)))
  }
  }, [currentCell]);
 React.useImperativeHandle(ref, () => ({
    focusCell,
    nextCellFind,
    focusColumn,
    focusCurrentColumn,
  }));

  const isMinimized = appState.toggled && appState.toggled.includes("close");
  const sidebarWidth = isMinimized ? "0" : "0";
  const isLargeScreen = window.innerWidth >= 1000;
  const headerLeft = isLargeScreen ? sidebarWidth : "0";
  const isRtl = appState.locale.rtl;

  const headerStyle = {
    left: isRtl ? "0" : headerLeft,
    right: isRtl ? headerLeft : "0"
  };

    const closeGridMenu = () => {
    setIsGridMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeGridMenu();
      }
    };

    if (isGridMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGridMenuOpen]);



 return (
    <div
      style={{
        maxWidth: "100%",
        width: "100%",
        overflowX: 'auto',
        overflowY: 'hidden',
        boxSizing: "border-box",
        border: `0.5px solid rgba(${gridBorderColor ? gridBorderColor : "203,213,225"}, 0.4)`,
        borderRadius: formState.userConfig?.gridBorderRadius  ? `${formState.userConfig.gridBorderRadius}px`  : "0px",
        boxShadow: "0 4px 25px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
      }}
      className="bg-gradient-to-br from-slate-50/80 via-white to-[#eff6ff4d] rounded-2xl shadow-xl backdrop-blur-sm"
    >
          <div className={`relative ${className} w-full`}>
            {isGridMenuOpen && (
              <div
                ref={popupRef}
                className="fixed top-[49px] w-[251px] rounded-lg bg-white dark:bg-[#1f2937] text-black dark:text-[#f3f4f6] shadow-xl border border-[#e5e7eb] dark:border-[#374151] p-2 z-50 backdrop-blur-sm"
                style={headerStyle}
              >
                <nav className="w-full">
                  <ul className="space-y-1">
                    <li>
                      <div className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#f3e8ff] hover:text-[#7c3aed] dark:hover:bg-[#4c1d954d] dark:hover:text-[#d8b4fe] transition-all duration-200 rounded-md group text-left cursor-pointer">
                        <div className="w-8 h-8 bg-[#ede9fe] dark:bg-[#4c1d954d] rounded-full flex items-center justify-center group-hover:bg-[#e9d5ff] dark:group-hover:bg-[#6b21a899] group-hover:scale-110 transition-all duration-200">
                          <Settings className="h-4 w-4 text-[#7c3aed] dark:text-[#d8b4fe]" />
                        </div>
                        <GridPreferenceChooser
                          ref={preferenceChooserRef}
                          gridId={gridId}
                          columns={(formState.gridColumns ?? []) as DevGridColumn[]}
                          onApplyPreferences={onApplyPreferences}
                          showChooserName={true}
                          eclipseClass="m-0 p-0 font-medium"
                        />
                      </div>
                    </li>
                    <li>
                      <button
                        onClick={openExcelMenu}
                        className="w-full flex items-center gap-3 px-3 py-[5px] hover:bg-[#fff8e1] hover:text-[#ff8f00] dark:hover:bg-[#3e2f004d] dark:hover:text-[#ffe082] transition-all duration-200 rounded-md group text-left"
                      >
                        <div className="w-8 h-8 bg-[#ffecb3] dark:bg-[#3e2f004d] rounded-full flex items-center justify-center group-hover:bg-[#ffe082] dark:group-hover:bg-[#3e2f0099] group-hover:scale-110 transition-all duration-200">
                          <FileUp className="h-4 w-4 text-[#ff8f00] dark:text-[#ffe082]" />
                        </div>
                        <span className="font-medium">{t('export_to_excel')}</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
            {isExcelMenuOpen && (
              <ERPModal
                isOpen={isExcelMenuOpen}
                title={t("export_options")}
                width={400}
                height={200}
                closeModal={closeExcelMenu}
                content={
                  <>
                    <ERPCheckbox
                      id="exportVisibleColumns"
                      label={t("export_only_visible_column")}
                      checked={exportVisibleColumns}
                      onChange={() => setExportVisibleColumns(!exportVisibleColumns)}
                    />
                  </>
                }
                footer={
                  <div className="flex items-center justify-end p-1 border-t border-gray-200">
                    <ERPButton
                      variant="primary"
                      title={t("export")}
                      onClick={exportToExcel}
                    />
                  </div>
                }
              />
            )}
        <divF
        ref={containerRef}
        style={{ width: `${totalGridWidth + 2}px`, minWidth: `${totalGridWidth + 2}px` ,borderRadius: formState.userConfig?.gridBorderRadius  ? `${formState.userConfig.gridBorderRadius}px`  : "0px",}}
        className="overflow-x-auto"
      >
        {/* Header */}
        <div className="table-header">
        <div
          style={{
            display: 'flex',
            background: gridHeaderBg
              ? `rgb(${gridHeaderBg})F`
              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
            borderBottom: `0.5px solid rgba(${gridBorderColor ? gridBorderColor : "203,213,225"}, 0.4)`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
            {columns?.map((column, index) => (
              <div
                key={`${column.dataField}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  width: `${columnWidths[index]}px`,
                  minWidth: `${columnWidths[index]}px`,
                  maxWidth: `${columnWidths[index]}px`,
                  padding: '8px 12px',
                  borderRight: index === columnWidths.length - 1  ? 'none'  : `0.2px solid rgba(${gridBorderColor ?? "226,232,240"}, 0.8)`,
                  fontWeight: gridIsBold ? 700 : 500,
                  fontSize: gridFontSize ?? 14,
                  position: 'relative',
                  background: dragOverIndex === index ? '#e3f2fd' : gridHeaderBg ? `rgb(${gridHeaderBg})` : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'move',
                  transition: 'background-color 0.1s ease',
                  borderLeft: dragOverIndex === index ? '2px solid #2196f3' : 'none',
                  color: gridHeaderFontColor  ? `rgb(${gridHeaderFontColor})`  : "#1f2937",
                }}
              >
            {index === 0 ? (
              <>
                <button
                  ref={buttonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGridMenuOpen((prev) => !prev);
                  }}
                  className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2 mr-2`}
                >
                  <EllipsisVertical className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
                {column.caption}
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px', opacity: 0.6 }}>⋮⋮</span>
                {column.caption}
              </>
            )}
                {index < columns.length - 1 && (
                  <div
                    data-resize-handle
                    style={{
                      position: 'absolute',
                      right: '-2px',
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      cursor: 'col-resize',
                      backgroundColor: 'transparent',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Ultra-Fast Virtual Body */}
        <div
          ref={virtualContainerRef}
          style={{
            height: `${height}px`,
            width: `${totalGridWidth + 2}px`,
            minWidth: `${totalGridWidth + 2}px`,
            overflowX: 'auto',
            overflowY: 'auto',
            position: 'relative',
            willChange: 'scroll-position',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          onScroll={handleScroll}
        >
          <div
            style={{
              height: `${totalHeight}px`,
              width: `${totalGridWidth}px`,
              minWidth: `${totalGridWidth}px`,
              position: 'relative',
              contain: 'layout style paint',
              isolation: 'isolate',
            }}
          >
            {visibleItems.map(({ index, top }) => (
              <VirtualRow
                key={index}
                index={index}
                top={top}
                columns={columns ?? []}
                columnWidths={columnWidths}
                details={formState.transaction.details}
                rowHeight={ITEM_HEIGHT}
                tableWidth={totalGridWidth}
                txtData={formState.formElements.txtData}
                gridId={gridId}
                listRef={containerRef as any}
                itemCount={formState.transaction.details.length}
                gridRef={containerRef as any}
                onKeyDown={(value, e, column, rowIndex) => {
                  
                  onKeyDown(value, e, column, rowIndex);
                }}
                onChange={(value, column, rowIndex) => {
                  onChange(value, column, rowIndex);
                }}
                searchByCodeAndName={formState.userConfig?.enableItemCodeSearchInNameColumn}
                advancedProductSearching={false}
                transactionType={transactionType ?? formState.transactionType}
                blockUnitOnDecimalPoint={false}
                focusCell={focusCell}
                nextCellFind={nextCellFind}
                currentCell={currentCell}
                setCurrentCell={setCurrentCell}
                gridFontSize={gridFontSize}
                gridIsBold={gridIsBold}
                dir={appState.direction as "ltr" | "rtl"}
                gridBorderColor={gridBorderColor}
              />
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="table-footer">
          <div
            style={{
              display: 'flex',
              width: `${totalGridWidth}px`,
              minWidth: `${totalGridWidth}px`,
              backgroundColor: '#f8f9fa',
              borderTop: `0.1px solid rgba(${gridBorderColor ? gridBorderColor : "226,232,240"}, 0.3)`,
            }}
          >
            {columns?.map((column, colIndex) => (
              <div
                key={`footer-${column.dataField}`}
                style={{
                  width: `${columnWidths[colIndex]}px`,
                  minWidth: `${columnWidths[colIndex]}px`,
                  maxWidth: `${columnWidths[colIndex]}px`,
                  padding: '8px 12px',
                  borderRight: colIndex === columnWidths.length - 1  ? 'none'  : `0.2px solid rgba(${gridBorderColor ?? "226,232,240"}, 0.8)`,
                  fontSize: `${gridFontSize}px`,
                  fontWeight: gridIsBold ? "bold" : "600",
                  textAlign: column.alignment,
                  backgroundColor: '#f8f9fa',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {formState.summary?.[column.dataField as keyof SummaryItems] ?? ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
})
export default UltraFastReorderableVirtualTableGrid;

