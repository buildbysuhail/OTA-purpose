"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { moveArrayElement } from "../../../utilities/Utils";
import {
  ColumnPreference,
  GridPreference,
  initialGridPreference,
} from "../../types/dev-grid-column";
import { getStorageString, setStorageString } from "../../../utilities/storage-utils";
import { formStateHandleFieldChangeKeysOnly, reOrderGridCols } from "../../../pages/inventory/transactions/reducer";

// Enhanced resize and reorder hook
export const useTableResizeAndReorder = (gridID: string, onApplyPreferences: any) => {
  const isResizing = useRef(false);
  const isDragging = useRef(false);
  const currentColumnIndex = useRef<{index: number, field: string}>({index:-1, field:""});
  const dragStartIndex = useRef<number>(-1);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columnWidths, setColumnWidths] = useState<{width: number, field: string}[]>([]);
  const [columnOrder, setColumnOrder] = useState<{index: number, field: string}[]>([]);
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
    field: string,
    container: HTMLDivElement,
    initialWidths: {width:number, field: string}[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    currentColumnIndex.current.index = columnIndex;
    currentColumnIndex.current.field = field;
    startX.current = e.clientX;
    containerRef.current = container;
    startWidth.current = initialWidths?.find(x => x.field == field)?.width??0;

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
    if (!isResizing.current || !containerRef.current || currentColumnIndex.current.index === -1) return;

    const isRTL = getComputedStyle(containerRef.current).direction === 'rtl';

    const diff = e.clientX - startX.current;
    const adjustedDiff = isRTL ? -diff : diff;
    const newWidth = Math.max(50, startWidth.current + adjustedDiff);
    const columnIndex = currentColumnIndex.current.index;

    setColumnWidths((prevWidths) => {
      const newWidths = JSON.parse(JSON.stringify([...prevWidths]))
      try {
        if(newWidths.find((x: any) => x.field == currentColumnIndex.current.field)) {
      newWidths.find((x: any) => x.field == currentColumnIndex.current.field)!.width = newWidth;
      }
      } catch (error) {
        debugger;
        
      }
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

    const stopResize = useCallback(async() => {
    const column = formState.gridColumns?.find((x) => x.visible != false && x.dataField == currentColumnIndex.current.field);

    const currentWidths = columnWidthsRef.current;
    console.log(currentWidths);
    console.log(columnWidths);
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: {
          gridColumns: [
            {
              dataField: column?.dataField,
              width: currentWidths?.find(x => x.field == column?.dataField),
            },
          ],
        },
        updateOnlyGivenDetailsColumns: true,
      })
    );
    const savedPreferences = await getStorageString(`gridPreferences_${gridID}`);

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
      (x) => x.dataField == column?.dataField
    );
    if (ind > -1) {
      parsedPreferences.columnPreferences[ind] = {
        ...parsedPreferences.columnPreferences[ind],
        width: currentWidths?.find(x => x.field == currentColumnIndex.current?.field)?.width
      };

      const preference = JSON.stringify(parsedPreferences);
      await setStorageString(`gridPreferences_${gridID}`, preference);
    }
    isResizing.current = false;
    currentColumnIndex.current.index = -1;
    currentColumnIndex.current.field = "";
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

  const handleDrop = async(e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if(dragOverIndex == 0 || dragOverIndex == columnWidths.length-1) {
      return;
    }
    
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
    const savedPreferences = await getStorageString(`gridPreferences_${gridID}`);

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
      await setStorageString(`gridPreferences_${gridID}`, preference);
      onApplyPreferences && onApplyPreferences(preference);
      setColumnWidths((prev:any) => {
        return [
          ...moveArrayElement(columnWidths, _fromColumn, _toColumn)
        ]   
        
      })
      console.log(moveArrayElement(columnWidths, _fromColumn, _toColumn));
      
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
