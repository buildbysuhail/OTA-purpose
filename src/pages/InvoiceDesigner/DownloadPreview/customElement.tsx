// customElement.tsx
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import {
  DesignerElementType,
  PlacedComponent,
  QRCodeProps,
} from "../Designer/interfaces";
import type { Style } from "@react-pdf/types";

const pxToPt = (px: number) => px * (72 / 96);

export const renderComponent = (component: PlacedComponent, data?: any,qrCodeImages?: { [key: string]: string }) => {


  const baseStyle: Style = {
    position: "absolute",
    left: component.x,
    top: component.y,
    transform: `rotate(${component.rotate || 0}deg)`,
    transformOrigin: "center",
    height: component.height || 50,
    width: component.width || 50,
  };

  switch (component.type) {
    case DesignerElementType.text:
      return (
        <View key={component.id} style={{ ...baseStyle }}>
          <Text
            key={component.id}
            style={{
              fontFamily: component.font || "Roboto",
              fontSize: component.fontSize || 12,
              fontStyle: component.fontStyle || "normal",
              textAlign: component.textAlign || "center",
            }}
          >
            {component.content}
          </Text>
        </View>
      );
    case DesignerElementType.image:
      return (
        <View key={component.id} style={{ ...baseStyle }}>
          {component.imgFromDevice ? (
            <Image
              key={component.id}
              src={component.content}
              style={{
                width: "100%",
                height: "100%",
                objectFit: component.imgFit,
                objectPosition: component.imgPosition,
              }}
            />
          ) : (
            <Image
              key={component.id}
              src={component.content}
              style={{
                width: "100%",
                height: "100%",
                objectFit: component.imgFit,
                objectPosition: component.imgPosition,
              }}
            />
          )}
        </View>
      );
    case DesignerElementType.field:
      return (
        <View key={component.id} style={baseStyle}>
          <Text
            style={{
              fontFamily: component.font || "Roboto",
              fontSize: component.fontSize || 12,
              fontStyle: component.fontStyle || "normal",
              textAlign: component.textAlign || "center",
              minHeight: component.height || 50,
              height: "auto",
              width: component.width || 50,
            }}
          >
            {data[component.content] || "N/A"}
          </Text>
        </View>
      );

    case DesignerElementType.line:
      return (
        <View
          key={component.id}
          style={{
            ...baseStyle,
            width: component.lineWidth ?? "100%",
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
    <View
      key={component.id}
      style={{
        ...baseStyle,
        // convert px → pt here:
        width:  pxToPt(wPx),
        height: pxToPt(hPx),
      }}
    >
      <Image
        src={qrCodeImages[component.id]}
        // and again on the Image itself:
        style={{
          width:  pxToPt(wPx),
          height: pxToPt(hPx),
        }}
      />
    </View>
  ) : null;

    default:
      console.warn(`Unsupported component type: ${component.type}`);
      return null;
  }
};
