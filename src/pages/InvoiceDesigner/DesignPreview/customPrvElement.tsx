import React, { CSSProperties } from "react";
import {
  DesignerElementType,
  PlacedComponent,
} from "../Designer/interfaces";
import { bindDataForPrint } from "../../../utilities/Utils";

interface Props {
  component: PlacedComponent;
  data?: any;
  qrCodeImages?: { [key: string]: string };
  bindData?: any;
  userSession?: any;
  currentBranch?: any;
  convertAmountToEnglish: any;
  convertAmountToArabic: any;
}

const pxToPt = (px: number) => px * (72 / 96);


export const RenderPreviewComponent: React.FC<Props> = ({
  component,
  data,
  qrCodeImages,
  userSession,
  currentBranch,
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
            {bindDataForPrint(component.content, data?.master, data?.details, data?.details,userSession,convertAmountToEnglish,convertAmountToArabic)}
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

    default:
      console.warn(`Unsupported component type: ${component.type}`);
      return null;
  }
};
