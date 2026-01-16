/**
 * useTableSelection Hook
 *
 * Custom hook for table selection functionality
 * Equivalent to WinForms frmTableView.cs logic
 *
 * Features:
 * - Load tables by section/location
 * - Track occupied/available status
 * - Seat selection for occupied tables
 * - Search tables by number
 * - Auto-seat selection for specific configurations
 */

import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetTablesQuery,
  useGetTableSectionsQuery,
  useLazyGetOccupiedSeatsQuery,
  TableInfo,
  TableSection,
  OccupiedSeat,
  TableViewMode,
} from "../api";
import {
  setTableNo,
  setSeatNo,
  setDiningContext,
  setPendingOrder,
} from "../reducers/operational-reducer";
import type { RPosOperationalState } from "../type/rpos-operational";

// Available seat letters (matching WinForms btnSeatA-H)
const SEAT_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
type SeatLetter = (typeof SEAT_LETTERS)[number];

interface RootState {
  RPosOperational: RPosOperationalState;
}

interface UseTableSelectionOptions {
  /**
   * Table view mode - determines which tables to show
   * - "All": Show all tables (default)
   * - "MarkOccupied": Show all tables with occupied status highlighted
   * - "OccupiedOnly": Show only occupied tables
   */
  mode?: TableViewMode;

  /**
   * Auto-select seat A when table is selected (for specific configurations)
   * Equivalent to WinForms JAZEERAMANDI/DANA BAY check
   */
  autoSelectSeatA?: boolean;

  /**
   * Callback when table and seat are successfully selected
   */
  onSelectionComplete?: (tableNo: string, seatNo: string, tableId: number) => void;

  /**
   * Callback when selection is cancelled
   */
  onCancel?: () => void;
}

interface UseTableSelectionReturn {
  // Data
  tables: TableInfo[];
  sections: TableSection[];
  occupiedSeats: OccupiedSeat[];
  selectedTable: TableInfo | null;
  selectedSeat: SeatLetter | null;

  // Loading states
  isLoadingTables: boolean;
  isLoadingSections: boolean;
  isLoadingSeats: boolean;

  // Filters
  selectedSection: string;
  searchQuery: string;

  // Computed
  filteredTables: TableInfo[];
  seatStates: Record<SeatLetter, "available" | "occupied" | "disabled">;

  // Actions
  selectSection: (section: string) => void;
  selectTable: (table: TableInfo) => void;
  selectSeat: (seat: SeatLetter) => void;
  setSearchQuery: (query: string) => void;
  searchAndSelectTable: () => void;
  confirmSelection: () => void;
  clearSelection: () => void;
  refetchTables: () => void;
}

export function useTableSelection(
  options: UseTableSelectionOptions = {}
): UseTableSelectionReturn {
  const {
    mode = "All",
    autoSelectSeatA = false,
    onSelectionComplete,
    onCancel,
  } = options;

  const dispatch = useDispatch();
  const operationalState = useSelector((state: RootState) => state.RPosOperational);

  // Local state
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatLetter | null>(null);
  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [localOccupiedSeats, setLocalOccupiedSeats] = useState<OccupiedSeat[]>([]);

  // RTK Query hooks
  const {
    data: tables = [],
    isLoading: isLoadingTables,
    refetch: refetchTables,
  } = useGetTablesQuery({ location: selectedSection || undefined, mode });

  const { data: sections = [], isLoading: isLoadingSections } =
    useGetTableSectionsQuery();

  const [
    fetchOccupiedSeats,
    { isLoading: isLoadingSeats },
  ] = useLazyGetOccupiedSeatsQuery();

  // Filter tables by search query
  const filteredTables = useMemo(() => {
    if (!searchQuery) return tables;
    const query = searchQuery.toLowerCase();
    return tables.filter(
      (table) =>
        table.tableNo.toLowerCase().includes(query) ||
        table.location?.toLowerCase().includes(query)
    );
  }, [tables, searchQuery]);

  // Calculate seat states based on occupied seats
  const seatStates = useMemo(() => {
    const states: Record<SeatLetter, "available" | "occupied" | "disabled"> = {
      A: "disabled",
      B: "disabled",
      C: "disabled",
      D: "disabled",
      E: "disabled",
      F: "disabled",
      G: "disabled",
      H: "disabled",
    };

    if (!selectedTable) return states;

    // If mode allows seat selection, enable all seats first
    if (mode === "All" || mode === "MarkOccupied") {
      SEAT_LETTERS.forEach((seat) => {
        states[seat] = "available";
      });
    }

    // Mark occupied seats
    localOccupiedSeats.forEach((seat) => {
      const seatLetter = seat.seatNumber.toUpperCase();
      // Check if it's a valid seat letter
      if ((SEAT_LETTERS as readonly string[]).includes(seatLetter)) {
        states[seatLetter as SeatLetter] = "occupied";

        // In OccupiedOnly mode, only occupied seats are enabled
        if (mode === "OccupiedOnly") {
          // Keep as occupied (enabled)
        }
      }
    });

    return states;
  }, [selectedTable, localOccupiedSeats, mode]);

  // Handle section selection
  const selectSection = useCallback((section: string) => {
    setSelectedSection(section);
    setSelectedTable(null);
    setSelectedSeat(null);
    setLocalOccupiedSeats([]);
  }, []);

  // Handle table selection
  const selectTable = useCallback(
    async (table: TableInfo) => {
      // Special case: TableID = 0 means Take Away or Delivery
      if (table.tableId === 0) {
        setSelectedTable(table);
        // Don't load seats for takeaway/delivery
        return;
      }

      setSelectedTable(table);
      setSelectedSeat(null);

      // Fetch occupied seats for this table
      try {
        const result = await fetchOccupiedSeats(table.tableId).unwrap();
        setLocalOccupiedSeats(result);

        // Auto-select seat A if configured
        if (autoSelectSeatA) {
          setSelectedSeat("A");
          // Immediately confirm selection
          dispatch(setTableNo(table.tableNo));
          dispatch(setSeatNo("A"));
          dispatch(
            setDiningContext({
              isTableSelected: true,
              isSeatSelected: true,
            })
          );
          onSelectionComplete?.(table.tableNo, "A", table.tableId);
        }
      } catch (error) {
        console.error("Failed to load occupied seats:", error);
        setLocalOccupiedSeats([]);
      }
    },
    [fetchOccupiedSeats, autoSelectSeatA, dispatch, onSelectionComplete]
  );

  // Handle seat selection
  const selectSeat = useCallback(
    (seat: SeatLetter) => {
      if (!selectedTable) return;

      const seatState = seatStates[seat];
      if (seatState === "disabled") return;

      // In OccupiedOnly mode, can only select occupied seats
      if (mode === "OccupiedOnly" && seatState !== "occupied") return;

      setSelectedSeat(seat);
    },
    [selectedTable, seatStates, mode]
  );

  // Search and select table by number
  const searchAndSelectTable = useCallback(() => {
    if (!searchQuery) return;

    const foundTable = tables.find(
      (table) => table.tableNo.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundTable) {
      selectTable(foundTable);
    }
  }, [searchQuery, tables, selectTable]);

  // Confirm selection and update Redux state
  const confirmSelection = useCallback(() => {
    if (!selectedTable || !selectedSeat) return;

    // Update Redux state
    dispatch(setTableNo(selectedTable.tableNo));
    dispatch(setSeatNo(selectedSeat));
    dispatch(
      setDiningContext({
        isTableSelected: true,
        isSeatSelected: true,
      })
    );

    // Find pending order info for this seat
    const seatOrder = localOccupiedSeats.find(
      (s) => s.seatNumber.toUpperCase() === selectedSeat
    );
    if (seatOrder) {
      dispatch(
        setPendingOrder({
          tableId: selectedTable.tableId,
          tableNumber: selectedTable.tableNo,
          token: seatOrder.token,
          isLoaded: false,
        })
      );
    }

    onSelectionComplete?.(
      selectedTable.tableNo,
      selectedSeat,
      selectedTable.tableId
    );
  }, [selectedTable, selectedSeat, localOccupiedSeats, dispatch, onSelectionComplete]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedTable(null);
    setSelectedSeat(null);
    setLocalOccupiedSeats([]);
    setSearchQueryState("");
    onCancel?.();
  }, [onCancel]);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  return {
    // Data
    tables,
    sections,
    occupiedSeats: localOccupiedSeats,
    selectedTable,
    selectedSeat,

    // Loading states
    isLoadingTables,
    isLoadingSections,
    isLoadingSeats,

    // Filters
    selectedSection,
    searchQuery,

    // Computed
    filteredTables,
    seatStates,

    // Actions
    selectSection,
    selectTable,
    selectSeat,
    setSearchQuery,
    searchAndSelectTable,
    confirmSelection,
    clearSelection,
    refetchTables,
  };
}

export type { SeatLetter, UseTableSelectionOptions, UseTableSelectionReturn };
