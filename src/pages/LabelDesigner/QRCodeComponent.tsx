import React, { useEffect, useRef } from "react";
import QRCodeStyling, { Options as QROptions } from "qr-code-styling";
import { PlacedComponent, DesignerElementType } from "../InvoiceDesigner/Designer/interfaces";
import { DeleteButton } from "./label_designer";

interface QRCodeComponentProps {
  component: PlacedComponent;
  isSelected: boolean;
  style: React.CSSProperties;
  handleComponentClick: (component: PlacedComponent) => void;
  handleMouseDown: (e: React.MouseEvent, component: PlacedComponent) => void;
  handleDelete: (id: number) => void;
  qrCodeRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  component,
  isSelected,
  style,
  handleComponentClick,
  handleMouseDown,
  handleDelete,
  qrCodeRefs,
}) => {
  // 1) Change this ref to point at a DIV, not a CANVAS
  const containerRef = (el: HTMLDivElement | null) => {
    qrCodeRefs.current[component.id] = el;
  };
  const props = component.qrCodeProps;
  useEffect(() => {
    
    const container = qrCodeRefs.current[component.id];
    if (!container || !component.qrCodeProps) return;
   
      const qrCode = new QRCodeStyling({
      width: props.width ||128,
      height: props.height || 128,
      data: props.value || "https://example.com",
      type: props.type || "svg",
      margin: props.margin ?? 0,
      qrOptions: {
        errorCorrectionLevel: props.level || "M",
      },
      image: props.image ?props.image :undefined,
      imageOptions: props.imageOptions
        ? {
            crossOrigin: props.imageOptions.crossOrigin || "anonymous",
            hideBackgroundDots: props.imageOptions.hideBackgroundDots,
            imageSize: props.imageOptions.imageSize,
            margin: props.imageOptions.margin,
          }
        : undefined,
      backgroundOptions: props.backgroundOptions
        ? {
            color: props.backgroundOptions.color,
            gradient: props.backgroundOptions.gradient,
          }
        : undefined,
      dotsOptions: props.dotsOptions
        ? {
            color: props.dotsOptions.color,
            gradient: props.dotsOptions.gradient,
            type: props.dotsOptions.type,
          }
        : undefined,
      cornersSquareOptions: props.cornersSquareOptions
        ? {
            color: props.cornersSquareOptions.color,
            gradient: props.cornersSquareOptions.gradient,
            type: props.cornersSquareOptions.type,
          }
        : undefined,
      cornersDotOptions: props.cornersDotOptions
        ? {
            color: props.cornersDotOptions.color,
            gradient: props.cornersDotOptions.gradient,
            type: props.cornersDotOptions.type,
          }
        : undefined,
    } as QROptions);

    // 3) Mount it into the DIV
    container.innerHTML = "";
    qrCode.append(container);

    // 4) Cleanup if this component unmounts or updates
    return () => {
      container.innerHTML = "";
    };
  }, [
    component.id,
    component.qrCodeProps,
    qrCodeRefs,
  ]);

  // 5) Render a DIV container instead of a canvas tag
 return (
    <div
      id={`component-${component.id}`}
      style={{
        ...style,
        boxSizing: "border-box", // Ensure padding and border are included in width/height
        height: (component.qrCodeProps?.height || 128),
        width: (component.qrCodeProps?.width || 128) ,
        border: isSelected ? "2px solid #2196f3" : "none",
        zIndex: 1, // Ensure parent is above other elements
      }}
      onClick={() => handleComponentClick(component)}
      onMouseDown={(e) => handleMouseDown(e, component)}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden", 
          zIndex: 2, 
        }}
      />
      <DeleteButton
        id={component.id}
        isSelected={isSelected}
        handleDelete={handleDelete}
      />
    </div>
  );
};
