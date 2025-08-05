"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  formStateHandleFieldChangeKeysOnly,
  reOrderGridCols,
} from "../../../pages/inventory/transactions/purchase/reducer";
import { moveArrayElement } from "../../../utilities/Utils";
import {
  ColumnPreference,
  GridPreference,
  initialGridPreference,
} from "../../types/dev-grid-column";

// Enhanced resize and reorder hook
export const useTableResizeAndReorder = (gridID: string) => {
  const isResizing = useRef(false);
  const isDragging = useRef(false);
  const currentColumnIndex = useRef<number>(-1);
  const dragStartIndex = useRef<number>(-1);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [columnOrder, setColumnOrder] = useState<number[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number>(-1);
  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const dispatch = useDispatch();

  const appState = useSelector((state: RootState) => state.AppState.appState);

  // Resize functionality with optimizations
  const startResize = (
    e: MouseEvent,
    columnIndex: number,
    container: HTMLDivElement,
    initialWidths: number[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    currentColumnIndex.current = columnIndex;
    startX.current = e.clientX;
    containerRef.current = container;
    startWidth.current = initialWidths[columnIndex];

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  };
  // Add this ref at the top of your hook
  const columnWidthsRef = useRef(columnWidths);

  // Update ref whenever columnWidths changes
  useEffect(() => {
    columnWidthsRef.current = columnWidths;
  }, [columnWidths]);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current || currentColumnIndex.current === -1) return;

    const isRTL = getComputedStyle(containerRef.current).direction === 'rtl';

    const diff = e.clientX - startX.current;
    const adjustedDiff = isRTL ? -diff : diff;
    const newWidth = Math.max(50, startWidth.current + adjustedDiff);
    const columnIndex = currentColumnIndex.current;

    setColumnWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[columnIndex] = newWidth;
      console.log(newWidths);
      return newWidths;
    });

    // Batch state update
    // Batch state update
    setColumnWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[columnIndex] = newWidth;
      console.log(newWidths);

      // Store current widths in ref for stopResize to access
      columnWidthsRef.current = newWidths;

      return newWidths;
    });

    // Direct DOM manipulation for immediate visual feedback
    const headerCells = containerRef.current!.querySelectorAll(`
      .table-header > div > div:nth-child(${columnIndex + 1}),
      .table-footer > div > div:nth-child(${columnIndex + 1}),
      .table-body > div > div:nth-child(${columnIndex + 1})
    `);

    // headerCells.forEach((cell) => {
    //   const element = cell as HTMLElement;
    //   element.style.width = newWidth + "px";
    //   element.style.minWidth = newWidth + "px";
    //   element.style.maxWidth = newWidth + "px";
    // });
  }, []);

  const stopResize = useCallback(() => {
    const column = formState.gridColumns?.filter((x) => x.visible != false)![
      currentColumnIndex.current
    ];

    const currentWidths = columnWidthsRef.current;
    console.log(currentWidths);
    console.log(columnWidths);
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: {
          gridColumns: [
            {
              dataField: column.dataField,
              width: currentWidths[currentColumnIndex.current],
            },
          ],
        },
        updateOnlyGivenDetailsColumns: true,
      })
    );
    const savedPreferences = localStorage.getItem(`gridPreferences_${gridID}`);

    let _parsedPreferences: GridPreference;
    if (
      savedPreferences != undefined &&
      savedPreferences != null &&
      savedPreferences != `""` &&
      savedPreferences != ""
    ) {
      _parsedPreferences = JSON.parse(savedPreferences) as GridPreference;
    } else {
      _parsedPreferences = {
        ...initialGridPreference,
        columnPreferences: [...(formState.gridColumns ?? [])] as Array<ColumnPreference>,
      };
    }
    let parsedPreferences = {
      ..._parsedPreferences,
      columnPreferences: [..._parsedPreferences.columnPreferences] // Deep copy the array
    };

    const ind = (parsedPreferences.columnPreferences as Array<ColumnPreference>).findIndex(
      (x) => x.dataField == column.dataField
    );
    if (ind > -1) {
      parsedPreferences.columnPreferences[ind] = {
        ...parsedPreferences.columnPreferences[ind],
        width: currentWidths[currentColumnIndex.current]
      };

      const preference = JSON.stringify(parsedPreferences);
      localStorage.setItem(`gridPreferences_${gridID}`, preference);
    }
    isResizing.current = false;
    currentColumnIndex.current = -1;
    containerRef.current = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  }, [handleMouseMove, formState.gridColumns]);

  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isResizing.current || index == 0 || index == columnWidths.length-1) {
      e.preventDefault();
      return;
    }

    isDragging.current = true;
    dragStartIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");

    const target = e.target as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    debugger;
    isDragging.current = false;
    dragStartIndex.current = -1;
    setDragOverIndex(-1);

    const target = e.target as HTMLElement;
    target.style.opacity = "";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isDragging.current || dragStartIndex.current === -1) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    debugger;
    if(dragOverIndex == 0 || dragOverIndex == columnWidths.length-1) {
      return;
    }
    debugger;
    if (
      !isDragging.current ||
      dragStartIndex.current === -1 ||
      dragStartIndex.current === dropIndex
    ) {
      setDragOverIndex(-1);
      return;
    }
    
    const startIndex = dragStartIndex.current;

    const fromColumn = formState.gridColumns?.filter(
      (x) => x.visible != false
    )![startIndex];
    const _fromColumn = formState.gridColumns?.findIndex(c => c.dataField == fromColumn.dataField)
    const toColumn = formState.gridColumns?.filter((x) => x.visible != false)![
      dragOverIndex
    ];
    const _toColumn = formState.gridColumns?.findIndex(c => c.dataField == toColumn.dataField)
    dispatch(
      reOrderGridCols({
        column: fromColumn.dataField ?? "",
        toBefore: toColumn.dataField ?? "",
      })
    );
    const savedPreferences = localStorage.getItem(`gridPreferences_${gridID}`);

    let parsedPreferences: GridPreference;
    if (
      savedPreferences != undefined &&
      savedPreferences != null &&
      savedPreferences != `""` &&
      savedPreferences != ""
    ) {
      parsedPreferences = JSON.parse(savedPreferences) as GridPreference;
    } else {
      parsedPreferences = {
        ...initialGridPreference,
        columnPreferences: (formState.gridColumns ?? []) as any,
      };
    }
    if (parsedPreferences && parsedPreferences.columnPreferences?.length > 0) {
      parsedPreferences.columnPreferences = moveArrayElement(parsedPreferences.columnPreferences, _fromColumn, _toColumn)
      const preference = JSON.stringify(parsedPreferences);
      localStorage.setItem(`gridPreferences_${gridID}`, preference);
    }
    setColumnOrder((prevOrder) => {
      
      const newOrder = [...prevOrder];
      const [movedItem] = newOrder.splice(startIndex, 1);
      newOrder.splice(dropIndex, 0, movedItem);

      return newOrder;
    });

    setColumnWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      const [movedWidth] = newWidths.splice(startIndex, 1);
      newWidths.splice(dropIndex, 0, movedWidth);
      return newWidths;
    });

    setDragOverIndex(-1);
  };

  return {
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
  };
};
