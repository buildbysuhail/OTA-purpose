/**
 * TableSelectionPanel Component
 *
 * Modern React implementation of WinForms frmTableView.cs
 *
 * Features:
 * - Grid layout of table buttons with status colors
 * - Section/location filtering tabs
 * - Seat selection buttons (A-H)
 * - Search by table number
 * - Load pending order from selected table
 * - Responsive design with skeleton loading
 *
 * Color scheme (matching WinForms):
 * - Purple (86, 56, 168): Available table
 * - Red (190, 30, 33): Occupied table (has orders)
 * - Green (36, 150, 100): Occupied + KOT printed (TSI exists)
 * - Dark (36, 30, 33): KOT only (no billing yet)
 */

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTableSelection, SeatLetter } from "../hooks/useTableSelection";
import type { TableInfo, TableViewMode } from "../api";

// ============================================================================
// TYPES
// ============================================================================

interface TableSelectionPanelProps {
  /**
   * Whether the panel is open
   */
  isOpen: boolean;

  /**
   * Callback to close the panel
   */
  onClose: () => void;

  /**
   * Table view mode
   */
  mode?: TableViewMode;

  /**
   * Auto-select seat A (for specific configurations)
   */
  autoSelectSeatA?: boolean;

  /**
   * Callback when table and seat are selected
   */
  onSelect?: (tableNo: string, seatNo: string, tableId: number) => void;

  /**
   * Callback to load pending order
   */
  onLoadOrder?: (tableNo: string, tableId: number) => void;

  /**
   * Callback to view KOTs for a table
   */
  onViewKOT?: (tableNo: string, tableId: number) => void;

  /**
   * Current table number (for highlighting)
   */
  currentTableNo?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Table Button Component
 */
interface TableButtonProps {
  table: TableInfo;
  isSelected: boolean;
  onClick: () => void;
}

const TableButton: React.FC<TableButtonProps> = ({
  table,
  isSelected,
  onClick,
}) => {
  // Determine background color based on status
  const getBackgroundColor = () => {
    switch (table.status) {
      case "available":
        return "bg-[#5638a8]"; // Purple - available
      case "occupied":
        return "bg-[#be1e21]"; // Red - has orders
      case "kot_printed":
        return "bg-[#249664]"; // Green - KOT printed (TSI exists)
      case "reserved":
        return "bg-[#f59e0b]"; // Amber - reserved
      default:
        return "bg-[#5638a8]";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getBackgroundColor()}
        ${isSelected ? "ring-4 ring-white ring-opacity-80 scale-105" : ""}
        w-full aspect-square
        flex flex-col items-center justify-center
        text-white font-medium text-sm
        rounded-lg
        transition-all duration-150
        hover:opacity-90 hover:scale-[1.02]
        active:scale-95
        shadow-md
        min-h-[70px]
      `}
    >
      <span className="font-bold text-base">{table.tableNo}</span>
      {table.waiterName && (
        <span className="text-xs opacity-80 mt-1 truncate max-w-full px-1">
          {table.waiterName}
        </span>
      )}
    </button>
  );
};

/**
 * Seat Button Component
 */
interface SeatButtonProps {
  seat: SeatLetter;
  state: "available" | "occupied" | "disabled";
  isSelected: boolean;
  onClick: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({
  seat,
  state,
  isSelected,
  onClick,
}) => {
  const getStyles = () => {
    if (state === "disabled") {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    if (isSelected) {
      return "bg-primary text-white ring-2 ring-primary ring-offset-2";
    }
    if (state === "occupied") {
      return "bg-[#be1e21] text-white hover:bg-[#a01a1d]";
    }
    return "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100";
  };

  return (
    <button
      onClick={onClick}
      disabled={state === "disabled"}
      className={`
        ${getStyles()}
        w-10 h-10
        flex items-center justify-center
        font-bold text-lg
        rounded-lg
        transition-all duration-150
        ${state !== "disabled" ? "active:scale-95" : ""}
      `}
    >
      {seat}
    </button>
  );
};

/**
 * Section Tab Component
 */
interface SectionTabProps {
  section: string;
  isSelected: boolean;
  onClick: () => void;
}

const SectionTab: React.FC<SectionTabProps> = ({
  section,
  isSelected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2
      text-sm font-medium
      rounded-t-lg
      transition-colors
      ${
        isSelected
          ? "bg-white text-gray-800 border-t-2 border-x border-primary"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }
    `}
  >
    {section || "All"}
  </button>
);

/**
 * Loading Skeleton for Tables
 */
const TableGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-4">
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="aspect-square bg-gray-200 rounded-lg animate-pulse"
      />
    ))}
  </div>
);

/**
 * Status Legend Component
 */
const StatusLegend: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4 justify-center p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#5638a8] rounded" />
        <span className="text-sm text-gray-600">{t("available")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#be1e21] rounded" />
        <span className="text-sm text-gray-600">{t("occupied")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#249664] rounded" />
        <span className="text-sm text-gray-600">{t("kot_printed")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#f59e0b] rounded" />
        <span className="text-sm text-gray-600">{t("reserved")}</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TableSelectionPanel: React.FC<TableSelectionPanelProps> = ({
  isOpen,
  onClose,
  mode = "MarkOccupied",
  autoSelectSeatA = false,
  onSelect,
  onLoadOrder,
  onViewKOT,
  currentTableNo,
}) => {
  const { t } = useTranslation();

  // Use the table selection hook
  const {
    tables,
    sections,
    selectedTable,
    selectedSeat,
    isLoadingTables,
    isLoadingSections,
    isLoadingSeats,
    selectedSection,
    searchQuery,
    filteredTables,
    seatStates,
    selectSection,
    selectTable,
    selectSeat,
    setSearchQuery,
    searchAndSelectTable,
    confirmSelection,
    clearSelection,
    refetchTables,
  } = useTableSelection({
    mode,
    autoSelectSeatA,
    onSelectionComplete: (tableNo, seatNo, tableId) => {
      onSelect?.(tableNo, seatNo, tableId);
      if (autoSelectSeatA) {
        onClose();
      }
    },
    onCancel: onClose,
  });

  // Local state for manual table number input
  const [manualTableNo, setManualTableNo] = useState(currentTableNo || "");

  // Update manual input when selection changes
  useEffect(() => {
    if (selectedTable) {
      setManualTableNo(selectedTable.tableNo);
    }
  }, [selectedTable]);

  // Handle manual table number input
  const handleManualTableChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setManualTableNo(e.target.value);
    },
    []
  );

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    if (selectedTable && selectedSeat) {
      confirmSelection();
      onClose();
    }
  }, [selectedTable, selectedSeat, confirmSelection, onClose]);

  // Handle load order button click
  const handleLoadOrder = useCallback(() => {
    if (selectedTable) {
      onLoadOrder?.(selectedTable.tableNo, selectedTable.tableId);
      onClose();
    }
  }, [selectedTable, onLoadOrder, onClose]);

  // Handle view KOT button click
  const handleViewKOT = useCallback(() => {
    if (selectedTable) {
      onViewKOT?.(selectedTable.tableNo, selectedTable.tableId);
    }
  }, [selectedTable, onViewKOT]);

  // Handle search on Enter key
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        searchAndSelectTable();
      }
    },
    [searchAndSelectTable]
  );

  if (!isOpen) return null;

  // Seat letters to display
  const seatLetters: SeatLetter[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="w-[600px] max-w-[95vw] max-h-[80vh] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          {t("select_table")}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i className="ri-close-line text-2xl" />
        </button>
      </div>

      {/* Search & Manual Input */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={t("search_table")}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={searchAndSelectTable}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <i className="ri-search-2-line" />
          </button>

          <button
            onClick={refetchTables}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            title={t("refresh")}
          >
            <i className="ri-refresh-line" />
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      {!isLoadingSections && sections.length > 0 && (
        <div className="flex gap-1 px-4 pt-2 overflow-x-auto border-b">
          <SectionTab
            section=""
            isSelected={selectedSection === ""}
            onClick={() => selectSection("")}
          />
          {sections.map((section) => (
            <SectionTab
              key={section.location}
              section={section.location}
              isSelected={selectedSection === section.location}
              onClick={() => selectSection(section.location)}
            />
          ))}
        </div>
      )}

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto min-h-[200px]">
        {isLoadingTables ? (
          <TableGridSkeleton />
        ) : filteredTables.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {t("no_tables_found")}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-4">
            {filteredTables.map((table) => (
              <TableButton
                key={table.tableId}
                table={table}
                isSelected={selectedTable?.tableId === table.tableId}
                onClick={() => selectTable(table)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected Table & Seats Section */}
      {selectedTable && (
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{t("selected_table")}:</span>
              <span className="font-bold text-lg text-primary">
                {selectedTable.tableNo}
              </span>
              {isLoadingSeats && (
                <i className="ri-loader-4-line animate-spin text-gray-400" />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleViewKOT}
                className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
              >
                {t("view_kot")}
              </button>
              <button
                onClick={handleLoadOrder}
                className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={!selectedTable}
              >
                {t("load_order")}
              </button>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="mb-4">
            <span className="text-sm text-gray-600 mb-2 block">
              {t("select_seat")}:
            </span>
            <div className="flex flex-wrap gap-2">
              {seatLetters.map((seat) => (
                <SeatButton
                  key={seat}
                  seat={seat}
                  state={seatStates[seat]}
                  isSelected={selectedSeat === seat}
                  onClick={() => selectSeat(seat)}
                />
              ))}
            </div>
          </div>

          {/* Seat Legend */}
          <div className="flex gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded" />
              <span>{t("available")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#be1e21] rounded" />
              <span>{t("occupied")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Status Legend */}
      <StatusLegend />

      {/* Footer Actions */}
      <div className="flex justify-end gap-2 p-4 border-t bg-white">
        <button
          onClick={clearSelection}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {t("clear")}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedTable || !selectedSeat}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
};

export default TableSelectionPanel;
