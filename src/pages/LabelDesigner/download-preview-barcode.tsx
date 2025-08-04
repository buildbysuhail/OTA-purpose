// DownloadBarcodePreview.tsx

import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import JsBarcode from 'jsbarcode';
import { DesignerElementType, TemplateState } from "../InvoiceDesigner/Designer/interfaces";
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
  template?: TemplateState<unknown>;
  data?: any;
  pages?:any;
  docTitle?: string;
  isMaximized?: boolean;
  modalHeight?: any;
}

// --- PDF Document Component ---
export function BarcodePDFDocument({ template, data, barcodeImages }: { template: TemplateState<unknown>, data: any, barcodeImages: any }) {
  const pxToPoint = (px: number) => px * (72 / 96);

 
  const renderComponent = (component: any, item: any) => {
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
              height: component.height,
              width: component.width,
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  const calculatePageSize = (template: TemplateState<unknown>) => {
    const labelWidth = template?.barcodeState?.labelState?.labelWidth ?? 300;
    const labelHeight = template?.barcodeState?.labelState?.labelHeight ?? 300;
    const columnsPerRow = template?.barcodeState?.labelState?.columnsPerRow ?? 1;
    const rowsPerPage = template?.barcodeState?.labelState?.rowsPerPage ?? 1;
    const hgap = template?.propertiesState?.gap?.hgap ?? 0;
    const vgap = template?.propertiesState?.gap?.vgap ?? 0;
    const paddingTop = template?.propertiesState?.padding?.top ?? 0;
    const paddingBottom = template?.propertiesState?.padding?.bottom ?? 0;
    const paddingRight = template?.propertiesState?.padding?.right ?? 0;
    const paddingLeft = template?.propertiesState?.padding?.left ?? 0;

    const totalWidth = (labelWidth * columnsPerRow) + 
                    (vgap * (columnsPerRow - 1)) + 
                      paddingLeft + paddingRight;

    const totalHeight = (labelHeight * rowsPerPage) + 
                       (hgap * (rowsPerPage - 1)) + 
                       paddingTop + paddingBottom;

    return {
      width: totalWidth,
      height: totalHeight,
      paddingTop,
      paddingBottom,
      paddingRight,
      paddingLeft,
    };
  };

  const pageSize = calculatePageSize(template);

 return (
  <Document>
    <FontRegistration />
    {data?.map((page: any, pageIndex: number) => {
      return (
        <Page 
          key={pageIndex}
          size={{
            width: pageSize.width,
            height: pageSize.height,
          }} 
          style={{
            ...styles.page,
            paddingTop: pageSize.paddingTop,
            paddingLeft: pageSize.paddingLeft,
            paddingRight: pageSize.paddingRight,
            paddingBottom: pageSize.paddingBottom
          }}
        >
          {page?.map((row: any, rowIndex: number) => {
            return (
              <View 
                key={`row-${pageIndex}-${rowIndex}`}
                style={{
                  flexDirection: 'row',
                  marginTop: rowIndex > 0 ? (template?.propertiesState?.gap?.hgap || 0) : 0,
                }}
              >
                {row?.map((item: any, itemIndex: number) => {
                  return (
                    <View
                      key={`item-${pageIndex}-${rowIndex}-${itemIndex}`}
                      style={{
                        width: template?.barcodeState?.labelState?.labelWidth || 200,
                        height: template?.barcodeState?.labelState?.labelHeight || 200,
                        position: "relative",
                        marginLeft: itemIndex > 0 ? (template?.propertiesState?.gap?.vgap || 0) : 0,
                      }}
                    >
                      {template?.barcodeState?.placedComponents?.map((component: any, componentIndex: number) => 
                        renderComponent(component, item)
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </Page>
      );
    })}
  </Document>
);
}

// --- Preview Wrapper (for UI) ---
export default function DownloadBarcodePreview(props: DownloadPreviewProps) {
  const { template, docTitle = "Document Preview", data,pages, isMaximized, modalHeight } = props;
  const [barcodeImages, setBarcodeImages] = useState<{ [key: string]: string }>({});
  const [previewHeight, setPreviewHeight] = useState<{ mobile: number; windows: number }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 200;
    let gridHeightWindows = modalHeight - 100;
    setPreviewHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  useEffect(() => {
    const images: { [key: string]: string } = {};
    if (template?.barcodeState?.placedComponents && data) {
      // Generate barcode images for all items including duplicates
      data.forEach((item: any) => {
        const labelCount = item.labelCount || 1;
        template.barcodeState?.placedComponents?.forEach((comp: any) => {
          if (comp.type === DesignerElementType.barcode && comp.barcodeProps) {
            // Generate the same barcode for all copies of this item
            const key = `${item.siNo}-${comp.id}`;
            if (!images[key]) { // Only generate once per unique item-component combination
              images[key] = generateBarcodeDataUrl(
                item.autoBarcode || '',
                comp.barcodeProps,
                comp.width,
                comp.height
              );
            }
          }
        });
      });
    }
    setBarcodeImages(images);
  }, [template?.barcodeState?.placedComponents, data]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {template && (
        <PDFViewer width="100%" height={previewHeight.windows}>
          <BarcodePDFDocument
            template={template}
            data={pages}
            barcodeImages={barcodeImages}
          />
        </PDFViewer>
      )}
    </div>
  );
}