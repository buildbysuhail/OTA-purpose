
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

// Enhanced resize and reorder hook
export const useTableResizeAndReorder = () => {
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

  // Resize functionality with optimizations
  const startResize = (e: MouseEvent, columnIndex: number, container: HTMLDivElement, initialWidths: number[]) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    currentColumnIndex.current = columnIndex;
    startX.current = e.clientX;
    containerRef.current = container;
    startWidth.current = initialWidths[columnIndex];

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current || currentColumnIndex.current === -1) return;

    const diff = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff);
    const columnIndex = currentColumnIndex.current;
    
    // Batch state update
    setColumnWidths(prevWidths => {
      const newWidths = [...prevWidths];
      newWidths[columnIndex] = newWidth;
      return newWidths;
    });

    // Direct DOM manipulation for immediate visual feedback
    const headerCells = containerRef.current!.querySelectorAll(`
      .table-header > div > div:nth-child(${columnIndex + 1}),
      .table-footer > div > div:nth-child(${columnIndex + 1}),
      .table-body > div > div:nth-child(${columnIndex + 1})
    `);
    
    headerCells.forEach(cell => {
      const element = cell as HTMLElement;
      element.style.width = newWidth + 'px';
      element.style.minWidth = newWidth + 'px';
      element.style.maxWidth = newWidth + 'px';
    });
  }, []);

  const stopResize = useCallback(() => {
    isResizing.current = false;
    currentColumnIndex.current = -1;
    containerRef.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  }, [handleMouseMove]);

  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isResizing.current) {
      e.preventDefault();
      return;
    }
    
    isDragging.current = true;
    dragStartIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    isDragging.current = false;
    dragStartIndex.current = -1;
    setDragOverIndex(-1);
    
    const target = e.target as HTMLElement;
    target.style.opacity = '';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isDragging.current || dragStartIndex.current === -1) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!isDragging.current || dragStartIndex.current === -1 || dragStartIndex.current === dropIndex) {
      setDragOverIndex(-1);
      return;
    }

    const startIndex = dragStartIndex.current;
    
    setColumnOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const [movedItem] = newOrder.splice(startIndex, 1);
      newOrder.splice(dropIndex, 0, movedItem);
      return newOrder;
    });

    setColumnWidths(prevWidths => {
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
    dragOverIndex
  };
};