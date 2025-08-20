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
} from "react-window";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import {
  ChevronDown,
  EllipsisVertical,
  FileUp,
  Info,
  Menu,
  Paintbrush,
  Settings,
  Trash2,
} from "lucide-react";
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
} from "../../../utilities/dx-grid-preference-updater";
import type {
  ColumnModel,
  CurrentCell,
  FormElementState,
  SummaryItems,
  TransactionDetail,
  TransactionFormState,
} from "../../../pages/inventory/transactions/purchase/transaction-types";
import {
  formStateDeleteDetails,
  formStateHandleFieldChange,
} from "../../../pages/inventory/transactions/purchase/reducer";
import useDebounce from "../../../pages/inventory/transactions/purchase/use-debounce";
import { generateUniqueKey } from "../../../utilities/Utils";
import "../../../assets/css/loader-style.css";
import { ERPSimpleComboboxRef } from "../../ERPComponents/erp-simple-combobox";
import { AppState, inputBox } from "../../../redux/slices/app/types";
import { useTranslation } from "react-i18next";
import ERPModal from "../erp-modal";
import ERPCheckbox from "../erp-checkbox";
import ERPButton from "../erp-button";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTableResizeAndReorder } from "./use-resizing";
import { useUltraFastVirtualScrolling } from "./use-virtual-scrolling";
import { ApplicationSettingsType } from "../../../pages/settings/system/application-settings-types/application-settings-types";

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
  isMobile?: boolean;
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
  showColumnBorder?: boolean;
  activeRowBg?: string;
  headerRowHeight?: number;
  gridFooterBg?: string;
  gridFooterFontColor?: string;
}

// export gridThemes = [
//   {
//     name: "theme1",
//     image: "",
//     fontSize: '',
//     bold: '',
//     borderColor: '',
//     headerBG: '',
//     headerFontColor: '',
//     borderRadius: '',
//     isColumnBorder: '',
//     activeRowBG: '',
//     rowHeight: ' ';
//   },
// ]
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
  type: "any" | "cb" | "btn" | "chk";
  rowHeight: number;
  formState: any;
  appState: any;
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
  top: number;
  focusCell: (
    targetRow: number,
    targetColumnIndex: number
  ) => { column: string; rowIndex: number } | null;
  nextCellFind: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => { column: string; rowIndex: number } | null;
  currentCell?: { column: string; rowIndex: number; data: TransactionDetail };
  setCurrentCell: React.Dispatch<React.SetStateAction<CurrentCell | undefined>>;
  gridFontSize: number;
  gridIsBold: boolean;
  rowHeight: number;
  dir: "ltr" | "rtl";
  columnWidths: number[];
  gridBorderColor?: string;
  formState: TransactionFormState;
  appState: AppState;
  applicationSettings: ApplicationSettingsType;
  isMobileGridRow?: boolean
  isMobileEditRow?: boolean
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

    const editCellComboBox: inputBox = formState?.userConfig?.inputBoxStyle;
    const gridBorderCol = formState?.userConfig?.gridBorderCol;
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
    const [bgColor, setBgColor] = useState<string>(appState.mode === "dark" ? document.activeElement === inputRef.current ? "#444444" : "#333333" : `rgb(${mergedInputBox?.defaultBgColor || "255,255,255"})`);
    const [foreColor, setForeColor] = useState<string>(appState.mode === "dark" ? "#e0e0e0" : `rgb(${mergedInputBox?.fontColor || "0,0,0"})`);

    useEffect(() => {
      if (appState.mode === "dark") {
        setBgColor(
          document.activeElement === inputRef.current ? "#444444" : "#333333"
        );
        setForeColor("#e0e0e0");
      } else {
        setBgColor(
          document.activeElement === inputRef.current ? `rgb(${mergedInputBox?.focusBgColor || "240,248,255"})` : `rgb(${mergedInputBox?.defaultBgColor || "255,255,255"})`
        );
        setForeColor(`rgb(${mergedInputBox?.fontColor || "0,0,0"})`);
      }
    }, [appState.mode, document.activeElement, inputRef.current, mergedInputBox?.focusBgColor, mergedInputBox?.defaultBgColor, mergedInputBox?.fontColor,]);

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
      },
      300
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" || e.key === "Delete") return;
      onKeyDown(e, column, rowIndex);
    };

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
    } as React.CSSProperties;

    return (
      <>
        {type === "cb" ? (
          <ERPDataCombobox
            options={options ?? []}
            onChange={(e) => {
              onChange(
                e.value,
                column.dataField as keyof TransactionDetail,
                rowIndex
              );
            }}
            id={`${gridId}_${column.dataField}_${rowIndex}`}
            noLabel
            enableClearOption={false}
            className="!w-full !h-full !bg-inherit !p-0 !space-y-0"
            disableEnterNavigation
            value={value}
            label={column.dataField}
            field={{
              id: `${gridId}_${column.dataField}_${rowIndex}-cb`,
              valueKey:
                column?.field && column?.field.valueKey
                  ? column?.field.valueKey
                  : "value",
              labelKey:
                column?.field && column?.field.labelKey
                  ? column?.field.labelKey
                  : "label",
            }}
            noBorder
            onKeyDown={handleKeyDown}
            localInputBox={mergedInputBox}
          />
        ) : (
          <input
            ref={inputRef}
            id={`${gridId}_${column.dataField}_${rowIndex}`}
            type={column.dataType === "number" ? "text" : "text"}
            className="bg-transparent border-none focus:ring-0 focus:outline-none"
            style={{
              ...cellStyle,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              backgroundColor: bgColor,
              color: foreColor,
              border: "none",
              width: "100%",
            }}
            value={localValue}
            readOnly={column.readOnly}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          />
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
  appState: AppState;
}> = ({
  columns,
  tableWidth,
  summaryValues,
  summaryConfig,
  gridFontSize,
  gridIsBold,
  rowHeight,
  gridBorderColor,
  appState,
}) => {
    const formState = useAppSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const showBorder = formState.userConfig?.showColumnBorder ?? true;

    return (
      <tr
        className={`flex ${appState.mode === "dark" ? "bg-gradient-to-r from-[#444444] via-[#555555] to-[#444444]" : "bg-gradient-to-r from-slate-100/80 via-gray-100/60 to-slate-100/80"}`}
        style={{
          width: `${tableWidth}px`,
          height: `${rowHeight}px`,
          minHeight: `${rowHeight}px`,
          maxHeight: `${rowHeight}px`,
          boxSizing: "border-box",
          borderBottom: `0.5px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)`}`,
        }}
      >
        {columns
          .filter((col) => col.visible !== false && col.dataField != null)
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
            const isFirstColumn = columnIndex === 0;
            const isLastColumn = columnIndex === columns.length - 1;
            return (
              <td
                key={`summary_${column.dataField}`}
                className={`flex items-center justify-end px-1 py-1 font-semibold ${appState.mode === "dark" ? "bg-[#555555] text-[#e0e0e0]" : "bg-slate-200 text-gray-700"}`}
                style={{
                  fontSize: `${gridFontSize}px`,
                  fontWeight: gridIsBold ? "bold" : "600",
                  width: column.width ? `${column.width}px` : "150px",
                  minWidth: column.width ? `${column.width}px` : "150px",
                  textAlign: summary?.alignment || column.alignment || (column.dataType === "number" ? "right" : "left"),
                  boxSizing: "border-box",
                  borderRight: isFirstColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}`
                    : isLastColumn ? "none" : showBorder ? `0.2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`}` : "none",
                  borderLeft: isLastColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}` : "none",
                }}
              >
                {summary ? formattedValue : ""}
              </td>
            );
          })}
      </tr>
    );
  };

const VirtualRow = React.memo(
  ({
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
    setCurrentCell,
    formState,
    appState,
    applicationSettings,
    isMobileGridRow = false,
    isMobileEditRow = false
  }: RowData) => {
    const [focusedColumn, setFocusedColumn] = useState<string | null>(null);
    const item = details[index];
    const rowRef = useRef<HTMLTableRowElement>(null);
    const dispatch = useAppDispatch();
    const handleFocus = useCallback((columnKey: string) => { setFocusedColumn(columnKey); }, [index]);

    const handleBlur = useCallback(() => {
      if (document.activeElement?.closest(".dx-datagrid")) return;
      setFocusedColumn(null);
    }, []);

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
      color: appState.mode === "dark" ? "#e0e0e0" : "#000000",
    });

    const customStyle = {
      ...formState.userConfig?.inputBoxStyle,
      inputSize: "customize",
      inputHeight: (rowHeight - 0.6) / 16,
      fontSize: gridFontSize ?? 13,
      fontWeight: gridIsBold ? 700 : 400,
    } as inputBox;

    const handleKeyDown = useCallback(
      (
        value: any,
        e: React.KeyboardEvent<HTMLElement>,
        column: ColumnModel,
        rowIndex: number
      ) => {
        debugger;
        const target = e.target as HTMLElement;
        const visibleColumns = columns.filter(
          (col) => col.visible !== false && col.dataField != null
        );
        const currentColumnIndex = visibleColumns.findIndex(
          (col) => col.dataField === column.dataField
        );

        if (
          !["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          onKeyDown(
            value,
            e,
            column.dataField as keyof TransactionDetail,
            rowIndex
          );
          return;
        }
        if (!target.id) return;

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
              (effectiveStart !== effectiveValue.length ||
                effectiveEnd !== effectiveValue.length)
            ) {
              shouldNavigate = false;
            } else if (
              e.key === "ArrowLeft" &&
              (effectiveStart !== 0 || effectiveEnd !== 0)
            ) {
              shouldNavigate = false;
            }
          }
        }

        if (!shouldNavigate) return;

        e.preventDefault();

        switch (e.key) {
          case "ArrowRight":
            if (currentColumnIndex < visibleColumns.length - 1) {
              const res = focusCell(index, currentColumnIndex + 1);
              if (res != null) {
                setCurrentCell({ ...res, data: details[index] });
              }
            }
            break;
          case "ArrowLeft":
            if (currentColumnIndex > 1) {
              const res = focusCell(index, currentColumnIndex - 1);
              if (res != null) {
                setCurrentCell({ ...res, data: details[index] });
              }
            }
            break;
          case "ArrowUp":
            {
              const res = focusCell(index - 1, currentColumnIndex);
              if (res != null) {
                setCurrentCell({ ...res, data: details[index] });
              }
            }
            break;
          case "ArrowDown":
            {
              const res = focusCell(index + 1, currentColumnIndex);
              if (res != null) {
                setCurrentCell({ ...res, data: details[index] });
              }
            }
            break;
        }
      },
      [columns, focusCell, setCurrentCell, onKeyDown]
    );

    const handleDelete = (slNo: string) => {
      dispatch(formStateDeleteDetails({ slNo: slNo }));
    };

    const handleInfoClick = (index: number) => {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            showProductInformation: { show: true, index: index },
          },
        })
      );
    };

    const rowBg = `${appState.mode === "dark" ? index % 2 === 0 ? "bg-[#333333]" : "bg-[#444444]" : index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"} ${appState.mode === "dark" ? "hover:bg-[#555555]" : "hover:bg-gradient-to-r hover:from-[#eff6ff66] hover:to-[#eef2ff4d]"}`;

    const totalGridWidth = useMemo(() => {
      return columnWidths.reduce((sum, width) => sum + width, 0);
    }, [columnWidths]);

    return (
      <>
        {
          isMobileGridRow ? (
            <>
              <div
                className={`py-0 ${rowBg} transition-all duration-300 ease-in-out group`}
                style={{
                  borderBottom: `0.5px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)`}`,
                  backgroundColor: currentCell?.rowIndex === index ? appState.mode === "dark" ? "#444444" : formState.userConfig?.activeRowBg ? `rgb(${formState.userConfig.activeRowBg})` : "#e3f2fd"
                    : index % 2 === 0 ? appState.mode === "dark" ? "#333333" : "#fff" : appState.mode === "dark" ? "#444444" : "#f9f9f9",
                }}
              >
                <div className="px-2 xs:px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-none xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto">

                    <div className="flex flex-col md:flex-row sm:flex-row xs:flex-row xs:items-center xs:justify-between p-2 xs:p-3 sm:p-4 !pb-0 gap-2 xs:gap-3">
                      <div className="flex items-center justify-between gap-2 xs:gap-3 min-w-0 flex-1">
                        <span className="text-gray-400 text-xs xs:text-sm font-medium whitespace-nowrap">
                          #{item.productBatchID}
                        </span>
                        <span className="text-gray-900 font-medium text-sm xs:text-base truncate" title={item.product}>
                          {item.product}
                        </span>
                        <span className="text-gray-900 font-medium text-sm xs:text-base whitespace-nowrap self-end xs:self-auto">
                          ₹ {item.unitPrice}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 xs:p-3 sm:p-4 !pt-1 space-y-2 xs:space-y-3">
                      <div className="flex items-start xs:items-center justify-between gap-2">
                        <span className="text-gray-600 text-xs xs:text-sm whitespace-nowrap">
                          Item Subtotal
                        </span>
                        <span className="text-gray-600 text-xs xs:text-sm text-right">
                          1 X ₹ 0 = ₹ {item.total}
                        </span>
                      </div>

                      <div className="flex items-start xs:items-center justify-between gap-2">
                        <span className="text-orange-400 text-xs xs:text-sm whitespace-nowrap">
                          Discount (%): {item.discPerc}%
                        </span>
                        <span className="text-orange-400 text-xs xs:text-sm text-right whitespace-nowrap">
                          ₹ {item.discount}
                        </span>
                      </div>

                      <div className="flex items-start xs:items-center justify-between gap-2">
                        <span className="text-gray-600 text-xs xs:text-sm whitespace-nowrap">
                          Tax: {item.vatPerc}%
                        </span>
                        <span className="text-gray-600 text-xs xs:text-sm text-right whitespace-nowrap">
                          ₹ {item.totalAddExpense}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) :
            (
              <div
                className={`py-0 ${rowBg} transition-all duration-300 ease-in-out group`}
                style={{
                  position: isMobileEditRow ? 'static' : 'absolute',
                  top: isMobileEditRow ? '' : `${top}px`,
                  left: isMobileEditRow ? '' : 0,
                  height: isMobileEditRow ? '' : `${rowHeight}px`,
                  width: "100%",
                  display: "flex",
                  flexDirection: 'row',
                  borderBottom: `0.5px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${formState.userConfig?.gridBorderColor || "203,213,225"}, 0.3)`}`,
                  backgroundColor: currentCell?.rowIndex === index ? appState.mode === "dark" ? "#444444" : formState.userConfig?.activeRowBg ? `rgb(${formState.userConfig.activeRowBg})` : "#e3f2fd"
                    : index % 2 === 0 ? appState.mode === "dark" ? "#333333" : "#fff" : appState.mode === "dark" ? "#444444" : "#f9f9f9",
                }}
              >
                {columns.map((column, colIndex) => {
                  const fieldKey = column.dataField as keyof TransactionDetail;
                  const idField = column.idField as keyof TransactionDetail;
                  const productId = item.productID;
                  const cellValue = item[fieldKey];
                  const idValue = item[idField];
                  const isFirstColumn = colIndex === 0;
                  const isLastColumn = colIndex === columns.length - 1;
                  const isFixed = isFirstColumn || isLastColumn;
                  const showBorder = formState.userConfig?.showColumnBorder ?? true;
                  let options: any[] = [];
                  if (fieldKey === "unit") {
                    options =
                      formState.batchesUnits?.filter(
                        (x) => x.productBatchID === item.productBatchID
                      ) ?? [];
                  }
                  if (fieldKey === "warranty") {
                    options = formState.dataWarranty ?? [];
                  }
                  if (fieldKey === "brandID") {
                    options = formState.dataBrands ?? [];
                  }
                  const cellId = `${gridId}_${column.dataField}_${index}`;
                  const borderColor = `${(column.readOnly || column.allowEditing == false ||
                    formState.formElements.pnlMasters?.disabled !== true) &&
                    currentCell?.column === column.dataField &&
                    currentCell?.rowIndex === index ? appState.mode === "dark" ? "#444444" : formState.userConfig?.inputBoxStyle?.focusBgColor ? `rgb(${formState.userConfig?.inputBoxStyle?.focusBgColor})` : "#e3f2fd" : undefined}`;

                  return (
                    <div
                      key={`${column.dataField}`}
                      style={{
                        width: `${columnWidths[colIndex]}px`,
                        minWidth: `${columnWidths[colIndex]}px`,
                        maxWidth: `${columnWidths[colIndex]}px`,
                        borderRight: isFirstColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}`
                          : isLastColumn ? "none" : showBorder ? `0.2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`}` : "none",
                        borderLeft: isLastColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}` : "none",
                        fontSize: `${gridFontSize}px`,
                        textAlign: column.dataField === "slNo" ? "center" : ["qty"].includes(column.dataField ?? "") ? "right" : "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: 'center',
                        backgroundColor: currentCell?.rowIndex === index ? appState.mode === "dark" ? "#444444" : formState.userConfig?.activeRowBg ? `rgb(${formState.userConfig.activeRowBg})` : "#e3f2fd"
                          : index % 2 === 0 ? appState.mode === "dark" ? "#333333" : "#fff" : appState.mode === "dark" ? "#444444" : "#f9f9f9",
                        position: isFixed ? "sticky" : "relative",
                        left: isFirstColumn ? "0px" : "auto",
                        right: isLastColumn ? "0px" : "auto",
                        zIndex: isFixed ? 50 : 1,
                        gap: isLastColumn ? "8px" : "0",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentCell({
                          column: column.dataField ?? "",
                          data: item,
                          rowIndex: index,
                        });
                      }}
                    >
                      {formState.transactionLoading ? (
                        <div
                          className="parent-selector-loading"
                          style={{
                            width: "100%",
                            margin: "3px 0",
                            height: `${rowHeight}px`,
                          }}
                        >
                          <div
                            className="card_description loading"
                            style={{
                              width: `${Math.floor(Math.random() * 50) + 40}%`,
                              height: `${Math.min(rowHeight - 6, 16)}px`,
                            }}
                          />
                        </div>
                      ) : column.dataField === "slNo" ? (
                        <div style={getCellContentStyle(column)} id={cellId}>
                          {index + 1}
                        </div>
                      ) : column.dataType === "chk" ? (
                        <input
                          disabled={formState.formElements.pnlMasters?.disabled}
                          type="checkbox"
                          checked={
                            cellValue == true ? true : false
                          }
                          onChange={(e) => {
                            onChange(
                              e.target.checked,
                              column.dataField as keyof TransactionDetail,
                              index
                            );
                          }}
                        />
                      ) : column.dataType === "btn" ? (
                        <button
                          disabled={formState.formElements.pnlMasters?.disabled}
                          onClick={() =>
                            handleKeyDown(
                              cellValue,
                              { key: "Enter" } as any,
                              column as any,
                              index
                            )
                          }
                          className={`px-2 py-1 border rounded shadow-sm hover:shadow text-xs transition-all ${appState.mode === "dark" ? "bg-[#444444] text-[#e0e0e0] border-[#555555] hover:bg-[#555555]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                          aria-label="Action button"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 12 12"
                          >
                            <rect
                              x="1"
                              y="3"
                              width="10"
                              height="6"
                              rx="1"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </button>
                      ) : column.dataField === "removeCol" ? (
                        <div className="flex items-center justify-center gap-1"
                          style={{
                            border: `solid 1px ${borderColor}`
                          }}
                        >
                          <button
                            onClick={() => handleInfoClick(index)}
                            className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${appState.mode === "dark" ? "hover:bg-blue-900 hover:border-blue-700" : "hover:bg-blue-50 hover:border-blue-200"}`}>
                            <Info className={`w-4 h-4 transition-all duration-300 ${appState.mode === "dark" ? "text-blue-400 group-hover:text-blue-300" : "text-blue-600 group-hover:text-blue-700"}`} />
                          </button>
                          <button
                            disabled={formState.formElements.pnlMasters?.disabled}
                            onClick={() => onKeyDown(item.slNo, { key: "Enter" } as any, "removeCol", index)}
                            className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${appState.mode === "dark" ? "hover:bg-red-900 hover:border-red-700" : "hover:bg-red-50 hover:border-red-200"}`}>
                            <Trash2 className={`w-4 h-4 transition-all duration-300 ${appState.mode === "dark" ? "text-red-400 group-hover:text-red-300" : "text-red-600 group-hover:text-red-700"}`} />
                          </button>
                        </div>
                      ) : (column.dataField === "product" ||
                        column.dataField === "pCode" ||
                        column.dataField === "barCode") &&
                        !column.readOnly &&
                        formState.formElements.pnlMasters?.disabled !== true &&
                        currentCell?.column === column.dataField &&
                        currentCell?.rowIndex === index ? (
                        <ERPProductSearch
                          customStyle={customStyle}
                          appState={appState}
                          textAlign={column.alignment === "right" ? "right" : "left"}
                          rowIndex={index}
                          id={cellId}
                          inputId={`${gridId}_${column.dataField}_${index}`}
                          searchType={applicationSettings?.productsSettings?.usePopupWindowForItemSearch ? "modal" : "grid"}
                          noLabel={true}
                          showCheckBox={false}
                          contextClassNametwo={`!text-sm !px-1 !py-0 !border-none !bg-transparent`}
                          value={(cellValue as string) || ""}
                          productDataUrl={`${Urls.inv_transaction_base}${transactionType}/products`}
                          batchDataUrl={`${Urls.inv_transaction_base}${transactionType}/batches/`}
                          className="h-[22px] text-sm"
                          onFocus={() => handleFocus(column.dataField!)}
                          onBlur={handleBlur}
                          onKeyDown={(value, e) => { handleKeyDown(value, e, column, index) }}
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
                            dispatch(formStateHandleFieldChange({ fields: { batchSelectionData: JSON.stringify(res) }, }));
                          }}
                        />
                      ) : column.dataField === "product" && !column.readOnly ? (
                        <div
                          style={{ ...getCellContentStyle(column), border: `solid 1px ${borderColor}` }}
                          id={cellId}
                          tabIndex={0}
                          onFocus={() => handleFocus(column.dataField!)}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(cellValue, e, column, index)}>
                          {productId > 0 ? cellValue ?? "" : ""}
                        </div>
                      ) : column.dataField === "status" ? (
                        <div
                          style={{
                            ...getCellContentStyle(column),
                            justifyContent: "center",
                            border: `solid 1px ${borderColor}`
                          }}
                          id={cellId}
                          tabIndex={0}
                          className={`inline-flex px-2 py-1 font-medium rounded-full cursor-default ${cellValue === "Active" ? appState.mode === "dark" ? "bg-[#2d6a4f] text-[#b7e1cd]" : "bg-[#dcfce7] text-[#166534]" : ""}
                    ${cellValue === "Inactive" ? appState.mode === "dark" ? "bg-[#7b2e2e] text-[#f4a8a8]" : "bg-[#fee2e2] text-[#991b1b]" : ""}
                    ${cellValue === "Pending" ? appState.mode === "dark" ? "bg-[#6b4e31] text-[#fce5a8]" : "bg-[#fef9c3] text-[#854d0e]" : ""}`}
                          onFocus={() => handleFocus(column.dataField!)}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(cellValue, e, column, index)}>
                          {productId > 0 ? cellValue ?? "" : ""}
                        </div>
                      ) : column.allowEditing == true &&
                        !column.readOnly &&
                        formState.formElements.pnlMasters?.disabled !== true &&
                        txtData.visible === true &&
                        currentCell?.column === column.dataField &&
                        currentCell?.rowIndex === index ? (
                        <EditableCell
                          appState={appState}
                          type={column.dataType === "cb" ? "cb" : "any"}
                          productId={productId}
                          onChange={onChange}
                          blockUnitOnDecimalPoint={blockUnitOnDecimalPoint}
                          decimalLimit={2}
                          rowIndex={index}
                          column={column}
                          value={column.dataType === "cb" ? (idValue as string | number) : (cellValue as string | number)}
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
                          style={currentCell?.column === column.dataField &&
                            currentCell?.rowIndex === index ? { ...getCellContentStyle(column), border: `solid 3px rgb(${formState.userConfig?.inputBoxStyle?.focusBgColor})`, background: '#fff' } : { ...getCellContentStyle(column) }}
                          id={cellId}
                          tabIndex={0}
                          className="px-1 cursor-default"
                          onFocus={() => handleFocus(column.dataField!)}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(cellValue ?? "", e, column, index)}>
                          {productId > 0 ? cellValue ?? "" : ""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
        }
      </>

    );
  }
);

const UltraFastReorderableVirtualTableGrid = forwardRef(
  function ErpPurchaseGrid<T extends DataItem>(
    {
      _columns = [],
      isMobile = false,
      keyField,
      transactionType,
      onKeyDown,
      onChange,
      gridId,
      rowHeight = 33,
      className = "",
      height = 800,
      allowColumnReordering = true,
      summaryConfig = [],
      gridFontSize = 14,
      gridIsBold = false,
      gridBorderColor,
      gridHeaderBg,
      gridHeaderFontColor,
      headerRowHeight = 40,
      gridFooterBg,
      gridFooterFontColor,
    }: DataGridProps<T>,
    ref: Ref<any>
  ) {
    const dispatch = useAppDispatch();
    const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
    const onApplyPreferences = useCallback(
      (pref: GridPreference) => {
        const updated = applyGridColumnPreferences(
          (formState.gridColumns || _columns) as DevGridColumn[],
          pref
        );
        setColumns(updated as any);
        dispatch(
          formStateHandleFieldChange({
            fields: { gridColumns: updated as ColumnModel[] },
          })
        );
      },
      [_columns, dispatch, formState.gridColumns]
    );
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
      dragOverIndex,
    } = useTableResizeAndReorder(gridId, onApplyPreferences);
    const [__columns, setColumns] = useState(_columns);
    const appState = useAppSelector((state: RootState) => state.AppState?.appState);
    const applicationState = useAppSelector((state: RootState) => state.ApplicationSettings);
    const preferenceChooserRef = useRef<{
      handleDragStart: (e: React.DragEvent<HTMLElement>) => void;
      handleDragEnd: (e: React.DragEvent<HTMLElement>) => void;
      handleDropping: (eFromDataGrid?: boolean) => void;
    }>(null);
    const { t } = useTranslation("transaction");
    const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
    const [isExcelMenuOpen, setIsExcelMenuOpen] = useState(false);
    const [exportVisibleColumns, setExportVisibleColumns] = useState(true);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const virtualContainerRef = useRef<HTMLDivElement>(null);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

    const totalGridWidth = useMemo(() => {
      return columnWidths.reduce((sum, width) => sum + width, 0);
    }, [columnWidths]);

    const handleShowGridTheme = () => {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            showGridTheme: true
          }
        })
      )
    }

    useEffect(() => {
      const fetchPreferences = async () => {
        // onApplyPreferences(await getInitialPreference(gridId, _columns, new APIClient()));
      };

      if (gridId && _columns) {
        fetchPreferences();
      }
    }, [gridId, _columns]);

    const columns = useMemo(() => {
      const visibleColumns =
        formState.gridColumns?.filter((x) => x.visible !== false) ?? [];

      if (columnOrder.length > 0 && visibleColumns?.length > 0) {
        return columnOrder
          .map((index) => visibleColumns[index])
          .filter((col) => col !== undefined);
      }
      return visibleColumns;
    }, [columnOrder, formState.gridColumns]);

    const ITEM_HEIGHT = formState.userConfig?.gridRowHeight ?? 32;

    const { scrollTop, updateScroll, visibleItems, totalHeight } =
      useUltraFastVirtualScrolling(
        formState.transaction.details.length,
        ITEM_HEIGHT,
        height
      );

    useEffect(() => {
      const visibleColumns =
        formState.gridColumns?.filter((col) => col.visible !== false) ?? [];

      if (columnOrder.length === 0) {
        setColumnOrder(visibleColumns.map((_, index) => index));
      }

      if (columnWidths.length === 0) {
        setColumnWidths(visibleColumns.map((col) => col.width ?? 0));
      }
    }, [
      formState.gridColumns,
      columnOrder.length,
      columnWidths.length,
      setColumnOrder,
      setColumnWidths,
    ]);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const verticalScrollTop = target.scrollTop;
        updateScroll(verticalScrollTop);
      },
      [updateScroll]
    );

    useEffect(() => {
      if (!containerRef.current || columnWidths.length === 0) return;
      const handles = containerRef.current.querySelectorAll(
        "[data-resize-handle]"
      );
      const cleanupFunctions: (() => void)[] = [];
      const isRTL = appState.direction === "rtl";
      handles.forEach((handle, index) => {
        const handleMouseDown = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          if (containerRef.current) {
            startResize(
              mouseEvent,
              isRTL ? index - 1 : index,
              containerRef.current,
              columnWidths
            );
          }
        };

        handle.addEventListener("mousedown", handleMouseDown);
        cleanupFunctions.push(() => {
          handle.removeEventListener("mousedown", handleMouseDown);
        });
      });

      return () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
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
      try {
        const workbook = new ExcelJS.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        const worksheet = workbook.addWorksheet("Grid Data", {
          pageSetup: {
            paperSize: 9,
            orientation: 'landscape',
            fitToPage: true,
            fitToHeight: 1,
            fitToWidth: 1,
            margins: {
              left: 0.7,
              right: 0.7,
              top: 0.75,
              bottom: 0.75,
              header: 0.3,
              footer: 0.3
            }
          }
        });

        const excelColumns = exportVisibleColumns
          ? formState.gridColumns?.filter(
            (col) => col.visible !== false && col.dataField != null
          )
          : formState.gridColumns;

        const colors = {
          headerBg: 'FFF8F9FA',
          headerText: 'FF495057',
          background: 'FFFFFFFF',
          alternateRow: 'FFF8F9FA',
          border: 'FFDEE2E6',
          text: 'FF212529',
          summaryBg: 'FFF1F3F4',
          summaryBorder: 'FFADB5BD'
        };

        worksheet.columns = (excelColumns ?? []).map((col) => ({
          header: col.caption || col.dataField,
          key: col.dataField,
          width: Math.max(col.width ? col.width / 7 : 15, 12),
        }));

        const titleRow = worksheet.insertRow(1, [`${gridId} Export Report`]);
        worksheet.mergeCells(1, 1, 1, excelColumns?.length || 1);

        titleRow.getCell(1).font = {
          name: 'Segoe UI',
          size: 16,
          bold: true,
          color: { argb: colors.text }
        };
        titleRow.getCell(1).alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
        titleRow.height = 35;

        const dateRow = worksheet.insertRow(2, [`Generated on: ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`]);
        worksheet.mergeCells(2, 1, 2, excelColumns?.length || 1);

        dateRow.getCell(1).font = {
          name: 'Segoe UI',
          size: 10,
          color: { argb: colors.headerText }
        };
        dateRow.getCell(1).alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
        dateRow.height = 25;

        const headerRow = worksheet.getRow(3);
        headerRow.height = 30;
        headerRow.font = {
          name: 'Segoe UI',
          size: 11,
          bold: true,
          color: { argb: colors.headerText }
        };
        headerRow.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true
        };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colors.headerBg }
        };

        formState.transaction?.details.forEach((item, index) => {
          const row: { [key: string]: any } = {};
          excelColumns?.forEach((col) => {
            const fieldKey = col.dataField as keyof TransactionDetail;
            if (fieldKey === "slNo") {
              row[fieldKey] = index + 1;
            } else {
              row[fieldKey] = item[fieldKey] ?? "";
            }
          });

          const addedRow = worksheet.addRow(row);
          addedRow.height = 25;

          if (index % 2 === 1) {
            addedRow.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: colors.alternateRow }
            };
          }

          addedRow.font = {
            name: 'Segoe UI',
            size: 10,
            color: { argb: colors.text }
          };
          addedRow.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          };
        });

        if (summaryConfig.length > 0) {
          const summaryRow: { [key: string]: any } = {};
          excelColumns?.forEach((col) => {
            const summary = summaryConfig.find(
              (s) =>
                s.showInColumn === col.dataField || s.column === col.dataField
            );
            if (summary && col.dataField !== undefined) {
              const value =
                formState.summary[
                summary.column as keyof typeof formState.summary
                ];
              summaryRow[col.dataField] = summary.customizeText
                ? summary.customizeText({ value })
                : value ?? "";
            } else {
              if (col.dataField !== undefined) {
                summaryRow[col.dataField] = "";
              }
            }
          });

          const addedSummaryRow = worksheet.addRow(summaryRow);
          addedSummaryRow.height = 25;
          addedSummaryRow.font = {
            name: 'Segoe UI',
            size: 10,
            bold: true,
            color: { argb: colors.text }
          };
          addedSummaryRow.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          };
          addedSummaryRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.summaryBg }
          };
        }

        const dataStartRow = 3;
        const dataEndRow = worksheet.rowCount;
        const dataEndCol = excelColumns?.length || 1;

        for (let row = dataStartRow; row <= dataEndRow; row++) {
          for (let col = 1; col <= dataEndCol; col++) {
            const cell = worksheet.getCell(row, col);
            cell.border = {
              top: { style: 'thin', color: { argb: colors.border } },
              left: { style: 'thin', color: { argb: colors.border } },
              bottom: { style: 'thin', color: { argb: colors.border } },
              right: { style: 'thin', color: { argb: colors.border } }
            };
          }
        }

        worksheet.columns.forEach((column, index) => {
          let maxLength = 0;
          const columnLetter = String.fromCharCode(65 + index);

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber >= dataStartRow) {
              const cell = row.getCell(index + 1);
              const cellValue = cell.value ? cell.value.toString() : '';
              maxLength = Math.max(maxLength, cellValue.length);
            }
          });

          const calculatedWidth = Math.min(Math.max(maxLength + 2, 12), 50);
          if (column.width) {
            column.width = Math.max(column.width as number, calculatedWidth);
          }
        });

        worksheet.views = [{
          state: 'frozen',
          xSplit: 0,
          ySplit: 3,
          topLeftCell: 'A4',
          activeCell: 'A4'
        }];

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `${gridId}_export_${timestamp}.xlsx`;

        saveAs(blob, filename);

        console.log('Excel export completed successfully!');

      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
    };
    const focusCell = useCallback(
      (targetRow: number, targetColumnIndex: number) => {
        const visibleColumns =
          formState.gridColumns?.filter(
            (col) => col.visible !== false && col.dataField != null
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
        return { column: targetColumn.dataField ?? "", rowIndex: targetRow };
      },
      [formState.gridColumns, formState.transaction?.details.length, gridId]
    );

    const focusCurrentColumn = useCallback(
      (rowIndex: number, column: string) => {
        const visibleColumns = formState.gridColumns?.filter(
          (col) => col.visible !== false && col.dataField != null
        );

        const editableColumns = visibleColumns?.filter(
          (col) => col.allowEditing == true && col.readOnly !== true
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
        return null;
      },
      [formState.gridColumns, focusCell]
    );
    const findCurrentEditableIndex = useCallback(
      (rowIndex: number, column: string) => {
        const visibleColumns = formState.gridColumns?.filter(
          (col) => col.visible !== false && col.dataField != null
        );

        const editableColumns = visibleColumns?.filter(
          (col) => col.allowEditing == true && col.readOnly !== true
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
          (col) => col.visible !== false && col.dataField != null
        );

        const editableColumns = visibleColumns?.filter(
          (col) => col.allowEditing == true && col.readOnly !== true
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

        if (targetColumnIndex ?? -1 >= 0) {
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
          (col) => col.visible !== false && col.dataField != null
        );

        const editableColumns = visibleColumns?.filter(
          (col) => col.allowEditing == true && col.readOnly !== true
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
                for (
                  let i = currentEditableIndex + 1;
                  i < editableColumns.length;
                  i++
                ) {
                  const column = editableColumns[i];
                  if (
                    column.dataField &&
                    !excludedColumns.includes(
                      column.dataField as keyof TransactionDetail
                    )
                  ) {
                    return column;
                  }
                }
                for (let i = 0; i <= currentEditableIndex; i++) {
                  const column = editableColumns[i];
                  if (
                    column.dataField &&
                    !excludedColumns.includes(
                      column.dataField as keyof TransactionDetail
                    )
                  ) {
                    return column;
                  }
                }
                return null;
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

    const [currentCell, setCurrentCell] = useState<CurrentCell | undefined>(
      formState.currentCell
    );
    const [prevCell, setPrevCell] = useState<number>(
      formState.currentCell?.rowIndex ?? -1
    );
    useEffect(() => {
      setCurrentCell(formState.currentCell);
    }, [formState.currentCell]);
    useEffect(() => {
      if (
        currentCell &&
        currentCell.column !== "" &&
        currentCell.rowIndex > -1
      ) {
        const targetCellId = `${gridId}_${currentCell.column}_${currentCell.rowIndex}`;
        const targetCell = document.getElementById(
          targetCellId
        ) as HTMLElement | null;
        if (targetCell) {
          if (
            currentCell.column === "product" ||
            currentCell.column === "pCode"
          ) {
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
        }
      }
      setPrevCell(currentCell?.rowIndex ?? -1);
      if (prevCell !== currentCell?.rowIndex) {
        localStorage.setItem(
          `${formState.transaction.master.voucherType}${formState.transaction.master.voucherForm}`,
          JSON.stringify(
            formState.transaction.details.filter((x) => x.productID > 0)
          )
        );
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
      right: isRtl ? headerLeft : "0",
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

    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [rate, setRate] = useState('');
    const [unit, setUnit] = useState('Bag');
    const [taxType, setTaxType] = useState('With Tax');
    const [discount, setDiscount] = useState('0');
    const [discountType, setDiscountType] = useState('₹');
    const [taxPercentage, setTaxPercentage] = useState('None');

    const calculateSubtotal = () => {
      const qty = parseFloat(quantity) || 0;
      const rateValue = parseFloat(rate) || 0;
      return qty * rateValue;
    };

    const calculateDiscount = () => {
      const discountValue = parseFloat(discount) || 0;
      if (discountType === '%') {
        return (calculateSubtotal() * discountValue) / 100;
      }
      return discountValue;
    };

    const calculateTotal = () => {
      return calculateSubtotal() - calculateDiscount();
    };

    return (
      <div
        style={{
          position: isMobile ? 'relative' : 'static',
          maxWidth: "100%",
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          boxSizing: "border-box",
          border: `0.5px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "203,213,225"}, 0.4)`}`,
          borderRadius: formState.userConfig?.gridBorderRadius ? `${formState.userConfig.gridBorderRadius}px` : "0px",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          background: appState.mode === "dark" ? "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)" : "linear-gradient(to bottom right, rgba(248,250,252,0.8), white, rgba(239,246,255,0.3))",
        }}
        className="rounded-2xl shadow-xl backdrop-blur-sm">
        <div className={`relative ${className} w-full`}>
          {isGridMenuOpen && (
            <div
              ref={popupRef}
              className={`fixed top-[33px] w-[251px] rounded-lg shadow-xl border p-2 z-[51] backdrop-blur-sm ${appState.mode === "dark" ? "bg-[#1f2937] text-[#f3f4f6] border-[#374151]" : "bg-white text-black border-[#e5e7eb]"}`}
              style={headerStyle}>
              <nav className="w-full">
                <ul className="space-y-1">
                  {/* Grid Preferences */}
                  <li>
                    <button className={`w-full flex items-center gap-3 px-3 py-[5px] rounded-md group text-left cursor-pointer transition-all duration-200 ${appState.mode === "dark" ? "hover:bg-[#4c1d954d] hover:text-[#d8b4fe]" : "hover:bg-[#f3e8ff] hover:text-[#7c3aed]"}`}>
                      <div className={`p-[9px] rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${appState.mode === "dark" ? "bg-[#4c1d954d] group-hover:bg-[#6b21a899]" : "bg-[#ede9fe] group-hover:bg-[#e9d5ff]"}`}>
                        <Settings className={`h-4 w-4 ${appState.mode === "dark" ? "text-[#d8b4fe]" : "text-[#7c3aed]"}`} />
                      </div>
                      <GridPreferenceChooser
                        ref={preferenceChooserRef}
                        gridId={gridId}
                        columns={(formState.gridColumns ?? []) as DevGridColumn[]}
                        onApplyPreferences={onApplyPreferences}
                        showChooserName={true}
                      // buttonClassName="font-medium flex-1 text-left"
                      />
                    </button>
                  </li>

                  {/* Export to Excel */}
                  <li>
                    <button
                      onClick={openExcelMenu}
                      className={`w-full flex items-center gap-3 px-3 py-[5px] rounded-md group text-left transition-all duration-200 ${appState.mode === "dark" ? "hover:bg-[#14532d4d] hover:text-[#86efac]" : "hover:bg-[#f0fdf4] hover:text-[#15803d]"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${appState.mode === "dark" ? "bg-[#14532d4d] group-hover:bg-[#16653499]" : "bg-[#bbf7d0] group-hover:bg-[#86efac]"}`}>
                        <FileUp className={`h-4 w-4 ${appState.mode === "dark" ? "text-[#86efac]" : "text-[#166534]"}`} />
                      </div>
                      <span className="font-medium">
                        {t("export_to_excel")}
                      </span>
                    </button>
                  </li>

                  {/* Change Grid Theme */}
                  <li>
                    <button
                      onClick={handleShowGridTheme}
                      className={`w-full flex items-center gap-3 px-3 py-[5px] rounded-md group text-left transition-all duration-200 ${appState.mode === "dark" ? "hover:bg-[#1e3a8a4d] hover:text-[#93c5fd]" : "hover:bg-[#eff6ff] hover:text-[#1d4ed8]"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${appState.mode === "dark" ? "bg-[#1e3a8a4d] group-hover:bg-[#1e3a8a99]" : "bg-[#dbeafe] group-hover:bg-[#bfdbfe]"}`} >
                        <Paintbrush className={`h-4 w-4 ${appState.mode === "dark" ? "text-[#93c5fd]" : "text-[#1e40af]"}`} />
                      </div>
                      <span className="font-medium">{t("change_grid_theme")}</span>
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
              height={100}
              closeModal={closeExcelMenu}
              content={
                <ERPCheckbox
                  id="exportVisibleColumns"
                  label={t("export_only_visible_column")}
                  checked={exportVisibleColumns}
                  onChange={() =>
                    setExportVisibleColumns(!exportVisibleColumns)
                  }
                />
              }
              footer={
                <div className="flex items-center justify-end p-1">
                  <ERPButton
                    variant="primary"
                    title={t("export")}
                    onClick={exportToExcel}
                  />
                </div>
              }
            />
          )}
          <div
            ref={containerRef}
            className="border border-gray-300 rounded"
            style={{
              height: `${height + 80}px`,
              overflowY: "scroll",
              overflowX: "auto",
              position: "relative",
              scrollbarWidth: "auto",
              scrollbarColor: appState.mode === "dark" ? "#555 #333" : "#ddd #f1f1f1",
            }}
            onScroll={handleScroll}
          >
            <div
              style={{
                width: `${!isMobile ? totalGridWidth : ''}px`,
                minWidth: `${!isMobile ? totalGridWidth : 50}px`,
                height: `${!isMobile ? totalHeight + 80 : totalHeight + 20}px`,
                borderRadius: formState.userConfig?.gridBorderRadius ? `${formState.userConfig.gridBorderRadius}px` : "0px",
              }}
            >
              <div
                className="table-header"
                style={{
                  display: 'flex',
                  background: appState.mode === "dark" ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)" : gridHeaderBg ? `rgb(${gridHeaderBg})` : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                  borderBottom: `0.5px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "203,213,225"}, 0.4)`}`,
                  position: "sticky",
                  top: 0,
                  zIndex: 100,
                  height: `${headerRowHeight}px`,
                }}
              >
                {!isMobile && columns?.map((column, index) => {
                  const isFirstColumn = index === 0;
                  const isLastColumn = index === columns.length - 1;
                  const isFixed = isFirstColumn || isLastColumn;
                  const showBorder = formState.userConfig?.showColumnBorder ?? true;
                  return (
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
                        padding: "8px 12px",
                        borderRight: isFirstColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}`
                          : isLastColumn ? "none" : showBorder ? `0.2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`}` : "none",
                        borderLeft: isLastColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}` : "none",
                        fontWeight: gridIsBold ? 700 : 500,
                        fontSize: gridFontSize ?? 14,
                        background: dragOverIndex === index ? appState.mode === "dark" ? "#444444" : "#e3f2fd" : appState.mode === "dark" ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)" : gridHeaderBg ? `rgb(${gridHeaderBg})` : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        cursor: "move",
                        transition: "background-color 0.1s ease",
                        color: appState.mode === "dark" ? "#e0e0e0" : gridHeaderFontColor ? `rgb(${gridHeaderFontColor})` : "#1f2937",
                        position: isFixed ? "sticky" : "relative",
                        left: isFirstColumn ? "0px" : "auto",
                        right: isLastColumn ? "0px" : "auto",
                        zIndex: isFixed ? 110 : 100,
                      }}
                    >
                      {index === 0 ? (
                        <>
                          <div className="absolute top-[3px] left-[3px]">
                            <button
                              ref={buttonRef}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsGridMenuOpen((prev) => !prev);
                              }}
                              className={`flex items-center rounded-full p-2 mr-2 transition-colors ${appState.mode === "dark" ? "bg-[#333333] hover:bg-[#444444] text-[#e0e0e0]" : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"}`}
                            >
                              <EllipsisVertical className="w-4 h-4" />
                            </button>
                          </div>
                          {column.caption}
                        </>
                      ) : (
                        <>
                          <span style={{ marginRight: "8px", opacity: 0.6 }}>⋮⋮</span>
                          {column.caption}
                        </>
                      )}
                      {index < columns.length - 1 && (
                        <div
                          data-resize-handle
                          style={{
                            position: "absolute",
                            right: "-2px",
                            top: 0,
                            bottom: 0,
                            width: "4px",
                            cursor: "col-resize",
                            backgroundColor: "transparent",
                            zIndex: 10,
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor =
                              appState.mode === "dark" ? "#e0e0e0" : "#007bff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor =
                              "transparent";
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  position: "relative",
                  height: `${totalHeight}px`,
                }}
              >
                {formState.transactionLoading ||
                  !columns ||
                  columns.length === 0 ||
                  !formState.transaction.details ||
                  formState.transaction.details.length === 0 ? (
                  <></>
                ) : (
                  visibleItems.map(({ index, top }) => (
                    <VirtualRow
                      isMobileGridRow={isMobile}
                      appState={appState}
                      applicationSettings={applicationState}
                      formState={formState}
                      key={index}
                      index={index}
                      top={top}
                      columns={columns}
                      columnWidths={columnWidths}
                      details={formState.transaction.details}
                      rowHeight={ITEM_HEIGHT}
                      tableWidth={totalGridWidth}
                      txtData={formState.formElements.txtData}
                      gridId={gridId}
                      listRef={containerRef as any}
                      itemCount={formState.transaction.details.length}
                      gridRef={containerRef as any}
                      onKeyDown={(value, e, column, rowIndex) => { onKeyDown(value, e, column, rowIndex); }}
                      onChange={(value, column, rowIndex) => { onChange(value, column, rowIndex); }}
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
                  ))
                )}
              </div>
              <div
                className="table-footer"
                style={{
                  display: isMobile ? 'none' : 'flex',
                  width: `${totalGridWidth}px`,
                  minWidth: `${totalGridWidth}px`,
                  backgroundColor: appState.mode === "dark" ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)" : gridFooterBg ? `rgb(${gridFooterBg})` : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                  borderTop: `0.1px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "226,232,240"}, 0.3)`}`,
                  position: "sticky",
                  bottom: 0,
                  zIndex: 100,
                  height: "40px",
                }}
              >
                {columns?.map((column, colIndex) => {
                  const isFirstColumn = colIndex === 0;
                  const isLastColumn = colIndex === columns.length - 1;
                  const isFixed = isFirstColumn || isLastColumn;
                  const showBorder = formState.userConfig?.showColumnBorder ?? true;
                  return (
                    <div
                      key={`footer-${column.dataField}`}
                      style={{
                        width: `${columnWidths[colIndex]}px`,
                        minWidth: `${columnWidths[colIndex]}px`,
                        maxWidth: `${columnWidths[colIndex]}px`,
                        padding: "8px 12px",
                        borderRight: isFirstColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}`
                          : isLastColumn ? "none" : showBorder ? `0.2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`}` : "none",
                        borderLeft: isLastColumn ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}` : "none",
                        fontSize: `${gridFontSize}px`,
                        fontWeight: gridIsBold ? "bold" : "600",
                        textAlign: column.alignment,
                        background: appState.mode === "dark" ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)" : gridFooterBg ? `rgb(${gridFooterBg})` : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                        color: appState.mode === "dark" ? "#e0e0e0" : gridFooterFontColor ? `rgb(${gridFooterFontColor})` : "#1f2937",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        alignItems: "center",
                        position: isFixed ? "sticky" : "relative",
                        left: isFirstColumn ? "0px" : "auto",
                        right: isLastColumn ? "0px" : "auto",
                        display: "flex",
                        justifyContent: isFirstColumn || isLastColumn ? "center" : column.alignment === "center" ? "center" : column.alignment === "right" ? "flex-end" : "flex-start",
                        zIndex: isFixed ? 110 : 100,
                      }}
                    >
                      {formState.summary?.[
                        column.dataField as keyof SummaryItems
                      ] ?? ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setIsMobileModalOpen(true)} className={`${isMobile ? 'absolute top-0 left-0 z-[9999]' : 'hidden'}`}>
          <Menu />
        </button>
        {isMobileModalOpen && (
          <ERPModal
            isOpen={isMobileModalOpen}
            title=""
            width={500}
            height={575}
            closeModal={() => setIsMobileModalOpen(false)}
            content={
              <>
                <div className="bg-white p-3">
                  {/* Item Name */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Item Name</label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter item name"
                    />
                  </div>

                  {/* Quantity and Unit */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Unit</label>
                      <div className="relative">
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Bag</option>
                          <option>Piece</option>
                          <option>Kg</option>
                          <option>Liter</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Rate and Tax Type */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Rate (Price/Unit)</label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tax</label>
                      <div className="relative">
                        <select
                          value={taxType}
                          onChange={(e) => setTaxType(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>With Tax</option>
                          <option>Without Tax</option>
                          <option>Tax Exempt</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Totals & Taxes Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Totals & Taxes</h3>

                    {/* Subtotal */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Subtotal (Rate x Qty)</span>
                      <span className="font-medium">₹ {calculateSubtotal().toFixed(2)}</span>
                    </div>

                    {/* Discount */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Discount</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex bg-gray-100 rounded">
                          <button
                            onClick={() => setDiscountType('₹')}
                            className={`px-2 py-1 text-xs rounded-l ${discountType === '₹' ? 'bg-orange-200 text-orange-800' : 'text-gray-600'}`}
                          >
                            ₹
                          </button>
                          <button
                            onClick={() => setDiscountType('%')}
                            className={`px-2 py-1 text-xs rounded-r ${discountType === '%' ? 'bg-orange-200 text-orange-800' : 'text-gray-600'}`}
                          >
                            %
                          </button>
                        </div>
                        <span className="font-medium w-12 text-right">₹ {calculateDiscount().toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Tax */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Tax %</span>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <select
                            value={taxPercentage}
                            onChange={(e) => setTaxPercentage(e.target.value)}
                            className="p-1 border border-gray-300 rounded text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 pr-6"
                          >
                            <option>None</option>
                            <option>5%</option>
                            <option>12%</option>
                            <option>18%</option>
                            <option>28%</option>
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        </div>
                        <span className="font-medium w-12 text-right">₹ 0.00</span>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">Total Amount:</span>
                        <span className="font-bold text-lg">₹ {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          />
        )}

      </div>
    );
  }
);
export default UltraFastReorderableVirtualTableGrid;