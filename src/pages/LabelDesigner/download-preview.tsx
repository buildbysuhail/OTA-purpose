import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer, } from "@react-pdf/renderer";
import JsBarcode from 'jsbarcode';
import { DesignerElementType, PlacedComponent, TemplateState } from "../InvoiceDesigner/Designer/interfaces";
import { Style } from '@react-pdf/types';
import FontRegistration from './fontRegister';

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
  
  // const [columnsPerRow, setColumnsPerRow] = useState(2);
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [chunkedData, setChunkedData] = useState<any>();
  useEffect(() => {
    const columnsPerRow = template?.barcodeState?.labelState?.columnsPerRow ?? 2;
    const _chunkedData = data?.reduce((resultArray: any, item: any, index: number) => {
      const chunkIndex = Math.floor(index / columnsPerRow)
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
    setChunkedData(_chunkedData);
  }, [data, template?.barcodeState?.labelState?.columnsPerRow])

  useEffect(() => {
    const generateBarcodeImages = async () => {
      const images: { [key: string]: string } = {};

      if (template?.barcodeState?.placedComponents) {
        data?.forEach((item: any) => {
          template.barcodeState?.placedComponents?.forEach((barcodeComponent) => {
            if (barcodeComponent.type === DesignerElementType.barcode && barcodeComponent.barcodeProps) {
              
              const canvas = document.createElement('canvas');
              canvas.height = barcodeComponent.height;
              canvas.width = barcodeComponent.width;
              // canvas.width = template?.barcodeState?.labelState?.labelWidth??200;
              // canvas.
              JsBarcode(canvas, item?.autoBarcode, {
                displayValue: false,
                ...barcodeComponent.barcodeProps,
                format: barcodeComponent.barcodeProps?.format ?? "CODE128", // Barcode format
                width: barcodeComponent.barcodeProps?.barWidth || 2, // Set bar width or default to 2
                height: barcodeComponent.barcodeProps?.height || 75,    // Set height or default to 75
                margin: barcodeComponent.barcodeProps?.margin || 0,    // Margin around the barcode
                background: barcodeComponent.barcodeProps?.background || "#FFFFFF", // Background color
                lineColor: barcodeComponent.barcodeProps?.lineColor || "#000000",   // Line color for bars
                // displayValue: barcodeComponent.barcodeProps?.showText,  // Display text below the barcode
                textAlign: barcodeComponent.barcodeProps?.textAlign,    // Center-align text
                font: "monospace",      // Font family for text
                fontSize: barcodeComponent.barcodeProps?.fontSize || 21, // Font size
                textMargin: barcodeComponent.barcodeProps?.textMargin || 5, // Margin between bars and text
              });
              images[`${item.siNo}-${barcodeComponent.id}`] = canvas.toDataURL('image/png');
            }
          });
        });
      }

      setBarcodeImages(images);
    };

    generateBarcodeImages();
  }, [template?.barcodeState?.placedComponents]);

  const renderComponent = (component: PlacedComponent, data: any) => {
    debugger;
    const baseStyle: Style = {
      position: 'absolute',
      left: component.x,
      top: component.y,
      transform: `rotate(${component.rotate || 0}deg)`, 
      transformOrigin: "center",
      
    };
console.log("rotate",component.rotate);

    switch (component.type) {
      case DesignerElementType.text:
        return (
          <Text
            key={component.id}
            style={{
              ...baseStyle,
              fontFamily: component.font|| 'Roboto',
              fontSize: component.fontSize || 12,
              fontStyle: component.fontStyle || "normal",
              textAlign: component.textAlign || "center",
              height: component.height || 50,
              width: component.width || 50,
            }}
          >
            {component.content}
          </Text>
        );

      case DesignerElementType.field:
        return (
          <View key={component.id} style={baseStyle}>
          <Text
            style={{
              fontFamily: component.font || 'Roboto',
              fontSize: component.fontSize || 12,
              fontStyle: component.fontStyle || "normal",
              textAlign: component.textAlign || "center",
              height: component.height || 50,
              width: component.width || 50,
            }}
          >
            {component.content}
          </Text>
        </View>
        );

      case DesignerElementType.barcode:
        const barcodeKey = `${data.siNo}-${component.id}`;
        return barcodeImages[barcodeKey] ? (
          <Image
            key={barcodeKey}
            src={barcodeImages[barcodeKey]}
            style={{
              ...baseStyle,
              height: component.height || 50,
              width: component.width || 50,
            }}
          />
        ) : null;

      default:
        return null;
    }
  };

  const PreviewDocument = () => (
    <Document>
       <FontRegistration />
      <Page size={{
         width:
         (template?.barcodeState?.labelState?.labelWidth ?? 300) * (template?.barcodeState?.labelState?.columnsPerRow ?? 1),

       height:
         (template?.barcodeState?.labelState?.labelHeight ?? 300) * (template?.barcodeState?.labelState?.rowsPerPage ?? 1), 
      }} style={styles.page}>
        {chunkedData?.map((row: any, rowIndex: any) => (
          <View style={styles.row}>
            {row?.map((item: any) => (
              <View
                key={item.siNo}
                style={{
                  width: template?.barcodeState?.labelState?.labelWidth || 200,
                  height: template?.barcodeState?.labelState?.labelHeight || 200,
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
      {/* <div className="flex items-center space-x-2">
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
      </div> */}
      <PDFViewer width="100%" height={700}>
        <PreviewDocument />
      </PDFViewer>
    </div>
  );
}