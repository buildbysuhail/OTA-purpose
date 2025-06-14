// customElement.tsx
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import {
  DesignerElementType,
  PlacedComponent,
  QRCodeProps,
} from "../Designer/interfaces";
import type { Style } from "@react-pdf/types";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createRoot } from "react-dom/client";
const pxToPt = (px: number) => px * (72 / 96);

export const renderComponent = (component: PlacedComponent, data?: any) => {
  const [qrCodeImages, setQrCodeImages] = useState<{ [key: string]: string }>(
    {}
  );

  // Generate QR code image only for QR code components
  useEffect(() => {
    if (
      component.type !== DesignerElementType.qrCode ||
      qrCodeImages[component.id]
    ) {
      return; // Skip if not a QR code or image already generated
    }

    const generateQRCodeImage = async () => {
      try {
        const qrCodeProps = component.qrCodeProps as QRCodeProps;
        const imageData = await convertQRToImage({
          value: qrCodeProps.value || "",
          size: component.width || 128,
          level: qrCodeProps.level || "L",
          marginSize: qrCodeProps?.marginSize || 1,
          bgColor: qrCodeProps.bgColor || "#FFFFFF",
          fgColor: qrCodeProps.fgColor || "#000000",
          imageSettings: qrCodeProps?.imageSettings,
        });
        setQrCodeImages((prev) => ({ ...prev, [component.id]: imageData }));
      } catch (error) {
        console.error(
          `Failed to generate QR code for component ${component.id}:`,
          error
        );
        setQrCodeImages((prev) => ({ ...prev, [component.id]: "" })); // Empty string as fallback
      }
    };

    generateQRCodeImage();
  }, [component]);

  // Convert QR code to image
  const convertQRToImage = async (qrProps: any): Promise<string> => {
    // Create a temporary div to render the QR code
    const tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);

    // Render the QR code SVG
    const qrElement = (
      <QRCodeSVG
        value={qrProps.value || ""}
        size={qrProps.size || 128}
        level={qrProps.level || "L"}
        marginSize={qrProps.marginSize || 1}
        bgColor={qrProps.bgColor || "#FFFFFF"}
        fgColor={qrProps.fgColor || "#000000"}
      />
    );

    // Create root and render
    const root = createRoot(tempDiv);
    root.render(qrElement);

    // Convert SVG to canvas
    const svgElement = tempDiv.querySelector("svg");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (svgElement && ctx) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      // Use HTMLImageElement explicitly
      const img = new window.Image();

      return new Promise<string>((resolve) => {
        img.onload = () => {
          canvas.width = qrProps.size || 128;
          canvas.height = qrProps.size || 128;
          ctx.drawImage(img as CanvasImageSource, 0, 0);
          const pngData = canvas.toDataURL("image/png");
          // Clean up
          root.unmount();
          document.body.removeChild(tempDiv);
          resolve(pngData);
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      });
    }

    // Clean up if we didn't create an image
    root.unmount();
    document.body.removeChild(tempDiv);
    return "";
  };

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
      return qrCodeImages[component.id] ? (
        <View key={component.id} style={baseStyle}>
          <Image
            src={qrCodeImages[component.id]}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      ) : null;

    default:
      console.warn(`Unsupported component type: ${component.type}`);
      return null;
  }
};
