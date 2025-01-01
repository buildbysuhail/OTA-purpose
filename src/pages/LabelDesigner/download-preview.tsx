'use client'

import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import JsBarcode from 'jsbarcode';
import { DesignerElementType, PlacedComponent, QRCodeProps, TemplateState } from "../InvoiceDesigner/Designer/interfaces";
import { Style } from '@react-pdf/types';
import FontRegistration from './fontRegister';
import { QRCodeSVG } from "qrcode.react";
import { createRoot } from 'react-dom/client';

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
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [qrCodeImages, setQrCodeImages] = useState<{ [key: string]: string }>({});
  const [adjustedComponents, setAdjustedComponents] = useState<PlacedComponent[]>([]);
  const pxToPoint = (px: number) => px * (72 / 96);
  let paperWidth: string, paperHeight: string;
  const paperSize = template?.propertiesState?.pageSize || "A4";

  switch (paperSize) {
    case "A5":
      paperWidth = "420pt"; // 5.83in x 8.27in
      paperHeight = "595pt";
      break;
    case "A4":
      paperWidth = "589pt"; // 8.27in x 11.69in
      paperHeight = "842pt";
      break;
    case "LETTER":
      paperWidth = "612pt"; // 8.5in x 11in
      paperHeight = "792pt";
      break;
    case "3Inch":
      paperWidth = "216pt"; // 3in x 6in
      paperHeight = "432pt";
      break;
    case "4Inch":
      paperWidth = "288pt"; // 4in x 8in
      paperHeight = "576pt";
      break;
  }

  const calculateRowHeight = (row: any, columns: any[], fontSize: number = 12) => {
    // Base padding (top and bottom)
    const padding = pxToPoint(10); // 5px top + 5px bottom
    
    // Calculate maximum content height across all columns in this row
    const maxContentHeight = columns.reduce((maxHeight, column) => {
      const content = row[column.field]?.toString() || '';
      const charsPerLine = Math.floor(pxToPoint(column.width) / (fontSize * 0.6)); // Approximate chars that fit per line
      const lines = Math.ceil(content.length / charsPerLine);
      const contentHeight = lines * (fontSize * 1.2); // fontSize * 1.2 for line height
      return Math.max(maxHeight, contentHeight);
    }, 0);

    return maxContentHeight + (padding * 2);
  };

  useEffect(() => {
    if (template?.barcodeState?.placedComponents && data) {
      const components = [...template.barcodeState.placedComponents];
      
      // Find all table components
      const tables = components.filter(comp => comp.type === DesignerElementType.table);
      
      tables.forEach(table => {
        // Calculate header height
        const headerHeight = pxToPoint(30); // Fixed header height
        
        // Calculate total height of all rows based on content
        let totalRowsHeight = 0;
        if (data.details && Array.isArray(data.details)) {
          totalRowsHeight = data.details.reduce((total:any, row:any) => {
            const rowHeight = calculateRowHeight(row, table.tableProps.columns);
            return total + rowHeight;
          }, 0);
        }
        
        // Calculate initial table height (header + minimum row height)
        const initialTableHeight = headerHeight + pxToPoint(25); // Minimum single row height
        
        // Calculate actual table height
        const actualTableHeight = headerHeight + totalRowsHeight;
        
        // Calculate the difference in height
        const heightDifference = actualTableHeight - initialTableHeight;
        
        // Find and adjust components below this table
        components.forEach((comp, index) => {
          if (comp.id !== table.id && comp.y > (table.y + initialTableHeight)) {
            components[index] = {
              ...comp,
              y: comp.y + heightDifference
            };
          }
        });
      });
      
      setAdjustedComponents(components);
    }
  }, [template?.barcodeState?.placedComponents, data]);

  // Generate QR code images
  useEffect(() => {
    const generateQRCodeImages = async () => {
      const images: { [key: string]: string } = {};
      
      if (template?.barcodeState?.placedComponents) {
        const qrComponents = template.barcodeState.placedComponents
          .filter(x => x.type === DesignerElementType.qrCode);

        for (const component of qrComponents) {
          const qrCodeProps = component.qrCodeProps as QRCodeProps;
          const imageData = await convertQRToImage({
            value: qrCodeProps.value || '',
            size: component.width || 128,
            level: qrCodeProps.level || 'L',
            marginSize: qrCodeProps?.marginSize || 1,
            bgColor: qrCodeProps.bgColor || '#FFFFFF',
            fgColor: qrCodeProps.fgColor || '#000000',
            imageSettings: qrCodeProps?.imageSettings
          });
          images[component.id] = imageData;
        }
      }
      
      setQrCodeImages(images);
    };

    generateQRCodeImages();
  }, [template?.barcodeState?.placedComponents]);

  // Convert QR code to image
  const convertQRToImage = async (qrProps: any): Promise<string> => {
    // Create a temporary div to render the QR code
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
  
    // Render the QR code SVG
    const qrElement = <QRCodeSVG 
      value={qrProps.value || ''}
      size={qrProps.size || 128}
      level={qrProps.level || 'L'}
      marginSize={qrProps.marginSize || 1}
      bgColor={qrProps.bgColor || '#FFFFFF'}
      fgColor={qrProps.fgColor || '#000000'}
    />;
  
    // Create root and render
    const root = createRoot(tempDiv);
    root.render(qrElement);
  
    // Convert SVG to canvas
    const svgElement = tempDiv.querySelector('svg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (svgElement && ctx) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      // Use HTMLImageElement explicitly
      const img = new window.Image();
      
      return new Promise<string>((resolve) => {
        img.onload = () => {
          canvas.width = qrProps.size || 128;
          canvas.height = qrProps.size || 128;
          ctx.drawImage(img as CanvasImageSource, 0, 0);
          const pngData = canvas.toDataURL('image/png');
          // Clean up
          root.unmount();
          document.body.removeChild(tempDiv);
          resolve(pngData);
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      });
    }
    
    // Clean up if we didn't create an image
    root.unmount();
    document.body.removeChild(tempDiv);
    return '';
  };

  useEffect(() => {
    const generateBarcodeImage = (
      barcodeComponent: any,
      item: any,
      templateGroup: string
    ): { key: string; image: string } | null => {
      const canvas = document.createElement('canvas');
      canvas.height = barcodeComponent.height;
      canvas.width = barcodeComponent.width;
      // Calculate the barWidth based on the component width and the number of characters
      const barcodeText = barcodeComponent.barcodeProps?.field || '';
      const barcodeKey = `${barcodeComponent.id}`;
      try {
        JsBarcode(canvas, barcodeText, {
          ...barcodeComponent.barcodeProps,
          format: barcodeComponent.barcodeProps?.format ?? "CODE128",
          width: barcodeComponent.barcodeProps.barWidth,
          margin: barcodeComponent.barcodeProps?.margin || 0,
          background: barcodeComponent.barcodeProps?.background || "#FFFFFF",
          lineColor: barcodeComponent.barcodeProps?.lineColor || "#000000",
          textAlign: barcodeComponent.barcodeProps?.textAlign,
          height: pxToPoint(barcodeComponent.height),
          marginBottom: 0,
          displayValue: barcodeComponent.barcodeProps.showText,
          valid: (valid: boolean) => {
            if (!valid) {
              throw new Error("Invalid barcode");
            }
          },
          fontSize: barcodeComponent.barcodeProps?.fontSize || 21,
          textMargin: barcodeComponent.barcodeProps?.textMargin || 5,
        });
    
        const image = canvas.toDataURL('image/png');
        return { key: barcodeKey, image };
      } catch (error) {
        console.error("Error generating barcode:", error);
        return null;
      }
    };
    
    const generateBarcodeImages = async () => {
      const images: { [key: string]: string } = {};
      if (template?.barcodeState?.placedComponents) {
        template.barcodeState?.placedComponents?.filter(x => x.type == DesignerElementType.barcode)?.forEach((barcodeComponent) => {
          const result = generateBarcodeImage(
            barcodeComponent,
            data,
            template?.propertiesState?.template_group || ""
          );
          if (result) {
            images[result.key] = result.image;
          }
        }); 
      }

      setBarcodeImages(images);
    }; 
    generateBarcodeImages();
  }, [template?.barcodeState?.placedComponents]);

  const renderComponent = (component: PlacedComponent, data: any) => {
    const baseStyle: Style = {
      position: 'absolute',
      left: component.x,
      top: component.y,
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
        const barcodeKey = `${component.id}`;
        return barcodeImages[barcodeKey] ? (
          <Image
            key={barcodeKey}
            src={barcodeImages[barcodeKey]}
            style={{
              ...baseStyle,
              height: pxToPoint(component.height),
              width: pxToPoint(component.width),
            }}
          />
        ) : null;

      case DesignerElementType.line:
        return (
          <View 
            key={component.id} 
            style={{
              ...baseStyle,
              width: component.lineHeight ? pxToPoint(component.lineHeight) : "100%",
              borderTop: `${component?.lineThickness || 1}px ${
                component?.lineType || "solid"
              } ${component?.lineColor || "black"}`,
            }}
          />
        );

      case DesignerElementType.image:
        return (
          <Image
            key={component.id}
            src={component.content}
            style={{
              ...baseStyle,
              width: component.width,
              height: component.height,
              objectFit: component.imgFit as "cover" | "contain" | "fill" | "none" | "scale-down" || "cover",
            }}
          />
        );

      case DesignerElementType.qrCode:
        return qrCodeImages[component.id] ? (
          <Image
            key={component.id}
            src={qrCodeImages[component.id]}
            style={{
              ...baseStyle,
              width: "auto",
              height: "auto"
            }}
          />
        ) : null;

      case DesignerElementType.table:
        return (
          <View key={component.id} style={baseStyle}>
            {/* Header Row */}
            <View style={{ flexDirection: 'row' }}>
              {component.tableProps.columns.map((column, index) => (
                <View 
                  key={index} 
                  style={{ 
                    width: pxToPoint(column.width), 
                    padding: 5,
                    border: component.tableProps.showBorder ? "1px solid #ccc" : "none",
                    backgroundColor: column.bgColor || 'transparent'
                  }}
                >
                  <Text style={{
                    fontFamily: column.font || 'Roboto',
                    fontSize: column.fontSize || 12,
                    fontStyle: column.fontStyle || "normal",
                    textAlign: column.textAlign || "left",
                    color: column.textColor || 'black'
                  }}>
                    {column.caption || ''}
                  </Text>
                </View>
              ))}
            </View>
    
            {/* Data Rows */}
            {data && data.details && Array.isArray(data.details) && data.details.map((row: any, rowIndex: number) => (
              <View key={rowIndex} style={{ flexDirection: 'row' }}>
                {component.tableProps.columns.map((column, colIndex) => {
                  const content = row[column.field]?.toString() || '';
                  const rowHeight = calculateRowHeight(row, [column], column.fontSize || 12);
                  
                  return (
                    <View 
                      key={colIndex} 
                      style={{ 
                        width: pxToPoint(column.width),
                        minHeight: rowHeight,
                        padding: pxToPoint(5),
                        border: component.tableProps.showBorder ? "1px solid #ccc" : "none",
                        backgroundColor: 'transparent'
                      }}
                    >
                      <Text style={{
                        fontFamily: column.font || 'Roboto',
                        fontSize: column.fontSize || 12,
                        fontStyle: column.fontStyle || "normal",
                        textAlign: column.textAlign || "left",
                        color: column.textColor || 'black'
                      }}>
                        {content}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        );

      case DesignerElementType.area:
        return (
          <View
            key={component.id}
            style={{
              ...baseStyle,
              width: component.areaProps?.width,
              height: component.areaProps?.height,
              backgroundColor: component.areaProps?.bgColor ?? "white",
            }}
          />
        );

      default:
        return null;
    }
  };  

  const PreviewDocument = () => (
    <Document>
      <FontRegistration />
      <Page size={{
        width: "auto",
        height: "auto",
      }} style={styles.page}>
        <View
          style={{
            width: template?.propertiesState?.pageSize === "Custom"
              ? `${template.propertiesState?.width}pt`
              : template?.propertiesState?.orientation === "portrait" ? paperWidth : paperHeight,

            height: template?.propertiesState?.pageSize === "Custom"
              ? `${template.propertiesState?.height}pt`
              : template?.propertiesState?.orientation === "portrait" ? paperHeight : paperWidth,

            paddingTop: template?.propertiesState?.padding?.top ?? 0,
            paddingBottom: template?.propertiesState?.padding?.bottom ?? 0,
            paddingLeft: template?.propertiesState?.padding?.left ?? 0,
            paddingRight: template?.propertiesState?.padding?.right ?? 0, 

            position: "relative",
          }}
        >
          {adjustedComponents?.map((component) => renderComponent(component, data))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="flex flex-col space-y-4 p-4">
      <PDFViewer width="100%" height={700}>
        <PreviewDocument />
      </PDFViewer>
    </div>
  );
}