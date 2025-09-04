"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Simple column interface
interface Column {
  id: string;
  title: string;
  width: number;
}

interface RowData {
  slNo: number;
  itemCode: string;
  itemName: string;
  quantity: string;
  rate: string;
  amount: string;
  discount: string;
  tax: string;
  total: string;
}

// Ultra-fast virtual scrolling hook with aggressive buffering for fast scrolling
export const useUltraFastVirtualScrolling = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const scrollTop = useRef(0);
  const [, forceUpdate] = useState({});
  
  // Calculate visible items with large buffer to prevent white areas
  const getVisibleItems = useCallback(() => {
    
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalCount = Math.ceil((scrollTop.current + containerHeight) / itemHeight);
    const sd = Math.floor((totalCount - visibleCount) / 2) > Math.floor(visibleCount) ? Math.floor(visibleCount) : Math.floor((totalCount - visibleCount) / 2)
    const bufferSize = Math.max(sd, Math.floor(visibleCount * 0.5)); // Large buffer
    
    console.log(visibleCount);
    console.log(bufferSize);
    console.log(scrollTop.current);
    const startIndex = Math.max(0, Math.floor(scrollTop.current / itemHeight) - bufferSize);
    const endIndex = Math.min(
      itemCount - 1,
      Math.floor((scrollTop.current + containerHeight) / itemHeight) + bufferSize
    );
    
    console.log(startIndex);
    console.log(endIndex);
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        index: i,
        top: i * itemHeight,
      });
    }
    console.log(visibleItems);
    
    return { visibleItems, startIndex, endIndex };
  }, [itemCount, itemHeight, containerHeight]);

  // Immediate scroll update without RAF to prevent white areas
  const updateScroll = useCallback((newScrollTop: number) => {
    
    scrollTop.current = newScrollTop;
    // Force immediate update for fast scrolling
    forceUpdate({});
  }, []);

  const totalHeight = itemCount * itemHeight;
  const { visibleItems, startIndex, endIndex } = getVisibleItems();
  
  return {
    scrollTop: scrollTop.current,
    updateScroll,
    visibleItems,
    totalHeight,
    startIndex,
    endIndex
  };
};