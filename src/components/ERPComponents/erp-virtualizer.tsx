'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

interface ERPVirtualizerProps<T> {
  items: T[]
  itemHeight: number
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode
  overscanCount?: number
  className?: string
  onItemsRendered?: (info: ListOnItemsRenderedProps) => void
  scrollToItem?: number
  scrollToAlignment?: 'auto' | 'smart' | 'center' | 'end' | 'start'
}

export default function ERPVirtualizer<T>({
  items,
  itemHeight,
  renderItem,
  overscanCount = 5,
  className = '',
  onItemsRendered,
  scrollToItem,
  scrollToAlignment = 'auto',
}: ERPVirtualizerProps<T>) {
  const listRef = useRef<List>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollToItem !== undefined && listRef.current) {
      listRef.current.scrollToItem(scrollToItem, scrollToAlignment)
    }
  }, [scrollToItem, scrollToAlignment])

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    return renderItem(items[index], index, style)
  }, [items, renderItem])

  return (
    <div ref={containerRef} className={`erp-virtualizer ${className}`}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            ref={listRef}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width={width}
            overscanCount={overscanCount}
            onItemsRendered={onItemsRendered}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}