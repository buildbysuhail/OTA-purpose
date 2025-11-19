import React, { CSSProperties } from "react";
import {
  DesignerElementType,
  PlacedComponent,
} from "../Designer/interfaces";
import { bindDataForPrint } from "../../use-print";
import { containsArabicString,  } from "../utils/pdf-util";

interface Props {
  component: PlacedComponent;
  data?: any;
  qrCodeImages?: { [key: string]: string };
  convertAmountToEnglish: any;
  convertAmountToArabic: any;
}

export const RenderPreviewComponent: React.FC<Props> = ({
  component,
  data,
  qrCodeImages,
  convertAmountToEnglish,
  convertAmountToArabic
}) => {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${component.x}pt`,
    top: `${component.y}pt`,
    transform: `rotate(${component.rotate || 0}deg)`,
    height: `${component.height || 50}pt`,  
    width: `${component.width || 50}pt`, 
    zIndex:  component.containerId ? 10 : 1,
    boxSizing: "border-box", 
  };
  
  // Calculate dynamic height for containers
  const calculateContainerHeight = () => {
    if (component.type !== DesignerElementType.container || !component.containerProps?.autoResize || !component.children?.length) {
      return component.height;
    }
    
    let maxBottom = 0;
    component.children.forEach(child => {
      const childBottom = child.y + child.height;
      if (childBottom > maxBottom) {
        maxBottom = childBottom;
      }
    });
    
    const padding = component.containerProps.padding || 0;
    const calculatedHeight = maxBottom + padding ;
    const minHeight = component.containerProps.minHeight || 50;
    const maxHeight = component.containerProps.maxHeight || 500;
    
    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  };

  switch (component.type) {
     case DesignerElementType.text:
     case DesignerElementType.field:

    const finalContent = 
      component.type === DesignerElementType.text 
        ? component.content 
        : (bindDataForPrint(component.content, data,component.format, convertAmountToEnglish, convertAmountToArabic) );

    const isArabic = containsArabicString(finalContent ?? "");
    const textDirection =  component.direction ?? isArabic ? "rtl" : "ltr";

              return (
              <div
              key={component.id}
                style={{
                  ...baseStyle,
                  boxSizing: "border-box",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
            <span
          style={{
            display: "flex",           
            flexDirection: "column",
            width: "100%",
            height: "100%",   
            // ---------- Vertical Alignment ----------
            justifyContent:
              component.verticalAlign === "middle"
                ? "center"
                : component.verticalAlign === "bottom"
                ? "flex-end"
                : "flex-start",

            // // ---------- Horizontal Alignment (RTL aware) ----------
            alignItems:
              component.textAlign === "center"
                ? "center"
                : component.textAlign === "left"
                ? "flex-start"
                : "flex-end",

            textAlign: component.textAlign ?? "left",
            
            // ---------- Typography ----------
            fontFamily: isArabic
              ? component?.arabicFont ?? "Amiri"
              : component?.font ?? "Roboto",

            fontSize: `${component.fontSize || 12}pt`,
            fontWeight: component.fontWeight ?? "400",
            fontStyle: component.fontStyle || "normal",
            color: `rgb(${component.fontColor || "0,0,0"})`,

       // ✅ Critical: prevent text overflow issues
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
          }}
        >
          {finalContent}
        </span>

              </div>
          );



    case DesignerElementType.image:
      const imgUrl = component?.imgFromDevice ?component.content : bindDataForPrint(component.content, data);
      return (
        <div key={component.id} style={baseStyle}>
          {imgUrl &&(
          <img
            src={imgUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit:
                (component.imgFit as CSSProperties["objectFit"]) || "contain",
              objectPosition: component.imgPosition || "center",
            }}
          />
          )}

        </div>
      );


    case DesignerElementType.line:
      return (
        <div
          key={component.id}
          style={{
            ...baseStyle,
            height: 0, 
            width: component.lineWidth
              ? `${component.lineWidth}pt`
              : "100%",
            borderTop: `${component?.lineThickness || 1}pt ${
              component?.lineType || "solid"
            } ${component?.lineColor || "black"}`,
          }}
        />
      );

    case DesignerElementType.qrCode:
  const wPx = component.qrCodeProps?.width  || 128;
  const hPx = component.qrCodeProps?.height || 128;

      return qrCodeImages?.[component.id] ? (
        <div
          key={component.id}
          style={{
            ...baseStyle,
            width: `${wPx}pt`,
           height: `${hPx}pt`,
          }}
        >
          <img
            src={qrCodeImages[component.id]}
            alt="qr-code"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ) : null;

  

  case DesignerElementType.container:
  const containerHeight = calculateContainerHeight();
  const containerChildren = component.children || [];
  const containerProps = component.containerProps || {
    backgroundColor: "#fafafa",
    borderColor: "#d0d0d0",
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 0,
    autoResize: false,
    minHeight: 100,
    maxHeight: 500,
    borderRound: 0,
  };

  return (
    <div
      key={component.id}
      style={{
        position: "absolute",
        left: `${component.x}pt`,
        top: `${component.y}pt`,
        height:`${containerHeight}pt`,
        width:`${component.width}pt`,
        backgroundColor: containerProps.backgroundColor,
            borderWidth: `${containerProps.borderWidth || 1}pt`, // FIXED: Explicit border properties
            borderStyle: (containerProps.borderStyle || "solid") as CSSProperties["borderStyle"],
            borderColor: containerProps.borderColor || "#d0d0d0",
        padding: `${containerProps.padding}pt`,
        boxSizing: "border-box",
        transform: `rotate(${component.rotate || 0}deg)`,
        overflow: containerProps.autoResize ? "visible" : "hidden",
        borderRadius: `${containerProps?.borderRound || 1}pt`
      }}
    >
      {containerChildren.map((child) => (
        <RenderPreviewComponent
          key={child.id}
          component={{
            ...child,
            containerId: component.id,
          }}
          data={data}
          qrCodeImages={qrCodeImages}
          convertAmountToEnglish={convertAmountToEnglish}
          convertAmountToArabic={convertAmountToArabic}
        />
      ))}
    </div>
  );
    default:
      console.warn(`Unsupported component type: ${component.type}`);
      return null;
  }
};
