import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { DesignerElementType, PlacedComponent } from "../Designer/interfaces";
import { bindDataForPrint } from "../../use-print";
import { containsArabicString } from "../utils/pdf-util";
import { Height, Width } from "devextreme-react/cjs/chart";

interface Props {
  component: PlacedComponent;
  data?: any;
  qrCodeImages?: { [key: string]: string };
  convertAmountToEnglish: any;
  convertAmountToArabic: any;
}

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
    maxHeight: component.height| 50, 
    width: component.width || 50,
    maxWidth: component.width| 50,     
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

  const finalText =
    component.type === DesignerElementType.text
      ? component.content
      : bindDataForPrint(
          component.content,
          data,
          component.format,
          convertAmountToEnglish,
          convertAmountToArabic
        );

  const isArabic = typeof finalText === "string" && containsArabicString(finalText);

  return (
    <View
      key={component.id}
      style={{
        ...baseStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      <Text
        wrap
        style={{
          height:"100%",
          maxHeight:"100%",
          margin: 0,
          padding: 0,
          fontFamily: isArabic
            ? component?.arabicFont ?? "Amiri"
            : component?.font ?? "Roboto",

          fontSize: component.fontSize || 12,
          lineHeight: 1.2,

          fontWeight: component.fontWeight || "normal",

          color: component.fontColor ? `rgb(${component.fontColor})` : "black",

          textAlign: component.textAlign || "center",
          verticalAlign:"sub"
        }}
      >
        {finalText}
      </Text>
    </View>
  );  
    case DesignerElementType.image:
      const imgUrl = component?.imgFromDevice ?component.content : bindDataForPrint(component.content, data);
      return (
        <View style={baseStyle}>
          {/* <Image
            src={imgUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: component.imgFit || "contain",
            }}
          /> */}
             {imgUrl ? (
      <Image
        src={imgUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: component.imgFit || "contain",
        }}
      />
    ) : (
        <Text style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
        }}>
          |{"Image not available"}
        </Text>
      
    )}
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
