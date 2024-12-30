'use client'

import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
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
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [chunkedData, setChunkedData] = useState<any>();
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

  useEffect(() => {
    if(template?.propertiesState?.template_group === "barcode"){
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
      
    }
  }, [data, template?.barcodeState?.labelState?.columnsPerRow])

  useEffect(() => {
    
    // if(template?.propertiesState?.template_group === "barcode"){
      const generateBarcodeImage = (
        barcodeComponent: any,
        item: any,
        templateGroup: string
      ): { key: string; image: string } | null => {
        if (barcodeComponent.type !== DesignerElementType.barcode || !barcodeComponent.barcodeProps) {
          return null;
        }
      
        const canvas = document.createElement('canvas');
        canvas.height = pxToPoint(barcodeComponent.height);
        canvas.width = pxToPoint(barcodeComponent.width);
      
        // Calculate the barWidth based on the component width and the number of characters
        const barcodeText =  '34343434';
        const barcodeKey =
          templateGroup === "barcode"
            ? `${item.siNo}-${barcodeComponent.id}`
            : `${barcodeComponent.id}`;
      
        try {
          JsBarcode(canvas, barcodeText, {
            ...barcodeComponent.barcodeProps,
            width: 100,
            format: barcodeComponent.barcodeProps?.format ?? "CODE128",
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
        if(template.propertiesState?.template_group == "barcode") {
          data?.forEach((item: any) => {
            template.barcodeState?.placedComponents?.forEach((barcodeComponent) => {
              const result = generateBarcodeImage(
                barcodeComponent,
                item,
                template?.propertiesState?.template_group || ""
              );
              if (result) {
                images[result.key] = result.image;
              }
            });
          });
        } else {
          template.barcodeState?.placedComponents?.forEach((barcodeComponent) => {
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
        
      }

      setBarcodeImages(images);
    };

    generateBarcodeImages();
  // }
  }, [template?.barcodeState?.placedComponents, data]);

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
              height: pxToPoint(component.height)|| 50,
              width:  pxToPoint(component.width)|| 50,
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
                height: pxToPoint(component.height)|| 50,
                width:  pxToPoint(component.width)|| 50,
              }}
            >
           {
              template?.propertiesState?.template_group === "barcode"
                ? (data[component.content] || "N/A")
                : component.content
            }
            </Text>
          </View>
        );

      case DesignerElementType.barcode:
        
        const barcodeKey = template?.propertiesState?.template_group === "barcode" ? `${data.siNo}-${component.id}`: `${component.id}`;
        return barcodeImages[barcodeKey] ? (
          <Image
            key={barcodeKey}
            src={barcodeImages[barcodeKey]}
            style={{
              ...baseStyle,
              height: pxToPoint(component.height) || 50,
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
      <Page
       size={{
        width: template?.propertiesState?.template_group === "barcode"
        ? pxToPoint(
            (template?.barcodeState?.labelState?.labelWidth ?? 300) *
            (template?.barcodeState?.labelState?.columnsPerRow ?? 1)
          ) +
          (
            chunkedData &&
            chunkedData[0] &&
            chunkedData[0].length > 1
              ? pxToPoint((template?.barcodeState?.labelState?.gap?.hgap ?? 0) * (chunkedData[0].length - 1))
              : 0
          )
        : (
            template?.propertiesState?.pageSize === "Custom"
              ? `${template.propertiesState?.width}pt`
              : (template?.propertiesState?.orientation === "portrait" ? paperWidth : paperHeight)
          ),
      
        height:template?.propertiesState?.template_group === "barcode"  ?
        pxToPoint(
          (template?.barcodeState?.labelState?.labelHeight ?? 300) *
          (template?.barcodeState?.labelState?.rowsPerPage ?? 1)
        ) +
          (
            template?.barcodeState?.labelState?.rowsPerPage &&
              template.barcodeState.labelState.rowsPerPage > 1
              ? pxToPoint((template?.barcodeState?.labelState?.gap?.vgap ?? 0) * (template.barcodeState.labelState.rowsPerPage - 1))
              : 0
          ):(
            template?.propertiesState?.pageSize === "Custom"
            ? `${template.propertiesState?.height}pt`
            : (template?.propertiesState?.orientation === "portrait" ? paperHeight : paperWidth)
          ),
      }}
       style={styles.page}>
        {template?.propertiesState?.template_group === "barcode" ?
         (chunkedData?.map((label: any, index: number) => (
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
        ))):(
        <>
       {/* {template?.barcodeState?.placedComponents?.map((component) => renderComponent(component, data))} */}   
              
                {template?.barcodeState?.placedComponents?.map((component) => renderComponent(component, data))}
              

        </>)}
      </Page>
    </Document>
  );
  const handlePrint = async (blob: Blob) => {
    try {
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create an iframe to handle printing
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);
      
      // Load the PDF in the iframe
      printFrame.src = blobUrl;
      
      // Wait for the iframe to load
      printFrame.onload = () => {
        try {
          // Print the iframe content
          printFrame.contentWindow?.print();
          
          // Cleanup after print dialog closes
          setTimeout(() => {
            document.body.removeChild(printFrame);
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        } catch (error) {
          console.error('Print error:', error);
        }
      };
    } catch (error) {
      console.error('Print setup error:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{docTitle}</h2>
        <BlobProvider document={<PreviewDocument />}>
          {({ blob, loading, error }) => {
            if (loading) {
              return (
                <button disabled className="px-4 py-2 bg-gray-400 text-white rounded">
                  Preparing document...
                </button>
              );
            }

            if (error) {
              return (
                <button disabled className="px-4 py-2 bg-red-600 text-white rounded">
                  Error preparing document
                </button>
              );
            }

            if (!blob) {
              return null;
            }

            return (
              <button
                onClick={() => handlePrint(blob)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Print Document
              </button>
            );
          }}
        </BlobProvider>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm text-gray-600">
          Preview disabled for large documents to prevent browser crashes. 
          Click the print button above to print the document.
        </p>
      </div>
    </div>
  );
}