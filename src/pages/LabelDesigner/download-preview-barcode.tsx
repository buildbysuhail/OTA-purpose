// DownloadBarcodePreview.tsx

import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import JsBarcode from 'jsbarcode';
import { DesignerElementType } from "../InvoiceDesigner/Designer/interfaces";
import { Style } from '@react-pdf/types';
import FontRegistration from './fontRegister';
import { generateBarcodeDataUrl } from '../../utilities/barcode';

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
  template?: any;
  data?: any;
  docTitle?: string;
  isMaximized?: boolean;
  modalHeight?: any;
}

// --- PDF Document Component ---
export function BarcodePDFDocument({ template, data, barcodeImages }: { template: any, data: any, barcodeImages: any }) {
  const pxToPoint = (px: number) => px * (72 / 96);

  // ...chunkedData logic (copy from your useEffect, but as a function)
  const columnsPerRow = template?.barcodeState?.labelState?.columnsPerRow ?? 2;
  const expandedData = data?.reduce((acc: any, item: any) => {
    const labelCount = item.labelCount || 1;
    for (let i = 0; i < labelCount; i++) acc.push(item);
    return acc;
  }, []) || [];

  const chunkedData = expandedData.reduce((resultArray: any, item: any, index: number) => {
    const chunkIndex = Math.floor(index / columnsPerRow);
    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  const renderComponent = (component: any, item: any) => {
    const baseStyle: Style = {
      position: 'absolute',
      left: pxToPoint(component.x),
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
              {item[component.content] || " "}
            </Text>
          </View>
        );
      case DesignerElementType.barcode:
        const barcodeKey = `${item.siNo}-${component.id}`;
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

  return (
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
                {template?.barcodeState?.placedComponents?.map((component: any) => renderComponent(component, item))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}

// --- Preview Wrapper (for UI) ---
export default function DownloadBarcodePreview(props: DownloadPreviewProps) {
  const { template, docTitle = "Document Preview", data, isMaximized, modalHeight } = props;
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [previewHeight, setPreviewHeight] = useState<{ mobile: number; windows: number }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 200;
    let gridHeightWindows = modalHeight - 100;
    setPreviewHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  useEffect(() => {
    const images: { [key: string]: string } = {};
    if (template?.barcodeState?.placedComponents) {
      data?.forEach((item: any) => {
        template.barcodeState?.placedComponents?.forEach((comp: any) => {
          if (comp.type === DesignerElementType.barcode && comp.barcodeProps) {
        const key = `${item.siNo}-${comp.id}`;
        images[key] = generateBarcodeDataUrl(
          item.autoBarcode || '',
          comp.barcodeProps,
          comp.width,
          comp.height
        );
          }
        });
      });
    }
    setBarcodeImages(images);
  }, [template?.barcodeState?.placedComponents, data]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      <PDFViewer width="100%" height={previewHeight.windows}>
        <BarcodePDFDocument template={template} data={data} barcodeImages={barcodeImages} />
      </PDFViewer>
    </div>
  );
}