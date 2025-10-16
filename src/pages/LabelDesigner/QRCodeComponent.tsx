import React, { useEffect, useRef } from "react";
import QRCodeStyling, { Options as QROptions } from "qr-code-styling";
import { PlacedComponent, DesignerElementType } from "../InvoiceDesigner/Designer/interfaces";
import { DeleteButton } from "./label_designer";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { ptToPx, pxToPt } from "../InvoiceDesigner/utils/pdf-util";

interface QRCodeComponentProps {
  component: PlacedComponent;
  isSelected: boolean;
  style: React.CSSProperties;
  handleComponentClick: (e: React.MouseEvent, component: PlacedComponent) => void;
  handleMouseDown: (e: React.MouseEvent, component: PlacedComponent) => void;
  handleDelete: (id: string) => void;
  qrCodeRefs:React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  templateData?: any;
  setTemplateData?: (updater: (prev: any) => any) => void;
  selectedComponent?: PlacedComponent | null;
  setSelectedComponent?: (updater: (prev: PlacedComponent | null) => PlacedComponent | null) => void;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  component,
  isSelected,
  style,
  handleComponentClick,
  handleMouseDown,
  handleDelete,
  qrCodeRefs,
  templateData,
  setTemplateData,
  selectedComponent,
  setSelectedComponent,
}) => {
  // 1) Change this ref to point at a DIV, not a CANVAS
  const props = component.qrCodeProps;
  useEffect(() => {
    
    const container = qrCodeRefs.current[component.id];
    if (!container || !props) return;
   
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
    props,
    qrCodeRefs,
  ]);

  // 5) Render a ResizableBox container
 return (
            <ResizableBox
              key={component.id}
              width={ptToPx(props.width)}
              height={ptToPx(props.height)}
              minConstraints={[ptToPx(20), ptToPx(20)]}
              maxConstraints={[ptToPx(800), ptToPx(600)]}
              resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
   
                 onResize={(e, { size }) => {
               const widthPt = pxToPt(size.width);
              const heightPt = pxToPt(size.height);
         if (setTemplateData && templateData) {
          const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp: PlacedComponent) => {
            if (comp.id === component.id) {
              return {
                ...comp,
                qrCodeProps: {
                  ...comp.qrCodeProps,
                  width: widthPt,
                  height:heightPt,
                },
              };
            }
            return comp;
          }) || [];
          setTemplateData((prev: any) => ({
            ...prev,
            barcodeState: {
              ...prev.barcodeState,
              placedComponents: updatedComponents,
            },
          }));
        }
        if (setSelectedComponent && selectedComponent?.id === component.id) {
          setSelectedComponent((prev) => ({
            ...prev!,
            qrCodeProps: {
              ...prev?.qrCodeProps,
              width: widthPt,
              height: heightPt,
              value: prev?.qrCodeProps?.value || "",
            },
          }));
        }
      }}     
  

      style={{
        position: "absolute",
        left: `${component.x}pt`,
        top: `${component.y}pt`,
        transform: `rotate(${component.rotate || 0}deg)`,
        transformOrigin: "center",
        zIndex: 1,
      }}
    >
      <div
        id={`component-${component.id}`}
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          border: isSelected ? "2px solid #2196f3" : "none",
          overflow: "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleComponentClick(e, component);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e, component);
        }}
      >

           <div
             ref={(el) => {
              qrCodeRefs.current[component.id] = el; 
             }}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden", 
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      </div>
      <DeleteButton
        id={component.id}
        isSelected={isSelected}
        handleDelete={handleDelete}
      />
    </ResizableBox>
  );
};
