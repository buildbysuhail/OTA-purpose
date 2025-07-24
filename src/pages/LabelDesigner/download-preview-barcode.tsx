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
      left: (component.x),
      top: (component.y),
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
              height: (component.height) || 50,
              width: (component.width) || 50,
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
                height: (component.height) || 50,
                width: (component.width) || 50,
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
               height:(component.height),
               width: (component.width),
            }}
          />
        ) : null;
      default:
        return null;
    }
  };
  const debugYourSizeCalculation = (template: any, chunkedData: any) => {
  console.log('=== DEBUGGING YOUR EXACT SIZE CALCULATION ===');
  
  // Extract all the values first
  const labelWidth = template?.barcodeState?.labelState?.labelWidth ?? 300;
  const labelHeight = template?.barcodeState?.labelState?.labelHeight ?? 300;
  const columnsPerRow = template?.barcodeState?.labelState?.columnsPerRow ?? 1;
  const rowsPerPage = template?.barcodeState?.labelState?.rowsPerPage ?? 1;
  const hgap = template?.barcodeState?.labelState?.gap?.hgap ?? 0;
  const vgap = template?.barcodeState?.labelState?.gap?.vgap ?? 0;
  
  // Log all individual values with inch conversions
  console.log('📊 Template Values:');
  console.log('  labelWidth:', labelWidth, 'px =', (labelWidth * 0.75 / 72).toFixed(2), 'inches');
  console.log('  labelHeight:', labelHeight, 'px =', (labelHeight * 0.75 / 72).toFixed(2), 'inches');
  console.log('  columnsPerRow:', columnsPerRow);
  console.log('  rowsPerPage:', rowsPerPage);
  console.log('  hgap:', hgap, 'px =', (hgap * 0.75 / 72).toFixed(2), 'inches');
  console.log('  vgap:', vgap, 'px =', (vgap * 0.75 / 72).toFixed(2), 'inches');
  
  // Log chunked data info
  console.log('📋 Chunked Data:');
  console.log('  chunkedData exists:', !!chunkedData);
  console.log('  chunkedData[0] exists:', !!(chunkedData && chunkedData[0]));
  console.log('  chunkedData[0].length:', chunkedData?.[0]?.length);
  console.log('  chunkedData[0].length > 1:', chunkedData?.[0]?.length > 1);
  console.log('  Total rows in chunkedData:', chunkedData?.length);
  
  // Calculate WIDTH step by step (your exact formula)
  const widthPart1 = labelWidth * columnsPerRow;
  console.log('🔢 WIDTH Calculation:');
  console.log('  Part 1: labelWidth * columnsPerRow =', `${labelWidth} * ${columnsPerRow} =`, widthPart1, 'px =', (widthPart1 * 0.75 / 72).toFixed(2), 'inches');
  
  const hasMultipleColumns = chunkedData && chunkedData[0] && chunkedData[0].length > 1;
  const widthPart2 = hasMultipleColumns 
    ? (hgap * (chunkedData[0].length - 1))
    : 0;
  console.log('  Part 2: Gap calculation');
  console.log('    Has multiple columns?', hasMultipleColumns);
  if (hasMultipleColumns) {
    console.log('    hgap * (chunkedData[0].length - 1) =', `${hgap} * (${chunkedData[0].length} - 1) =`, `${hgap} * ${chunkedData[0].length - 1} =`, widthPart2, 'px =', (widthPart2 * 0.75 / 72).toFixed(2), 'inches');
  } else {
    console.log('    Gap = 0 (single column or no data)');
  }
  
  const totalWidth = widthPart1 + widthPart2;
  console.log('  📏 TOTAL WIDTH:', `${widthPart1} + ${widthPart2} =`, totalWidth, 'px =', (totalWidth * 0.75 / 72).toFixed(2), 'inches');
  
  // Calculate HEIGHT step by step (your exact formula)
  const heightPart1 = labelHeight * rowsPerPage;
  console.log('🔢 HEIGHT Calculation:');
  console.log('  Part 1: labelHeight * rowsPerPage =', `${labelHeight} * ${rowsPerPage} =`, heightPart1, 'px =', (heightPart1 * 0.75 / 72).toFixed(2), 'inches');
  
  const hasMultipleRows = template?.barcodeState?.labelState?.rowsPerPage && 
                         template.barcodeState.labelState.rowsPerPage > 1;
  const heightPart2 = hasMultipleRows 
    ? (vgap * (template.barcodeState.labelState.rowsPerPage - 1))
    : 0;
  console.log('  Part 2: Gap calculation');
  console.log('    Has multiple rows?', hasMultipleRows);
  if (hasMultipleRows) {
    console.log('    vgap * (rowsPerPage - 1) =', `${vgap} * (${rowsPerPage} - 1) =`, `${vgap} * ${rowsPerPage - 1} =`, heightPart2, 'px =', (heightPart2 * 0.75 / 72).toFixed(2), 'inches');
  } else {
    console.log('    Gap = 0 (single row)');
  }
  
  const totalHeight = heightPart1 + heightPart2;
  console.log('  📏 TOTAL HEIGHT:', `${heightPart1} + ${heightPart2} =`, totalHeight, 'px =', (totalHeight * 0.75 / 72).toFixed(2), 'inches');
  
  // Final results
  console.log('🎯 FINAL RESULTS:');
  console.log('  Page Width (pixels):', totalWidth);
  console.log('  Page Height (pixels):', totalHeight);
  console.log('  Page Width (points):', totalWidth * 0.75);
  console.log('  Page Height (points):', totalHeight * 0.75);
  console.log('  Page Width (inches):', (totalWidth * 0.75 / 72).toFixed(2));
  console.log('  Page Height (inches):', (totalHeight * 0.75 / 72).toFixed(2));
  
  // Compare with what you see in preview
  console.log('🔍 ANALYSIS & COMPARISON:');
  console.log('  📊 COMPARISON TABLE:');
  console.log('  ┌─────────────────────┬──────────────┬──────────────┐');
  console.log('  │ Source              │ Width        │ Height       │');
  console.log('  ├─────────────────────┼──────────────┼──────────────┤');
  console.log(`  │ Your calculation    │ ${(totalWidth * 0.75 / 72).toFixed(2)}" │ ${(totalHeight * 0.75 / 72).toFixed(2)}" │`);
  console.log('  │ PDF Preview shows   │ 11.01"       │ 15.60"       │');
  console.log('  │ Should be (approx)  │ 2-3"         │ 4-5"         │');
  console.log('  └─────────────────────┴──────────────┴──────────────┘');
  
  if (totalWidth > 1000 || totalHeight > 1000) {
    console.log('  ❌ PROBLEM: Your template values are too large!');
    console.log('  💡 SOLUTION: Reduce labelWidth/labelHeight in your template');
    console.log('  🎯 SUGGESTED VALUES:');
    console.log('    labelWidth: 100-150 px (instead of', labelWidth, 'px)');
    console.log('    labelHeight: 80-120 px (instead of', labelHeight, 'px)');
  }
  
  return {
    width: totalWidth,
    height: totalHeight,
    widthPoints: totalWidth * 0.75,
    heightPoints: totalHeight * 0.75
  };
};
const calculatedSize = debugYourSizeCalculation(template, chunkedData);
  return (
    <Document>
      <FontRegistration />
      <Page size={{
        width:calculatedSize.width,
        height: calculatedSize.height,
      }} style={styles.page}>
        {chunkedData?.map((label: any, index: number) => (
          <View key={index}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: index % (template?.barcodeState?.labelState?.rowsPerPage || 1) !== 0
                ? (template?.barcodeState?.labelState?.gap?.vgap || 0)
                : '0pt',
            }}>
            {label?.map((item: any, colIndex: number) => (
              <View
                key={item.siNo}
                style={{
                  width: (template?.barcodeState?.labelState?.labelWidth || 200),
                  height: (template?.barcodeState?.labelState?.labelHeight || 200),
                  position: "relative",
                  marginLeft: colIndex > 0 ? (template?.barcodeState?.labelState?.gap?.hgap || 0) : '0pt'
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