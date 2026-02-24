import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { DesignerElementType, PlacedComponent } from "../Designer/interfaces";
import { bindDataForPrint } from "../../use-print";
import { containsArabicString } from "../utils/pdf-util";
import { Height, Width } from "devextreme-react/cjs/chart";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { PrintData } from "../../use-print-type";

interface Props {
  component: PlacedComponent;
  printData: PrintData;
  qrCodeImages?: { [key: string]: string };
  convertAmountToEnglish: any;
  convertAmountToArabic: any;
}

export const RenderComponentPDF: React.FC<Props> = ({
  component,
  printData,
  qrCodeImages,
  convertAmountToEnglish,
  convertAmountToArabic,
}) => {

  const baseStyle = {
    position: "absolute" as const,
    left: component.x,
    top: component.y,
    height: component.height || 50,
    maxHeight: component.height|| 50, 
    width: component.width || 50,
    maxWidth: component.width|| 50,     
    transform: component.rotate ? `rotate(${component.rotate}deg)` : undefined,
  };

const FONT_CONFIG: Record<string, { baselineOffset: number; lineHeight: number }> = {
  // Arabic Fonts
  "Amiri": { 
    baselineOffset: 2, 
    lineHeight: 1.0  // Tighter for Arabic
  },
  "NotoNaskhArabic": { 
    baselineOffset: 2.5, 
    lineHeight: 1.0 
  },
  
  // English Fonts
  "Roboto": { 
    baselineOffset: 0, 
    lineHeight: 1.2 
  },
  "RobotoMono": { 
    baselineOffset: 0, 
    lineHeight: 1.2 
  },
  "FiraSans": { 
    baselineOffset: 0, 
    lineHeight: 1.2 
  },
  "Poppins": { 
    baselineOffset: 0, 
    lineHeight: 1.2 
  },
};
const DEFAULT_FONT_CONFIG = { 
  baselineOffset: 0, 
  lineHeight: 1.2 
};
  // Calculate container height if needed
  const calculateContainerHeight = () => {
    if (component.type !== DesignerElementType.container || !component.containerProps?.autoResize || !component.children?.length) {
      return component.height;
    }
    let maxBottom = 0;
    component.children.forEach(child => {
      const childBottom = child.y + child.height;
      if (childBottom > maxBottom) maxBottom = childBottom;
    });
    const padding = component.containerProps?.padding || 0;
    const minHeight = component.containerProps?.minHeight || 50;
    const maxHeight = component.containerProps?.maxHeight || 500;
    return Math.min(Math.max(maxBottom + padding, minHeight), maxHeight);
  };

  switch (component.type) {
  
  case DesignerElementType.text:
  case DesignerElementType.field:

  const finalText =
    component.type === DesignerElementType.text
      ? component.content
      : bindDataForPrint(
          component.content,
          printData,
          component.format,
          convertAmountToEnglish,
          convertAmountToArabic
        );

  const isArabic = typeof finalText === "string" && containsArabicString(finalText);
  const fontFamily = isArabic 
    ? (component?.arabicFont ?? "Amiri")
    : (component?.font ?? "Roboto");
      // ✅ Get font-specific configuration
  const fontConfig = FONT_CONFIG[fontFamily] || DEFAULT_FONT_CONFIG;
          return (
        <View
          style={{
            ...baseStyle,
            top:  component.y - fontConfig.baselineOffset,
            display: "flex",
            flexDirection: "column",

            justifyContent:
              component.verticalAlign === "middle"
                ? "center"
                : component.verticalAlign === "bottom"
                ? "flex-end"
                : "flex-start",

            alignItems:
              component.textAlign === "center"
                ? "center"
                : component.textAlign === "right"
                ? "flex-end"
                : "flex-start",

            overflow: "hidden",
          }}
        >
          <Text
            style={{
              textAlign: component.textAlign || "left",
              fontFamily: fontFamily,
              fontSize: component.fontSize || 12,
              fontWeight: component.fontWeight ?? "normal",
              fontStyle: component.fontStyle || "normal",
              color: `rgb(${component.fontColor || "0,0,0"})`,
              lineHeight:  fontConfig.lineHeight,
              maxWidth:"100%",
             
            }}
          >
            {finalText}
          </Text>
        </View>

  );  
    case DesignerElementType.image:
      const imgUrl = component?.imgFromDevice ?component.content : bindDataForPrint(component?.content, printData);
      return (
        
      <View style={baseStyle}>     
      { !isNullOrUndefinedOrEmpty(imgUrl) &&
      <Image
        src={imgUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: component.imgFit || "contain",
        }}
      />
  }
        </View>
      );

    case DesignerElementType.line:
      return (
        <View
          style={{
            ...baseStyle,
            borderTop: `${component.lineThickness || 1}pt ${component.lineType || "solid"} ${component.lineColor || "black"}`,
            width: component.lineWidth || component.width || "100%",
            height: 0, 
          }}
        />
      );

    case DesignerElementType.qrCode:
      const wPt = component.qrCodeProps?.width || 128;
      const hPt = component.qrCodeProps?.height || 128;
      return qrCodeImages?.[component.id] ? (
        <View style={{ ...baseStyle, width: wPt, height: hPt,maxHeight:hPt }}>
          <Image src={qrCodeImages[component.id]} style={{  width: wPt, height: hPt }} />
        </View>
      ) : null;

    case DesignerElementType.container:
      const containerHeight = calculateContainerHeight();
      const containerChildren = component.children || [];
      const containerProps = component.containerProps || {};
      return (
        <View
          style={{
            ...baseStyle,
            height: containerHeight,
            backgroundColor: containerProps.backgroundColor || "#fafafa",
            borderColor: containerProps.borderColor || "#d0d0d0",
            borderWidth: containerProps.borderWidth || 1,
            borderStyle: (containerProps.borderStyle === "none" ? "none" : containerProps.borderStyle || "solid") as
            | "solid"
            | "dotted"
            | "dashed",
            padding: containerProps.padding || 0,
            borderRadius: containerProps.borderRound || 0,
    
          }}
        >
          {containerChildren.map((child) => (
            <RenderComponentPDF
              key={child.id}
              component={{ ...child, containerId: component.id }}
              printData={printData}
              qrCodeImages={qrCodeImages}
              convertAmountToEnglish={convertAmountToEnglish}
              convertAmountToArabic={convertAmountToArabic}
            />
          ))}
        </View>
      );

    default:
      console.warn(`Unsupported component type: ${component.type}`);
      return null;
  }
};
