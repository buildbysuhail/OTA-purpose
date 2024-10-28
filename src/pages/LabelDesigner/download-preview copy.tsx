import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import { Document, Page, View, Text, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import JsBarcode from 'jsbarcode';
import { DesignerElementType, PlacedComponent, TemplateState } from '../InvoiceDesigner/Designer/interfaces';

interface ProductData {
  id: number;
  name: string;
  salesPrice: number;
  sku: string;
}

interface PreviewDocumentProps {
  template: TemplateState;
  chunkedData: ProductData[][];
  columnsPerRow: number;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },
  row: {
    flexDirection: "row" as const,
    justifyContent: "flex-start" as const,
    alignItems: "flex-start" as const,
    flexWrap: "wrap" as const,
    // marginBottom: 10,
  },
  componentWrapper: {
    // margin: 5,
    // width: `${100 / 2}%`, // Default to 2 columns
  },
  text: {
    fontSize: 12,
  },
});

// Memoized BarcodeRenderer component
const BarcodeRenderer = memo(({ component, value }: { component: PlacedComponent; value: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [barcodeGenerated, setBarcodeGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current && component.barcodeProps && !barcodeGenerated) {
      try {
        JsBarcode(canvasRef.current, value, {
          ...component.barcodeProps,
          width: component.barcodeProps.barWidth,
          height: component.barcodeProps.height,
          displayValue: component.barcodeProps.showText,
        });
        setBarcodeGenerated(true);
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [component, value, barcodeGenerated]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto"
      style={{
        margin: component.barcodeProps?.margin ?? 0,
        background: component.barcodeProps?.background ?? 'transparent',
      }}
    />
  );
});

// Memoized component renderer
const ComponentRenderer = memo(({ component, data }: { component: PlacedComponent; data: ProductData }) => {
  switch (component.type) {
    case DesignerElementType.text:
      return (
        <Text
          style={{
            fontSize: component.barcodeProps?.fontSize ?? 12,
            fontStyle: component.barcodeProps?.fontStyle ?? "normal",
            textAlign: component.barcodeProps?.textAlign ?? "left",
            margin: 5,
            color: "#000",
          }}
        >
          {component.content}
        </Text>
      );

    case DesignerElementType.field:
      return (
        <Text
          style={{
            fontSize: 12,
            margin: 5,
          }}
        >
          {data[component.content as keyof ProductData]?.toString() ?? "N/A"}
        </Text>
      );

    case DesignerElementType.barcode:
      return <BarcodeRenderer component={component} value={data.sku} />; // Changed to use SKU instead of salesPrice

    default:
      return null;
  }
});
const validPageSizes = ['A4', 'A3', 'A5', 'LETTER', 'LEGAL'] as const;
type ValidPageSize = typeof validPageSizes[number];
const getPageSize = (template?: TemplateState): any => {
  if (!template?.propertiesState?.pageSize) {
    return 'A4';
  }

  const pageSize = template.propertiesState.pageSize.toUpperCase();

  if (pageSize === 'CUSTOM') {
    return {
      width: template.propertiesState?.width ?? 600,
      height: template.propertiesState?.height ?? 600
    };
  }

  // Validate if the page size is one of the allowed values
  if (validPageSizes.includes(pageSize as ValidPageSize)) {
    return pageSize as ValidPageSize;
  }

  // Default to A4 if not valid
  return 'A4';
};

// Memoized PDF Document component
const PDFDocument = memo(({ template, chunkedData, columnsPerRow }: PreviewDocumentProps) => {
  const componentWrapperStyle = useMemo(() => ({
    ...styles.componentWrapper,
    width: `${100 / columnsPerRow}%`,
  }), [columnsPerRow]);

  return (
    <Document>
      <Page
        size={getPageSize(template)}
        style={styles.page}
      >
        {chunkedData?.map((row, rowIndex) => (
          <View key={`row_${rowIndex}`} style={styles.row}>
            {row?.map((item) => (
              <View key={`item_${item.id}`} style={componentWrapperStyle}>
                {template.barcodeState?.PlasedComponents?.map((component) => (
                  <ComponentRenderer 
                    key={`component_${component.id}`}
                    component={component} 
                    data={item} 
                  />
                ))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
});

const PreviewDocument: React.FC<PreviewDocumentProps> = ({ template, chunkedData, columnsPerRow: initialColumns }) => {
  const [columnsPerRow, setColumnsPerRow] = useState<number>(initialColumns);
  
  // Debounce column changes
  const debouncedColumnsPerRow = useDebounce(columnsPerRow, 300);

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">{'Sav'}</h1>
      <div className="flex items-center space-x-2">
        <label htmlFor="columnsPerRow">Columns per row:</label>
        <input
          id="columnsPerRow"
          type="number"
          value={columnsPerRow}
          onChange={(e) => setColumnsPerRow(Math.min(Math.max(1, parseInt(e.target.value, 10)), 6))}
          min={1}
          max={6}
          className="w-20"
        />
      </div>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => window.print()}
      >
        Print Preview
      </button>
      <PDFViewer width="100%" height={600}>
        <PDFDocument 
          template={template} 
          chunkedData={chunkedData} 
          columnsPerRow={debouncedColumnsPerRow} 
        />
      </PDFViewer>
    </div>
  );
};

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default PreviewDocument;