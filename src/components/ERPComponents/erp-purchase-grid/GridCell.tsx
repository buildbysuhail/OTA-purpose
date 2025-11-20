import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ColumnModel, TransactionDetail, CurrentCell } from "../../../pages/inventory/transactions/transaction-types";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import ERPProductSearch from "../erp-searchbox";
import ERPDataCombobox from "../erp-data-combobox";
import { Info, Trash2 } from "lucide-react";
import moment from "moment";
import { generateUniqueKey, isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { formStateHandleFieldChange } from "../../../pages/inventory/transactions/reducer";
import Urls from "../../../redux/urls";
import { AppState } from "../../../redux/slices/app/types";
import useDebounce from "../../../pages/inventory/transactions/purchase/use-debounce";

interface GridCellProps {
  column: ColumnModel;
  item: TransactionDetail;
  index: number;
  currentCell?: CurrentCell;
  setCurrentCell: React.Dispatch<React.SetStateAction<CurrentCell | undefined>>;
  formState: any;
  appState: AppState;
  gridFontSize: number;
  gridIsBold: boolean;
  rowHeight: number;
  gridBorderColor?: string;
  isFirstColumn: boolean;
  isLastColumn: boolean;
  showBorder: boolean;
  columnWidths: { width: number; field: string }[];
  onChange: (value: any, column: keyof TransactionDetail, rowIndex: number) => void;
  onKeyDown: (value: any, e: React.KeyboardEvent<HTMLElement>, column: keyof TransactionDetail, rowIndex: number) => void;
  handlRowKeyDown: (
    value: any,
    e: React.KeyboardEvent<HTMLElement>,
    column: ColumnModel,
    rowIndex: number,
    details: TransactionDetail[]
  ) => void;
  handleFocus?: (field: string) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  gridId: string;
  details: TransactionDetail[];
  blockUnitOnDecimalPoint: boolean;
  applicationSettings: any;
  useInSearch?: boolean;
  searchByCodeAndName?: boolean;
  advancedProductSearching?: boolean;
  transactionType?: string;
  zIndexController?: number;
  nextCellFind: (
    rowIndex: number,
    column: string,
    excludedColumns?: (keyof TransactionDetail)[]
  ) => { column: string; rowIndex: number } | null;
}

const EditableCell: React.FC<{
  appState: AppState;
  type: "any" | "cb" | "btn" | "chk";
  productId: number;
  onChange: (value: any, column: keyof TransactionDetail, rowIndex: number) => void;
  blockUnitOnDecimalPoint: boolean;
  decimalLimit: number;
  rowIndex: number;
  column: ColumnModel;
  value: string | number;
  options: any[];
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  gridId: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, column: ColumnModel, rowIndex: number) => void;
  gridFontSize: number;
  gridIsBold: boolean;
  formState: any;
  rowHeight: number;
}> = React.memo(({
  appState,
  type,
  productId,
  onChange,
  blockUnitOnDecimalPoint,
  decimalLimit,
  rowIndex,
  column,
  value,
  options,
  onFocus,
  onBlur,
  gridId,
  onKeyDown,
  gridFontSize,
  gridIsBold,
  formState,
  rowHeight,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { round } = useNumberFormat();
  const [localValue, setLocalValue] = useState<string>(value?.toString() || "");

  const validateNumberInput = useCallback(
    (value: string, _blockUnitOnDecimalPoint: boolean) => {
      if (value === "") return true;
      const parts = value.split(".");
      if (parts.length > 2) return false;
      if (parts[0] && !/^-?\d*$/.test(parts[0])) return false;
      if (parts.length === 2) {
        if (_blockUnitOnDecimalPoint) {
          return false;
        }
        if (parts[1].length > decimalLimit) return false;
        if (!/^\d*$/.test(parts[1])) return false;
      }
      return true;
    },
    [decimalLimit]
  );

  const debounceCellChange = useDebounce(
    (value: any, key: keyof TransactionDetail, index: number, decimalPoint?: number) => {
      let final = value;
      if (decimalPoint && column.dataType === "number") {
        final = value !== ""
          ? (() => {
              const num = parseFloat(value as any);
              if (isNaN(num)) return "";
              return round(num, decimalPoint);
            })()
          : value;
      }
      onChange(final, key, index);
    },
    300
  );

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    let inputValue = e.currentTarget.value;

    // Handle decimal input formatting
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

    // Validate the input
    if (
      column.dataType === "number" &&
      !validateNumberInput(
        inputValue,
        column.dataField === "qty" && blockUnitOnDecimalPoint
      )
    ) {
      e.currentTarget.value = localValue;
      return;
    }

    setLocalValue(inputValue);
    debounceCellChange(
      inputValue,
      column.dataField as keyof TransactionDetail,
      rowIndex,
      column.decimalPoint
    );
  }, [localValue, column, blockUnitOnDecimalPoint, debounceCellChange, rowIndex, validateNumberInput]);

  const handleFocus = useCallback(() => {
    onFocus();
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [onFocus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") return;
    onKeyDown(e, column, rowIndex);
  }, [onKeyDown, column, rowIndex]);

  const cellStyle = useMemo(() => ({
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
  }), [rowHeight, gridFontSize, gridIsBold, column.alignment]);

  return type === "cb" ? (
    <ERPDataCombobox
      options={options}
      onChange={(e) => onChange(e.value, column.dataField as keyof TransactionDetail, rowIndex)}
      id={`${gridId}_${column.dataField}_${rowIndex}`}
      noLabel
      enableClearOption={false}
      className="!w-full !h-full !bg-inherit !p-0 !space-y-0"
      disableEnterNavigation
      value={value}
      label={column.dataField}
      field={{
        id: `${gridId}_${column.dataField}_${rowIndex}-cb`,
        valueKey: column?.field?.valueKey || "value",
        labelKey: column?.field?.labelKey || "label",
      }}
      noBorder
      onKeyDown={handleKeyDown}
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
        backgroundColor: "transparent",
        color: appState.mode === "dark" ? "#e0e0e0" : "#000000",
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
  );
});

const GridCell: React.FC<GridCellProps> = React.memo(({
  column,
  item,
  index,
  currentCell,
  setCurrentCell,
  formState,
  appState,
  gridFontSize,
  gridIsBold,
  rowHeight,
  gridBorderColor,
  isFirstColumn,
  isLastColumn,
  showBorder,
  columnWidths,
  onChange,
  onKeyDown,
  handlRowKeyDown,
  handleFocus,
  handleBlur,
  gridId,
  details,
  blockUnitOnDecimalPoint,
  applicationSettings,
  useInSearch,
  searchByCodeAndName,
  advancedProductSearching,
  transactionType,
  zIndexController,
  nextCellFind,
}) => {
  const { getFormattedValue } = useNumberFormat();
  const dispatch = useAppDispatch();
  const cellId = `${gridId}_${column.dataField}_${index}`;
  const isFixed = isFirstColumn || isLastColumn;
  const cellValue = item[column.dataField as keyof TransactionDetail];
  const productId = item.productID;

  const borderColor = useMemo(() =>
    (column.readOnly || column.allowEditing === false || formState.formElements.pnlMasters?.disabled !== true) &&
    currentCell?.column === column.dataField &&
    currentCell?.rowIndex === index
      ? appState.mode === "dark"
        ? "#444444"
        : formState.userConfig?.inputBoxStyle?.focusBgColor
          ? `rgb(${formState.userConfig?.inputBoxStyle?.focusBgColor})`
          : "#e3f2fd"
      : undefined,
    [column, currentCell, appState.mode, formState]
  );

  const getCellContentStyle = useCallback((col: ColumnModel) => ({
    fontSize: `${gridFontSize}px`,
    fontWeight: gridIsBold ? "bold" : "normal",
    height: `${rowHeight}px`,
    minHeight: `${rowHeight}px`,
    maxHeight: `${rowHeight}px`,
    lineHeight: "normal",
    display: "flex",
    alignItems: "center",
    justifyContent:
      col.alignment === "left"
        ? "flex-start"
        : col.alignment === "right"
          ? "flex-end"
          : "center",
    textAlign: col.alignment || "center",
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
  }), [gridFontSize, gridIsBold, rowHeight, appState.mode]);

  const handleInfoClick = useCallback((idx: number) => {
    dispatch(
      formStateHandleFieldChange({
        fields: {
          showProductInformation: { show: true, index: idx },
        },
      })
    );
  }, [dispatch]);

  const renderCellValue = useCallback(() => {
    if (formState.transactionLoading) {
      return (
        <div className="parent-selector-loading" style={{ width: "100%", margin: "3px 0", height: `${rowHeight}px` }}>
          <div className="card_description loading" style={{ width: `${Math.floor(Math.random() * 50) + 40}%`, height: `${Math.min(rowHeight - 6, 16)}px` }} />
        </div>
      );
    }

    if (column.dataField === "slNo") {
      return <div style={getCellContentStyle(column)} id={cellId}>{index + 1}</div>;
    }

    if (column.dataType === "chk") {
      return (
        <input
          disabled={formState.formElements.pnlMasters?.disabled}
          type="checkbox"
          checked={cellValue === true}
          onChange={(e) => onChange(e.target.checked, column.dataField as keyof TransactionDetail, index)}
        />
      );
    }

    // if (column.dataType === "btn") {
    //   return (
    //     <button
    //       disabled={formState.formElements.pnlMasters?.disabled}
    //       onClick={(e: React.MouseEvent<HTMLElement>) =>
    //         handlRowKeyDown(cellValue, e as unknown as React.KeyboardEvent<HTMLElement>, column, index, details)}
    //       className={`px-2 py-1 border rounded shadow-sm hover:shadow text-xs transition-all ${
    //         appState.mode === "dark" ? "bg-[#444444] text-[#e0e0e0] border-[#555555] hover:bg-[#555555]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
    //       }`}
    //       aria-label="Action button"
    //     >
    //       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 12 12">
    //         <rect x="1" y="3" width="10" height="6" rx="1" strokeWidth="1.5" />
    //       </svg>
    //     </button>
    //   );
    // }
    if (column.dataType === "btn") {
    return (
        <button
        disabled={formState.formElements.pnlMasters?.disabled}
        onClick={() =>
            handlRowKeyDown(
            cellValue,
            { key: "Enter" } as React.KeyboardEvent<HTMLElement>,
            column,
            index,
            details
            )
        }
        className={`px-2 py-1 border rounded shadow-sm hover:shadow text-xs transition-all ${
            appState.mode === "dark" ? "bg-[#444444] text-[#e0e0e0] border-[#555555] hover:bg-[#555555]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
        }`}
        aria-label="Action button"
        >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 12 12">
            <rect x="1" y="3" width="10" height="6" rx="1" strokeWidth="1.5" />
        </svg>
        </button>
    );
    }


    // if (column.dataField === "actionCol") {
    //   return (
    //     <div className="flex items-center justify-center gap-1" style={{ border: `solid 1px ${borderColor}` }}>
    //       <button
    //         onClick={() => handleInfoClick(index)}
    //         className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${
    //           appState.mode === "dark" ? "hover:bg-blue-900 hover:border-blue-700" : "hover:bg-blue-50 hover:border-blue-200"
    //         }`}
    //       >
    //         <Info className={`w-4 h-4 transition-all duration-300 ${
    //           appState.mode === "dark" ? "text-blue-400 group-hover:text-blue-300" : "text-blue-600 group-hover:text-blue-700"
    //         }`} />
    //       </button>
    //       <button
    //         disabled={formState.formElements.pnlMasters?.disabled}
    //         onClick={(e: React.MouseEvent<HTMLElement>) =>
    //           onKeyDown(item.slNo, e as unknown as React.KeyboardEvent<HTMLElement>, "actionCol", index)}
    //         className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${
    //           appState.mode === "dark" ? "hover:bg-red-900 hover:border-red-700" : "hover:bg-red-50 hover:border-red-200"
    //         }`}
    //       >
    //         <Trash2 className={`w-4 h-4 transition-all duration-300 ${
    //           appState.mode === "dark" ? "text-red-400 group-hover:text-red-300" : "text-red-600 group-hover:text-red-700"
    //         }`} />
    //       </button>
    //     </div>
    //   );
    // }
        if (column.dataField === "actionCol") {
        return (
            <div className="flex items-center justify-center gap-1" style={{ border: `solid 1px ${borderColor}` }}>
            <button
                onClick={() => handleInfoClick(index)}
                className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${
                appState.mode === "dark" ? "hover:bg-blue-900 hover:border-blue-700" : "hover:bg-blue-50 hover:border-blue-200"
                }`}
            >
                <Info className={`w-4 h-4 transition-all duration-300 ${
                appState.mode === "dark" ? "text-blue-400 group-hover:text-blue-300" : "text-blue-600 group-hover:text-blue-700"
                }`} />
            </button>
            <button
                disabled={formState.formElements.pnlMasters?.disabled}
                onClick={() =>
                onKeyDown(
                    item.slNo,
                    { key: "Enter" } as React.KeyboardEvent<HTMLElement>,
                    "actionCol",
                    index
                )
                }
                className={`group relative flex items-center justify-center w-7 h-7 transition-all duration-500 ease-out hover:rounded-full hover:scale-105 hover:shadow-lg hover:border ${
                appState.mode === "dark" ? "hover:bg-red-900 hover:border-red-700" : "hover:bg-red-50 hover:border-red-200"
                }`}
            >
                <Trash2 className={`w-4 h-4 transition-all duration-300 ${
                appState.mode === "dark" ? "text-red-400 group-hover:text-red-300" : "text-red-600 group-hover:text-red-700"
                }`} />
            </button>
            </div>
        );
        }


    if (
      (column.dataField === "product" || column.dataField === "pCode" || column.dataField === "barCode") &&
      !column.readOnly &&
      formState.formElements.pnlMasters?.disabled !== true &&
      currentCell?.column === column.dataField &&
      currentCell?.rowIndex === index
    ) {
      return (
        <ERPProductSearch
          showInputSymbol={true}
          customStyle={formState.userConfig?.inputBoxStyle}
          appState={appState}
          zIndexController={zIndexController}
          textAlign={column.alignment === "right" ? "right" : "left"}
          rowIndex={index}
          id={cellId}
          inputId={`${gridId}_${column.dataField}_${index}`}
          searchType={applicationSettings?.productsSettings?.usePopupWindowForItemSearch ? "modal" : "grid"}
          noLabel={true}
          showCheckBox={false}
          contextClassNametwo={`!text-sm !px-1 !py-0 !border-none !bg-transparent`}
          value={String(cellValue || "")}
          productDataUrl={`${Urls.inv_transaction_base}${transactionType}/products`}
          batchDataUrl={`${Urls.inv_transaction_base}${transactionType}/batches/`}
          className="h-[22px] text-sm"
          onFocus={() => handleFocus?.(column.dataField!)}
          onBlur={handleBlur}
          onKeyDown={(value, e) => handlRowKeyDown(value, e, column, index, details)}
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
            dispatch(formStateHandleFieldChange({ fields: { batchSelectionData: JSON.stringify(res) } }));
          }}
        />
      );
    }

    if (column.dataField === "product" && !column.readOnly) {
      return (
        <div style={{ ...getCellContentStyle(column), border: `solid 1px ${borderColor}` }} id={cellId}
             tabIndex={0} onFocus={() => handleFocus?.(column.dataField!)} onBlur={handleBlur}
             onKeyDown={(e) => handlRowKeyDown(cellValue, e, column, index, details)}>
          {productId > 0 ? String(cellValue || "") : ""}
        </div>
      );
    }

    if (column.dataField === "status") {
      return (
        <div style={{ ...getCellContentStyle(column), justifyContent: "center", border: `solid 1px ${borderColor}` }}
             id={cellId} tabIndex={0}
             className={`inline-flex px-2 py-1 font-medium rounded-full cursor-default ${
               cellValue === "Active" ? appState.mode === "dark" ? "bg-[#2d6a4f] text-[#b7e1cd]" : "bg-[#dcfce7] text-[#166534]" : ""
             } ${
               cellValue === "Inactive" ? appState.mode === "dark" ? "bg-[#7b2e2e] text-[#f4a8a8]" : "bg-[#fee2e2] text-[#991b1b]" : ""
             } ${
               cellValue === "Pending" ? appState.mode === "dark" ? "bg-[#6b4e31] text-[#fce5a8]" : "bg-[#fef9c3] text-[#854d0e]" : ""
             }`}
             onFocus={() => handleFocus?.(column.dataField!)} onBlur={handleBlur}
             onKeyDown={(e) => handlRowKeyDown(cellValue, e, column, index, details)}>
          {productId > 0 ? String(cellValue || "") : ""}
        </div>
      );
    }

    if (column.allowEditing === true && !column.readOnly && formState.formElements.pnlMasters?.disabled !== true &&
        currentCell?.column === column.dataField && currentCell?.rowIndex === index) {
      return (
        <EditableCell
          appState={appState}
          type={column.dataType === "cb" ? "cb" : "any"}
          productId={productId}
          onChange={onChange}
          blockUnitOnDecimalPoint={blockUnitOnDecimalPoint}
          decimalLimit={column.decimalPoint || 2}
          rowIndex={index}
          column={column}
          value={cellValue as string | number}
          options={column.dataField === "unit" ? formState.batchesUnits?.filter((x: any) => x.productBatchID === item.productBatchID) ?? [] :
                   column.dataField === "warranty" ? formState.dataWarranty ?? [] :
                   column.dataField === "brand" ? formState.dataBrands ?? [] : []}
          onFocus={() => handleFocus?.(column.dataField!)}
          onBlur={handleBlur!}
          gridId={gridId}
          onKeyDown={(e) => handlRowKeyDown(cellValue, e, column, index, details)}
          gridFontSize={gridFontSize}
          gridIsBold={gridIsBold}
          formState={formState}
          rowHeight={rowHeight}
        />
      );
    }

    // Default cell rendering
    return (
      <div
        style={currentCell?.column === column.dataField && currentCell?.rowIndex === index ?
          { ...getCellContentStyle(column), border: `solid 3px rgb(${formState.userConfig?.inputBoxStyle?.focusBgColor})`, background: "#fff" } :
          { ...getCellContentStyle(column) }}
        id={cellId}
        tabIndex={0}
        className="px-1 cursor-default"
        onFocus={() => handleFocus?.(column.dataField!)}
        onBlur={handleBlur}
        onKeyDown={(e) => handlRowKeyDown(cellValue ?? "", e, column, index, details)}
      >
        {productId > 0 ?
          (column.decimalPoint ?
            getFormattedValue(cellValue as any, false, column.decimalPoint) :
            (column.dataType === "date" && !isNullOrUndefinedOrEmpty(column.format) ?
              moment(cellValue as any).format(column.format) :
              String(cellValue || ""))) :
          ""}
      </div>
    );
  }, [
    cellValue, column, currentCell, index, productId, formState, appState.mode,
    borderColor, getCellContentStyle, handleFocus, handleBlur, handlRowKeyDown,
    getFormattedValue, gridFontSize, gridIsBold, rowHeight, gridId, details,
    blockUnitOnDecimalPoint, applicationSettings, useInSearch, searchByCodeAndName,
    advancedProductSearching, transactionType, zIndexController, nextCellFind
  ]);

  const cellWidth = useMemo(() =>
    columnWidths?.find((x) => x.field === column.dataField)?.width || 150,
  [columnWidths, column.dataField]);

  return (
    <div
      key={`${column.dataField}`}
      style={{
        width: `${cellWidth}px`,
        minWidth: `${cellWidth}px`,
        maxWidth: `${cellWidth}px`,
        borderRight: isFirstColumn
          ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}`
          : isLastColumn
            ? "none"
            : showBorder
              ? `0.2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.1)" : `rgba(${gridBorderColor || "226,232,240"}, 0.8)`}`
              : "none",
        borderLeft: isLastColumn
          ? `2px solid ${appState.mode === "dark" ? "rgba(255,255,255,0.2)" : `rgba(${gridBorderColor || "226,232,240"})`}`
          : "none",
        fontSize: `${gridFontSize}px`,
        textAlign: column.dataField === "slNo" ? "center" : ["qty"].includes(column.dataField ?? "") ? "right" : "left",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          currentCell?.rowIndex === index && currentCell?.column === column.dataField
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
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setCurrentCell({
          column: column.dataField ?? "",
          data: item,
          rowIndex: index,
        });
      }}
    >
      {renderCellValue()}
    </div>
  );
});

export default GridCell;
