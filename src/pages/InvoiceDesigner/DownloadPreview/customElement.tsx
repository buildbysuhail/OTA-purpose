import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { DesignerElementType, PlacedComponent } from "../Designer/interfaces";
import { bindDataForPrint } from "../../use-print";

interface Props {
  component: PlacedComponent;
  data?: any;
  qrCodeImages?: { [key: string]: string };
  convertAmountToEnglish: any;
  convertAmountToArabic: any;
}

const pxToPt = (px: number) => px * (72 / 96);

export const RenderComponentPDF: React.FC<Props> = ({
  component,
  data,
  qrCodeImages,
  convertAmountToEnglish,
  convertAmountToArabic,
}) => {

  const baseStyle = {
    position: "absolute" as const,
    left: component.x,
    top: component.y,
    height: component.height || 50,
    width: component.width || 50,
    transform: component.rotate ? `rotate(${component.rotate}deg)` : undefined,
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
  const textContent =
  component.type === DesignerElementType.text
    ? component.content
    : bindDataForPrint(component.content, data, convertAmountToEnglish, convertAmountToArabic) || "N/A";

const isArabicText = typeof textContent === "string" && /[\u0600-\u06FF]/.test(textContent);

      return (
        <View style={{ ...baseStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: isArabicText ? "Amiri" : (component.font || "Helvetica"),
              fontSize: component.fontSize || 12,
              fontWeight: component.fontWeight || "normal",
              color: component.fontColor ? `rgb(${component.fontColor})` : "black",
              textAlign: component.textAlign || "center",
              direction: isArabicText ? "rtl" : "ltr",
            }}
          >
            {textContent}
          </Text>
        </View>
      );

    case DesignerElementType.image:
      return (
        <View style={baseStyle}>
          <Image
            src={component.content}
            style={{
              width: "100%",
              height: "100%",
              objectFit: component.imgFit || "contain",
            }}
          />
        </View>
      );

    case DesignerElementType.line:
      return (
        <View
          style={{
            ...baseStyle,
            borderTop: `${component.lineThickness || 1}pt ${component.lineType || "solid"} ${component.lineColor || "black"}`,
            width: component.lineWidth || component.width || "100%",
          }}
        />
      );

    case DesignerElementType.qrCode:
      const wPt = pxToPt(component.qrCodeProps?.width || 128);
      const hPt = pxToPt(component.qrCodeProps?.height || 128);
      return qrCodeImages?.[component.id] ? (
        <View style={{ ...baseStyle, width: wPt, height: hPt }}>
          <Image src={qrCodeImages[component.id]} style={{ width: "100%", height: "100%" }} />
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
            borderStyle: (containerProps.borderStyle === "none" ? "none" : containerProps.borderStyle) as
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
              data={data}
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
