import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { BarcodePreviewProps } from ".";

enum DesignerElementType {
  label = 1,
  barcode = 2,
  field = 3 
}

interface DesignerElement {
  type?: DesignerElementType;
  value?: any;
  top?: number;
  left?: number;
  font?: string;
  size?: number;
  width?: number;
  height?: number;
  barcodeProps?: {
    barWidth?: number;
    height?: number;
    margin?: number;
    background?: string;
    lineColor?: string;
    showText?: boolean;
    textAlign?: string;
    font?: string;
    fontSize?: number;
    textMargin?: number;
    format?: string; // Changed from barcodeType to format
  };
}

const Content = ({ template, data, docTitle, docIDKey, templateGroupId, currency }: BarcodePreviewProps) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;

  // Create an array of refs for multiple barcode canvases
  const barcodeRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const designeritems: DesignerElement[] = [
    {
      type: DesignerElementType.barcode,
      width: 150,
      height: 75,
      top: 0,
      left: 0,
      barcodeProps: {
        barWidth: 2,
        height: 75,
        margin: 16,
        background: "#FFFFFF",
        lineColor: "#000000",
        showText: true,
        textAlign: "center",
        font: "Monospace",
        fontSize: 21,
        textMargin: 5,
        format: "EAN13" // Example format
      }
    },
    // Add more barcode items as needed
    {
      type: DesignerElementType.barcode,
      width: 150,
      height: 75,
      top: 100,
      left: 0,
      barcodeProps: {
        barWidth: 2,
        height: 75,
        margin: 16,
        background: "#FFFFFF",
        lineColor: "#000000",
        showText: true,
        textAlign: "center",
        font: "Monospace",
        fontSize: 21,
        textMargin: 5,
        format: "CODE128" // Another example format
      }
    },
    {
      type: DesignerElementType.label,
      top: 55,
      left: 0,
      value: "MRP:"
    },
    {
      type: DesignerElementType.field,
      width: 150,
      height: 50,
      top: 85,
      left: 50,
      value: data?.amount // Example data field, adjust as necessary
    }
  ];

  useEffect(() => {
    designeritems.forEach((item, index) => {
      if (item.type === DesignerElementType.barcode && barcodeRefs.current[index]) {
        const { barcodeProps } = item;
        JsBarcode(barcodeRefs.current[index], data?.barcodeValues[index] || "123456789012", { // Assuming an array of barcode values
          format: barcodeProps?.format,
          width: barcodeProps?.barWidth,
          height: barcodeProps?.height,
          displayValue: barcodeProps?.showText,
          background: barcodeProps?.background,
          lineColor: barcodeProps?.lineColor,
          margin: barcodeProps?.margin,
          font: barcodeProps?.font,
          fontSize: barcodeProps?.fontSize,
          textMargin: barcodeProps?.textMargin,
          textAlign: barcodeProps?.textAlign
        });
      }
    });
  }, [data?.barcodeValues, designeritems]);

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      {designeritems.map((item, index) => {
        switch (item.type) {
          case DesignerElementType.barcode:
            return (
              <canvas
                key={index}
                ref={el => (barcodeRefs.current[index] = el)}
                width={item.width}
                height={item.height}
                style={{
                  position: 'absolute',
                  top: item.top,
                  left: item.left,
                  background: "none"
                }}
              />
            );
          case DesignerElementType.label:
            return (
              <div key={index} style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                fontSize: item.size || 16,
                fontWeight: 'bold'
              }}>
                {item.value}
              </div>
            );
          case DesignerElementType.field:
            return (
              <div key={index} style={{
                width: item.width,
                height: item.height,
                position: 'absolute',
                top: item.top,
                left: item.left,
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.value}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Content;
