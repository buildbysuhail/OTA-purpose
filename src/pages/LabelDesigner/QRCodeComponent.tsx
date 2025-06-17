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

  useEffect(() => {
    debugger;
    const container = qrCodeRefs.current[component.id];
    if (!container || !component.qrCodeProps) return;

    const qrCode = new QRCodeStyling({
      width: component.qrCodeProps.size || 128,
      height: component.qrCodeProps.size || 128,
      margin: component.qrCodeProps.marginSize || 0,
      type: "svg",               // canvas output
      data: component.qrCodeProps.value || "https://example.com",
      qrOptions: {
        errorCorrectionLevel: component.qrCodeProps.level || "M",
        
      },
      dotsOptions: {
        color: component.qrCodeProps.fgColor || "#000000",
        type: "square",
      },
      backgroundOptions: {
        color: component.qrCodeProps.bgColor || "#FFFFFF",
      },
      
      imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: component.qrCodeProps.imageSettings?.excavate ?? true,
        imageSize: 0.2,
        margin:10
        // imageSize:
        //   (component.qrCodeProps.imageSettings?.width || 16) /
        //   (component.qrCodeProps.size || 128)    
      },
         image:component.qrCodeProps.imageSettings?.src,
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
        height: component.qrCodeProps?.size || 128,
        width: component.qrCodeProps?.size || 128,
        border: isSelected ? "2px solid #2196f3" : "none",
      }}
      onClick={() => handleComponentClick(component)}
      onMouseDown={(e) => handleMouseDown(e, component)}
    >
      <div ref={containerRef} />
      <DeleteButton id={component.id} isSelected={isSelected} handleDelete={handleDelete} />
    </div>
  );
};
