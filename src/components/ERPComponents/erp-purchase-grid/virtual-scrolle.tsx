import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Plus } from 'lucide-react';

// Virtual scrolling hook
const useVirtualScrolling = (
  items: any[],
  columns: any[],
  itemHeight: number,
  containerHeight: number,
  containerWidth: number,
  overscanRows: number = 5,
  overscanCols: number = 2
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const scrollingResetTimeoutId = useRef<number | null>(null);
  
  const visibleColumns =columns.filter(col => col.visible);
  const totalHeight = items.length * itemHeight;
  const totalWidth = visibleColumns.reduce((sum,col)=> sum + col.width,0);

 // Calculate visible row range
  const startRowIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanRows);
  const endRowIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscanRows 
  );

  // Calculate visible column range
  const getColumnRange = useCallback(() => {
    let startColIndex = 0;
    let endColIndex = visibleColumns.length - 1;
    let accumulatedWidth = 0;
    
    // Find start column
    for (let i = 0; i < visibleColumns.length; i++) {
      if (accumulatedWidth + visibleColumns[i].width > scrollLeft) {
        startColIndex = Math.max(0, i - overscanCols);
        break;
      }
      accumulatedWidth += visibleColumns[i].width;
    }
    
    // Find end column
    accumulatedWidth = 0;
    for (let i = 0; i < visibleColumns.length; i++) {
      accumulatedWidth += visibleColumns[i].width;
      if (accumulatedWidth >= scrollLeft + containerWidth) {
        endColIndex = Math.min(visibleColumns.length - 1, i + overscanCols);
        break;
      }
    }
    
    return { startColIndex, endColIndex };
  }, [scrollLeft, containerWidth, visibleColumns, overscanCols]);
  
  const { startColIndex, endColIndex } = getColumnRange();
    // Get visible columns with their offset positions
  const visibleColumnsWithOffset = useMemo(() => {
    let offsetX = 0;
    const result = [];
    
    for (let i = 0; i < visibleColumns.length; i++) {
      if (i >= startColIndex && i <= endColIndex) {
        result.push({
          ...visibleColumns[i],
          index: i,
          offsetX: offsetX,
        });
      }
      offsetX += visibleColumns[i].width;
    }
    
    return result;
  }, [visibleColumns, startColIndex, endColIndex])


 // Get visible items (rows)
  const visibleItems = useMemo(() => {
    return items.slice(startRowIndex, endRowIndex + 1).map((item, index) => ({
      ...item,
      index: startRowIndex + index,
      offsetY: (startRowIndex + index) * itemHeight,
    }));
  }, [items, startRowIndex, endRowIndex, itemHeight]);
  

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    debugger;
    const scrollTop = e.currentTarget.scrollTop;
     const newScrollLeft = e.currentTarget.scrollLeft;

    setScrollTop(scrollTop);
    setScrollLeft(newScrollLeft);
    setIsScrolling(true);
    
    if (scrollingResetTimeoutId.current !== null) {
      clearTimeout(scrollingResetTimeoutId.current);
    }
    
    scrollingResetTimeoutId.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);
  
  const scrollToCell  = useCallback((index: number,colIndex: number, align = 'auto') => {
    if (!scrollElementRef.current) return;
    
      const currentScrollTop = scrollElementRef.current.scrollTop;
    const currentScrollLeft = scrollElementRef.current.scrollLeft;

    const elementTop = index * itemHeight;
    const elementBottom = elementTop + itemHeight;
    
    let newScrollTop = currentScrollTop;
    
    if (align === 'start' || elementTop < currentScrollTop) {
      newScrollTop = elementTop;
    } else if (align === 'end' || elementBottom > currentScrollTop + containerHeight) {
      newScrollTop = elementBottom - containerHeight;
    } else if (align === 'center') {
      newScrollTop = elementTop - containerHeight / 2 + itemHeight / 2;
    }
    
// Horizontal scrolling
    let elementLeft = 0;
    for (let i = 0; i < colIndex; i++) {
      elementLeft += visibleColumns[i].width;
    }
    const elementRight = elementLeft + visibleColumns[colIndex].width;
    
    let newScrollLeft = currentScrollLeft;
    
    if (align === 'start' || elementLeft < currentScrollLeft) {
      newScrollLeft = elementLeft;
    } else if (align === 'end' || elementRight > currentScrollLeft + containerWidth) {
      newScrollLeft = elementRight - containerWidth;
    } else if (align === 'center') {
      newScrollLeft = elementLeft - containerWidth / 2 + visibleColumns[colIndex].width / 2;
    }
    
    scrollElementRef.current.scrollTop = Math.max(0, newScrollTop);
    scrollElementRef.current.scrollLeft = Math.max(0, newScrollLeft);
  }, [itemHeight, containerHeight, containerWidth, visibleColumns]);
  
  return {
    scrollElementRef,
    totalHeight,
    totalWidth,
    visibleItems,
    visibleColumnsWithOffset,
    startRowIndex,
    endRowIndex,
    startColIndex,
    endColIndex,
    onScroll,
    scrollToCell,
    isScrolling,
    scrollLeft,
    scrollTop,
  };
};

const generateSampleData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    slNo: index + 1,
    product: `Product ${index + 1}`,
    pCode: `P${String(index + 1).padStart(4, '0')}`,
    quantity: Math.floor(Math.random() * 100) + 1,
    rate: (Math.random() * 1000).toFixed(2),
    amount: (Math.random() * 100000).toFixed(2),
    status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
    description: `Description ${index + 1}`,
    category: `Category ${Math.floor(Math.random() * 5) + 1}`,
    supplier: `Supplier ${Math.floor(Math.random() * 10) + 1}`,
    location: `Location ${Math.floor(Math.random() * 8) + 1}`,
    batch: `B${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    weight: (Math.random() * 50).toFixed(2),
    dimensions: `${Math.floor(Math.random() * 100)}x${Math.floor(Math.random() * 100)}x${Math.floor(Math.random() * 100)}`,
    color: ['Red', 'Blue', 'Green'][Math.floor(Math.random() * 3)],
    size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
    material: ['Cotton', 'Plastic', 'Metal'][Math.floor(Math.random() * 3)],
    brand: `Brand ${Math.floor(Math.random() * 10) + 1}`,
    model: `Model ${Math.floor(Math.random() * 1000)}`,
    barcode: `BC${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    serialNumber: `SN${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    manufactureDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    importedFrom: ['USA', 'China', 'Germany', 'India'][Math.floor(Math.random() * 4)],
    warranty: `${Math.floor(Math.random() * 5) + 1} year(s)`,
    priceWithTax: (Math.random() * 1000).toFixed(2),
    discount: (Math.random() * 50).toFixed(2),
    finalPrice: (Math.random() * 1000).toFixed(2),
    stockStatus: ['In Stock', 'Out of Stock', 'Limited'][Math.floor(Math.random() * 3)],
    reorderLevel: Math.floor(Math.random() * 20),
    maxStock: Math.floor(Math.random() * 500),
    minStock: Math.floor(Math.random() * 50),
    unit: ['pcs', 'kg', 'liters'][Math.floor(Math.random() * 3)],
    packing: ['Box', 'Bag', 'Pallet'][Math.floor(Math.random() * 3)],
    originCountry: ['India', 'China', 'Germany', 'USA'][Math.floor(Math.random() * 4)],
    hsnCode: `HSN${Math.floor(Math.random() * 10000)}`,
    gstRate: (Math.random() * 28).toFixed(2),
    addedBy: `User${Math.floor(Math.random() * 10)}`,
    addedDate: new Date(Date.now() - Math.random() * 100 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    modifiedBy: `User${Math.floor(Math.random() * 10)}`,
    modifiedDate: new Date(Date.now() - Math.random() * 50 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    remarks: `Remark ${index + 1}`,
    customField1: `Custom1 Val ${index + 1}`,
    customField2: `Custom2 Val ${index + 1}`,
    customField3: `Custom3 Val ${index + 1}`,
  }));
};


const columns = [
  { dataField: 'slNo', caption: 'Sl No', width: 80, dataType: 'number', visible: true, allowEditing: false },
  { dataField: 'product', caption: 'Product', width: 200, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'pCode', caption: 'Code', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'quantity', caption: 'Quantity', width: 100, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'rate', caption: 'Rate', width: 120, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'amount', caption: 'Amount', width: 150, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'status', caption: 'Status', width: 100, dataType: 'string', visible: true, allowEditing: false },
  { dataField: 'category', caption: 'Category', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'supplier', caption: 'Supplier', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'location', caption: 'Location', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'batch', caption: 'Batch', width: 100, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'expiryDate', caption: 'Expiry Date', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'weight', caption: 'Weight', width: 100, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'dimensions', caption: 'Dimensions', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'description', caption: 'Description', width: 200, dataType: 'string', visible: true, allowEditing: true },

  { dataField: 'color', caption: 'Color', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'size', caption: 'Size', width: 100, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'material', caption: 'Material', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'brand', caption: 'Brand', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'model', caption: 'Model', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'barcode', caption: 'Barcode', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'serialNumber', caption: 'Serial No.', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'manufactureDate', caption: 'Mfg Date', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'importedFrom', caption: 'Imported From', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'warranty', caption: 'Warranty', width: 100, dataType: 'string', visible: true, allowEditing: true },

  { dataField: 'priceWithTax', caption: 'Price (Tax)', width: 120, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'discount', caption: 'Discount %', width: 100, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'finalPrice', caption: 'Final Price', width: 120, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'stockStatus', caption: 'Stock Status', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'reorderLevel', caption: 'Reorder Level', width: 100, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'maxStock', caption: 'Max Stock', width: 100, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'minStock', caption: 'Min Stock', width: 100, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'unit', caption: 'Unit', width: 100, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'packing', caption: 'Packing', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'originCountry', caption: 'Origin Country', width: 150, dataType: 'string', visible: true, allowEditing: true },

  { dataField: 'hsnCode', caption: 'HSN Code', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'gstRate', caption: 'GST %', width: 80, dataType: 'number', visible: true, allowEditing: true },
  { dataField: 'addedBy', caption: 'Added By', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'addedDate', caption: 'Added Date', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'modifiedBy', caption: 'Modified By', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'modifiedDate', caption: 'Modified Date', width: 120, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'remarks', caption: 'Remarks', width: 200, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'customField1', caption: 'Custom 1', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'customField2', caption: 'Custom 2', width: 150, dataType: 'string', visible: true, allowEditing: true },
  { dataField: 'customField3', caption: 'Custom 3', width: 150, dataType: 'string', visible: true, allowEditing: true },
];


const VirtualScrollingTable = () => {
  const [data, setData] = useState(() => generateSampleData(10000)); // 10k rows for testing
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const ROW_HEIGHT = 32;
  const CONTAINER_HEIGHT = 200;
  const CONTAINER_WIDTH = 800;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);
  
  const {
    scrollElementRef,
    totalHeight,
    totalWidth,
    visibleItems,
    visibleColumnsWithOffset,
    startRowIndex,
    endRowIndex,
    startColIndex,
    endColIndex,
    onScroll,
    scrollToCell,
    isScrolling,
    scrollLeft,
    scrollTop,
  } = useVirtualScrolling(
    filteredData, 
    columns, 
    ROW_HEIGHT, 
    CONTAINER_HEIGHT, 
    CONTAINER_WIDTH
  );
    
  const handleCellClick = (rowIndex: number, colField: string, allowEditing: boolean) => {
    if (allowEditing) {
      setEditingCell({ row: rowIndex, col: colField });
    }
  };
  
  const handleCellChange = (rowIndex: number, colField: string, newValue: string) => {
    setData(prev => prev.map((item, index) => 
      index === rowIndex ? { ...item, [colField]: newValue } : item
    ));
  };
  
  const handleCellBlur = () => {
    setEditingCell(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colField: string) => {
    const visibleColumns = columns.filter(col => col.visible);
    const currentColIndex = visibleColumns.findIndex(col => col.dataField === colField);
    
    switch (e.key) {
      case 'Enter':
      case 'ArrowDown':
        e.preventDefault();
        if (rowIndex < filteredData.length - 1) {
          const nextRowIndex = rowIndex + 1;
          setEditingCell({ row: nextRowIndex, col: colField });
          if (nextRowIndex > endRowIndex - 2) {
            scrollToCell(nextRowIndex, currentColIndex);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (rowIndex > 0) {
          const prevRowIndex = rowIndex - 1;
          setEditingCell({ row: prevRowIndex, col: colField });
          if (prevRowIndex < startRowIndex + 2) {
            scrollToCell(prevRowIndex, currentColIndex);
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentColIndex > 0) {
          const prevColIndex = currentColIndex - 1;
          setEditingCell({ row: rowIndex, col: visibleColumns[prevColIndex].dataField });
          if (prevColIndex < startColIndex + 1) {
            scrollToCell(rowIndex, prevColIndex);
          }
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentColIndex < visibleColumns.length - 1) {
          const nextColIndex = currentColIndex + 1;
          setEditingCell({ row: rowIndex, col: visibleColumns[nextColIndex].dataField });
          if (nextColIndex > endColIndex - 1) {
            scrollToCell(rowIndex, nextColIndex);
          }
        }
        break;
      case 'Tab':
        e.preventDefault();
        const nextColIndex = e.shiftKey ? currentColIndex - 1 : currentColIndex + 1;
        if (nextColIndex >= 0 && nextColIndex < visibleColumns.length) {
          setEditingCell({ row: rowIndex, col: visibleColumns[nextColIndex].dataField });
          if (nextColIndex < startColIndex + 1 || nextColIndex > endColIndex - 1) {
            scrollToCell(rowIndex, nextColIndex);
          }
        } else if (!e.shiftKey && rowIndex < filteredData.length - 1) {
          const nextRowIndex = rowIndex + 1;
          setEditingCell({ row: nextRowIndex, col: visibleColumns[0].dataField });
          scrollToCell(nextRowIndex, 0);
        }
        break;
      case 'Escape':
        setEditingCell(null);
        break;
    }
  };
  

  
  const renderCell = (item: any, column: any, rowIndex: number) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === column.dataField;
    const cellValue = item[column.dataField];
    
    if (column.dataField === 'status') {
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          cellValue === 'Active' ? 'bg-green-100 text-green-800' :
          cellValue === 'Inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {cellValue}
        </span>
      );
    }
    
    if (isEditing && column.allowEditing) {
      return (
        <input
          type={column.dataType === 'number' ? 'number' : 'text'}
          value={cellValue}
          onChange={(e) => handleCellChange(rowIndex, column.dataField, e.target.value)}
          onBlur={handleCellBlur}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, column.dataField)}
          className="w-full h-full px-2 border-none outline-none bg-blue-50 focus:bg-white"
          autoFocus
        />
      );
    }
    
    return (
      <div 
        className={`w-full h-full px-2 flex items-center ${column.allowEditing ? 'cursor-text hover:bg-gray-50' : 'cursor-default'}`}
        onClick={() => handleCellClick(rowIndex, column.dataField, column.allowEditing)}
        style={{ textAlign: column.dataType === 'number' ? 'right' : 'left' }}
      >
        {cellValue}
      </div>
    );
  };
  
 return (
    <div className="p-6 max-w-full mx-auto">
      
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        {/* Header - Fixed, scrolls horizontally with content */}
        <div className="relative overflow-hidden border-b border-gray-200">
          <div 
            className="flex bg-gray-50"
            style={{ 
              width: `${totalWidth}px`,
              transform: `translateX(-${scrollLeft}px)`,
            }}
          >
            {visibleColumnsWithOffset.map((column) => (
              <div
                key={column.dataField}
                className="px-2 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0 flex items-center"
                style={{ 
                  width: `${column.width}px`, 
                  minWidth: `${column.width}px`,
                  position: 'absolute',
                  left: `${column.offsetX}px`,
                }}
              >
                {column.caption}
              </div>
            ))}
          </div>
        </div>
        
        {/* Virtual Scrolling Container */}
        <div
          ref={scrollElementRef}
          onScroll={onScroll}
          style={{ 
            height: `${CONTAINER_HEIGHT}px`, 
            width: `${CONTAINER_WIDTH}px`,
            overflow: 'auto' 
          }}
          className="relative"
        >
          {/* Total dimensions container */}
          <div style={{ 
            height: `${totalHeight}px`, 
            width: `${totalWidth}px`,
            position: 'relative' 
          }}>
            {/* Visible rows */}
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="absolute border-b border-gray-100 hover:bg-gray-50 transition-colors"
                style={{
                  top: `${item.offsetY}px`,
                  height: `${ROW_HEIGHT}px`,
                  left: 0,
                  width: `${totalWidth}px`,
                }}
              >
                {/* Visible cells */}
                {visibleColumnsWithOffset.map((column) => (
                  <div
                    key={`${item.id}-${column.dataField}`}
                    className="absolute border-r border-gray-100 last:border-r-0 flex items-center"
                    style={{ 
                      left: `${column.offsetX}px`,
                      width: `${column.width}px`, 
                      minWidth: `${column.width}px`,
                      height: `${ROW_HEIGHT}px`
                    }}
                  >
                    {renderCell(item, column, item.index)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer with stats */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex justify-between items-center">
          <div>
            Showing rows {startRowIndex + 1}-{endRowIndex + 1} of {filteredData.length.toLocaleString()}
            {' • '}
            Columns {startColIndex + 1}-{endColIndex + 1} of {columns.filter(col => col.visible).length}
          </div>
          <div className="flex items-center space-x-4">
            {isScrolling && <span className="text-blue-600">• Scrolling...</span>}
            <span className="text-xs text-gray-500">
              Scroll: {Math.round(scrollTop)}px, {Math.round(scrollLeft)}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualScrollingTable;