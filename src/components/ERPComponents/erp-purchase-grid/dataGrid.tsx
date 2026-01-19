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
import { FixedSizeList as List } from "react-window";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import {
  ArchiveX,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  EllipsisVertical,
  FileUp,
  Info,
  Paintbrush,
  ScanBarcode,
  Settings,
  StepBack,
  Trash2,
  X,
} from "lucide-react";
import GridPreferenceChooser from "../erp-gridpreference";
import ERPDataCombobox from "../erp-data-combobox";
import type {
  DevGridColumn,
  GridPreference,
} from "../../types/dev-grid-column";
import ERPProductSearch from "../erp-searchbox";
import Urls from "../../../redux/urls";
import { applyGridColumnPreferences } from "../../../utilities/dx-grid-preference-updater";
import useDebounce from "../../../pages/inventory/transactions/purchase/use-debounce";
import {
  generateUniqueKey,
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../utilities/Utils";
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
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import moment from "moment";
import { setStorageString } from "../../../utilities/storage-utils";
import { formStateDeleteDetails, formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly, formStateTransactionDetailsRowsAdd } from "../../../pages/inventory/transactions/reducer";
import { initialTransactionDetails2, transactionInitialMoreDetails, initialTransactionDetailData, initialColumnModel } from "../../../pages/inventory/transactions/transaction-type-data";
import { TransactionDetailKeys, ColumnModel, TransactionDetail, FormElementState, CurrentCell, TransactionFormState, TransactionDetails2, TransactionDetailsMore, SummaryItems } from "../../../pages/inventory/transactions/transaction-types";
import { ERPScrollArea } from "../erp-scrollbar";
import usePreferenceData from "../../../utilities/hooks/usePreference";
import DraggablePlusButton from "../../ERPComponents/erp-purchase-grid/draggable-button"
import GridCell from "./GridCell";
import ReactDOM from "react-dom";
import BarcodeModalScanner from "../../barcode-scanner-modal";
import { BarcodeScanResult } from "../../../utilities/barcode-scanner-service";
import { Capacitor } from "@capacitor/core";

type DataItem = Record<string, any>;
export interface SummaryConfig<T = any> {
  column: TransactionDetailKeys;
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
    rowIndex: number,
    isMobRow?: boolean
  ) => void;
  onKeyDown: (
    value: any,
    e: React.KeyboardEvent<HTMLElement>,
    column: keyof TransactionDetail,
    rowIndex: number,
    validateBarcode?: boolean
  ) => any;
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
  zIndexController?: number;
  onSaveItem?: (item: TransactionDetail, mode: "Save"|"SaveAndNew") => void;
  ignoreKeyMovesInCell?: boolean;  // In sales some columns have key working
  
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
  t: any;
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
  columnWidths: {
    width: number;
    field: string;
  }[];
  gridBorderColor?: string;
  formState: TransactionFormState;
  appState: AppState;
  applicationSettings: ApplicationSettingsType;
  isMobileGridRow?: boolean;
  isMobileEditRow?: boolean;
  zIndexController?:number;
  // handleFocus?:boolean;
  // handleBlur?:boolean;
  handleFocus?: (field: string) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

   handlRowKeyDown: 
      (
        value: any,
        e: React.KeyboardEvent<HTMLElement>,
        column: ColumnModel,
        rowIndex: number,
        details: TransactionDetail[]
      ) => void
}
let mountCount = 0;

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
console.log(`safvan${column.dataField}`);

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
    const { round } = useNumberFormat();
    const [localValue, setLocalValue] = useState<string>(
      productId > 0 ? value?.toString() : ""
    );
    const [bgColor, setBgColor] = useState<string>(
      appState.mode === "dark"
        ? document.activeElement === inputRef.current
          ? "#444444"
          : "#333333"
        : `rgb(${mergedInputBox?.defaultBgColor || "255,255,255"})`
    );
    const [foreColor, setForeColor] = useState<string>(
      appState.mode === "dark"
        ? "#e0e0e0"
        : `rgb(${mergedInputBox?.fontColor || "0,0,0"})`
    );

    useEffect(() => {
      if (appState.mode === "dark") {
        setBgColor(
          document.activeElement === inputRef.current ? "#444444" : "#333333"
        );
        setForeColor("#e0e0e0");
      } else {
        setBgColor(
          document.activeElement === inputRef.current
            ? `rgb(${mergedInputBox?.focusBgColor || "240,248,255"})`
            : `rgb(${mergedInputBox?.defaultBgColor || "255,255,255"})`
        );
        setForeColor(`rgb(${mergedInputBox?.fontColor || "0,0,0"})`);
      }
    }, [
      appState.mode,
      document.activeElement,
      inputRef.current,
      mergedInputBox?.focusBgColor,
      mergedInputBox?.defaultBgColor,
      mergedInputBox?.fontColor,
    ]);

    useEffect(() => {
      setLocalValue(value?.toString());
    }, [value]);

    const validateNumberInput = (
      value: string,
      _blockUnitOnDecimalPoint: boolean
    ) => {
      if (value === "") return true;
      const parts = value.split(".");
      if (parts.length > 2) return false;
      if (parts.length == 2) {

      }
      if (parts[0] && !/^-?\d*$/.test(parts[0])) return false;
      if (parts.length === 2) {
        if (_blockUnitOnDecimalPoint) {
          return false;
        }
        if (parts[1].length > decimalLimit) return false;
        if (!/^\d*$/.test(parts[1])) return false;
      }
      return true;
    };
    const debounceCellChange = useDebounce(
      (
        value: any,
        key: keyof TransactionDetail,
        index: number,
        decimalPoint?: number
      ) => {
        let final = value;
        if (decimalPoint) {
          console.log(decimalPoint);

          final =
            column.decimalPoint && value !== ""
              ? (() => {
                const num = parseFloat(value as any);
                if (isNaN(num)) return ""; // return empty if not a valid number
                return round(num, column.decimalPoint);
              })()
              : value;
        }
        onChange && onChange(final, key, rowIndex);
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
      if (
        column.dataType === "number" &&
        !validateNumberInput(
          inputValue,
          column.dataField == "qty" && blockUnitOnDecimalPoint
        )
      ) {
        e.currentTarget.value = localValue;
        return;
      }
      setLocalValue(inputValue);
      console.log("inputValue");

      console.log(inputValue);

      debounceCellChange(
        inputValue as any,
        column.dataField as keyof TransactionDetail,
        rowIndex,
        column.decimalPoint
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
            inputMode={column.dataType === "number" ? "decimal" : "text"}
            enterKeyHint="done"
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
      className={`flex ${
        appState.mode === "dark"
          ? "bg-gradient-to-r from-[#444444] via-[#555555] to-[#444444]"
          : "bg-gradient-to-r from-slate-100/80 via-gray-100/60 to-slate-100/80"
          }`}
        style={{
          width: `${tableWidth}px`,
          height: `${rowHeight}px`,
          minHeight: `${rowHeight}px`,
          maxHeight: `${rowHeight}px`,
          boxSizing: "border-box",
        borderBottom: `0.5px solid ${
          appState.mode === "dark"
            ? "rgba(255,255,255,0.1)"
            : `rgba(${
                formState.userConfig?.gridBorderColor || "203,213,225"
            }, 0.3)`
            }`,
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
              className={`flex items-center justify-end px-1 py-1 font-semibold ${
                appState.mode === "dark"
                  ? "bg-[#555555] text-[#e0e0e0]"
                  : "bg-slate-200 text-gray-700"
                  }`}
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
                  borderRight: isFirstColumn
                  ? `2px solid ${
                      appState.mode === "dark"
                      ? "rgba(255,255,255,0.2)"
                      : `rgba(${gridBorderColor || "226,232,240"})`
                    }`
                    : isLastColumn
                      ? "none"
                      : showBorder
                  ? `0.2px solid ${
                      appState.mode === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`
                        }`
                        : "none",
                  borderLeft: isLastColumn
                  ? `2px solid ${
                      appState.mode === "dark"
                      ? "rgba(255,255,255,0.2)"
                      : `rgba(${gridBorderColor || "226,232,240"})`
                    }`
                    : "none",
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
    t,
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
    zIndexController,
    isMobileGridRow = false,
    isMobileEditRow = false,
    handlRowKeyDown,
    handleFocus,
    handleBlur
  }: RowData) => {
    // const [focusedColumn, setFocusedColumn] = useState<string | null>(null);
    const item = details[index];
    const rowRef = useRef<HTMLTableRowElement>(null);
    const dispatch = useAppDispatch();
    // const handleFocus = useCallback(
    //   (columnKey: string) => {
    //     setFocusedColumn(columnKey);
    //   },
    //   [index]
    // );
    const { round, getFormattedValue } = useNumberFormat();
    // const handleBlur = useCallback(() => {
    //   if (document.activeElement?.closest(".dx-datagrid")) return;
    //   setFocusedColumn(null);
    // }, []);

    const getCellContentStyle = (column: ColumnModel) => ({
      fontSize: `${gridFontSize}px`,
      fontWeight: gridIsBold ? "bold" : "normal",
      height: `${rowHeight}px`,
      minHeight: `${rowHeight}px`,
      maxHeight: `${rowHeight}px`,
      lineHeight: "normal",
      display: "flex",
      alignItems: "center",
      justifyContent:
        column.alignment === "left"
          ? "flex-start"
          : column.alignment === "right"
            ? "flex-end"
            : "center",
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

    const rowBg = `${
      appState.mode === "dark"
      ? index % 2 === 0
        ? "bg-[#333333]"
        : "bg-[#444444]"
      : index % 2 === 0
        ? "bg-white"
        : "bg-[#f9f9f9]"
    } ${
      appState.mode === "dark"
        ? "hover:bg-[#555555]"
        : "hover:bg-gradient-to-r hover:from-[#eff6ff66] hover:to-[#eef2ff4d]"
      }`;

    // const [itemName, setItemName] = useState("");
    // const [quantity, setQuantity] = useState("");
    // const [rate, setRate] = useState("");
    // const [unit, setUnit] = useState("Bag");
    // const [taxType, setTaxType] = useState("With Tax");
    // const [discount, setDiscount] = useState("0");
    // const [discountType, setDiscountType] = useState("₹");
    // const [taxPercentage, setTaxPercentage] = useState("None");

    // const calculateSubtotal = () => {
    //   const qty = parseFloat(quantity) || 0;
    //   const rateValue = parseFloat(rate) || 0;
    //   return qty * rateValue;
    // };

    // const calculateDiscount = () => {
    //   const discountValue = parseFloat(discount) || 0;
    //   if (discountType === "%") {
    //     return (calculateSubtotal() * discountValue) / 100;
    //   }
    //   return discountValue;
    // };

    // const calculatedTotal = () => {
    //   return calculateSubtotal() - calculateDiscount();
    // };

  // This is for handling multiple times showing draggable button in mobile, may need to change the concept CheckIt
  // const [showButton, setShowButton] = useState(false);
  // useEffect(() => {
  //   mountCount++;
  //   // console.log("Mounted count:", mountCount);
  //   if (mountCount === 1) {
  //     setShowButton(true);
  //   } else {
  //     setShowButton(false); 
  //   }
  // }, []);

    return (
      <>
        {isMobileGridRow ? (
          <div
            className="cursor-pointer active:bg-gray-50 transition-colors duration-150"
            style={{
              position: "absolute",
              top: `${top}px`,
              left: 0,
              height: `${rowHeight}px`,
              width: "100%",
              padding: "8px 12px",
            }}
            onClick={() => dispatch(formStateHandleFieldChange({fields:{
               currentCell: {
                                    column: "slNo",
                                    rowIndex: index,
                                    data: item,
                                  },
              row:item, itemPopup: {isOpen: true,index}}}) )}
          >
            <div
              className={`w-full max-w-[730px] mx-auto h-full rounded-lg ${
                appState.mode === "dark"
                  ? "bg-[#1f1f1f] border border-[#333]"
                  : "bg-white border border-gray-200 shadow-sm"
              } ${
                formState.currentCell?.rowIndex === index
                  ? appState.mode === "dark"
                    ? "border-blue-500"
                    : "border-blue-400"
                  : ""
              }`}
            >
              {/* Left accent bar */}
              <div className="flex h-full">
                {/* <div
                  className={`w-1 rounded-l-lg flex-shrink-0 ${
                    appState.mode === "dark" ? "bg-blue-500" : "bg-blue-500"
                  }`}
                /> */}

                <div className="flex-1 px-3 py-2.5 overflow-hidden">
                  {/* Header: Index + Product + Price */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`text-xs font-medium flex-shrink-0 ${
                          appState.mode === "dark"
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <span
                        className={`font-semibold text-sm truncate ${
                          appState.mode === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                        title={item.product}
                      >
                        {item.product || "—"}
                      </span>
                    </div>
                    <span
                      className={`font-semibold text-sm whitespace-nowrap flex-shrink-0 ${
                        appState.mode === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      ₹ {item.unitPrice || 0}
                    </span>
                  </div>

                  {/* Details rows */}
                  <div className="space-y-1">
                    {/* Item Subtotal */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs ${
                          appState.mode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Item Subtotal
                      </span>
                      <span
                        className={`text-xs ${
                          appState.mode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {item.qty || 0} x {item.unitPrice || 0} = ₹ {item.total || 0}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs ${
                          appState.mode === "dark"
                            ? "text-orange-400"
                            : "text-orange-500"
                        }`}
                      >
                        Discount ({item.discPerc || 0}%):
                      </span>
                      <span
                        className={`text-xs ${
                          appState.mode === "dark"
                            ? "text-orange-400"
                            : "text-orange-500"
                        }`}
                      >
                        ₹ {item.discount || 0}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs ${
                          appState.mode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Tax: {item.vatPerc || 0}%
                      </span>
                      <span
                        className={`text-xs ${
                          appState.mode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        ₹ {item.totalAddExpense || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`py-0 ${rowBg} transition-all duration-300 ease-in-out group`}
            style={{
              position: isMobileEditRow ? "static" : "absolute",
              top: isMobileEditRow ? "" : `${top}px`,
              left: isMobileEditRow ? "" : 0,
              height: isMobileEditRow ? "" : `${rowHeight}px`,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              borderBottom: `0.5px solid ${
                appState.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                  : `rgba(${
                      formState.userConfig?.gridBorderColor || "203,213,225"
                }, 0.3)`
                }`,
              backgroundColor:
                currentCell?.rowIndex === index
                  ? appState.mode === "dark"
                    ? "#444444"
                    : formState.userConfig?.activeRowBg
                      ? `rgb(${formState.userConfig.activeRowBg})`
                      : "#e3f2fd"
                  : index % 2 === 0
                    ? appState.mode === "dark"
                      ? "#333333"
                      : "#fff"
                    : appState.mode === "dark"
                      ? "#444444"
                      : "#f9f9f9",
            }}
          >
            {columns.map((column, colIndex) => {
              // TransactionDetails2
              const isDetails2 = Object.keys(
                initialTransactionDetails2
              ).includes(column.dataField as keyof TransactionDetails2);
              const isMoreDetails = Object.keys(
                transactionInitialMoreDetails
              ).includes(column.dataField as keyof TransactionDetailsMore);
              if (column.dataField == "memo" && item.productID > 0) {

              }
              const fieldKey = column.dataField as TransactionDetailKeys;
              const idField = column.idField as keyof TransactionDetail;
              const productId = item.productID;
              const cellValue = ((isDetails2
                ? item.details2?.[fieldKey as keyof TransactionDetails2]
                : isMoreDetails
                  ? item.moreDetail?.[fieldKey as keyof TransactionDetailsMore]
                  : item[fieldKey as keyof TransactionDetail]) ?? "") as
                | string
                | boolean;
              const idValue = item[idField];
              const isFirstColumn = colIndex === 0;
              const isLastColumn = colIndex === columns.length - 1;
              const isFixed = isFirstColumn || isLastColumn;
              const showBorder = formState.userConfig?.showColumnBorder ?? true;
              console.log("showBorder:",showBorder);
              
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
              if (fieldKey === "brand") {
                options = formState.dataBrands ?? [];
              }
              const cellId = `${gridId}_${column.dataField}_${index}`;
              const borderColor = `${
                (column.readOnly ||
                column.allowEditing == false ||
                formState.formElements.pnlMasters?.disabled !== true) &&
                currentCell?.column === column.dataField &&
                currentCell?.rowIndex === index
                ? appState.mode === "dark"
                  ? "#444444"
                  : formState.userConfig?.inputBoxStyle?.focusBgColor
                    ? `rgb(${formState.userConfig?.inputBoxStyle?.focusBgColor})`
                    : "#e3f2fd"
                : undefined
                }`;

              return (
                <>
                <GridCell
                  key={`${column.dataField}`}
                  column={column}
                  item={item}
                  index={index}
                  currentCell={currentCell}
                  setCurrentCell={setCurrentCell}
                  formState={formState}
                  appState={appState}
                  gridFontSize={gridFontSize}
                  gridIsBold={gridIsBold}
                  rowHeight={rowHeight}
                  gridBorderColor={gridBorderColor}
                  isFirstColumn={isFirstColumn}
                  isLastColumn={isLastColumn}
                  showBorder={showBorder}
                  columnWidths={columnWidths}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  handlRowKeyDown={handlRowKeyDown}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  gridId={gridId}
                  details={details}
                  blockUnitOnDecimalPoint={blockUnitOnDecimalPoint}
                  applicationSettings={applicationSettings}
                  useInSearch={useInSearch}
                  searchByCodeAndName={searchByCodeAndName}
                  advancedProductSearching={advancedProductSearching}
                  transactionType={transactionType}
                  zIndexController={zIndexController}
                  nextCellFind={nextCellFind}
                  />
                {/* <div
                  key={`${column.dataField}`}
                  style={{
                    width: `${
                      columnWidths?.find((x) => x.field == column.dataField)
                      ?.width
                      }px`,
                    minWidth: `${
                      columnWidths?.find((x) => x.field == column.dataField)
                      ?.width
                      }px`,
                    maxWidth: `${
                      columnWidths?.find((x) => x.field == column.dataField)
                      ?.width
                      }px`,
                    borderRight: isFirstColumn
                      ? `2px solid ${
                          appState.mode === "dark"
                        ? "rgba(255,255,255,0.2)"
                        : `rgba(${gridBorderColor || "226,232,240"})`
                      }`
                      : isLastColumn
                        ? "none"
                        : showBorder
                      ? `0.2px solid ${
                          appState.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`
                          }`
                          : "none",
                    borderLeft: isLastColumn
                      ? `2px solid ${
                          appState.mode === "dark"
                        ? "rgba(255,255,255,0.2)"
                        : `rgba(${gridBorderColor || "226,232,240"})`
                      }`
                      : "none",
                    fontSize: `${gridFontSize}px`,
                    textAlign:
                      column.dataField === "slNo"
                        ? "center"
                        : ["qty"].includes(column.dataField ?? "")
                          ? "right"
                          : "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      currentCell?.rowIndex === index &&
                        currentCell?.column === column.dataField
                        ? appState.mode === "dark"
                          ? "#555555"
                          : formState.userConfig?.inputBoxStyle?.focusBgColor
                            ? `rgb(${formState.userConfig.inputBoxStyle.focusBgColor})`
                            : "#bfdbfe"
                        : currentCell?.rowIndex === index
                          ? appState.mode === "dark"
                            ? "#444444"
                            : formState.userConfig?.activeRowBg
                              ? `rgb(${formState.userConfig.activeRowBg})`
                              : "#e3f2fd"
                          : index % 2 === 0
                            ? appState.mode === "dark"
                              ? "#333333"
                              : "#fff"
                            : appState.mode === "dark"
                              ? "#444444"
                              : "#f9f9f9",
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
                      checked={cellValue == true ? true : false}
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
                        handlRowKeyDown(
                          cellValue,
                          { key: "Enter" } as any,
                          column as any,
                          index,details
                        )
                      }
                      className={`px-2 py-1 border rounded shadow-sm hover:shadow text-xs transition-all ${
                        appState.mode === "dark"
                        ? "bg-[#444444] text-[#e0e0e0] border-[#555555] hover:bg-[#555555]"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
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
                  ) : column.dataField === "actionCol" ? (
                    <div
                      className="flex items-center justify-center gap-1"
                      style={{
                        border: `solid 1px ${borderColor}`,
                      }}
                    >
                      <button
                        onClick={() => handleInfoClick(index)}
                        className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${
                          appState.mode === "dark"
                          ? "hover:bg-blue-900 hover:border-blue-700"
                          : "hover:bg-blue-50 hover:border-blue-200"
                          }`}
                      >
                        <Info
                          className={`w-4 h-4 transition-all duration-300 ${
                            appState.mode === "dark"
                            ? "text-blue-400 group-hover:text-blue-300"
                            : "text-blue-600 group-hover:text-blue-700"
                            }`}
                        />
                      </button>
                      <button
                        disabled={formState.formElements.pnlMasters?.disabled}
                        onClick={() =>
                          onKeyDown(
                            item.slNo,
                            { key: "Enter" } as any,
                            "actionCol",
                            index
                          )
                        }
                        className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${
                          appState.mode === "dark"
                          ? "hover:bg-red-900 hover:border-red-700"
                          : "hover:bg-red-50 hover:border-red-200"
                          }`}
                      >
                        <Trash2
                          className={`w-4 h-4 transition-all duration-300 ${
                            appState.mode === "dark"
                            ? "text-red-400 group-hover:text-red-300"
                            : "text-red-600 group-hover:text-red-700"
                            }`}
                        />
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
                      showInputSymbol={true}
                      customStyle={customStyle}
                      appState={appState}
                      zIndexController={zIndexController}
                      textAlign={
                        column.alignment === "right" ? "right" : "left"
                      }
                      rowIndex={index}
                      id={cellId}
                      inputId={`${gridId}_${column.dataField}_${index}`}
                      searchType={
                        applicationSettings?.productsSettings
                          ?.usePopupWindowForItemSearch
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
                      onFocus={() => handleFocus?.(column.dataField!)}
                      onBlur={(e) => handleBlur?.(e)}
                      onKeyDown={(value, e) => {
                        handlRowKeyDown(value, e, column, index,details);
                      }}
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
                      style={{
                        ...getCellContentStyle(column),
                        border: `solid 1px ${borderColor}`,
                      }}
                      id={cellId}
                      tabIndex={0}
                      onFocus={() => handleFocus?.(column.dataField!)}
                      // onBlur={(e) => handleBlur?.(e)}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handlRowKeyDown(cellValue, e, column, index,details)
                      }
                    >
                      {productId > 0 ? cellValue ?? "" : ""}
                    </div>
                  ) : column.dataField === "status" ? (
                    <div
                      style={{
                        ...getCellContentStyle(column),
                        justifyContent: "center",
                        border: `solid 1px ${borderColor}`,
                      }}
                      id={cellId}
                      tabIndex={0}
                      className={`inline-flex px-2 py-1 font-medium rounded-full cursor-default ${
                        cellValue === "Active"
                        ? appState.mode === "dark"
                          ? "bg-[#2d6a4f] text-[#b7e1cd]"
                          : "bg-[#dcfce7] text-[#166534]"
                        : ""
                        }
                    ${
                      cellValue === "Inactive"
                          ? appState.mode === "dark"
                            ? "bg-[#7b2e2e] text-[#f4a8a8]"
                            : "bg-[#fee2e2] text-[#991b1b]"
                          : ""
                        }
                    ${
                      cellValue === "Pending"
                          ? appState.mode === "dark"
                            ? "bg-[#6b4e31] text-[#fce5a8]"
                            : "bg-[#fef9c3] text-[#854d0e]"
                          : ""
                        }`}
                      onFocus={() => handleFocus?.(column.dataField!)}
                      // onBlur={(e) => handleBlur?.(e)}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handlRowKeyDown(cellValue, e, column, index,details)
                      }
                    >
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
                      value={
                        column.dataType === "cb"
                          ? (idValue as string | number)
                          : (cellValue as string | number)
                      }
                      options={options}
                      onFocus={() => handleFocus?.(column.dataField!)}
                      // onBlur={(e) => handleBlur?.(e)}
                      // onBlur={handleBlur}
                      onBlur={() => handleBlur?.({} as React.FocusEvent<HTMLInputElement>)}
                      gridId={gridId}
                      onKeyDown={(e) =>
                        handlRowKeyDown(cellValue, e, column, index,details)
                      }
                      gridFontSize={gridFontSize}
                      gridIsBold={gridIsBold}
                      formState={formState}
                      rowHeight={rowHeight}
                    />
                  ) : (
                    <div
                      style={
                        currentCell?.column === column.dataField &&
                          currentCell?.rowIndex === index
                          ? {
                            ...getCellContentStyle(column),
                            border: `solid 3px rgb(${formState.userConfig?.inputBoxStyle?.focusBgColor})`,
                            background: "#fff",
                          }
                          : { ...getCellContentStyle(column) }
                      }
                      id={cellId}
                      tabIndex={0}
                      className="px-1 cursor-default"
                       onFocus={() => handleFocus?.(column.dataField!)}
                      // onBlur={(e) => handleBlur?.(e)}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handlRowKeyDown(cellValue ?? "", e, column, index,details)
                      }
                    >
                      {productId > 0
                        ? column.decimalPoint
                          ? getFormattedValue(
                            cellValue as any,
                            false,
                            column.decimalPoint
                          )
                          : column.dataType == "date" &&
                            !isNullOrUndefinedOrEmpty(column.format)
                            ? moment(cellValue as any).format(column.format)
                            : cellValue ?? ""
                        : ""}
                    </div>
                  )}
                </div> */}
                </>
              );
            })}
          </div>
        )}
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
      rowHeight = 55,
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
      zIndexController,
      onSaveItem,
      ignoreKeyMovesInCell
    }: DataGridProps<T>,
    ref: Ref<any>
  ) {
    const dispatch = useAppDispatch();
    console.log("zIndexController:",zIndexController);
    console.log("gridBorderColor:",gridBorderColor);

    console.log("dgrowHeight:", rowHeight);
    
    
    
    const formState = useAppSelector(
      (state: RootState) => state.InventoryTransaction
    );
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
    const appState = useAppSelector(
      (state: RootState) => state.AppState?.appState
    );
    const applicationSettings = useAppSelector(
      (state: RootState) => state.ApplicationSettings
    );
    const preferenceChooserRef = useRef<{
      handleDragStart: (e: React.DragEvent<HTMLElement>) => void;
      handleDragEnd: (e: React.DragEvent<HTMLElement>) => void;
      handleDropping: (eFromDataGrid?: boolean) => void;
    }>(null);
    const { t } = useTranslation("transaction");
    // const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
    const [isExcelMenuOpen, setIsExcelMenuOpen] = useState(false);
    const [exportVisibleColumns, setExportVisibleColumns] = useState(true);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    const [barcodeTargetRow, setBarcodeTargetRow] = useState<number>(-1);

    // Ref to always have the latest onKeyDown function
    const onKeyDownRef = useRef(onKeyDown);
    useEffect(() => {
      onKeyDownRef.current = onKeyDown;
    }, [onKeyDown]);

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const virtualContainerRef = useRef<HTMLDivElement>(null);
    // This state is used for grid resizer showing when hovering the fields header ( not using this now)
    const [hoverFieldHeader, setHoverFieldHeader] = useState<{column: string, hovered: boolean}>({column: '', hovered: false})

    const totalGridWidth = useMemo(() => {
      console.log(columnWidths);

      return columnWidths.reduce(
        (sum, widthItems) => sum + widthItems?.width,
        0
      );
    }, [columnWidths]);

    const handleShowGridTheme = () => {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            showGridTheme: true,
          },
        })
      );
    };

  

    useEffect(() => {
      const fetchPreferences = async () => {
        // onApplyPreferences(await getInitialPreference(gridId, _columns, new APIClient()));
      };

      if (gridId && _columns) {
        fetchPreferences();
      }
    }, [gridId, _columns]);

    const columns: ColumnModel[] = useMemo(() => {
      const visibleColumns =
        formState.gridColumns?.filter((x) => x.visible !== false) ?? [];

      if (columnOrder.length > 0 && visibleColumns?.length > 0) {
        const vc: ColumnModel[] = columnOrder
          .map((or) => visibleColumns.find((x) => x.dataField == or.field))
          .filter((col) => col !== undefined);
        return vc;
      }
      return visibleColumns;
    }, [columnOrder, formState.gridColumns]);

    const { preferences } = usePreferenceData(formState.gridColumns as any, gridId);
    const ITEM_HEIGHT =
      window.innerWidth < 480
        ? 125
        : window.innerWidth <= 768
          ? 140
          : formState.userConfig?.gridRowHeight ?? 32;

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
        setColumnOrder(
          visibleColumns.map((_, index) => {
            return { field: _.dataField ?? "", index: index };
          })
        );
      }

      if (columnWidths.length === 0) {
        setColumnWidths(
          visibleColumns.map((col) => {
            return { field: col.dataField ?? "", width: col.width ?? 0 };
          })
        );
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
            const field =
              (handle as HTMLElement).getAttribute("data-field") ?? "";
            startResize(
              mouseEvent,
              isRTL ? index - 1 : index,
              field,
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
            orientation: "landscape",
            fitToPage: true,
            fitToHeight: 1,
            fitToWidth: 1,
            margins: {
              left: 0.7,
              right: 0.7,
              top: 0.75,
              bottom: 0.75,
              header: 0.3,
              footer: 0.3,
            },
          },
        });

        const excelColumns = exportVisibleColumns
          ? formState.gridColumns?.filter(
              (col) => col.visible !== false && col.dataField != null
            )
          : formState.gridColumns;

        const colors = {
          headerBg: "FFF8F9FA",
          headerText: "FF495057",
          background: "FFFFFFFF",
          alternateRow: "FFF8F9FA",
          border: "FFDEE2E6",
          text: "FF212529",
          summaryBg: "FFF1F3F4",
          summaryBorder: "FFADB5BD",
        };

        worksheet.columns = (excelColumns ?? []).map((col) => ({
          header: col.caption || col.dataField,
          key: col.dataField,
          width: Math.max(col.width ? col.width / 7 : 15, 12),
        })) as any;

        const titleRow = worksheet.insertRow(1, [`${gridId} Export Report`]);
        worksheet.mergeCells(1, 1, 1, excelColumns?.length || 1);

        titleRow.getCell(1).font = {
          name: "Segoe UI",
          size: 16,
          bold: true,
          color: { argb: colors.text },
        };
        titleRow.getCell(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        titleRow.height = 35;

        const dateRow = worksheet.insertRow(2, [
          `Generated on: ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        ]);
        worksheet.mergeCells(2, 1, 2, excelColumns?.length || 1);

        dateRow.getCell(1).font = {
          name: "Segoe UI",
          size: 10,
          color: { argb: colors.headerText },
        };
        dateRow.getCell(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        dateRow.height = 25;

        const headerRow = worksheet.getRow(3);
        headerRow.height = 30;
        headerRow.font = {
          name: "Segoe UI",
          size: 11,
          bold: true,
          color: { argb: colors.headerText },
        };
        headerRow.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors.headerBg },
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
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: colors.alternateRow },
            };
          }

          addedRow.font = {
            name: "Segoe UI",
            size: 10,
            color: { argb: colors.text },
          };
          addedRow.alignment = {
            vertical: "middle",
            horizontal: "left",
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
            name: "Segoe UI",
            size: 10,
            bold: true,
            color: { argb: colors.text },
          };
          addedSummaryRow.alignment = {
            vertical: "middle",
            horizontal: "left",
          };
          addedSummaryRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colors.summaryBg },
          };
        }

        const dataStartRow = 3;
        const dataEndRow = worksheet.rowCount;
        const dataEndCol = excelColumns?.length || 1;

        for (let row = dataStartRow; row <= dataEndRow; row++) {
          for (let col = 1; col <= dataEndCol; col++) {
            const cell = worksheet.getCell(row, col);
            cell.border = {
              top: { style: "thin", color: { argb: colors.border } },
              left: { style: "thin", color: { argb: colors.border } },
              bottom: { style: "thin", color: { argb: colors.border } },
              right: { style: "thin", color: { argb: colors.border } },
            };
          }
        }

        worksheet.columns.forEach((column, index) => {
          let maxLength = 0;
          const columnLetter = String.fromCharCode(65 + index);

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber >= dataStartRow) {
              const cell = row.getCell(index + 1);
              const cellValue = cell.value ? cell.value.toString() : "";
              maxLength = Math.max(maxLength, cellValue.length);
            }
          });

          const calculatedWidth = Math.min(Math.max(maxLength + 2, 12), 50);
          if (column.width) {
            column.width = Math.max(column.width as number, calculatedWidth);
          }
        });

        worksheet.views = [
          {
            state: "frozen",
            xSplit: 0,
            ySplit: 3,
            topLeftCell: "A4",
            activeCell: "A4",
          },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        const filename = `${gridId}_export_${timestamp}.xlsx`;

        saveAs(blob, filename);

        console.log("Excel export completed successfully!");
      } catch (error) {
        console.error("Error exporting to Excel:", error);
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
    
  const _setCurrentCell = (data: any) =>  {
    setCurrentCell(data)
  };
    const [prevCell, setPrevCell] = useState<number>(
      formState.currentCell?.rowIndex ?? -1
    );
    useEffect(() => {
      console.log("focusCell");

      setCurrentCell(formState.currentCell);
    }, [formState.currentCell]);

   
    // Callback to trigger Enter key logic after barcode scan
    const handleBarcodeEnterTrigger = useCallback(async(result: BarcodeScanResult) => {
      // Use barcodeTargetRow if set, otherwise use current cell row, fallback to 0
      const targetRow = barcodeTargetRow >= 0 ? barcodeTargetRow :
        (formState.currentCell?.rowIndex ?? 0);
      if (targetRow >= 0) {
        // Simulate Enter key press on barCode field to trigger item lookup
        const syntheticEvent = {
          key: 'Enter',
          preventDefault: () => {},
          stopPropagation: () => {},
        } as React.KeyboardEvent<HTMLElement>;

        if (onKeyDownRef.current) {
          debugger;
         await onKeyDownRef.current(
            result.text,
            syntheticEvent,
            'barCode' as keyof TransactionDetail,
            targetRow,
            true
          );
         
        } else {
        }
      } else {
      }
    }, [barcodeTargetRow, formState.currentCell?.rowIndex]);

    const scrollToCenter = useCallback(
      (rowIndex: number, column?: string, duration: number = 300) => {
        if (rowIndex < 0 || rowIndex >= formState.transaction.details.length) {
          console.warn("Invalid row index:", rowIndex);
          return false;
        }

        if (!containerRef.current) {
          return false;
        }
        const visibleColumns = formState.gridColumns?.filter(
          (col) => col.visible !== false && col.dataField != null
        );
        const columnIndex = visibleColumns.findIndex(
          (x) => x.dataField == column
        );
        const container = containerRef.current;
        const currentVerticalScrollTop = container.scrollTop;
        const currentHorizontalScrollLeft = container.scrollLeft;

        // Calculate target vertical position
        const rowTop = rowIndex * ITEM_HEIGHT;
        const containerCenter = height / 2;
        const targetVerticalScrollTop =
          rowTop - containerCenter + ITEM_HEIGHT / 2;

        const totalContentHeight =
          formState.transaction.details.length * ITEM_HEIGHT;
        const maxVerticalScrollTop = Math.max(0, totalContentHeight - height);
        const finalVerticalScrollTop = Math.max(
          0,
          Math.min(targetVerticalScrollTop, maxVerticalScrollTop)
        );

        // Calculate target horizontal position
        let finalHorizontalScrollLeft = currentHorizontalScrollLeft;

        if (
          columnIndex !== undefined &&
          columns &&
          columnIndex >= 0 &&
          columnIndex < columns.length
        ) {
          let columnLeft = 0;
          for (let i = 0; i < columnIndex; i++) {
            const colWidth =
              columnWidths?.find((x) => x.field === columns[i].dataField)
                ?.width || 150;
            columnLeft += colWidth;
          }

          const currentColumn = columns[columnIndex];
          const columnWidth =
            columnWidths?.find((x) => x.field === currentColumn.dataField)
              ?.width || 150;

          const containerWidth = container.clientWidth;
          const containerHorizontalCenter = containerWidth / 2;
          const totalGridCenter = totalGridWidth / 2;
          const columnCenter = columnLeft + columnWidth / 2;

          if (columnCenter < totalGridCenter) {
            finalHorizontalScrollLeft = 0;
          } else {
            const targetHorizontalScrollLeft =
              columnLeft - containerHorizontalCenter + columnWidth / 2;
            const maxHorizontalScrollLeft = Math.max(
              0,
              totalGridWidth - containerWidth
            );
            finalHorizontalScrollLeft = Math.max(
              0,
              Math.min(targetHorizontalScrollLeft, maxHorizontalScrollLeft)
            );
          }
        }

        // Animate both scrolling
        const startTime = performance.now();
        const verticalDistance =
          finalVerticalScrollTop - currentVerticalScrollTop;
        const horizontalDistance =
          finalHorizontalScrollLeft - currentHorizontalScrollLeft;

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);

          const newVerticalScrollTop =
            currentVerticalScrollTop + verticalDistance * easeOut;
          const newHorizontalScrollLeft =
            currentHorizontalScrollLeft + horizontalDistance * easeOut;

          container.scrollTop = newVerticalScrollTop;
          container.scrollLeft = newHorizontalScrollLeft;
          updateScroll(newVerticalScrollTop);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
        return true;
      },
      [
        ITEM_HEIGHT,
        height,
        updateScroll,
        formState.transaction.details.length,
        columns,
        columnWidths,
        totalGridWidth,
      ]
    );

    useEffect(() => {
      const runEffect = async () => {
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
                : (targetCell.querySelector(
                    "input"
                  ) as HTMLInputElement | null);
            if (input) input.select();
          }
        }
        if (currentCell?.reCenterRow) {
          scrollToCenter(currentCell.rowIndex, currentCell.column);
        }
        setPrevCell(currentCell?.rowIndex ?? -1);
        if (prevCell !== currentCell?.rowIndex) {
          const data = formState.transaction.details.filter(
            (x) => x.productID > 0
          );
          if (data?.length > 0) {
            await setStorageString(
              `${formState.transaction.master.voucherType}${formState.transaction.master.voucherForm}`,
              JSON.stringify(data)
            );
          }
        }
        // Need to verify - safwan sir
        dispatch(formStateHandleFieldChangeKeysOnly({fields:{currentCell: currentCell}}))
        if (
          prevCell !== currentCell?.rowIndex &&
          isNullOrUndefinedOrZero(currentCell?.data?.productID
          )&& !isMobile
        ) {
          const rc =
            20 -
            formState.transaction.details.filter((x: any) =>
              isNullOrUndefinedOrZero(x.productID)
            ).length;
          const rows = Array.from({ length: rc }, (_, index) => ({
            ...initialTransactionDetailData,
            slNo: generateUniqueKey(),
          }));
          dispatch(formStateTransactionDetailsRowsAdd(rows));
        }
      };
      runEffect();
    }, [currentCell, currentCell?.rowIndex, currentCell?.key]);
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

    const { getFormattedValue } = useNumberFormat();

    const headerStyle = {
      left: isRtl ? "0" : headerLeft,
      right: isRtl ? headerLeft : "0",
    };

    const closeGridMenu = () => {
      dispatch(
        formStateHandleFieldChange({
          fields: { gridMenuOpen: false },
        })
      );
    };

    const openGridMenu = () => {
      dispatch(
        formStateHandleFieldChange({
          fields: { gridMenuOpen: true },
        })
      );
    }

      const handlRowKeyDown = useCallback(
      (
        value: any,
        e: React.KeyboardEvent<HTMLElement>,
        column: ColumnModel,
        rowIndex: number,
        details: TransactionDetail[]
      ) => {
        const target = e.target as HTMLElement;
        const visibleColumns = columns.filter(
          (col) => col.visible !== false && col.dataField != null
        );
        const currentColumnIndex = visibleColumns.findIndex(
          (col) => col.dataField === column?.dataField
        );
        if (ignoreKeyMovesInCell === true && column.dataField === "unitPrice") {
          onKeyDown(
            value,
            e,
            column.dataField as keyof TransactionDetail,
            rowIndex
          );
          return;
        }

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
          if (!details) return;
          if (rowIndex === undefined) return;

          if (currentColumnIndex < visibleColumns.length - 1) {
            const res = focusCell(rowIndex, currentColumnIndex + 1);
            if (res != null) {
              setCurrentCell({ ...res, data: details[rowIndex] });
            }
          }
          break;

        case "ArrowLeft":
          if (!details) return;
          if (rowIndex === undefined) return;

          if (currentColumnIndex > 0) {
            const res = focusCell(rowIndex, currentColumnIndex - 1);
            if (res != null) {
              setCurrentCell({ ...res, data: details[rowIndex] });
            }
          }
          break;

        case "ArrowUp":
          if (!details) return;
          if (rowIndex === undefined || rowIndex <= 0) return;

          const resUp = focusCell(rowIndex - 1, currentColumnIndex);
          if (resUp != null) {
            setCurrentCell({ ...resUp, data: details[rowIndex - 1] });
          }
          break;

        case "ArrowDown":
          if (!details) return;
          if (rowIndex === undefined || rowIndex >= details.length - 1) return;

          const resDown = focusCell(rowIndex + 1, currentColumnIndex);
          if (resDown != null) {
            setCurrentCell({ ...resDown, data: details[rowIndex + 1] });
          }
          break;

        }
      },
      [columns, focusCell, setCurrentCell, onKeyDown]
    );

    const [focusedColumn, setFocusedColumn] = useState<string | null>(null);

    const handleFocus = useCallback(
      (columnKey: string) => {
        setFocusedColumn(columnKey);
      },
      // [index]
      []
    );

     const handleBlur = useCallback(() => {
      if (document.activeElement?.closest(".dx-datagrid")) return;
      setFocusedColumn(null);
    }, []);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          popupRef.current &&
          !popupRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          closeGridMenu();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const [state, setState] = useState({
      itemName: "",
      quantity: 1,
      unit: "Bag",
      rate: 100,
      priceIncludesTax: false,
      discountPercent: undefined as number | undefined,
      discountAmount: undefined as number | undefined,
      taxPercent: 18,
    });

//     const update = (key: string, value: any) => {
//   setState((prev) => ({ ...prev, [key]: value }));
// };

// const formatCurrency = (amount: number) => {
//   return `₹${amount.toFixed(2)}`;
// };

const subtotal = state.quantity * state.rate;
const discountFromPercent = state.discountPercent 
  ? (subtotal * state.discountPercent) / 100 
  : 0;
const discountAmount = state.discountAmount ?? discountFromPercent;
const afterDiscount = subtotal - discountAmount;
const taxAmount = state.priceIncludesTax
  ? (afterDiscount * state.taxPercent) / (100 + state.taxPercent)
  : (afterDiscount * state.taxPercent) / 100;
const total = state.priceIncludesTax ? afterDiscount : afterDiscount + taxAmount;

// 5. Missing arrays for dropdowns
const units = ["Bag", "Box", "Piece", "Kg", "Litre"];
const taxOptions = [0, 5, 12, 18, 28];

const [showMore , setShowMore] = useState (false)
const [openScanner, setOpenScanner] = useState(false);
const barcodeInputRef = useRef<HTMLInputElement>(null);
let _userSession = useAppSelector((state: RootState) => state.UserSession);


const hidColumns: string[] = [
  "product",
  "qty",
  "unit",
  "salesPrice",
  "total",
  "discPerc",
  "discount",
  "vatPerc",
  "vatAmount",
  "actionCol",
  "barCode"
];



    

    return (
      <>
      
          <>{isMobile && !formState.transactionLoading && <DraggablePlusButton onClick={() => {
            debugger;
            dispatch(formStateHandleFieldChangeKeysOnly({fields:{
              row: {
                ...initialTransactionDetailData,
                slNo: generateUniqueKey()
              },
              itemPopup: {isOpen:true, index:formState.transaction.details.length}
            }}))
          }} />}</>
      <div
        style={{
          position: isMobile ? "relative" : "static",
          marginTop: isMobile ? "22px" : "",
          maxWidth: "100%",
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          boxSizing: "border-box",
          border: `0.5px solid ${
            appState.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : `rgba(${gridBorderColor || "203,213,225"}, 0.4)`
          }`,
          borderRadius: formState.userConfig?.gridBorderRadius
            ? `${formState.userConfig.gridBorderRadius}px`
            : "0px",
          boxShadow:
            "0 4px 25px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          background:
            appState.mode === "dark"
              ? "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)"
              : "linear-gradient(to bottom right, rgba(248,250,252,0.8), white, rgba(239,246,255,0.3))",
        }}
        className="rounded-2xl shadow-xl backdrop-blur-sm"
      >
        
        <div className={`relative ${className} w-full`}>
          {formState.gridMenuOpen && (
            <div
              ref={popupRef}
              className={`fixed top-[33px] w-[251px] rounded-lg shadow-xl border p-2 z-[51] backdrop-blur-sm ${
                appState.mode === "dark"
                  ? "bg-[#1f2937] text-[#f3f4f6] border-[#374151]"
                  : "bg-white text-black border-[#e5e7eb]"
              }`}
              style={headerStyle}
            >
              <nav className="w-full">
                <ul className="space-y-1">
                  {/* Grid Preferences */}
                  <li> 
                        <GridPreferenceChooser
                        initialPreferences={preferences}
                        ref={preferenceChooserRef}
                        gridId={gridId}
                        columns={
                          (formState.gridColumns ?? []) as DevGridColumn[]
                        }
                        onApplyPreferences={onApplyPreferences}
                        showChooserName={true}
                      />
                 </li>

                  {/* Export to Excel */}
                  <li>
                    <button
                      onClick={() => {
                        closeGridMenu();
                        openExcelMenu();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-[5px] rounded-md group text-left transition-all duration-200 ${
                        appState.mode === "dark"
                          ? "hover:bg-[#14532d4d] hover:text-[#86efac]"
                          : "hover:bg-[#f0fdf4] hover:text-[#15803d]"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${
                          appState.mode === "dark"
                            ? "bg-[#14532d4d] group-hover:bg-[#16653499]"
                            : "bg-[#bbf7d0] group-hover:bg-[#86efac]"
                        }`}
                      >
                        <FileUp
                          className={`h-4 w-4 ${
                            appState.mode === "dark"
                              ? "text-[#86efac]"
                              : "text-[#166534]"
                          }`}
                        />
                      </div>
                      <span className="font-medium">
                        {t("export_to_excel")}
                      </span>
                    </button>
                  </li>

                  {/* Change Grid Theme */}
                  <li>
                    <button
                      onClick={()=>{
                        closeGridMenu();
                        handleShowGridTheme();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-[5px] rounded-md group text-left transition-all duration-200 ${
                        appState.mode === "dark"
                          ? "hover:bg-[#1e3a8a4d] hover:text-[#93c5fd]"
                          : "hover:bg-[#eff6ff] hover:text-[#1d4ed8]"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${
                          appState.mode === "dark"
                            ? "bg-[#1e3a8a4d] group-hover:bg-[#1e3a8a99]"
                            : "bg-[#dbeafe] group-hover:bg-[#bfdbfe]"
                        }`}
                      >
                        <Paintbrush
                          className={`h-4 w-4 ${
                            appState.mode === "dark"
                              ? "text-[#93c5fd]"
                              : "text-[#1e40af]"
                          }`}
                        />
                      </div>
                      <span className="font-medium">
                        {t("change_grid_theme")}
                      </span>
                    </button>
                  </li>

                  {/* Barcode Scanner */}
                  <li>
                    <button
                      onClick={() => {
                        closeGridMenu();
                        setBarcodeTargetRow(formState.itemPopup?.index ?? -1);
                        setShowBarcodeScanner(true);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-[5px] rounded-md group text-left transition-all duration-200 ${
                        appState.mode === "dark"
                          ? "hover:bg-[#7c2d1255] hover:text-[#fed7aa]"
                          : "hover:bg-[#fed7aa] hover:text-[#92400e]"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${
                          appState.mode === "dark"
                            ? "bg-[#7c2d1255] group-hover:bg-[#92400e4d]"
                            : "bg-[#fed7aa] group-hover:bg-[#fdba74]"
                        }`}
                      >
                        <svg
                          className={`h-4 w-4 ${
                            appState.mode === "dark"
                              ? "text-[#fbbf24]"
                              : "text-[#b45309]"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        {t("scan_barcode")}
                      </span>
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
                    onClick={() => { exportToExcel(); closeExcelMenu(); }}
                  />
                </div>
              }
            />
          )}
          {/* Barcode Scanner Modal */}
          <BarcodeModalScanner
            isOpen={showBarcodeScanner}
            onClose={() => setShowBarcodeScanner(false)}
            onScan={(e: any) => {

            }}
            onEnterTrigger={handleBarcodeEnterTrigger}
            title={t("scan_barcode")}
          />
          <ERPScrollArea
            scrollbarColor={formState.userConfig?.scrollbarColor}
            ref={containerRef}
            className="border border-gray-300 "
            style={{
              height: `${height + 110}px`,
              overflowY: "scroll",
              overflowX: "auto",
              position: "relative",
              scrollbarWidth: "auto",
              paddingTop: isMobile ? "35px" : "",
              // scrollbarColor: appState.mode === "dark" ? "#555 #333" : "#ddd #f1f1f1",
            }}
            onScroll={(e) => {
              handleScroll(e);
            }}
          >
            <div
              style={{
                width: `${!isMobile ? `${totalGridWidth}px` : "100%"}`,
                minWidth: `${!isMobile ? totalGridWidth : 50}px`,
                height: `${!isMobile ? totalHeight + 80 : totalHeight + 10}px`,
                borderRadius: formState.userConfig?.gridBorderRadius
                  ? `${formState.userConfig.gridBorderRadius}px`
                  : "0px",
              }}
            >
              {!isMobile && (
                <div
                  className="table-header"
                  style={{
                    display: isMobile ? "none" : "flex",
                    background:
                      appState.mode === "dark"
                        ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)"
                        : gridHeaderBg
                        ? `rgb(${gridHeaderBg})`
                        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                    borderBottom: `0.5px solid ${
                      appState.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : `rgba(${gridBorderColor || "203,213,225"}, 0.4)`
                    }`,
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    height: `${headerRowHeight}px`,
                  }}
                >
                  {columns?.map((column, index) => {
                    const isFirstColumn = index === 0;
                    const isLastColumn = index === columns.length - 1;
                    const isFixed = isFirstColumn || isLastColumn;
                    const showBorder =
                      formState.userConfig?.showColumnBorder ?? true;
                    return (
                      <div
                        key={`${column?.dataField}-${index}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        // Not using the below now(used for grid resizer showing when hovering)
                        onMouseEnter={()=> setHoverFieldHeader({column: column?.dataField??"", hovered: true})}
                        onMouseLeave={()=> setHoverFieldHeader({column: column?.dataField??"", hovered: false})}
                        style={{
                          width: `${
                            columnWidths?.find(
                              (x) => x.field == column?.dataField
                            )?.width
                          }px`,
                          minWidth: `${
                            columnWidths?.find(
                              (x) => x.field == column?.dataField
                            )?.width
                          }px`,
                          maxWidth: `${
                            columnWidths?.find(
                              (x) => x.field == column?.dataField
                            )?.width
                          }px`,
                          padding: "8px 12px",
                          borderRight: isFirstColumn
                            ? `2px solid ${
                                appState.mode === "dark"
                                  ? "rgba(255,255,255,0.2)"
                                  : `rgba(${gridBorderColor || "226,232,240"})`
                              }`
                            : isLastColumn
                            ? "none"
                            : showBorder
                            ? `0.2px solid ${
                                appState.mode === "dark"
                                  ? "rgba(255,255,255,0.1)"
                                  : `rgba(${
                                      gridBorderColor || "226,232,240"
                                    }, 0.8)`
                              }`
                            :"none",
                          borderLeft: isLastColumn
                            ? `2px solid ${
                                appState.mode === "dark"
                                  ? "rgba(255,255,255,0.2)"
                                  : `rgba(${gridBorderColor || "226,232,240"})`
                              }`
                            : "none",
                          fontWeight: gridIsBold ? 700 : 500,
                          fontSize: gridFontSize ?? 14,
                          background:
                            dragOverIndex === index
                              ? appState.mode === "dark"
                                ? "#444444"
                                : "#e3f2fd"
                              : appState.mode === "dark"
                              ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)"
                              : gridHeaderBg
                              ? `rgb(${gridHeaderBg})`
                              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                          userSelect: "none",
                          display: "flex",
                          alignItems: "center",
                          cursor: "move",
                          transition: "background-color 0.1s ease",
                          color:
                            appState.mode === "dark"
                              ? "#e0e0e0"
                              : gridHeaderFontColor
                              ? `rgb(${gridHeaderFontColor})`
                              : "#1f2937",
                          position: isFixed ? "sticky" : "relative",
                          left: isFirstColumn ? "0px" : "auto",
                          right: isLastColumn ? "0px" : "auto",
                          zIndex: isFixed ? 110 : 100,
                        }}
                      >
                        <>
                         {
                         column.dataField === "slNo" ? (
                          <>
                            <div className="absolute top-[3px] left-[3px]">
                              <button
                                ref={buttonRef}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openGridMenu();
                                }}
                                className={`flex items-center rounded-full p-2 mr-2 transition-colors ${
                                  appState.mode === "dark"
                                    ? "bg-[#333333] hover:bg-[#444444] text-[#e0e0e0]"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                                }`}
                              >
                                <EllipsisVertical className="w-4 h-4" />
                              </button>
                            </div>
                            {column.caption}
                          </>
                        ):column.dataField === "actionCol"?
                        (
                        <>
                        <span style={{ marginRight: "8px", opacity: 0.6 }}>
                              
                            </span>
                            {column.caption}
                        </>

                        )
                        : (
                         <>
                          <span style={{ marginRight: "8px", opacity: 0.6 }}>
                              ⋮⋮
                            </span>
                            {column.caption}
                          <div
                            data-resize-handle
                            data-field={column.dataField}
                            style={{
                              position: "absolute",
                              right: "-2px",
                              top: 0,
                              bottom: 0,
                              width: "7px",
                              marginTop:"3px",
                              marginBottom:"3px",
                              cursor: "col-resize",
                              backgroundColor: "transparent",
                              transition: "background-color 0.1s ease-out",
                              zIndex: 10,
                              // backgroundColor: hoverFieldHeader.hovered && hoverFieldHeader.column === column.dataField ? `rgb(${gridHeaderFontColor})` :"transparent", 
                              // The above will show the resizer when hovering column header
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.backgroundColor =
                                appState.mode === "dark"
                                  ? `rgb(${gridHeaderFontColor})`
                                  : `rgb(${gridHeaderFontColor})`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor =
                                "transparent";
                            }}
                          />
                         </>
                        )
                      }
                        </>
                      </div>
                    );
                  })}
                </div>
              )}
              <div
                style={{
                  position: "relative",
                  height: `${totalHeight}px`,
                }}
              >
                {
                !formState.transactionLoading &&
                (!columns ||
                columns.length === 0 ||
                !formState.transaction.details ||
                formState.transaction.details.length === 0) ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "48px 24px",
                      textAlign: "center",
                      color: "var(--text-muted, #6b7280)",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-muted, #f3f4f6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <ArchiveX
                        size={32}
                        strokeWidth={1.5}
                        style={{ color: "var(--text-muted, #9ca3af)" }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "var(--text-primary, #374151)",
                        margin: 0,
                      }}
                    >
                      {t("No items added yet")}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted, #6b7280)",
                        margin: 0,
                      }}
                    >
                      {t("Tap the + button to add your first item")}
                    </p>
                  </div>
                ) : (
                  visibleItems.map(({ index, top }) => (
                    <VirtualRow
                      t={t}
                      isMobileGridRow={isMobile}
                      zIndexController={zIndexController}
                      appState={appState}
                      applicationSettings={applicationSettings}
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
                      onKeyDown={(value, e, column, rowIndex) => {
                        onKeyDown(value, e, column, rowIndex);
                      }}
                      onChange={(value, column, rowIndex) => {
                        onChange(value, column, rowIndex);
                      }}
                      handlRowKeyDown={handlRowKeyDown}
                      searchByCodeAndName={
                        formState.userConfig?.enableItemCodeSearchInNameColumn
                      }
                      advancedProductSearching={false}
                      transactionType={
                        transactionType ?? formState.transactionType
                      }
                      blockUnitOnDecimalPoint={
                        applicationSettings.inventorySettings
                          .blockUnitOnDecimalPoint
                      }
                      focusCell={focusCell}
                      nextCellFind={nextCellFind}
                      currentCell={currentCell}
                      setCurrentCell={_setCurrentCell}
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
                  display: isMobile ? "none" : "flex",
                  width: `${totalGridWidth}px`,
                  minWidth: `${totalGridWidth}px`,
                  backgroundColor:
                    appState.mode === "dark"
                      ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)"
                      : gridFooterBg
                      ? `rgb(${gridFooterBg})`
                      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                  borderTop: `0.1px solid ${
                    appState.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : `rgba(${gridBorderColor || "226,232,240"}, 0.3)`
                  }`,
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
                  const showBorder =
                    formState.userConfig?.showColumnBorder ?? true;
                  const value =
                    formState.summary?.[
                      column.dataField as keyof SummaryItems
                    ] ?? "";

                  const final =
                    column.dataType === "number" && value !== ""
                      ? (() => {
                          const num = parseFloat(value as any);
                          console.log("Raw value:", value);
                          console.log("Parsed num:", num);

                          if (isNaN(num)) {
                            console.log("Result: empty string (NaN case)");
                            return "";
                          }

                          const rounded = getFormattedValue(
                            num,
                            false,
                            applicationSettings.mainSettings.decimalPoints ?? 2
                          );
                          console.log("Rounded:", rounded);

                          return rounded;
                        })()
                      : value;

                  console.log("Final:", final);
                  return (
                    <div
                      key={`footer-${column.dataField}`}
                      style={{
                        width: `${
                          columnWidths?.find((x) => x.field == column.dataField)
                            ?.width
                        }px`,
                        minWidth: `${
                          columnWidths?.find((x) => x.field == column.dataField)
                            ?.width
                        }px`,
                        maxWidth: `${
                          columnWidths?.find((x) => x.field == column.dataField)
                            ?.width
                        }px`,
                        padding: "8px 12px",
                        borderRight: isFirstColumn
                          ? `2px solid ${
                              appState.mode === "dark"
                                ? "rgba(255,255,255,0.2)"
                                : `rgba(${gridBorderColor || "226,232,240"})`
                            }`
                          : isLastColumn
                          ? "none"
                          : showBorder
                          ? `0.2px solid ${
                              appState.mode === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : `rgba(${
                                    gridBorderColor || "226,232,240"
                                  }, 0.8)`
                            }`
                          : "none",
                        borderLeft: isLastColumn
                          ? `2px solid ${
                              appState.mode === "dark"
                                ? "rgba(255,255,255,0.2)"
                                : `rgba(${gridBorderColor || "226,232,240"})`
                            }`
                          : "none",
                        fontSize: `${gridFontSize}px`,
                        fontWeight: gridIsBold ? "bold" : "600",
                        textAlign: column.alignment,
                        background:
                          appState.mode === "dark"
                            ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 30%, #222222 70%, #2d2d2d 100%)"
                            : gridFooterBg
                            ? `rgb(${gridFooterBg})`
                            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%)",
                        color:
                          appState.mode === "dark"
                            ? "#e0e0e0"
                            : gridFooterFontColor
                            ? `rgb(${gridFooterFontColor})`
                            : "#1f2937",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        alignItems: "center",
                        position: isFixed ? "sticky" : "relative",
                        left: isFirstColumn ? "0px" : "auto",
                        right: isLastColumn ? "0px" : "auto",
                        display: "flex",
                        justifyContent:
                          isFirstColumn || isLastColumn
                            ? "center"
                            : column.alignment === "center"
                            ? "center"
                            : column.alignment === "right"
                            ? "flex-end"
                            : "flex-start",
                        zIndex: isFixed ? 110 : 100,
                      }}
                    >
                      {final}
                    </div>
                  );
                })}
              </div>
            </div>
          </ERPScrollArea>
        </div>
      {formState.itemPopup?.isOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div
                 className={`relative w-full h-full overflow-y-auto ${
                   appState.mode === "dark"
                     ? "bg-[#2d2d2d] text-[#e0e0e0]"
                     : "bg-white text-gray-800"
                 }`}
               >
                 {/* Header */}
                 <header className="flex items-center px-4 py-0 bg-white shadow-sm sticky top-0 z-10 dark:bg-[#2d2d2d]">
                   <button
                     onClick={() =>
                       dispatch(
                         formStateHandleFieldChange({
                           fields: { row: undefined, itemPopup: { isOpen: false } },
                         })
                       )
                     }
                     className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <StepBack className="w-3 h-3" />
                   </button>
                   <h6 className="text-sm font-semibold">Add Items to Sale</h6>
                   <div className="ml-auto"> 
                     <GridPreferenceChooser
                       initialPreferences={preferences}
                       ref={preferenceChooserRef}
                       gridId={gridId}
                       columns={
                         (formState.gridColumns ?? []) as DevGridColumn[]
                       }
                       onApplyPreferences={onApplyPreferences}
                       showChooserName={true}
                       isMobile={true}
                     />
                   </div>
                 </header>
         
                 {/* Content */}
                 <main className="flex-1 overflow-auto px-4 py-4 pb-32">
                   {/* Item name */}
                   <div className="mb-2">
                     <label className="block text-xs font-medium text-blue-600 mb-1 dark:text-blue-400">
                       Item Name
                     </label>
                     <div className="border-2 border-blue-500 rounded-lg overflow-hidden">
                       <GridCell
                         isMobile_={true}
                         column={formState.gridColumns.find((x) => x?.dataField == "product") as ColumnModel}
                         item={formState.row ?? initialTransactionDetailData}
                         index={formState.itemPopup?.index ?? 0}
                         currentCell={currentCell}
                         setCurrentCell={setCurrentCell}
                         formState={formState}
                         appState={appState}
                         gridFontSize={gridFontSize}
                         gridIsBold={gridIsBold}
                         rowHeight={rowHeight}
                         gridBorderColor={gridBorderColor}
                         isFirstColumn={false}
                         isLastColumn={false}
                         showBorder={false}
                         columnWidths={columnWidths}
                         onChange={onChange}
                         onKeyDown={onKeyDown}
                         handlRowKeyDown={handlRowKeyDown}
                         handleFocus={handleFocus}
                         handleBlur={handleBlur}
                         gridId={gridId}
                         details={formState.transaction.details}
                         blockUnitOnDecimalPoint={
                           applicationSettings?.inventorySettings?.blockUnitOnDecimalPoint
                         }
                         applicationSettings={applicationSettings}
                         useInSearch={formState.userConfig?.useInSearch}
                         searchByCodeAndName={
                           formState.userConfig?.enableItemCodeSearchInNameColumn
                         }
                         advancedProductSearching={
                           applicationSettings?.productsSettings?.advancedProductSearching
                         }
                         transactionType={transactionType}
                         zIndexController={55}
                         nextCellFind={nextCellFind}
                       />
                     </div>
                   </div>
         
                   {/* Row: Quantity | Unit */}
                   <div className="grid grid-cols-2 gap-3 mb-2">
                     <div>
                       <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-gray-400">
                         Quantity
                       </label>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                         <GridCell
                           isMobile_={true}
                           column={formState.gridColumns.find((x) => x.dataField == "qty") as ColumnModel}
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={(value: string, column: any, rowIndex: number) => {debugger; onChange(value, column, rowIndex);}}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                       </div>
                     </div>
                     
                     <div>
                       <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-gray-400">
                         Unit
                       </label>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                         <GridCell
                           isMobile_={true}
                           column={formState.gridColumns.find((x) => x.dataField == "unit") as ColumnModel}
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={onChange}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                       </div>
                     </div>
                   </div>
         
                   {/* Row: Rate | Tax Mode */}
                   <div className="grid grid-cols-2 gap-3 mb-3">
                     <div>
                       <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-gray-400">
                         Rate (Price/Unit)
                       </label>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                         <GridCell
                           isMobile_={true}
                           column={formState.gridColumns.find((x) => x.dataField == "unitPrice") as ColumnModel} 
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={onChange}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                       </div>
                       
                     </div>
                     {/* <div>
                       <label className="block text-xs font-medium text-gray-600 mb-2 dark:text-gray-400">
                         &nbsp;
                       </label>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                         <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                           Without Tax
                         </div>
                       </div>
                     </div> */}
                   </div>
                   
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 dark:text-gray-400">
                         barCode
                       </label>
                   <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600 flex items-center">
                    {/* GridCell field */}
                    <div className="flex-1">
                      <GridCell
                        // inputRef={barcodeInputRef}
                        isMobile_={true}
                        column={formState.gridColumns.find((x) => x.dataField == "barCode") as ColumnModel}
                        item={formState.row ?? initialTransactionDetailData}
                        index={formState.itemPopup?.index ?? 0}
                        currentCell={currentCell}
                        setCurrentCell={setCurrentCell}
                        formState={formState}
                        appState={appState}
                        gridFontSize={gridFontSize}
                        gridIsBold={gridIsBold}
                        rowHeight={rowHeight}
                        gridBorderColor={gridBorderColor}
                        isFirstColumn={false}
                        isLastColumn={false}
                        showBorder={false}
                        columnWidths={columnWidths}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        handlRowKeyDown={handlRowKeyDown}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        gridId={gridId}
                        zIndexController={55}
                        details={formState.transaction.details}
                        blockUnitOnDecimalPoint={false}
                        applicationSettings={undefined}
                        nextCellFind={() => null}
                      />
                    </div>
                    {/* Barcode Scanner Button - Uses unified barcode scanner */}
                    {/* {Capacitor.isNativePlatform() && ( */}
                    <div className="px-3 py-2 bg-orange-100 dark:bg-orange-800/30 border-l border-orange-300 text-orange-600 dark:text-orange-400 font-medium"
                                            style={{ height: rowHeight , display: "flex", justifyContent: "center",  alignItems: "center"  }}
                                          >
                    <button
                    type="button"
                    onClick={() => {
                      setBarcodeTargetRow(formState.itemPopup?.index ?? -1);
                      setShowBarcodeScanner(true);
                    }}
                    title="Scan barcode"
                    className="
                      px-2
                      flex items-center justify-center
                    "
                  >
                    <ScanBarcode className="w-5 h-5 text-black dark:text-white" />
                  </button>
                  </div>
                  {/* )}  */}

                  </div>
                  </div>
                  {/* Totals & Taxes Card */}
                   <div className="bg-white dark:bg-[#2d2d2d] rounded-lg p-4 border-t border-gray-200 dark:border-gray-700">
                     <h6 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2">
                       Totals &amp; Taxes
                     </h6>
                     
                     {/* Subtotal */}
                     <div className="flex justify-between items-center mb-2">
                       <div className="text-sm text-gray-600 dark:text-gray-400">
                         Subtotal <span className="text-xs">(Rate × Qty)</span>
                       </div>
                       <div className="text-base font-semibold text-gray-800 dark:text-gray-200  flex items-center">
                         <div className="px-3 py-2  font-medium">
                           ₹
                         </div>
                         <div className="flex-1">
                         <GridCell
                           isMobile_={true}                
                           column={formState.gridColumns.find((x) => x.dataField == "total") as ColumnModel}
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={onChange}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                       </div>
                       </div>
                     </div>
                     
                     {/* Discount row */}
                     <div className="grid grid-cols-[80px_1fr_1fr] gap-2 items-center mb-2">
                       <div className="text-sm text-gray-600 dark:text-gray-400">
                         {t("discount")}
                       </div>
                       <div className="border border-orange-300 rounded-lg overflow-hidden bg-orange-50 dark:bg-orange-900/20 flex items-center">
                         <div className="flex-1">
                           <GridCell
                             isMobile_={true}
                             column={formState.gridColumns.find((x) => x.dataField == "discPerc") as ColumnModel}
                             item={formState.row ?? initialTransactionDetailData}
                             index={formState.itemPopup?.index ?? 0}
                             currentCell={currentCell}
                             setCurrentCell={setCurrentCell}
                             formState={formState}
                             appState={appState}
                             gridFontSize={gridFontSize}
                             gridIsBold={gridIsBold}
                             rowHeight={rowHeight}
                             gridBorderColor={gridBorderColor}
                             isFirstColumn={false}
                             isLastColumn={false}
                             showBorder={false}
                             columnWidths={columnWidths}
                             onChange={onChange}
                             onKeyDown={onKeyDown}
                             handlRowKeyDown={handlRowKeyDown}
                             handleFocus={handleFocus}
                             handleBlur={handleBlur}
                             gridId={gridId}
                             zIndexController={55}
                             details={formState.transaction.details} 
                             blockUnitOnDecimalPoint={false} 
                             applicationSettings={undefined} 
                             nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                               throw new Error("Function not implemented.");
                             }}
                           />
                         </div>
                         <div className="px-3 py-2 bg-orange-100 dark:bg-orange-800/30 border-l border-orange-300 text-orange-600 dark:text-orange-400 font-medium"
                          style={{ height: rowHeight , display: "flex", justifyContent: "center",  alignItems: "center"  }}
                         >
                           %
                         </div>
                       </div>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600 flex items-center">
                         <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium" 
                          style={{ height: rowHeight , display: "flex", justifyContent: "center",  alignItems: "center"  }}
                         >
                           ₹
                         </div>
                         <div className="flex-1">
                           <GridCell
                             isMobile_={true}
                             column={formState.gridColumns.find((x) => x.dataField == "discount") as ColumnModel}
                             item={formState.row ?? initialTransactionDetailData}
                             index={formState.itemPopup?.index ?? 0}
                             currentCell={currentCell}
                             setCurrentCell={setCurrentCell}
                             formState={formState}
                             appState={appState}
                             gridFontSize={gridFontSize}
                             gridIsBold={gridIsBold}
                             rowHeight={rowHeight}
                             gridBorderColor={gridBorderColor}
                             isFirstColumn={false}
                             isLastColumn={false}
                             showBorder={false}
                             columnWidths={columnWidths}
                             onChange={onChange}
                             onKeyDown={onKeyDown}
                             handlRowKeyDown={handlRowKeyDown}
                             handleFocus={handleFocus}
                             handleBlur={handleBlur}
                             gridId={gridId}
                             zIndexController={55}
                             details={formState.transaction.details} 
                             blockUnitOnDecimalPoint={false} 
                             applicationSettings={undefined} 
                             nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                               throw new Error("Function not implemented.");
                             }}
                           />
                         </div>
                       </div>
                     </div>
                     
                     {/* Tax row */}
                     <div className="grid grid-cols-[80px_1fr_1fr] gap-2 items-center mb-2">
                       <div className="text-sm text-gray-600 dark:text-gray-400">
                         Tax %
                       </div>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                         <GridCell
                           isMobile_={true}
                           column={formState.gridColumns.find((x) => x.dataField == "vatPerc") as ColumnModel}
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={onChange}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                       </div>
                       <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600 flex items-center">
                         <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium"
                          style={{ height: rowHeight , display: "flex", justifyContent: "center",  alignItems: "center"  }}
                         >
                           ₹
                         </div>
                         <div className="flex-1">
                         <GridCell
                           isMobile_={true}
                           column={formState.gridColumns.find((x) => x.dataField == "vatAmount") as ColumnModel}
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={onChange}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                        </div>
                       </div>
                     </div>
                     
                     <div className="text-center mb-[15px]">
                       <button
                         aria-label="showMore"
                         onClick={() => setShowMore(prev => !prev)}
                         className="p-2 bg-slate-600 hover:bg-slate-900 rounded-full"
                       >
                         {showMore ? <ChevronUp className="text-warmGray-100" size={20} /> : <ChevronDown className="text-warmGray-100" size={20} />}
                       </button>
                     </div>
                     
                     {showMore && (
                       <div className="mt-4">
                         {formState.gridColumns.filter(x => x && x.visible == true && !["slNo", "action", ...hidColumns].includes(x.dataField??""))?.map((col, index) => (
                           <div key={generateUniqueKey()} className="grid grid-cols-2 gap-3 items-center mb-3">
                             <div className="text-sm text-gray-600 dark:text-gray-400">
                               {col.caption}
                             </div>
                             <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                               <GridCell
                                 isMobile_={true}
                                //  columnIndex={index}

                                 column={col as ColumnModel}
                                 item={formState.row ?? initialTransactionDetailData}
                                 index={formState.itemPopup?.index ?? 0}
                                 currentCell={currentCell}
                                 setCurrentCell={setCurrentCell}
                                 formState={formState}
                                 appState={appState}
                                 gridFontSize={gridFontSize}
                                 gridIsBold={gridIsBold}
                                 rowHeight={rowHeight}
                                 gridBorderColor={gridBorderColor}
                                 isFirstColumn={false}
                                 isLastColumn={false}
                                 showBorder={false}
                                 columnWidths={columnWidths}
                                 onChange={onChange}
                                 onKeyDown={onKeyDown}
                                 handlRowKeyDown={handlRowKeyDown}
                                 handleFocus={handleFocus}
                                 handleBlur={handleBlur}
                                 gridId={gridId}
                                 zIndexController={55}
                                 details={formState.transaction.details} 
                                 blockUnitOnDecimalPoint={false} 
                                 applicationSettings={undefined} 
                                 nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                                   throw new Error("Function not implemented.");
                                 }}
                               />
                             </div>                  
                           </div>
                         ))}
                       </div>
                     )}
                     
                     {/* Total Amount Section */}
                     <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                       <div className="text-base font-bold text-gray-800 dark:text-gray-200">
                         Total Amount:
                       </div>
                       <div className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                        {/* <div className="text-base font-semibold text-gray-800 dark:text-gray-200"> */}
                        <div className="px-3 py-2  font-medium">
                           ₹
                         </div>
                         <div className="flex-1">
                         <GridCell
                           isMobile_={true}
                           column={formState.gridColumns.find((x) => x.dataField == "total") as ColumnModel}
                           item={formState.row ?? initialTransactionDetailData}
                           index={formState.itemPopup?.index ?? 0}
                           currentCell={currentCell}
                           setCurrentCell={setCurrentCell}
                           formState={formState}
                           appState={appState}
                           gridFontSize={gridFontSize}
                           gridIsBold={gridIsBold}
                           rowHeight={rowHeight}
                           gridBorderColor={gridBorderColor}
                           isFirstColumn={false}
                           isLastColumn={false}
                           showBorder={false}
                           columnWidths={columnWidths}
                           onChange={onChange}
                           onKeyDown={onKeyDown}
                           handlRowKeyDown={handlRowKeyDown}
                           handleFocus={handleFocus}
                           handleBlur={handleBlur}
                           gridId={gridId}
                           zIndexController={55}
                           details={formState.transaction.details} 
                           blockUnitOnDecimalPoint={false} 
                           applicationSettings={undefined} 
                           nextCellFind={function (rowIndex: number, column: string, excludedColumns?: (keyof TransactionDetail)[]): { column: string; rowIndex: number; } | null {
                             throw new Error("Function not implemented.");
                           }}
                         />
                       </div>
                       </div>
                     </div>
                   </div>
                 </main>
         
                 {/* Bottom action bar */}
                 <div className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-[#2d2d2d] border-t border-gray-200 dark:border-gray-700 shadow-lg z-[60]">
                   <div className="flex gap-0">
                     <button
                       className="flex-1 py-4 text-center text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                       onClick={(e: any) =>{
                        debugger;
                        if(!formState.row) return;
                        onSaveItem && onSaveItem(formState.row,"SaveAndNew")
                       }}
                     >
                       Save & New
                     </button>
                     <button
                       className="flex-1 py-4 text-center bg-red-600 text-white text-base font-medium hover:bg-red-700"
                       onClick={(e: any) =>{
                        debugger;
                        if(!formState.row) return;
                        onSaveItem && onSaveItem(formState.row,"Save")
                       }}
                     >
                       Save
                     </button>
                   </div>
                 </div>
               </div>
             </div>,
             document.body
        )}
      </div>
    </>
    );
  }
);
export default UltraFastReorderableVirtualTableGrid;
