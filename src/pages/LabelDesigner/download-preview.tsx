import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import JsBarcode from 'jsbarcode';
import { DesignerElementType, PlacedComponent, TemplateState } from "../InvoiceDesigner/Designer/interfaces";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});


export interface DownloadPreviewProps {
  template?: TemplateState;
  data?: any;
  docTitle?: string;
}

export default function Component({ template, docTitle = "Document Preview", data }: DownloadPreviewProps = {}) {
  debugger;
  const [columnsPerRow, setColumnsPerRow] = useState(2);
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [chunkedData, setChunkedData] = useState<any>();
  useEffect(() => {
    const _chunkedData = data?.reduce((resultArray: any, item: any, index: number) => {
      const chunkIndex = Math.floor(index / columnsPerRow)
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
    setChunkedData(_chunkedData);
  }, [data,columnsPerRow])
  useEffect(() => {
    const generateBarcodeImages = async () => {
      const images: { [key: string]: string } = {};

      if (template?.barcodeState?.placedComponents) {
        data?.forEach((item: any) => {
          template.barcodeState?.placedComponents?.forEach((barcodeComponent) => {
            if (barcodeComponent.type === DesignerElementType.barcode && barcodeComponent.barcodeProps) {
              const canvas = document.createElement('canvas');
              JsBarcode(canvas, item?.autoBarcode, {
                ...barcodeComponent.barcodeProps,
                format: barcodeComponent.barcodeProps?.format ?? "CODE128", // Barcode format
                width: barcodeComponent.barcodeProps?.barWidth || 2, // Set bar width or default to 2
                height: barcodeComponent.barcodeProps?.height || 75,    // Set height or default to 75
                margin: barcodeComponent.barcodeProps?.margin || 16,    // Margin around the barcode
                background: barcodeComponent.barcodeProps?.background || "#FFFFFF", // Background color
                lineColor: barcodeComponent.barcodeProps?.lineColor || "#000000",   // Line color for bars
                displayValue: barcodeComponent.barcodeProps?.showText,  // Display text below the barcode
                textAlign: barcodeComponent.barcodeProps?.textAlign,    // Center-align text
                font: "monospace",      // Font family for text
                fontSize: barcodeComponent.barcodeProps?.fontSize || 21, // Font size
                textMargin: barcodeComponent.barcodeProps?.textMargin || 5, // Margin between bars and text
              });
              images[`${item.id}-${barcodeComponent.id}`] = canvas.toDataURL('image/png');
            }
          });
        });
      }

      setBarcodeImages(images);
    };

    generateBarcodeImages();
  }, [template?.barcodeState?.placedComponents]);

  const renderComponent = (component: PlacedComponent, data: any) => {
    const baseStyle = {
      position: 'absolute',
      left: component.x,
      top: component.y,
    };

    switch (component.type) {
      case DesignerElementType.text:
        return (
          <Text
            key={component.id}
            style={{
              ...baseStyle,
              fontSize: component.barcodeProps?.fontSize || 12,
              fontStyle: component.barcodeProps?.fontStyle || "normal",
              textAlign: component.barcodeProps?.textAlign || "left",
            }}
          >
            {component.content}
          </Text>
        );

      case DesignerElementType.field:
        return (
          <Text
            key={component.id}
            style={{
              ...baseStyle,
              fontSize: 12,
            }}
          >
            {data[component.content] || "N/A"}
          </Text>
        );

      case DesignerElementType.barcode:
        const barcodeKey = `${data.id}-${component.id}`;
        return barcodeImages[barcodeKey] ? (
          <Image
            key={barcodeKey}
            src={barcodeImages[barcodeKey]}
            style={{
              ...baseStyle,
              width: component.width || 100,
              height: component.height || 50,
            }}
          />
        ) : null;

      default:
        return null;
    }
  };

  const PreviewDocument = () => (
    <Document>
      <Page size={{ width: (template?.propertiesState?.width || 200) * columnsPerRow, height: 'auto' }} style={styles.page}>
        {chunkedData?.map((row: any, rowIndex: any) => (
          <View style={styles.row}>
            {row?.map((item: any) => (
              <View
                key={item.id}
                style={{
                  width: template?.propertiesState?.width || 200,
                  height: template?.propertiesState?.height || 200,
                  position: "relative",
                }}
              >
                {template?.barcodeState?.placedComponents?.map((component) => renderComponent(component, item))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">{docTitle}</h1>
      <div className="flex items-center space-x-2">
        <label htmlFor="columnsPerRow">Columns per row:</label>
        <input
          id="columnsPerRow"
          type="number"
          value={columnsPerRow}
          onChange={(e) => setColumnsPerRow(Math.max(1, Math.min(6, parseInt(e.target.value, 10))))}
          min={1}
          max={6}
          className="w-20"
        />
      </div>
      <PDFViewer width="100%" height={600}>
        <PreviewDocument />
      </PDFViewer>
    </div>
  );
}