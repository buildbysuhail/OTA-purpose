'use client'

import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
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
   isMaximized?: boolean;
  modalHeight?: any;
}

export default function Component({ template, docTitle = "Document Preview", data,isMaximized,modalHeight }: DownloadPreviewProps = {}) {
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [chunkedData, setChunkedData] = useState<any>();
   const [previewHeight, setPreviewHeight ]= useState<{
        mobile: number;
        windows: number;
      }>({ mobile: 500, windows: 500 });
  const pxToPoint = (px: number) => px * (72 / 96);
  
  useEffect(() => {
          let gridHeightMobile = modalHeight - 200;
          let gridHeightWindows =  modalHeight - 100;
          setPreviewHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
        }, [isMaximized, modalHeight]);
  
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
    debugger;
    setChunkedData(_chunkedData);
  }, [ template?.barcodeState?.labelState?.columnsPerRow])

 useEffect(() => {
  const generateBarcodeImages = async () => {
    const images: { [key: string]: string } = {};

    if (template?.barcodeState?.placedComponents) {
      data?.forEach((item: any) => {
        template.barcodeState?.placedComponents?.forEach((barcodeComponent) => {
          if (barcodeComponent.type === DesignerElementType.barcode && barcodeComponent.barcodeProps) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size with proper scaling for high DPI
            const scale = window.devicePixelRatio || 1;
            const canvasWidth = barcodeComponent.width * scale;
            const canvasHeight = barcodeComponent.height * scale;
            
          
            canvas.height = canvasHeight;
            // canvas.width = canvasWidth;
            
            // // // Scale the canvas back down using CSS
            // canvas.style.width = barcodeComponent.width + "px";
            canvas.style.height = barcodeComponent.height+ "px" ;
            
            // Scale the drawing context so everything draws at the higher resolution
            if (ctx) {
              ctx.scale(scale, scale);
            }
            
            const barcodeText = item?.autoBarcode || '';
      
            JsBarcode(canvas, barcodeText, {
              ...barcodeComponent.barcodeProps,
              width: barcodeComponent.barcodeProps?.barWidth||2, // Reduced width for better text rendering
              height:(barcodeComponent.height) , // Ensure minimum height for text
              margin: barcodeComponent.barcodeProps?.margin, // Add some margi
              marginBottom:0,
              textMargin: barcodeComponent.barcodeProps?.textMargin || 2, // Ensure text is not too close to the barcode
              displayValue: barcodeComponent.barcodeProps?.showText,
              fontSize: barcodeComponent.barcodeProps?.fontSize, // Dynamic font size
              font: barcodeComponent.barcodeProps.font || "Roboto",
              textAlign: barcodeComponent.barcodeProps?.textAlign || "center",
              textPosition: "bottom",
              background: barcodeComponent.barcodeProps?.background || "#ffffff",
              lineColor: barcodeComponent.barcodeProps?.lineColor || "#000000",
              valid: (valid: boolean) => {
                if (!valid) {
                  console.warn(`Invalid barcode for ${barcodeText}`);
                  // Don't throw error, just log warning
                }
              },
            });
            
            images[`${item.siNo}-${barcodeComponent.id}`] = canvas.toDataURL('image/png', 2.0);
          }
        });
      });
    }

    setBarcodeImages(images);
  };

  generateBarcodeImages();
}, [template?.barcodeState?.placedComponents, data]); // Added data as dependency

  const renderComponent = (component: PlacedComponent, data: any) => {
    
    const baseStyle: Style = {
      position: 'absolute',
      left:pxToPoint(component.x) ,
      top: pxToPoint(component.y),
      transform: `rotate(${component.rotate || 0}deg)`,
      transformOrigin: "center",
    };

    switch (component.type) {
      case DesignerElementType.text:
        return (
          <Text
            key={component.id}
            style={{
              ...baseStyle,
              fontFamily: component.font || 'Roboto',
              fontSize: (component.fontSize) || 12,
              fontStyle: component.fontStyle || "normal",
              textAlign: component.textAlign || "center",
              height: pxToPoint(component.height) || 50,
              width: pxToPoint(component.width) || 50,
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
                fontSize: (component.fontSize) || 12,
                fontStyle: component.fontStyle || "normal",
                textAlign: component.textAlign || "center",
                height: pxToPoint(component.height) || 50,
                width: pxToPoint(component.width) || 50,
              }}
            >
              {data[component.content] || "N/A"}
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
              height:pxToPoint(component.height) || 50,
              width: pxToPoint(component.width) || 50,
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
        width: pxToPoint(
          (template?.barcodeState?.labelState?.labelWidth ?? 300) *
          (template?.barcodeState?.labelState?.columnsPerRow ?? 1)
        ) +
          (
            chunkedData &&
              chunkedData[0] &&
              chunkedData[0].length > 1
              ? pxToPoint((template?.barcodeState?.labelState?.gap?.hgap ?? 0) * (chunkedData[0].length - 1))
              : 0
          ),

        height: pxToPoint(
          (template?.barcodeState?.labelState?.labelHeight ?? 300) *
          (template?.barcodeState?.labelState?.rowsPerPage ?? 1)
        ) +
          (
            template?.barcodeState?.labelState?.rowsPerPage &&
              template.barcodeState.labelState.rowsPerPage > 1
              ? pxToPoint((template?.barcodeState?.labelState?.gap?.vgap ?? 0) * (template.barcodeState.labelState.rowsPerPage - 1))
              : 0
          ),
      }} style={styles.page}>
        {chunkedData?.map((label: any, index: number) => (
          <View key={index}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: index % (template?.barcodeState?.labelState?.rowsPerPage || 1) !== 0
                ? pxToPoint(template?.barcodeState?.labelState?.gap?.vgap || 0)
                : '0pt',
            }}>
            {label?.map((item: any, colIndex: number) => (
              <View
                key={item.siNo}
                style={{
                  width: pxToPoint(template?.barcodeState?.labelState?.labelWidth || 200),
                  height: pxToPoint(template?.barcodeState?.labelState?.labelHeight || 200),
                  position: "relative",
                  marginLeft: colIndex > 0 ? pxToPoint(template?.barcodeState?.labelState?.gap?.hgap || 0) : '0pt'
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
      <PDFViewer width="100%" height={previewHeight.windows}>
        <PreviewDocument />
      </PDFViewer>
    </div>
  );
}