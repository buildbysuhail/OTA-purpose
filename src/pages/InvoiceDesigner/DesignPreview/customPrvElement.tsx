import React, { CSSProperties } from "react";
import {
  DesignerElementType,
  PlacedComponent,
} from "../Designer/interfaces";
import { bindDataForPrint } from "../../use-print";

interface Props {
  component: PlacedComponent;
  data?: any;
  qrCodeImages?: { [key: string]: string };
  convertAmountToEnglish: any;
  convertAmountToArabic: any;
}

const pxToPt = (px: number) => px * (72 / 96);


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
      return (
        <div key={component.id} style={baseStyle}>
          <p
            style={{
              fontFamily: component.font || "Roboto, sans-serif",
              fontSize: `${component.fontSize || 12}pt`,
              fontStyle: component.fontStyle || "normal",
              textAlign: (component.textAlign as any) || "center",
              
              margin: 0,
             
               whiteSpace: "pre-wrap",
            }}
          >
            {component.content}
          </p>
        </div>
      );

    case DesignerElementType.image:
      return (
        <div key={component.id} style={baseStyle}>
          <img
            src={component.content}
            alt="dynamic"
            style={{
              width: "100%",
              height: "100%",
              objectFit:
                (component.imgFit as CSSProperties["objectFit"]) || "contain",
              objectPosition: component.imgPosition || "center",
            }}
          />
        </div>
      );

    case DesignerElementType.field:
      return (
        <div key={component.id} style={baseStyle}>
          <p
            style={{
              fontFamily: component.font || "Roboto, sans-serif",
              fontSize: `${component.fontSize || 12}pt`,
              fontStyle: component.fontStyle || "normal",
              textAlign: (component.textAlign as any) || "center",
              minHeight: `${component.height || 50}pt`,
              width: `${component.width || 50}pt`,
              margin: 0,
       
            }}
          >
            {bindDataForPrint(component.content, data,convertAmountToEnglish,convertAmountToArabic)|| "N\A"} 
          </p>
        </div>
      );

    case DesignerElementType.line:
      return (
        <div
          key={component.id}
          style={{
            ...baseStyle,
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
            width:  `${pxToPt(wPx)}`,
           height:`${pxToPt(hPx)}` ,
          }}
        >
          <img
            src={qrCodeImages[component.id]}
            alt="qr-code"
            style={{
              width: "100%",
              height: "100%",
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
  };

  return (
    <div
      key={component.id}
      style={{
        position: "relative",
        left: `${component.x}pt`,
        top: `${component.y}pt`,
        width: component.width,
        height: containerHeight,
        backgroundColor: containerProps.backgroundColor,
        border: `${containerProps.borderWidth}pt ${containerProps.borderStyle} ${containerProps.borderColor}`,
        padding: `${containerProps.padding}pt`,
        boxSizing: "border-box",
        transform: `rotate(${component.rotate || 0}deg)`,
         overflow: containerProps.autoResize ? "visible" : "hidden",
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
